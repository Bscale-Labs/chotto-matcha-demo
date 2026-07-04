import { ManagerShell } from "@/components/manager/manager-shell";

export default function ManagerAppLayout({ children }: { children: React.ReactNode }) {
  return <ManagerShell>{children}</ManagerShell>;
}
