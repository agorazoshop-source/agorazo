// Facebook Pixel utility functions
declare global {
  interface Window {
    fbq: (
      action: string,
      event: string,
      data?: Record<string, unknown>
    ) => void;
  }
}

export const trackPageView = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

export const trackPurchase = (
  value: number,
  currency: string = "INR",
  orderId: string
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      value: value,
      currency: currency,
      content_ids: [orderId],
      content_type: "product",
    });
  }
};

export const trackAddToCart = (
  value: number,
  currency: string = "INR",
  productName: string
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "AddToCart", {
      value: value,
      currency: currency,
      content_name: productName,
      content_type: "product",
    });
  }
};

export const trackInitiateCheckout = (
  value: number,
  currency: string = "INR"
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      value: value,
      currency: currency,
    });
  }
};

export const trackViewContent = (
  productName: string,
  value: number,
  currency: string = "INR"
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: productName,
      value: value,
      currency: currency,
      content_type: "product",
    });
  }
};

// Track home page visits
export const trackHomePageVisit = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: "Home Page",
      content_type: "homepage",
    });
  }
};

// Track wishlist interactions
export const trackAddToWishlist = (
  productName: string,
  value: number,
  currency: string = "INR"
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "AddToWishlist", {
      content_name: productName,
      value: value,
      currency: currency,
      content_type: "product",
    });
  }
};

export const trackViewWishlist = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: "Wishlist",
      content_type: "wishlist",
    });
  }
};

// Track search events
export const trackSearch = (searchTerm: string) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Search", {
      search_string: searchTerm,
    });
  }
};

// Track category views
export const trackViewCategory = (categoryName: string) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: categoryName,
      content_type: "category",
    });
  }
};

// Track lead generation (for contact forms, etc.)
export const trackLead = (leadType: string = "contact") => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {
      content_name: leadType,
      content_type: "lead",
    });
  }
};
