import { parseAppError } from '@/core/errors';

export interface FeedbackOptions {
  success?: string;
  errorFallback?: string;
  onError?: (err: unknown) => void;
  onSuccess?: () => void;
}

export interface FeedbackNotifier {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export const executeWithFeedback = async <T>(
  action: () => Promise<T>,
  notifier: FeedbackNotifier,
  options?: FeedbackOptions,
): Promise<T> => {
  try {
    const result = await action();
    if (options?.success) {
      notifier.success(options.success);
    }
    options?.onSuccess?.();
    return result;
  } catch (err: unknown) {
    const message = parseAppError(err, options?.errorFallback);
    notifier.error(message);
    options?.onError?.(err);
    throw err;
  }
};
