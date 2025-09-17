import { client } from "@/sanity/lib/client";


export async function getCategories(): Promise<any[]> {
  try {
    // Use server-side API route to avoid CORS issues
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getLatestBlogs(quantity: number): Promise<any[]> {
  const query = `*[_type == "blog"] | order(publishedAt desc)[0...${quantity}]{
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    blogcategories[]->{
      _id,
      title 
    }
  }`;

  return client.fetch(query);
}