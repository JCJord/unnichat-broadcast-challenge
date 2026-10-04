import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { Users, Plus, Search, Radio, AlertCircle, UserPlus, X } from 'lucide-react';
import { Contact } from '@/types';
import { useActiveConnection } from '@/core/connections/useActiveConnection';
import { Button, ConfirmModal, Input } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks';
import { useContacts } from '../hooks/useContacts';
import { ContactCard, ContactModal } from '../components';

export const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeConnection, loading: connectionLoading } = useActiveConnection();
  const {
    contacts,
    loading: contactsLoading,
    error,
    createContact,
    updateContact,
    deleteContact,
  } = useContacts(activeConnection?.id);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setDeletingContact(contact);
    setIsDeleteModalOpen(true);
  };

  const searchableContacts = useMemo(
    () =>
      contacts.map((contact) => ({
        contact,
        normalizedName: contact.name.toLowerCase(),
        cleanPhone: contact.phone.replace(/\D/g, ''),
      })),
    [contacts],
  );

  const filteredContacts = useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (!term) return contacts;

    const termDigits = term.replace(/\D/g, '');

    return searchableContacts
      .filter(({ normalizedName, cleanPhone }) => {
        const matchesName = normalizedName.includes(term);
        const matchesPhone = termDigits.length > 0 && cleanPhone.includes(termDigits);
        return matchesName || matchesPhone;
      })
      .map(({ contact }) => contact);
  }, [contacts, searchableContacts, debouncedSearchTerm]);

  const isLoading = connectionLoading || contactsLoading;

  if (!isLoading && !activeConnection) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-primary" />
            Contatos
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Gerencie os contatos vinculados à sua conexão ativa.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-dark-border rounded-2xl bg-dark-surface/40 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Radio className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Nenhuma conexão ativa</h2>
          <p className="text-sm text-text-secondary max-w-md mt-1 mb-6">
            Você precisa ter uma conexão ativa para gerenciar contatos e disparar broadcasts.
          </p>
          <Button onClick={() => navigate('/connections')}>
            Ir para Conexões
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-primary" />
            Contatos
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Conexão:{' '}
            <strong className="text-text-primary font-medium">{activeConnection?.name}</strong>{' '}
            ({contacts.length} {contacts.length === 1 ? 'contato' : 'contatos'})
          </p>
        </div>

        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
          className="self-start sm:self-auto shrink-0"
        >
          Novo Contato
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 rounded-xl text-status-error text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {contacts.length > 0 && (
        <div className="w-full max-w-md">
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchTerm ? (
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm('')}
                  className="text-text-secondary hover:text-text-primary"
                  aria-label="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </IconButton>
              ) : undefined
            }
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <CircularProgress size={32} />
          <span className="text-sm text-text-secondary">Carregando contatos...</span>
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-dark-border rounded-2xl bg-dark-surface/40 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Nenhum contato cadastrado</h2>
          <p className="text-sm text-text-secondary max-w-md mt-1 mb-6">
            Adicione os primeiros contatos desta conexão para começar a enviar mensagens.
          </p>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>
            Adicionar Primeiro Contato
          </Button>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="py-12 text-center text-text-secondary">
          Nenhum contato encontrado com o termo "{searchTerm}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      <ContactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (data) => {
          await createContact(data);
        }}
      />

      <ContactModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={editingContact}
        onSubmit={async (data) => {
          if (editingContact) {
            await updateContact(editingContact.id, data);
          }
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Contato"
        confirmLabel="Excluir Contato"
        errorMessage="Não foi possível excluir o contato. Tente novamente."
        onConfirm={async () => {
          if (deletingContact) {
            await deleteContact(deletingContact.id);
          }
        }}
      >
        Tem certeza que deseja excluir o contato{' '}
        <strong className="text-text-primary font-semibold">"{deletingContact?.name}"</strong>?
        Esta ação é permanente e não poderá ser desfeita.
      </ConfirmModal>
    </div>
  );
};
