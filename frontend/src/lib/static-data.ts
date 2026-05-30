// ─── Static data — edit here to update the site ─────────────────────

export interface Advisor {
  id: number;
  name: string;
  title: string;
  company: string;
  category: "Industry" | "Academia" | "Policy" | "Startup" | "Technology";
  expertise: string;
  bio: string;
  imageUrl: string;
  linkedIn: string;
  published: boolean;
  featured?: boolean;
}

export interface Founder {
  id: number;
  name: string;
  designation: string;
  bio: string;
  imageUrl: string;
  linkedInUrl: string;
}

export const ADVISORS: Advisor[] = [
  { id:1, name:"Dr. Farhan Hussain", title:"Chief Strategy Advisor", company:"Former VP — Google APAC", category:"Industry", expertise:"Strategy, Growth, Venture Capital", bio:"20+ years in tech strategy across Southeast Asia.", imageUrl:"", linkedIn:"#", published:true, featured:true },
  { id:2, name:"Nadia Rahman", title:"Engineering Mentorship Lead", company:"Principal Engineer — Meta", category:"Technology", expertise:"Systems Design, AI/ML, Leadership", bio:"Large-scale distributed systems expert.", imageUrl:"", linkedIn:"#", published:true, featured:true },
  { id:3, name:"Prof. Kamal Uddin Ahmed", title:"Academic Advisor", company:"Professor — BUET", category:"Academia", expertise:"ML Research, Curriculum, Policy", bio:"Pioneering researcher in applied ML.", imageUrl:"", linkedIn:"#", published:true, featured:true },
  { id:4, name:"Taslima Begum", title:"Policy Advisor", company:"Director — ICT Division", category:"Policy", expertise:"Policy, Governance, Digital Skills", bio:"Architect of national digital skills initiatives.", imageUrl:"", linkedIn:"#", published:true, featured:true },
  { id:5, name:"Karim Ahmed", title:"Product Innovation Advisor", company:"CPO — Pathao", category:"Startup", expertise:"Product, Growth, UX", bio:"Product-led growth expert, multiple exits.", imageUrl:"", linkedIn:"#", published:true, featured:false },
  { id:6, name:"Sadia Islam", title:"Startup Ecosystem Advisor", company:"Managing Partner — GP Accelerator", category:"Startup", expertise:"Investment, Deep Tech, Startups", bio:"Built and mentored 60+ startups.", imageUrl:"", linkedIn:"#", published:true, featured:false },
  { id:7, name:"Rashed Khan", title:"Industry Relations Advisor", company:"VP Engineering — bKash", category:"Industry", expertise:"Fintech, Engineering, Talent", bio:"Led fintech engineering at scale.", imageUrl:"", linkedIn:"#", published:true, featured:false },
  { id:8, name:"Dr. Ayesha Siddiqa", title:"Research Advisor", company:"Research Fellow — MIT Media Lab", category:"Academia", expertise:"Research, HCI, Accessibility", bio:"Pioneering researcher in HCI.", imageUrl:"", linkedIn:"#", published:true, featured:false },
];

export const FOUNDERS: Founder[] = [
  { id:1, name:"Tanjim Mahmud Rakin", designation:"Founder & CEO", bio:"Visionary behind BICTA, connecting Bangladesh's brightest minds with world-class opportunities.", imageUrl:"", linkedInUrl:"#" },
  { id:2, name:"[Co-founder Name]", designation:"Co-Founder & CTO", bio:"Technical architect of BICTA's competition and AI platform infrastructure.", imageUrl:"", linkedInUrl:"#" },
  { id:3, name:"[Advisor Name]", designation:"Chief Advisor", bio:"Senior advisor guiding BICTA's strategic partnerships and growth.", imageUrl:"", linkedInUrl:"#" },
];

export const SUPPORTERS: string[] = [
  "Grameenphone", "bKash", "Microsoft", "Brain Station 23",
  "BASIS", "Robi", "AWS Bangladesh", "GP Accelerator",
  "Pathao", "Startup Bangladesh",
];
