import { defineField, defineType } from "sanity";

export const orderItemType = defineType({
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    // Keep the original reference for backward compatibility and optional linking
    defineField({
      name: "product",
      title: "Product Reference",
      type: "reference",
      to: [{ type: "product" }],
      weak: true, // Make it weak so products can be deleted
      description:
        "Optional reference to the original product (can be null if product is deleted)",
    }),
    // Product snapshot fields - these store the complete product data at time of order
    defineField({
      name: "productSnapshot",
      title: "Product Snapshot",
      type: "object",
      fields: [
        defineField({
          name: "name",
          title: "Product Name",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "slug",
          title: "Product Slug",
          type: "slug",
        }),
        defineField({
          name: "description",
          title: "Product Description",
          type: "string",
        }),
        defineField({
          name: "images",
          title: "Product Images",
          type: "array",
          of: [{ type: "image", options: { hotspot: true } }],
        }),
        defineField({
          name: "price",
          title: "Product Price",
          type: "number",
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "discount",
          title: "Product Discount",
          type: "number",
        }),
        defineField({
          name: "productLink",
          title: "Product Link",
          type: "url",
        }),
        defineField({
          name: "status",
          title: "Product Status",
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.required(),
      description:
        "Complete snapshot of product data at the time of order creation",
    }),
    defineField({
      name: "price",
      title: "Price at Time of Order",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      description:
        "Price when the order was placed (may differ from current product price)",
    }),
  ],
  preview: {
    select: {
      title: "productSnapshot.name",
      price: "price",
    },
    prepare({ title, price }) {
      return {
        title: title || "No product name",
        subtitle: `Price: ₹${price || 0}`,
      };
    },
  },
});
