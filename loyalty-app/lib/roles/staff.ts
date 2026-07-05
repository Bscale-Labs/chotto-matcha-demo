export const STAFF_ROLES = ["cashier", "branch_manager", "manager"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const BRANCH_SHIFT_ROLES = ["cashier", "branch_manager"] as const;
export type BranchShiftRole = (typeof BRANCH_SHIFT_ROLES)[number];

export function isStaffRole(role: string): role is StaffRole {
  return (STAFF_ROLES as readonly string[]).includes(role);
}

export function isBranchShiftRole(role: string): role is BranchShiftRole {
  return (BRANCH_SHIFT_ROLES as readonly string[]).includes(role);
}

export function staffRoleLabel(role: StaffRole | string) {
  switch (role) {
    case "branch_manager":
      return "Branch Manager";
    case "cashier":
      return "Cashier";
    case "manager":
      return "Admin";
    default:
      return role;
  }
}
