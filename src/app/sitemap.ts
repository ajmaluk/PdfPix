import { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { getCanonicalUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static info pages
  const staticRoutes = ["", "/about", "/pricing", "/privacy", "/terms", "/contact", "/sponsor", "/donate", "/founder"].map((route) => ({
    url: getCanonicalUrl(route || "/"),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Tool pages
  const toolRoutes = tools.map((tool) => ({
    url: getCanonicalUrl(tool.path),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...toolRoutes];
}
