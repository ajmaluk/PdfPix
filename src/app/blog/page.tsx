import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/lib/blog-data";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export default function BlogPage() {
  const featuredPost = blogPosts[0];

  const blogIndexSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} Blog`,
    url: `${SITE_URL}/blog`,
    description:
      "Guides about PDF tools, browser-first workflows, AI trends, founder stories, and the UTHAKKAN product ecosystem.",
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      description: post.description,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexSchema) }} />
      <Header />
      <main
        className="min-h-screen pb-24"
        style={{ background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 36%)", paddingTop: "calc(var(--header-height) + 48px)" }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <section
            className="mb-10 overflow-hidden rounded-3xl p-8 md:p-12"
            style={{ border: "1px solid var(--color-border)", background: "#ffffff", boxShadow: "0 20px 60px rgba(15, 23, 42, 0.07)" }}
          >
            <div className="mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]" style={{ background: "rgba(17, 117, 239, 0.1)", color: "var(--color-primary)" }}>
              PdfPix Blog
            </div>
            <h1
              className="mb-4 text-4xl font-semibold tracking-[-0.03em] md:text-5xl"
              style={{ color: "var(--color-dark)", lineHeight: 1.08, fontFamily: 'var(--font-nobile), "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              Better guides for PDF workflows, browser tools, and the UTHAKKAN product ecosystem
            </h1>
            <p className="max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
              Explore practical articles about PDF tools, privacy-first workflows, AI-assisted browser software, product direction, and the people building the ecosystem behind PdfPix.
            </p>
          </section>

          <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="block rounded-3xl p-8 transition duration-200 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, rgba(17,117,239,0.10), rgba(255,255,255,1))", border: "1px solid var(--color-border)" }}
            >
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-primary)" }}>
                Featured Article
              </div>
              <h2
                className="mb-3 text-3xl font-semibold tracking-[-0.03em]"
                style={{ color: "var(--color-dark)", fontFamily: 'var(--font-nobile), "Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {featuredPost.title}
              </h2>
              <p className="mb-6 max-w-2xl text-sm leading-7 text-gray-600">{featuredPost.description}</p>
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <span>{featuredPost.category}</span>
                <span>{featuredPost.readTime}</span>
                <span>{featuredPost.publishedAt}</span>
              </div>
            </Link>

            <div className="rounded-3xl p-8" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <h2
                className="mb-4 text-2xl font-semibold tracking-[-0.02em]"
                style={{ color: "var(--color-dark)", fontFamily: 'var(--font-nobile), "Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Topics covered
              </h2>
              <ul className="space-y-3 text-sm leading-7 text-gray-600">
                <li>PDF workflow guides for merging, splitting, converting, securing, and exporting documents</li>
                <li>Trending browser-first and AI-assisted workflow ideas in 2026</li>
                <li>Founder and company context around Muhammed Ajmal U K and UTHAKKAN</li>
                <li>Product ecosystem coverage for PdfPix, ToolPix, Joyful, and KallanCop</li>
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-3xl p-6"
                style={{ background: "#ffffff", border: "1px solid var(--color-border)", boxShadow: "0 18px 46px rgba(15, 23, 42, 0.05)" }}
              >
                <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h2
                  className="mb-3 text-2xl font-semibold tracking-[-0.02em]"
                  style={{ color: "var(--color-dark)", fontFamily: 'var(--font-nobile), "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mb-5 text-sm leading-7 text-gray-600">{post.description}</p>
                <Link href={`/blog/${post.slug}`} className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                  Read article
                </Link>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
