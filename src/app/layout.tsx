import type { Metadata } from "next";
import { Inter, Nobile } from "next/font/google";
import "./globals.css";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_WIDTH,
  SITE_URL,
  getCanonicalUrl,
} from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const nobile = Nobile({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nobile",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | Free PDF Tools Online`,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "pdf tools",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "convert pdf",
    "edit pdf",
    "pdf to word",
    "word to pdf",
    "pdf to jpg",
    "jpg to pdf",
  ],
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/img/favicon.svg",
    apple: "/img/icon.svg",
  },
  openGraph: {
    title: `${SITE_NAME} | Free PDF Tools Online`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: SITE_OG_IMAGE_WIDTH,
        height: SITE_OG_IMAGE_HEIGHT,
        alt: `${SITE_NAME} PDF tools preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Free PDF Tools Online`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} ${nobile.variable}`}>
      <body>{children}</body>
    </html>
  );
}
