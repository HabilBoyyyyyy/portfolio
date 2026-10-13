"use client";

import {useState, useRef} from "react";

/**
 * Replaces a plain text URL input with a file picker that uploads to
 * /api/admin/upload and stores the resulting URL in a hidden input.
 *
 * The hidden <input name={name}> is included in the parent <form>'s
 * FormData so existing server actions pick it up automatically.
 */
export default function ImageUpload({
  name = "image_url",
  accept = "image/*",
  existingUrl,
  required = false,
}: {
  name?: string;
  accept?: string;
  existingUrl?: string;
  required?: boolean;
}) {
  const [url, setUrl] = useState(existingUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(existingUrl?.trim() || null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    setPreview(URL.createObjectURL(file));
    setError("");
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(null);
      setUrl("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* Visible input the server action reads, allowing manual URL pasting */}
        <input
          type="text"
          name={name}
          value={url}
          required={required}
          onChange={(e) => {
            const val = e.target.value;
            setUrl(val);
            setPreview(val.trim() ? val : null);
          }}
          placeholder="Paste URL or choose file..."
          className="flex-1 rounded border border-sand-300 px-3 py-1.5 text-sm outline-none focus:border-terracotta-600"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded border border-sand-300 bg-ivory px-3 py-1.5 text-sm transition hover:border-terracotta-600 hover:text-terracotta-600 disabled:opacity-50">
          {uploading ? "Uploading…" : "Upload"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-error">{error}</p>}

      {Boolean(preview?.trim()) && !error && (
        <img
          src={preview!}
          alt="Preview"
          onError={() => setPreview(null)} // Hide if invalid pasted URL
          className="h-16 w-auto rounded border border-sand-200 object-contain bg-gray-50"
        />
      )}
    </div>
  );
}
