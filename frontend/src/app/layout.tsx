import type {Metadata} from "next";
import {Fraunces, DM_Sans, IBM_Plex_Mono} from "next/font/google";
import {Analytics} from "@vercel/analytics/next";
import "./globals.css";


const fraunces = Fraunces({subsets: ["latin"], variable: "--font-fraunces"});
const dmSans = DM_Sans({subsets: ["latin"], variable: "--font-dm-sans"});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const SITE_URL = "https://portfolio-peach-alpha-6fjhsx26xs.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Habil Baihaki Ramadhan — Informatics Student & Web Developer",
    template: "%s — Habil Baihaki Ramadhan",
  },
  description:
    "Portfolio of Habil Baihaki Ramadhan — informatics student, full-stack web developer, and AI engineer based in East Bekasi, Indonesia.",
  keywords: [
    "Habil Baihaki Ramadhan",
    "portfolio",
    "web developer",
    "AI engineer",
    "Next.js",
    "FastAPI",
    "fullstack",
    "Indonesia",
  ],
  authors: [{name: "Habil Baihaki Ramadhan", url: SITE_URL}],
  creator: "Habil Baihaki Ramadhan",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Habil Baihaki Ramadhan",
    title: "Habil Baihaki Ramadhan — Informatics Student & Web Developer",
    description:
      "Portfolio of Habil Baihaki Ramadhan — informatics student, full-stack web developer, and AI engineer based in East Bekasi, Indonesia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Habil Baihaki Ramadhan — Informatics Student & Web Developer",
    description:
      "Portfolio of Habil Baihaki Ramadhan — informatics student, full-stack web developer, and AI engineer based in East Bekasi, Indonesia.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${plexMono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>

    </html>
  );
}
