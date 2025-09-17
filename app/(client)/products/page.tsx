import Shop from "@/components/Shop";
import { getCategories } from "@/sanity/queries";
import React, { Suspense } from "react";

const ProductsPage = async () => {
  const categories = await getCategories();
  return (
    <div className="bg-white">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-shop_light_green"></div>
          </div>
        }
      >
        <Shop categories={categories} />
      </Suspense>
    </div>
  );
};

export default ProductsPage;
