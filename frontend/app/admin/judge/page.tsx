"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Gavel,
  Search,
  Trophy,
  ChevronRight,
  Star,
  Save,
  Crown,
  Medal,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubmissionForJudging, JudgeScore } from "@/types/competition";

// Demo submissions
const demoSubmissions: SubmissionForJudging[] = [
  {
    id: "sub-1",
    userName: "Rafi Ahmed",
    competitionTitle: "AI Olympiad 2026",
    submittedAt: "2026-05-27T10:30:00Z",
    score: 0,
    totalPoints: 30,
    status: "pending_review",
    answers: [
      { questionId: "q4", question: "Explain the difference between supervised and unsupervised learning.", type: "short_answer", answer: "Supervised learning uses labeled data to train models, where the algorithm learns from input-output pairs. Unsupervised learning works with unlabeled data to find hidden patterns or structures.", maxPoints: 3, autoScore: 0 },
      { questionId: "q7", question: "Describe how a CNN works.", type: "essay", answer: "A CNN (Convolutional Neural Network) processes data through convolutional layers that apply filters to detect features. It uses pooling layers to reduce dimensionality and fully connected layers for classification. Key components include kernels, feature maps, and activation functions.", maxPoints: 5, autoScore: 0 },
      { questionId: "q10", question: "What is the vanishing gradient problem?", type: "short_answer", answer: "The vanishing gradient problem occurs in deep networks when gradients become extremely small during backpropagation, causing early layers to learn very slowly. It can be mitigated using ReLU activations, residual connections, batch normalization, and careful weight initialization.", maxPoints: 3, autoScore: 0 },
    ],
  },
  {
    id: "sub-2",
    userName: "Nadia Rahman",
    competitionTitle: "AI Olympiad 2026",
    submittedAt: "2026-05-27T11:15:00Z",
    score: 0,
    totalPoints: 30,
    status: "pending_review",
    answers: [
      { questionId: "q4", question: "Explain the difference between supervised and unsupervised learning.", type: "short_answer", answer: "In supervised learning, the model is trained on labeled data (input-output pairs). In unsupervised learning, the model finds patterns in data without labels, like clustering or dimensionality reduction.", maxPoints: 3, autoScore: 0 },
      { questionId: "q7", question: "Describe how a CNN works.", type: "essay", answer: "CNNs use convolution operations to extract features from images. They consist of convolutional layers (apply filters), pooling layers (downsample), and fully connected layers. The network learns hierarchical features — edges in early layers, shapes in middle layers, and objects in deeper layers.", maxPoints: 5, autoScore: 0 },
      { questionId: "q10", question: "What is the vanishing gradient problem?", type: "short_answer", answer: "When gradients become too small in deep networks during backprop, causing weights in early layers to barely update. Solutions: ReLU, batch norm, skip connections.", maxPoints: 3, autoScore: 0 },
    ],
  },
  {
    id: "sub-3",
    userName: "Kamal Hossain",
    competitionTitle: "AI Olympiad 2026",
    submittedAt: "2026-05-27T09:45:00Z",
    score: 12,
    totalPoints: 30,
    status: "auto_graded",
    answers: [
      { questionId: "q4", question: "Explain the difference between supervised and unsupervised learning.", type: "short_answer", answer: "Supervised has labels, unsupervised doesn't.", maxPoints: 3, autoScore: 0 },
      { questionId: "q7", question: "Describe how a CNN works.", type: "essay", answer: "CNNs have layers that detect features in images using filters and pooling.", maxPoints: 5, autoScore: 0 },
      { questionId: "q10", question: "What is the vanishing gradient problem?", type: "short_answer", answer: "Gradients disappear in deep networks. Use ReLU to fix.", maxPoints: 3, autoScore: 0 },
    ],
  },
];

