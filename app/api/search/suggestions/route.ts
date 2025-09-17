import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Search for products, brands, and categories that match the query
    const searchQuery = `{
      "products": *[_type == "product" && (
        name match $searchTerm ||
        description match $searchTerm ||
        brand->title match $searchTerm ||
        categories[]->title match $searchTerm
      )][0...5] {
        _id,
        name,
        slug,
        price,
        images,
        brand->{title},
        categories[]->{title}
      },
      "brands": *[_type == "brand" && title match $searchTerm][0...3] {
        _id,
        title,
        slug
      },
      "categories": *[_type == "category" && title match $searchTerm][0...3] {
        _id,
        title,
        slug
      }
    }`;

    const searchTerm = `${query}*`; // Wildcard search
    const results = await client.fetch(searchQuery, { searchTerm });

    // Format the results for the frontend
    const suggestions = [
      // Add product suggestions
      ...results.products.map((product: any) => ({
        id: product._id,
        type: "product",
        title: product.name,
        subtitle: product.brand?.title || "Product",
        url: `/product/${product.slug?.current}`,
        image: product.images?.[0],
        price: product.price,
      })),
      // Add brand suggestions
      ...results.brands.map((brand: any) => ({
        id: brand._id,
        type: "brand",
        title: brand.title,
        subtitle: "Brand",
        url: `/products?brand=${brand.slug?.current}`,
        image: null,
        price: null,
      })),
      // Add category suggestions
      ...results.categories.map((category: any) => ({
        id: category._id,
        type: "category",
        title: category.title,
        subtitle: "Category",
        url: `/category/${category.slug?.current}`,
        image: null,
        price: null,
      })),
    ];

    return NextResponse.json(suggestions.slice(0, 8)); // Limit to 8 suggestions
  } catch (error) {
    console.error("Search suggestions error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
