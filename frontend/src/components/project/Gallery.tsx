"use client";

import {useState} from "react";
import Paper from "@/components/scrapbook/Paper";
import type {ProjectImage} from "@/lib/api";

export default function Gallery({
  images,
  title,
}: {
  images: ProjectImage[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const current = images[index];

  return (
    <div>
      <Paper tape rotate={-0.6} className="!p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.image_url}
          alt={`${title} screenshot ${index + 1}`}
          className="max-h-[70vh] w-full rounded-sm bg-sand-50 object-contain"
        />
      </Paper>

      {images.length > 1 && (
        <div className="mt-5 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === index}
              className={`overflow-hidden rounded-sm border-2 transition ${
                i === index
                  ? "border-terracotta-600"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt=""
                className="h-16 w-24 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
