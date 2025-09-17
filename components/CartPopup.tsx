"use client";

import React, { useState, useEffect } from "react";
import useStore from "@/store";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShoppingBag, X, Trash } from "lucide-react";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import SanityImage from "./SanityImage";
import { Button } from "./ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CartPopup = () => {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showingAddedItem, setShowingAddedItem] = useState<string | null>(null);

  const {
    items,
    getTotalPrice,
    getSubTotalPrice,
    deleteCartProduct,
    resetCart,
    isCartPopupVisible,
    setCartPopupVisible,
  } = useStore();

  const groupedItems = useStore((state) => state.getGroupedItems());
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Pages where the popup should not appear
  const hiddenOnPages = ["/cart", "/checkout"];
  const shouldHideOnCurrentPage = hiddenOnPages.includes(pathname);

  // Show popup when items are in cart and user is signed in
  useEffect(() => {
    if (totalItems > 0 && isSignedIn) {
      setCartPopupVisible(true);
    } else {
      setCartPopupVisible(false);
    }
  }, [totalItems, isSignedIn, setCartPopupVisible]);

  // Show popup briefly when new item is added
  useEffect(() => {
    if (totalItems > 0) {
      const latestItem = items[items.length - 1];
      if (latestItem) {
        setShowingAddedItem(latestItem.product?.name || "");
        setCartPopupVisible(true);

        const timer = setTimeout(() => {
          setShowingAddedItem(null);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [items.length, setCartPopupVisible]);

  const getDisplayText = () => {
    if (showingAddedItem) {
      return `${showingAddedItem.substring(0, 20)}${showingAddedItem.length > 20 ? "..." : ""} added`;
    }

    if (totalItems === 0) return "Cart is empty";

    const uniqueProducts = [
      ...new Set(items.map((item) => item.product?.name).filter(Boolean)),
    ];

    if (uniqueProducts.length <= 2) {
      return uniqueProducts
        .map(
          (name) => name!.substring(0, 15) + (name!.length > 15 ? "..." : "")
        )
        .join(", ");
    } else {
      const firstTwo = uniqueProducts
        .slice(0, 2)
        .map(
          (name) => name!.substring(0, 12) + (name!.length > 12 ? "..." : "")
        );
      return `${firstTwo.join(", ")} +${uniqueProducts.length - 2} more`;
    }
  };

  if (
    !isSignedIn ||
    totalItems === 0 ||
    !isCartPopupVisible ||
    shouldHideOnCurrentPage
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      {isCartPopupVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 pointer-events-none"
        >
          <div className="max-w-md mx-auto pointer-events-auto">
            <motion.div
              className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl p-4 cursor-pointer hover:shadow-3xl hover:bg-white/90 transition-all duration-300 ring-1 ring-white/30"
              style={{
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
                textRendering: "optimizeLegibility",
              }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
            >
              {!isExpanded ? (
                /* Small Bottom Popup */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="p-2 bg-gradient-to-br from-emerald-50/60 to-green-100/60 rounded-xl border border-emerald-200/30">
                        <ShoppingBag className="w-6 h-6 text-emerald-600" />
                      </div>
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg ring-2 ring-white">
                          {totalItems > 99 ? "99+" : totalItems}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {getDisplayText()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {totalItems} item{totalItems !== 1 ? "s" : ""} •{" "}
                        <PriceFormatter amount={getTotalPrice()} />
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCartPopupVisible(false);
                    }}
                    className="p-2 hover:bg-gray-100/80 rounded-xl"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              ) : (
                /* Expanded Detailed View */
                <div className="max-h-96 overflow-hidden">
                  {/* Header */}
                  <div className="pb-4 border-b border-gray-200/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-50/60 to-green-100/60 rounded-xl border border-emerald-200/30">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Shopping Cart
                        </h3>
                        <span className="text-xs text-gray-500">
                          {totalItems} item{totalItems !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCartPopupVisible(false)}
                      className="p-2 hover:bg-gray-100/80 rounded-xl"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>

                  {/* Cart Items */}
                  <div className="max-h-64 overflow-y-auto py-3">
                    {groupedItems.map(({ product, size, quantity }) => (
                      <div
                        key={product && product._id + "-" + (size || "default")}
                        className="py-3 border-b border-gray-100/40 last:border-b-0 flex items-center gap-3"
                      >
                        {/* Product Image */}
                        {product && product.images && (
                          <Link
                            href={
                              "/product/" +
                              (product.slug && product.slug.current
                                ? product.slug.current
                                : "")
                            }
                            className="flex-shrink-0 border border-gray-200/30 rounded-xl overflow-hidden group shadow-sm"
                            onClick={() => setIsExpanded(false)}
                          >
                            <SanityImage
                              image={product.images[0]}
                              alt="Product image"
                              width={60}
                              height={60}
                              className="w-12 h-12 object-cover group-hover:scale-110 transition-all duration-300"
                            />
                          </Link>
                        )}

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {product && product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{product?.categories?.[0]?.title || "Standard"}</span>
                            {size && <span>• Size: {size}</span>}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <PriceFormatter
                              amount={
                                product && product.price
                                  ? product.price * quantity
                                  : 0
                              }
                              className="text-sm font-semibold"
                            />
                            <QuantityButtons
                              product={product}
                              selectedSize={size}
                              className="scale-75"
                            />
                          </div>
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            deleteCartProduct(product && product._id, size)
                          }
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-200/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-gray-700">
                        Total:
                      </span>
                      <PriceFormatter
                        amount={getTotalPrice()}
                        className="text-lg font-bold text-emerald-600"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href="/cart"
                        className="flex-1"
                        onClick={() => setIsExpanded(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full text-sm border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200"
                        >
                          View Cart
                        </Button>
                      </Link>
                      <Link
                        href="/checkout"
                        className="flex-1"
                        onClick={() => setIsExpanded(false)}
                      >
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                          Checkout
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartPopup;
