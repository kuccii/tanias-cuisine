"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, GripVertical, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { MenuItem, MenuGroup, SpecialBox, MenuSection } from "@/data/menu";
import { useState } from "react";

interface EditorTabsProps {
  section: MenuSection | null;
  onUpdate: (updates: Partial<MenuSection>) => void;
  onDeleteItem?: (itemName: string) => void;
  onAddItem?: () => void;
  isCollapsed?: boolean;
  onReorderItems?: (items: MenuItem[], groupName?: string) => void;
}

export function EditorTabs({
  section,
  onUpdate,
  onDeleteItem,
  onAddItem,
  isCollapsed = false,
  onReorderItems,
}: EditorTabsProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [openSpecialBox, setOpenSpecialBox] = useState(false);

  if (!section) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground">
        <p>Select a section to edit</p>
      </div>
    );
  }

  const handleInputChange = (field: keyof MenuSection, value: any) => {
    onUpdate({ [field]: value });
  };

  const handleItemUpdate = (groupName: string | undefined, index: number, updates: Partial<MenuItem>) => {
    const items = groupName
      ? section.groups?.find(g => g.name === groupName)?.items ?? []
      : (section.items ?? []);

    if (items) {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], ...updates };

      if (groupName) {
        const newGroups = section.groups?.map(g =>
          g.name === groupName ? { ...g, items: newItems } : g
        );
        onUpdate({ groups: newGroups });
      } else {
        onUpdate({ items: newItems });
      }
    }
  };

  const handleItemDelete = (groupName: string | undefined, itemName: string) => {
    const items = groupName
      ? section.groups?.find(g => g.name === groupName)?.items ?? []
      : (section.items ?? []);

    if (items) {
      const newItems = items.filter((_, i) => i < items.length && items[i].name !== itemName);

      if (groupName) {
        const newGroups = section.groups?.map(g =>
          g.name === groupName ? { ...g, items: newItems } : g
        );
        onUpdate({ groups: newGroups });
      } else {
        onUpdate({ items: newItems });
      }
    }

    onDeleteItem?.(itemName);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Tabs defaultValue="general" className="flex-1 flex flex-col">
        <div className="overflow-x-auto border-b border-border bg-background/95 backdrop-blur-sm">
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
              Special Box
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs">
              Images
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={section.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Section name"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={section.category || ""}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="Category (e.g., Starters, Mains)"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={section.subtitle || ""}
                  onChange={(e) => handleInputChange("subtitle", e.target.value)}
                  placeholder="Section subtitle"
                />
              </div>

              <div>
                <Label htmlFor="id">Section ID</Label>
                <Input
                  id="id"
                  value={section.id || ""}
                  onChange={(e) => handleInputChange("id", e.target.value.toLowerCase().replace(/\s+/g, "-"))
                  placeholder="section-id"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used for URL routing. Must be unique.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact">Compact Layout</Label>
                  <p className="text-xs text-muted-foreground">
                    Smaller grid with more columns
                  </p>
                </div>
                <Switch
                  id="compact"
                  checked={section.compact || false}
                  onCheckedChange={(checked) => handleInputChange("compact", checked)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Items ({section.items?.length ?? 0})</h3>
              <Button variant="outline" size="sm" onClick={onAddItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {!section.groups && (
              <ItemsList
                items={section.items ?? []}
                sectionId={section.id}
                onUpdate={handleItemUpdate}
                onDelete={handleItemDelete}
                onReorder={onReorderItems ? (items) => onReorderItems(items) : undefined}
              />
            )}
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">
                Groups ({section.groups?.length ?? 0})
              </h3>
            </div>

            {!section.groups || section.groups.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No groups defined. Items are displayed in a flat list.
              </p>
            ) : (
              <div className="space-y-3">
                {section.groups?.map((group) => (
                  <Collapsible
                    key={group.name}
                    open={openGroups[group.name]}
                    onOpenChange={(open) => {
                      setOpenGroups((prev) => ({ ...prev, [group.name]: open }));
                    }}
                  >
                    <div className="border rounded-lg">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-3 hover:bg-muted/30 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                openGroups[group.name] ? "rotate-180" : ""
                              }`}
                            />
                            <h4 className="font-medium">{group.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {group.items?.length ?? 0} items
                            </Badge>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-3 pb-3">
                          <ItemsList
                            items={group.items ?? []}
                            sectionId={section.id}
                            groupName={group.name}
                            onUpdate={(index, updates) =>
                              handleItemUpdate(group.name, index, updates)
                            }
                            onDelete={(itemName) => handleItemDelete(group.name, itemName)}
                            onReorder={(items) => {
                              if (onReorderItems) {
                                const filteredGroups = section.groups?.filter(g => g.name !== group.name);
                                const updatedGroup = { name: group.name, items };
                                onUpdate({
                                  groups: [...(filteredGroups ?? []), updatedGroup],
                                });
                              }
                            }}
                          />
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Special Box Tab */}
          <TabsContent value="special" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Special Box</h3>
              <Switch
                checked={!!section.special_box}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onUpdate({
                      special_box: {
                        title: "Chef's Special",
                        items: [],
                      },
                    });
                  } else {
                    onUpdate({ special_box: undefined });
                  }
                }}
              />
            </div>

            {section.special_box && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="special-title">Title</Label>
                  <Input
                    id="special-title"
                    value={section.special_box.title || ""}
                    onChange={(e) =>
                      onUpdate({
                        special_box: {
                          ...section.special_box,
                          title: e.target.value,
                        },
                      })
                    }
                    placeholder="Special offer name"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-medium mb-2">Special Items</h4>
                  <ItemsList
                    items={section.special_box.items ?? []}
                    sectionId={section.id}
                    onUpdate={(index, updates) => {
                      const newItems = [...(section.special_box?.items ?? [])];
                      newItems[index] = { ...newItems[index], ...updates };
                      onUpdate({
                        special_box: {
                          ...section.special_box,
                          items: newItems,
                        },
                      });
                    }}
                    onDelete={(itemName) => {
                      const newItems = (section.special_box?.items ?? []).filter(
                        (_, i) => (section.special_box?.items ?? [])[i].name !== itemName
                      );
                      onUpdate({
                        special_box: {
                          ...section.special_box,
                          items: newItems,
                        },
                      });
                      onDeleteItem?.(itemName);
                    }}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Section Header Image</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload an image for the section header
                </p>
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.title}
                    className="max-h-48 object-contain rounded-md"
                  />
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

interface ItemsListProps {
  items: MenuItem[];
  sectionId: string;
  groupName?: string;
  onUpdate: (index: number, updates: Partial<MenuItem>) => void;
  onDelete: (itemName: string) => void;
  onReorder?: (items: MenuItem[]) => void;
}

function ItemsList({
  items,
  sectionId,
  groupName,
  onUpdate,
  onDelete,
  onReorder,
}: ItemsListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No items in this{sectionId ? ` ${groupName ? ` group` : ""}` : ""} yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.name || idx} className="border rounded-lg p-3">
          <div className="flex items-start gap-3">
            <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 cursor-grab" />
            <div className="flex-1 space-y-2">
              <Input
                value={item.name || ""}
                onChange={(e) => onUpdate(idx, { name: e.target.value })}
                className="font-medium"
              />
              <Input
                value={item.price || ""}
                onChange={(e) => onUpdate(idx, { price: e.target.value })}
                placeholder="Price (e.g., 25,000 FRW)"
                className="font-mono text-sm"
              />
              <Textarea
                value={item.description || ""}
                onChange={(e) => onUpdate(idx, { description: e.target.value })}
                placeholder="Description"
                rows={2}
                className="text-sm"
              />
              <Input
                value={item.note || ""}
                onChange={(e) => onUpdate(idx, { note: e.target.value })}
                placeholder="Note (optional)"
                className="text-xs"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.name)}
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}