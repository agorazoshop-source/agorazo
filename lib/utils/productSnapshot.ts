import { Product } from "@/sanity.types";

/**
 * Creates a product snapshot for order items
 * This ensures orders have complete product data even if the original product is deleted
 */
export function createProductSnapshot(product: Product) {
  return {
    name: product.name || "",
    slug: product.slug,
    description: product.description || "",
    images: product.images || [],
    price: product.price || 0,
    discount: product.discount || 0,
    productLink: product.productLink,
    status: product.status,
  };
}

/**
 * Gets product information from order item
 * Uses snapshot data if available, falls back to referenced product
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getProductFromOrderItem(orderItem: any): {
  _id: string;
  name: string;
  slug?: { current: string };
  description?: string;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    _type: "image";
    _key: string;
  }>;
  price: number;
  discount?: number;
  productLink?: string;
  status?: string;
  isDeleted?: boolean;
} {
  // If we have snapshot data, use it (this is the preferred method)
  if (orderItem.productSnapshot) {
    return {
      _id:
        orderItem.product?._ref || orderItem.product?._id || "deleted-product",
      name: orderItem.productSnapshot.name,
      slug: orderItem.productSnapshot.slug,
      description: orderItem.productSnapshot.description,
      images: orderItem.productSnapshot.images,
      price: orderItem.productSnapshot.price,
      discount: orderItem.productSnapshot.discount,
      productLink: orderItem.productSnapshot.productLink,
      status: orderItem.productSnapshot.status,
      isDeleted: !orderItem.product?._ref && !orderItem.product?._id, // Flag to indicate if original product was deleted
    };
  }

  // Fallback to referenced product (for backward compatibility)
  if (orderItem.product) {
    return {
      _id: orderItem.product._ref || orderItem.product._id || "unknown-product",
      name: orderItem.product.name || "Product Not Available",
      slug: orderItem.product.slug || { current: "product-not-available" },
      description:
        orderItem.product.description || "This product is no longer available",
      images: orderItem.product.images || [],
      price: orderItem.product.price || orderItem.price || 0,
      discount: orderItem.product.discount || 0,
      productLink: orderItem.product.productLink || "",
      status: orderItem.product.status || "unavailable",
      isDeleted: false,
    };
  }

  // If no product data available, return a placeholder
  return {
    _id: "unknown-product",
    name: "Product Not Available",
    slug: { current: "product-not-available" },
    description: "This product is no longer available",
    images: [],
    price: orderItem.price || 0,
    discount: 0,
    productLink: "",
    status: "unavailable",
    isDeleted: true,
  };
}

/**
 * Checks if a product in an order item has been deleted
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isProductDeleted(orderItem: any): boolean {
  return (
    !orderItem.product?._ref &&
    !orderItem.product?._id &&
    !!orderItem.productSnapshot
  );
}

/**
 * Gets the display name for a product in an order
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getProductDisplayName(orderItem: any): string {
  if (orderItem.productSnapshot?.name) {
    return orderItem.productSnapshot.name;
  }
  if (orderItem.product?.name) {
    return orderItem.product.name;
  }
  return "Product Not Available";
}
