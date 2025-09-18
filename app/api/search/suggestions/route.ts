import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Search for products, categories, and blogs that match the query
    const searchQuery = `{
      "products": *[_type == "product" && (
        name match $searchTerm ||
        description match $searchTerm ||
        categories[]->title match $searchTerm
      )][0...4] {
        _id,
        name,
        slug,
        price,
        images,
        categories[]->{title}
      },
      "categories": *[_type == "category" && title match $searchTerm][0...2] {
        _id,
        title,
        slug
      },
      "blogs": *[_type == "blog" && (
        title match $searchTerm ||
        body[].children[].text match $searchTerm
      )][0...2] {
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        blogcategories[]->{title}
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
        subtitle: "Product",
        url: `/product/${product.slug?.current}`,
        image: product.images?.[0],
        price: product.price,
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
      // Add blog suggestions
      ...results.blogs.map((blog: any) => ({
        id: blog._id,
        type: "blog",
        title: blog.title,
        subtitle: blog.blogcategories?.[0]?.title || "Blog",
        url: `/blog/${blog.slug?.current}`,
        image: blog.mainImage,
        price: null,
      })),
    ];

    return NextResponse.json(suggestions.slice(0, 8)); // Limit to 8 suggestions
  } catch (error) {
    console.error("Search suggestions error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
