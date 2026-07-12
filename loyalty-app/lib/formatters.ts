export function formatPoints(points: number) {
  return new Intl.NumberFormat("en-PH").format(points);
}

export function formatPeso(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

/**
 * Short, human "how long ago" label for feeds — "Just now", "3h ago",
 * "Yesterday", then an absolute date past a week. `now` is passed in so callers
 * can compute it once on the server (avoids client/server hydration drift).
 */
export function formatRelativeTime(value: string | Date, now: Date = new Date()) {
  const then = new Date(value).getTime();
  const diffMinutes = Math.round((now.getTime() - then) / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" }).format(new Date(value));
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