export default function JudgePanelPage() {
  const router = useRouter();
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "reviewed">("all");
  const [winnersDeclared, setWinnersDeclared] = useState(false);
  const [showDeclareConfirm, setShowDeclareConfirm] = useState(false);

  const filteredSubmissions = demoSubmissions.filter((sub) => {
    const matchesSearch = sub.userName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && sub.status === "pending_review") ||
      (filter === "reviewed" && sub.status !== "pending_review");
    return matchesSearch && matchesFilter;
  });

  const activeSubmission = demoSubmissions.find(
    (s) => s.id === selectedSubmission
  );

  const handleScoreChange = (answerId: string, score: number) => {
    setScores((prev) => ({ ...prev, [answerId]: score }));
  };

  const handleFeedbackChange = (answerId: string, feedback: string) => {
    setFeedbacks((prev) => ({ ...prev, [answerId]: feedback }));
  };

  const handleSaveScores = () => {
    // TODO: Submit to tRPC API
    console.log("Saving scores:", scores, feedbacks);
    alert("Scores saved!");
  };

  const handleDeclareWinners = () => {
    setWinnersDeclared(true);
    setShowDeclareConfirm(false);
  };

  // Calculate total scored points for active submission
  const getScoredPoints = (sub: SubmissionForJudging) => {
    return sub.answers.reduce((total, ans) => {
      const judgeScore = scores[`${sub.id}-${ans.questionId}`];
      return total + (judgeScore !== undefined ? judgeScore : (ans.autoScore || 0));
    }, 0);
  };

  return (
    <div className="min-h-screen bg-bicta-void">
      {/* Header */}
      <div className="bg-bicta-surface border-b border-bicta-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between" style={{ maxWidth: 1400 }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center">
              <Gavel size={20} className="text-bicta-gold" />
            </div>
            <div>
              <h1 className="font-display text-lg text-bicta-cream">Judge Panel</h1>
              <p className="font-body text-xs text-bicta-subtle">AI Olympiad 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDeclareConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-bicta-gold text-bicta-void font-body font-medium text-xs uppercase tracking-wider rounded-lg hover:shadow-cta-glow transition-all"
            >
              <Trophy size={14} /> Declare Winners
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6" style={{ maxWidth: 1400 }}>
        {/* Left — Submission List */}
        <div className="w-80 shrink-0 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bicta-subtle" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search participants..."
              className={cn(
                "w-full bg-bicta-raised border border-bicta-border text-bicta-cream",
                "font-body text-sm pl-9 pr-3 py-2.5 rounded-lg outline-none",
                "focus:border-bicta-gold transition-colors placeholder:text-bicta-subtle/40"
              )}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(["all", "pending", "reviewed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 text-xs font-body font-medium uppercase tracking-wider rounded-md transition-all border",
                  filter === f
                    ? "bg-bicta-gold/10 border-bicta-gold/25 text-bicta-gold"
                    : "bg-bicta-raised border-bicta-border text-bicta-subtle hover:text-bicta-muted"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Submission cards */}
          <div className="space-y-2">
            {filteredSubmissions.map((sub) => {
              const isActive = selectedSubmission === sub.id;
              const scored = getScoredPoints(sub);
              const isReviewed = sub.status !== "pending_review";

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all",
                    isActive
                      ? "bg-bicta-gold/5 border-bicta-gold/25"
                      : "bg-bicta-surface border-bicta-border hover:border-bicta-border-hover"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-sm font-medium text-bicta-cream">
                      {sub.userName}
                    </span>
                    <span
                      className={cn(
                        "text-[0.6rem] uppercase tracking-wider font-body px-2 py-0.5 rounded-full",
                        isReviewed
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-bicta-gold/10 text-bicta-gold"
                      )}
                    >
                      {isReviewed ? "Reviewed" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-bicta-subtle">
                      {scored} / {sub.totalPoints} pts
                    </span>
                    <span className="font-body text-[0.6rem] text-bicta-subtle">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right — Scoring Panel */}
        <div className="flex-1">
          {activeSubmission ? (
            <div className="space-y-6">
              {/* Participant Info */}
              <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl text-bicta-cream mb-1">
                      {activeSubmission.userName}
                    </h2>
                    <p className="font-body text-xs text-bicta-subtle">
                      Submitted: {new Date(activeSubmission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl text-bicta-gold">
                      {getScoredPoints(activeSubmission)}
                      <span className="text-sm text-bicta-subtle">
                        {" "}
                        / {activeSubmission.totalPoints}
                      </span>
                    </div>
                    <span className="font-body text-xs text-bicta-subtle">
                      {Math.round(
                        (getScoredPoints(activeSubmission) / activeSubmission.totalPoints) * 100
                      )}
                      % scored
                    </span>
                  </div>
                </div>
              </div>

              {/* Answers to Judge */}
              <div className="space-y-4">
                {activeSubmission.answers.map((ans, idx) => {
                  const scoreKey = `${activeSubmission.id}-${ans.questionId}`;
                  const currentScore = scores[scoreKey];
                  const hasScore = currentScore !== undefined;

                  return (
                    <div
                      key={ans.questionId}
                      className={cn(
                        "bg-bicta-surface border rounded-xl p-6",
                        hasScore
                          ? "border-emerald-500/20"
                          : "border-bicta-border"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-bicta-gold">
                            Q{idx + 1}
                          </span>
                          <span className="text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-body px-2 py-0.5 bg-bicta-raised rounded">
                            {ans.type}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-bicta-subtle">
                          Max: {ans.maxPoints} pts
                        </span>
                      </div>

                      <p className="font-display text-sm text-bicta-cream mb-3">
                        {ans.question}
                      </p>

                      <div className="bg-bicta-raised border border-bicta-border rounded-lg p-4 mb-4">
                        <span className="text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-body block mb-1.5">
                          Participant&apos;s Answer
                        </span>
                        <p className="font-body text-sm text-bicta-muted leading-relaxed">
                          {Array.isArray(ans.answer)
                            ? ans.answer.join(", ")
                            : ans.answer}
                        </p>
                      </div>

                      {/* Scoring */}
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <label className="block text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-body mb-1.5">
                            Score (0-{ans.maxPoints})
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={ans.maxPoints}
                            step={0.5}
                            value={hasScore ? currentScore : ""}
                            onChange={(e) =>
                              handleScoreChange(
                                scoreKey,
                                Math.min(
                                  ans.maxPoints,
                                  Math.max(0, parseFloat(e.target.value) || 0)
                                )
                              )
                            }
                            className={cn(
                              "w-24 bg-bicta-raised border text-bicta-cream font-mono text-sm",
                              "px-3 py-2 rounded-lg outline-none text-center",
                              hasScore
                                ? "border-emerald-500/30 focus:border-emerald-400"
                                : "border-bicta-border focus:border-bicta-gold"
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[0.6rem] uppercase tracking-wider text-bicta-subtle font-body mb-1.5">
                            Feedback (optional)
                          </label>
                          <input
                            type="text"
                            value={feedbacks[scoreKey] || ""}
                            onChange={(e) =>
                              handleFeedbackChange(scoreKey, e.target.value)
                            }
                            placeholder="Feedback for participant..."
                            className={cn(
                              "w-full bg-bicta-raised border border-bicta-border text-bicta-cream",
                              "font-body text-sm px-3 py-2 rounded-lg outline-none",
                              "focus:border-bicta-gold transition-colors placeholder:text-bicta-subtle/40"
                            )}
                          />
                        </div>
                        <div className="flex gap-1">
                          {[0, 0.5, 1].map((multiplier) => (
                            <button
                              key={multiplier}
                              onClick={() =>
                                handleScoreChange(
                                  scoreKey,
                                  ans.maxPoints * multiplier
                                )
                              }
                              className={cn(
                                "px-2 py-2 text-xs font-mono rounded border transition-all",
                                scores[scoreKey] === ans.maxPoints * multiplier
                                  ? "bg-bicta-gold/10 border-bicta-gold text-bicta-gold"
                                  : "bg-bicta-raised border-bicta-border text-bicta-subtle hover:border-bicta-border-hover"
                              )}
                              title={`${multiplier * 100}%`}
                            >
                              <Star
                                size={12}
                                className={
                                  multiplier > 0
                                    ? "text-bicta-gold"
                                    : "text-bicta-subtle"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveScores}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-bicta-gold text-bicta-void font-body font-medium text-sm uppercase tracking-wider rounded-lg hover:shadow-cta-glow transition-all"
              >
                <Save size={16} /> Save Scores
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Gavel size={40} className="text-bicta-subtle/20 mb-4" />
              <p className="font-body text-sm text-bicta-subtle">
                Select a submission from the left panel to begin scoring.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Declare Winners Modal */}
      {showDeclareConfirm && (
        <div className="fixed inset-0 z-50 bg-bicta-void/80 flex items-center justify-center p-4">
          <div className="bg-bicta-surface border border-bicta-border rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <Trophy size={24} className="text-bicta-gold" />
              <h3 className="font-display text-xl text-bicta-cream">
                Declare Winners
              </h3>
            </div>
            <p className="font-body text-sm text-bicta-muted mb-6">
              This will finalize scores and publish the leaderboard. Participants
              will be notified of their results. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeclareConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-bicta-border text-bicta-muted font-body text-sm rounded-lg hover:border-bicta-gold/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclareWinners}
                className="flex-1 px-4 py-2.5 bg-bicta-gold text-bicta-void font-body font-medium text-sm rounded-lg hover:shadow-cta-glow transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Winners Declared Overlay */}
      {winnersDeclared && (
        <div className="fixed inset-0 z-50 bg-bicta-void flex items-center justify-center p-4">
          <div className="bg-bicta-surface border border-bicta-border rounded-2xl p-8 md:p-12 max-w-lg w-full text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center">
                <Crown size={28} className="text-bicta-gold" />
              </div>
            </div>

            <h2 className="font-display text-2xl text-bicta-cream mb-2">
              Winners Declared
            </h2>
            <p className="font-body text-sm text-bicta-muted mb-8">
              The leaderboard has been published and participants have been
              notified.
            </p>

            {/* Top 3 */}
            <div className="flex items-end justify-center gap-4 mb-8">
              {[
                { rank: 2, icon: Medal, name: "Nadia Rahman", score: "18/30", color: "text-gray-300" },
                { rank: 1, icon: Crown, name: "Rafi Ahmed", score: "24/30", color: "text-bicta-gold" },
                { rank: 3, icon: Award, name: "Kamal Hossain", score: "12/30", color: "text-amber-600" },
              ].map((w) => (
                <div
                  key={w.rank}
                  className={cn(
                    "flex flex-col items-center",
                    w.rank === 1 ? "order-2" : w.rank === 2 ? "order-1" : "order-3"
                  )}
                  style={{ marginTop: w.rank === 1 ? 0 : 24 }}
                >
                  <w.icon size={w.rank === 1 ? 32 : 24} className={w.color} />
                  <div
                    className={cn(
                      "mt-2 px-3 py-1 rounded-full font-mono text-xs font-medium",
                      w.rank === 1
                        ? "bg-bicta-gold/15 text-bicta-gold"
                        : "bg-bicta-raised text-bicta-subtle"
                    )}
                  >
                    #{w.rank}
                  </div>
                  <span className="font-body text-xs text-bicta-cream mt-1.5">
                    {w.name}
                  </span>
                  <span className="font-mono text-xs text-bicta-subtle">
                    {w.score}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setWinnersDeclared(false);
                router.push("/admin/competitions");
              }}
              className="w-full px-6 py-3 bg-bicta-gold text-bicta-void font-body font-medium text-sm uppercase tracking-wider rounded-lg hover:shadow-cta-glow transition-all"
            >
              Go to Competitions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
