"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Film, Image as ImageIcon, Sparkles, Check, AlertCircle } from "lucide-react";

interface MediaUploaderProps {
  label: string;
  value: string;
  mediaType?: "video" | "image" | "gif";
  onChange: (url: string, detectedType: "video" | "image" | "gif") => void;
  allowedTypes?: ("video" | "image" | "gif")[];
  helperText?: string;
}

export default function MediaUploader({
  label,
  value,
  mediaType = "image",
  onChange,
  allowedTypes = ["image", "video", "gif"],
  helperText,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onChange(data.url, data.mediaType as "video" | "image" | "gif");
      } else {
        setUploadError(data.message || "Upload failed");
      }
    } catch (err: any) {
      setUploadError("Error uploading media file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isVideo = mediaType === "video" || value?.endsWith(".mp4") || value?.endsWith(".webm");
  const isGif = mediaType === "gif" || value?.endsWith(".gif");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#202A2E]">
          {label}
        </label>
        <span className="text-[10px] font-semibold text-[#847B70] uppercase">
          Supported: {allowedTypes.join(" / ")}
        </span>
      </div>

      <div className="bg-[#FAF9F5] border border-[#E4DED3] rounded-xl p-3.5 space-y-3">
        {/* Upload & URL Input Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => {
              const val = e.target.value;
              let detected: "video" | "image" | "gif" = "image";
              if (val.match(/\.(mp4|webm|ogg|mov)$/i)) detected = "video";
              else if (val.match(/\.gif$/i)) detected = "gif";
              onChange(val, detected);
            }}
            placeholder="/home/example.png or https://... or uploaded file"
            className="flex-1 px-3.5 py-2 bg-[#FFFFFF] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D1B48C]"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.gif"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3.5 py-2 rounded-lg bg-[#202A2E] hover:bg-[#2b383e] text-[#FFFFFF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-[#D1B48C]" />
                <span>Upload Media</span>
              </>
            )}
          </button>
        </div>

        {uploadError && (
          <div className="p-2 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Media Preview Box */}
        {value && typeof value === "string" && value.trim() !== "" && (
          <div className="relative rounded-lg overflow-hidden border border-[#E4DED3] bg-[#202A2E]/5 max-h-56 flex items-center justify-center p-2">
            {isVideo ? (
              <video
                src={value}
                controls
                className="max-h-48 rounded w-auto max-w-full object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt={label || "Media preview"}
                className="max-h-48 rounded w-auto max-w-full object-contain"
                onError={(e) => {
                  // Fallback for image preview error
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            )}

            <button
              type="button"
              onClick={() => onChange("", "image")}
              title="Clear media"
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#202A2E]/80 text-[#FFFFFF] hover:bg-red-600 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {helperText && (
          <p className="text-[11px] text-[#687378] leading-normal">{helperText}</p>
        )}
      </div>
    </div>
  );
}
