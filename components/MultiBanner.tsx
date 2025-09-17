import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Package, Smartphone, Monitor } from "lucide-react";

const MultiBanner = () => {

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[500px]">
        {/* Main Banner - Takes 2 columns (larger) */}
        <div className="lg:col-span-2 group">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-8 h-full min-h-[500px] flex flex-col justify-center relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer">
            {/* Animated background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Background pattern with animation */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <div className="absolute top-10 right-10 w-32 h-32 border border-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 right-20 w-20 h-20 border border-white rounded-full group-hover:animate-spin transition-all duration-1000"></div>
              <div className="absolute top-1/2 right-5 w-12 h-12 border border-white rounded-full group-hover:scale-110 transition-transform duration-300"></div>
            </div>
            
            <div className="space-y-6 z-10">
              <ShoppingBag className="w-12 h-12 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  Welcome To Agorazo
                </h2>
                <p className="text-lg opacity-90 mb-6 group-hover:opacity-100 transition-opacity duration-300">
                  Step Into the World of Quality Products
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-shop_light_green hover:bg-shop_dark_green text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 hover:gap-3"
              >
                Explore Products
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Banner - Agorazo Bundles (smaller) */}
        <div className="lg:col-span-1 group">
          <div className="bg-gradient-to-br from-shop_light_green via-emerald-500 to-shop_dark_green text-white rounded-2xl p-6 h-full min-h-[500px] flex flex-col justify-center relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.03] cursor-pointer">
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
            
            <div className="space-y-4 z-10">
              <Package className="w-10 h-10 text-white group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 drop-shadow-lg" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:tracking-wide transition-all duration-300">
                  Agorazo Bundles
                </h3>
                <p className="text-sm opacity-90 mb-4 group-hover:opacity-100 transition-opacity duration-300">
                  Discover Our Exclusive Bundles
                </p>
              </div>
              <Link
                href="/shop?category=bundles"
                className="inline-flex items-center gap-2 bg-white text-shop_dark_green hover:bg-gray-100 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm hover:shadow-md hover:scale-105 hover:gap-3"
              >
                Shop Now
                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            
            {/* Decorative icon with enhanced animation */}
            <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-30 transition-all duration-500">
              <Package className="w-20 h-20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700" />
            </div>
            
            {/* Floating particles effect */}
            <div className="absolute top-6 right-6 w-2 h-2 bg-white/30 rounded-full group-hover:animate-bounce"></div>
            <div className="absolute top-16 right-12 w-1.5 h-1.5 bg-white/20 rounded-full group-hover:animate-pulse"></div>
            <div className="absolute top-32 right-8 w-1 h-1 bg-white/25 rounded-full group-hover:animate-bounce delay-100"></div>
          </div>
        </div>

        {/* Right Column - Two stacked banners (takes 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Landing Pages Banner */}
          <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-800 rounded-2xl p-6 min-h-[240px] flex flex-col justify-between relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 transform hover:scale-[1.02] cursor-pointer group">
            {/* Subtle animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="space-y-4 z-10">
              <Monitor className="w-10 h-10 text-gray-700 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
              <div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-blue-900 transition-colors duration-300">
                  Landing Pages
                </h3>
                <p className="text-sm opacity-90 mb-2 group-hover:opacity-100 transition-opacity duration-300">
                  Ready-Made Landing Pages
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all duration-300 mt-4 self-start text-gray-700 hover:text-blue-600 hover:scale-105"
            >
              Shop Now 
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            {/* Monitor illustration with enhanced animation */}
            <div className="absolute bottom-4 right-4 opacity-30 group-hover:opacity-50 transition-all duration-500">
              <Monitor className="w-16 h-16 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" />
            </div>
            
            {/* Floating dots */}
            <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:animate-ping"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full group-hover:animate-pulse delay-150"></div>
          </div>

          {/* Best Sellers Banner */}
          <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 text-blue-900 rounded-2xl p-6 min-h-[240px] flex flex-col justify-between relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 transform hover:scale-[1.02] cursor-pointer group">
            {/* Dynamic background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 via-transparent to-cyan-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Animated border shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="space-y-4 z-10">
              <ArrowRight className="w-10 h-10 text-blue-700 group-hover:text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-900 transition-colors duration-300">
                  Best Sellers
                </h3>
                <p className="text-sm opacity-90 mb-2 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-block group-hover:scale-110 transition-transform duration-300">Upto 40% Discount</span>
                </p>
              </div>
            </div>
            <Link
              href="/shop?sort=popular"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all duration-300 mt-4 self-start text-blue-700 hover:text-indigo-600 hover:scale-105"
            >
              Shop Now 
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            {/* Smartphone illustration with enhanced animation */}
            <div className="absolute bottom-4 right-4 opacity-30 group-hover:opacity-50 transition-all duration-500">
              <Smartphone className="w-16 h-16 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500" />
            </div>
            
            {/* Percentage badge effect */}
            <div className="absolute top-3 right-3 text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
              40% OFF
            </div>
            
            {/* Sparkle effects */}
            <div className="absolute top-6 left-6 w-1 h-1 bg-yellow-400 rounded-full group-hover:animate-ping delay-200"></div>
            <div className="absolute top-12 left-4 w-0.5 h-0.5 bg-yellow-300 rounded-full group-hover:animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiBanner;