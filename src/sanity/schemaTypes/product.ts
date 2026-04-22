import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "code",
      title: "Product Code",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "unit",
      title: "Unit",
      type: "string",
    }),
    defineField({
      name: "weight",
      title: "Weight",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: "e.g. ₹ 300.00",
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      description: "Optional promotional badge e.g. '50% OFF'",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Select the category this product belongs to.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "code",
      media: "image",
    },
  },
});
