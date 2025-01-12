import React, { useRef } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { cn } from "../../../utils/styles";

interface VideoPreviewProps {
  url: string;
  fileName: string;
  onDelete: () => void;
}

export function VideoPreview({ url, fileName, onDelete }: VideoPreviewProps) {
  const { colors } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className="p-4">
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <button
          onClick={handleDelete}
          className={cn(
            "absolute top-3 right-3 z-10",
            "p-1.5 rounded-full",
            "bg-red-500 hover:bg-red-600",
            "transform hover:scale-110 transition-all",
            "shadow-lg"
          )}
          aria-label="Delete video"
        >
          <X size={16} className="text-white" />
        </button>

        <div className="aspect-video bg-black relative">
          <video
            ref={videoRef}
            src={`${url}#t=0.1`}
            className="w-full h-full object-contain"
            controls
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div
          className="py-2 px-3"
          style={{ backgroundColor: `${colors.primary}CC` }}
        >
          <p className="text-sm text-white truncate">{fileName}</p>
        </div>
      </div>
    </div>
  );
}
