export const dynamic = "force-dynamic";
import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import Paper from "@/components/scrapbook/Paper";
import type {ContactMessage} from "@/lib/api";

const CANDIDATE_PATHS = [
  "/api/admin/messages",
  "/api/admin/contact",
  "/api/admin/contact-messages",
];

async function getMessages(): Promise<{
  messages: ContactMessage[];
  activeEndpoint: string;
  error: string | null;
}> {
  let lastError: string | null = null;
  for (const path of CANDIDATE_PATHS) {
    try {
      const res = await adminFetch(path, {cache: "no-store"});
      if (Array.isArray(res)) {
        return {messages: res, activeEndpoint: path, error: null};
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }
  return {
    messages: [],
    activeEndpoint: "/api/admin/messages",
    error: lastError,
  };
}

function revalidateInbox() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
}

async function toggleRead(formData: FormData) {
  "use server";
  const id = formData.get("id");
  const currentRead = formData.get("read") === "true";

  // Try common admin endpoint conventions so whichever route admin.py exposes succeeds
  const attempts: Array<{path: string; method: string; body?: string}> = [
    {path: `/api/admin/messages/${id}/read`, method: "PATCH"},
    {
      path: `/api/admin/messages/${id}`,
      method: "PATCH",
      body: JSON.stringify({read: !currentRead}),
    },
    {
      path: `/api/admin/messages/${id}`,
      method: "PUT",
      body: JSON.stringify({read: !currentRead}),
    },
    {path: `/api/admin/contact/${id}/read`, method: "PATCH"},
    {
      path: `/api/admin/contact/${id}`,
      method: "PATCH",
      body: JSON.stringify({read: !currentRead}),
    },
  ];

  for (const attempt of attempts) {
    try {
      await adminFetch(attempt.path, {
        method: attempt.method,
        ...(attempt.body ? {body: attempt.body} : {}),
      });
      break;
    } catch {
      // try next candidate route
    }
  }

  revalidateInbox();
}

async function deleteMessage(formData: FormData) {
  "use server";
  const id = formData.get("id");
  for (const base of CANDIDATE_PATHS) {
    try {
      await adminFetch(`${base}/${id}`, {method: "DELETE"});
      break;
    } catch {
      // try next candidate route
    }
  }
  revalidateInbox();
}

function formatDate(iso?: string | null) {
  if (!iso) return "Just now";
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AdminMessagesPage() {
  const {messages, error} = await getMessages();
  const sorted = [...messages].sort((a, b) => {
    const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return tB - tA || b.id - a.id;
  });
  const unreadCount = sorted.filter((m) => !m.read).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-4xl uppercase tracking-wider text-ink break-words">
            Inbox &amp; Dispatches
          </h1>
          <p className="mt-1 font-mono text-xs text-sand-500">
            Messages sent from your public portfolio contact form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-sand-300 bg-ivory px-3.5 py-1.5 font-mono text-xs text-sand-700">
            {sorted.length} Total
          </span>
          <span
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold ${
              unreadCount > 0
                ? "border-terracotta-300 bg-terracotta-50 text-terracotta-700"
                : "border-green-300 bg-green-50 text-green-700"
            }`}>
            {unreadCount} Unread
          </span>
        </div>
      </div>

      {error && sorted.length === 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 font-mono text-xs text-amber-900">
          <p className="font-bold uppercase tracking-wider">
            Backend Connection Notice:
          </p>
          <p className="mt-1">
            Could not fetch messages from the backend ({error}). Make sure your
            FastAPI admin router exposes <code>GET /api/admin/messages</code>{" "}
            and that <code>schemas.ContactMessageOut</code> allows optional{" "}
            <code>created_at</code>.
          </p>
        </div>
      )}

      {sorted.length === 0 ? (
        <Paper rotate={-0.3} tape className="!p-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-sand-500">
            Inbox Zero
          </p>
          <p className="mt-2 font-display text-2xl text-ink">
            No contact messages yet.
          </p>
          <p className="mt-1 font-body text-sm text-sand-600">
            New messages submitted through your Contact section will appear here
            automatically.
          </p>
        </Paper>
      ) : (
        <div className="flex flex-col gap-4 max-w-full">
          {sorted.map((msg) => (
            <div
              key={msg.id}
              className={`min-w-0 max-w-full overflow-hidden rounded-2xl border p-5 transition-all sm:p-6 ${
                !msg.read
                  ? "border-terracotta-300 bg-ivory shadow-md"
                  : "border-sand-200 bg-ivory/70 opacity-85 hover:opacity-100"
              }`}>
              {/* Top Header Row */}
              <div className="flex flex-col gap-3 border-b border-sand-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {!msg.read ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-terracotta-300 bg-terracotta-50 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-terracotta-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-terracotta-600" />
                        Unread
                      </span>
                    ) : (
                      <span className="rounded-full border border-sand-200 bg-sand-100 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-sand-600">
                        Read
                      </span>
                    )}

                    <h2 className="truncate font-display text-xl text-ink">
                      {msg.subject?.trim() || "No Subject"}
                    </h2>

                    <span className="font-mono text-[11px] text-sand-400">
                      #{msg.id}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-sand-600">
                    <span className="font-semibold text-ink">{msg.name}</span>
                    <span>·</span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-terracotta-600 underline decoration-terracotta-300 underline-offset-2 hover:text-terracotta-700">
                      {msg.email}
                    </a>
                    <span>·</span>
                    <span className="text-sand-500">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=${encodeURIComponent(
                      `Re: ${msg.subject?.trim() || "Your message"}`,
                    )}`}
                    className="rounded-lg border border-sand-300 bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-ink transition hover:border-terracotta-500 hover:text-terracotta-600">
                    Reply ↗
                  </a>

                  <form action={toggleRead}>
                    <input type="hidden" name="id" value={msg.id} />
                    <input
                      type="hidden"
                      name="read"
                      value={String(Boolean(msg.read))}
                    />
                    <button
                      type="submit"
                      className={`rounded-lg border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
                        msg.read
                          ? "border-sand-300 bg-white text-sand-600 hover:bg-sand-100"
                          : "border-green-400 bg-green-50 text-green-700 hover:bg-green-100"
                      }`}>
                      {msg.read ? "Mark Unread" : "Mark Read"}
                    </button>
                  </form>

                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={msg.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-red-600 transition hover:border-red-300 hover:bg-red-50">
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              {/* Message Body */}
              <div className="mt-4 whitespace-pre-wrap break-words rounded-xl border border-sand-200/70 bg-white/80 p-4 font-body text-sm leading-relaxed text-sand-800">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
