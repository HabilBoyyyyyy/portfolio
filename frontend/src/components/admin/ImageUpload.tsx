"use client";

import {useState, useRef} from "react";

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

  function compressAndProcessFile(file: File) {
    setError("");
    setUploading(true);

    // If it's a PDF (e.g. Resume)
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUrl(result);
        setPreview(null);
        setUploading(false);
      };
      reader.onerror = () => {
        setError("Failed to read PDF file.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    // If it's an image, resize & compress to lightweight WebP data URL
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const maxDimension = 1200;
        let {width, height} = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not initialize canvas context.");
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as WebP
        const dataUrl = canvas.toDataURL("image/webp", 0.82);

        setUrl(dataUrl);
        setPreview(dataUrl);
        setUploading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Compression failed.");
        setUploading(false);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError("Failed to load image.");
      setUploading(false);
    };

    img.src = objectUrl;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      compressAndProcessFile(file);
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
          className="flex-1 min-w-0 rounded border border-sand-300 px-3 py-1.5 text-sm outline-none focus:border-terracotta-600 font-mono"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded border border-sand-300 bg-ivory px-3 py-1.5 text-sm transition hover:border-terracotta-600 hover:text-terracotta-600 disabled:opacity-50">
          {uploading ? "Processing…" : "Upload"}
        </button>

        {url && (
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setPreview(null);
            }}
            className="text-xs text-sand-500 hover:text-terracotta-600 underline">
            Clear
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {Boolean(preview?.trim()) && !error && (
        <div className="mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview!}
            alt="Preview"
            onError={() => setPreview(null)}
            className="h-20 w-auto rounded border border-sand-200 object-contain bg-sand-100 p-1"
          />
        </div>
      )}
    </div>
  );
}
