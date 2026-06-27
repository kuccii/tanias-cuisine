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

const modules = import.meta.glob("../content/blog/*.md", {
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

let _cached: BlogPost[] | null = null;

function loadAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  for (const [, raw] of Object.entries(modules)) {
    const { data, content } = parseFrontmatter(raw);
    if (data.published === false) continue;
    posts.push({
      title: data.title as string,
      slug: data.slug as string,
      description: data.description as string,
      date: data.date as string,
      author: data.author as string,
      category: data.category as string,
      tags: (data.tags || []) as string[],
      image: data.image as string,
      readingTime: (data.readingTime || 3) as number,
      published: true,
      content,
    });
  }
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllPosts(): BlogPost[] {
  if (!_cached) _cached = loadAllPosts();
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
