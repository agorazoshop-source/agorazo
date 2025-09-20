"use client";

import { useEffect } from "react";
import { trackViewCategory } from "@/lib/facebook-pixel";

interface CategoryTrackerProps {
  categoryName: string;
}

/**
 * Component to track category page visits with Facebook Pixel
 */
export default function CategoryTracker({
  categoryName,
}: CategoryTrackerProps) {
  useEffect(() => {
    // Track category view when component mounts
    trackViewCategory(categoryName);
  }, [categoryName]);

  return null; // This component doesn't render anything
}
