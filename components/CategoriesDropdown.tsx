"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Grid3X3 } from "lucide-react";
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

const CategoriesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        setCategories(data || []);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        <Grid3X3 className="w-4 h-4 text-shop_light_green" />
        <span className="text-base">All Categories</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                Loading categories...
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug.current}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-shop_light_green transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative w-6 h-6 flex-shrink-0">
                    {category.image &&
                    category.image.asset &&
                    !category.image._upload ? (
                      <Image
                        src={urlFor(category.image).url()}
                        alt={category.title}
                        fill
                        className="object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/digital.png";
                        }}
                      />
                    ) : (
                      <Image
                        src="/digital.png"
                        alt={category.title}
                        fill
                        className="object-cover rounded"
                      />
                    )}
                  </div>
                  <span>{category.title}</span>
                </Link>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No categories found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesDropdown;
