import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  competitionRules, competitionQuestions,
  competitionSessions, competitionSubmissions,
  competitionLeaderboard, events,
} from "@db/schema";
import { eq, desc, count, and, sql, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { acquireLock, releaseLock } from "./lib/cache";

// ═══════════════════════════════════════════════════════════════
//  COMPETITION HOSTING ROUTER
// ═══════════════════════════════════════════════════════════════
export const competitionRouter = createRouter({

  // ─── ADMIN: Get Competition Config ──────────────────
  getConfig: adminQuery
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(competitionRules).where(eq(competitionRules.eventId, input.eventId)).limit(1);
      return result[0] ?? null;
    }),

  // ─── ADMIN: Set Competition Config ──────────────────
  setConfig: adminQuery
    .input(z.object({
      eventId: z.number(),
      maxAttempts: z.number().min(1).max(10).optional(),
      timeLimitMinutes: z.number().min(5).max(300).optional(),
      shuffleQuestions: z.boolean().optional(),
      showCorrectAnswers: z.boolean().optional(),
      passingScore: z.number().min(0).max(100).optional(),
      antiCheatEnabled: z.boolean().optional(),
      preventCopyPaste: z.boolean().optional(),
      fullscreenRequired: z.boolean().optional(),
      allowReview: z.boolean().optional(),
      startWindowMinutes: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { eventId, ...data } = input;
      const existing = await db.select().from(competitionRules).where(eq(competitionRules.eventId, eventId)).limit(1);
      if (existing[0]) {
        await db.update(competitionRules).set(data).where(eq(competitionRules.id, existing[0].id));
        return { success: true, id: existing[0].id };
      } else {
        const result = await db.insert(competitionRules).values({ ...data, eventId, published: true });
        return { success: true, id: Number(result[0].insertId) };
      }
    }),

  // ─── ADMIN: List Questions for Event ────────────────
  listQuestions: adminQuery
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(competitionQuestions)
        .where(eq(competitionQuestions.eventId, input.eventId))
        .orderBy(asc(competitionQuestions.displayOrder));
    }),

  // ─── ADMIN: Create Question ─────────────────────────
  createQuestion: adminQuery
    .input(z.object({
      eventId: z.number(),
      questionType: z.enum(["multiple_choice", "multiple_select", "true_false", "short_answer", "essay", "coding", "fill_blank", "matching"]).default("multiple_choice"),
      questionText: z.string().min(1),
      questionImage: z.string().optional(),
      options: z.string().optional(),
      correctAnswer: z.string().optional(),
      points: z.number().min(1).max(100).default(1),
      explanation: z.string().optional(),
      difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
      displayOrder: z.number().default(0),
      tags: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(competitionQuestions).values(input);
      return { success: true, id: Number(result[0].insertId) };
    }),

  // ─── ADMIN: Bulk Create Questions ───────────────────
  bulkCreateQuestions: adminQuery
    .input(z.object({
      eventId: z.number(),
      questions: z.array(z.object({
        questionType: z.enum(["multiple_choice", "multiple_select", "true_false", "short_answer", "essay", "coding", "fill_blank", "matching"]).default("multiple_choice"),
        questionText: z.string().min(1),
        options: z.string().optional(),
        correctAnswer: z.string().optional(),
        points: z.number().min(1).max(100).default(1),
        explanation: z.string().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
        displayOrder: z.number().default(0),
      })).max(100),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const values = input.questions.map((q, i) => ({ ...q, eventId: input.eventId, displayOrder: i }));
      await db.insert(competitionQuestions).values(values);
      return { success: true, count: values.length };
    }),

  // ─── ADMIN: Update Question ─────────────────────────
  updateQuestion: adminQuery
    .input(z.object({
      id: z.number(),
      questionText: z.string().optional(),
      questionType: z.enum(["multiple_choice", "multiple_select", "true_false", "short_answer", "essay", "coding", "fill_blank", "matching"]).optional(),
      options: z.string().optional(),
      correctAnswer: z.string().optional(),
      points: z.number().optional(),
      explanation: z.string().optional(),
      difficulty: z.enum(["easy", "medium", "hard"]).optional(),
      displayOrder: z.number().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(competitionQuestions).set(data).where(eq(competitionQuestions.id, id));
      return { success: true };
    }),

  // ─── ADMIN: Delete Question ─────────────────────────
  deleteQuestion: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(competitionQuestions).where(eq(competitionQuestions.id, input.id));
      return { success: true };
    }),

  // ─── ADMIN: List Sessions ───────────────────────────
  listSessions: adminQuery
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(competitionSessions)
        .where(eq(competitionSessions.eventId, input.eventId))
        .orderBy(desc(competitionSessions.score));
    }),

  // ─── ADMIN: Update Submission Grade ─────────────────
  gradeSubmission: adminQuery
    .input(z.object({
      submissionId: z.number(),
      pointsEarned: z.number().min(0),
      graderNotes: z.string().optional(),
      isCorrect: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(competitionSubmissions).set({
        pointsEarned: input.pointsEarned,
        isCorrect: input.isCorrect,
        graderNotes: input.graderNotes ?? null,
        gradedBy: "manual",
      }).where(eq(competitionSubmissions.id, input.submissionId));
      return { success: true };
    }),

  // ─── ADMIN: Get Session Detail ──────────────────────
  sessionDetail: adminQuery
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [session, answers] = await Promise.all([
        db.select().from(competitionSessions).where(eq(competitionSessions.id, input.sessionId)).limit(1),
        db.select().from(competitionSubmissions).where(eq(competitionSubmissions.sessionId, input.sessionId)),
      ]);
      return { session: session[0] ?? null, answers };
    }),

  // ═══════════════════════════════════════════════════
  //  PUBLIC / STUDENT ENDPOINTS
  // ═══════════════════════════════════════════════════

  // ─── PUBLIC: Get Questions (for exam, no answers) ───
  getExam: publicQuery
    .input(z.object({ eventId: z.number(), email: z.string().email() }))
    .query(async ({ input }) => {
      const db = getDb();

      // Check if event exists and is open
      const eventData = await db.select().from(events).where(eq(events.id, input.eventId)).limit(1);
      if (!eventData[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      if (eventData[0].status !== "registration_open" && eventData[0].status !== "live") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Competition is not open" });
      }

      // Get competition config
      const configResult = await db.select().from(competitionRules).where(eq(competitionRules.eventId, input.eventId)).limit(1);
      const config = configResult[0];

      // Check for existing session
      const existingSession = await db
        .select()
        .from(competitionSessions)
        .where(and(
          eq(competitionSessions.eventId, input.eventId),
          eq(competitionSessions.email, input.email),
        ))
        .orderBy(desc(competitionSessions.createdAt))
        .limit(1);

      // If already submitted, return result
      if (existingSession[0]?.status === "submitted" || existingSession[0]?.status === "timed_out") {
        return {
          status: "already_submitted",
          session: existingSession[0],
          message: "You have already completed this competition.",
        };
      }

      // Get questions (strip correct answers)
      const questions = await db
        .select({
          id: competitionQuestions.id,
          questionType: competitionQuestions.questionType,
          questionText: competitionQuestions.questionText,
          questionImage: competitionQuestions.questionImage,
          options: competitionQuestions.options,
          points: competitionQuestions.points,
          difficulty: competitionQuestions.difficulty,
          displayOrder: competitionQuestions.displayOrder,
        })
        .from(competitionQuestions)
        .where(and(
          eq(competitionQuestions.eventId, input.eventId),
          eq(competitionQuestions.published, true),
        ))
        .orderBy(asc(competitionQuestions.displayOrder));

      // Calculate total possible score
      const totalPoints = questions.reduce((sum, q) => sum + (q.points ?? 1), 0);

      return {
        status: "ready",
        event: eventData[0],
        config,
        questions,
        totalPoints,
        existingSession: existingSession[0] ?? null,
      };
    }),

  // ─── PUBLIC: Start Competition Session ──────────────
  startSession: publicQuery
    .input(z.object({
      eventId: z.number(),
      name: z.string().min(1),
      email: z.string().email(),
      ipAddress: z.string().optional(),
      userAgent: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Get config for max score
      const questions = await db
        .select({ points: competitionQuestions.points })
        .from(competitionQuestions)
        .where(and(
          eq(competitionQuestions.eventId, input.eventId),
          eq(competitionQuestions.published, true),
        ));
      const totalPoints = questions.reduce((s, q) => s + (q.points ?? 1), 0);

      // Create session
      const result = await db.insert(competitionSessions).values({
        eventId: input.eventId,
        name: input.name,
        email: input.email,
        maxPossibleScore: totalPoints,
        status: "in_progress",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      });

      return { success: true, sessionId: Number(result[0].insertId) };
    }),

  // ─── PUBLIC: Submit Answer ──────────────────────────
  submitAnswer: publicQuery
    .input(z.object({
      sessionId: z.number(),
      questionId: z.number(),
      answer: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Get question with correct answer
      const question = await db
        .select()
        .from(competitionQuestions)
        .where(eq(competitionQuestions.id, input.questionId))
        .limit(1);
      if (!question[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Question not found" });

      // Auto-grade
      let isCorrect = false;
      let pointsEarned = 0;
      const qType = question[0].questionType;

      if (qType === "multiple_choice" || qType === "true_false") {
        try {
          const correct = JSON.parse(question[0].correctAnswer || "[]");
          const given = JSON.parse(input.answer);
          isCorrect = correct === given || (Array.isArray(correct) && correct.includes(given));
        } catch {
          isCorrect = question[0].correctAnswer === input.answer;
        }
      } else if (qType === "multiple_select") {
        try {
          const correct = JSON.parse(question[0].correctAnswer || "[]").sort();
          const given = JSON.parse(input.answer || "[]").sort();
          isCorrect = JSON.stringify(correct) === JSON.stringify(given);
        } catch {
          isCorrect = false;
        }
      } else if (qType === "short_answer" || qType === "fill_blank") {
        // Case-insensitive exact match for auto-grading
        const correct = (question[0].correctAnswer || "").toLowerCase().trim();
        const given = input.answer.toLowerCase().trim();
        isCorrect = correct === given;
      }
      // essay, coding require manual grading

      if (isCorrect) pointsEarned = question[0].points ?? 1;

      await db.insert(competitionSubmissions).values({
        sessionId: input.sessionId,
        questionId: input.questionId,
        answer: input.answer,
        isCorrect,
        pointsEarned,
        gradedBy: (qType === "essay" || qType === "coding") ? "manual" : "auto",
      });

      return { success: true, isCorrect, pointsEarned };
    }),

  // ─── PUBLIC: Submit All (Finish Competition) ────────
  finishCompetition: publicQuery
    .input(z.object({
      sessionId: z.number(),
      antiCheatData: z.object({
        tabSwitches: z.number().default(0),
        copyPasteAttempts: z.number().default(0),
        fullscreenExits: z.number().default(0),
        timeSpentSeconds: z.number().default(0),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      const lockKey = `lock:finish:${input.sessionId}`;
      const lockAcquired = await acquireLock(lockKey, 10);
      if (!lockAcquired) throw new TRPCError({ code: "CONFLICT", message: "Submission in progress" });

      try {
        const db = getDb();

        // Calculate score
        const answers = await db
          .select()
          .from(competitionSubmissions)
          .where(eq(competitionSubmissions.sessionId, input.sessionId));
        const totalScore = answers.reduce((s, a) => s + (a.pointsEarned ?? 0), 0);

        // Get session
        const sessionData = await db
          .select()
          .from(competitionSessions)
          .where(eq(competitionSessions.id, input.sessionId))
          .limit(1);
        const session = sessionData[0];
        if (!session) throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });

        const maxScore = session.maxPossibleScore || 1;
        const percentage = Math.round((totalScore / maxScore) * 100);

        // Get config for passing score
        const configResult = await db
          .select()
          .from(competitionRules)
          .where(eq(competitionRules.eventId, session.eventId))
          .limit(1);
        const passingScore = configResult[0]?.passingScore ?? 60;
        const passed = percentage >= passingScore;

        // Anti-cheat status
        const tabSwitches = input.antiCheatData?.tabSwitches ?? 0;
        const sessionStatus = tabSwitches > 5 ? "flagged" : "submitted";

        // Update session
        await db.update(competitionSessions).set({
          status: sessionStatus as any,
          submittedAt: new Date(),
          score: totalScore,
          percentage,
          passed,
          tabSwitchCount: tabSwitches,
          copyPasteCount: input.antiCheatData?.copyPasteAttempts ?? 0,
          fullscreenExits: input.antiCheatData?.fullscreenExits ?? 0,
          timeSpentSeconds: input.antiCheatData?.timeSpentSeconds ?? 0,
        }).where(eq(competitionSessions.id, input.sessionId));

        // Add to leaderboard
        await db.insert(competitionLeaderboard).values({
          eventId: session.eventId,
          sessionId: input.sessionId,
          name: session.name,
          email: session.email,
          score: totalScore,
          percentage,
          timeSpentSeconds: input.antiCheatData?.timeSpentSeconds ?? 0,
          passed,
          tabSwitches,
        });

        return {
          success: true,
          score: totalScore,
          maxScore,
          percentage,
          passed,
          status: sessionStatus,
        };
      } finally {
        await releaseLock(lockKey);
      }
    }),

  // ─── PUBLIC: Update Anti-Cheat Metrics ──────────────
  updateAntiCheat: publicQuery
    .input(z.object({
      sessionId: z.number(),
      tabSwitches: z.number().optional(),
      copyPasteAttempts: z.number().optional(),
      fullscreenExits: z.number().optional(),
      timeSpentSeconds: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { sessionId, ...data } = input;
      await db.update(competitionSessions).set(data).where(eq(competitionSessions.id, sessionId));
      return { success: true };
    }),

  // ─── PUBLIC: Get Leaderboard ────────────────────────
  getLeaderboard: publicQuery
    .input(z.object({ eventId: z.number(), limit: z.number().min(1).max(100).optional().default(50) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(competitionLeaderboard)
        .where(eq(competitionLeaderboard.eventId, input.eventId))
        .orderBy(desc(competitionLeaderboard.score), asc(competitionLeaderboard.timeSpentSeconds))
        .limit(input.limit);
    }),

  // ─── PUBLIC: Get My Result ──────────────────────────
  myResult: publicQuery
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();

      const [session, answers, questions] = await Promise.all([
        db.select().from(competitionSessions).where(eq(competitionSessions.id, input.sessionId)).limit(1),
        db.select().from(competitionSubmissions).where(eq(competitionSubmissions.sessionId, input.sessionId)),
        db.select().from(competitionQuestions).where(
          sql`id IN (SELECT questionId FROM competition_submissions WHERE sessionId = ${input.sessionId})`
        ),
      ]);

      // Build review data
      const reviewData = answers.map((ans) => {
        const q = questions.find((qq) => qq.id === ans.questionId);
        return {
          ...ans,
          questionText: q?.questionText ?? "",
          questionType: q?.questionType ?? "",
          correctAnswer: q?.correctAnswer ?? null,
          explanation: q?.explanation ?? null,
          options: q?.options ?? null,
        };
      });

      return {
        session: session[0] ?? null,
        answers: reviewData,
      };
    }),

  // ─── PUBLIC: Check Competition Status ───────────────
  checkStatus: publicQuery
    .input(z.object({ eventId: z.number(), email: z.string().email() }))
    .query(async ({ input }) => {
      const db = getDb();
      const sessions = await db
        .select()
        .from(competitionSessions)
        .where(and(
          eq(competitionSessions.eventId, input.eventId),
          eq(competitionSessions.email, input.email),
        ))
        .orderBy(desc(competitionSessions.createdAt))
        .limit(1);

      if (!sessions[0]) return { status: "not_started" };
      return { status: sessions[0].status, sessionId: sessions[0].id, score: sessions[0].score, percentage: sessions[0].percentage };
    }),

  // ─── ADMIN: Get Question Count ──────────────────────
  questionCount: adminQuery
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select({ count: count() })
        .from(competitionQuestions)
        .where(eq(competitionQuestions.eventId, input.eventId));
      const totalPoints = await db
        .select({ total: sql`SUM(${competitionQuestions.points})` })
        .from(competitionQuestions)
        .where(eq(competitionQuestions.eventId, input.eventId));
      return {
        count: result[0]?.count ?? 0,
        totalPoints: Number(totalPoints[0]?.total ?? 0),
      };
    }),
});
