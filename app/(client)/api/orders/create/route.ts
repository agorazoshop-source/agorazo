import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient, checkToken } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth();
    // const user = await currentUser(); // Not used in this route

    if (!session?.userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Check if Sanity token is available
    try {
      checkToken();
    } catch {
      return new NextResponse(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500 }
      );
    }

    // Validate request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400 }
      );
    }

    const {
      items,
      customer,
      totalAmount,
      discountAmount,
      couponCode,
      paymentMethod,
      paymentStatus,
      orderStatus,
    } = body;

    // Validate required fields
    if (
      !items?.length ||
      !customer /* || !shippingAddress */ ||
      totalAmount === undefined ||
      totalAmount === null
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Create order document with product snapshots
    const order = {
      _type: "order",
      orderNumber: `ORD-${Date.now()}-${uuidv4().substring(0, 6)}`,
      customer,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: items.map((item: any) => ({
        _type: "orderItem",
        _key: `item_${item.product._id}_${Date.now()}`,
        // Keep weak reference to original product
        product: {
          _type: "reference",
          _ref: item.product._id,
          _weak: true, // Make it weak so product can be deleted
        },
        // Create complete product snapshot
        productSnapshot: {
          name: item.product.name,
          slug: item.product.slug,
          description: item.product.description,
          images: item.product.images || [],
          price: item.product.price,
          discount: item.product.discount || 0,
          productLink: item.product.productLink,
          status: item.product.status,
        },
        price: item.product.price, // Price at time of order
      })),
      totalAmount,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || null,
      paymentStatus: paymentStatus || "pending",
      orderStatus: orderStatus || "pending",
      paymentMethod:
        paymentMethod === "cod"
          ? "cod"
          : paymentMethod === "razorpay"
            ? "razorpay"
            : "phonepe",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const result = await backendClient.create(order);
      return NextResponse.json({
        success: true,
        orderId: result._id,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return new NextResponse(
        JSON.stringify({
          error: "Database error: " + (e.message || "Failed to create order"),
        }),
        { status: 500 }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: error.message || "Failed to create order",
      }),
      { status: 500 }
    );
  }
}
