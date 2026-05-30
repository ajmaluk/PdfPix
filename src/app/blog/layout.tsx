import type { Metadata } from "next";
import { SITE_NAME, SITE_OG_IMAGE, SITE_OG_IMAGE_HEIGHT, SITE_OG_IMAGE_WIDTH, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `Blog | ${SITE_NAME}`,
  description:
    "Read guides about PDF workflows, privacy-first browser tools, AI trends, UTHAKKAN products, and the founder behind PdfPix.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description:
      "Read guides about PDF workflows, privacy-first browser tools, AI trends, UTHAKKAN products, and the founder behind PdfPix.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: SITE_OG_IMAGE_WIDTH,
        height: SITE_OG_IMAGE_HEIGHT,
        alt: `${SITE_NAME} blog`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${SITE_NAME}`,
    description:
      "Read guides about PDF workflows, privacy-first browser tools, AI trends, UTHAKKAN products, and the founder behind PdfPix.",
    images: [SITE_OG_IMAGE],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
