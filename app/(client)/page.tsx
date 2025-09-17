import Container from "@/components/Container";

import MultiBanner from "@/components/MultiBanner";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
import HomeSection from "@/components/HomeSection";
import MovingPromoBanner from "@/components/MovingPromoBanner";
import { getCategories, getProducts, getHomeSections } from "@/sanity/queries";
import { activeBanner } from "@/constants/bannerConfig";

import React from "react";

const Home = async () => {
  const categories = await getCategories(6);
  const products = await getProducts();
  const homeSections = await getHomeSections();

  return (
    <div className="bg-shop-light-pink">
      <Container>
        <MovingPromoBanner {...activeBanner} />
        {/* Multi Banner Section */}
        <div className="bg-white">
          <MultiBanner />
        </div>
        <ProductGrid products={products} />

        {/* Dynamic Home Sections */}
        {homeSections.map((section: any) => (
          <HomeSection
            key={section._id}
            title={section.title}
            subtitle={section.subtitle}
            products={section.products}
            maxProducts={section.maxProducts}
          />
        ))}
      </Container>

      {/* Moving Promotional Banner */}
    </div>
  );
};

export default Home;
