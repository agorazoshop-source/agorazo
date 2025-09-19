import { defineField, defineType } from "sanity";

export const userCartType = defineType({
  name: "userCart",
  title: "User Cart",
  type: "document",
  fields: [
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Cart Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule: any) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              productName: "product.name",
              productImage: "product.images.0",
            },
            prepare({ productName, productImage }) {
              return {
                title: productName || "Unknown Product",
                subtitle: "Digital Product",
                media: productImage,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "userEmail",
      items: "items",
    },
    prepare(selection: Record<string, any>) {
      const { title, items } = selection;
      return {
        title: title || "Unknown Email",
        subtitle: `${items?.length || 0} items`,
      };
    },
  },
});
