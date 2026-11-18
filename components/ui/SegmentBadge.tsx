import React from "react";
import type { Segment } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SegmentBadgeProps {
  segment: Segment;
  className?: string;
  size?: "sm" | "md";
}

export function SegmentBadge({ segment, className, size = "md" }: SegmentBadgeProps) {
  const configs: Record<
    Segment,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    New: {
      label: "New",
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
      dot: "bg-sky-500",
    },
    Regular: {
      label: "Regular",
      bg: "bg-teal-50",
      text: "text-[#0E7C9B]",
      border: "border-teal-200",
      dot: "bg-[#0E7C9B]",
    },
    Late: {
      label: "Late",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    Lapsed: {
      label: "Lapsed",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
    },
  };

  const config = configs[segment] || configs.Regular;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border shadow-2xs font-medium",
        config.bg,
        config.text,
        config.border,
        sizeClasses,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
