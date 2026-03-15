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
  title: "PleoChrome — Verified from Every Angle",
  description:
    "PleoChrome is the orchestration platform that transforms high-value colored gemstones into compliant, tokenized digital securities through institutional-grade verification infrastructure.",
  keywords: [
    "gemstone tokenization",
    "digital assets",
    "trust infrastructure",
    "colored gemstones",
    "asset tokenization",
    "blockchain compliance",
  ],
  authors: [{ name: "PleoChrome" }],
  openGraph: {
    title: "PleoChrome — Verified from Every Angle",
    description:
      "The orchestration platform for tokenized precious assets. Institutional-grade trust infrastructure for high-value colored gemstones.",
    url: "https://pleochrome.com",
    siteName: "PleoChrome",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PleoChrome — Verified from Every Angle",
    description:
      "The orchestration platform for tokenized precious assets.",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
