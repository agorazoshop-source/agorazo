import { ComponentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const homeSectionType = defineType({
  name: "homeSection",
  title: "Home Section",
  type: "document",
  icon: ComponentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Section Subtitle",
      type: "string",
      description: "Optional subtitle for the section",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "product" },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      description: "Select products to display in this section",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.min(1),
      description:
        "Order in which this section appears on the home page (lower numbers appear first)",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Toggle to show/hide this section on the home page",
    }),
    defineField({
      name: "maxProducts",
      title: "Maximum Products to Display",
      type: "number",
      initialValue: 8,
      validation: (Rule) => Rule.min(1).max(20),
      description: "Maximum number of products to display in this section",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      isActive: "isActive",
      productCount: "products",
    },
    prepare(selection) {
      const { title, subtitle, isActive, productCount } = selection;
      const count = productCount ? productCount.length : 0;
      return {
        title: title,
        subtitle: `${subtitle || ""} • ${count} products • ${isActive ? "Active" : "Inactive"}`,
        media: ComponentIcon,
      };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
});
