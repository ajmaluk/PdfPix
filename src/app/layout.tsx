import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pdfpix.com"),
  title: "PdfPix | Online PDF tools for PDF lovers",
  description:
    "PdfPix is an online service to work with PDF files completely free and easy to use. Merge PDF, split PDF, compress PDF, office to PDF, PDF to JPG and more!",
  keywords:
    "Merge PDF, split PDF, combine PDF, extract PDF, compress PDF, convert PDF, Word to PDF, Excel to PDF, Powerpoint to PDF, PDF to JPG, JPG to PDF",
  icons: {
    icon: "/img/favicon.svg",
    apple: "/img/icon.svg",
  },
  openGraph: {
    title: "PdfPix | Online PDF tools for PDF lovers",
    description:
      "PdfPix is an online service to work with PDF files completely free and easy to use.",
    siteName: "PdfPix",
    type: "website",
    url: "https://pdfpix.com",
    images: [{ url: "/img/pdfpix.svg", width: 300, height: 75 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PdfPix | Online PDF tools for PDF lovers",
    description:
      "PdfPix is an online service to work with PDF files completely free and easy to use.",
    images: ["/img/pdfpix.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>{children}</body>
    </html>
  );
}
