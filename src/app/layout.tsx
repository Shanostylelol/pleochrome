import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PleoChrome — Value from Every Angle",
  description:
    "PleoChrome orchestrates fractional securities, tokenization, and asset-backed lending for high-value colored gemstones — three paths to unlock every dimension of value.",
  keywords: [
    "gemstone tokenization",
    "fractional securities",
    "asset-backed lending",
    "digital assets",
    "trust infrastructure",
    "colored gemstones",
    "asset tokenization",
    "blockchain compliance",
    "debt instruments",
    "RWA",
  ],
  authors: [{ name: "PleoChrome" }],
  openGraph: {
    title: "PleoChrome — Value from Every Angle",
    description:
      "Three paths to value for precious assets: fractional securities, tokenization, and asset-backed lending. Institutional-grade orchestration.",
    url: "https://pleochrome.com",
    siteName: "PleoChrome",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PleoChrome — Value from Every Angle",
    description:
      "Three paths to value for precious assets: fractional securities, tokenization, and asset-backed lending.",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Powerhouse",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body
        className={`${dmSans.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
