import { MetadataRoute } from "next";
import { tools } from "@/lib/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pdfpix.com";

  // Static info pages
  const staticRoutes = ["", "/about", "/pricing", "/privacy", "/terms", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Tool pages
  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}${tool.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...toolRoutes];
}
