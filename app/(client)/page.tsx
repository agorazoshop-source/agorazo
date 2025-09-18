import Container from "@/components/Container";

import MultiBanner from "@/components/MultiBanner";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
import HomeSection from "@/components/HomeSection";
import MovingPromoBanner from "@/components/MovingPromoBanner";
import { getCategories, getProducts, getHomeSections } from "@/sanity/queries";
import { activeBanner } from "@/constants/bannerConfig";

import React from "react";

// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        <ProductGrid products={products} autoSelectFirstCategory={true} />

        {/* Dynamic Home Sections */}
        {homeSections.map((section: any, index: number) => (
          <HomeSection
            key={section._id}
            title={section.title}
            subtitle={section.subtitle}
            products={section.products}
            maxProducts={section.maxProducts}
            sectionIndex={index}
          />
        ))}
      </Container>

      {/* Moving Promotional Banner */}
    </div>
  );
};

export default Home;
