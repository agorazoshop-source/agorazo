"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2 } from "lucide-react";
import Container from "./Container";
import HomeTabbar from "./HomeTabbar";
import { Product } from "@/sanity.types";
import Link from "next/link";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products: initialProducts }: ProductGridProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [products, setProducts] = useState(initialProducts);

  // Updated query to match products by category reference title
  const query = `*[_type == "product" && references(*[_type == "category" && title == $category]._id)] | order(name asc){
    ...,"categories": categories[]->title
  }`;

  useEffect(() => {
    // Only fetch products if a tab is selected
    if (!selectedTab) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, { category: selectedTab });
        setProducts(response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab, query]);

  return (
    <Container className="flex flex-col px-0 my-10">
      {/* Header with title and view all button */}
      <div className="flex items-center justify-between mb-8">
        <div className="md:flex-1"></div>
        <h2 className="md:text-3xl text-2xl font-bold text-black">
          Popular Categories
        </h2>
        <div className="flex-1 flex justify-end">
          <Link
            href="/products"
            className="text-shop_light_green hover:text-shop_dark_green font-medium text-sm transition-colors duration-200 border border-shop_light_green hover:border-shop_dark_green rounded-full px-4 py-2"
          >
            View All
          </Link>
        </div>
      </div>

      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      {loading ? (
        <NoProductAvailable selectedTab={selectedTab} />
      ) : products?.length ? (
        <div className="w-full overflow-x-auto scrollbar-hide mt-4 sm:mt-8">
          <div className="flex gap-2.5 pb-2 min-w-max">
            {products?.map((product) => (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-shrink-0 w-48 sm:w-52"
                >
                  <ProductCard key={product?._id} product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;
