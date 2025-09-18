"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface CategoryItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  productCount?: number;
  image?: any;
}

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const query = `*[_type == "category"] | order(title asc) {
          _id,
          title,
          slug,
          description,
          image,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`;

        const data = await client.fetch(query);

        // Categories are already ordered by creation date from the query
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, [selectedTab, onTabSelect]);

  // Fixed widths for loading placeholders to prevent hydration errors
  const placeholderWidths = [100, 120, 90, 110, 95];

  return (
    <div className="w-full">
      {/* Categories */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 md:gap-3 pb-1 min-w-max">
          {isLoading
            ? // Loading placeholders with fixed widths
              placeholderWidths.map((width, index) => (
                <div
                  key={index}
                  className="border border-shop_light_green/30 px-8 py-1.5 md:px-12 md:py-16 rounded-lg bg-gray-100 animate-pulse"
                  style={{ width: `${width}px` }}
                />
              ))
            : categories?.length > 0
              ? categories.map((item) => {
                  const isSelected = selectedTab === item.title;
                  return (
                    <button
                      onClick={() => onTabSelect(item.title)}
                      key={item._id}
                      className={`rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 p-4 min-w-[140px]  ${
                        isSelected
                          ? "border-2 border-shop_light_green"
                          : "border-2 border-transparent hover:border-gray-200 bg-gray-100"
                      }`}
                    >
                      <div className="relative w-20 h-20">
                        {item.image &&
                        item.image.asset &&
                        !item.image._upload ? (
                          <Image
                            src={urlFor(item.image).url()}
                            alt={item.title}
                            fill
                            className="object-cover rounded-xl"
                            onError={(e) => {
                              e.currentTarget.src = "/digital.png";
                            }}
                          />
                        ) : (
                          <Image
                            src="/digital.png"
                            alt={item.title}
                            fill
                            className="object-cover rounded-xl"
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-800 mb-1">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.productCount || 0} products
                        </div>
                      </div>
                    </button>
                  );
                })
              : null}
        </div>
      </div>
    </div>
  );
};

export default HomeTabbar;
