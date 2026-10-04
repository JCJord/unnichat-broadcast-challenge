import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Connection } from '@/types';
import { useToast } from '@/core/feedback';
import { parseAppError } from '@/core/errors';
import { Modal, Input, Button } from '@/shared/components/ui';
import { connectionSchema, ConnectionFormData } from '../schemas/connectionSchema';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  initialData?: Connection | null;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const toast = useToast();
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (isOpen) reset({ name: initialData?.name ?? '' });
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async ({ name }: ConnectionFormData) => {
    try {
      await onSubmit(name);
      onClose();
    } catch (err) {
      toast.error(parseAppError(err, 'Não foi possível salvar a conexão. Tente novamente.'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Conexão' : 'Nova Conexão'}
      description={
        isEditing
          ? 'Atualize as informações da conexão selecionada.'
          : 'Cadastre uma nova conexão para gerenciar contatos e disparos.'
      }
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="connection-form" isLoading={isSubmitting}>
            {isEditing ? 'Salvar Alterações' : 'Criar Conexão'}
          </Button>
        </>
      }
    >
      <form
        id="connection-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-y-4 pt-1"
      >

        <Input
          label="Nome da Conexão"
          placeholder="Ex: WhatsApp Comercial"
          autoFocus
          error={errors.name?.message}
          {...register('name')}
        />
      </form>
    </Modal>
  );
};
