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

  const getPreviewUrl = (val: string) => {
    if (!val) return "";
    if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:") || val.startsWith("blob:")) {
      return val;
    }
    // If it's an uploaded asset inside admin public/uploads:
    if (val.startsWith("/uploads/")) {
      return val;
    }
    const websiteBase = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";
    const cleanPath = val.startsWith("/") ? val : `/${val}`;
    return `${websiteBase}${encodeURI(cleanPath)}`;
  };

  return (
    <div className="space-y-2 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#202A2E] truncate">
          {label}
        </label>
        <span className="text-[10px] font-semibold text-[#847B70] uppercase shrink-0">
          Supported: {allowedTypes.join(" / ")}
        </span>
      </div>

      <div className="bg-[#FAF9F5] border border-[#E4DED3] rounded-xl p-3.5 space-y-3 min-w-0 overflow-hidden">
        {/* Upload & URL Input Stack (placed cleanly below input) */}
        <div className="space-y-2">
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
            placeholder="/Sustanablity/... or https://... or upload below"
            className="w-full px-3.5 py-2 bg-[#FFFFFF] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#E97835]"
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
            className="w-full py-2 px-3.5 rounded-lg bg-[#E97835] hover:bg-[#d66a2a] text-[#FFFFFF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-white" />
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
          <div className="relative rounded-xl overflow-hidden border border-[#E4DED3] bg-[#FFFFFF] p-3 space-y-2 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-[#E97835] flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E97835] animate-pulse" />
                Current Active Preview
              </span>
              <span className="text-[10px] font-mono text-[#847B70] truncate min-w-0" title={value}>
                {value}
              </span>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-[#E4DED3] bg-[#FAF9F5] max-h-56 flex items-center justify-center p-2">
              {isVideo ? (
                <video
                  src={getPreviewUrl(value)}
                  controls
                  className="max-h-48 rounded w-auto max-w-full object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getPreviewUrl(value)}
                  alt={label || "Media preview"}
                  className="max-h-48 rounded w-auto max-w-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.triedFallback && !value.startsWith("http")) {
                      target.dataset.triedFallback = "true";
                      target.src = `http://localhost:3000${value.startsWith("/") ? "" : "/"}${encodeURI(value)}`;
                    }
                  }}
                />
              )}

              <button
                type="button"
                onClick={() => onChange("", "image")}
                title="Clear media"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#202A2E]/70 text-white hover:bg-red-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {helperText && (
          <p className="text-[11px] text-[#687378] leading-normal">{helperText}</p>
        )}
      </div>
    </div>
  );
}
