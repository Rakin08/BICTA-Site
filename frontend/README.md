# BICTA — Next.js 14 Platform

**BICTA (Bangladesh ICT Alliance)** — A production-ready Next.js 14 platform with App Router, Sanity CMS, and dual-data-source architecture.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     NEXT.JS 14 (App Router)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Pages   │  │ Components│  │   Sanity Client      │  │
│  │  (RSC)   │  │(RSC/Client)│  │   (GROQ queries)    │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
│       │              │                    │              │
│       └──────────────┴────────────────────┘              │
│                          │                               │
│              ┌───────────┴───────────┐                   │
│              ▼                       ▼                   │
│     ┌─────────────┐        ┌─────────────────┐          │
│     │  Sanity CMS  │        │  Hono tRPC API  │          │
│     │  (editorial) │        │  (operational)  │          │
│     └─────────────┘        └─────────────────┘          │
│                                    │                     │
│                                    ▼                     │
│                           ┌─────────────────┐            │
│                           │   MySQL (Drizzle)│            │
│                           └─────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3.4 |
| CMS | Sanity v3 |
| Backend API | Hono + tRPC + Drizzle ORM + MySQL |
| Auth | OAuth 2.0 (Kimi) |
| Animation | GSAP + ScrollTrigger |
| Icons | Lucide React |
| Forms | react-hook-form + Zod |
| Toast | Sonner |

## Project Structure

```
bicta-nextjs/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Nav + Footer + Fonts)
│   ├── page.tsx                  # Homepage
│   ├── events/
│   │   ├── page.tsx              # Events hub with filters
│   │   └── [slug]/
│   │       └── page.tsx          # Event detail with JSON-LD
│   ├── programs/
│   │   ├── page.tsx              # Programs directory
│   │   └── [slug]/
│   │       └── page.tsx          # Program detail
│   ├── about/
│   │   └── page.tsx              # About (mission, vision, founders, advisors)
│   ├── partners/
│   │   └── page.tsx              # Partner funnel + inquiry form
│   ├── insights/
│   │   └── page.tsx              # Blog placeholder
│   ├── contact/
│   │   └── page.tsx              # Contact form
│   └── api/
│       ├── revalidate/
│       │   └── route.ts          # Sanity webhook for ISR
│       └── partner-inquiry/
│           └── route.ts          # Form proxy to tRPC
├── src/
│   ├── components/
│   │   ├── ui/                   # Atomic components
│   │   │   ├── EventStatusBadge.tsx
│   │   │   ├── SectionLabel.tsx
│   │   │   ├── GoldButton.tsx
│   │   │   └── accordion.tsx     # Radix UI wrapper
│   │   ├── layout/
│   │   │   ├── SiteNav.tsx       # Fixed nav with glass morphism
│   │   │   ├── SiteFooter.tsx    # 3-col footer + marquee
│   │   │   └── PageHero.tsx      # Sub-page hero
│   │   ├── EventCard.tsx
│   │   ├── EventFilterBar.tsx    # URL-driven filter bar
│   │   ├── EventQuickRail.tsx    # Sticky event sidebar
│   │   ├── PeopleCard.tsx        # Founder/advisor card
│   │   ├── LogoWall.tsx          # Partner logo grid
│   │   ├── FooterMarquee.tsx     # Infinite scroll marquee
│   │   ├── FAQAccordion.tsx      # Radix accordion
│   │   ├── CTASection.tsx        # Call-to-action block
│   │   ├── ImpactMetricsSection.tsx
│   │   ├── PartnerInquiryForm.tsx
│   │   ├── AdvisorFilter.tsx     # Category tabs
│   │   ├── PortableText.tsx      # Sanity rich text renderer
│   │   └── Providers.tsx         # Toast provider
│   ├── sections/
│   │   ├── HomeHero.tsx          # Animated homepage hero
│   │   └── ProgramsOverview.tsx  # 3-col program grid
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts         # Sanity client config
│   │   │   ├── image.ts          # urlFor() builder
│   │   │   └── queries.ts        # All GROQ queries
│   │   ├── api.ts                # tRPC fetch wrappers
│   │   └── utils.ts              # cn(), formatDate(), etc.
│   ├── types/
│   │   └── index.ts              # All TypeScript interfaces
│   └── hooks/
│       └── useAuth.ts            # Auth state hook
├── studio/                       # Sanity Studio v3
│   ├── sanity.config.ts          # Desk structure
│   └── schemas/
│       ├── siteSettings.ts       # Singleton
│       ├── founder.ts            # Document
│       ├── advisor.ts            # Document
│       ├── aboutPage.ts          # Singleton
│       ├── partner.ts            # Document
│       └── seoFields.ts          # Reusable object
├── public/images/
├── tailwind.config.ts            # Design tokens
├── tsconfig.json                 # Strict mode
└── next.config.ts                # Image domains
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (default: `production`) |
| `SANITY_API_TOKEN` | Sanity read-only token |
| `SANITY_REVALIDATE_SECRET` | Random string for webhook auth |
| `BICTA_API_URL` | tRPC backend URL (e.g. `https://api.bicta.org`) |

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint check
npm run typecheck # TypeScript check (zero errors policy)
```

## Caching Strategy

| Content | Strategy |
|---|---|
| Sanity (about, founders, advisors) | 1 hour + on-demand revalidation via webhook |
| Events list | 1 minute |
| Event detail | 5 minutes (ISR) |
| Impact metrics | 1 hour |
| Programs | 1 hour |

## Key Design Decisions

1. **Dual data sources**: Editorial content (Sanity) is separate from operational data (tRPC/MySQL). This lets editors publish without deployments.
2. **Server Components by default**: Pages fetch data server-side. Client components are small islands for interactivity.
3. **GSAP context pattern**: All GSAP animations use `gsap.context()` with proper cleanup.
4. **Zero `any`**: Strict TypeScript throughout — all types defined in `src/types/index.ts`.
5. **Sharp corners**: `--radius: 0rem` for buttons/layout, `rounded-xl` only for cards.
