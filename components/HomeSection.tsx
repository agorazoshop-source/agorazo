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
}

const HomeSection = ({
  title,
  subtitle,
  products,
  maxProducts = 8,
}: HomeSectionProps) => {
  // Debug logging
  console.log("HomeSection received:", {
    title,
    subtitle,
    products,
    maxProducts,
  });

  // Limit products based on maxProducts
  const displayProducts = products?.slice(0, maxProducts) || [];

  if (!displayProducts.length) {
    console.log("No products to display for section:", title);
    return null;
  }

  return (
    <Container className="px-0 mb-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="mb-6 border-b">
          <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
        </div>

        {/* Horizontal scrollable container */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
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
    </Container>
  );
};

export default HomeSection;
