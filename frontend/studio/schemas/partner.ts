import { defineType, defineField } from "sanity";

export default defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Organization Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      description: "Transparent PNG or SVG, minimum 400px wide",
    }),
    defineField({
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Sponsor", value: "Sponsor" },
          { title: "University", value: "University" },
          { title: "Media", value: "Media" },
          { title: "Ecosystem", value: "Ecosystem" },
          { title: "Government", value: "Government" },
        ],
        layout: "radio",
      },
      initialValue: "Ecosystem",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show prominently on partner pages",
    }),
    defineField({
      name: "isSupporter",
      title: "Is Supporter",
      type: "boolean",
      initialValue: false,
      description: "Appears in footer marquee and 'Supported by' sections",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "logo",
    },
  },
});
