import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in environment");
}

const client = createConnection(databaseUrl);
const db = drizzle(client, { schema, mode: "planetscale" });

async function seed() {
  console.log("Seeding BICTA Elite database...");

  // Seed Programs
  await db.insert(schema.programs).values([
    {
      title: "Executive Mastery",
      slug: "executive-mastery",
      category: "Professional Training",
      summary: "Intensive programs designed for senior professionals seeking to elevate their leadership capabilities.",
      description: "The Executive Mastery program is BICTA Elite's flagship professional development offering. Over 12 weeks, senior professionals engage with world-class faculty, industry mentors, and a curated peer group to transform their leadership approach.",
      imageUrl: "/images/program-training.jpg",
      featured: true,
      published: true,
      order: 1,
    },
    {
      title: "Innovation Labs",
      slug: "innovation-labs",
      category: "Corporate Innovation",
      summary: "Immersive workshops that drive digital transformation and foster cutting-edge thinking.",
      description: "Innovation Labs brings together cross-functional teams to solve real business challenges using design thinking, agile methodologies, and emerging technologies.",
      imageUrl: "/images/program-innovation.jpg",
      featured: true,
      published: true,
      order: 2,
    },
    {
      title: "Annual Summit",
      slug: "annual-summit",
      category: "Leadership Summit",
      summary: "A gathering of visionaries, thought leaders, and change-makers shaping the future.",
      description: "The BICTA Elite Annual Summit is the premier professional development conference in Bangladesh. Featuring keynote speakers from global tech giants, panel discussions on emerging trends, and unparalleled networking opportunities.",
      imageUrl: "/images/program-summit.jpg",
      featured: true,
      published: true,
      order: 3,
    },
  ]);
  console.log("  Programs seeded");

  // Seed Events
  await db.insert(schema.events).values([
    {
      title: "AI Olympiad 2026",
      slug: "ai-olympiad-2026",
      summary: "Bangladesh's premier AI competition for professionals and students.",
      body: "The AI Olympiad is a nationwide competition that challenges participants to solve real-world problems using artificial intelligence. From machine learning to deep learning, participants showcase their skills in a series of increasingly complex challenges.",
      eventType: "olympiad",
      mode: "hybrid",
      status: "registration_open",
      featured: true,
      published: true,
      registrationLimit: 500,
      venue: "Dhaka Convention Center",
    },
    {
      title: "Datathon 2026",
      slug: "datathon-2026",
      summary: "A 48-hour data science marathon tackling Bangladesh's biggest challenges.",
      body: "The Datathon brings together data scientists, analysts, and domain experts to extract insights from complex datasets. Teams compete to build the most impactful data-driven solutions.",
      eventType: "datathon",
      mode: "offline",
      status: "scheduled",
      featured: true,
      published: true,
      registrationLimit: 300,
      venue: "Bangabandhu International Conference Centre",
    },
    {
      title: "Leadership Workshop: Q3 2026",
      slug: "leadership-workshop-q3-2026",
      summary: "Intensive leadership development workshop for mid-to-senior managers.",
      body: "This workshop focuses on the core competencies required to lead high-performing tech teams. Topics include emotional intelligence, conflict resolution, strategic thinking, and building inclusive team cultures.",
      eventType: "workshop",
      mode: "online",
      status: "registration_open",
      featured: false,
      published: true,
    },
    {
      title: "Global Tech Summit 2026",
      slug: "global-tech-summit-2026",
      summary: "Connecting Bangladesh's tech ecosystem with global innovators.",
      body: "The Global Tech Summit brings together international speakers, local tech leaders, government officials, and entrepreneurs to discuss the future of technology in Bangladesh and beyond.",
      eventType: "summit",
      mode: "hybrid",
      status: "scheduled",
      featured: true,
      published: true,
      registrationLimit: 2000,
      venue: "Radisson Blu Dhaka",
    },
  ]);
  console.log("  Events seeded");

  // Seed Speakers
  await db.insert(schema.speakers).values([
    {
      name: "Dr. Anika Rahman",
      title: "Director of AI Research",
      company: "Google DeepMind",
      bio: "Leading AI researcher with 15+ years of experience in machine learning and neural networks.",
      featured: true,
    },
    {
      name: "Kamal Hossain",
      title: "VP Engineering",
      company: "Meta",
      bio: "Tech veteran who scaled engineering teams from 10 to 500+ engineers across three continents.",
      featured: true,
    },
    {
      name: "Dr. Farzana Islam",
      title: "Chief Data Officer",
      company: "bKash",
      bio: "Pioneer in fintech data analytics, driving financial inclusion through data science.",
      featured: true,
    },
    {
      name: "Rafi Ahmed",
      title: "Founder & CEO",
      company: "Pathao",
      bio: "Serial entrepreneur who built one of South Asia's largest ride-sharing and logistics platforms.",
      featured: true,
    },
  ]);
  console.log("  Speakers seeded");

  // Seed Impact Metrics
  await db.insert(schema.impactMetrics).values([
    { label: "Graduates", value: 1000, suffix: "+", description: "Professionals who have completed BICTA Elite programs", displayOrder: 1, published: true },
    { label: "Placement Rate", value: 93, suffix: "%", description: "Graduates placed in senior roles within 6 months", displayOrder: 2, published: true },
    { label: "Corporate Partners", value: 250, suffix: "+", description: "Leading companies in the BICTA Elite network", displayOrder: 3, published: true },
    { label: "BDT in Scholarships", value: 50, suffix: "M+", description: "Financial support awarded to deserving professionals", displayOrder: 4, published: true },
  ]);
  console.log("  Impact metrics seeded");

  // Seed Alumni
  await db.insert(schema.alumni).values([
    { name: "Tahsin Rafi", role: "Senior Product Manager", company: "Pathao", featured: true, published: true },
    { name: "Nabila Islam", role: "Engineering Lead", company: "bKash", featured: true, published: true },
    { name: "Rafiq Hasan", role: "CTO", company: "Chaldal", featured: true, published: true },
    { name: "Samira Akter", role: "Director of AI", company: "SSL Wireless", featured: true, published: true },
    { name: "Tanvir Hossain", role: "VP Engineering", company: "Robi Axiata", featured: true, published: true },
    { name: "Priya Saha", role: "Principal Designer", company: "Uber Bangladesh", featured: true, published: true },
  ]);
  console.log("  Alumni seeded");

  // Seed Site Settings
  await db.insert(schema.siteSettings).values([
    { key: "site_name", value: "BICTA Elite", type: "text", group: "general", label: "Site Name" },
    { key: "site_tagline", value: "Elevating Bangladesh's Tech Ecosystem", type: "text", group: "general", label: "Tagline" },
    { key: "contact_email", value: "info@bicta.org", type: "text", group: "contact", label: "Contact Email" },
    { key: "contact_phone", value: "+880 1234-567890", type: "text", group: "contact", label: "Contact Phone" },
    { key: "contact_address", value: "Dhaka, Bangladesh", type: "text", group: "contact", label: "Office Address" },
    { key: "hero_title", value: "Excellence in Action", type: "text", group: "homepage", label: "Hero Title" },
    { key: "hero_subtitle", value: "Elevating Bangladesh's tech ecosystem through world-class professional development, elite education, and meaningful connections.", type: "text", group: "homepage", label: "Hero Subtitle" },
    { key: "hero_label", value: "#1 Professional Development Platform in Bangladesh", type: "text", group: "homepage", label: "Hero Label" },
    { key: "seo_title", value: "BICTA Elite — World-Class Professional Development", type: "text", group: "seo", label: "Default SEO Title" },
    { key: "seo_description", value: "Bangladesh's #1 professional development platform. Elevate your tech career with world-class education and connections.", type: "text", group: "seo", label: "Default SEO Description" },
  ]);
  console.log("  Site settings seeded");

  // Seed Content Blocks
  await db.insert(schema.contentBlocks).values([
    { key: "about_heading", title: "We Build More Than Careers", content: "We Build More Than Careers — We Build Legacies", section: "about", type: "text", published: true, displayOrder: 1 },
    { key: "about_quote", title: "Philosophy Quote", content: "In a world of noise, mastery is the only signal that matters.", section: "about", type: "quote", published: true, displayOrder: 2 },
    { key: "about_body_1", title: "About Paragraph 1", content: "BICTA Elite was founded on a singular belief: that Bangladesh's brightest minds deserve access to world-class professional development. In an era where technology reshapes industries overnight, the gap between potential and mastery has never been wider.", section: "about", type: "richtext", published: true, displayOrder: 3 },
    { key: "about_body_2", title: "About Paragraph 2", content: "Our programs are not courses. They are transformations — designed by industry veterans, refined through real-world application, and delivered with an uncompromising commitment to excellence.", section: "about", type: "richtext", published: true, displayOrder: 4 },
    { key: "vision_heading", title: "Join the Movement", content: "Join the Movement", section: "vision", type: "text", published: true, displayOrder: 1 },
    { key: "vision_body", title: "Vision Body", content: "Applications for our next cohort are now open. Limited seats.", section: "vision", type: "text", published: true, displayOrder: 2 },
  ]);
  console.log("  Content blocks seeded");

  console.log("\nDatabase seeding complete!");
  client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  client.end();
  process.exit(1);
});
