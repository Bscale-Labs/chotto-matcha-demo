import { randomBytes } from "node:crypto";

const CUSTOMER_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CUSTOMER_CODE_LENGTH = 6;

export function generateCustomerCode() {
  const bytes = randomBytes(CUSTOMER_CODE_LENGTH);
  let suffix = "";

  for (const byte of bytes) {
    suffix += CUSTOMER_CODE_ALPHABET[byte % CUSTOMER_CODE_ALPHABET.length];
  }

  return `CM-${suffix}`;
}

export function normalizeCustomerCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
