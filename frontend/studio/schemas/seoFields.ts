import { defineType, defineField } from "sanity";

export default defineType({
  name: "seoFields",
  title: "SEO Fields",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Page title for search engines (50–60 chars)",
      validation: (Rule) => Rule.max(60).warning("Keep under 60 characters"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
      description: "Page description for search engines (150–160 chars)",
      validation: (Rule) =>
        Rule.max(160).warning("Keep under 160 characters"),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      description: "Image shown when shared on social media (1200×630)",
      options: { hotspot: true },
    }),
  ],
});
