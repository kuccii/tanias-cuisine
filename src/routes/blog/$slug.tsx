import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { BreadcrumbSchema } from "@/components/site/BreadcrumbSchema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { marked } from "marked";

const SITE_URL = "https://taniascuisine.rw";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData: post }) => ({
    meta: [
      { title: `${post.title} — Tania's Cuisine & Lounge Blog` },
      { name: "description", content: post.description },
      { property: "og:title", content: post.title },
      { property: "og:description", content: post.description },
      { property: "og:url", content: `${SITE_URL}/blog/${post.slug}` },
      { property: "og:image", content: `${SITE_URL}${post.image}` },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: post.title },
      { name: "twitter:description", content: post.description },
      { name: "twitter:image", content: `${SITE_URL}${post.image}` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog/${post.slug}` }],
  }),
  component: BlogPostPage,
  notFoundComponent: () => (
    <SiteLayout>
      <section className="pt-32 pb-24 px-6 md:px-12 text-center">
        <h1 className="font-display text-5xl mb-4">Post not found</h1>
        <p className="text-foreground/70 mb-8">This blog post doesn't exist or may have been moved.</p>
        <Link to="/blog" className="font-mono-display text-[11px] tracking-[0.25em] uppercase border border-border/60 px-5 py-3 hover:border-primary hover:text-primary transition-colors">
          Back to Blog
        </Link>
      </section>
    </SiteLayout>
  ),
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  const related = getRelatedPosts(post.slug, 3);

  const htmlContent = marked.parse(post.content, { async: false }) as string;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${post.image}`,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Tania's Cuisine & Lounge",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo-CGNwafV6.png` },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Blog", item: `${SITE_URL}/blog` },
          { name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
        ]}
      />
      <article>
        <div className="relative aspect-[2/1] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="mx-auto max-w-[800px] px-6 md:px-12 -mt-32 relative z-10">
          <Link to="/blog" className="font-mono-display text-[10px] tracking-[0.25em] uppercase text-primary hover:text-primary/80 transition-colors">
            &larr; Back to Blog
          </Link>

          <div className="flex items-center gap-4 mt-8 mb-6">
            <span className="font-mono-display text-[9px] tracking-[0.25em] uppercase text-primary border border-primary/30 px-3 py-1">
              {post.category}
            </span>
            <span className="text-foreground/40 text-[10px] font-mono-display">{post.readingTime} min read</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl text-balance mb-6">
            {post.title}
          </h1>

          <time className="block text-sm text-foreground/50 mb-12">
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>

          <div
            className="prose prose-invert max-w-none prose-headings:font-display prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-primary prose-pre:bg-card prose-pre:border prose-pre:border-border/40"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section className="pb-24 px-6 md:px-12 border-t border-border/20 pt-16">
          <div className="mx-auto max-w-[1500px]">
            <h2 className="font-display text-3xl mb-10 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="group block bg-card border border-border/40 hover:border-primary/50 transition-all p-6"
                >
                  <span className="font-mono-display text-[9px] tracking-[0.25em] uppercase text-primary">{r.category}</span>
                  <h3 className="font-display text-lg mt-3 group-hover:text-primary transition-colors">{r.title}</h3>
                  <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-24 px-6 md:px-12 text-center">
        <div className="mx-auto max-w-[600px] bg-card border border-border/40 p-12">
          <h2 className="font-display text-3xl mb-4">Hungry?</h2>
          <p className="text-foreground/70 mb-8 leading-relaxed">
            Ready to experience the flavours you just read about? Browse our menu or book a table.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/menu" className="font-mono-display text-[10px] tracking-[0.25em] uppercase border border-border/60 px-6 py-3 hover:border-primary hover:text-primary transition-colors">
              View Our Menu
            </Link>
            <Link to="/contact" className="font-mono-display text-[10px] tracking-[0.25em] uppercase bg-primary text-primary-foreground px-6 py-3 hover:shadow-glow transition-shadow">
              Book a Table
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
