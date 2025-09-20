/**
 * Sanity webhook handler for automatic order snapshot updates
 * Triggers when products are modified to maintain data integrity
 */

import { NextRequest, NextResponse } from "next/server";
import { updateOrderSnapshotsForProduct } from "@/scripts/updateOrderSnapshots";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify webhook secret (optional but recommended)
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
    if (webhookSecret && body.secret !== webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if this is a product update
    if (body.type === "product" && body.operation === "update") {
      const productId = body.documentId;

      if (productId) {
        console.log(
          `Product ${productId} was updated, updating order snapshots...`
        );

        try {
          // Update order snapshots for this product
          await updateOrderSnapshotsForProduct(productId);

          return NextResponse.json({
            success: true,
            message: `Order snapshots updated for product ${productId}`,
          });
        } catch (error) {
          console.error("Failed to update order snapshots:", error);
          return NextResponse.json(
            { error: "Failed to update order snapshots" },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
