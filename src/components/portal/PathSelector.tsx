"use client";

import { motion } from "motion/react";
import { VALUE_PATHS, PATH_ORDER, type ValuePath } from "@/lib/portal-data";

interface PathSelectorProps {
  selected: ValuePath;
  onChange: (path: ValuePath) => void;
  className?: string;
  dark?: boolean;
  layoutId?: string;
}

export function PathSelector({
  selected,
  onChange,
  className = "",
  dark = true,
  layoutId = "portalPathPill",
}: PathSelectorProps) {
  const borderColor = dark ? "border-white/[0.06]" : "border-gray-200";
  const bgColor = dark ? "bg-white/[0.03]" : "bg-gray-50";
  const activeText = dark ? "text-white" : "text-gray-900";
  const inactiveText = dark ? "text-white/35 hover:text-white/55" : "text-gray-400 hover:text-gray-600";

  return (
    <div className={`flex justify-center ${className}`}>
      <div className={`inline-flex ${bgColor} border ${borderColor} rounded-full p-1 sm:p-1.5`}>
        {PATH_ORDER.map((pathId) => {
          const path = VALUE_PATHS[pathId];
          const isActive = selected === pathId;
          return (
            <button
              key={pathId}
              onClick={() => onChange(pathId)}
              className={`relative flex items-center gap-2 sm:gap-2.5 rounded-full px-3 py-2 sm:px-5 sm:py-2.5 transition-colors duration-300 cursor-pointer text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium ${isActive ? activeText : inactiveText}`}
            >
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className={`absolute inset-0 rounded-full border ${dark ? "border-white/[0.1]" : "border-gray-300"}`}
                  style={{ backgroundColor: `${path.color}20` }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2 sm:gap-2.5">
                <span
                  className="w-2 h-2 rounded-full transition-all duration-300 shrink-0"
                  style={{
                    backgroundColor: isActive ? path.color : dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                    boxShadow: isActive ? `0 0 8px ${path.color}40` : "none",
                  }}
                />
                <span className="hidden sm:inline">{path.label}</span>
                <span className="sm:hidden">{path.shortLabel}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
