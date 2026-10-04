export const PHONE_MIN_DIGITS = 10;
export const PHONE_MAX_DIGITS = 11;

export const toPhoneDigits = (value: string): string => value.replace(/\D/g, '');

export const formatPhone = (value: string): string => {
  const digits = toPhoneDigits(value).slice(0, PHONE_MAX_DIGITS);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};
