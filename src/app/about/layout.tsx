import type { Metadata } from "next";
import { getMetadataForTool } from "@/lib/seo-data";

export const metadata: Metadata = getMetadataForTool("about");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
