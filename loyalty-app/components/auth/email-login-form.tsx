"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/client";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import type { Role } from "@/lib/types";

export function EmailLoginForm({
  callbackURL,
  placeholder = "you@example.com",
  authRole = "customer"
}: {
  callbackURL: string;
  placeholder?: string;
  authRole?: Role;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordPending, setPasswordPending] = useState(false);
  const [linkPending, setLinkPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSentTo(null);
    const normalizedEmail = email.trim().toLowerCase();
    setPasswordPending(true);
    try {
      const result = await signIn.email({ email: normalizedEmail, password, callbackURL });
      if (result.error) {
        setError(result.error.message ?? "Sign in failed");
        return;
      }
    } catch {
      setError("Sign in failed. Check your connection and try again.");
      return;
    } finally {
      setPasswordPending(false);
    }
    router.push(callbackURL);
    router.refresh();
  }

  async function sendMagicLink() {
    setError(null);
    setSentTo(null);
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your email first");
      return;
    }
    setLinkPending(true);
    try {
      const result = await signIn.magicLink({
        email: normalizedEmail,
        callbackURL,
        errorCallbackURL: callbackURL,
        metadata: { intent: "login", role: authRole }
      });
      if (result.error) {
        setError(result.error.message ?? "Could not send sign-in link");
        return;
      }
    } catch {
      setError("Could not send sign-in link. Check your connection and try again.");
      return;
    } finally {
      setLinkPending(false);
    }
    setSentTo(normalizedEmail);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error ? <p className="text-sm text-error-text">{error}</p> : null}
      {sentTo ? (
        <p className="rounded-md border border-sage-tint bg-sage-wash p-3 text-sm leading-6 text-matcha-deep">
          Check {sentTo} for a secure sign-in link.
        </p>
      ) : null}
      <Button type="submit" disabled={passwordPending || linkPending} className="mt-2 w-full">
        {passwordPending ? "Just a moment..." : "Sign in"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        disabled={passwordPending || linkPending}
        className="w-full"
        onClick={sendMagicLink}
      >
        {linkPending ? "Sending..." : "Email me a sign-in link"}
      </Button>
    </form>
  );
}
