"use client";

import { useState } from "react";
import { Select } from "@/components/shared/select";
import { TrackedSelect } from "@/components/shared/dirty-form";
import { staffRoleLabel, type BranchShiftRole } from "@/lib/roles/staff";

type BranchOption = { id: string; name: string };
type RoleOption = { value: BranchShiftRole | "manager"; label: string };

const adminOptions: RoleOption[] = [{ value: "manager", label: staffRoleLabel("manager") }];
const branchOptions: RoleOption[] = [
  { value: "branch_manager", label: staffRoleLabel("branch_manager") },
  { value: "cashier", label: staffRoleLabel("cashier") }
];
const adminAccessOptions = [
  { value: "true", label: "Enabled" },
  { value: "false", label: "Disabled" }
];

function roleOptionsForBranch(branchId: string) {
  return branchId ? branchOptions : adminOptions;
}

function branchSelectOptions(branches: BranchOption[], emptyLabel: string) {
  return [
    { value: "", label: emptyLabel },
    ...branches.map((branch) => ({ value: branch.id, label: branch.name }))
  ];
}

function toBranchRole(value: string): BranchShiftRole {
  return value === "cashier" ? "cashier" : "branch_manager";
}

export function StaffCreateAssignmentFields({ branches }: { branches: BranchOption[] }) {
  const [branchId, setBranchId] = useState("");
  const [branchRole, setBranchRole] = useState<BranchShiftRole>("branch_manager");
  const [adminAccess, setAdminAccess] = useState("true");
  const role = branchId ? branchRole : "manager";

  function updateBranch(nextBranchId: string) {
    if (!nextBranchId) setAdminAccess("true");
    if (!branchId && nextBranchId) setAdminAccess("false");
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
          options={branchSelectOptions(branches, "All branches")}
        />
      </label>
      <label htmlFor="staff-create-role" className="grid gap-2 text-sm font-medium text-charcoal">
        Role
        <Select
          id="staff-create-role"
          name="branchRole"
          value={role}
          onValueChange={(value) => setBranchRole(toBranchRole(value))}
          options={roleOptionsForBranch(branchId)}
        />
      </label>
      <label htmlFor="staff-create-admin-access" className="grid gap-2 text-sm font-medium text-charcoal">
        Admin dashboard
        <Select
          id="staff-create-admin-access"
          name="adminAccess"
          value={adminAccess}
          onValueChange={setAdminAccess}
          options={adminAccessOptions}
          disabled={!branchId}
        />
      </label>
    </>
  );
}

export function StaffEditAssignmentFields({
  branches,
  initialAdminAccess,
  initialBranchId,
  initialBranchRole
}: {
  branches: BranchOption[];
  initialAdminAccess: boolean;
  initialBranchId: string;
  initialBranchRole: BranchShiftRole;
}) {
  const [branchId, setBranchId] = useState(initialBranchId);
  const [branchRole, setBranchRole] = useState<BranchShiftRole>(initialBranchRole);

  return (
    <>
      <label htmlFor="staff-branch" className="grid gap-2 text-sm font-medium text-charcoal">
        Branch
        <TrackedSelect
          id="staff-branch"
          name="branchId"
          defaultValue={initialBranchId}
          onValueChange={setBranchId}
          options={branchSelectOptions(branches, "No branch login")}
        />
      </label>
      <label htmlFor="staff-role" className="grid gap-2 text-sm font-medium text-charcoal">
        Role
        <TrackedSelect
          key={branchId ? "branch-role" : "admin-role"}
          id="staff-role"
          name="branchRole"
          defaultValue={branchId ? branchRole : "manager"}
          onValueChange={(value) => setBranchRole(toBranchRole(value))}
          options={roleOptionsForBranch(branchId)}
          disabled={!branchId}
        />
      </label>
      <label htmlFor="staff-admin-access" className="grid gap-2 text-sm font-medium text-charcoal">
        Admin dashboard
        <TrackedSelect
          id="staff-admin-access"
          name="adminAccess"
          defaultValue={initialAdminAccess ? "true" : "false"}
          options={adminAccessOptions}
        />
      </label>
    </>
  );
}
