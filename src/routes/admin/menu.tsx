import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  Save,
  RefreshCw,
  Upload,
  Trash2,
  Plus,
  Loader2,
  Users,
  Grid3x3,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPublicMenu,
  upsertMenuSection,
  updateMenuSection,
  deleteMenuSection,
  uploadMenuItemImageBase64,
  uploadSectionHeaderImage,
  type MenuItem,
} from "@/lib/menu-cms.server";
import type { MenuSection, MenuGroup, SpecialBox } from "@/data/menu";
import { SectionList } from "@/components/admin/SectionList";
import { LivePreview } from "@/components/admin/LivePreview";
import { ImageUploadZone } from "@/components/admin/ImageUploadZone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
  const allSections = Route.useLoaderData() as MenuSection[];

  // Initialize editingSlug from loader data - use stable initial value
  const initialSlug = allSections.length > 0 ? allSections[0].id : undefined;

  const [editingSlug, setEditingSlug] = useState<string | undefined>(initialSlug);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Convert to mutable arrays for reorder - initialize from allSections
  // Use lazy initialization to prevent hydration mismatch in SSR
  const [sections, setSections] = useState<MenuSection[]>(() => allSections);

  // Find selected section - use sections (mutable) not allSections for consistency
  const selectedSection = useMemo(() => {
    if (!editingSlug) return null;
    return sections.find((s) => s.id === editingSlug || s.category === editingSlug) || null;
  }, [sections, editingSlug]);

  const handleSelectSection = (slug: string | undefined) => {
    setEditingSlug(slug);
  };

  const handleReorder = (newSections: MenuSection[]) => {
    setSections(newSections);
  };

  const handleDelete = async (slug: string | undefined) => {
    if (!slug) return;
    try {
      await deleteMenuSection({ data: { slug } });
      setSections((prev) => prev.filter((s) => s.id !== slug && s.category !== slug));
      if (editingSlug === slug) {
        const nextSection = sections.find((s) => s.id !== slug);
        if (nextSection) setEditingSlug(nextSection.id);
        else setEditingSlug(undefined);
      }
      toast.success("Section deleted");
    } catch (error) {
      toast.error("Failed to delete section: " + (error as Error).message);
    }
  };

  const handleCreate = () => {
    const newSlug = `new-section-${Date.now()}`;
    setEditingSlug(newSlug);
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  if (!selectedSection) {
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
            <Badge variant="outline">No authentication required</Badge>
          </div>
        </header>

        <main className="mx-auto max-w-6xl p-4 lg:p-6">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <SectionList
              sections={sections}
              activeSlug={editingSlug}
              onSelect={handleSelectSection}
              onReorder={handleReorder}
              onDelete={handleDelete}
              onCreate={handleCreate}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={handleToggleCollapse}
            />
            {/* Empty State */}
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-muted-foreground mb-4">Select a section to edit</p>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Section
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const handleSave = async () => {
    if (!selectedSection || !editingSlug) return;

    setIsSaving(true);
    try {
      await toast.promise(
        updateMenuSection({
          data: {
            slug: editingSlug,
            updates: getFormValues(),
          },
        }),
        {
          loading: "Saving changes...",
          success: () => {
            // Refresh sections from server
            getPublicMenu({}).then((freshSections) => {
              setSections(freshSections);
              toast("Changes saved", { description: "Menu updated successfully" });
            });
            return "Changes saved";
          },
          error: (err) => `Failed to save: ${err.message}`,
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getFormValues = (): Partial<MenuSection> => {
    return {
      id: (editingSlug === (selectedSection?.id) ? undefined : editingSlug) || undefined,
      slug: editingSlug,
      category: formState.category,
      title: formState.title,
      subtitle: formState.subtitle,
      image: formState.image,
      compact: formState.compact,
      items: formState.items,
      groups: formState.groups,
      special_box: formState.special_box,
    };
  };

  // Form state - use lazy initialization with safe defaults to prevent hydration mismatch
  const [formState, setFormState] = useState<Omit<MenuSection, "id"> & { items?: MenuItem[]; groups?: MenuGroup[]; special_box?: SpecialBox }>(() => {
    // Safe defaults for SSR hydration
    if (!selectedSection) {
      return {
        slug: editingSlug || "",
        category: "",
        title: "",
        subtitle: "",
        image: "",
        compact: false,
        items: [],
        groups: [],
        special_box: undefined,
      };
    }
    return {
      slug: editingSlug,
      category: selectedSection.category,
      title: selectedSection.title,
      subtitle: selectedSection.subtitle,
      image: selectedSection.image || "",
      compact: selectedSection.compact || false,
      items: selectedSection.items || [],
      groups: selectedSection.groups ? JSON.parse(JSON.stringify(selectedSection.groups)) : [],
      special_box: selectedSection.special_box ? JSON.parse(JSON.stringify(selectedSection.special_box)) : undefined,
    };
  });

  // Sync form state with selected section changes
  useEffect(() => {
    if (selectedSection) {
      setFormState({
        slug: editingSlug,
        category: selectedSection.category,
        title: selectedSection.title,
        subtitle: selectedSection.subtitle,
        image: selectedSection.image || "",
        compact: selectedSection.compact || false,
        items: JSON.parse(JSON.stringify(selectedSection.items || [])),
        groups: selectedSection.groups ? JSON.parse(JSON.stringify(selectedSection.groups)) : [],
        special_box: selectedSection.special_box ? JSON.parse(JSON.stringify(selectedSection.special_box)) : undefined,
      });
    }
  }, [selectedSection]);

  const handleInputChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (path: string[], value: any) => {
    setFormState((prev: any) => {
      const newState = { ...prev };
      let current: any = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newState;
    });
  };

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

      <main className="mx-auto max-w-6xl h-[calc(100vh-60px)] grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <SectionList
          sections={sections}
          activeSlug={editingSlug}
          onSelect={handleSelectSection}
          onReorder={handleReorder}
          onDelete={handleDelete}
          onCreate={handleCreate}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Main Editor with Live Preview */}
        <div className="grid gap-4 lg:grid-cols-1 lg:[height:calc(100vh-60px)]">
          <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
            {/* Save Button */}
            <div className="border-t border-border p-4">
              <Button
                onClick={handleSave}
                disabled={!selectedSection || isSaving}
                className="w-full sm:w-auto"
              >
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
            <Tabs defaultValue="general" className="flex-1 flex flex-col">
              <div className="overflow-x-auto border-b border-border bg-muted/40">
                <TabsList className="flex space-x-1 p-1">
                  <TabsTrigger value="general" className="text-xs">
                    General
                  </TabsTrigger>
                  <TabsTrigger value="items" className="text-xs">
                    Items
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="text-xs">
                    Groups
                  </TabsTrigger>
                  <TabsTrigger value="special" className="text-xs">
                    Special
                  </TabsTrigger>
                  <TabsTrigger value="images" className="text-xs">
                    Images
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {/* General Tab */}
                <TabsContent value="general" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="slug" className="text-xs uppercase tracking-wider">
                        Slug
                      </Label>
                      <Input
                        id="slug"
                        value={formState.slug}
                        onChange={(e) => handleInputChange("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                        placeholder="section-slug"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Used in URLs. Must be unique.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-xs uppercase tracking-wider">
                        Category
                      </Label>
                      <Input
                        id="category"
                        value={formState.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        placeholder="e.g., Starters, Mains"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="title" className="text-xs uppercase tracking-wider">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={formState.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Section title"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="subtitle" className="text-xs uppercase tracking-wider">
                        Subtitle
                      </Label>
                      <Input
                        id="subtitle"
                        value={formState.subtitle}
                        onChange={(e) => handleInputChange("subtitle", e.target.value)}
                        placeholder="Section subtitle"
                      />
                    </div>

                    <div>
                      <Label htmlFor="compact" className="text-xs uppercase tracking-wider">
                        Compact
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formState.compact || false}
                            onChange={(e) => handleInputChange("compact", e.target.checked)}
                            className="h-4 w-4 rounded border-input"
                          />
                          <span className="text-sm">Compact layout</span>
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Smaller grid with more columns</p>
                    </div>

                    <div className="flex items-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange("image", "")}
                        className="h-9"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Items Tab */}
                <TabsContent value="items" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-medium">
                      Items ({formState.items?.length ?? 0})
                    </h3>
                  </div>

                  {formState.items && formState.items.length > 0 ? (
                    <div className="space-y-3">
                      {formState.items.map((item, idx) => (
                        <Card key={idx}>
                          <CardContent className="pt-4">
                            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <Input
                                    value={item.name}
                                    onChange={(e) => {
                                      const newItems = [...(formState.items || [])];
                                      newItems[idx] = { ...item, name: e.target.value };
                                      handleInputChange("items", newItems);
                                    }}
                                    placeholder="Dish name"
                                    className="flex-1"
                                  />
                                  <Input
                                    value={item.price}
                                    onChange={(e) => {
                                      const newItems = [...(formState.items || [])];
                                      newItems[idx] = { ...item, price: e.target.value };
                                      handleInputChange("items", newItems);
                                    }}
                                    placeholder="25,000 FRW"
                                    className="w-32 font-mono"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const newItems = formState.items?.filter((_, i) => i !== idx);
                                      handleInputChange("items", newItems);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Textarea
                                  value={item.description || ""}
                                  onChange={(e) => {
                                    const newItems = [...(formState.items || [])];
                                    newItems[idx] = { ...item, description: e.target.value };
                                    handleInputChange("items", newItems);
                                  }}
                                  placeholder="Description"
                                  rows={2}
                                />
                                <Input
                                  value={item.note || ""}
                                  onChange={(e) => {
                                    const newItems = [...(formState.items || [])];
                                    newItems[idx] = { ...item, note: e.target.value };
                                    handleInputChange("items", newItems);
                                  }}
                                  placeholder="Note (e.g., preparation time)"
                                />
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <ImageUploadZone
                                  value={item.image}
                                  onChange={(url) => {
                                    const newItems = [...(formState.items || [])];
                                    newItems[idx] = { ...item, image: url };
                                    handleInputChange("items", newItems);
                                  }}
                                  slug={formState.slug}
                                  context="item"
                                  itemName={item.name}
                                  label="Upload image"
                                  className="w-20 h-20"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItems = [...(formState.items || [])];
                          newItems.push({ name: "", price: "" });
                          handleInputChange("items", newItems);
                        }}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground/60 italic">
                        No items in this section.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleInputChange("items", [{ name: "", price: "" }]);
                        }}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Groups Tab */}
                <TabsContent value="groups" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-medium">
                      Groups ({formState.groups?.length ?? 0})
                    </h3>
                  </div>

                  {formState.groups && formState.groups.length > 0 ? (
                    <div className="space-y-4">
                      {formState.groups.map((group, groupIndex) => (
                        <div key={groupIndex} className="border rounded-lg p-3">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground/50" />
                              <Input
                                value={group.name}
                                onChange={(e) => {
                                  const newGroups = [...(formState.groups || [])];
                                  newGroups[groupIndex] = { ...group, name: e.target.value };
                                  handleInputChange("groups", newGroups);
                                }}
                                placeholder="Group name (e.g., Beef)"
                                className="font-medium"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newGroups = formState.groups?.filter((_, i) => i !== groupIndex);
                                  handleInputChange("groups", newGroups);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="pl-6 space-y-2">
                              {group.items?.map((item, itemIndex) => (
                                <div key={itemIndex} className="grid gap-2 md:grid-cols-3">
                                  <Input
                                    value={item.name}
                                    onChange={(e) => {
                                      const newGroups = [...(formState.groups || [])];
                                      newGroups[groupIndex].items[itemIndex].name = e.target.value;
                                      handleInputChange("groups", newGroups);
                                    }}
                                    placeholder="Item name"
                                    className="md:col-span-2"
                                  />
                                  <Input
                                    value={item.price}
                                    onChange={(e) => {
                                      const newGroups = [...(formState.groups || [])];
                                      newGroups[groupIndex].items[itemIndex].price = e.target.value;
                                      handleInputChange("groups", newGroups);
                                    }}
                                    placeholder="25,000 FRW"
                                    className="font-mono"
                                  />
                                </div>
                              ))}
                              {(!group.items || group.items.length === 0) && (
                                <p className="text-xs text-muted-foreground/60">No items in this group</p>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newGroups = [...(formState.groups || [])];
                                  newGroups[groupIndex].items = [
                                    ...(newGroups[groupIndex].items || []),
                                    { name: "", price: "" },
                                  ];
                                  handleInputChange("groups", newGroups);
                                }}
                                className="text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Item
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground/60 italic">
                      No groups defined. Items are displayed in a flat list.
                    </p>
                  )}
                </TabsContent>

                {/* Special Tab */}
                <TabsContent value="special" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-medium">Chef&apos;s Special Box</h3>
                  </div>

                  {formState.special_box ? (
                    <div className="border rounded-lg p-3 space-y-3">
                      <div>
                        <Label>Special Title</Label>
                        <Input
                          value={formState.special_box.title}
                          onChange={(e) =>
                            handleInputChange("special_box", {
                              ...formState.special_box!,
                              title: e.target.value,
                            })
                          }
                          placeholder="Chef's Specials"
                        />
                      </div>

                      <div>
                        <h4 className="text-xs font-medium mb-2">Special Items</h4>
                        <div className="space-y-2">
                          {formState.special_box.items?.map((item, idx) => (
                            <div key={idx} className="grid gap-2 md:grid-cols-3">
                              <Input
                                value={item.name}
                                onChange={(e) => {
                                  const items = [...(formState.special_box!.items || [])];
                                  items[idx] = { ...item, name: e.target.value };
                                  handleInputChange("special_box", {
                                    ...formState.special_box!,
                                    items,
                                  });
                                }}
                                placeholder="Item name"
                                className="md:col-span-2"
                              />
                              <Input
                                value={item.price}
                                onChange={(e) => {
                                  const items = [...(formState.special_box!.items || [])];
                                  items[idx] = { ...item, price: e.target.value };
                                  handleInputChange("special_box", {
                                    ...formState.special_box!,
                                    items,
                                  });
                                }}
                                placeholder="25,000 FRW"
                                className="font-mono"
                              />
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const items = [...(formState.special_box?.items || [])];
                            items.push({ name: "", price: "" });
                            handleInputChange("special_box", {
                              ...formState.special_box!,
                              items,
                            });
                          }}
                          className="text-xs mt-2"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Item
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleInputChange("special_box", {
                          title: "Chef's Special",
                          items: [{ name: "", price: "" }],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Special Box
                    </Button>
                  )}
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs uppercase tracking-wider">
                        Section Header Image
                      </Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Drag & drop or click to upload an image for this section header
                      </p>

                      <ImageUploadZone
                        value={formState.image}
                        onChange={(url) => handleInputChange("image", url)}
                        slug={formState.slug}
                        context="header"
                        label="Upload header image"
                      />
                    </div>

                    {formState.items?.some((item) => item.image) && (
                      <div>
                        <h3 className="font-display text-sm font-medium mb-2">
                          Item Images
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {formState.items
                            .filter((item) => item.image)
                            .map((item, idx) => (
                              <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-border">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Live Preview Panel */}
          <div className="hidden xl:block">
            <LivePreview section={selectedSection} sectionIndex={sections.findIndex((s) => s.id === editingSlug || s.category === editingSlug) + 1} />
          </div>
        </div>
      </main>
    </div>
  );
}