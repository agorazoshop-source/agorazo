"use client";
import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import { useSearchParams } from "next/navigation";
import PriceList from "./shop/PriceList";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

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
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  // Debug URL parameters
  console.log("Shop component URL params:", {
    categoryParams,
    searchQuery,
    selectedCategory,
  });
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let minPrice = 0;
      let maxPrice = 100000;
      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }

      // If no filters are selected, show all products
      if (!selectedCategory && !searchQuery && !selectedPrice) {
        const allProductsQuery = `*[_type == 'product'] | order(name asc) {
          ...,"categories": categories[]->title
        }`;
        const data = await client.fetch(
          allProductsQuery,
          {},
          { next: { revalidate: 0 } }
        );
        console.log("All products fetched:", data);
        setProducts(data);
        return;
      }

      console.log("Applying filters:", {
        selectedCategory,
        searchQuery,
        selectedPrice,
        minPrice,
        maxPrice,
      });

      // Build query dynamically based on available filters
      let query = `*[_type == 'product'`;

      // Add category filter if selected
      if (selectedCategory) {
        query += ` && references(*[_type == "category" && slug.current == $selectedCategory]._id)`;
      }

      // Add search filter if search query exists
      if (searchQuery) {
        query += ` && (
          name match $searchTerm ||
          description match $searchTerm ||
          brand->title match $searchTerm ||
          categories[]->title match $searchTerm
        )`;
      }

      // Always add price filter
      query += ` && defined(price) && price >= $minPrice && price <= $maxPrice`;

      // Add ordering and projection
      query += `] | order(name asc) {
        ...,"categories": categories[]->title
      }`;

      console.log("Generated GROQ query:", query);

      const searchTerm = searchQuery ? `${searchQuery}*` : undefined;
      const data = await client.fetch(
        query,
        {
          selectedCategory,
          searchQuery,
          searchTerm,
          minPrice,
          maxPrice,
        },
        { next: { revalidate: 0 } }
      );

      console.log("Filtered products:", data);
      console.log(
        "Products with prices:",
        data.map((p: Product) => ({ name: p.name, price: p.price }))
      );
      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPrice, searchQuery]);
  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5">
          <div className="flex items-center justify-between">
            <Title className="text-lg uppercase tracking-wide">
              Get the products as your needs
            </Title>
            {(selectedCategory !== null || selectedPrice !== null) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedPrice(null);
                }}
                className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-darkRed hoverEffect"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <PriceList
              setSelectedPrice={setSelectedPrice}
              selectedPrice={selectedPrice}
            />
          </div>
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Product is loading . . .
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
