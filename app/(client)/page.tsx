import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import MultiBanner from "@/components/MultiBanner";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import MovingPromoBanner from "@/components/MovingPromoBanner";
import { getCategories, getProducts } from "@/sanity/queries";
import { activeBanner } from "@/constants/bannerConfig";

import React from "react";

const Home = async () => {
  const categories = await getCategories(6);
  const products = await getProducts();
  return (
    <div className="bg-shop-light-pink">
      {/* <Container>
        <HomeBanner />
      </Container> */}

      <Container>
        <MovingPromoBanner {...activeBanner} />
        {/* Multi Banner Section */}
        <div className="bg-white">
          <MultiBanner />
        </div>

        <ProductGrid products={products} />
        <HomeCategories categories={categories} />
      </Container>

      {/* Moving Promotional Banner */}
    </div>
  );
};

export default Home;
