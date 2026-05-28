// ═══════════════════════════════════════════════════════════════
//  Sanity GROQ Queries — All Editorial Content
// ═══════════════════════════════════════════════════════════════

/**
 * Homepage: site settings + featured supporters for logo wall.
 */
export const HOMEPAGE_QUERY = `
  *[_type == "siteSettings"][0] {
    siteTitle,
    siteDescription,
    heroHeadline,
    heroSubcopy,
    heroPrimaryCta,
    heroSecondaryCta,
    supportedBy[] {
      name,
      logo { asset { _ref } },
      url,
      displayOrder
    },
    defaultSeo
  }
`;

/**
 * About page: about singleton + founders + advisors + featured partners.
 */
export const ABOUT_QUERY = `
  *[_type == "aboutPage"][0] {
    heroHeadline,
    heroSubcopy,
    missionTitle,
    missionBody,
    visionTitle,
    visionBody,
    governanceNote,
    seo
  }
`;

/**
 * All published founders, ordered by displayOrder.
 */
export const FOUNDERS_QUERY = `
  *[_type == "founder" && published == true] | order(displayOrder asc) {
    _id,
    name,
    designation,
    bio,
    image { asset { _ref }, hotspot },
    linkedInUrl,
    twitterUrl,
    displayOrder
  }
`;

/**
 * All published advisors, ordered by displayOrder.
 * Fetched as full array — client-side filtering by category.
 */
export const ADVISORS_QUERY = `
  *[_type == "advisor" && published == true] | order(displayOrder asc) {
    _id,
    name,
    title,
    company,
    category,
    bio,
    expertise,
    image { asset { _ref }, hotspot },
    linkedInUrl,
    twitterUrl,
    websiteUrl,
    featured,
    displayOrder
  }
`;

/**
 * Featured supporters for footer marquee and logo walls.
 */
export const SUPPORTERS_QUERY = `
  *[_type == "partner" && isSupporter == true && published == true] | order(displayOrder asc) {
    _id,
    name,
    logo { asset { _ref } },
    websiteUrl,
    category
  }
`;

/**
 * All featured partners (for logo walls, not marquee).
 */
export const PARTNERS_QUERY = `
  *[_type == "partner" && featured == true && published == true] | order(displayOrder asc) {
    _id,
    name,
    logo { asset { _ref } },
    websiteUrl,
    category,
    isSupporter
  }
`;

/**
 * Default SEO from site settings.
 */
export const DEFAULT_SEO_QUERY = `
  *[_type == "siteSettings"][0] {
    siteTitle,
    siteDescription,
    defaultSeo
  }
`;

/**
 * Chatbot configuration — template-based auto-responses, quick actions, UI settings.
 */
export const CHATBOT_QUERY = `
  *[_type == "chatbotConfig"][0] {
    isEnabled,
    botName,
    botAvatar { asset { _ref } },
    themeColor,
    position,
    greeting,
    greetingDelay,
    inputPlaceholder,
    offlineMessage,
    quickActions[] {
      label,
      response,
      link,
      linkLabel
    },
    faqResponses[] {
      keywords,
      response,
      suggestedLinks[] {
        label,
        url
      }
    },
    fallbackResponse,
    fallbackQuickActions,
    typingIndicatorDuration,
    maxConversationLength,
    contactCTA,
    contactButtonText,
    contactLink,
    businessHours {
      timezone,
      schedule[] {
        day,
        hours
      }
    }
  }
`;
