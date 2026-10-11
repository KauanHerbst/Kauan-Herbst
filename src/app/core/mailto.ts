export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export function buildMailto(to: string, subjectPrefix: string, m: ContactMessage): string {
  const name = m.name.trim();
  const subject = `${subjectPrefix} — ${name}`;
  const body = `${m.message.trim()}\n\n${name} <${m.email.trim()}>`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
