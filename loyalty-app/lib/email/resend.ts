import "server-only";

import { Resend } from "resend";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey?: string;
  tags?: { name: string; value: string }[];
};

type MagicLinkEmailInput = {
  to: string;
  url: string;
  intent?: string;
  role?: string;
};

let resend: Resend | null = null;

function getResend() {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  if (!apiKey) throw new Error("EMAIL_PROVIDER_API_KEY is required to send email");
  resend ??= new Resend(apiKey);
  return resend;
}

function getEmailFrom() {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM is required to send email");
  return from;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
  idempotencyKey,
  tags
}: SendEmailInput) {
  const { error } = await getResend().emails.send(
    {
      from: getEmailFrom(),
      to: [to],
      subject,
      html,
      text,
      tags
    },
    idempotencyKey ? { idempotencyKey } : undefined
  );

  if (error) throw new Error(error.message);
}

export async function sendMagicLinkEmail({ to, url, intent, role }: MagicLinkEmailInput) {
  const safeUrl = escapeHtml(url);
  const normalizedRole = role
    ? role
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Chotto Matcha";
  const subject = intent === "invite" ? `Your ${normalizedRole} sign-in link` : "Sign in to Chotto Matcha";
  const heading = intent === "invite" ? "Your account is ready." : "Sign in to Chotto Matcha.";
  const body =
    intent === "invite"
      ? "Use this secure link to open your account. It expires soon and can only be used once."
      : "Use this secure link to continue. It expires soon and can only be used once.";

  await sendTransactionalEmail({
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; color: #243126; line-height: 1.6; max-width: 560px;">
        <h1 style="font-size: 24px; line-height: 1.25; margin: 0 0 16px;">${heading}</h1>
        <p style="margin: 0 0 24px;">${body}</p>
        <p style="margin: 0 0 24px;">
          <a href="${safeUrl}" style="display: inline-block; background: #315B38; color: #FFF8EC; padding: 12px 18px; border-radius: 6px; text-decoration: none; font-weight: 700;">Open Chotto Matcha</a>
        </p>
        <p style="font-size: 13px; color: #66705F; margin: 0 0 12px;">If the button does not work, paste this link into your browser:</p>
        <p style="font-size: 13px; word-break: break-all; margin: 0;">${safeUrl}</p>
      </div>
    `,
    text: `${heading}\n\n${body}\n\n${url}`,
    idempotencyKey: `magic-link/${to}/${Date.now()}`,
    tags: [
      { name: "email_type", value: "magic_link" },
      { name: "intent", value: intent ?? "login" },
      { name: "role", value: role ?? "unknown" }
    ]
  });
}
