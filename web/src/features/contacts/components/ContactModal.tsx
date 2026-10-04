import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Contact } from '@/types';
import { Modal, Input, Button } from '@/shared/components/ui';
import { contactSchema, ContactFormData } from '../schemas/contactSchema';
import { formatPhone } from '../utils/phone';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
  initialData?: Contact | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name ?? '',
        phone: initialData?.phone ? formatPhone(initialData.phone) : '',
      });
    }
  }, [isOpen, initialData, reset]);

  const handleClose = () => {
    setSubmitError(null);
    onClose();
  };

  const phoneRegistration = register('phone');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatPhone(e.target.value);
    phoneRegistration.onChange(e);
  };

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      setSubmitError(null);
      await onSubmit(data);
      handleClose();
    } catch {
      setSubmitError('Não foi possível salvar o contato. Tente novamente.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Editar Contato' : 'Novo Contato'}
      description={
        isEditing
          ? 'Atualize as informações do contato.'
          : 'Preencha os dados para adicionar um novo contato a esta conexão.'
      }
      footer={
        <>
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="contact-form" isLoading={isSubmitting}>
            {isEditing ? 'Salvar Alterações' : 'Adicionar Contato'}
          </Button>
        </>
      }
    >
      <form
        id="contact-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-y-4 pt-1"
      >
        {submitError && (
          <div className="p-3 text-xs text-status-error bg-status-error/10 border border-status-error/20 rounded-lg">
            {submitError}
          </div>
        )}

        <Input
          label="Nome Completo"
          placeholder="Ex: João da Silva"
          autoFocus
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Telefone / WhatsApp"
          placeholder="(11) 98765-4321"
          error={errors.phone?.message}
          {...phoneRegistration}
          onChange={handlePhoneChange}
        />
      </form>
    </Modal>
  );
};
