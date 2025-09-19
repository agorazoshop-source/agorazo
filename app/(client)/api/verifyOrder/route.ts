import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";
import { sendOrderConfirmationEmail } from "@/lib/email";

export interface VerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    }: VerifyBody = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required parameters", success: false },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    if (!secret) {
      return NextResponse.json(
        { error: "Razorpay secret not found" },
        { status: 400 }
      );
    }

    // Verify the signature
    const HMAC = crypto.createHmac("sha256", secret);
    HMAC.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = HMAC.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // If orderId is provided, update the order in Sanity
      if (orderId) {
        try {
          // First, get the order details to send email
          const order = await backendClient.fetch(
            `*[_type == "order" && _id == $orderId][0]{
              orderNumber,
              customer,
              totalAmount,
              items[] {
                product-> {
                  name,
                  productLink,
                  slug
                },
                price
              }
            }`,
            { orderId }
          );

          // Update order status
          await backendClient
            .patch(orderId)
            .set({
              paymentStatus: "paid",
              orderStatus: "confirmed",
              "paymentDetails.razorpayOrderId": razorpay_order_id,
              "paymentDetails.razorpayPaymentId": razorpay_payment_id,
              "paymentDetails.razorpaySignature": razorpay_signature,
              updatedAt: new Date().toISOString(),
            })
            .commit();

          // Send confirmation email
          if (order && order.customer && order.customer.email) {
            try {
              await sendOrderConfirmationEmail({
                orderId: order.orderNumber,
                customerName: order.customer.name,
                customerEmail: order.customer.email,
                totalAmount: order.totalAmount,
                items: order.items.map((item: any) => ({
                  product: {
                    name: item.product?.name || "Unknown Product",
                    price: item.price,
                    productLink: item.product?.productLink,
                    slug: item.product?.slug,
                  },
                })),
              });
            } catch (emailError) {
              console.error("Email sending failed:", emailError);
              // Don't fail the payment verification if email fails
            }
          }
        } catch (error: any) {
          console.error("Order update failed:", error);
          // Don't fail the verification if order update fails
        }
      }

      return NextResponse.json({
        message: "Payment verified successfully",
        success: true,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid signature", success: false },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "An error occurred", success: false },
      { status: 500 }
    );
  }
}
