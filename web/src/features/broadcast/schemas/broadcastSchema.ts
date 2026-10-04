import { z } from 'zod';

export const broadcastSchema = z
  .object({
    message: z
      .string()
      .trim()
      .min(1, 'A mensagem não pode estar vazia')
      .max(1000, 'A mensagem pode ter no máximo 1000 caracteres'),
    contactIds: z
      .array(z.string())
      .min(1, 'Selecione pelo menos um contato para o disparo'),
    mode: z.enum(['now', 'scheduled']),
    scheduledFor: z.date().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.mode === 'scheduled') {
        if (!data.scheduledFor) return false;
        const now = new Date();
        return data.scheduledFor.getTime() > now.getTime();
      }
      return true;
    },
    {
      message: 'A data e hora de agendamento devem ser futuras',
      path: ['scheduledFor'],
    },
  );

export type BroadcastFormData = z.infer<typeof broadcastSchema>;
