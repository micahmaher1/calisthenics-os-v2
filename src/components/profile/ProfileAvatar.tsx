"use client";

import { useRef } from "react";
import { saveAvatar, removeAvatar } from "@/lib/profile-storage";
import { getInitials } from "@/lib/profile-utils";

interface Props {
  avatarUrl:   string | null;
  name:        string;
  displayName: string;
  size?:       "sm" | "md" | "lg" | "xl";
  editable?:   boolean;
  onChanged?:  (url: string | null) => void;
  rankColor?:  string;
}

const SIZE_MAP = {
  sm: { outer: "w-9 h-9",  text: "text-xs",  ring: "ring-2"  },
  md: { outer: "w-12 h-12", text: "text-sm",  ring: "ring-2"  },
  lg: { outer: "w-20 h-20", text: "text-xl",  ring: "ring-2"  },
  xl: { outer: "w-28 h-28", text: "text-3xl", ring: "ring-[3px]" },
};

export default function ProfileAvatar({
  avatarUrl, name, displayName, size = "md", editable = false,
  onChanged, rankColor = "ring-green-500/40",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const sz = SIZE_MAP[size];
  const initials = getInitials(name, displayName);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      saveAvatar(url);
      onChanged?.(url);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeAvatar();
    onChanged?.(null);
  };

  return (
    <div className="relative group inline-block">
      {/* Avatar circle */}
      <div
        className={`${sz.outer} rounded-full ${sz.ring} ${rankColor} overflow-hidden bg-surface-700 border border-white/10 flex items-center justify-center flex-shrink-0 ${editable ? "cursor-pointer" : ""}`}
        onClick={() => editable && inputRef.current?.click()}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className={`font-display ${sz.text} text-white/60 select-none`}>{initials}</span>
        )}

        {/* Edit overlay */}
        {editable && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
            <span className="text-white text-xs">📷</span>
          </div>
        )}
      </div>

      {/* Remove button */}
      {editable && avatarUrl && (
        <button
          onClick={handleRemove}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400 z-10"
          title="Remove photo"
        >
          ✕
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
