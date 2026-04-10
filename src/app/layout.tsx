import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Hontley Colombia | Bots con OpenClaw para negocios",
  description:
    "Implementamos bots y asistentes con OpenClaw para negocios en Colombia, conectados a WhatsApp, Telegram y más. Listos en días, no en meses.",
  openGraph: {
    title: "Hontley Colombia | Bots con OpenClaw para negocios",
    description:
      "Implementamos bots y asistentes con OpenClaw para negocios en Colombia, conectados a WhatsApp, Telegram y más. Listos en días, no en meses.",
    url: "https://hontley.com",
    siteName: "Hontley",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body style={{ fontFamily: "var(--font-jakarta), sans-serif" }}>{children}</body>
    </html>
  );
}
