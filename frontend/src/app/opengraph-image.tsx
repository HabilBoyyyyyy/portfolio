import {ImageResponse} from "next/og";

export const alt = "Habil Baihaki Ramadhan — Portfolio";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "72px 80px",
          backgroundColor: "#FAF6F0",
          fontFamily: "serif",
          position: "relative",
        }}>
        {/* Decorative top-right corner block */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 320,
            height: 320,
            backgroundColor: "#C1502E",
            opacity: 0.12,
            borderBottomLeftRadius: 320,
          }}
        />

        {/* Terracotta accent line */}
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 80,
            width: 48,
            height: 4,
            backgroundColor: "#C1502E",
          }}
        />

        {/* Role label */}
        <p
          style={{
            fontSize: 18,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#C1502E",
            marginBottom: 16,
            fontFamily: "monospace",
          }}>
          Informatics Student · Web Developer · AI Engineer
        </p>

        {/* Name */}
        <h1
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#201C1A",
            lineHeight: 1,
            marginBottom: 24,
          }}>
          Habil Baihaki
          <br />
          Ramadhan.
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: 24,
            color: "#7A6A5A",
            maxWidth: 700,
            lineHeight: 1.5,
          }}>
          Building digital experiences with Next.js, FastAPI &amp; PostgreSQL.
        </p>

        {/* URL badge */}
        <div
          style={{
            position: "absolute",
            bottom: 72,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#201C1A",
            color: "#FAF6F0",
            padding: "12px 24px",
            fontSize: 16,
            fontFamily: "monospace",
            letterSpacing: "0.1em",
          }}>
          portfolio-peach-alpha-6fjhsx26xs.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
