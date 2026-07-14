"use client";

import { useState, useTransition, type FormEvent } from "react";
import { LoaderCircle, Search } from "lucide-react";
import { searchManagerCustomers } from "@/app/manager/actions";
import { Pill } from "@/components/shared/pill";
import { DataTable } from "@/components/shared/table";
import { formatPoints } from "@/lib/formatters";

export type CustomerSearchRow = {
  id: string;
  code: string;
  email: string;
  name: string;
  phone: string;
  pointsBalance: number;
  active: boolean;
};

export function CustomerSearchTable({
  initialCustomers,
  initialQuery,
  highlightKey
}: {
  initialCustomers: CustomerSearchRow[];
  initialQuery?: string;
  highlightKey?: string;
}) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isPending, startTransition] = useTransition();

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") ?? "").trim();

    startTransition(async () => {
      const result = await searchManagerCustomers(query);
      setCustomers(result.customers);
    });
  }

  return (
    <>
      <form
        onSubmit={submitSearch}
        className="surface-paper ml-auto flex w-full max-w-lg items-center gap-2 rounded-md px-4 py-3 focus-within:border-matcha-deep focus-within:shadow-focus"
      >
        <Search className="h-4 w-4 text-ink-muted" strokeWidth={1.75} aria-hidden="true" />
        <input
          name="q"
          defaultValue={initialQuery ?? ""}
          aria-label="Search customers"
          placeholder="Search code, name, email, or phone"
          className="flex-1 bg-transparent text-sm placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          className="-my-1 inline-flex min-h-tap min-w-[70px] items-center justify-center rounded-md px-2 text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
        >
          {isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8} aria-label="Searching" />
          ) : (
            "Search"
          )}
        </button>
      </form>
      <div className={isPending ? "opacity-60 transition-opacity duration-fast ease-out-soft" : undefined}>
        <DataTable
          headers={["Name", "Contact", "Points", "Status"]}
          rowHrefs={customers.map((customer) => `/manager/customers/${customer.id}/edit`)}
          rowKeys={customers.map((customer) => customer.id)}
          highlightKey={highlightKey}
          rows={customers.map((customer) => [
            <span key={`${customer.id}-name`} className="font-medium text-charcoal">
              <span className="block truncate">{customer.name}</span>
              <span className="counter mt-1 block text-xs font-medium uppercase tracking-[0.08em] text-matcha-deep">
                {customer.code}
              </span>
            </span>,
            <div key={`${customer.id}-contact`} className="grid">
              <span className="text-sm text-charcoal">{customer.email}</span>
              <span className="text-xs text-ink-muted">{customer.phone}</span>
            </div>,
            <span
              key={`${customer.id}-points`}
              className="counter text-sm font-medium text-charcoal"
            >
              {formatPoints(customer.pointsBalance)}
            </span>,
            <Pill key={`${customer.id}-status`} tone={customer.active ? "default" : "muted"}>
              {customer.active ? "Active" : "Inactive"}
            </Pill>
          ])}
        />
      </div>
    </>
  );
}
