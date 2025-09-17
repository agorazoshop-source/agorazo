"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import { Loader2, ArrowRight } from "lucide-react";
import Container from "./Container";
import Title from "./Title";
import { Product, Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

interface CategoryWithProducts {
  category: Category;
  products: Product[];
}

const FeaturedProductsByCategory = () => {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesWithProducts = async () => {
      setLoading(true);
      try {
        // First, get all categories
        const categoriesQuery = `*[_type == "category"] | order(title asc) {
          _id,
          title,
          slug,
          description,
          image
        }`;
        
        const categories = await client.fetch(categoriesQuery);
        
        // Then, for each category, get the latest 12 products
        const categoriesWithProductsData = await Promise.all(
          categories.map(async (category: Category) => {
            const productsQuery = `*[_type == "product" && references(*[_type == "category" && _id == $categoryId])] | order(_createdAt desc) [0...12] {
              ...,
              "categories": categories[]->title
            }`;
            
            const products = await client.fetch(productsQuery, { categoryId: category._id });
            
            return {
              category,
              products
            };
          })
        );
        
        // Filter out categories that have no products
        const filteredCategories = categoriesWithProductsData.filter(
          (item) => item.products.length > 0
        );
        
        setCategoriesWithProducts(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories with products:", error);
        setCategoriesWithProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithProducts();
  }, []);

  if (loading) {
    return (
      <Container className="my-10">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-shop_dark_green mb-4" />
          <p className="text-gray-600">Loading featured products...</p>
        </div>
      </Container>
    );
  }

  if (categoriesWithProducts.length === 0) {
    return (
      <Container className="my-10">
        <div className="text-center py-20">
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-10">
      <Title className="text-center mb-12">Featured Products by Category</Title>
      
      <div className="space-y-16">
        {categoriesWithProducts.map(({ category, products }) => (
          <div key={category._id} className="bg-white border border-shop_light_green/20 p-6 lg:p-8 rounded-lg shadow-sm">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-shop_light_bg to-white shadow-md flex items-center justify-center">
                  {category.image ? (
                    <Image
                      src={urlFor(category.image).url()}
                      alt={category.title || "Category"}
                      width={64}
                      height={64}
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-shop_dark_green rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {category.title?.charAt(0) || "C"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 capitalize">
                    {category.title}
                  </h2>
                  {category.description && (
                    <p className="text-gray-600 text-sm mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* View More Button */}
              <Link
                href={`/category/${category.slug?.current}`}
                className="flex items-center gap-2 bg-shop_dark_green hover:bg-shop_light_green text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <span className="font-semibold">View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No products available in this category.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default FeaturedProductsByCategory;
