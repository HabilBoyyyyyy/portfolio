import {ImageResponse} from "next/og";
import fs from "fs";
import path from "path";

export const alt = "Habil Baihaki Ramadhan — Developer & AI Engineer";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

export default async function Image() {
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 72px",
          backgroundColor: "#FAF6F0",
          fontFamily: "serif",
          position: "relative",
        }}>
        {/* Decorative corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 280,
            height: 280,
            backgroundColor: "#C1502E",
            opacity: 0.08,
            borderBottomLeftRadius: 280,
          }}
        />

        {/* ── Left Column: Text & Badges ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            maxWidth: "680px",
          }}>
          {/* Accent line & role badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}>
            <div
              style={{
                width: "36px",
                height: "3px",
                backgroundColor: "#C1502E",
              }}
            />
            <span
              style={{
                fontSize: "15px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#C1502E",
                fontFamily: "monospace",
                fontWeight: 600,
              }}>
              Informatics Student · Web Developer · AI
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontSize: "66px",
              fontWeight: 700,
              color: "#201C1A",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: "20px",
            }}>
            Habil Baihaki
            <br />
            Ramadhan.
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: "22px",
              color: "#7A6A5A",
              maxWidth: "620px",
              lineHeight: 1.45,
              margin: 0,
              marginBottom: "32px",
            }}>
            Building digital experiences with Next.js, FastAPI &amp; PostgreSQL.
          </p>

          {/* Tech tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "32px",
            }}>
            {["Next.js", "FastAPI", "PostgreSQL", "AI Engineering"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: "#EDE5D8",
                    color: "#4A3E38",
                    padding: "6px 14px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    letterSpacing: "0.05em",
                  }}>
                  {tag}
                </div>
              ),
            )}
          </div>

          {/* URL Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#201C1A",
              color: "#FAF6F0",
              padding: "10px 20px",
              fontSize: "14px",
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              borderRadius: "4px",
            }}>
            portfolio-peach-alpha-6fjhsx26xs.vercel.app
          </div>
        </div>

        {/* ── Right Column: Polaroid Photo Card ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            padding: "16px 16px 24px 16px",
            borderRadius: "4px",
            border: "1px solid #E2D9C8",
            boxShadow: "0 16px 36px rgba(32, 28, 26, 0.12)",
            position: "relative",
          }}>
          {/* Pushpin at the top of polaroid */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              left: "50%",
              marginLeft: "-10px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#C1502E",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              border: "2px solid #FAF6F0",
            }}
          />

          {/* Photo */}
          {profileBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profileBase64}
              alt="Habil Baihaki Ramadhan"
              width={310}
              height={390}
              style={{
                objectFit: "cover",
                borderRadius: "2px",
                border: "1px solid #EDE5D8",
              }}
            />
          ) : (
            <div
              style={{
                width: "310px",
                height: "390px",
                backgroundColor: "#EDE5D8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C1502E",
                fontSize: "72px",
              }}>
              H
            </div>
          )}

          {/* Polaroid caption */}
          <span
            style={{
              marginTop: "16px",
              fontSize: "16px",
              color: "#4A3E38",
              fontFamily: "monospace",
              letterSpacing: "0.1em",
            }}>
            Habil B. Ramadhan
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
