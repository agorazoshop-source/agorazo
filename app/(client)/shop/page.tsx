import Shop from "@/components/Shop";
import { getCategories } from "@/sanity/queries";
import React from "react";

const ShopPage = async () => {
  const categories = await getCategories();
  return (
    <div className="bg-white">
      <Shop categories={categories} />
    </div>
  );
};

export default ShopPage;
