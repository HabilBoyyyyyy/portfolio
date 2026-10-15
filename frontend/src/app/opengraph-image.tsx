import {ImageResponse} from "next/og";
import fs from "fs";
import path from "path";

export const alt = "Habil Baihaki Ramadhan — Developer & AI Engineer";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

/* ------------------------------------------------------------------ */
/* Design tokens (mirrors the @theme block in your CSS)                */
/* ------------------------------------------------------------------ */
const c = {
  ivory: "#faf6f0",
  ink: "#201c1a",
  terracotta400: "#d9927d",
  terracotta600: "#c1502e",
  green100: "#e6eae7",
  green200: "#c9d2ca",
  green600: "#2f5233",
  green700: "#27432a",
  sand100: "#e4e0db",
  sand600: "#777370",
  sand800: "#4c4845",
};

/* ------------------------------------------------------------------ */
/* Font loading                                                        */
/* ImageResponse only ships with one sans font, so to get a real       */
/* editorial serif we download font files at build/request time.       */
/* If a download fails, we skip it and fall back to the default font.  */
/* ------------------------------------------------------------------ */
async function loadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  // 1. Profile photo -> base64 data URI (same approach as before)
  let profileBase64 = "";
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "images",
      "profile-og.jpg",
    );
    const fileBuffer = fs.readFileSync(filePath);
    profileBase64 = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
  } catch (err) {
    console.error("Could not load profile photo for OG image:", err);
  }

  // 2. Fonts: Instrument Serif (display) + JetBrains Mono (labels)
  const [serifData, monoData] = await Promise.all([
    loadFont(
      "https://cdn.jsdelivr.net/fontsource/fonts/instrument-serif@latest/latin-400-normal.woff",
    ),
    loadFont(
      "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-500-normal.woff",
    ),
  ]);

  const fonts: {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 500;
    style: "normal";
  }[] = [];
  if (serifData)
    fonts.push({
      name: "Instrument Serif",
      data: serifData,
      weight: 400,
      style: "normal",
    });
  if (monoData)
    fonts.push({
      name: "JetBrains Mono",
      data: monoData,
      weight: 500,
      style: "normal",
    });

  const serif = serifData ? "Instrument Serif" : "serif";
  const mono = monoData ? "JetBrains Mono" : "monospace";

  const tags = ["Next.js", "FastAPI", "PostgreSQL", "AI Engineering"];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: c.ivory,
        // Soft warm glow top-right, soft green glow bottom-left
        backgroundImage: `radial-gradient(circle at 88% 12%, rgba(193,80,46,0.16) 0%, rgba(193,80,46,0) 42%), radial-gradient(circle at 0% 100%, rgba(47,82,51,0.12) 0%, rgba(47,82,51,0) 45%)`,
        position: "relative",
      }}>
      {/* Thin editorial frame */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
          border: `1px solid ${c.sand100}`,
          borderRadius: 18,
        }}
      />

      {/* ───────────── Left column ───────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: 690,
        }}>
        {/* Top: monogram + role label */}
        <div style={{display: "flex", alignItems: "center", gap: 16}}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 46,
              height: 46,
              borderRadius: 12,
              backgroundColor: c.ink,
              color: c.ivory,
              fontFamily: serif,
              fontSize: 26,
            }}>
            HB
          </div>
          <span
            style={{
              fontFamily: mono,
              fontSize: 15,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: c.terracotta600,
            }}>
            Informatics Student · Web Dev · AI
          </span>
        </div>

        {/* Middle: name + tagline */}
        <div style={{display: "flex", flexDirection: "column"}}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: serif,
              fontSize: 98,
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              color: c.ink,
            }}>
            <span>Habil Baihaki</span>
            <span style={{color: c.terracotta600}}>Ramadhan.</span>
          </div>

          <p
            style={{
              fontSize: 25,
              lineHeight: 1.45,
              color: c.sand800,
              margin: 0,
              marginTop: 24,
              maxWidth: 580,
            }}>
            Developer &amp; AI engineer building thoughtful digital experiences.
          </p>
        </div>

        {/* Bottom: tech chips + URL */}
        <div style={{display: "flex", flexDirection: "column", gap: 24}}>
          <div style={{display: "flex", flexWrap: "wrap", gap: 10}}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: c.green100,
                  border: `1px solid ${c.green200}`,
                  color: c.green700,
                  padding: "7px 14px",
                  borderRadius: 999,
                  fontFamily: mono,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    backgroundColor: c.green600,
                  }}
                />
                {tag}
              </div>
            ))}
          </div>

          <div style={{display: "flex"}}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                backgroundColor: c.ink,
                color: c.ivory,
                padding: "11px 22px",
                borderRadius: 999,
                fontFamily: mono,
                fontSize: 16,
                letterSpacing: "0.06em",
              }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  backgroundColor: c.terracotta400,
                }}
              />
              habilboy.vercel.app
            </div>
          </div>
        </div>
      </div>

      {/* ───────────── Right column: arch photo ───────────── */}
      <div
        style={{
          display: "flex",
          position: "relative",
          width: 390,
          height: 500,
        }}>
        {/* Terracotta ring (decorative) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 140,
            height: 140,
            borderRadius: 999,
            border: `3px solid ${c.terracotta600}`,
            opacity: 0.55,
          }}
        />

        {/* Green arch, offset behind the photo */}
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 68,
            width: 320,
            height: 440,
            borderTopLeftRadius: 160,
            borderTopRightRadius: 160,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            backgroundColor: c.green600,
          }}
        />

        {/* Photo in an arch frame */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 30,
            width: 320,
            height: 440,
            display: "flex",
            overflow: "hidden",
            borderTopLeftRadius: 160,
            borderTopRightRadius: 160,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            border: `6px solid ${c.ivory}`,
            backgroundColor: c.sand100,
          }}>
          {profileBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profileBase64}
              alt="Habil Baihaki Ramadhan"
              width={308}
              height={428}
              style={{objectFit: "cover"}}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: c.terracotta600,
                fontFamily: serif,
                fontSize: 120,
              }}>
              H
            </div>
          )}
        </div>

        {/* Tilted sticker (nods to the scrapbook layout) */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: 0,
            display: "flex",
            alignItems: "center",
            backgroundColor: c.terracotta600,
            color: c.ivory,
            padding: "10px 18px",
            borderRadius: 10,
            fontFamily: mono,
            fontSize: 14,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transform: "rotate(-5deg)",
            boxShadow: "0 10px 24px rgba(32, 28, 26, 0.22)",
          }}>
          Portfolio
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts,
    },
  );
}
