import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";
import { SITE_URL, staticPagePaths } from "@/lib/site";
import { tools } from "@/lib/tools";

export const dynamic = "force-static";

const DEFAULT_LAST_MODIFIED = "2026-05-30";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = Object.values(staticPagePaths).map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: path === "/blog" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/blog" ? 0.8 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticEntries, ...blogEntries, ...toolEntries];
}
