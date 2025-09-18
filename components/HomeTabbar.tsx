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

        // Sort categories by title
        const sortedCategories = data.sort(
          (a: CategoryItem, b: CategoryItem) => {
            return a.title.localeCompare(b.title);
          }
        );

        setCategories(sortedCategories);

        // If there are categories and no tab is selected, select the first one
        if (sortedCategories.length > 0 && !selectedTab) {
          console.log("Setting initial tab to:", sortedCategories[0].title);
          onTabSelect(sortedCategories[0].title);
        }
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
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 md:gap-3 pb-1 justify-between min-w-max">
        <div className="flex items-center gap-2 md:gap-3">
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
                      className={`border-2 p-2 rounded-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2 min-w-[100px] shadow-md hover:shadow-lg ${
                        isSelected
                          ? "border-shop_dark_green bg-shop_light_green/10"
                          : "border-gray-200 bg-white hover:border-shop_light_green"
                      }`}
                    >
                      <div className="relative w-28 h-28">
                        {item.image ? (
                          <Image
                            src={urlFor(item.image).url()}
                            alt={item.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-shop_light_green rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {item.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-center text-gray-700">
                        {item.title}
                      </span>
                    </button>
                  );
                })
              : null}
        </div>
        <Link
          href={"/products"}
          className="border-2 p-2 rounded-xl flex flex-col items-center gap-2 min-w-[100px] border-green-200 bg-white hover:border-shop_light_green mr-1"
        >
          <span className="text-xs font-medium text-center text-gray-700">
            View All
          </span>
        </Link>
      </div>
    </div>
  );
};

export default HomeTabbar;
