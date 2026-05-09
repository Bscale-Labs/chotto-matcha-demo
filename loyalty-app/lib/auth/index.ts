export type SessionRole = "customer" | "cashier" | "manager";

export function requireRole(role: SessionRole) {
  return { role, authenticated: true };
}
