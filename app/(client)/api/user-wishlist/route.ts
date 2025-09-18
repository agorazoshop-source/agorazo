import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { backendClient } from "@/sanity/lib/backendClient";
import { getUserWishlist } from "@/sanity/queries";

// Get user wishlist
export async function GET(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to access your wishlist." },
        { status: 401 }
      );
    }

    // Check if user has a wishlist in Sanity
    const userWishlist = await getUserWishlist(userId);

    if (!userWishlist) {
      return NextResponse.json({ favoriteProduct: [] });
    }

    // Get full product details for each item in the wishlist
    const productsQuery = `*[_type == "product" && _id in $productIds]`;
    const products = await client.fetch(productsQuery, {
      productIds: userWishlist.items?.map((item: any) => item.productId) || [],
    });

    // Map products back to wishlist items
    const wishlistWithProducts = products.map((product: any) => ({
      ...product,
      addedAt: userWishlist.items?.find(
        (item: any) => item.productId === product._id
      )?.addedAt,
    }));

    return NextResponse.json({ favoriteProduct: wishlistWithProducts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// Update wishlist
export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to update your wishlist." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid wishlist data. Items must be an array." },
        { status: 400 }
      );
    }

    // Check if token exists
    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json(
        {
          error: "Server is not configured properly. Please add a write token.",
          details: "Missing SANITY_API_TOKEN environment variable",
        },
        { status: 500 }
      );
    }

    try {
      // Format wishlist items for Sanity with _key property
      const sanityWishlistItems = items.map((product: any, index: number) => {
        if (!product || !product._id) {
          throw new Error("Invalid product data in wishlist items");
        }

        return {
          _key: `${product._id}_${index}`,
          productId: product._id,
          productName: product.name,
          addedAt: new Date().toISOString(),
        };
      });

      // Create a document ID that's deterministic based on the user ID
      const wishlistDocId = `wishlist_${userId}`;

      // Use createOrReplace to ensure we only ever have one wishlist per user
      const result = await backendClient.createOrReplace({
        _type: "userWishlist",
        _id: wishlistDocId,
        userId: userId,
        userEmail: user?.primaryEmailAddress?.emailAddress || "Unknown",
        items: sanityWishlistItems,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        itemCount: sanityWishlistItems.length,
        userId: userId,
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Failed to update wishlist. Your token may be read-only.",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}

// Toggle a product in wishlist
export async function PUT(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to update your wishlist." },
        { status: 401 }
      );
    }

    // Get product from request
    const { product } = await req.json();

    if (!product || !product._id) {
      return NextResponse.json(
        { error: "Invalid product data." },
        { status: 400 }
      );
    }

    // Check if token exists
    if (!process.env.SANITY_API_TOKEN) {
      console.error("Missing SANITY_API_TOKEN environment variable");
      return NextResponse.json(
        {
          error: "Server is not configured properly. Please add a write token.",
          details: "Missing SANITY_API_TOKEN environment variable",
        },
        { status: 500 }
      );
    }

    try {
      // Create a document ID that's deterministic based on the user ID
      const wishlistDocId = `wishlist_${userId}`;

      // Get current wishlist
      const existingWishlist = await client.fetch(
        `*[_type == "userWishlist" && userId == $userId][0]{
          _id,
          items[] {
            _key,
            productId,
            productName
          }
        }`,
        { userId }
      );

      let updatedItems;

      if (existingWishlist) {
        // Check if product is already in wishlist
        const isInWishlist = existingWishlist.items?.some(
          (item: any) => item.productId === product._id
        );

        if (isInWishlist) {
          // Remove product from wishlist
          updatedItems = (existingWishlist.items || []).filter(
            (item: any) => item.productId !== product._id
          );
        } else {
          // Add product to wishlist
          updatedItems = [
            ...(existingWishlist.items || []),
            {
              _key: `${product._id}_${Date.now()}`,
              productId: product._id,
              productName: product.name,
              addedAt: new Date().toISOString(),
            },
          ];
        }
      } else {
        // Create new wishlist with single item
        updatedItems = [
          {
            _key: `${product._id}_${Date.now()}`,
            productId: product._id,
            productName: product.name,
            addedAt: new Date().toISOString(),
          },
        ];
      }

      // Use createOrReplace to update the wishlist
      const result = await backendClient.createOrReplace({
        _type: "userWishlist",
        _id: wishlistDocId,
        userId: userId,
        userEmail: user?.primaryEmailAddress?.emailAddress || "Unknown",
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        itemCount: updatedItems.length,
        userId: userId,
        isInWishlist: !existingWishlist?.items?.some(
          (item: any) => item.productId === product._id
        ),
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Failed to toggle wishlist item. Your token may be read-only.",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to toggle wishlist item" },
      { status: 500 }
    );
  }
}
