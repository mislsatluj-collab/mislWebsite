"use client";

import React from "react";
import Image from "next/image";

export default function PunjabWatermark() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center select-none p-4"
      aria-hidden="true"
    >
      {/* Full screen mobile-responsive image container */}
      <div className="relative w-full h-full max-w-4xl max-h-[85vh] flex items-center justify-center">
        <Image
          src="/images/punjab-bgremoved.png"
          alt="Punjab Art Background Watermark"
          fill
          className="object-contain opacity-15 dark:opacity-20 transition-opacity duration-300 pointer-events-none"
          priority
        />
      </div>
    </div>
  );
}
