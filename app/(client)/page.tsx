import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import MultiBanner from "@/components/MultiBanner";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import FeaturedProductsByCategory from "@/components/FeaturedProductsByCategory";
import ShopByBrands from "@/components/ShopByBrands";
import MovingPromoBanner from "@/components/MovingPromoBanner";
import { getCategories } from "@/sanity/queries";
import { activeBanner } from "@/constants/bannerConfig";

import React from "react";

const Home = async () => {
  const categories = await getCategories(6);

  return (
    <div className="bg-shop-light-pink">
      {/* <Container>
        <HomeBanner />
      </Container> */}

      <MovingPromoBanner {...activeBanner} />
      {/* Multi Banner Section */}
      <div className="bg-white py-8">
        <MultiBanner />
      </div>

      <Container>
        <FeaturedProductsByCategory />
        <HomeCategories categories={categories} />
        {/* <ShopByBrands /> */}
        <LatestBlog />
      </Container>

      {/* Moving Promotional Banner */}
    </div>
  );
};

export default Home;
