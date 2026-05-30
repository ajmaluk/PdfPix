import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPostMap, blogPosts } from "@/lib/blog-data";
import {
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_WIDTH,
  SITE_URL,
} from "@/lib/site";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostMap.get(slug);
  if (!post) {
    return {};
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: [
        {
          url: SITE_OG_IMAGE,
          width: SITE_OG_IMAGE_WIDTH,
          height: SITE_OG_IMAGE_HEIGHT,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${SITE_NAME}`,
      description: post.description,
      images: [SITE_OG_IMAGE],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPostMap.get(slug);
  if (!post) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const relatedPosts = blogPosts.filter((entry) => entry.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    author: {
      "@type": "Person",
      name: "Muhammed Ajmal U K",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    image: {
      "@type": "ImageObject",
      url: SITE_OG_IMAGE,
      width: SITE_OG_IMAGE_WIDTH,
      height: SITE_OG_IMAGE_HEIGHT,
    },
    keywords: post.keywords.join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Header />
      <main
        className="min-h-screen pb-24"
        style={{ background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 36%)", paddingTop: "calc(var(--header-height) + 48px)" }}
      >
        <article className="mx-auto max-w-4xl px-4">
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-gray-500">
              <li><Link href="/" style={{ color: "var(--color-primary)" }}>Home</Link></li>
              <li>/</li>
              <li><Link href="/blog" style={{ color: "var(--color-primary)" }}>Blog</Link></li>
              <li>/</li>
              <li aria-current="page" style={{ color: "var(--color-dark)" }}>{post.title}</li>
            </ol>
          </nav>

          <header className="mb-10 rounded-3xl p-8 md:p-12" style={{ background: "#ffffff", border: "1px solid var(--color-border)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)" }}>
            <div className="mb-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              <span>{post.category}</span>
              <span>{post.readTime}</span>
              <span>Published {post.publishedAt}</span>
              {post.updatedAt ? <span>Updated {post.updatedAt}</span> : null}
            </div>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl" style={{ color: "var(--color-dark)", lineHeight: 1.1 }}>
              {post.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-gray-600 md:text-lg">{post.description}</p>
          </header>

          <div className="space-y-8">
            {post.sections.map((section) => (
              <section key={section.heading} className="rounded-3xl p-8" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
                <h2 className="mb-4 text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-8 text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-gray-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span style={{ color: "var(--color-primary)" }}>•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          {post.featuredToolPaths?.length ? (
            <section className="mt-10 rounded-3xl p-8" style={{ background: "#fcfeff", border: "1px solid var(--color-border)" }}>
              <h2 className="mb-4 text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
                Related tools on {SITE_NAME}
              </h2>
              <div className="flex flex-wrap gap-3">
                {post.featuredToolPaths.map((path) => (
                  <Link
                    key={path}
                    href={path}
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                    style={{ background: "rgba(17, 117, 239, 0.08)", color: "var(--color-primary)" }}
                  >
                    {path.replace("/", "").replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {post.sources?.length ? (
            <section className="mt-10 rounded-3xl p-8" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
              <h2 className="mb-4 text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
                Source references
              </h2>
              <ul className="space-y-3 text-sm leading-7 text-gray-700">
                {post.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-10 rounded-3xl p-8" style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}>
            <h2 className="mb-5 text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-dark)" }}>
              Continue reading
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {relatedPosts.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/blog/${entry.slug}`}
                  className="rounded-2xl p-5 transition duration-200 hover:shadow-md"
                  style={{ background: "#fcfeff", border: "1px solid var(--color-border)" }}
                >
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{entry.category}</div>
                  <h3 className="mb-2 text-lg font-bold" style={{ color: "var(--color-dark)" }}>{entry.title}</h3>
                  <p className="text-sm leading-7 text-gray-600">{entry.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
