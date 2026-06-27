# Blog Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Markdown-powered blog to Tania's Cuisine & Lounge website with listing, single-post pages, Article schema, breadcrumbs, and navigation.

**Architecture:** Blog posts are `.md` files in `src/content/blog/` with YAML frontmatter, loaded at build time via Vite's `import.meta.glob`. Two new TanStack Router routes (`/blog` and `/blog/:slug`). No runtime dependencies for rendering — `gray-matter` for frontmatter parsing, `marked` for markdown-to-HTML conversion, both run at build time.

**Tech Stack:** React 19, TypeScript 5, Vite 7, TanStack Router, gray-matter, marked

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install gray-matter and marked**

Run:
```bash
npm install gray-matter marked
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gray-matter and marked for blog markdown parsing"
```

---

### Task 2: Create Blog Data Loader

**Files:**
- Create: `src/lib/blog.ts`

This utility loads all markdown files from `src/content/blog/` at build time, parses frontmatter, and exports helper functions for the routes.

- [ ] **Step 1: Create `src/lib/blog.ts`**

```typescript
import { readFileSync } from "fs";
import { join } from "path";

interface BlogPostMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  readingTime: number;
  published: boolean;
}

interface BlogPost extends BlogPostMeta {
  content: string;
}

const CONTENT_DIR = join(process.cwd(), "src", "content", "blog");

const MODULES = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") {
    return { data: {}, content: raw };
  }
  const endIndex = lines.indexOf("---", 1);
  if (endIndex === -1) {
    return { data: {}, content: raw };
  }
  const frontmatterLines = lines.slice(1, endIndex);
  const content = lines.slice(endIndex + 1).join("\n").trim();
  const data: Record<string, unknown> = {};
  for (const line of frontmatterLines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value: unknown = line.slice(colonIndex + 1).trim();
    if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (!isNaN(Number(value))) value = Number(value);
    else if ((value as string).startsWith("[") && (value as string).endsWith("]")) {
      value = (value as string).slice(1, -1).split(",").map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
    }
    data[key] = value;
  }
  return { data, content };
}

function getAllPostsRaw(): BlogPost[] {
  const posts: BlogPost[] = [];
  for (const [path, raw] of Object.entries(MODULES)) {
    const { data, content } = parseFrontmatter(raw);
    if (data.published === false) continue;
    posts.push({
      title: data.title as string,
      slug: data.slug as string,
      description: data.description as string,
      date: data.date as string,
      author: data.author as string,
      category: data.category as string,
      tags: data.tags as string[],
      image: data.image as string,
      readingTime: data.readingTime as number,
      content,
    });
  }
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

let _cached: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (!_cached) {
    _cached = getAllPostsRaw();
  }
  return _cached;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  return getAllPosts()
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, count);
}

export function getPostsByPage(page: number, perPage = 9): { posts: BlogPost[]; total: number; hasMore: boolean } {
  const all = getAllPosts();
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    posts: all.slice(start, end),
    total: all.length,
    hasMore: end < all.length,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/blog.ts
git commit -m "feat: add blog data loader with frontmatter parsing and pagination"
```

---

### Task 3: Create Sample Blog Post

**Files:**
- Create: `src/content/blog/corporate-catering-kigali.md`

- [ ] **Step 1: Create the directory and first sample post**

```bash
mkdir -p src/content/blog
```

Create `src/content/blog/corporate-catering-kigali.md`:

