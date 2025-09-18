import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity/schemaTypes/types";

interface CartItem {
  product: Product & {
    categories?: Array<{
      _ref: string;
      _type: "reference";
    }>;
    price?: number;
  };
  quantity: number;
  size?: string;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      code,
      cartAmount,
      items,
    }: { code: string; cartAmount: number; items: CartItem[] } =
      await req.json();

    // Fetch coupon from Sanity
    const coupon = await client.fetch(
      `*[_type == "coupon" && code == $code && isActive == true][0]{
        ...,
        "categories": applicableCategories[]->_id
      }`,
      { code }
    );

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 400 }
      );
    }

    // Check if coupon is expired
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom || now > validUntil) {
      return NextResponse.json(
        { error: "Coupon has expired" },
        { status: 400 }
      );
    }

    // Check minimum cart amount
    if (cartAmount < coupon.minimumAmount) {
      return NextResponse.json(
        {
          error: `Minimum cart amount should be ₹${coupon.minimumAmount} to use this coupon`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cartAmount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Apply maximum discount limit
    if (discountAmount > coupon.maximumDiscount) {
      discountAmount = coupon.maximumDiscount;
    }

    // Check if coupon is applicable to all items
    if (coupon.categories && coupon.categories.length > 0) {
      const applicableAmount = items.reduce((total: number, item: CartItem) => {
        const categoryId = item.product.categories?.[0]?._ref;
        if (categoryId && coupon.categories.includes(categoryId)) {
          return total + (item.product.price || 0) * item.quantity;
        }
        return total;
      }, 0);

      if (applicableAmount === 0) {
        return NextResponse.json(
          { error: "Coupon is not applicable to any items in cart" },
          { status: 400 }
        );
      }

      // Recalculate discount based on applicable items
      if (coupon.discountType === "percentage") {
        discountAmount = (applicableAmount * coupon.discountValue) / 100;
      }
    }

    return NextResponse.json({
      valid: true,
      discount: discountAmount,
      code: coupon.code,
      type: coupon.discountType,
      value: coupon.discountValue,
    });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
