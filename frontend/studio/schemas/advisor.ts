import { defineType, defineField } from "sanity";

export default defineType({
  name: "advisor",
  title: "Advisor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Chief Strategy Advisor"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company / Institution",
      type: "string",
      description: 'e.g. "Former VP at Google APAC"',
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Industry", value: "Industry" },
          { title: "Academia", value: "Academia" },
          { title: "Policy", value: "Policy" },
          { title: "Startup", value: "Startup" },
          { title: "Technology", value: "Technology" },
        ],
        layout: "radio",
      },
      initialValue: "Industry",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "expertise",
      title: "Expertise Areas",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "image",
      title: "Portrait Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "linkedInUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "twitterUrl",
      title: "Twitter / X URL",
      type: "url",
    }),
    defineField({
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: true,
      description: "Show on homepage adviser section",
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
      subtitle: "title",
      media: "image",
    },
  },
});