```markdown
---
title: "The Complete Guide to Corporate Catering in Kigali"
slug: corporate-catering-kigali
description: "Planning a corporate event in Kigali? From buffet logistics to per-person budgets, this guide covers everything you need to know about corporate catering — and why Tania's is the trusted choice for 8+ institutional clients."
date: 2026-06-27
author: "Tania's Cuisine & Lounge"
category: "events"
tags:
  - corporate catering
  - Kigali events
  - event planning
  - buffet delivery
image: /blog/corporate-catering-kigali.jpg
readingTime: 6
published: true
---

## Why Corporate Catering Matters in Kigali

Kigali's business scene is growing fast. With new offices,
conferences, and corporate events happening every week, the demand for
reliable, high-quality catering has never been higher.

Whether you're hosting a board meeting for 20 executives or a company
retreat for 500 staff, the food you serve reflects your brand. That's
why choosing the right caterer is one of the most important decisions
you'll make for your event.

## What to Look for in a Corporate Caterer

### 1. Reliability Above All

Your event runs on a schedule. A caterer who shows up late or serves
cold food damages your reputation. Look for a caterer with a track
record of punctual delivery and professional service.

### 2. Menu Flexibility

Your team has diverse tastes and dietary requirements. The best
corporate caterers offer:
- **Dietary segmentation** — vegetarian, vegan, gluten-free options
- **Cultural variety** — both local Rwandan dishes and international
- **Portion control** — consistent servings across all guests

### 3. Scale

Can your caterer handle 50 guests comfortably? What about 300? Or 800?
Many caterers in Kigali max out at 200-300 guests. For larger events,
you need a caterer with the kitchen capacity and logistics to serve
at scale.

## Why Tania's Cuisine & Lounge

At [Tania's Cuisine & Lounge](https://taniascuisine.rw), we've been
providing corporate catering in Kigali since 2017. Here's what sets us
apart:

- **Capacity**: We serve events from 50 to **800 guests**
- **Experience**: Trusted by Access Bank, Bank of Kigali, GIZ, Oxfam,
  and 8+ institutional clients
- **Flexibility**: Boxed lunches, buffet setups, plated dinners
- **Dietary accommodation**: Every menu includes vegetarian, vegan, and
  gluten-free options clearly labeled

## Our Corporate Catering Process

### Step 1: Consultation

Tell us about your event — date, guest count, budget, dietary needs,
and preferred style. We'll create a tailored proposal within 24 hours.

### Step 2: Menu Tasting (Optional)

For recurring contracts or high-stakes events, we offer a tasting
session so you can approve the menu in advance.

### Step 3: Event Day

Our team arrives 2 hours before service. We set up, serve, and clean
up — leaving you to focus on your guests.

### Step 4: Follow-up

We check in after every event to gather feedback and improve.

## Budget Guide (2026)

*Approximate per-person ranges for corporate events in Kigali RWF:*

- **Boxed lunch**: 8,000 – 12,000 RWF
- **Buffet (3 proteins + 6 sides)**: 12,000 – 18,000 RWF
- **Plated dinner (4-course)**: 18,000 – 25,000 RWF
- **Premium (with bar)**: 25,000 – 40,000 RWF

## Ready to Plan Your Event?

[Contact our events team](https://taniascuisine.rw/contact) for a
free consultation and customized proposal. We'll respond within 24
hours.
```

- [ ] **Step 2: Commit**

```bash
git add src/content/blog/
git commit -m "feat: add sample blog post on corporate catering in Kigali"
```

---

### Task 4: Create Blog Listing Route

**Files:**
- Create: `src/routes/blog/index.tsx`

- [ ] **Step 1: Create `src/routes/blog/index.tsx`**

```typescript
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { BreadcrumbSchema } from "@/components/site/BreadcrumbSchema";
import { getAllPosts, getPostsByPage } from "@/lib/blog";
import { useState } from "react";

const POSTS_PER_PAGE = 9;

export const Route = createFileRoute("/blog")({
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
                    <div className="aspect-[16/9] bg-background/40 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 group-hover:scale-105 transition-transform duration-700">
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
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/blog/index.tsx
git commit -m "feat: add blog listing route with pagination"
```

---

### Task 5: Create Blog Post Route

**Files:**
- Create: `src/routes/blog/$slug.tsx`

- [ ] **Step 1: Create `src/routes/blog/$slug.tsx`**

```typescript
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
      <article className="pt-32 pb-24 px-6 md:px-12">
        <div className="mx-auto max-w-[800px]">
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
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/blog/\$slug.tsx
git commit -m "feat: add blog single post route with Article schema and related posts"
```

---

### Task 6: Add Blog to Navigation

**Files:**
- Modify: `src/components/site/Nav.tsx`
- Modify: `src/components/site/MobileTabs.tsx`

- [ ] **Step 1: Add blog to desktop nav links in `Nav.tsx`**

