import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { BreadcrumbSchema } from "@/components/site/BreadcrumbSchema";
import { getPostsByPage } from "@/lib/blog";
import { useState } from "react";

const POSTS_PER_PAGE = 9;

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Tania's Cuisine & Lounge | Kigali Dining Guides" },
      { name: "description", content: "Kigali dining guides, catering tips, dish stories, and food culture from Tania's Cuisine & Lounge at M&M Plaza, Gishushu." },
      { property: "og:title", content: "Blog — Tania's Cuisine & Lounge | Kigali Dining Guides" },
      { property: "og:description", content: "Kigali dining guides, catering tips, and dish stories from Tania's Cuisine & Lounge." },
      { property: "og:url", content: "https://taniascuisine.rw/blog" },
      { property: "og:image", content: "https://taniascuisine.rw/og-image.jpg" },
      { name: "twitter:title", content: "Blog — Tania's Cuisine & Lounge" },
      { name: "twitter:description", content: "Kigali dining guides, catering tips, dish stories." },
      { name: "twitter:image", content: "https://taniascuisine.rw/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://taniascuisine.rw/blog" }],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const [page, setPage] = useState(1);
  const { posts, total, hasMore } = getPostsByPage(page, POSTS_PER_PAGE);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <SiteLayout>
      <BreadcrumbSchema items={[{ name: "Home", item: "https://taniascuisine.rw" }, { name: "Blog", item: "https://taniascuisine.rw/blog" }]} />
      <section className="pt-32 pb-24 px-6 md:px-12">
        <div className="mx-auto max-w-[1500px]">
          <p className="eyebrow mb-6">Our Journal</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-3xl text-balance mb-4">
            Kigali Dining <span className="italic text-primary">Guides</span>
          </h1>
          <p className="text-foreground/70 max-w-xl mb-16 leading-relaxed">
            Stories, guides, and tips from Kigali's premier dining and catering destination.
          </p>

          {posts.length === 0 ? (
            <p className="text-foreground/50 text-lg">No posts yet. Check back soon.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="group block bg-card border border-border/40 hover:border-primary/50 transition-all"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                        <span className="font-display text-6xl text-primary/20">{post.title[0]}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono-display text-[9px] tracking-[0.25em] uppercase text-primary">{post.category}</span>
                        <span className="text-foreground/30 text-[10px] font-mono-display">{post.readingTime} min read</span>
                      </div>
                      <h2 className="font-display text-xl text-balance group-hover:text-primary transition-colors mb-3">
                        {post.title}
                      </h2>
                      <p className="text-sm text-foreground/65 leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                      <time className="block mt-4 text-[10px] font-mono-display tracking-[0.15em] uppercase text-foreground/40">
                        {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-16">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="font-mono-display text-[10px] tracking-[0.25em] uppercase border border-border/60 px-5 py-3 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="font-mono-display text-[11px] tracking-[0.15em] text-foreground/50">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => (hasMore ? p + 1 : p))}
                    disabled={!hasMore}
                    className="font-mono-display text-[10px] tracking-[0.25em] uppercase border border-border/60 px-5 py-3 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
