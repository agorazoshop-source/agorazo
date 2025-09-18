import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { generateChecksum } from "@/lib/phonepe";

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const body = await req.json();

    // Verify the response signature
    const { response, merchantId, transactionId } = body;
    const checksum = generateChecksum(
      response,
      `/pg/v1/status/${merchantId}/${transactionId}`
    );

    // Decode and parse the response
    const decodedResponse = JSON.parse(
      Buffer.from(response, "base64").toString()
    );

    // Find the order using merchantTransactionId
    const order = await backendClient.fetch(
      `*[_type == "order" && paymentDetails.merchantTransactionId == $transactionId][0]`,
      { transactionId }
    );

    if (!order) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Order not found" }),
        { status: 404 }
      );
    }

    // Update order based on payment status
    const { code, data } = decodedResponse;

    const updateData = {
      updatedAt: new Date().toISOString(),
      "paymentDetails.transactionId": data.transactionId,
      "paymentDetails.paymentInstrument": {
        type: data.paymentInstrument.type,
        cardNetwork: data.paymentInstrument.cardNetwork,
        accountHolderName: data.paymentInstrument.accountHolderName,
        accountType: data.paymentInstrument.accountType,
        upiTransactionId: data.paymentInstrument.upiTransactionId,
        utr: data.paymentInstrument.utr,
      },
    };

    if (code === "PAYMENT_SUCCESS") {
      Object.assign(updateData, {
        paymentStatus: "paid",
        orderStatus: "confirmed",
      });
    } else if (code === "PAYMENT_ERROR" || code === "PAYMENT_DECLINED") {
      Object.assign(updateData, {
        paymentStatus: "failed",
        orderStatus: "cancelled",
      });
    }

    await backendClient.patch(order._id).set(updateData).commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500 }
    );
  }
}
