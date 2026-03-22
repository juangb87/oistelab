import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Hontley — AI Concierge Setup for Small Businesses",
  description:
    "We build custom AI assistants for small businesses — on WhatsApp, Telegram, or SMS. Ready in days, not months.",
  openGraph: {
    title: "Hontley — AI Concierge Setup for Small Businesses",
    description:
      "We build custom AI assistants for small businesses — on WhatsApp, Telegram, or SMS. Ready in days, not months.",
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
    <html lang="en" className={jakarta.variable}>
      <body style={{ fontFamily: "var(--font-jakarta), sans-serif" }}>{children}</body>
    </html>
  );
}
