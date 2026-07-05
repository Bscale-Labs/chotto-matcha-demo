"use client";

import { useState } from "react";
import { Select } from "@/components/shared/select";
import { TrackedSelect } from "@/components/shared/dirty-form";
import { staffRoleLabel, type StaffRole } from "@/lib/roles/staff";

type BranchOption = { id: string; name: string };
type RoleOption = { value: StaffRole; label: string };
type BranchRole = "branch_manager" | "cashier";

const adminOptions: RoleOption[] = [{ value: "manager", label: staffRoleLabel("manager") }];
const branchOptions: RoleOption[] = [
  { value: "branch_manager", label: staffRoleLabel("branch_manager") },
  { value: "cashier", label: staffRoleLabel("cashier") }
];

function roleOptionsForBranch(branchId: string) {
  return branchId ? branchOptions : adminOptions;
}

function normalizeRoleForBranch(branchId: string, role: StaffRole): StaffRole {
  if (!branchId) return "manager";
  return role === "manager" ? "branch_manager" : role;
}

function branchRoleFrom(role: StaffRole): BranchRole {
  return role === "cashier" ? "cashier" : "branch_manager";
}

function branchSelectOptions(branches: BranchOption[]) {
  return [
    { value: "", label: "All branches" },
    ...branches.map((branch) => ({ value: branch.id, label: branch.name }))
  ];
}

export function StaffCreateAssignmentFields({ branches }: { branches: BranchOption[] }) {
  const [branchId, setBranchId] = useState("");
  const [branchRole, setBranchRole] = useState<BranchRole>("branch_manager");
  const role = branchId ? branchRole : "manager";

  function updateBranch(nextBranchId: string) {
    setBranchId(nextBranchId);
  }

  return (
    <>
      <label htmlFor="staff-create-branch" className="grid gap-2 text-sm font-medium text-charcoal">
        Branch
        <Select
          id="staff-create-branch"
          name="branchId"
          value={branchId}
          onValueChange={updateBranch}
          options={branchSelectOptions(branches)}
        />
      </label>
      <label htmlFor="staff-create-role" className="grid gap-2 text-sm font-medium text-charcoal">
        Role
        <Select
          id="staff-create-role"
          name="role"
          value={role}
          onValueChange={(value) => setBranchRole(branchRoleFrom(value as StaffRole))}
          options={roleOptionsForBranch(branchId)}
        />
      </label>
    </>
  );
}

export function StaffEditAssignmentFields({
  branches,
  initialBranchId,
  initialRole
}: {
  branches: BranchOption[];
  initialBranchId: string;
  initialRole: StaffRole;
}) {
  const [branchId, setBranchId] = useState(initialBranchId);
  const [branchRole, setBranchRole] = useState<BranchRole>(() => branchRoleFrom(initialRole));
  const role = normalizeRoleForBranch(branchId, branchRole);

  function updateBranch(nextBranchId: string) {
    setBranchId(nextBranchId);
  }

  return (
    <>
      <label htmlFor="staff-branch" className="grid gap-2 text-sm font-medium text-charcoal">
        Branch
        <TrackedSelect
          id="staff-branch"
          name="branchId"
          defaultValue={initialBranchId}
          onValueChange={updateBranch}
          options={branchSelectOptions(branches)}
        />
      </label>
      <label htmlFor="staff-role" className="grid gap-2 text-sm font-medium text-charcoal">
        Role
        <TrackedSelect
          key={branchId}
          id="staff-role"
          name="role"
          defaultValue={role}
          onValueChange={(value) => setBranchRole(branchRoleFrom(value as StaffRole))}
          options={roleOptionsForBranch(branchId)}
        />
      </label>
    </>
  );
}
