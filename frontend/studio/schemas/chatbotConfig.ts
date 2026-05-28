import { defineField, defineType } from "sanity";

export default defineType({
  name: "chatbotConfig",
  title: "Chatbot Configuration",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Configuration Name",
      type: "string",
      initialValue: "BICTA Chatbot",
    }),
    defineField({
      name: "isEnabled",
      title: "Enable Chatbot",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "botName",
      title: "Bot Name",
      type: "string",
      initialValue: "BICTA Assistant",
    }),
    defineField({
      name: "botAvatar",
      title: "Bot Avatar Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "themeColor",
      title: "Theme Color (Hex)",
      type: "string",
      initialValue: "#c9a84c",
    }),
    defineField({
      name: "position",
      title: "Widget Position",
      type: "string",
      options: {
        list: [
          { title: "Bottom Right", value: "bottom-right" },
          { title: "Bottom Left", value: "bottom-left" },
        ],
      },
      initialValue: "bottom-right",
    }),
    defineField({
      name: "greeting",
      title: "Welcome Greeting Message",
      type: "text",
      initialValue:
        "Hello! Welcome to BICTA. How can I help you today?",
      rows: 2,
    }),
    defineField({
      name: "greetingDelay",
      title: "Greeting Delay (seconds)",
      type: "number",
      initialValue: 3,
    }),
    defineField({
      name: "inputPlaceholder",
      title: "Input Placeholder Text",
      type: "string",
      initialValue: "Type your message...",
    }),
    defineField({
      name: "offlineMessage",
      title: "Offline / End Conversation Message",
      type: "text",
      initialValue: "Thank you for chatting with us! For further assistance, email us at info@bicta.org",
      rows: 2,
    }),
    defineField({
      name: "quickActions",
      title: "Quick Action Buttons",
      type: "array",
      of: [
        {
          type: "object",
          name: "quickAction",
          fields: [
            defineField({
              name: "label",
              title: "Button Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "response",
              title: "Bot Response",
              type: "text",
              validation: (Rule) => Rule.required(),
              rows: 3,
            }),
            defineField({
              name: "link",
              title: "Optional Link URL",
              type: "url",
              description: "If set, clicking this button will navigate to this page",
            }),
            defineField({
              name: "linkLabel",
              title: "Link Button Label",
              type: "string",
              description: "Text for the CTA button (e.g., 'Learn More', 'Register Now')",
              initialValue: "Learn More",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "response" },
          },
        },
      ],
    }),
    defineField({
      name: "faqResponses",
      title: "FAQ Auto-Responses",
      description: "Define keyword triggers and their automatic responses",
      type: "array",
      of: [
        {
          type: "object",
          name: "faqEntry",
          fields: [
            defineField({
              name: "keywords",
              title: "Trigger Keywords",
              type: "array",
              of: [{ type: "string" }],
              description: "If user message contains ANY of these words, this response triggers",
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "response",
              title: "Bot Response",
              type: "text",
              validation: (Rule) => Rule.required(),
              rows: 4,
            }),
            defineField({
              name: "suggestedLinks",
              title: "Suggested Page Links",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "suggestedLink",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Link Label",
                      type: "string",
                    }),
                    defineField({
                      name: "url",
                      title: "Page URL",
                      type: "url",
                    }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: { title: "keywords", subtitle: "response" },
          },
        },
      ],
    }),
    defineField({
      name: "fallbackResponse",
      title: "Fallback Response (when no match found)",
      type: "text",
      initialValue:
        "I'm not sure I understood that correctly. Here are some things I can help with:",
      rows: 2,
    }),
    defineField({
      name: "fallbackQuickActions",
      title: "Show Quick Actions on Fallback",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "typingIndicatorDuration",
      title: "Typing Indicator Duration (ms)",
      type: "number",
      initialValue: 1200,
      description: "How long the 'typing...' animation shows before the bot responds",
    }),
    defineField({
      name: "maxConversationLength",
      title: "Max Messages Before Prompt",
      type: "number",
      initialValue: 10,
      description: "After this many messages, show contact CTA",
    }),
    defineField({
      name: "contactCTA",
      title: "Contact CTA Message",
      type: "text",
      initialValue: "Would you like to speak with our team directly?",
      rows: 2,
    }),
    defineField({
      name: "contactButtonText",
      title: "Contact Button Text",
      type: "string",
      initialValue: "Contact Us",
    }),
    defineField({
      name: "contactLink",
      title: "Contact Page URL",
      type: "url",
      initialValue: "/contact/",
    }),
    defineField({
      name: "businessHours",
      title: "Business Hours Display",
      type: "object",
      fields: [
        defineField({
          name: "timezone",
          title: "Timezone",
          type: "string",
          initialValue: "Asia/Dhaka",
        }),
        defineField({
          name: "schedule",
          title: "Schedule",
          type: "array",
          of: [
            {
              type: "object",
              name: "daySchedule",
              fields: [
                defineField({
                  name: "day",
                  title: "Day(s)",
                  type: "string",
                }),
                defineField({
                  name: "hours",
                  title: "Hours",
                  type: "string",
                }),
              ],
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", enabled: "isEnabled" },
    prepare({ title, enabled }) {
      return {
        title,
        subtitle: enabled ? "Enabled" : "Disabled",
      };
    },
  },
});
