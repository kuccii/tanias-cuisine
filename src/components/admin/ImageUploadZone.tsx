"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  uploadMenuItemImageBase64,
  uploadSectionHeaderImage,
  type MenuItem,
} from "@/lib/menu-cms.server";

interface ImageUploadZoneProps {
  value?: string;
  onChange: (url: string) => void;
  slug?: string;
  context: "header" | "item";
  itemName?: string;
  className?: string;
  label?: string;
}

export function ImageUploadZone({
  value,
  onChange,
  slug,
  context,
  itemName,
  className,
  label,
}: ImageUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Don't upload if no slug is provided (section not yet created/saved)
  const canUpload = !!slug;

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!canUpload) {
        toast.warning("Please save the section first to enable image upload");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }

      setIsUploading(true);

      try {
        // Create base64 data
        const base64 = await fileToBase64(file);

        let result: { publicUrl: string };

        if (context === "header") {
          result = await uploadSectionHeaderImage({
            data: {
              base64: base64.replace(/^data:image\/[a-z]+;base64,/, ""),
              sectionSlug: slug,
              filename: file.name,
              mimeType: file.type,
            },
          });
        } else {
          if (!itemName) {
            toast.error("Item name is required for image upload");
            return;
          }
          result = await uploadMenuItemImageBase64({
            data: {
              base64: base64.replace(/^data:image\/[a-z]+;base64,/, ""),
              slug,
              itemName,
              filename: file.name,
              mimeType: file.type,
            },
          });
        }

        onChange(result.publicUrl);
        setPreviewUrl(result.publicUrl);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(
          error instanceof Error ? error.message : "Upload failed. Please try again."
        );
      } finally {
        setIsUploading(false);
      }
    },
    [context, slug, itemName, onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(() => {
    onChange("");
    setPreviewUrl(null);
  }, [onChange]);

  const currentImage = previewUrl || value;

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              currentImage
                ? "border-border/50 bg-muted/30"
                : !canUpload
                  ? "border-border/30 bg-muted/20 cursor-not-allowed"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading || !canUpload}
            />

            {currentImage ? (
              // Preview with remove button
              <div className="relative aspect-video max-w-xs mx-auto">
                <img
                  src={currentImage}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove();
                  }}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // Upload prompt
              <div className="flex flex-col items-center gap-3 text-center">
                <Upload className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {canUpload
                    ? label || "Drag & drop an image here"
                    : "Save section first to enable image upload"
                  }
                  or click to select
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Max 50MB · PNG, JPG, WebP
                </p>
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              </div>
            )}
          </div>

          {/* Current URL display (for manual entry) */}
          {value && !previewUrl && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Image className="h-3 w-3" />
              <span className="truncate font-mono">Current: {value}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}