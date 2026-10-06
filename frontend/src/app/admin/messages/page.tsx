import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";

async function markRead(formData: FormData) {
  "use server";
  await adminFetch(`/api/admin/messages/${formData.get("id")}/read`, {
    method: "PUT",
  });
  revalidatePath("/admin/messages");
}

export default async function MessagesAdminPage() {
  let messages: any[] = [];
  try {
    messages = await adminFetch("/api/admin/messages");
  } catch {
    messages = [];
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">Contact Messages</h1>
      {messages.length === 0 && (
        <p className="text-sm text-gray-500">No messages yet.</p>
      )}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-4 border rounded-lg bg-white ${!msg.read ? "border-[#C1502E]" : ""}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                {msg.name}{" "}
                <span className="text-sm text-gray-400">
                  &lt;{msg.email}&gt;
                </span>
              </p>
              {msg.subject && (
                <p className="text-sm text-gray-500">{msg.subject}</p>
              )}
              <p className="text-sm mt-1">{msg.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
            {!msg.read && (
              <form action={markRead}>
                <input type="hidden" name="id" value={msg.id} />
                <button
                  type="submit"
                  className="text-xs px-2 py-1 border rounded">
                  Mark read
                </button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
