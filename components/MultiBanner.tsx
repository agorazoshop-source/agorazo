import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Package,
  Smartphone,
  Monitor,
} from "lucide-react";

const MultiBanner = () => {
  return (
    <div className="py-2 md:py-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-6 min-h-[300px] md:min-h-[350px]">
        {/* Main Banner - Takes 2 columns (larger) */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-4 md:p-8 h-full min-h-[300px] md:min-h-[350px] flex flex-col justify-center relative overflow-hidden shadow-xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 border border-white rounded-full"></div>
              <div className="absolute bottom-10 right-20 w-20 h-20 border border-white rounded-full"></div>
              <div className="absolute top-1/2 right-5 w-12 h-12 border border-white rounded-full"></div>
            </div>

            <div className="space-y-3 md:space-y-6 z-10">
              <ShoppingBag className="w-8 h-8 md:w-12 md:h-12 text-white" />
              <div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">
                  Welcome To Agorazo
                </h2>
                <p className="text-sm md:text-lg opacity-90 mb-4 md:mb-6">
                  Step Into the World of Quality Products
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-shop_light_green text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold text-sm md:text-base"
              >
                Explore Products
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Banner - Agorazo Bundles (smaller) */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="bg-gradient-to-br from-shop_light_green via-emerald-500 to-shop_dark_green text-white rounded-2xl p-4 md:p-6 h-full min-h-[180px] md:min-h-[350px] flex flex-col justify-center relative overflow-hidden shadow-lg">
            <div className="space-y-2 md:space-y-4 z-10">
              <Package className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
              <div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2">
                  Agorazo Bundles
                </h3>
                <p className="text-xs md:text-sm opacity-90 mb-3 md:mb-4">
                  Discover Our Exclusive Bundles
                </p>
              </div>
              <Link
                href="/products?category=bundles"
                className="inline-flex items-center gap-2 bg-white text-shop_dark_green px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm"
              >
                Shop Now
                <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
              </Link>
            </div>

            {/* Decorative icon */}
            <div className="absolute bottom-4 right-4 opacity-20">
              <Package className="w-20 h-20" />
            </div>

            {/* Floating particles */}
            <div className="absolute top-6 right-6 w-2 h-2 bg-white/30 rounded-full"></div>
            <div className="absolute top-16 right-12 w-1.5 h-1.5 bg-white/20 rounded-full"></div>
            <div className="absolute top-32 right-8 w-1 h-1 bg-white/25 rounded-full"></div>
          </div>
        </div>

        {/* Right Column - Two stacked banners (takes 2 columns) */}
        <div className="lg:col-span-2 space-y-3 md:space-y-6 hidden lg:block">
          {/* Landing Pages Banner */}
          <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-800 rounded-2xl p-4 md:p-6 min-h-[180px] md:min-h-[160px] flex flex-col justify-between relative overflow-hidden shadow-md">
            <div className="space-y-2 md:space-y-4 z-10">
              <Monitor className="w-8 h-8 md:w-10 md:h-10 text-gray-700" />
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-1">
                  Landing Pages
                </h3>
                <p className="text-xs md:text-sm opacity-90 mb-2">
                  Ready-Made Landing Pages
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mt-2 md:mt-4 self-start text-gray-700"
            >
              Shop Now
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>

            {/* Monitor illustration */}
            <div className="absolute bottom-4 right-4 opacity-30">
              <Monitor className="w-16 h-16" />
            </div>

            {/* Floating dots */}
            <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full"></div>
          </div>

          {/* Best Sellers Banner */}
          <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 text-blue-900 rounded-2xl p-4 md:p-6 min-h-[180px] md:min-h-[160px] flex flex-col justify-between relative overflow-hidden shadow-md">
            <div className="space-y-2 md:space-y-4 z-10">
              <ArrowRight className="w-8 h-8 md:w-10 md:h-10 text-blue-700" />
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-1">
                  Best Sellers
                </h3>
                <p className="text-xs md:text-sm opacity-90 mb-2">
                  <span className="inline-block">Upto 40% Discount</span>
                </p>
              </div>
            </div>
            <Link
              href="/products?sort=popular"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mt-2 md:mt-4 self-start text-blue-700"
            >
              Shop Now
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>

            {/* Smartphone illustration */}
            <div className="absolute bottom-4 right-4 opacity-30">
              <Smartphone className="w-16 h-16" />
            </div>

            {/* Percentage badge */}
            <div className="absolute top-3 right-3 text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded-full">
              40% OFF
            </div>

            {/* Sparkle effects */}
            <div className="absolute top-6 left-6 w-1 h-1 bg-yellow-400 rounded-full"></div>
            <div className="absolute top-12 left-4 w-0.5 h-0.5 bg-yellow-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiBanner;
