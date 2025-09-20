"use client";

import { useEffect } from "react";
import { trackHomePageVisit } from "@/lib/facebook-pixel";

/**
 * Component to track home page visits with Facebook Pixel
 */
export default function HomePageTracker() {
  useEffect(() => {
    // Track home page visit when component mounts
    trackHomePageVisit();
  }, []);

  return null; // This component doesn't render anything
}
