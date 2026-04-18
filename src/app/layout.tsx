import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Oistelab Colombia | Automatización de procesos y canales",
  description:
    "Ayudamos a negocios en Colombia a automatizar procesos, atención y canales de comunicación para operar mejor y crecer más rápido.",
  openGraph: {
    title: "Oistelab Colombia | Automatización de procesos y canales",
    description:
      "Ayudamos a negocios en Colombia a automatizar procesos, atención y canales de comunicación para operar mejor y crecer más rápido.",
    url: "https://oistelab.com",
    siteName: "Oistelab",
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
