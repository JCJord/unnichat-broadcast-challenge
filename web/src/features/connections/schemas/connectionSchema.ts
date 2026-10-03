import { z } from 'zod';

export const connectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome da conexão deve ter no mínimo 2 caracteres')
    .max(50, 'O nome da conexão deve ter no máximo 50 caracteres'),
});

export type ConnectionFormData = z.infer<typeof connectionSchema>;
