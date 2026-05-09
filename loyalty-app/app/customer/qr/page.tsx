import { CustomerShell } from "@/components/customer/customer-shell";
import { getCustomer } from "@/lib/mock-data";

const qrCells = Array.from({ length: 121 }, (_, index) => index % 2 === 0 || index % 7 === 0 || [3, 9, 30, 58, 93].includes(index));

export default function CustomerQrPage() {
  const customer = getCustomer();

  return (
    <CustomerShell>
      <section className="rounded-[8px] bg-white p-6 text-center shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-matcha">Counter scan</p>
        <h1 className="mt-2 font-display text-4xl text-ink">My QR</h1>
        <div className="mx-auto mt-6 grid h-72 w-72 grid-cols-11 gap-1 rounded-[8px] border-8 border-white bg-white p-2 shadow-inner">
          {qrCells.map((filled, index) => (
            <span key={index} className={filled ? "rounded-sm bg-ink" : "rounded-sm bg-paper"} />
          ))}
        </div>
        <p className="mt-5 font-mono text-xs text-ink/55">{customer.id}</p>
        <p className="mt-3 text-sm text-ink/62">Brightness boost and camera scan wiring land in the DB/auth pass.</p>
      </section>
    </CustomerShell>
  );
}
