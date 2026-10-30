import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import Starfield from "@/components/Starfield";
import "./globals.css";

const display = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["500", "700", "800"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ohappy.ru"),
  title: "ohappy — песня-поздравление по вашей истории за 2 минуты",
  description:
    "Расскажите о человеке — и получите персональную песню с его именем и вашими историями. Создать и послушать бесплатно, платите только если понравилось.",
  openGraph: { siteName: "ohappy", locale: "ru_RU", type: "website" },
};

export const viewport: Viewport = { themeColor: "#fff4f7", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>
        <Starfield />
        {children}
      </body>
    </html>
  );
}
