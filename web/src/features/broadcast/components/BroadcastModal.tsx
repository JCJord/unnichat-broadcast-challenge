import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Send, Clock } from 'lucide-react';
import { Broadcast, Contact } from '@/types';
import { useToast } from '@/core/feedback';
import { parseAppError } from '@/core/errors';
import { Modal, Button } from '@/shared/components/ui';
import { broadcastSchema, BroadcastFormData } from '../schemas/broadcastSchema';
import { ContactSelector } from './ContactSelector';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    message: string;
    contactIds: string[];
    mode: 'now' | 'scheduled';
    scheduledForDate?: Date;
  }) => Promise<void>;
  contacts: Contact[];
  initialData?: Broadcast | null;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contacts,
  initialData,
}) => {
  const toast = useToast();
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BroadcastFormData>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      message: '',
      contactIds: [],
      mode: 'now',
      scheduledFor: null,
    },
  });

  const selectedMode = watch('mode');
  const messageValue = watch('message') || '';

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          message: initialData.message,
          contactIds: initialData.contactIds || [],
          mode: 'scheduled',
          scheduledFor: initialData.scheduledFor ? initialData.scheduledFor.toDate() : null,
        });
      } else {
        reset({
          message: '',
          contactIds: [],
          mode: 'now',
          scheduledFor: null,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: BroadcastFormData) => {
    try {
      const scheduledDate =
        data.mode === 'scheduled' && data.scheduledFor
          ? data.scheduledFor
          : undefined;

      await onSubmit({
        message: data.message,
        contactIds: data.contactIds,
        mode: data.mode,
        scheduledForDate: scheduledDate,
      });

      onClose();
    } catch (err) {
      toast.error(parseAppError(err, 'Não foi possível salvar o broadcast.'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Broadcast Agendado' : 'Novo Broadcast'}
      description={
        isEditing
          ? 'Atualize a mensagem, destinatários ou o horário de agendamento.'
          : 'Envie uma mensagem em massa ou agende o disparo para seus contatos.'
      }
      maxWidth="md"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="broadcast-form" isLoading={isSubmitting}>
            {isEditing
              ? 'Salvar Alterações'
              : selectedMode === 'scheduled'
              ? 'Agendar Disparo'
              : 'Enviar Agora'}
          </Button>
        </>
      }
    >
      <form
        id="broadcast-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-5 pt-1"
      >
        {!isEditing && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text-secondary">Modo de Envio</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedMode === 'now'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-dark-border bg-dark-bg/60 text-text-secondary hover:border-dark-border-light'
                }`}
              >
                <input
                  type="radio"
                  value="now"
                  className="sr-only"
                  {...register('mode')}
                />
                <Send className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Enviar Agora</span>
              </label>

              <label
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedMode === 'scheduled'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-dark-border bg-dark-bg/60 text-text-secondary hover:border-dark-border-light'
                }`}
              >
                <input
                  type="radio"
                  value="scheduled"
                  className="sr-only"
                  {...register('mode')}
                />
                <Clock className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Agendar Disparo</span>
              </label>
            </div>
          </div>
        )}

        {selectedMode === 'scheduled' && (
          <div className="flex flex-col gap-1.5">
            <Controller
              name="scheduledFor"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Data e Hora do Disparo"
                  value={field.value}
                  onChange={field.onChange}
                  minDateTime={new Date()}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      error: Boolean(errors.scheduledFor),
                      helperText: errors.scheduledFor?.message,
                    },
                  }}
                />
              )}
            />
            <span className="text-xs text-text-muted">
              A mensagem será processada automaticamente pela Cloud Function no minuto agendado.
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-text-secondary">Mensagem</label>
            <span className="text-text-muted">{messageValue.length} / 1000</span>
          </div>
          <textarea
            rows={4}
            placeholder="Digite o conteúdo da mensagem que será disparada..."
            className={`w-full rounded-xl bg-dark-bg border p-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors resize-none ${
              errors.message
                ? 'border-status-error focus:border-status-error'
                : 'border-dark-border focus:border-primary'
            }`}
            {...register('message')}
          />
          {errors.message && (
            <span className="text-xs text-status-error">{errors.message.message}</span>
          )}
        </div>

        <Controller
          name="contactIds"
          control={control}
          render={({ field }) => (
            <ContactSelector
              contacts={contacts}
              selectedContactIds={field.value}
              onChange={field.onChange}
              error={errors.contactIds?.message}
            />
          )}
        />
      </form>
    </Modal>
  );
};
