import { getProductBySlug, getReelByProductSlug } from "@/sanity/queries";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import ProductVideo from "@/components/ProductVideo";
import { Video } from "lucide-react";
import DeliveryInfo from "@/components/product/DeliveryInfo";
import ProductInteractiveSection from "@/components/product/ProductInteractiveSection";
import HomeSection from "@/components/HomeSection";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

// Server Component
export default async function SingleProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const productReel = await getReelByProductSlug(slug);

  if (!product) {
    return notFound();
  }

  const productSlug = product.slug?.current;
  if (!productSlug || !product.name) {
    return notFound();
  }

  return (
    <>
      {/* Schema.org structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images?.[0]?.url,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "INR",
            },
          }),
        }}
      />

      <div className="bg-white pb-12 py-2">
        <Container>
          <div className="flex flex-col gap-8 mt-2">
            {/* Media Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Main Product Image */}
              <div className="md:col-span-9">
                {product.images && <ImageView images={product.images} />}
              </div>

              {/* Product Video - Desktop */}
              {productReel && productReel.video && productReel.video.url && (
                <div className="hidden md:block md:col-span-3">
                  <div className="h-[500px] border border-gray-100 rounded-lg overflow-hidden">
                    <ProductVideo
                      videoUrl={productReel.video.url}
                      className="h-full w-full object-cover"
                      productSlug={productSlug}
                      fullHeight={true}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Product Video - Mobile */}
            {productReel && productReel.video && productReel.video.url && (
              <div className="md:hidden">
                <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                  <div className="aspect-video w-full">
                    <ProductVideo
                      videoUrl={productReel.video.url}
                      className="w-full h-full object-cover"
                      productSlug={productSlug}
                      fullHeight={false}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="text-center text-white">
                      <Video size={32} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">Watch Product Video</p>
                      <p className="text-xs opacity-80">See it in action</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Info Section - Redesigned Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Product Details - Takes up 2/3 of the space */}
              <div className="lg:col-span-2">
                <ProductInteractiveSection product={product as any} />
              </div>

              {/* Sidebar - Takes up 1/3 of the space */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-6">
                  {/* Digital Product Benefits */}
                  <div className="bg-gradient-to-br from-green-50 to-green-50 rounded-lg p-4 border border-green-100">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-green-600">⚡</span>
                      Instant Digital Delivery
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Get immediate access to your files after purchase.
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Lifetime access to your files
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        No waiting, no shipping fees!
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Get Email with the files link instantly
                      </li>
                    </ul>
                  </div>

                  {/* Purchase Protection */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-green-600">🛡️</span>
                      Secure Purchase
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-xs">
                            ✓
                          </span>
                        </div>
                        <span className="text-gray-600">
                          SSL Encrypted Payment
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs">
                            📧
                          </span>
                        </div>
                        <span className="text-gray-600">
                          Email Delivery Confirmation
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Recommended Products Section */}
      {product.recommendedProducts &&
        product.recommendedProducts.length > 0 && (
          <HomeSection
            title="Recommended for You"
            subtitle="Discover products that complement your selection"
            products={product.recommendedProducts}
            maxProducts={50}
            sectionIndex={0}
          />
        )}
    </>
  );
}
