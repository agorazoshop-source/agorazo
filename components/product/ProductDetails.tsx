"use client";

import { Product } from "@/sanity.types";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import ProductVideo from "@/components/ProductVideo";
import ShareButton from "@/components/ShareButton";
import { StarIcon, Video, Info } from "lucide-react";
import React from "react";

import AddToCartButton from "@/components/AddToCartButton";

interface ProductDetailsProps {
  product: Product;
  productReel: {
    video: {
      url: string;
    };
  } | null;
}

const ProductDetails = ({ product, productReel }: ProductDetailsProps) => {
  const productSlug = product?.slug?.current;
  if (!productSlug || !product.name) {
    return null;
  }

  return (
    <div className="bg-white py-3 md:py-2">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Media Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Product Image */}
            <div className="md:col-span-9">
              {product?.images && <ImageView images={product.images} />}
            </div>

            {/* Product Video - Desktop */}
            {productReel && productReel.video && (
              <div className="hidden md:block md:col-span-3">
                <div className="h-[500px] border border-gray-100 rounded-lg overflow-hidden">
                  <ProductVideo
                    videoUrl={productReel.video.url}
                    className="h-full w-full object-cover"
                    productSlug={productSlug}
                    fullHeight={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Video - Mobile */}
          {productReel && productReel.video && (
            <div className="md:hidden">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                <div className="aspect-video w-full">
                  <ProductVideo
                    videoUrl={productReel.video.url}
                    className="w-full h-full object-cover"
                    productSlug={productSlug}
                    fullHeight={false}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="text-center text-white">
                    <Video size={32} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">Watch Product Video</p>
                    <p className="text-xs opacity-80">See it in action</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Info - Left Column */}
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-3">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <h1 className="text-xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    <FavoriteButton showProduct={true} product={product} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          size={14}
                          className="text-shop_light_green"
                          fill={"#3b9c3c"}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">{`(120)`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ShareButton
                        title={product.name}
                        description={product.description || ""}
                        url={`/product/${productSlug}`}
                        iconSize={16}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600">{product?.description}</p>

                {/* Cart Section */}
                <div className="w-full space-y-4">
                  {/* Add to Cart Button */}
                  <AddToCartButton product={product} className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetails;
