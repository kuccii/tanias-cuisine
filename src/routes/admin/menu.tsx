import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Save, RefreshCw, Upload, Trash2, Plus, Loader2 } from "lucide-react";
import { getPublicMenu, upsertMenuSection, uploadMenuItemImageBase64, type MenuItem } from "@/lib/menu-cms.server";
import type { MenuSection } from "@/data/menu";

// Form schema for section data
const sectionFormSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  category: z.string(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string(),
  image: z.string().optional(),
  compact: z.boolean().optional(),
  items: z.any().optional(),
  groups: z.any().optional(),
  special_box: z.any().optional(),
});

type SectionFormValues = z.infer<typeof sectionFormSchema>;

// Initial empty section
const emptySection: SectionFormValues = {
  slug: "",
  category: "",
  title: "",
  subtitle: "",
  image: "",
  compact: false,
  items: [],
  groups: [],
};

export const Route = createFileRoute("/admin/menu")({
  head: () => ({
    meta: [
      { title: "Menu Admin — Tania's Cuisine & Lounge" },
    ],
  }),
  loader: async () => {
    return getPublicMenu({});
  },
  component: MenuAdminPage,
});

function MenuAdminPage() {
  const navigate = useNavigate();
  // Get sections from loader (server-side data)
  const allSections = Route.useLoaderData() as MenuSection[];
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const form = useForm<SectionFormValues>({
    defaultValues: emptySection,
  });

  const handleSelectSection = (slug: string) => {
    const section = allSections.find(s => s.id === slug || s.category === slug);
    if (!section) return;
    
    setEditingSlug(slug);
    form.reset({
      slug: section.id || slug,
      category: section.category,
      title: section.title,
      subtitle: section.subtitle,
      image: section.image || "",
      compact: section.compact || false,
      items: section.items || [],
      groups: section.groups || [],
      special_box: section.special_box || undefined,
    });
  };

  // Reload data after save by navigating to same route (triggers loader)
  const reloadMenu = () => {
    navigate({ to: "/admin/menu" });
  };

  const handleSave = async () => {
    if (!form.getValues("slug")) {
      form.setError("slug", { message: "Slug is required" });
      return;
    }

    setIsSaving(true);
    try {
      const values = form.getValues();
      await upsertMenuSection({
        data: {
          slug: values.slug,
          category: values.category,
          title: values.title,
          subtitle: values.subtitle,
          image: values.image,
          items: values.items,
          groups: values.groups,
          special_box: values.special_box,
          compact: values.compact,
        },
      });
      // Refresh sections list (navigate to trigger loader)
      reloadMenu();
      alert("Section saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slug: string, itemName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result;
        if (typeof base64 === "string") {
          const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, "");
          await uploadMenuItemImageBase64({
            data: { base64: base64Data, slug, itemName, filename: file.name, mimeType: file.type },
          });
          alert("Image uploaded successfully");
        }
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed: " + (error as Error).message);
      setUploadingImage(false);
    }
  };

  const addItem = () => {
    const items = form.watch("items") || [];
    form.setValue("items", [...items, { name: "", price: "", description: "", note: "" }]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const items = form.watch("items") || [];
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue("items", updated);
  };

  const removeItem = (index: number) => {
    const items = form.watch("items") || [];
    items.splice(index, 1);
    form.setValue("items", items);
  };

  const addGroup = () => {
    const groups = form.watch("groups") || [];
    form.setValue("groups", [...groups, { name: "", items: [] }]);
  };

  const updateGroup = (groupIndex: number, field: string, value: any) => {
    const groups = form.watch("groups") || [];
    const updated = [...groups];
    updated[groupIndex] = { ...updated[groupIndex], [field]: value };
    form.setValue("groups", updated);
  };

  const removeGroup = (groupIndex: number) => {
    const groups = form.watch("groups") || [];
    groups.splice(groupIndex, 1);
    form.setValue("groups", groups);
  };

  const addGroupItem = (groupIndex: number) => {
    const groups = form.watch("groups") || [];
    const group = groups[groupIndex];
    group.items = [...group.items, { name: "", price: "" }];
    form.setValue("groups", groups);
  };

  const updateGroupItem = (groupIndex: number, itemIndex: number, field: string, value: string) => {
    const groups = form.watch("groups") || [];
    groups[groupIndex].items[itemIndex] = { ...groups[groupIndex].items[itemIndex], [field]: value };
    form.setValue("groups", groups);
  };

  const removeGroupItem = (groupIndex: number, itemIndex: number) => {
    const groups = form.watch("groups") || [];
    groups[groupIndex].items.splice(itemIndex, 1);
    form.setValue("groups", groups);
  };

  const selectedSection = editingSlug ? allSections.find(s => s.id === editingSlug || s.category === editingSlug) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Menu
            </Button>
            <h1 className="font-display text-xl">Menu CMS Admin</h1>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">No authentication required</Badge>
            <Badge>Save is immediate</Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Section List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sections ({allSections.length})</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {allSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => handleSelectSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          editingSlug === section.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        {section.title}
                        <span className="block text-xs text-foreground/60">{section.category}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        const newSlug = `new-section-${Date.now()}`;
                        handleSelectSection(newSlug);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-secondary flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Section
                    </button>
                  </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => form.reset(emptySection)}
                  className="w-full justify-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Form
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={reloadMenu}
                  className="w-full justify-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload from Database
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingSlug ? `Editing: ${selectedSection?.title || editingSlug}` : "New Section"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {/* Required Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        {...form.register("slug")}
                        value={form.watch("slug")}
                        onChange={(e) => form.setValue("slug", e.target.value)}
                        placeholder="e.g., appetizers"
                      />
                      {form.formState.errors.slug && (
                        <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        {...form.register("category")}
                        value={form.watch("category")}
                        onChange={(e) => form.setValue("category", e.target.value)}
                        placeholder="e.g., Start Your Meal"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      value={form.watch("title")}
                      onChange={(e) => form.setValue("title", e.target.value)}
                      placeholder="e.g., Snacks & Starters"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      {...form.register("subtitle")}
                      value={form.watch("subtitle")}
                      onChange={(e) => form.setValue("subtitle", e.target.value)}
                      placeholder="Brief description"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.watch("compact") ?? false}
                      onChange={(e) => form.setValue("compact", e.target.checked)}
                      className="rounded border-input"
                    />
                    <Label>Compact layout</Label>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <Label>Header Image URL</Label>
                    <Input
                      id="image"
                      {...form.register("image")}
                      value={form.watch("image") || ""}
                      onChange={(e) => form.setValue("image", e.target.value)}
                      placeholder="/src/assets/dish-skewers.webp"
                    />
                    <p className="text-xs text-foreground/50 mt-1">
                      Use public URLs or bundle asset paths
                    </p>
                    {form.watch("image") && (
                      <div className="mt-2">
                        <img src={form.watch("image")} alt="Header preview" className="h-24 object-cover rounded" />
                      </div>
                    )}
                  </div>
                </div>

                <hr />

                {/* Simple Items Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg">Simple Items</h3>
                    <Button variant="outline" size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {form.watch("items")?.map((item: MenuItem, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="grid gap-2">
                            <div className="flex items-start gap-2">
                              <Input
                                value={item.name}
                                onChange={(e) => updateItem(index, "name", e.target.value)}
                                placeholder="Dish name"
                                className="flex-1"
                              />
                              <Input
                                value={item.price}
                                onChange={(e) => updateItem(index, "price", e.target.value)}
                                placeholder="Price"
                                className="w-28"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              value={item.description || ""}
                              onChange={(e) => updateItem(index, "description", e.target.value)}
                              placeholder="Description"
                              rows={2}
                            />
                            <Input
                              value={item.note || ""}
                              onChange={(e) => updateItem(index, "note", e.target.value)}
                              placeholder="Note (e.g., preparation time)"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(!form.watch("items") || form.watch("items").length === 0) && (
                      <p className="text-sm text-foreground/60 italic">No simple items. Add items above or use groups.</p>
                    )}
                  </div>
                </div>

                <hr />

                {/* Groups Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg">Sub-groups</h3>
                    <Button variant="outline" size="sm" onClick={addGroup}>
                      <Plus className="h-4 w-4 mr-1" /> Add Group
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {form.watch("groups")?.map((group: any, groupIndex: number) => (
                      <Card key={groupIndex}>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Input
                                value={group.name}
                                onChange={(e) => updateGroup(groupIndex, "name", e.target.value)}
                                placeholder="Group name (e.g., Beef)"
                                className="flex-1 font-medium"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeGroup(groupIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2 pl-4">
                              {group.items?.map((item: any, itemIndex: number) => (
                                <div key={itemIndex} className="flex items-center gap-2">
                                  <Input
                                    value={item.name}
                                    onChange={(e) => updateGroupItem(groupIndex, itemIndex, "name", e.target.value)}
                                    placeholder="Item name"
                                    className="flex-1"
                                  />
                                  <Input
                                    value={item.price}
                                    onChange={(e) => updateGroupItem(groupIndex, itemIndex, "price", e.target.value)}
                                    placeholder="Price"
                                    className="w-24"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeGroupItem(groupIndex, itemIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => addGroupItem(groupIndex)}
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add Item
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(!form.watch("groups") || form.watch("groups").length === 0) && (
                      <p className="text-sm text-foreground/60 italic">No sub-groups. Add groups above or use simple items.</p>
                    )}
                  </div>
                </div>

                <hr />

                {/* Special Box */}
                <div>
                  <h3 className="font-display text-lg mb-3">Chef's Special Box</h3>
                  <p className="text-sm text-foreground/60 mb-4">
                    Featured dishes highlighted in a special box on the menu page.
                  </p>
                  <div className="space-y-3">
                    <Input
                      value={form.watch("special_box")?.title || ""}
                      onChange={(e) => {
                        const sb = form.watch("special_box") || {};
                        form.setValue("special_box", { ...sb, title: e.target.value });
                      }}
                      placeholder="Special title (e.g., Chef's Specials)"
                    />
                    <div className="space-y-2">
                      {form.watch("special_box")?.items?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={item.name}
                            onChange={(e) => {
                              const items = [...form.watch("special_box")!.items];
                              items[index] = { ...item, name: e.target.value };
                              form.setValue("special_box", { ...form.watch("special_box"), items });
                            }}
                            placeholder="Item name"
                            className="flex-1"
                          />
                          <Input
                            value={item.price}
                            onChange={(e) => {
                              const items = [...form.watch("special_box")!.items];
                              items[index] = { ...item, price: e.target.value };
                              form.setValue("special_box", { ...form.watch("special_box"), items });
                            }}
                            placeholder="Price"
                            className="w-24"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="w-full">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
