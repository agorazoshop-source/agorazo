import { NextResponse } from 'next/server';

export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export function createCorsResponse(data?: any, options?: { status?: number }) {
  const response = NextResponse.json(data || {}, { status: options?.status || 200 });
  return addCorsHeaders(response);
}

export function createOptionsResponse() {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}