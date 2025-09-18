import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { createCorsResponse, createOptionsResponse } from "@/lib/cors";

export async function GET() {
  try {
    const query = `*[_type == "category"] | order(_createdAt asc) {
      _id,
      title,
      slug,
      description,
      image,
      "productCount": count(*[_type == "product" && references(^._id)])
    }`;

    const categories = await client.fetch(query);

    return createCorsResponse(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return createCorsResponse(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
// Handle preflight requests
export async function OPTIONS() {
  return createOptionsResponse();
}
