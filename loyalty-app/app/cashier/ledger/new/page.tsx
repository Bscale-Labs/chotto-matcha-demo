import { redirect } from "next/navigation";

export default function LegacyNewLedgerCustomerPage() {
  redirect("/cashier/customers/new");
}
