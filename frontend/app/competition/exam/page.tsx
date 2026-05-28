"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Video, ArrowRight } from "lucide-react";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import AntiCheatMonitor from "@/components/competition/AntiCheatMonitor";
import ExamInterface from "@/components/competition/ExamInterface";
import DisqualifiedOverlay from "@/components/competition/DisqualifiedOverlay";
import type { CompetitionQuestion, CompetitionRules } from "@/types/competition";

// Demo data — in production, fetch from tRPC API
const demoRules: CompetitionRules = {
  id: "demo-1",
  title: "AI Olympiad 2026",
  description: "Test your AI and machine learning knowledge",
  duration: 60, // 60 minutes
  totalQuestions: 20,
  passingScore: 60,
  maxViolations: 3,
  tabSwitchWarning: true,
  cameraRequired: true,
  fullscreenRequired: true,
  randomizeQuestions: false,
  showResults: true,
};

const demoQuestions: CompetitionQuestion[] = [
  {
    id: "q1",
    type: "mcq",
    question: "Which algorithm is best suited for classification problems with non-linear boundaries?",
    options: ["Linear Regression", "Decision Tree", "K-Means Clustering", "Principal Component Analysis"],
    correctAnswer: "1",
    points: 2,
  },
  {
    id: "q2",
    type: "mcq",
    question: "What is the purpose of dropout in neural networks?",
    options: ["Speed up training", "Prevent overfitting", "Increase model capacity", "Reduce memory usage"],
    correctAnswer: "1",
    points: 2,
  },
  {
    id: "q3",
    type: "true_false",
    question: "Gradient descent always converges to the global minimum.",
    correctAnswer: "false",
    points: 1,
  },
  {
    id: "q4",
    type: "short_answer",
    question: "Explain the difference between supervised and unsupervised learning in 2-3 sentences.",
    points: 3,
  },
  {
    id: "q5",
    type: "mcq",
    question: "Which activation function is most commonly used in the hidden layers of deep neural networks?",
    options: ["Sigmoid", "Tanh", "ReLU", "Softmax"],
    correctAnswer: "2",
    points: 2,
  },
  {
    id: "q6",
    type: "fill_in_blank",
    question: "The _______ algorithm is used to reduce the dimensionality of data while preserving variance.",
    correctAnswer: "PCA",
    points: 2,
  },
  {
    id: "q7",
    type: "essay",
    question: "Describe how a convolutional neural network (CNN) works and explain its key components.",
    points: 5,
  },
  {
    id: "q8",
    type: "mcq",
    question: "What does 'bias' in a neural network refer to?",
    options: [
      "The error rate of the model",
      "A constant added to the weighted sum of inputs",
      "The tendency to overfit",
      "The learning rate of the optimizer",
    ],
    correctAnswer: "1",
    points: 2,
  },
  {
    id: "q9",
    type: "true_false",
    question: "Batch normalization helps in reducing internal covariate shift.",
    correctAnswer: "true",
    points: 1,
  },
  {
    id: "q10",
    type: "short_answer",
    question: "What is the vanishing gradient problem and how can it be mitigated?",
    points: 3,
  },
];

type ExamPhase = "rules" | "setup" | "exam" | "submitted";

