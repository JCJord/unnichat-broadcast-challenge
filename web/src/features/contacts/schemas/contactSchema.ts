import { z } from 'zod';
import { PHONE_MAX_DIGITS, PHONE_MIN_DIGITS, toPhoneDigits } from '../utils/phone';

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres')
    .max(60, 'O nome deve ter no máximo 60 caracteres'),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9\s()-]*$/, 'Telefone deve conter apenas números')
    .refine(
      (value) => toPhoneDigits(value).length >= PHONE_MIN_DIGITS,
      `Informe DDD + número (mínimo ${PHONE_MIN_DIGITS} dígitos)`,
    )
    .refine(
      (value) => toPhoneDigits(value).length <= PHONE_MAX_DIGITS,
      `O telefone deve ter no máximo ${PHONE_MAX_DIGITS} dígitos`,
    ),
});

export type ContactFormData = z.infer<typeof contactSchema>;
