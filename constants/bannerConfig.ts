// Banner configuration presets
export const bannerPresets = {
  welcome: {
    text: "🎉 New Welcome Offer: Get Flat 20% Off On All Products! Apply Promocode WELCOME20. 🎉",
    bgGradient: "from-shop_light_green via-emerald-500 to-shop_dark_green",
    textColor: "text-white",
    icon: 'emoji' as const,
  },
  
  flash_sale: {
    text: "⚡ Flash Sale Alert: Up to 50% OFF on Selected Items! Limited Time Only! ⚡",
    bgGradient: "from-red-500 via-pink-500 to-red-600",
    textColor: "text-white",
    icon: 'sparkles' as const,
  },
  
  free_shipping: {
    text: "🚚 FREE Shipping on Orders Above ₹999! No Minimum Order Value! 🚚",
    bgGradient: "from-blue-500 via-indigo-500 to-blue-600",
    textColor: "text-white",
    icon: 'gift' as const,
  },
  
  new_arrivals: {
    text: "✨ New Arrivals Just Landed! Check Out Our Latest Collection Now! ✨",
    bgGradient: "from-purple-500 via-violet-500 to-purple-600",
    textColor: "text-white",
    icon: 'sparkles' as const,
  },
  
  seasonal: {
    text: "🌸 Spring Sale: Refresh Your Wardrobe with 30% OFF! Use Code SPRING30 🌸",
    bgGradient: "from-pink-400 via-rose-400 to-pink-500",
    textColor: "text-white",
    icon: 'emoji' as const,
  },
  
  weekend_special: {
    text: "🎯 Weekend Special: Buy 2 Get 1 FREE on All Categories! Shop Now! 🎯",
    bgGradient: "from-orange-500 via-amber-500 to-orange-600",
    textColor: "text-white",
    icon: 'gift' as const,
  }
};

// Current active banner
export const activeBanner = bannerPresets.welcome;