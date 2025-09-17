import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { createCorsResponse, createOptionsResponse } from '@/lib/cors';

export async function GET() {
  try {
    const query = `*[_type == "productVariant"] | order(order asc) {
      _id,
      title,
      value,
      description,
      order,
      "icon": icon.asset->url
    }`;
    
    const variants = await client.fetch(query);
    
    return createCorsResponse(variants);
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return createCorsResponse(
      { error: 'Failed to fetch product variants' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return createOptionsResponse();
}