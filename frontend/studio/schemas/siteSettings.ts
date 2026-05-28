import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      initialValue: "BICTA — Bangladesh ICT Alliance",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      rows: 2,
      initialValue:
        "BICTA bridges academia and industry through flagship national programs: AI Olympiad, AI for SDG, and Datathon Series.",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Bridging Academia and Industry",
      description: "Main headline on the homepage hero",
    }),
    defineField({
      name: "heroSubcopy",
      title: "Hero Subcopy",
      type: "text",
      rows: 2,
      initialValue:
        "Empowering Bangladesh's next generation of tech leaders through national competitions, research programs, and industry partnerships.",
    }),
    defineField({
      name: "heroPrimaryCta",
      title: "Hero Primary CTA",
      type: "string",
      initialValue: "Explore Events",
    }),
    defineField({
      name: "heroSecondaryCta",
      title: "Hero Secondary CTA",
      type: "string",
      initialValue: "Partner Now",
    }),
    defineField({
      name: "supportedBy",
      title: "Supported By",
      type: "array",
      description: "Organizations shown in the footer marquee",
      of: [
        {
          type: "object",
          name: "supporter",
          fields: [
            defineField({
              name: "name",
              title: "Organization Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "logo",
              title: "Logo",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "url",
              title: "Website URL",
              type: "url",
            }),
            defineField({
              name: "displayOrder",
              title: "Display Order",
              type: "number",
              initialValue: 0,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seoFields",
    }),
  ],
});
