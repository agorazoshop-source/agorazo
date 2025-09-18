"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { motion } from "motion/react";
import { Product } from "@/sanity.types";
import Container from "./Container";

interface HomeSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  maxProducts?: number;
  sectionIndex?: number;
}

const HomeSection = ({
  title,
  subtitle,
  products,
  maxProducts = 8,
  sectionIndex = 0,
}: HomeSectionProps) => {
  // Limit products based on maxProducts
  const displayProducts = products?.slice(0, maxProducts) || [];

  if (!displayProducts.length) {
    return null;
  }

  // Alternating styles for even/odd sections
  const isEven = sectionIndex % 2 === 0;

  const evenStyle = {
    containerBg: "bg-gray-50",
    cardBg: "bg-white shadow-sm",
  };

  const oddStyle = {
    containerBg:
      "bg-gradient-to-r from-shop_light_green/5 to-shop_dark_green/5",
    cardBg: "bg-white shadow-md",
  };

  const style = isEven ? evenStyle : oddStyle;

  return (
    <Container className="px-0 mb-4">
      <div className={`w-full ${style.containerBg} rounded-lg p-4 md:p-6`}>
        {/* Centered title */}
        <div className="flex items-center justify-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center">
            {title}
          </h2>
        </div>

        {/* Horizontal scrollable container */}
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2 min-w-max">
            {displayProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 w-48 sm:w-52"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomeSection;
