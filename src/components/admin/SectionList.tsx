"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { MenuSection } from "@/data/menu";

interface SectionItemProps {
  section: MenuSection;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  sensors: ReturnType<typeof useSensors>;
}

function SectionItem({ section, isActive, onSelect, onDelete, sensors }: SectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-md transition-all",
        isActive && "bg-primary/10 border-l-2 border-primary"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={onSelect}
        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-md transition-colors hover:bg-secondary"
      >
        <GripVertical
          className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing flex-shrink-0"
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <p className={cn("font-medium truncate", isActive && "text-primary")}>
            {section.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">{section.category}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
              aria-label={`Delete ${section.title}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete section?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{section.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              <Button variant="outline" onClick={() => {}}>Cancel</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </button>
    </div>
  );
}

interface SectionListProps {
  sections: MenuSection[];
  activeSlug: string | undefined;
  onSelect: (slug: string | undefined) => void;
  onReorder: (sections: MenuSection[]) => void;
  onDelete: (slug: string | undefined) => void;
  onCreate: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SectionList({
  sections,
  activeSlug,
  onSelect,
  onReorder,
  onDelete,
  onCreate,
  isCollapsed,
  onToggleCollapse,
}: SectionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // Use lazy initialization to prevent hydration mismatch in SSR
  const [sortedSections, setSortedSections] = useState(() => sections);

  // Keep sorted sections in sync with props
  useEffect(() => {
    setSortedSections(sections);
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
      const newIndex = sortedSections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(sortedSections, oldIndex, newIndex);
      setSortedSections(newSections);
      onReorder(newSections);
    }
  };

  const filteredSections = sortedSections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCollapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label="Expand sidebar"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="flex h-full flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-lg">Sections ({sections.length})</CardTitle>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search sections"
          />
        </div>
      </div>

      {/* Section List with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredSections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredSections.map((section) => (
              <SectionItem
                key={section.id}
                section={section}
                isActive={activeSlug === section.id}
                onSelect={() => onSelect(section.id)}
                onDelete={() => onDelete(section.id)}
                sensors={sensors}
              />
            ))}
            {filteredSections.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No sections found
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Create New Section */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onCreate}
        >
          <Plus className="h-4 w-4" />
          New Section
        </Button>
      </div>
    </div>
  );
}