Replace the `links` array (line 6-13):
```
const links = [
  { to: "/menu", label: "Menu" },
  { to: "/lounge", label: "Lounge" },
  { to: "/catering", label: "Catering" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;
```

With:
```typescript
const links = [
  { to: "/menu", label: "Menu" },
  { to: "/lounge", label: "Lounge" },
  { to: "/catering", label: "Catering" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;
```

- [ ] **Step 2: Add blog to mobile "More" sheet in `MobileTabs.tsx`**

Replace the `moreLinks` array (line 12-16):
```typescript
const moreLinks = [
  { to: "/catering", label: "Catering" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];
```

With:
```typescript
const moreLinks = [
  { to: "/catering", label: "Catering" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];
```

- [ ] **Step 3: Commit**

```bash
git add src/components/site/Nav.tsx src/components/site/MobileTabs.tsx
git commit -m "feat: add blog to navigation (desktop nav + mobile more sheet)"
```

---

### Task 7: Update Sitemap

**Files:**
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Add blog URLs to `public/sitemap.xml`**

After the `<url>` block for the contact page (before `</urlset>`), add:
```xml
  <url>
    <loc>https://taniascuisine.rw/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
```

Blog post URLs will be added manually each time a new post is published.

- [ ] **Step 2: Commit**

```bash
git add public/sitemap.xml
git commit -m "fix: add /blog to sitemap"
```

---

### Task 8: Build & Verify

- [ ] **Step 1: Run the dev server to check routes work**

```bash
npm run dev
```

Open browser and verify:
1. `/blog` loads the listing page with the sample post
2. Clicking the post card navigates to `/blog/corporate-catering-kigali`
3. Article JSON-LD schema is present in the page source
4. Breadcrumb schema is present
5. Related posts section shows (or hides if only 1 post)
6. "Back to Blog" link works
7. CTA links to /menu and /contact work
8. Desktop nav shows "Blog" link
9. Mobile "More" sheet shows "Blog" option
10. 404 page shows for non-existent slugs like `/blog/nonexistent`

- [ ] **Step 2: Run the build**

```bash
npm run build
```

Expected: Build succeeds without errors. Blog routes are code-split into separate chunks.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: verify blog build and routes"
git push
```

---

### Task 9: Write 3 Initial Blog Posts

**Files:**
- Create: `src/content/blog/twatundi-beef-guide.md`
- Create: `src/content/blog/gishushu-restaurant-guide.md`
- Create: `src/content/blog/live-music-restaurants-kigali.md`

- [ ] **Step 1: Create `src/content/blog/twatundi-beef-guide.md`**

```markdown
---
title: "What is Twatundi Beef? A Guide to Kigali's Signature Dish"
slug: twatundi-beef-guide
description: "Discover Twatundi beef — a uniquely rich, slow-cooked Rwandan beef dish available only at Tania's Cuisine & Lounge in Gishushu, Kigali."
date: 2026-07-04
author: "Tania's Cuisine & Lounge"
category: "dishes"
tags:
  - Twatundi beef
  - Rwandan cuisine
  - Kigali food
  - signature dishes
image: /blog/twatundi-beef.jpg
readingTime: 3
published: true
---

## A Dish Born in Kigali

Twatundi beef is more than a meal — it's a statement. Slow-cooked for
hours until fork-tender, our signature beef dish is marinated in a
proprietary blend of East African spices that you won't find anywhere
else in Kigali.

## What Makes It Special?

The name "Twatundi" reflects the care that goes into every serving:

- **24-hour marinade** — the beef rests in spices overnight
- **Low and slow** — cooked for 4+ hours until it falls apart
- **Secret spice blend** — a mix of local and East African spices
- **Served traditionally** — with ugali, chapati, or rice

## Where to Try It in Kigali

