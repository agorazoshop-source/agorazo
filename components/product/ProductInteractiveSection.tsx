"use client";

import { Product } from "@/sanity.types";
import FavoriteButton from "@/components/FavoriteButton";
import PriceView from "@/components/PriceView";
import ShareButton from "@/components/ShareButton";
import { StarIcon } from "lucide-react";
import React from "react";
import useStore from "@/store";
import AddToCartButton from "@/components/AddToCartButton";
import { cn } from "@/lib/utils";

interface ProductInteractiveSectionProps {
  product: Product & {
    colorGroup?: {
      _id: string;
      name: string;
      products: Product[];
    };
  };
  className?: string;
}

const ProductInteractiveSection = ({
  product,
  className,
}: ProductInteractiveSectionProps) => {
  const productSlug = product?.slug?.current;

  if (!productSlug || !product.name) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-4">
            <ShareButton
              title={product.name}
              description={product.description || ""}
              url={`/product/${productSlug}`}
              iconSize={16}
            />
            <FavoriteButton showProduct={true} product={product} />
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-2xl font-bold"
        />
      </div>

      {/* Description */}
      <div className="text-sm text-gray-600 leading-relaxed">
        <p>{product?.description}</p>
      </div>

      {/* Cart Section */}
      <div className="w-full space-y-4">
        {/* Add to Cart Button */}
        <AddToCartButton product={product} className="w-full" />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <span className="text-amber-600">ℹ️</span>
            Important Notice
          </h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            This is a digital product. Once purchased, you'll receive instant
            access to download your files. Please review the product details
            carefully before purchase, as digital products are non-refundable
            due to their nature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductInteractiveSection;
