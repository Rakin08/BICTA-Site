import { getDb } from "../api/queries/connection";
import { advisers } from "./schema";

async function seedAdvisers() {
  const db = getDb();

  // Check if any advisers already exist
  const existing = await db.select().from(advisers).limit(1);
  if (existing.length > 0) {
    console.log("Advisers already seeded. Skipping.");
    return;
  }

  await db.insert(advisers).values([
    {
      name: "Dr. Farhan Hussain",
      title: "Chief Strategy Advisor",
      company: "Former VP at Google APAC",
      bio: "20+ years in tech strategy, helped scale 3 unicorn startups across Southeast Asia. Former VP of Product Strategy at Google Asia-Pacific.",
      expertise: JSON.stringify(["Strategy", "Growth", "Venture Capital"]),
      imageUrl: null,
      linkedInUrl: "https://linkedin.com/in/example",
      twitterUrl: null,
      websiteUrl: null,
      displayOrder: 1,
      featured: true,
      published: true,
    },
    {
      name: "Nadia Rahman",
      title: "Head of Engineering Mentorship",
      company: "Principal Engineer at Meta",
      bio: "Leading large-scale systems design with expertise in distributed architectures and AI infrastructure. 12 years at top Silicon Valley companies.",
      expertise: JSON.stringify(["Systems Design", "AI/ML", "Leadership"]),
      imageUrl: null,
      linkedInUrl: "https://linkedin.com/in/example",
      twitterUrl: null,
      websiteUrl: null,
      displayOrder: 2,
      featured: true,
      published: true,
    },
    {
      name: "Kamal Ahmed",
      title: "Advisor on Product Innovation",
      company: "CPO at Pathao",
      bio: "Product-led growth expert with multiple exits and a passion for emerging markets. Scaled products from 0 to 10M+ users.",
      expertise: JSON.stringify(["Product", "Growth", "UX"]),
      imageUrl: null,
      linkedInUrl: "https://linkedin.com/in/example",
      twitterUrl: null,
      websiteUrl: null,
      displayOrder: 3,
      featured: true,
      published: true,
    },
    {
      name: "Dr. Ayesha Siddiqa",
      title: "Research Advisor",
      company: "Professor at MIT",
      bio: "Pioneering researcher in human-computer interaction and accessibility tech. Published 50+ papers in top-tier venues.",
      expertise: JSON.stringify(["Research", "HCI", "Accessibility"]),
      imageUrl: null,
      linkedInUrl: "https://linkedin.com/in/example",
      twitterUrl: null,
      websiteUrl: null,
      displayOrder: 4,
      featured: true,
      published: true,
    },
    {
      name: "Rashid Khan",
      title: "Technical Advisor",
      company: "Staff Engineer at Google",
      bio: "Distributed systems expert specializing in cloud-native architectures and DevOps practices. Kubernetes contributor.",
      expertise: JSON.stringify(["Cloud", "DevOps", "Kubernetes"]),
      imageUrl: null,
      linkedInUrl: "https://linkedin.com/in/example",
      twitterUrl: null,
      websiteUrl: null,
      displayOrder: 5,
      featured: true,
      published: true,
    },
    {
      name: "Meherun Nessa",
      title: "Data Science Advisor",
      company: "Director of AI at Samsung R&D",
      bio: "Leading AI research initiatives in computer vision and natural language processing. PhD from Stanford.",
      expertise: JSON.stringify(["AI/ML", "Computer Vision", "NLP"]),
      imageUrl: null,
      linkedInUrl: "https://linkedin.com/in/example",
      twitterUrl: null,
      websiteUrl: null,
      displayOrder: 6,
      featured: true,
      published: true,
    },
  ]);

  console.log("Seeded 6 advisers.");
}

seedAdvisers().catch(console.error);