export default function CompetitionExamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<ExamPhase>("rules");
  const [timeRemaining, setTimeRemaining] = useState(demoRules.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const { state, actions, videoRef, canvasRef } = useAntiCheat({
    maxViolations: demoRules.maxViolations,
    enableCamera: demoRules.cameraRequired,
    enableFullscreen: demoRules.fullscreenRequired,
    onDisqualified: (reason) => {
      console.error("Disqualified:", reason);
    },
    onViolation: (v) => {
      console.warn("Violation:", v);
    },
  });

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit on time expiry
          handleSubmit({});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const handleStartExam = useCallback(() => {
    setPhase("exam");
    actions.startMonitoring();
  }, [actions]);

  const handleSubmit = useCallback(
    (answers: Record<string, string | string[]>) => {
      actions.stopMonitoring();
      setSubmitted(true);
      setPhase("submitted");

      // Calculate score
      let score = 0;
      demoQuestions.forEach((q) => {
        const ans = answers[q.id];
        if (!ans) return;
        if (q.type === "mcq" || q.type === "true_false" || q.type === "fill_in_blank") {
          if (ans === q.correctAnswer) score += q.points;
        }
      });
      setFinalScore(score);

      // TODO: Submit to tRPC API
      console.log("Submitting answers:", answers);
    },
    [actions]
  );

  // Rules page
  if (phase === "rules") {
    return (
      <div className="min-h-screen bg-bicta-void flex items-center justify-center p-4">
        <div className="bg-bicta-surface border border-bicta-border rounded-2xl p-8 md:p-12 max-w-2xl w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center">
              <Shield size={24} className="text-bicta-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-bicta-cream">
                {demoRules.title}
              </h1>
              <p className="font-body text-sm text-bicta-muted">
                {demoRules.description}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="font-body font-medium text-sm uppercase tracking-wider text-bicta-gold">
              Rules & Guidelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Lock, label: "Fullscreen Required", desc: "Exam runs in fullscreen. Exiting = violation." },
                { icon: Video, label: "Camera Monitoring", desc: "Your face must remain visible at all times." },
                { icon: Shield, label: `${demoRules.maxViolations} Max Violations`, desc: "Tab switch, copy/paste, etc. auto-logged." },
                { label: "Duration", desc: `${demoRules.duration} minutes` },
                { label: "Questions", desc: `${demoQuestions.length} questions` },
                { label: "Passing Score", desc: `${demoRules.passingScore}%` },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-bicta-raised rounded-lg p-3"
                >
                  {item.icon && (
                    <item.icon size={16} className="text-bicta-gold mt-0.5 shrink-0" />
                  )}
                  <div>
                    <span className="font-body text-xs font-medium text-bicta-cream block">
                      {item.label}
                    </span>
                    <span className="font-body text-xs text-bicta-subtle">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-4">
              <h3 className="font-body text-xs font-medium text-red-400 uppercase tracking-wider mb-2">
                You will be disqualified for:
              </h3>
              <ul className="space-y-1.5">
                {[
                  "Switching browser tabs or windows",
                  "Exiting fullscreen mode",
                  "Copying or pasting content",
                  "Right-clicking on the exam page",
                  "Turning off your camera",
                  "Face not visible for extended periods",
                  "Opening developer tools (F12)",
                ].map((rule, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-body text-red-300/80">
                    <span className="text-red-400">×</span> {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              className="accent-bicta-gold w-4 h-4"
            />
            <span className="font-body text-sm text-bicta-muted">
              I understand and agree to the exam rules. I will maintain
              academic integrity throughout the exam.
            </span>
          </label>

          <button
            onClick={() => setPhase("setup")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-bicta-gold text-bicta-void font-body font-medium text-sm uppercase tracking-wider rounded-lg hover:shadow-cta-glow transition-all"
          >
            Start Exam Setup
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Setup page
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-bicta-void flex items-center justify-center p-4">
        <div className="bg-bicta-surface border border-bicta-border rounded-2xl p-8 md:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center mx-auto mb-6">
            <Video size={28} className="text-bicta-gold" />
          </div>
          <h2 className="font-display text-2xl text-bicta-cream mb-3">
            System Check
          </h2>
          <p className="font-body text-sm text-bicta-muted mb-8">
            Before starting, we need to enable fullscreen mode and access your
            camera for proctoring.
          </p>

          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-center gap-3 bg-bicta-raised rounded-lg p-3">
              <Lock size={16} className="text-bicta-gold" />
              <div>
                <span className="font-body text-sm text-bicta-cream block">
                  Fullscreen Mode
                </span>
                <span className="font-body text-xs text-bicta-subtle">
                  Will be enabled when exam starts
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-bicta-raised rounded-lg p-3">
              <Video size={16} className="text-bicta-gold" />
              <div>
                <span className="font-body text-sm text-bicta-cream block">
                  Camera Access
                </span>
                <span className="font-body text-xs text-bicta-subtle">
                  Face must be visible throughout exam
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-bicta-gold text-bicta-void font-body font-medium text-sm uppercase tracking-wider rounded-lg hover:shadow-cta-glow transition-all"
          >
            <Shield size={16} /> Begin Exam
          </button>
        </div>
      </div>
    );
  }

  // Submitted page
  if (phase === "submitted") {
    return (
      <div className="min-h-screen bg-bicta-void flex items-center justify-center p-4">
        <div className="bg-bicta-surface border border-bicta-border rounded-2xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Shield size={28} className="text-emerald-400" />
          </div>
          <h2 className="font-display text-2xl text-bicta-cream mb-2">
            Exam Submitted
          </h2>
          <p className="font-body text-sm text-bicta-muted mb-6">
            Your answers have been recorded. Results will be published after
            manual review.
          </p>

          {demoRules.showResults && (
            <div className="bg-bicta-raised rounded-xl p-6 mb-6">
              <span className="font-body text-xs uppercase tracking-wider text-bicta-subtle block mb-2">
                Auto-Graded Score
              </span>
              <span className="font-mono text-4xl text-bicta-gold">
                {finalScore}
              </span>
              <span className="font-body text-sm text-bicta-subtle">
                {" "}
                / {demoQuestions.reduce((s, q) => s + q.points, 0)} points
              </span>
            </div>
          )}

          <div className="text-xs font-body text-bicta-subtle mb-6">
            Violations logged: {state.violationCount}
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 bg-bicta-gold text-bicta-void font-body font-medium text-sm uppercase tracking-wider rounded-lg hover:shadow-cta-glow transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Exam phase
  return (
    <div className="min-h-screen bg-bicta-void">
      {/* Disqualified overlay */}
      {state.isDisqualified && (
        <DisqualifiedOverlay
          reason={state.disqualificationReason}
          violations={state.violations}
          onExit={() => router.push("/")}
        />
      )}

      {/* Anti-cheat monitor (hidden camera overlay) */}
      <AntiCheatMonitor
        state={state}
        videoRef={videoRef}
        canvasRef={canvasRef}
        maxViolations={demoRules.maxViolations}
      />

      {/* Exam Interface */}
      <ExamInterface
        questions={demoQuestions}
        rules={demoRules}
        onSubmit={handleSubmit}
        timeRemaining={timeRemaining}
      />
    </div>
  );
}
