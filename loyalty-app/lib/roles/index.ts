import type { Role } from "@/lib/types";

export const roleHome: Record<Role, string> = {
  customer: "/customer",
  cashier: "/cashier",
  branch_manager: "/cashier",
  manager: "/manager"
};
