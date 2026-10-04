export const parseAppError = (error: unknown, fallbackMessage: string = 'Ocorreu um erro inesperado.'): string => {
  if (!error) return fallbackMessage;

  if (typeof error === 'string') return error;

  const err = error as { code?: string; message?: string };
  const errorCode = err.code || '';

  switch (errorCode) {
    // Auth errors
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha inválidos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado.';
    case 'auth/weak-password':
      return 'A senha deve possuir no mínimo 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns instantes e tente novamente.';
    case 'auth/network-request-failed':
      return 'Falha de conexão com a internet. Verifique sua rede.';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.';

    // Firestore errors
    case 'permission-denied':
      return 'Permissão negada. Você não tem acesso a este recurso.';
    case 'not-found':
      return 'Recurso não encontrado.';
    case 'already-exists':
      return 'Este registro já existe.';
    case 'resource-exhausted':
      return 'Limite de requisições excedido. Tente novamente mais tarde.';
    case 'cancelled':
      return 'A operação foi cancelada.';
    case 'unavailable':
      return 'Serviço temporariamente indisponível. Verifique sua conexão.';
    case 'deadline-exceeded':
      return 'Tempo limite esgotado. Tente novamente.';

    default:
      if (err.message && !err.message.includes('Firebase:') && !err.message.includes('INTERNAL')) {
        return err.message;
      }
      return fallbackMessage;
  }
};
