import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Radio, Plus, AlertCircle } from 'lucide-react';
import { Connection } from '@/types';
import { useActiveConnection } from '@/core/connections/useActiveConnection';
import { Button, ConfirmModal } from '@/shared/components/ui';
import { ConnectionCard, ConnectionModal } from '../components';

export const ConnectionsPage: React.FC = () => {
  const {
    connections,
    loading,
    error,
    activeConnection,
    setActiveConnection,
    createConnection,
    updateConnection,
    deleteConnection,
  } = useActiveConnection();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingConnection, setDeletingConnection] = useState<Connection | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openCreateModal = () => setIsCreateModalOpen(true);

  const openEditModal = (connection: Connection) => {
    setEditingConnection(connection);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (connection: Connection) => {
    setDeletingConnection(connection);
    setIsDeleteModalOpen(true);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <CircularProgress size={32} />
          <span className="text-sm text-text-secondary">Carregando conexões...</span>
        </div>
      );
    }

    if (connections.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-dark-border rounded-2xl bg-dark-surface/40 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Radio className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Nenhuma conexão cadastrada</h2>
          <p className="text-sm text-text-secondary max-w-md mt-1 mb-6">
            Crie sua primeira conexão para poder associar contatos e realizar disparos de broadcast.
          </p>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
            Criar Primeira Conexão
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            isActive={activeConnection?.id === connection.id}
            onSelectActive={setActiveConnection}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-primary" />
            Conexões
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Gerencie suas conexões e defina a ativa para envio de mensagens e contatos.
          </p>
        </div>

        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={openCreateModal}
          className="self-start sm:self-auto shrink-0"
        >
          Nova Conexão
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 rounded-xl text-status-error text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {renderContent()}

      <ConnectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (name) => {
          await createConnection(name);
        }}
      />

      <ConnectionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={editingConnection}
        onSubmit={async (name) => {
          if (editingConnection) await updateConnection(editingConnection.id, name);
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Conexão"
        confirmLabel="Excluir Conexão"
        errorMessage="Não foi possível excluir a conexão. Tente novamente."
        onConfirm={async () => {
          if (deletingConnection) await deleteConnection(deletingConnection.id);
        }}
      >
        Tem certeza que deseja excluir a conexão{' '}
        <strong className="text-text-primary font-semibold">"{deletingConnection?.name}"</strong>?
        Esta ação é permanente e não poderá ser desfeita.
      </ConfirmModal>
    </div>
  );
};
