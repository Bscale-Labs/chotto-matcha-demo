import { redirect } from "next/navigation";

export default async function LegacyEditLedgerCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/cashier/customers/${id}/edit`);
}
