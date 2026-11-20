import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { menuSections, type MenuSection, type MenuItem, type MenuGroup, type SpecialBox } from "@/data/menu";

// Re-export types for use in admin route
export type { MenuItem, MenuGroup, SpecialBox };

// Supabase configuration - read from env
const SUPABASE_URL = process.env.SUPABASE_URL || "https://n8n.qivook.com/supabase/";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

// Minimal WebSocket polyfill for Node.js < 22 (required by @supabase/supabase-js)
// Create a noop transport class that can be instantiated but does nothing
class NoopWebSocketTransport {
  constructor(_url: string, _protocols?: string | string[]) {}
  send(_data: any) {}
  close() {}
  get readyState() { return 3; } // CLOSED
  get onopen() { return null; }
  set onopen(_handler: ((event: any) => any) | null) {}
  get onclose() { return null; }
  set onclose(_handler: ((event: any) => any) | null) {}
  get onerror() { return null; }
  set onerror(_handler: ((event: any) => any) | null) {}
  get onmessage() { return null; }
  set onmessage(_handler: ((event: any) => any) | null) {}
}

const noopWebSocketTransport = NoopWebSocketTransport;

// Type definitions matching database schema
interface MenuSectionDB {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  image: string | null;
  items: any[] | null;
  groups: any[] | null;
  special_box: any | null;
  compact: boolean;
  updated_at?: string;
}

// Helper to create anon client (lazy import for server-only)
async function createAnonClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    SUPABASE_URL.replace(/\/+$/, ""),
    SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false },
      // Disable realtime AND provide custom transport to bypass Node.js WebSocket detection
      realtime: { 
        disabled: true,
        transport: noopWebSocketTransport as any,
      },
    } as any // Type compatibility for supabase-js v2
  );
}

// Helper to create service client (lazy import for server-only)
async function createServiceClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("Service role key not configured");
  return createClient(
    SUPABASE_URL.replace(/\/+$/, ""),
    serviceKey,
    {
      auth: { persistSession: false },
      // Disable realtime AND provide custom transport to bypass Node.js WebSocket detection
      realtime: { 
        disabled: true,
        transport: noopWebSocketTransport as any,
      },
    } as any // Type compatibility for supabase-js v2
  );
}

/**
 * Get the full menu from Supabase with fallback to bundled data.
 * This function is called from the menu page loader.
 */
export const getPublicMenu = createServerFn({ method: "GET" })
  .handler(async () => {
    // If Supabase is not configured, return bundled data
    if (!SUPABASE_ANON_KEY) {
      console.warn("[menu-cms] SUPABASE_ANON_KEY not set, using bundled menu data");
      return menuSections;
    }

    try {
      const supabase = await createAnonClient();

      // Fetch menu_sections
      const { data: sections, error } = await supabase
        .from("menu_sections" as const)
        .select("*")
        .order("id");

      if (error) {
        console.error("[menu-cms] Supabase error:", error.message);
        throw new Error(`Supabase fetch failed: ${error.message}`);
      }

      // Transform to match MenuSection[] type (remove id field, keep existing structure)
      const result: MenuSection[] = sections.map((s) => ({
        id: s.slug,
        category: s.category,
        title: s.title,
        subtitle: s.subtitle,
        image: s.image || "",
        items: s.items,
        groups: s.groups,
        special_box: s.special_box,
        compact: s.compact,
      }));

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[menu-cms] Failed to fetch from Supabase:", message);
      
      // Fallback to bundled data on any error
      console.warn("[menu-cms] Falling back to bundled menu data");
      return menuSections;
    }
  });

/**
 * Zod schema for section upsert input
 */
const sectionUpsertSchema = z.object({
  slug: z.string().min(1),
  category: z.string(),
  title: z.string(),
  subtitle: z.string(),
  image: z.string().optional(),
  items: z.any().optional(),
  groups: z.any().optional(),
  special_box: z.any().optional(),
  compact: z.boolean().optional(),
});

/**
 * Create or update a menu section (admin function).
 */
export const upsertMenuSection = createServerFn({ method: "POST" })
  .inputValidator(sectionUpsertSchema)
  .handler(async ({ data }) => {
    const supabase = await createServiceClient();

    // Generate UUID-compatible string for id
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const { error } = await supabase
      .from("menu_sections")
      .upsert({
        ...data,
        id,
      }, { onConflict: "slug" });

    if (error) {
      throw new Error(`Upsert failed: ${error.message}`);
    }

    return { success: true };
  });

/**
 * Zod schema for section update input
 */
const sectionUpdateSchema = z.object({
  slug: z.string(),
  updates: z.object({
    category: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    image: z.string().optional(),
    items: z.any().optional(),
    groups: z.any().optional(),
    special_box: z.any().optional(),
    compact: z.boolean().optional(),
  }),
});

/**
 * Update a menu section (admin function).
 * Uses service_role key for write access.
 */
export const updateMenuSection = createServerFn({ method: "POST" })
  .inputValidator(sectionUpdateSchema)
  .handler(async ({ data }) => {
    const { slug, updates } = data;
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from("menu_sections")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("slug", slug);

    if (error) {
      throw new Error(`Update failed: ${error.message}`);
    }

    return { success: true };
  });

/**
 * Zod schema for delete section input
 */
const deleteSectionSchema = z.object({
  slug: z.string(),
});

/**
 * Delete a menu section (admin function).
 * Uses POST method since TanStack Start v2 doesn't support DELETE directly.
 */
export const deleteMenuSection = createServerFn({ method: "POST" })
  .inputValidator(deleteSectionSchema)
  .handler(async ({ data }) => {
    const { slug } = data;
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from("menu_sections")
      .delete()
      .eq("slug", slug);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    return { success: true };
  });

/**
 * Get all menu section slugs for the admin dropdown.
 */
export const getMenuSlugs = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!SUPABASE_ANON_KEY) {
      return menuSections.map((s) => s.category); // category is like "Appetizers", "Main Course"
    }

    try {
      const supabase = await createAnonClient();

      const { data, error } = await supabase
        .from("menu_sections")
        .select("category")
        .order("category");

      if (error) {
        console.error("[menu-cms] Error fetching slugs:", error.message);
        return menuSections.map((s) => s.category);
      }

      return data.map((d) => d.category);
    } catch {
      return menuSections.map((s) => s.category);
    }
  });

/**
 * Zod schema for image upload input
 */
const imageUploadSchema = z.object({
  base64: z.string(),
  slug: z.string(),
  itemName: z.string(),
  filename: z.string().optional(),
  mimeType: z.string().optional(),
});

/**
 * Upload an image to Supabase storage.
 * Accepts base64-encoded image data and returns the public URL.
 */
export const uploadMenuItemImageBase64 = createServerFn({ method: "POST" })
  .inputValidator(imageUploadSchema)
  .handler(async ({ data }) => {
    const supabase = await createServiceClient();
    const { base64, slug, itemName, filename, mimeType } = data;

    // Create a safe filename
    const safeItem = itemName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const safeSlug = slug.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const ext = filename?.split(".").pop() || "webp";
    const storageFilename = `menu/${safeSlug}/${safeItem}.${ext}`;

    // Decode base64 to buffer
    const binaryString = Buffer.from(base64, "base64").toString("binary");
    const buffer = Buffer.from(binaryString, "binary");

    const { error } = await supabase.storage
      .from("menu-uploads")
      .upload(storageFilename, buffer, {
        contentType: mimeType || "image/webp",
        upsert: true,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from("menu-uploads")
      .getPublicUrl(storageFilename);

    return { publicUrl: publicUrl.publicUrl };
  });