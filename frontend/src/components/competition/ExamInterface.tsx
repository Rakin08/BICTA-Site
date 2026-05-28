"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Flag, Clock, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CompetitionQuestion, CompetitionRules } from "@/types/competition";

interface ExamInterfaceProps {
  questions: CompetitionQuestion[];
  rules: CompetitionRules;
  onSubmit: (answers: Record<string, string | string[]>) => void;
  timeRemaining: number; // seconds
}

function formatTime(seconds: number): string {
  if (seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamInterface({
  questions,
  rules,
  onSubmit,
  timeRemaining,
}: ExamInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = useCallback(
    (questionId: string, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const toggleFlag = useCallback((questionId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(answers);
  }, [answers, onSubmit]);

  const isLowTime = timeRemaining < 300; // 5 minutes
  const isCriticalTime = timeRemaining < 60; // 1 minute

  if (!currentQuestion) return null;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar — Question Navigator */}
      <div className="hidden lg:flex w-64 bg-bicta-surface border-r border-bicta-border flex-col">
        <div className="p-4 border-b border-bicta-border">
          <div className="flex items-center gap-2 mb-3">
            <Clock
              size={16}
              className={cn(
                isCriticalTime
                  ? "text-red-400 animate-pulse"
                  : isLowTime
                    ? "text-bicta-gold"
                    : "text-emerald-400"
              )}
            />
            <span
              className={cn(
                "font-mono text-lg font-medium",
                isCriticalTime
                  ? "text-red-400"
                  : isLowTime
                    ? "text-bicta-gold"
                    : "text-bicta-cream"
              )}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="text-xs font-body text-bicta-subtle">
            {answeredCount}/{totalQuestions} answered · {flagged.size} flagged
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, i) => {
              const isAnswered = !!answers[q.id];
              const isFlagged = flagged.has(q.id);
              const isCurrent = i === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "relative h-10 rounded-md font-mono text-xs font-medium transition-all",
                    isCurrent
                      ? "bg-bicta-gold text-bicta-void"
                      : isAnswered
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                        : isFlagged
                          ? "bg-bicta-gold/10 text-bicta-gold border border-bicta-gold/25"
                          : "bg-bicta-raised text-bicta-subtle border border-bicta-border"
                  )}
                >
                  {i + 1}
                  {isFlagged && (
                    <Flag size={8} className="absolute top-0.5 right-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-bicta-border">
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-bicta-gold text-bicta-void font-body font-medium text-xs uppercase tracking-wider rounded-lg hover:shadow-cta-glow transition-all"
          >
            <Send size={14} /> Submit Exam
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-bicta-surface border-b border-bicta-border">
          <span className="font-body text-xs text-bicta-subtle uppercase tracking-wider">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <div className="flex items-center gap-4 lg:hidden">
            <div className="flex items-center gap-1.5">
              <Clock
                size={14}
                className={isCriticalTime ? "text-red-400" : "text-bicta-gold"}
              />
              <span
                className={cn(
                  "font-mono text-sm",
                  isCriticalTime ? "text-red-400" : "text-bicta-cream"
                )}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <button
            onClick={() => toggleFlag(currentQuestion.id)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-body uppercase tracking-wider transition-colors",
              flagged.has(currentQuestion.id)
                ? "text-bicta-gold"
                : "text-bicta-subtle hover:text-bicta-muted"
            )}
          >
            <Flag size={14} />
            {flagged.has(currentQuestion.id) ? "Flagged" : "Flag"}
          </button>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Points */}
            <span className="inline-block px-2 py-0.5 bg-bicta-gold/10 border border-bicta-gold/20 rounded text-[0.6rem] uppercase tracking-wider text-bicta-gold font-body mb-4">
              {currentQuestion.points} point{currentQuestion.points !== 1 ? "s" : ""}
            </span>

            {/* Question Text */}
            <h2 className="font-display text-xl text-bicta-cream mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Answer Input */}
            <div className="space-y-3">
              {currentQuestion.type === "mcq" && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleAnswer(currentQuestion.id, String(i))
                      }
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg border font-body text-sm transition-all",
                        answers[currentQuestion.id] === String(i)
                          ? "bg-bicta-gold/10 border-bicta-gold text-bicta-cream"
                          : "bg-bicta-raised border-bicta-border text-bicta-muted hover:border-bicta-border-hover hover:text-bicta-cream"
                      )}
                    >
                      <span className="inline-block w-6 font-mono text-bicta-subtle text-xs">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === "true_false" && (
                <div className="flex gap-3">
                  {["True", "False"].map((val) => (
                    <button
                      key={val}
                      onClick={() =>
                        handleAnswer(currentQuestion.id, val.toLowerCase())
                      }
                      className={cn(
                        "flex-1 px-4 py-3 rounded-lg border font-body text-sm transition-all",
                        answers[currentQuestion.id] === val.toLowerCase()
                          ? "bg-bicta-gold/10 border-bicta-gold text-bicta-cream"
                          : "bg-bicta-raised border-bicta-border text-bicta-muted hover:border-bicta-border-hover"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}

              {(currentQuestion.type === "short_answer" ||
                currentQuestion.type === "essay") && (
                <textarea
                  value={(answers[currentQuestion.id] as string) || ""}
                  onChange={(e) =>
                    handleAnswer(currentQuestion.id, e.target.value)
                  }
                  placeholder="Type your answer here..."
                  rows={currentQuestion.type === "essay" ? 10 : 4}
                  className={cn(
                    "w-full bg-bicta-raised border border-bicta-border text-bicta-cream",
                    "font-body text-sm px-4 py-3 rounded-lg outline-none",
                    "focus:border-bicta-gold transition-colors resize-none",
                    "placeholder:text-bicta-subtle/40"
                  )}
                />
              )}

              {currentQuestion.type === "fill_in_blank" && (
                <input
                  type="text"
                  value={(answers[currentQuestion.id] as string) || ""}
                  onChange={(e) =>
                    handleAnswer(currentQuestion.id, e.target.value)
                  }
                  placeholder="Your answer"
                  className={cn(
                    "w-full bg-bicta-raised border border-bicta-border text-bicta-cream",
                    "font-body text-sm px-4 py-3 rounded-lg outline-none",
                    "focus:border-bicta-gold transition-colors",
                    "placeholder:text-bicta-subtle/40"
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between px-6 py-4 bg-bicta-surface border-t border-bicta-border">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg font-body text-sm transition-all",
              currentIndex === 0
                ? "text-bicta-subtle/30 pointer-events-none"
                : "text-bicta-muted hover:text-bicta-cream hover:bg-bicta-raised"
            )}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span className="font-mono text-xs text-bicta-subtle lg:hidden">
            {answeredCount}/{totalQuestions}
          </span>

          <button
            onClick={() =>
              setCurrentIndex((i) =>
                Math.min(totalQuestions - 1, i + 1)
              )
            }
            disabled={currentIndex === totalQuestions - 1}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg font-body text-sm transition-all",
              currentIndex === totalQuestions - 1
                ? "text-bicta-subtle/30 pointer-events-none"
                : "text-bicta-muted hover:text-bicta-cream hover:bg-bicta-raised"
            )}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-bicta-void/80 flex items-center justify-center p-4">
          <div className="bg-bicta-surface border border-bicta-border rounded-2xl p-8 max-w-md w-full">
            <h3 className="font-display text-xl text-bicta-cream mb-3">
              Submit Exam?
            </h3>
            <p className="font-body text-sm text-bicta-muted mb-2">
              You have answered {answeredCount} out of {totalQuestions}{" "}
              questions.
            </p>
            {answeredCount < totalQuestions && (
              <p className="font-body text-sm text-bicta-gold mb-6">
                {totalQuestions - answeredCount} question
                {totalQuestions - answeredCount !== 1 ? "s" : ""} unanswered.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-bicta-border text-bicta-muted font-body text-sm rounded-lg hover:border-bicta-gold/30 transition-colors"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 bg-bicta-gold text-bicta-void font-body font-medium text-sm rounded-lg hover:shadow-cta-glow transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
