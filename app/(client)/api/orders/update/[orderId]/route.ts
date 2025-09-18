import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient, checkToken } from "@/sanity/lib/backendClient";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Check if Sanity token is available
    try {
      checkToken();
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500 }
      );
    }

    const { orderId } = params;
    if (!orderId) {
      return new NextResponse(
        JSON.stringify({ error: "Order ID is required" }),
        { status: 400 }
      );
    }

    // Get update data from request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400 }
      );
    }

    const { paymentStatus, orderStatus } = body;

    // Verify order exists and fetch complete details
    const order = await backendClient.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        ...,
        "items": items[]{
          _key,
          quantity,
          size,
          price,
          "product": product->{
            _id,
            name,
            price,
            description,
            productLink,
            slug
          }
        }
      }`,
      { orderId }
    );

    if (!order) {
      return new NextResponse(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    // Update order
    try {
      const result = await backendClient
        .patch(orderId)
        .set({
          paymentStatus: paymentStatus || order.paymentStatus,
          orderStatus: orderStatus || order.orderStatus,
          updatedAt: new Date().toISOString(),
        })
        .commit();

      // Send confirmation email if order is marked as successful
      let emailStatus = null;
      if (paymentStatus === "success") {
        try {
          const emailResult = await sendOrderConfirmationEmail({
            orderId: order.orderNumber,
            customerName: order.customer.name,
            customerEmail: order.customer.email,
            totalAmount: order.totalAmount,
            items: order.items.map((item: any) => ({
              product: {
                name: item.product.name,
                price: item.price, // Use the price stored in the order item
                productLink: item.product.productLink,
                slug: item.product.slug,
              },
              quantity: item.quantity,
              size: item.size,
            })),
          });
          emailStatus = emailResult.success ? "success" : "failed";
        } catch (emailError) {
          emailStatus = "failed";
        }
      }

      return NextResponse.json({
        success: true,
        order: result,
        emailStatus,
      });
    } catch (e: any) {
      return new NextResponse(
        JSON.stringify({
          error: "Database error: " + (e.message || "Failed to update order"),
        }),
        { status: 500 }
      );
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: error.message || "Failed to update order",
      }),
      { status: 500 }
    );
  }
}
