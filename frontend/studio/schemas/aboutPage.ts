import { defineType, defineField } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "About BICTA",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubcopy",
      title: "Hero Subcopy",
      type: "text",
      rows: 2,
      initialValue:
        "Learn about our mission, vision, and the people driving Bangladesh's ICT revolution.",
    }),
    defineField({
      name: "missionTitle",
      title: "Mission Title",
      type: "string",
      initialValue: "Our Mission",
    }),
    defineField({
      name: "missionBody",
      title: "Mission Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "visionTitle",
      title: "Vision Title",
      type: "string",
      initialValue: "Our Vision",
    }),
    defineField({
      name: "visionBody",
      title: "Vision Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "governanceNote",
      title: "Governance / Values Note",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Optional credibility block (e.g. governance structure, core values)",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
});
