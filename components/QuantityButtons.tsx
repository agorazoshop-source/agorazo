"use client";

import { Product } from "@/sanity.types";
import useStore from "@/store";
import React from "react";
import { Button } from "./ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  className?: string;
}

const QuantityButtons = ({ product, className }: Props) => {
  const { addItem, removeItem, items } = useStore();
  const isInCart = items.some(item => item.product._id === product._id);

  const handleToggleCart = () => {
    if (isInCart) {
      removeItem(product?._id);
    } else {
      addItem(product);
    }
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={handleToggleCart}
        variant={isInCart ? "destructive" : "default"}
        size="sm"
        className={cn(
          "flex items-center gap-1",
          isInCart 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-shop_dark_green hover:bg-shop_light_green text-white"
        )}
      >
        {isInCart ? (
          <>
            <Trash2 className="w-4 h-4" />
            Remove
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            Add
          </>
        )}
      </Button>
    </div>
  );
};

export default QuantityButtons;