[Twatundi beef is exclusively available at Tania's Cuisine & Lounge]
(https://taniascuisine.rw/menu) in Gishushu, M&M Plaza. Pair it with
a cold Primus beer or a glass of South African red wine for the full
experience.
```

- [ ] **Step 2: Create `src/content/blog/gishushu-restaurant-guide.md`**

```markdown
---
title: "5 Reasons Tania's Cuisine & Lounge is Gishushu's Go-To for Evening Dining"
slug: gishushu-restaurant-guide
description: "Looking for a restaurant in Gishushu, Kigali? From live music to Kigali's best African grill, here's why Tania's is the neighbourhood's premier dining destination."
date: 2026-07-11
author: "Tania's Cuisine & Lounge"
category: "dining-guide"
tags:
  - Gishushu restaurant
  - Kigali dining
  - evening dining
  - M&M Plaza
image: /blog/gishushu-restaurant.jpg
readingTime: 4
published: true
---

## Gishushu's Dining Scene

Gishushu has quietly become one of Kigali's most convenient dining
neighbourhoods. Located near the RDB and major offices, it's where
professionals, families, and visitors gather after work.

At the heart of it all is [Tania's Cuisine & Lounge]
(https://taniascuisine.rw) at M&M Plaza — a restaurant that combines
atmospheric dining with genuine African hospitality.

## 1. Location & Parking

Right on KG 8 Avenue in M&M Plaza, with free, large parking. Easy to
find, easy to leave.

## 2. Live Music Every Weekend

While many restaurants in Kigali offer recorded music, Tania's features
a live band on weekends and a resident DJ. The Cigar Lounge adds a
touch of sophistication for after-dinner drinks.

## 3. Menu Depth

From [Twatundi beef](https://taniascuisine.rw/menu) to Swahili fish,
whole tilapia, sombe, and sambaza — the menu covers East, Central, and
West African favourites alongside international options.

## 4. Daily Buffet

12,000 RWF for a chef's buffet with three proteins and six sides,
served daily from noon to 3 PM. One of the best lunch deals in Kigali.

## 5. Ambiance

Warm lighting, indoor and outdoor seating, and a relaxed vibe that
works equally well for a business lunch or a date night.
```

- [ ] **Step 3: Create `src/content/blog/live-music-restaurants-kigali.md`**

```markdown
---
title: "Kigali's Best Live Music Restaurants: Where to Dine and Dance"
slug: live-music-restaurants-kigali
description: "From Afro-fusion to live bands, here are Kigali's top restaurants with live music — including Tania's Cuisine & Lounge in Gishushu."
date: 2026-07-18
author: "Tania's Cuisine & Lounge"
category: "dining-guide"
tags:
  - live music Kigali
  - Kigali nightlife
  - restaurants with music
  - weekend dining
image: /blog/live-music-kigali.jpg
readingTime: 5
published: true
---

## Kigali's Live Music Scene

Kigali's restaurant scene comes alive after dark. While the city is
known for its quiet, safe streets, several venues offer live music
that transforms a dinner into an evening out.

## 1. Tania's Cuisine & Lounge — Gishushu

Live band every Friday and Saturday night, plus a resident DJ.
The [Cigar Lounge](https://taniascuisine.rw/lounge) offers a more
intimate setting for after-dinner drinks. The music leans toward
Rwandan, East African, and Afrobeat — perfect with a plate of
grilled tilapia.

**Best for:** Groups who want dinner + drinks + dancing under one roof.

## 2. Repub Lounge — Kimihurura

Rooftop venue with Afro-fusion music. Popular with Kigali's young
professionals.

## 3. Crystal Lounge — Kacyiru

Live band on weekends, known for its outdoor terrace.

## 4. La Creola — Kimihurura

Rooftop tapas and live music. More of a lounge atmosphere.

## Plan Your Night

Start with dinner at [Tania's](https://taniascuisine.rw/contact) —
try the daily buffet or order from the full menu — then settle into the
lounge for live music. Reserve your table by WhatsApp.
```

- [ ] **Step 4: Add post URLs to `public/sitemap.xml`**

Add these `<url>` blocks inside `<urlset>`:
```xml
  <url>
    <loc>https://taniascuisine.rw/blog/twatundi-beef-guide</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://taniascuisine.rw/blog/gishushu-restaurant-guide</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://taniascuisine.rw/blog/live-music-restaurants-kigali</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
```

- [ ] **Step 5: Build & verify final state**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add 3 initial blog posts (Twatundi beef, Gishushu guide, live music guide)"
git push
```
