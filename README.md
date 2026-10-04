# Unnichat Broadcast Challenge

Plataforma SaaS multi-tenant para gerenciamento de conexões, contatos e agendamento de mensagens em tempo real.

Aplicação em Produção (Firebase Hosting): https://unnichat-broadcast-challenge.web.app

---

## Visão Geral

Projeto desenvolvido como resolução do desafio técnico para a Unnichat. A aplicação implementa o fluxo completo de envio de mensagens em massa (Broadcast), suportando disparos imediatos e agendados, com isolamento multi-tenant e sincronização em tempo real.

---

## Arquitetura e Decisões de Engenharia

### 1. Modelagem Firestore sem Subcoleções (Root-Level Collections)
Em conformidade com a especificação técnica do desafio, o banco de dados foi estruturado exclusivamente em coleções raiz:
- `/connections/{connectionId}`
- `/contacts/{contactId}`
- `/broadcasts/{broadcastId}`

Os relacionamentos entre entidades são estabelecidos por chaves relacionais (`userId` e `connectionId`), permitindo consultas indexadas eficientes e facilitando regras de segurança granulares.

### 2. Regras de Segurança Multi-Tenant (firestore.rules)
A camada de segurança no banco de dados assegura isolamento entre tenants:
- Isolamento por Usuário: Operações de leitura e escrita restritas a `request.auth.uid == resource.data.userId`.
- Validação Relacional: Criação de contatos e broadcasts exige que o `connectionId` pertença comprovadamente ao usuário autenticado (`isConnectionOwner`).
- Imutabilidade de Histórico: Mensagens com status `sent` não permitem alterações de conteúdo ou timestamps pelo cliente.
- Validação de Schema: Restrição estrita de campos via `keys().hasOnly()` e `keys().hasAll()` para prevenir inserção de payloads arbitrários.

### 3. Processamento em Background via Cloud Functions (functions/)
- Implementado em Node.js 20 com TypeScript utilizando Firebase Functions v2 (`onSchedule`).
- O worker executa a cada 1 minuto (`every 1 minutes`, fuso horário `America/Sao_Paulo`) consultando registros com `status == 'scheduled'` e `scheduledFor <= now`.
- As transições de status para `sent` e o preenchimento de `sentAt` ocorrem em lote via `db.batch()`, operando de forma autônoma sem depender de sessões ativas no navegador.

### 4. Sincronização em Tempo Real
A interface web consome as coleções via listeners `onSnapshot`. Quando a Cloud Function processa um agendamento na nuvem, o frontend atualiza o status visual do broadcast instantaneamente sem necessidade de recarregamento de página.

### 5. Integridade Referencial (Cascade Delete Atômico)
Para prevenir registros órfãos ao deletar uma Conexão, o método de exclusão executa uma operação em lote via `writeBatch`:
- Consulta e remove todos os contatos associados à conexão.
- Consulta e remove todos os broadcasts associados à conexão.
- Remove o documento da conexão.
- Redefine a conexão ativa em memória e no armazenamento local (`localStorage`).

### 6. Design System e Componentes
- Estilização baseada em Tailwind CSS e Material UI com tokens semânticos centralizados em `tokens.ts`.
- Validação de formulários com React Hook Form e esquemas estritos em Zod.
- Seletor de data e hora nativo do Material UI (`@mui/x-date-pickers`) integrado ao `date-fns` com localização pt-BR.
- Tratamento global de notificações e erros via Snackbar centralizado.

---

## Tecnologias Utilizadas

### Frontend (/web)
- React 19, TypeScript, Vite
- Tailwind CSS v4, Material UI v6
- React Hook Form, Zod
- @mui/x-date-pickers, date-fns
- Lucide React
- Firebase Client SDK v12 (Auth, Firestore)

### Backend (/functions)
- Node.js 20, TypeScript
- Firebase Cloud Functions v2 (Scheduler)
- Firebase Admin SDK

### Infraestrutura
- Firebase Hosting
- Cloud Firestore
- Google Cloud Scheduler

---

## Execução Local

### Pré-requisitos
- Node.js 20 ou superior
- NPM
- Firebase CLI instalado globalmente

### 1. Instalação e Execução do Frontend
```bash
cd web
npm install
npm run dev
```

Configure as variáveis de ambiente em `web/.env`:
```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 2. Execução do Backend (Cloud Functions)
```bash
cd functions
npm install
npm run build
```

Para emular as funções localmente:
```bash
firebase emulators:start --only functions,firestore
```

---

## Estrutura do Repositório

```text
functions/              Backend serverless (Cloud Functions e scheduler)
  src/index.ts          Worker agendado para processamento de broadcasts
web/                    Frontend da aplicação React
  src/
    core/               Serviços singleton, contextos (Auth, Connections, Toast) e tratamento de erros
    features/           Módulos autocontidos (auth, connections, contacts, broadcast)
    shared/             Componentes reutilizáveis (Button, Modal, Input, Badge)
    theme/              Tokens de design e configuração de tema Material UI
firestore.rules         Regras de segurança e isolamento multi-tenant do Firestore
firestore.indexes.json  Índices compostos para consultas relacionais e ordenações
firebase.json           Configuração de deploy do Hosting, Functions e Firestore
```
