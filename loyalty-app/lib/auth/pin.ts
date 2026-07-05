import "server-only";

import { createHash } from "node:crypto";

export function hashDemoPin(pin: string) {
  return createHash("sha256").update(`chotto-demo:${pin}`).digest("hex");
}

export function isValidPin(pin: string) {
  return /^\d{4}$/.test(pin);
}
