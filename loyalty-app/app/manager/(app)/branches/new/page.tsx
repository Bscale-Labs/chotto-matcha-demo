import { SectionTitle } from "@/components/shared/section-title";
import { BranchDetailsForm } from "@/components/manager/branch-details-form";

export default function NewBranchPage() {
  return (
    <div className="space-y-7">
        <SectionTitle title="Add branch" />
        <BranchDetailsForm mode="create" />
      </div>
  );
}
