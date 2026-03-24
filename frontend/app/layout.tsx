import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:       "DepoFi — Members-Only Lending",
  description: "Invite-only short-term USDT yield protocol on Tron. High returns, zero fluff.",
  keywords:    ["depofi", "tron", "usdt", "lending", "defi", "yield"],
  openGraph: {
    title:       "DepoFi",
    description: "Invite-only USDT lending on Tron. Up to 16% in 30 days.",
    type:        "website",
  },
};

export const viewport: Viewport = {
  width:              "device-width",
  initialScale:       1,
  maximumScale:       1,
  themeColor:         "#0A0A0F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
