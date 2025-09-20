"use client";

import { useEffect } from "react";
import { trackViewWishlist } from "@/lib/facebook-pixel";

/**
 * Component to track wishlist page visits with Facebook Pixel
 */
export default function WishlistTracker() {
  useEffect(() => {
    // Track wishlist page visit when component mounts
    trackViewWishlist();
  }, []);

  return null; // This component doesn't render anything
}
