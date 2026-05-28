import { defineType, defineField } from "sanity";

export default defineType({
  name: "founder",
  title: "Founder",
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
      name: "designation",
      title: "Designation",
      type: "string",
      description: 'e.g. "Co-Founder & CEO"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
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
      subtitle: "designation",
      media: "image",
    },
  },
});
