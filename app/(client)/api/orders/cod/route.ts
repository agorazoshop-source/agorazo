import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderData = await req.json();

    // Create order in Sanity with the updated schema
    const order = await backendClient.create({
      _type: "order",
      orderNumber: orderData.orderNumber,
      customer: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        clerkUserId: orderData.clerkUserId,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: orderData.items.map((item: any) => ({
        _type: "orderItem",
        _key: nanoid(),
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
      totalAmount: orderData.totalAmount,
      discountAmount: orderData.discountAmount || 0,
      couponCode: orderData.couponCode || null,
      paymentStatus: "cod",
      orderStatus: "confirmed",
      paymentMethod: "cod",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderId: order._id,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
