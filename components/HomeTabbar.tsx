"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/sanity/queries";
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Palette, 
  Dumbbell,
  ShoppingBag
} from "lucide-react";

interface CategoryItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  productCount?: number;
}

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get icon and colors based on category title
  const getCategoryStyle = (title: string, isSelected: boolean) => {
    const titleLower = title?.toLowerCase() || '';
    
    if (titleLower.includes('fashion') || titleLower.includes('clothing')) {
      return {
        icon: <Shirt className="w-6 h-6" />,
        bgColor: isSelected ? 'bg-pink-500' : 'bg-pink-100 hover:bg-pink-200',
        textColor: isSelected ? 'text-white' : 'text-pink-700',
        borderColor: isSelected ? 'border-pink-500' : 'border-pink-200'
      };
    } else if (titleLower.includes('electronics') || titleLower.includes('phone')) {
      return {
        icon: <Smartphone className="w-6 h-6" />,
        bgColor: isSelected ? 'bg-blue-500' : 'bg-blue-100 hover:bg-blue-200',
        textColor: isSelected ? 'text-white' : 'text-blue-700',
        borderColor: isSelected ? 'border-blue-500' : 'border-blue-200'
      };
    } else if (titleLower.includes('home') || titleLower.includes('kitchen')) {
      return {
        icon: <Home className="w-6 h-6" />,
        bgColor: isSelected ? 'bg-green-500' : 'bg-green-100 hover:bg-green-200',
        textColor: isSelected ? 'text-white' : 'text-green-700',
        borderColor: isSelected ? 'border-green-500' : 'border-green-200'
      };
    } else if (titleLower.includes('beauty') || titleLower.includes('personal')) {
      return {
        icon: <Palette className="w-6 h-6" />,
        bgColor: isSelected ? 'bg-purple-500' : 'bg-purple-100 hover:bg-purple-200',
        textColor: isSelected ? 'text-white' : 'text-purple-700',
        borderColor: isSelected ? 'border-purple-500' : 'border-purple-200'
      };
    } else if (titleLower.includes('sports') || titleLower.includes('outdoors')) {
      return {
        icon: <Dumbbell className="w-6 h-6" />,
        bgColor: isSelected ? 'bg-emerald-500' : 'bg-emerald-100 hover:bg-emerald-200',
        textColor: isSelected ? 'text-white' : 'text-emerald-700',
        borderColor: isSelected ? 'border-emerald-500' : 'border-emerald-200'
      };
    } else {
      return {
        icon: <ShoppingBag className="w-6 h-6" />,
        bgColor: isSelected ? 'bg-gray-500' : 'bg-gray-100 hover:bg-gray-200',
        textColor: isSelected ? 'text-white' : 'text-gray-700',
        borderColor: isSelected ? 'border-gray-500' : 'border-gray-200'
      };
    }
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        
        // Sort categories by title
        const sortedCategories = data.sort((a: CategoryItem, b: CategoryItem) => {
          return a.title.localeCompare(b.title);
        });
        
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center flex-wrap gap-3 sm:gap-5 justify-between">
      <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5 text-sm font-semibold min-w-max">
          <div className="flex items-center gap-2 md:gap-3 pb-1">
            {isLoading ? (
              // Loading placeholders with fixed widths
              placeholderWidths.map((width, index) => (
                <div 
                  key={index}
                  className="border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-gray-100 animate-pulse"
                  style={{ width: `${width}px` }}
                />
              ))
            ) : categories.length > 0 ? (
              categories.map((item) => {
                const style = getCategoryStyle(item.title, selectedTab === item.title);
                return (
                  <button
                    onClick={() => onTabSelect(item.title)}
                    key={item._id}
                    className={`border ${style.borderColor} ${style.bgColor} ${style.textColor} px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2 min-w-[120px] shadow-md hover:shadow-lg`}
                  >
                    {style.icon}
                    <span className="text-sm font-semibold">{item.title}</span>
                  </button>
                );
              })
            ) : (
              // Fallback to hardcoded values if no variants found
              [
                { title: "Fashion", value: "fashion" },
                { title: "Electronics", value: "electronics" },
                { title: "Home & Kitchen", value: "home-kitchen" },
                { title: "Beauty & Personal Care", value: "beauty-personal-care" },
                { title: "Sports & Outdoors", value: "sports-outdoors" },
              ].map((item) => {
                const style = getCategoryStyle(item.title, selectedTab === item.title);
                return (
                  <button
                    onClick={() => onTabSelect(item.title)}
                    key={item.title}
                    className={`border ${style.borderColor} ${style.bgColor} ${style.textColor} px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2 min-w-[120px] shadow-md hover:shadow-lg`}
                  >
                    {style.icon}
                    <span className="text-sm font-semibold">{item.title}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-darkColor px-4 py-1 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect self-end sm:self-auto"
      >
        All Products
      </Link>
    </div>
  );
};

export default HomeTabbar;
