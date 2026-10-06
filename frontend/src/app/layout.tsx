import type {Metadata} from "next";
import {Fraunces, DM_Sans, IBM_Plex_Mono} from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({subsets: ["latin"], variable: "--font-fraunces"});
const dmSans = DM_Sans({subsets: ["latin"], variable: "--font-dm-sans"});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Habil Baihaki Ramadhan — Informatics Student & Web Developer",
  description:
    "Portfolio of Habil Baihaki Ramadhan: web development, AI engineering, and more.",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
