"use client";

import React, { useState, useEffect } from "react";
import { X, Gift, Sparkles } from "lucide-react";

interface MovingPromoBannerProps {
  text?: string;
  bgGradient?: string;
  textColor?: string;
  closeable?: boolean;
  autoHide?: number; // Auto hide after X seconds
  icon?: "gift" | "sparkles" | "emoji" | "none";
}

const MovingPromoBanner: React.FC<MovingPromoBannerProps> = ({
  text = "🎉 New Welcome Offer: Get Flat 20% Off On All Products! Apply Promocode WELCOME20. 🎉",
  bgGradient = "from-shop_light_green via-emerald-500 to-shop_dark_green",
  textColor = "text-white",
  closeable = true,
  autoHide,
  icon = "emoji",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto hide functionality
  useEffect(() => {
    if (autoHide && autoHide > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHide * 1000);

      return () => clearTimeout(timer);
    }
  }, [autoHide]);

  // Check if banner was previously dismissed (localStorage)
  useEffect(() => {
    const dismissed = localStorage.getItem("promo-banner-dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("promo-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (icon) {
      case "gift":
        return <Gift className="w-4 h-4 mr-2" />;
      case "sparkles":
        return <Sparkles className="w-4 h-4 mr-2" />;
      case "emoji":
        return null; // Emojis are included in text
      case "none":
        return null;
      default:
        return null;
    }
  };

  return (
    <div className={`pt-4`}>
      <div
        className={`relative bg-gradient-to-r ${bgGradient} ${textColor} overflow-hidden z-40 max-w-7xl mx-auto px-4 rounded-xl`}
      >
        {/* Moving text container */}
        <div className="relative h-12 flex items-center overflow-hidden">
          <div className="flex animate-marquee-circular whitespace-nowrap">
            <span className="text-sm font-medium px-16 flex items-center shrink-0">
              {getIcon()}
              {text}
            </span>
            <span className="text-sm font-medium px-16 flex items-center shrink-0">
              {getIcon()}
              {text}
            </span>
            <span className="text-sm font-medium px-16 flex items-center shrink-0">
              {getIcon()}
              {text}
            </span>
            <span className="text-sm font-medium px-16 flex items-center shrink-0">
              {getIcon()}
              {text}
            </span>
            <span className="text-sm font-medium px-16 flex items-center shrink-0">
              {getIcon()}
              {text}
            </span>
            <span className="text-sm font-medium px-16 flex items-center shrink-0">
              {getIcon()}
              {text}
            </span>
            <span className="text-sm font-medium px-16 flex items-center shrink-0">
              {getIcon()}
              {text}
            </span>
          </div>
        </div>

        {/* Close button */}
        {/* {closeable && (
          <button
            onClick={handleClose}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-white/20 rounded-full p-1.5 transition-all duration-200 hover:scale-110"
            aria-label="Close banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>   
        )} */}

        {/* Background animation overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

        {/* Subtle pulse effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent animate-pulse opacity-50"></div>
      </div>
    </div>
  );
};

export default MovingPromoBanner;
