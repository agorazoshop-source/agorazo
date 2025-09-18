import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID as string;
const key_secret = process.env.RAZORPAY_KEY_SECRET as string;

if (!key_id || !key_secret) {
  throw new Error("Razorpay keys are missing");
}

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export type RazorpayOrderBody = {
  amount: number;
  currency: string;
  orderId?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, orderId }: RazorpayOrderBody =
      await request.json();

    if (!amount) {
      return NextResponse.json(
        { message: "Amount is required" },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency || "INR",
      receipt: `receipt_${orderId || Date.now()}`,
      notes: {
        orderId: orderId || null,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
