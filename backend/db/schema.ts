import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

// ─── 1. USERS (Three login types: admin, student, partner) ─────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["admin", "student", "partner", "participant", "judge"]).default("student").notNull(),
  phone: varchar("phone", { length: 50 }),
  organization: varchar("organization", { length: 255 }),
  title: varchar("title", { length: 255 }),
  bio: text("bio"),
  passwordHash: text("passwordHash"),
  passwordSalt: text("passwordSalt"),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  dateOfBirth: varchar("dateOfBirth", { length: 20 }),
  studentId: varchar("studentId", { length: 100 }),
  department: varchar("department", { length: 255 }),
  graduationYear: varchar("graduationYear", { length: 10 }),
  university: varchar("university", { length: 255 }),
  linkedIn: text("linkedIn"),
  emailVerified: boolean("emailVerified").default(false),
  pendingRole: varchar("pendingRole", { length: 50 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

// OTP codes table for 2FA
export const otpCodes = mysqlTable("otp_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  otp: varchar("otp", { length: 10 }).notNull(),
  purpose: varchar("purpose", { length: 50 }).default("verify_judge"),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── 2. EVENTS (Full event management) ──────────────────────────────
export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  summary: text("summary"),
  body: text("body"),
  agenda: text("agenda"),
  faq: text("faq"),
  eventType: mysqlEnum("eventType", [
    "competition",
    "datathon",
    "workshop",
    "olympiad",
    "summit",
    "webinar",
    "conference",
    "hackathon",
  ]).default("workshop"),
  mode: mysqlEnum("mode", ["online", "offline", "hybrid"]).default("offline"),
  status: mysqlEnum("status", [
    "draft",
    "scheduled",
    "registration_open",
    "registration_closed",
    "live",
    "completed",
    "cancelled",
    "postponed",
  ]).default("draft"),
  startDate: varchar("startDate", { length: 50 }),
  endDate: varchar("endDate", { length: 50 }),
  venue: varchar("venue", { length: 255 }),
  venueAddress: text("venueAddress"),
  registrationUrl: text("registrationUrl"),
  registrationLimit: int("registrationLimit"),
  imageUrl: text("imageUrl"),
  coverImageUrl: text("coverImageUrl"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  createdById: bigint("createdById", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ─── 3. SPEAKERS (Event speakers/judges/mentors) ──────────────────
export const speakers = mysqlTable("speakers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  company: varchar("company", { length: 255 }),
  bio: text("bio"),
  imageUrl: text("imageUrl"),
  linkedInUrl: text("linkedInUrl"),
  twitterUrl: text("twitterUrl"),
  websiteUrl: text("websiteUrl"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Speaker = typeof speakers.$inferSelect;
export type InsertSpeaker = typeof speakers.$inferInsert;

// ─── 4. EVENT_SPEAKERS (Many-to-many join) ────────────────────────
export const eventSpeakers = mysqlTable("event_speakers", {
  id: serial("id").primaryKey(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }).notNull(),
  speakerId: bigint("speakerId", { mode: "number", unsigned: true }).notNull(),
  role: mysqlEnum("speakerRole", ["speaker", "judge", "mentor", "host", "panelist"]).default("speaker"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventSpeaker = typeof eventSpeakers.$inferSelect;

// ─── 5. EVENT REGISTRATIONS ───────────────────────────────────────
export const eventRegistrations = mysqlTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  organization: varchar("organization", { length: 255 }),
  status: mysqlEnum("regStatus", ["pending", "confirmed", "waitlisted", "cancelled", "attended"])
    .default("pending"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert;

// ─── 6. PROGRAMS ──────────────────────────────────────────────────
export const programs = mysqlTable("programs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  summary: text("summary"),
  description: text("description"),
  curriculum: text("curriculum"),
  duration: varchar("duration", { length: 100 }),
  price: varchar("price", { length: 50 }),
  imageUrl: text("imageUrl"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  order: int("displayOrder").default(0),
  createdById: bigint("createdById", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Program = typeof programs.$inferSelect;
export type InsertProgram = typeof programs.$inferInsert;

// ─── 7. PARTNER INQUIRIES ─────────────────────────────────────────
export const partnerInquiries = mysqlTable("partner_inquiries", {
  id: serial("id").primaryKey(),
  organizationName: varchar("organizationName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  interestType: mysqlEnum("interestType", [
    "sponsor",
    "university_partner",
    "media_partner",
    "ecosystem_partner",
    "other",
  ]).default("other"),
  notes: text("notes"),
  status: mysqlEnum("inquiryStatus", ["new", "contacted", "qualified", "proposal_sent", "closed_won", "closed_lost"])
    .default("new"),
  assignedToId: bigint("assignedToId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PartnerInquiry = typeof partnerInquiries.$inferSelect;
export type InsertPartnerInquiry = typeof partnerInquiries.$inferInsert;

// ─── 8. ALUMNI ────────────────────────────────────────────────────
export const alumni = mysqlTable("alumni", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  quote: text("quote"),
  bio: text("bio"),
  imageUrl: text("imageUrl"),
  batchYear: varchar("batchYear", { length: 10 }),
  linkedInUrl: text("linkedInUrl"),
  featured: boolean("featured").default(true),
  published: boolean("published").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alumni = typeof alumni.$inferSelect;
export type InsertAlumni = typeof alumni.$inferInsert;

// ─── 9. CONTACT SUBMISSIONS ───────────────────────────────────────
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  status: mysqlEnum("msgStatus", ["new", "read", "replied", "archived"]).default("new"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

// ─── 10. IMPACT METRICS ───────────────────────────────────────────
export const impactMetrics = mysqlTable("impact_metrics", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  value: int("value").notNull(),
  suffix: varchar("suffix", { length: 10 }),
  description: text("description"),
  displayOrder: int("displayOrder").default(0),
  published: boolean("published").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ImpactMetric = typeof impactMetrics.$inferSelect;
export type InsertImpactMetric = typeof impactMetrics.$inferInsert;

// ─── 11. SITE SETTINGS (CMS) ──────────────────────────────────────
export const siteSettings = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("settingKey", { length: 255 }).notNull().unique(),
  value: text("settingValue"),
  type: mysqlEnum("settingType", ["text", "image", "json", "boolean", "number"]).default("text"),
  group: varchar("settingGroup", { length: 100 }).default("general"),
  label: varchar("settingLabel", { length: 255 }),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

// ─── 12. CMS CONTENT BLOCKS ───────────────────────────────────────
export const contentBlocks = mysqlTable("content_blocks", {
  id: serial("id").primaryKey(),
  key: varchar("blockKey", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  section: varchar("section", { length: 100 }).notNull(),
  type: mysqlEnum("blockType", ["text", "richtext", "image", "cta", "quote", "stats"]).default("text"),
  imageUrl: text("imageUrl"),
  ctaText: varchar("ctaText", { length: 255 }),
  ctaLink: varchar("ctaLink", { length: 255 }),
  displayOrder: int("displayOrder").default(0),
  published: boolean("published").default(true),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type InsertContentBlock = typeof contentBlocks.$inferInsert;

// ─── 13. ACTIVITY LOG (Audit trail) ───────────────────────────────
export const activityLog = mysqlTable("activity_log", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: bigint("entityId", { mode: "number", unsigned: true }),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;

// ═══════════════════════════════════════════════════════════════════
//  COMPETITION HOSTING SYSTEM
// ═══════════════════════════════════════════════════════════════════

// ─── 14. COMPETITION RULES (Configuration per event) ──────────────
export const competitionRules = mysqlTable("competition_rules", {
  id: serial("id").primaryKey(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }).notNull(),
  maxAttempts: int("maxAttempts").default(1),               // How many times can retry
  timeLimitMinutes: int("timeLimitMinutes").default(60),    // Timer per participant
  shuffleQuestions: boolean("shuffleQuestions").default(true),
  showCorrectAnswers: boolean("showCorrectAnswers").default(true),  // After submission
  passingScore: int("passingScore").default(60),            // Percentage to pass
  antiCheatEnabled: boolean("antiCheatEnabled").default(true),      // Tab switching detection
  preventCopyPaste: boolean("preventCopyPaste").default(true),
  fullscreenRequired: boolean("fullscreenRequired").default(false),
  allowReview: boolean("allowReview").default(true),        // Review answers after submit
  startWindowMinutes: int("startWindowMinutes").default(30),// Window to begin after registration
  published: boolean("published").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CompetitionRule = typeof competitionRules.$inferSelect;

// ─── 15. COMPETITION QUESTIONS ────────────────────────────────────
export const competitionQuestions = mysqlTable("competition_questions", {
  id: serial("id").primaryKey(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }).notNull(),
  questionType: mysqlEnum("questionType", [
    "multiple_choice",
    "multiple_select",
    "true_false",
    "short_answer",
    "essay",
    "coding",
    "fill_blank",
    "matching",
  ]).default("multiple_choice"),
  questionText: text("questionText").notNull(),
  questionImage: text("questionImage"),            // Optional image URL
  options: text("options"),                         // JSON array for MCQ options
  correctAnswer: text("correctAnswer"),             // JSON - correct answer(s)
  points: int("points").default(1),                 // Points for this question
  explanation: text("explanation"),                 // Explanation shown after submission
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium"),
  displayOrder: int("displayOrder").default(0),
  tags: text("tags"),                               // JSON array of tags
  published: boolean("published").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CompetitionQuestion = typeof competitionQuestions.$inferSelect;

// ─── 16. COMPETITION SESSIONS (Anti-cheat tracking) ───────────────
export const competitionSessions = mysqlTable("competition_sessions", {
  id: serial("id").primaryKey(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("sessionStatus", [
    "in_progress",
    "submitted",
    "timed_out",
    "abandoned",
    "flagged",
  ]).default("in_progress"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  submittedAt: timestamp("submittedAt"),
  score: int("score").default(0),
  maxPossibleScore: int("maxPossibleScore").default(0),
  percentage: int("percentage").default(0),
  passed: boolean("passed").default(false),
  tabSwitchCount: int("tabSwitchCount").default(0),       // Anti-cheat: tab switches
  copyPasteCount: int("copyPasteCount").default(0),       // Anti-cheat: copy/paste attempts
  fullscreenExits: int("fullscreenExits").default(0),     // Anti-cheat: fullscreen exits
  timeSpentSeconds: int("timeSpentSeconds").default(0),
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CompetitionSession = typeof competitionSessions.$inferSelect;

// ─── 17. COMPETITION SUBMISSIONS (Student answers) ────────────────
export const competitionSubmissions = mysqlTable("competition_submissions", {
  id: serial("id").primaryKey(),
  sessionId: bigint("sessionId", { mode: "number", unsigned: true }).notNull(),
  questionId: bigint("questionId", { mode: "number", unsigned: true }).notNull(),
  answer: text("answer").notNull(),                  // JSON - student's answer
  isCorrect: boolean("isCorrect").default(false),
  pointsEarned: int("pointsEarned").default(0),
  gradedBy: mysqlEnum("gradedBy", ["auto", "manual", "hybrid"]).default("auto"),
  graderNotes: text("graderNotes"),                 // For manual grading
  flaggedForReview: boolean("flaggedForReview").default(false),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type CompetitionSubmission = typeof competitionSubmissions.$inferSelect;

// ─── 18. COMPETITION LEADERBOARD ──────────────────────────────────
export const competitionLeaderboard = mysqlTable("competition_leaderboard", {
  id: serial("id").primaryKey(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }).notNull(),
  sessionId: bigint("sessionId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  score: int("score").notNull(),
  percentage: int("percentage").notNull(),
  timeSpentSeconds: int("timeSpentSeconds").default(0),
  passed: boolean("passed").default(false),
  rank: int("rank").default(0),
  tabSwitches: int("tabSwitches").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CompetitionLeaderboard = typeof competitionLeaderboard.$inferSelect;

// ─── 19. ADVISERS / MENTORS ───────────────────────────────────────
export const advisers = mysqlTable("advisers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  bio: text("bio"),
  expertise: text("expertise"),           // JSON array of expertise tags
  imageUrl: text("imageUrl"),
  linkedInUrl: text("linkedInUrl"),
  twitterUrl: text("twitterUrl"),
  websiteUrl: text("websiteUrl"),
  displayOrder: int("displayOrder").default(0),
  featured: boolean("featured").default(true),
  published: boolean("published").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Adviser = typeof advisers.$inferSelect;
export type InsertAdviser = typeof advisers.$inferInsert;
