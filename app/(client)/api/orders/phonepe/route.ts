import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = await currentUser();

    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { paymentDetails, orderDetails } = await req.json();

    if (!paymentDetails || !orderDetails) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const {
      merchantTransactionId,
      transactionId,
      // providerReferenceId, // Not used in this implementation
      paymentInstrument,
    } = paymentDetails;

    const { amount, address, items, couponCode, discountAmount } = orderDetails;

    // Create order document
    const order = {
      _type: "order",
      orderNumber: `ORD-${Date.now()}-${uuidv4().substring(0, 6)}`,
      customer: {
        name: user?.fullName ?? address?.fullName ?? "Unknown",
        email: user?.primaryEmailAddress?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: items.map((item: any) => ({
        product: {
          _type: "reference",
          _ref: item.product._id,
        },
        price: item.product.price,
      })),
      totalAmount: amount,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || null,
      paymentStatus: "paid",
      orderStatus: "confirmed",
      paymentMethod: "phonepe",
      paymentDetails: {
        merchantTransactionId,
        transactionId,
        paymentInstrument: {
          type: paymentInstrument.type,
          accountHolderName: paymentInstrument.accountHolderName,
          accountType: paymentInstrument.accountType,
          cardNetwork: paymentInstrument.cardNetwork,
          upiTransactionId: paymentInstrument.upiTransactionId,
          utr: paymentInstrument.utr,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await backendClient.create(order);

    return NextResponse.json({
      success: true,
      orderId: result._id,
    });
  } catch (error) {
    console.error("Error creating PhonePe order:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to create order",
      }),
      { status: 500 }
    );
  }
}
