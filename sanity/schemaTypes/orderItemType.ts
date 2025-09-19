import { defineType } from "sanity";

export const orderItemType = defineType({
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    {
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
  ],
  preview: {
    select: {
      title: "product.name",
      price: "price",
    },
    prepare({ title, price }) {
      return {
        title: title || "No product name",
        subtitle: `Digital Product • Price: ₹${price || 0}`,
      };
    },
  },
});
