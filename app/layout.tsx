import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import IconSprite from "@/components/IconSprite";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollFX from "@/components/ScrollFX";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233B82F6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2 3 14h9l-1 8 10-12h-9l1-8z'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  metadataBase: new URL("https://origindb.org"),
  title: {
    default: "OriginDB — lightweight real-time app server",
    template: "%s — OriginDB",
  },
  description:
    "OriginDB is an open-source realtime WebSocket database where your application logic runs inside the database as sandboxed WebAssembly reducers, streamed to clients over a SQL-filtered changefeed and made durable by a group-commit WAL.",
  icons: { icon: FAVICON },
  openGraph: {
    type: "website",
    url: "https://origindb.org",
    title: "OriginDB — lightweight real-time app server",
    description:
      "All-in-one realtime app server: an open-source WebSocket database with user-programmable WASM reducers, a SQL-filtered changefeed, and a durable group-commit WAL. Self-hosted, MIT.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F17",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <IconSprite />
        <Nav />
        {children}
        <Footer />
        <ScrollFX />
      </body>
    </html>
  );
}
