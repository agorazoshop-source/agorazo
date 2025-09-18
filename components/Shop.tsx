"use client";
import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Title from "./Title";
import ProductGrid from "./ProductGrid";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import HomeTabbar from "./HomeTabbar";

interface Props {
  categories: Category[];
}
const Shop = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const categoryParams = searchParams?.get("category");
  const searchQuery = searchParams?.get("search");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // If no category is selected, show all products
      if (!selectedCategory) {
        const allProductsQuery = `*[_type == 'product'] | order(name asc) {
          ...,"categories": categories[]->title
        }`;
        const data = await client.fetch(
          allProductsQuery,
          {},
          { next: { revalidate: 0 } }
        );
        setProducts(data);
        return;
      }

      // Only filter by category when a category is selected
      const query = `*[_type == 'product' && references(*[_type == "category" && slug.current == $selectedCategory]._id)] | order(name asc) {
        ...,"categories": categories[]->title
      }`;

      const data = await client.fetch(
        query,
        {
          selectedCategory,
        },
        { next: { revalidate: 0 } }
      );

      setProducts(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);
  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5">
          <div className="flex items-center justify-between">
            <Title className="text-lg uppercase tracking-wide">
              Get products
            </Title>
            {selectedCategory !== null && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                }}
                className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-darkRed hoverEffect"
              >
                Show All Products
              </button>
            )}
          </div>
        </div>
        {/* HomeTabbar for category filtering */}
        <div className="mb-6">
          <HomeTabbar
            selectedTab={
              selectedCategory
                ? categories.find(
                    (cat) => cat.slug?.current === selectedCategory
                  )?.title || ""
                : ""
            }
            onTabSelect={(categoryTitle) => {
              const category = categories.find(
                (cat) => cat.title === categoryTitle
              );
              if (category?.slug?.current === selectedCategory) {
                setSelectedCategory(null);
              } else {
                setSelectedCategory(category?.slug?.current || null);
              }
            }}
          />
        </div>

        {/* Products Grid */}
        <div className="w-full mb-6">
          {loading ? (
            <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
              <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
              <p className="font-semibold tracking-wide text-base">
                Product is loading . . .
              </p>
            </div>
          ) : products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products?.map((product) => (
                <ProductCard key={product?._id} product={product} />
              ))}
            </div>
          ) : (
            <NoProductAvailable className=" mt-0" />
          )}
        </div>
      </Container>
    </div>
  );
};

export default Shop;
