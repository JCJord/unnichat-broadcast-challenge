import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { Send, Plus, Search, Radio, Clock, CheckCircle2, MessageSquare, X, AlertCircle } from 'lucide-react';
import { Broadcast } from '@/types';
import { useActiveConnection } from '@/core/connections/useActiveConnection';
import { useContacts } from '@/features/contacts/hooks/useContacts';
import { useToast } from '@/core/feedback';
import { Button, Input, ConfirmModal } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks';
import { useBroadcasts } from '../hooks/useBroadcasts';
import { BroadcastCard, BroadcastModal } from '../components';

type TabType = 'all' | 'scheduled' | 'sent';

export const BroadcastPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { activeConnection, loading: connectionLoading } = useActiveConnection();
  const { contacts, loading: contactsLoading } = useContacts(activeConnection?.id);
  const {
    broadcasts,
    loading: broadcastsLoading,
    error: broadcastsError,
    createBroadcast,
    updateBroadcast,
    deleteBroadcast,
  } = useBroadcasts(activeConnection?.id);

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState<Broadcast | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingBroadcast, setDeletingBroadcast] = useState<Broadcast | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const counts = useMemo(() => {
    let scheduled = 0;
    let sent = 0;
    for (const b of broadcasts) {
      if (b.status === 'scheduled') scheduled++;
      else if (b.status === 'sent') sent++;
    }
    return { all: broadcasts.length, scheduled, sent };
  }, [broadcasts]);

  const filteredBroadcasts = useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();

    return broadcasts.filter((b) => {
      const matchTab = activeTab === 'all' || b.status === activeTab;
      const matchSearch = !term || b.message.toLowerCase().includes(term);
      return matchTab && matchSearch;
    });
  }, [broadcasts, activeTab, debouncedSearchTerm]);

  const isLoading = connectionLoading || broadcastsLoading || contactsLoading;

  const openEditModal = (broadcast: Broadcast) => {
    setEditingBroadcast(broadcast);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (broadcast: Broadcast) => {
    setDeletingBroadcast(broadcast);
    setIsDeleteModalOpen(true);
  };

  if (!isLoading && !activeConnection) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2.5">
            <Send className="w-6 h-6 text-primary" />
            Broadcast
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Envio imediato e agendamento de mensagens.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-dark-border rounded-2xl bg-dark-surface/40 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Radio className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Nenhuma conexão ativa</h2>
          <p className="text-sm text-text-secondary max-w-md mt-1 mb-6">
            Você precisa selecionar uma conexão ativa para gerenciar e disparar mensagens de broadcast.
          </p>
          <Button onClick={() => navigate('/connections')}>Ir para Conexões</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2.5">
            <Send className="w-6 h-6 text-primary" />
            Broadcast
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Conexão:{' '}
            <strong className="text-text-primary font-medium">{activeConnection?.name}</strong>{' '}
            ({broadcasts.length} {broadcasts.length === 1 ? 'disparo' : 'disparos'})
          </p>
        </div>

        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
          className="self-start sm:self-auto shrink-0"
        >
          Novo Broadcast
        </Button>
      </div>

      <div className="p-4 bg-status-warning/10 border border-status-warning/30 rounded-xl text-sm flex flex-col sm:flex-row items-start gap-3">
        <AlertCircle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 text-text-secondary leading-relaxed">
          <span className="font-semibold text-text-primary">
            Atenção: Cloud Function não ativa na nuvem
          </span>
          <span>
            As mensagens agendadas <strong className="text-text-primary font-medium">não mudarão de status automaticamente nesta versão web</strong>, pois a Cloud Function não foi implantada no Google Cloud (o plano Blaze exige pré-pagamento obrigatório de R$ 150,00).
          </span>
          <span className="text-xs text-text-muted mt-0.5">
            A lógica foi 100% implementada em <code className="text-primary font-mono bg-dark-bg/60 px-1.5 py-0.5 rounded">/functions</code>. Para testar a Cloud Function mudando o status para "Enviada": <code className="text-text-primary font-mono bg-dark-bg px-2 py-0.5 rounded border border-dark-border">cd functions && npm install && npm test</code> (executa via emulador oficial do Firebase).
          </span>
        </div>
      </div>

      {broadcastsError && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 rounded-xl text-status-error text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{broadcastsError}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            Todas
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-dark-border/40 font-mono">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scheduled')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'scheduled'
                ? 'bg-status-warning/15 text-status-warning border border-status-warning/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Agendadas
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-dark-border/40 font-mono">
              {counts.scheduled}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'sent'
                ? 'bg-status-sent/15 text-status-sent border border-status-sent/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Enviadas
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-dark-border/40 font-mono">
              {counts.sent}
            </span>
          </button>
        </div>

        {broadcasts.length > 0 && (
          <div className="w-full sm:w-72">
            <Input
              placeholder="Buscar por mensagem..."
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
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <CircularProgress size={32} />
          <span className="text-sm text-text-secondary">Carregando broadcasts...</span>
        </div>
      ) : broadcasts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-dark-border rounded-2xl bg-dark-surface/40 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Nenhum broadcast cadastrado</h2>
          <p className="text-sm text-text-secondary max-w-md mt-1 mb-6">
            Dispare sua primeira mensagem em massa para os contatos desta conexão.
          </p>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>
            Criar Primeiro Broadcast
          </Button>
        </div>
      ) : filteredBroadcasts.length === 0 ? (
        <div className="py-12 text-center text-text-secondary">
          Nenhum broadcast encontrado com os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBroadcasts.map((broadcast) => (
            <BroadcastCard
              key={broadcast.id}
              broadcast={broadcast}
              onEdit={broadcast.status === 'scheduled' ? openEditModal : undefined}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      <BroadcastModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        contacts={contacts}
        onSubmit={async (data) => {
          await createBroadcast(data);
          toast.success(
            data.mode === 'scheduled'
              ? 'Broadcast agendado com sucesso!'
              : 'Broadcast enviado com sucesso!',
          );
        }}
      />

      <BroadcastModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        contacts={contacts}
        initialData={editingBroadcast}
        onSubmit={async (data) => {
          if (editingBroadcast) {
            await updateBroadcast(editingBroadcast.id, data);
            toast.success('Broadcast atualizado com sucesso!');
          }
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Broadcast"
        confirmLabel="Excluir Broadcast"
        errorMessage="Não foi possível excluir o broadcast. Tente novamente."
        onConfirm={async () => {
          if (deletingBroadcast) {
            await deleteBroadcast(deletingBroadcast.id);
            toast.success('Broadcast excluído com sucesso!');
          }
        }}
      >
        Tem certeza que deseja excluir este broadcast? Esta ação é permanente e não poderá ser desfeita.
      </ConfirmModal>
    </div>
  );
};
