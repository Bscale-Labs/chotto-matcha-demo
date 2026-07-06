import { EmailLoginForm } from "@/components/auth/email-login-form";

export function ManagerLoginForm() {
  return <EmailLoginForm callbackURL="/manager" placeholder="you@chottomatcha.ph" authRole="manager" />;
}
