import {ImageResponse} from "next/og";
import fs from "fs";
import path from "path";

export const alt = "Habil Baihaki Ramadhan — Developer & AI Engineer";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

/* ------------------------------------------------------------------ */
/* Full Design Tokens (Mirrors your @theme static palette)             */
/* ------------------------------------------------------------------ */
const c = {
  ivory: "#faf6f0",
  ink: "#201c1a",

  terracotta50: "#fcf6f5",
  terracotta100: "#f8eae6",
  terracotta200: "#efd2c9",
  terracotta300: "#e5b6a7",
  terracotta400: "#d9927d",
  terracotta500: "#cc7054",
  terracotta600: "#c1502e",
  terracotta700: "#9e4226",

  green50: "#f5f6f5",
  green100: "#e6eae7",
  green200: "#c9d2ca",
  green500: "#547158",
  green600: "#2f5233",
  green700: "#27432a",
  green800: "#1f3622",

  sand50: "#efebe5",
  sand100: "#e4e0db",
  sand200: "#cecac5",
  sand300: "#b9b5b0",
  sand500: "#8d8985",
  sand600: "#777370",
  sand700: "#615d5a",
  sand800: "#4c4845",
  sand900: "#36322f",
};

/* ------------------------------------------------------------------ */
/* Font Loader                                                         */
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
  // 1. Load profile image from public/images/profile-og.jpg
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

  // 2. Load 4 font styles: Serif (Normal + Italic), Sans (Medium), Mono (Medium)
  const [serifRegular, serifItalic, sansMedium, monoMedium] = await Promise.all(
    [
      loadFont(
        "https://cdn.jsdelivr.net/fontsource/fonts/instrument-serif@latest/latin-400-normal.woff",
      ),
      loadFont(
        "https://cdn.jsdelivr.net/fontsource/fonts/instrument-serif@latest/latin-400-italic.woff",
      ),
      loadFont(
        "https://cdn.jsdelivr.net/fontsource/fonts/plus-jakarta-sans@latest/latin-500-normal.woff",
      ),
      loadFont(
        "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-500-normal.woff",
      ),
    ],
  );

  const fonts: {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 500;
    style: "normal" | "italic";
  }[] = [];

  if (serifRegular) {
    fonts.push({
      name: "Instrument Serif",
      data: serifRegular,
      weight: 400,
      style: "normal",
    });
  }
  if (serifItalic) {
    fonts.push({
      name: "Instrument Serif",
      data: serifItalic,
      weight: 400,
      style: "italic",
    });
  }
  if (sansMedium) {
    fonts.push({
      name: "Plus Jakarta Sans",
      data: sansMedium,
      weight: 500,
      style: "normal",
    });
  }
  if (monoMedium) {
    fonts.push({
      name: "JetBrains Mono",
      data: monoMedium,
      weight: 500,
      style: "normal",
    });
  }

  const serif = serifRegular ? "Instrument Serif" : "serif";
  const sans = sansMedium ? "Plus Jakarta Sans" : "sans-serif";
  const mono = monoMedium ? "JetBrains Mono" : "monospace";

  const tags = ["Next.js", "FastAPI", "PostgreSQL", "AI Engineering"];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "28px",
        backgroundColor: c.ivory,
        backgroundImage: `
            radial-gradient(circle at 12% 18%, rgba(217, 146, 125, 0.18) 0%, rgba(217, 146, 125, 0) 45%),
            radial-gradient(circle at 88% 85%, rgba(47, 82, 51, 0.14) 0%, rgba(47, 82, 51, 0) 50%)
          `,
        fontFamily: sans,
        color: c.ink,
        position: "relative",
      }}>
      {/* ───────────── Outer Editorial Bento Container ───────────── */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: `1.5px solid ${c.sand200}`,
          borderRadius: "24px",
          backgroundColor: "rgba(250, 246, 240, 0.65)",
          overflow: "hidden",
          position: "relative",
        }}>
        {/* Decorative background grid lines for technical depth */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "720px",
            width: "1.5px",
            backgroundColor: c.sand100,
            display: "flex",
          }}
        />

        {/* ───────────── 1. Top Status Bar ───────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 44px",
            borderBottom: `1.5px solid ${c.sand100}`,
            backgroundColor: "rgba(239, 235, 229, 0.45)",
          }}>
          {/* Left: Monogram + Name Handle */}
          <div style={{display: "flex", alignItems: "center", gap: "14px"}}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                backgroundColor: c.ink,
                color: c.ivory,
                fontFamily: serif,
                fontSize: "22px",
                boxShadow: "0 2px 8px rgba(32, 28, 26, 0.12)",
              }}>
              HB
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "13px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: c.sand700,
                }}>
                Informatics · Web · AI
              </span>
            </div>
          </div>

          {/* Right: Live Availability Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: c.green50,
              border: `1px solid ${c.green200}`,
              padding: "7px 16px",
              borderRadius: "999px",
            }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: c.green600,
              }}
            />
            <span
              style={{
                fontFamily: mono,
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: c.green800,
              }}>
              Available for Projects
            </span>
          </div>
        </div>

        {/* ───────────── 2. Main Center Stage ───────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
            padding: "0 44px",
            position: "relative",
          }}>
          {/* Left Column: Editorial Typography */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "630px",
              paddingRight: "24px",
            }}>
            {/* Eyebrow Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}>
              <div
                style={{
                  width: "28px",
                  height: "2px",
                  backgroundColor: c.terracotta600,
                }}
              />
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "14px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: c.terracotta600,
                }}>
                Developer &amp; AI Engineer
              </span>
            </div>

            {/* Hero Display Name */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: serif,
                fontSize: "92px",
                lineHeight: 0.94,
                letterSpacing: "-0.025em",
                color: c.ink,
              }}>
              <span>Habil Baihaki</span>
              <div
                style={{display: "flex", alignItems: "baseline", gap: "14px"}}>
                <span
                  style={{
                    fontStyle: serifItalic ? "italic" : "normal",
                    color: c.terracotta600,
                  }}>
                  Ramadhan.
                </span>
              </div>
            </div>

            {/* Bio Statement */}
            <p
              style={{
                fontFamily: sans,
                fontSize: "22px",
                lineHeight: 1.5,
                color: c.sand800,
                margin: 0,
                marginTop: "24px",
                maxWidth: "540px",
              }}>
              Crafting intelligent systems, scalable backend architectures, and
              refined web interfaces with editorial precision.
            </p>
          </div>

          {/* Right Column: Layered Tactile Portrait Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "380px",
              height: "360px",
              position: "relative",
            }}>
            {/* Decorative Terracotta Orbit Ring */}
            <div
              style={{
                position: "absolute",
                top: "-14px",
                right: "8px",
                width: "110px",
                height: "110px",
                borderRadius: "999px",
                border: `2px solid ${c.terracotta300}`,
                display: "flex",
              }}
            />

            {/* Layer 1: Warm Sand Offset Backing Card */}
            <div
              style={{
                position: "absolute",
                top: "26px",
                left: "52px",
                width: "290px",
                height: "320px",
                borderRadius: "28px",
                backgroundColor: c.sand50,
                border: `1.5px solid ${c.sand200}`,
                transform: "rotate(3deg)",
                display: "flex",
              }}
            />

            {/* Layer 2: Deep Forest Green Accent Block */}
            <div
              style={{
                position: "absolute",
                top: "18px",
                left: "42px",
                width: "290px",
                height: "320px",
                borderRadius: "26px",
                backgroundColor: c.green700,
                transform: "rotate(-2deg)",
                display: "flex",
              }}
            />

            {/* Layer 3: Main Portrait Frame */}
            <div
              style={{
                position: "relative",
                width: "290px",
                height: "320px",
                borderRadius: "24px",
                overflow: "hidden",
                border: `6px solid ${c.ivory}`,
                backgroundColor: c.sand100,
                boxShadow: "0 20px 40px rgba(32, 28, 26, 0.16)",
                display: "flex",
              }}>
              {profileBase64 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileBase64}
                  alt="Habil Baihaki Ramadhan"
                  width={278}
                  height={308}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: c.terracotta50,
                    color: c.terracotta600,
                    fontFamily: serif,
                    fontSize: "110px",
                  }}>
                  H
                </div>
              )}
            </div>

            {/* Floating Editorial Corner Badge */}
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: c.ink,
                color: c.ivory,
                padding: "9px 16px",
                borderRadius: "12px",
                border: `2px solid ${c.ivory}`,
                boxShadow: "0 10px 24px rgba(32, 28, 26, 0.22)",
              }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: c.terracotta500,
                }}
              />
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                Selected Works
              </span>
            </div>
          </div>
        </div>

        {/* ───────────── 3. Bottom Metadata & Tech Dock ───────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 44px",
            borderTop: `1.5px solid ${c.sand100}`,
            backgroundColor: "rgba(239, 235, 229, 0.45)",
          }}>
          {/* Left: Tech Stack Pills */}
          <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
            <span
              style={{
                fontFamily: mono,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: c.sand600,
                marginRight: "6px",
              }}>
              Stack //
            </span>
            {tags.map((tag, idx) => {
              const isAI = idx === tags.length - 1;
              return (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    backgroundColor: isAI ? c.terracotta100 : c.ivory,
                    border: `1px solid ${isAI ? c.terracotta300 : c.sand200}`,
                    color: isAI ? c.terracotta700 : c.sand900,
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontFamily: mono,
                    fontSize: "13px",
                    letterSpacing: "0.03em",
                  }}>
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "999px",
                      backgroundColor: isAI ? c.terracotta600 : c.green600,
                    }}
                  />
                  {tag}
                </div>
              );
            })}
          </div>

          {/* Right: Website URL CTA Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: c.ink,
              color: c.ivory,
              padding: "9px 20px",
              borderRadius: "999px",
              fontFamily: mono,
              fontSize: "14px",
              letterSpacing: "0.05em",
            }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: c.terracotta400,
              }}
            />
            <span>habilboy.vercel.app</span>
            <span style={{color: c.terracotta400, marginLeft: "2px"}}>↗</span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts,
    },
  );
}
