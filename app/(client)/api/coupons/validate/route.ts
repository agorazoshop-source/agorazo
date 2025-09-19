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

    // Validate items structure
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Ensure all items have required fields
    const validatedItems = items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: typeof item.product.price === "number" ? item.product.price : 0,
        categories: item.product.categories || [],
      },
    }));

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

    // Check if coupon is applicable to specific categories
    if (coupon.categories && coupon.categories.length > 0) {
      const applicableAmount = validatedItems.reduce(
        (total: number, item: CartItem) => {
          const categoryId = item.product.categories?.[0]?._ref;
          const isApplicable =
            categoryId && coupon.categories.includes(categoryId);

          // Handle price safely - check if it's a valid number
          const productPrice =
            typeof item.product.price === "number" ? item.product.price : 0;
          const itemTotal = productPrice;

          if (isApplicable) {
            return total + itemTotal;
          }
          return total;
        },
        0
      );

      if (applicableAmount === 0) {
        return NextResponse.json(
          { error: "Coupon is not applicable to any items in cart" },
          { status: 400 }
        );
      }

      // Recalculate discount based on applicable items
      if (coupon.discountType === "percentage") {
        discountAmount = (applicableAmount * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }
    } else {
      // Recalculate discount based on all items to ensure we have valid numbers
      const totalCartAmount = validatedItems.reduce(
        (total: number, item: CartItem) => {
          const productPrice =
            typeof item.product.price === "number" ? item.product.price : 0;
          return total + productPrice;
        },
        0
      );

      if (coupon.discountType === "percentage") {
        discountAmount = (totalCartAmount * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
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
