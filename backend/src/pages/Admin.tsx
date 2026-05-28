import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  LayoutDashboard, Calendar, BookOpen, Users, Mic, Medal,
  Handshake, Mail, Settings, FileText, ChevronLeft,
  Plus, Pencil, Trash2, Save, Search, Activity, Zap,
  CheckCircle, XCircle, AlertTriangle, Loader2, BarChart3,
  TrendingUp, Layers, X, Trophy, Upload, FileUp, Timer,
  Shield, Lock
} from "lucide-react";

/* ─── Toast System ───────────────────────────────────────────── */
interface Toast { id: number; message: string; type: "success" | "error" | "info"; }
let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);
  const remove = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed top-16 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-4 py-3 rounded border text-xs font-medium transition-all duration-300 animate-slideIn ${
            t.type === "success" ? "bg-green-950/90 border-green-700 text-green-300" :
            t.type === "error" ? "bg-red-950/90 border-red-700 text-red-300" :
            "bg-[#1a1a1a] border-[rgba(201,168,76,0.3)] text-[#e8d49a]"
          }`}
          style={{ backdropFilter: "blur(8px)" }}
        >
          {t.type === "success" && <CheckCircle size={14} />}
          {t.type === "error" && <XCircle size={14} />}
          {t.type === "info" && <AlertTriangle size={14} />}
          {t.message}
          <button onClick={() => remove(t.id)} className="ml-2 opacity-50 hover:opacity-100"><X size={12} /></button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}

/* ─── Skeleton Loader ────────────────────────────────────────── */
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <div className="flex gap-4 px-4 py-3 border-b border-[rgba(201,168,76,0.05)]">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="flex-1 h-4 bg-[rgba(201,168,76,0.06)] rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

function SkeletonCards({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#1a1a1a] border border-[rgba(201,168,76,0.06)] p-5 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="h-3 bg-[rgba(201,168,76,0.08)] rounded mb-3 w-1/2" />
          <div className="h-8 bg-[rgba(201,168,76,0.08)] rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

/* ─── Tab Config ─────────────────────────────────────────────── */
const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Events", icon: Calendar },
  { id: "competitions", label: "Competitions", icon: Trophy },
  { id: "programs", label: "Programs", icon: BookOpen },
  { id: "alumni", label: "Alumni", icon: Users },
  { id: "speakers", label: "Speakers", icon: Mic },
  { id: "advisers", label: "Advisers", icon: Medal },
  { id: "partners", label: "Partners", icon: Handshake },
  { id: "contacts", label: "Contacts", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "content", label: "Content", icon: FileText },
  { id: "monitoring", label: "System", icon: Activity },
];

/* ─── Status Color Helper ────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════
   COMPETITIONS TAB (Question Builder, Bulk Upload, Sessions)
   ═══════════════════════════════════════════════════════════════ */
function CompetitionsTab({ toast }: { toast: (m: string, t?: any) => void }) {
  const utils = trpc.useUtils();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [viewTab, setViewTab] = useState<"questions" | "sessions" | "leaderboard">("questions");
  const [bulkText, setBulkText] = useState("");

  const { data: eventsList } = trpc.event.list.useQuery({ eventType: "competition", limit: 100 });
  const { data: config } = trpc.competition.getConfig.useQuery(
    { eventId: selectedEventId! },
    { enabled: !!selectedEventId }
  );
  const { data: questions, isLoading: qLoading } = trpc.competition.listQuestions.useQuery(
    { eventId: selectedEventId! },
    { enabled: !!selectedEventId }
  );
  const { data: sessions } = trpc.competition.listSessions.useQuery(
    { eventId: selectedEventId! },
    { enabled: !!selectedEventId && viewTab === "sessions" }
  );
  const { data: leaderboard } = trpc.competition.getLeaderboard.useQuery(
    { eventId: selectedEventId!, limit: 100 },
    { enabled: !!selectedEventId && viewTab === "leaderboard" }
  );
  const { data: qCount } = trpc.competition.questionCount.useQuery(
    { eventId: selectedEventId! },
    { enabled: !!selectedEventId }
  );

  const setConfigMut = trpc.competition.setConfig.useMutation({
    onSuccess: () => { utils.competition.getConfig.invalidate(); toast("Config saved", "success"); setShowConfigForm(false); },
    onError: (e) => toast(e.message, "error"),
  });
  const createQMut = trpc.competition.createQuestion.useMutation({
    onSuccess: () => { utils.competition.listQuestions.invalidate(); toast("Question added", "success"); setShowQuestionForm(false); },
    onError: (e) => toast(e.message, "error"),
  });
  const updateQMut = trpc.competition.updateQuestion.useMutation({
    onSuccess: () => { utils.competition.listQuestions.invalidate(); toast("Question updated", "success"); setShowQuestionForm(false); setEditQuestion(null); },
    onError: (e) => toast(e.message, "error"),
  });
  const deleteQMut = trpc.competition.deleteQuestion.useMutation({
    onSuccess: () => { utils.competition.listQuestions.invalidate(); toast("Question deleted", "success"); },
    onError: (e) => toast(e.message, "error"),
  });
  const bulkCreateMut = trpc.competition.bulkCreateQuestions.useMutation({
    onSuccess: (data) => { utils.competition.listQuestions.invalidate(); toast(`${data.count} questions imported`, "success"); setShowBulkUpload(false); setBulkText(""); },
    onError: (e) => toast(e.message, "error"),
  });

  const [qForm, setQForm] = useState({
    questionType: "multiple_choice" as any,
    questionText: "",
    options: "",
    correctAnswer: "",
    points: 1,
    explanation: "",
    difficulty: "medium" as any,
  });

  const competitions: any[] = ((eventsList as any)?.data ?? []).filter((e: any) =>
    ["competition", "olympiad", "datathon", "hackathon"].includes(e.eventType)
  );
  const questionsArr: any[] = (questions as any) ?? [];
  const sessionsArr: any[] = (sessions as any) ?? [];
  const leaderboardArr: any[] = (leaderboard as any) ?? [];

  const selectedEvent = competitions.find((e: any) => e.id === selectedEventId);

  const openCreateQuestion = () => {
    setEditQuestion(null);
    setQForm({ questionType: "multiple_choice", questionText: "", options: "", correctAnswer: "", points: 1, explanation: "", difficulty: "medium" });
    setShowQuestionForm(true);
  };
   const openEditQuestion = (q: any) => {
    setEditQuestion(q);
    setQForm({ questionType: q.questionType, questionText: q.questionText, options: q.options || "", correctAnswer: q.correctAnswer || "", points: q.points || 1, explanation: q.explanation || "", difficulty: q.difficulty });
    setShowQuestionForm(true);
  };

  // Parse bulk upload
  const handleBulkUpload = () => {
    try {
      const lines = bulkText.trim().split("\n").filter(l => l.trim());
      const questions = [];
      for (const line of lines) {
        const parts = line.split("|").map(p => p.trim());
        if (parts.length < 3) continue;
        const q: any = {
          questionType: parts[0] || "multiple_choice",
          questionText: parts[1],
          correctAnswer: parts[2],
          points: Number(parts[3]) || 1,
          difficulty: parts[4] || "medium",
        };
        if (parts[5]) q.options = JSON.stringify(parts[5].split(",").map((o: string) => o.trim()));
        if (parts[6]) q.explanation = parts[6];
        questions.push(q);
      }
      if (questions.length > 0 && selectedEventId) {
        bulkCreateMut.mutate({ eventId: selectedEventId, questions });
      }
    } catch (e) {
      toast("Invalid format. Use: type|question|answer|points|difficulty|options|explanation", "error");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-medium text-2xl text-[#faf8f3]">Competition Host</h1>
          <p className="text-xs text-[#8a8680] mt-0.5">Create questions, manage anti-cheat, view results</p>
        </div>
        {selectedEventId && (
          <div className="flex gap-2">
            <button onClick={() => setShowConfigForm(!showConfigForm)} className="flex items-center gap-2 px-4 py-2 border border-[rgba(201,168,76,0.2)] text-[#c9a84c] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[rgba(201,168,76,0.08)] transition-all">
              <Shield size={13} /> Rules
            </button>
            <button onClick={() => setShowBulkUpload(!showBulkUpload)} className="flex items-center gap-2 px-4 py-2 border border-[rgba(201,168,76,0.2)] text-[#c9a84c] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[rgba(201,168,76,0.08)] transition-all">
              <Upload size={13} /> Bulk
            </button>
            <button onClick={openCreateQuestion} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#e8d49a] transition-all hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]">
              <Plus size={14} /> Question
            </button>
          </div>
        )}
      </div>

      {/* Event Selector */}
      <div className="mb-6">
        <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-2">Select Competition Event</label>
        <div className="flex gap-2 flex-wrap">
          {competitions.map((evt: any) => (
            <button
              key={evt.id}
              onClick={() => { setSelectedEventId(evt.id); setViewTab("questions"); }}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all border ${
                selectedEventId === evt.id
                  ? "bg-[rgba(201,168,76,0.12)] border-[rgba(201,168,76,0.25)] text-[#c9a84c]"
                  : "bg-[#141414] border-[rgba(201,168,76,0.06)] text-[#8a8680] hover:border-[rgba(201,168,76,0.15)] hover:text-[#e0ddd5]"
              }`}
            >
              {evt.title}
              <span className="ml-2 text-[0.6rem] uppercase opacity-50">{evt.eventType}</span>
            </button>
          ))}
          {competitions.length === 0 && <span className="text-xs text-[#8a8680]">No competition events found. Create an event with type &quot;competition&quot; first.</span>}
        </div>
      </div>

      {/* Selected Event Info */}
      {selectedEvent && (
        <div className="flex items-center gap-6 mb-6 p-4 bg-[#141414] border border-[rgba(201,168,76,0.08)] rounded-lg">
          <div>
            <div className="text-xs text-[#faf8f3] font-medium">{selectedEvent.title}</div>
            <div className="text-[0.6rem] text-[#8a8680] uppercase tracking-wider mt-0.5">{selectedEvent.status?.replace(/_/g, " ")}</div>
          </div>
          <div className="w-px h-8 bg-[rgba(201,168,76,0.1)]" />
          <div className="text-center">
            <div className="font-mono text-lg text-[#c9a84c]">{qCount?.count ?? 0}</div>
            <div className="text-[0.6rem] text-[#8a8680] uppercase tracking-wider">Questions</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg text-[#e8d49a]">{qCount?.totalPoints ?? 0}</div>
            <div className="text-[0.6rem] text-[#8a8680] uppercase tracking-wider">Total Points</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg text-[#faf8f3]">{sessionsArr.length}</div>
            <div className="text-[0.6rem] text-[#8a8680] uppercase tracking-wider">Participants</div>
          </div>
          <div className="w-px h-8 bg-[rgba(201,168,76,0.1)]" />
          <div className="flex items-center gap-2">
            <Lock size={12} className={config?.antiCheatEnabled ? "text-emerald-400" : "text-[#555]"} />
            <span className="text-[0.6rem] text-[#8a8680] uppercase">Anti-cheat {config?.antiCheatEnabled ? "ON" : "OFF"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer size={12} className="text-[#c9a84c]" />
            <span className="text-[0.6rem] text-[#8a8680] uppercase">{config?.timeLimitMinutes ?? 60} min</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      {selectedEventId && (
        <div className="flex gap-1 mb-4 bg-[#141414] p-1 rounded-lg border border-[rgba(201,168,76,0.06)]">
          {[
            { id: "questions", label: "Questions", count: questionsArr.length },
            { id: "sessions", label: "Sessions", count: sessionsArr.length },
            { id: "leaderboard", label: "Leaderboard", count: leaderboardArr.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setViewTab(t.id as any)}
              className={`flex-1 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-md transition-all ${
                viewTab === t.id
                  ? "bg-[rgba(201,168,76,0.1)] text-[#c9a84c] border border-[rgba(201,168,76,0.15)]"
                  : "text-[#8a8680] hover:text-[#e0ddd5]"
              }`}
            >
              {t.label} <span className="text-[0.6rem] opacity-50">({t.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Config Form */}
      {showConfigForm && selectedEventId && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-6 rounded-lg mb-6 animate-fadeIn">
          <h3 className="font-display font-medium text-lg text-[#faf8f3] mb-5 flex items-center gap-2"><Shield size={16} className="text-[#c9a84c]" /> Competition Rules</h3>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Time Limit (min)</label><input type="number" defaultValue={config?.timeLimitMinutes ?? 60} id="cfg_time" className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Max Attempts</label><input type="number" defaultValue={config?.maxAttempts ?? 1} id="cfg_attempts" className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Passing Score (%)</label><input type="number" defaultValue={config?.passingScore ?? 60} id="cfg_pass" className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" defaultChecked={config?.antiCheatEnabled ?? true} id="cfg_cheat" className="accent-[#c9a84c]" /><label className="text-xs text-[#8a8680]">Anti-cheat (tab detection)</label></div>
            <div className="flex items-center gap-2"><input type="checkbox" defaultChecked={config?.preventCopyPaste ?? true} id="cfg_copy" className="accent-[#c9a84c]" /><label className="text-xs text-[#8a8680]">Prevent copy/paste</label></div>
            <div className="flex items-center gap-2"><input type="checkbox" defaultChecked={config?.fullscreenRequired ?? false} id="cfg_full" className="accent-[#c9a84c]" /><label className="text-xs text-[#8a8680]">Require fullscreen</label></div>
            <div className="flex items-center gap-2"><input type="checkbox" defaultChecked={config?.shuffleQuestions ?? true} id="cfg_shuffle" className="accent-[#c9a84c]" /><label className="text-xs text-[#8a8680]">Shuffle questions</label></div>
            <div className="flex items-center gap-2"><input type="checkbox" defaultChecked={config?.showCorrectAnswers ?? true} id="cfg_show" className="accent-[#c9a84c]" /><label className="text-xs text-[#8a8680]">Show correct answers after</label></div>
            <div className="flex items-center gap-2"><input type="checkbox" defaultChecked={config?.allowReview ?? true} id="cfg_review" className="accent-[#c9a84c]" /><label className="text-xs text-[#8a8680]">Allow answer review</label></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => {
              setConfigMut.mutate({
                eventId: selectedEventId,
                timeLimitMinutes: Number((document.getElementById("cfg_time") as HTMLInputElement)?.value) || 60,
                maxAttempts: Number((document.getElementById("cfg_attempts") as HTMLInputElement)?.value) || 1,
                passingScore: Number((document.getElementById("cfg_pass") as HTMLInputElement)?.value) || 60,
                antiCheatEnabled: (document.getElementById("cfg_cheat") as HTMLInputElement)?.checked,
                preventCopyPaste: (document.getElementById("cfg_copy") as HTMLInputElement)?.checked,
                fullscreenRequired: (document.getElementById("cfg_full") as HTMLInputElement)?.checked,
                shuffleQuestions: (document.getElementById("cfg_shuffle") as HTMLInputElement)?.checked,
                showCorrectAnswers: (document.getElementById("cfg_show") as HTMLInputElement)?.checked,
                allowReview: (document.getElementById("cfg_review") as HTMLInputElement)?.checked,
              });
            }} disabled={setConfigMut.isPending} className="px-6 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#e8d49a] transition-all disabled:opacity-50 flex items-center gap-2"><Save size={14} /> Save Rules</button>
            <button onClick={() => setShowConfigForm(false)} className="px-6 py-2.5 border border-[rgba(201,168,76,0.15)] text-[#8a8680] text-xs font-medium uppercase tracking-wider rounded-md hover:text-[#faf8f3] hover:border-[#c9a84c] transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Bulk Upload */}
      {showBulkUpload && selectedEventId && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-6 rounded-lg mb-6 animate-fadeIn">
          <h3 className="font-display font-medium text-lg text-[#faf8f3] mb-2 flex items-center gap-2"><Upload size={16} className="text-[#c9a84c]" /> Bulk Question Import</h3>
          <p className="text-[0.6rem] text-[#8a8680] mb-4">Format per line: type|question|answer|points|difficulty|options(comma-sep)|explanation</p>
          <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={8} placeholder="multiple_choice|What is 2+2?|B|1|easy|A,B,C,D|Two plus two equals four
multiple_choice|Capital of BD?|A|2|medium|Dhaka,Chittagong,Khulna,Rajshahi|Dhaka is the capital" className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] placeholder-[#444] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] font-mono resize-none" />
          <div className="flex gap-3 mt-4">
            <button onClick={handleBulkUpload} disabled={bulkCreateMut.isPending || !bulkText.trim()} className="px-6 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#e8d49a] transition-all disabled:opacity-50 flex items-center gap-2"><FileUp size={14} /> Import</button>
            <button onClick={() => setShowBulkUpload(false)} className="px-6 py-2.5 border border-[rgba(201,168,76,0.15)] text-[#8a8680] text-xs font-medium uppercase tracking-wider rounded-md hover:text-[#faf8f3] hover:border-[#c9a84c] transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Question Form */}
      {showQuestionForm && selectedEventId && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-6 rounded-lg mb-6 animate-fadeIn">
          <h3 className="font-display font-medium text-lg text-[#faf8f3] mb-5">{editQuestion ? "Edit Question" : "New Question"}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Type</label>
              <select value={qForm.questionType} onChange={(e) => setQForm({ ...qForm, questionType: e.target.value as any })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]">
                {["multiple_choice","multiple_select","true_false","short_answer","essay","coding","fill_blank","matching"].map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Points</label><input type="number" value={qForm.points} onChange={(e) => setQForm({ ...qForm, points: Number(e.target.value) })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div>
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Difficulty</label>
              <select value={qForm.difficulty} onChange={(e) => setQForm({ ...qForm, difficulty: e.target.value as any })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]">
                {["easy","medium","hard"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Question Text *</label>
              <textarea value={qForm.questionText} onChange={(e) => setQForm({ ...qForm, questionText: e.target.value })} rows={2} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] resize-none" />
            </div>
            {(qForm.questionType === "multiple_choice" || qForm.questionType === "multiple_select") && (
              <div className="col-span-3">
                <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Options (JSON array)</label>
                <input type="text" value={qForm.options} onChange={(e) => setQForm({ ...qForm, options: e.target.value })} placeholder='["A","B","C","D"]' className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] placeholder-[#444] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] font-mono" />
              </div>
            )}
            <div className="col-span-3">
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Correct Answer</label>
              <input type="text" value={qForm.correctAnswer} onChange={(e) => setQForm({ ...qForm, correctAnswer: e.target.value })} placeholder="For MCQ: the option text. For TF: true/false" className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] placeholder-[#444] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] font-mono" />
            </div>
            <div className="col-span-3">
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Explanation</label>
              <textarea value={qForm.explanation} onChange={(e) => setQForm({ ...qForm, explanation: e.target.value })} rows={2} placeholder="Shown to student after submission" className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] placeholder-[#444] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => {
              if (!qForm.questionText.trim()) { toast("Question text is required", "error"); return; }
              editQuestion
                ? updateQMut.mutate({ id: editQuestion.id, ...qForm })
                : createQMut.mutate({ eventId: selectedEventId, ...qForm });
            }} disabled={createQMut.isPending || updateQMut.isPending} className="px-6 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#e8d49a] transition-all disabled:opacity-50 flex items-center gap-2"><Save size={14} /> {editQuestion ? "Update" : "Add"}</button>
            <button onClick={() => { setShowQuestionForm(false); setEditQuestion(null); }} className="px-6 py-2.5 border border-[rgba(201,168,76,0.15)] text-[#8a8680] text-xs font-medium uppercase tracking-wider rounded-md hover:text-[#faf8f3] hover:border-[#c9a84c] transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* View: Questions */}
      {viewTab === "questions" && selectedEventId && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
          {qLoading ? <SkeletonRow cols={6} /> : (
            <table className="w-full">
              <thead><tr className="border-b border-[rgba(201,168,76,0.08)]">{["#", "Question", "Type", "Points", "Difficulty", "Actions"].map(h => <th key={h} className="text-left text-[0.6rem] uppercase tracking-wider text-[#8a8680] font-medium px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {questionsArr.map((q: any, i: number) => (
                  <tr key={q.id} className="border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors group">
                    <td className="px-4 py-3 text-xs text-[#8a8680] w-8">{i + 1}</td>
                    <td className="px-4 py-3 text-xs text-[#faf8f3] max-w-[300px] truncate">{q.questionText}</td>
                    <td className="px-4 py-3"><span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded ${getStatusColor(q.questionType)}`}>{q.questionType?.replace(/_/g, " ")}</span></td>
                    <td className="px-4 py-3 text-xs text-[#c9a84c]">{q.points}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{q.difficulty}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditQuestion(q)} className="text-[#8a8680] hover:text-[#c9a84c] transition-colors p-1 rounded hover:bg-[rgba(201,168,76,0.08)]"><Pencil size={13} /></button>
                        <button onClick={() => { if (confirm("Delete this question?")) deleteQMut.mutate({ id: q.id }); }} className="text-[#8a8680] hover:text-red-400 transition-colors p-1 rounded hover:bg-[rgba(255,0,0,0.05)]"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {questionsArr.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-xs text-[#8a8680]">No questions yet. Add your first question above.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* View: Sessions */}
      {viewTab === "sessions" && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
          {sessionsArr.length === 0 ? (
            <div className="px-4 py-12 text-center text-xs text-[#8a8680]">No sessions yet</div>
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-[rgba(201,168,76,0.08)]">{["Name", "Email", "Score", "%", "Status", "Tab Switches", "Time"].map(h => <th key={h} className="text-left text-[0.6rem] uppercase tracking-wider text-[#8a8680] font-medium px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {sessionsArr.map((s: any) => (
                  <tr key={s.id} className="border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                    <td className="px-4 py-3 text-xs text-[#faf8f3] font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{s.email}</td>
                    <td className="px-4 py-3 text-xs text-[#c9a84c] font-medium">{s.score} / {s.maxPossibleScore}</td>
                    <td className="px-4 py-3 text-xs text-[#e8d49a]">{s.percentage}%</td>
                    <td className="px-4 py-3"><span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded ${getStatusColor(s.status)}`}>{s.status}</span></td>
                    <td className="px-4 py-3 text-xs text-red-400">{s.tabSwitchCount > 0 ? `${s.tabSwitchCount} warnings` : <span className="text-emerald-400">Clean</span>}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{Math.floor((s.timeSpentSeconds || 0) / 60)}m {(s.timeSpentSeconds || 0) % 60}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* View: Leaderboard */}
      {viewTab === "leaderboard" && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
          {leaderboardArr.length === 0 ? (
            <div className="px-4 py-12 text-center text-xs text-[#8a8680]">No results yet</div>
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-[rgba(201,168,76,0.08)]">{["Rank", "Name", "Score", "%", "Passed", "Time"].map(h => <th key={h} className="text-left text-[0.6rem] uppercase tracking-wider text-[#8a8680] font-medium px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {leaderboardArr.map((l: any, i: number) => (
                  <tr key={l.id} className={`border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors ${i < 3 ? "bg-[rgba(201,168,76,0.02)]" : ""}`}>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-sm font-medium ${i === 0 ? "text-[#c9a84c]" : i === 1 ? "text-[#e0ddd5]" : i === 2 ? "text-[#8a8680]" : "text-[#555]"}`}>
                        #{i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#faf8f3] font-medium">{l.name}</td>
                    <td className="px-4 py-3 text-xs text-[#c9a84c] font-medium">{l.score}</td>
                    <td className="px-4 py-3 text-xs text-[#e8d49a]">{l.percentage}%</td>
                    <td className="px-4 py-3 text-xs">{l.passed ? <span className="text-emerald-400">Passed</span> : <span className="text-red-400">Failed</span>}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{Math.floor((l.timeSpentSeconds || 0) / 60)}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* No event selected */}
      {!selectedEventId && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Trophy size={40} className="text-[rgba(201,168,76,0.15)] mb-4" />
          <p className="text-sm text-[#8a8680]">Select a competition event to manage questions, sessions, and leaderboard</p>
          <p className="text-[0.6rem] text-[#555] mt-2 uppercase tracking-wider">Create events with type: competition, olympiad, datathon, or hackathon</p>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "registration_open": return "bg-emerald-900/30 text-emerald-400 border border-emerald-800/40";
    case "live": return "bg-sky-900/30 text-sky-400 border border-sky-800/40";
    case "completed": return "bg-gray-800/60 text-gray-400 border border-gray-700/40";
    case "cancelled": return "bg-red-900/30 text-red-400 border border-red-800/40";
    case "draft": return "bg-amber-900/30 text-amber-400 border border-amber-800/40";
    case "new": return "bg-cyan-900/30 text-cyan-400 border border-cyan-800/40";
    case "contacted": return "bg-violet-900/30 text-violet-400 border border-violet-800/40";
    case "confirmed": return "bg-emerald-900/30 text-emerald-400 border border-emerald-800/40";
    case "read": return "bg-blue-900/30 text-blue-400 border border-blue-800/40";
    case "replied": return "bg-teal-900/30 text-teal-400 border border-teal-800/40";
    case "archived": return "bg-gray-800/60 text-gray-400 border border-gray-700/40";
    default: return "bg-[rgba(201,168,76,0.08)] text-[#c9a84c] border border-[rgba(201,168,76,0.15)]";
  }
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ADMIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, logout } = useAuth({ requireAdmin: true });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tabTransition, setTabTransition] = useState(false);
  const { toasts, add, remove } = useToasts();

  // Shared form state
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (id: string) => {
    if (id === activeTab) return;
    setTabTransition(true);
    setTimeout(() => {
      setActiveTab(id);
      setShowForm(false);
      setEditItem(null);
      setSearchQuery("");
      setTimeout(() => setTabTransition(false), 50);
    }, 150);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={24} className="text-[#c9a84c] animate-spin" />
          <span className="font-body text-[#8a8680] text-xs uppercase tracking-widest">Loading CMS...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#faf8f3] font-body">
      <ToastContainer toasts={toasts} remove={remove} />

      {/* Top Bar */}
      <header className="h-14 bg-[#121212]/95 backdrop-blur-md border-b border-[rgba(201,168,76,0.1)] flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-[#8a8680] hover:text-[#c9a84c] transition-colors duration-200 p-1 rounded hover:bg-[rgba(201,168,76,0.08)]">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display font-medium text-lg text-[#faf8f3]">BICTA</span>
            <span className="w-px h-4 bg-[#c9a84c]" />
            <span className="text-[0.6rem] uppercase tracking-[0.15em] text-[#c9a84c] font-medium">CMS</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#8a8680] hidden sm:inline">{user?.name || user?.email}</span>
          <span className="px-2 py-0.5 bg-[rgba(201,168,76,0.1)] text-[#c9a84c] text-[0.6rem] uppercase tracking-wider font-medium rounded border border-[rgba(201,168,76,0.15)]">{user?.role}</span>
          <button onClick={logout} className="text-xs text-[#8a8680] hover:text-[#c9a84c] transition-colors duration-200 ml-2">Logout</button>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className="w-56 bg-[#0f0f0f] border-r border-[rgba(201,168,76,0.06)] fixed left-0 top-14 bottom-0 overflow-y-auto z-30">
          <nav className="p-3 space-y-0.5 pt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider rounded-md transition-all duration-200 relative overflow-hidden group ${
                    isActive
                      ? "text-[#c9a84c]"
                      : "text-[#8a8680] hover:text-[#e0ddd5] hover:bg-[rgba(255,255,255,0.02)]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.12)] rounded-md transition-all duration-200" />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon size={14} className={isActive ? "text-[#c9a84c]" : "text-[#8a8680] group-hover:text-[#e0ddd5]"} />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(201,168,76,0.06)]">
            <div className="text-[0.6rem] text-[#8a8680] uppercase tracking-wider">BICTA Elite CMS v2.0</div>
            <div className="text-[0.6rem] text-[#555] mt-0.5">Production Ready</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ml-56 p-8 transition-all duration-200 ${tabTransition ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
          {activeTab === "dashboard" && <DashboardTab toast={add} />}
          {activeTab === "events" && <EventsTab showForm={showForm} setShowForm={setShowForm} editItem={editItem} setEditItem={setEditItem} searchQuery={searchQuery} setSearchQuery={setSearchQuery} toast={add} />}
          {activeTab === "competitions" && <CompetitionsTab toast={add} />}
          {activeTab === "programs" && <ProgramsTab showForm={showForm} setShowForm={setShowForm} editItem={editItem} setEditItem={setEditItem} searchQuery={searchQuery} setSearchQuery={setSearchQuery} toast={add} />}
          {activeTab === "alumni" && <AlumniTab showForm={showForm} setShowForm={setShowForm} editItem={editItem} setEditItem={setEditItem} toast={add} />}
          {activeTab === "speakers" && <SpeakersTab showForm={showForm} setShowForm={setShowForm} editItem={editItem} setEditItem={setEditItem} toast={add} />}
          {activeTab === "advisers" && <AdvisersTab showForm={showForm} setShowForm={setShowForm} editItem={editItem} setEditItem={setEditItem} toast={add} />}
          {activeTab === "partners" && <PartnersTab toast={add} />}
          {activeTab === "contacts" && <ContactsTab toast={add} />}
          {activeTab === "settings" && <SettingsTab toast={add} />}
          {activeTab === "content" && <ContentTab toast={add} />}
          {activeTab === "monitoring" && <MonitoringTab />}
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
function DashboardTab({ toast: _toast }: { toast: (m: string, t?: any) => void }) {
  const { data: stats, isLoading } = trpc.admin.dashboard.useQuery();
  const { data: health } = trpc.health.check.useQuery(undefined, { refetchInterval: 15000 });
  const navigate = useNavigate();

  const cards = [
    { label: "Users", value: stats?.users ?? 0, color: "#c9a84c", icon: Users, tab: "" },
    { label: "Events", value: stats?.events ?? 0, color: "#c9a84c", icon: Calendar, tab: "events" },
    { label: "Programs", value: stats?.programs ?? 0, color: "#e8d49a", icon: BookOpen, tab: "programs" },
    { label: "Partners", value: stats?.partners ?? 0, color: "#e8d49a", icon: Handshake, tab: "partners" },
    { label: "Contacts", value: stats?.contacts ?? 0, color: "#faf8f3", icon: Mail, tab: "contacts" },
    { label: "Alumni", value: stats?.alumni ?? 0, color: "#faf8f3", icon: Layers, tab: "alumni" },
    { label: "Registrations", value: stats?.registrations ?? 0, color: "#8a8680", icon: TrendingUp, tab: "" },
  ];

  if (isLoading) return (
    <div>
      <div className="h-8 w-48 bg-[rgba(201,168,76,0.06)] rounded animate-pulse mb-8" />
      <SkeletonCards count={8} />
    </div>
  );

  return (
    <div>
      <h1 className="font-display font-medium text-3xl text-[#faf8f3] mb-2">Dashboard</h1>
      <p className="text-xs text-[#8a8680] mb-8">Overview of your platform</p>

      {/* System Health Banner */}
      <div className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-lg border ${health?.status === "healthy" ? "border-emerald-800/40 bg-emerald-950/15" : "border-amber-800/40 bg-amber-950/15"}`}>
        <Activity size={16} className={health?.status === "healthy" ? "text-emerald-400" : "text-amber-400"} />
        <span className={`text-xs font-medium ${health?.status === "healthy" ? "text-emerald-400" : "text-amber-400"}`}>
          System {health?.status?.toUpperCase()}
        </span>
        <span className="text-[0.6rem] text-[#8a8680] ml-auto">
          DB: {health?.services?.database?.latency}ms &middot; Cache: {health?.services?.cache?.status} &middot; Response: {health?.totalLatency}ms
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => card.tab && navigate(`/admin`)}
              className="group bg-[#141414] border border-[rgba(201,168,76,0.06)] hover:border-[rgba(201,168,76,0.2)] p-5 rounded-lg text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-[0.6rem] uppercase tracking-[0.15em] text-[#8a8680] group-hover:text-[#e0ddd5] transition-colors">{card.label}</div>
                <Icon size={14} className="text-[#8a8680] group-hover:text-[#c9a84c] transition-colors" />
              </div>
              <div className="font-mono text-3xl transition-colors duration-300" style={{ color: card.color }}>{card.value}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EVENTS TAB (Full CRUD + Search)
   ═══════════════════════════════════════════════════════════════ */
function EventsTab({ showForm, setShowForm, editItem, setEditItem, searchQuery, setSearchQuery, toast }: any) {
  const utils = trpc.useUtils();
  const { data: resp, isLoading } = trpc.event.list.useQuery({ limit: 50 });
  const createMut = trpc.admin.eventCreate.useMutation({
    onSuccess: () => { utils.event.list.invalidate(); setShowForm(false); toast("Event created successfully", "success"); },
    onError: (e) => toast(e.message, "error"),
  });
  const updateMut = trpc.admin.eventUpdate.useMutation({
    onSuccess: () => { utils.event.list.invalidate(); setShowForm(false); setEditItem(null); toast("Event updated", "success"); },
    onError: (e) => toast(e.message, "error"),
  });
  const deleteMut = trpc.admin.eventDelete.useMutation({
    onSuccess: () => { utils.event.list.invalidate(); toast("Event deleted", "success"); },
    onError: (e) => toast(e.message, "error"),
  });

  const [form, setForm] = useState({ title: "", slug: "", summary: "", eventType: "workshop", mode: "offline", status: "draft", venue: "", registrationLimit: 0, featured: false, published: false });
  const eventsArr: any[] = (resp as any)?.data ?? [];
  const filtered = eventsArr.filter((e: any) => !searchQuery || e.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  const openCreate = () => { setEditItem(null); setForm({ title: "", slug: "", summary: "", eventType: "workshop", mode: "offline", status: "draft", venue: "", registrationLimit: 0, featured: false, published: false }); setShowForm(true); };
  const openEdit = (evt: any) => { setEditItem(evt); setForm({ title: evt.title, slug: evt.slug, summary: evt.summary || "", eventType: evt.eventType, mode: evt.mode, status: evt.status, venue: evt.venue || "", registrationLimit: evt.registrationLimit || 0, featured: evt.featured || false, published: evt.published || false }); setShowForm(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-medium text-2xl text-[#faf8f3]">Events</h1>
          <p className="text-xs text-[#8a8680] mt-0.5">{eventsArr.length} total events</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#e8d49a] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]">
          <Plus size={14} /> New Event
        </button>
      </div>

      {/* Search */}
      {!showForm && (
        <div className="flex items-center gap-3 mb-4 bg-[#141414] border border-[rgba(201,168,76,0.08)] focus-within:border-[rgba(201,168,76,0.25)] px-3 py-2.5 rounded-lg transition-colors">
          <Search size={14} className="text-[#8a8680]" />
          <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-xs text-[#faf8f3] placeholder-[#555] outline-none flex-1" />
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-6 rounded-lg mb-6 animate-fadeIn">
          <h3 className="font-display font-medium text-lg text-[#faf8f3] mb-5">{editItem ? "Edit Event" : "Create Event"}</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Title *", key: "title", type: "text" },
              { label: "Slug *", key: "slug", type: "text" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
            ))}
            <div>
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Type</label>
              <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value as any })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]">
                {["competition","datathon","workshop","olympiad","summit","webinar","conference","hackathon"].map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Mode</label>
              <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as any })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]">
                {["online","offline","hybrid"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]">
                {["draft","scheduled","registration_open","registration_closed","live","completed","cancelled","postponed"].map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Venue</label>
              <input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" />
            </div>
            <div>
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Registration Limit</label>
              <input type="number" value={form.registrationLimit} onChange={(e) => setForm({ ...form, registrationLimit: Number(e.target.value) })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" />
            </div>
            <div className="col-span-2">
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Summary</label>
              <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={3} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] resize-none" />
            </div>
            <div className="flex items-center gap-6 col-span-2">
              <label className="flex items-center gap-2 text-xs text-[#8a8680] cursor-pointer hover:text-[#e0ddd5] transition-colors">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#c9a84c] w-3.5 h-3.5" /> Featured
              </label>
              <label className="flex items-center gap-2 text-xs text-[#8a8680] cursor-pointer hover:text-[#e0ddd5] transition-colors">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-[#c9a84c] w-3.5 h-3.5" /> Published
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => editItem ? updateMut.mutate({ id: editItem.id, ...form, eventType: form.eventType as any, mode: form.mode as any, status: form.status as any }) : createMut.mutate({ ...form, eventType: form.eventType as any, mode: form.mode as any, status: form.status as any })} disabled={createMut.isPending || updateMut.isPending} className="px-6 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#e8d49a] transition-all disabled:opacity-50 flex items-center gap-2">
              <Save size={14} /> {editItem ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setEditItem(null); }} className="px-6 py-2.5 border border-[rgba(201,168,76,0.15)] text-[#8a8680] text-xs font-medium uppercase tracking-wider rounded-md hover:text-[#faf8f3] hover:border-[#c9a84c] transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      {!showForm && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
          {isLoading ? <SkeletonRow cols={6} /> : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(201,168,76,0.08)]">
                  {["Title", "Type", "Status", "Mode", "Featured", "Actions"].map(h => (
                    <th key={h} className="text-left text-[0.6rem] uppercase tracking-wider text-[#8a8680] font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((evt: any) => (
                  <tr key={evt.id} className="border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors group">
                    <td className="px-4 py-3 text-xs text-[#faf8f3] font-medium">{evt.title}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{evt.eventType}</td>
                    <td className="px-4 py-3"><span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded ${getStatusColor(evt.status)}`}>{evt.status?.replace(/_/g, " ")}</span></td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{evt.mode}</td>
                    <td className="px-4 py-3 text-xs text-[#c9a84c]">{evt.featured ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(evt)} className="text-[#8a8680] hover:text-[#c9a84c] transition-colors p-1 rounded hover:bg-[rgba(201,168,76,0.08)]"><Pencil size={13} /></button>
                        <button onClick={() => { if (confirm("Delete this event?")) deleteMut.mutate({ id: evt.id }); }} className="text-[#8a8680] hover:text-red-400 transition-colors p-1 rounded hover:bg-[rgba(255,0,0,0.05)]"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-xs text-[#8a8680]">No events found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROGRAMS TAB
   ═══════════════════════════════════════════════════════════════ */
function ProgramsTab({ showForm, setShowForm, editItem, setEditItem, searchQuery, setSearchQuery, toast }: any) {
  const utils = trpc.useUtils();
  const { data: programs } = trpc.program.list.useQuery({ limit: 50 });
  const createMut = trpc.admin.programCreate.useMutation({ onSuccess: () => { utils.program.list.invalidate(); setShowForm(false); toast("Program created", "success"); }, onError: (e) => toast(e.message, "error") });
  const updateMut = trpc.admin.programUpdate.useMutation({ onSuccess: () => { utils.program.list.invalidate(); setShowForm(false); setEditItem(null); toast("Program updated", "success"); }, onError: (e) => toast(e.message, "error") });
  const deleteMut = trpc.admin.programDelete.useMutation({ onSuccess: () => { utils.program.list.invalidate(); toast("Program deleted", "success"); }, onError: (e) => toast(e.message, "error") });

  const [form, setForm] = useState({ title: "", slug: "", category: "", summary: "", description: "", featured: false, published: true, order: 0 });
  const progs: any[] = (programs as any) ?? [];
  const filtered = progs.filter((p: any) => !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  const openCreate = () => { setEditItem(null); setForm({ title: "", slug: "", category: "", summary: "", description: "", featured: false, published: true, order: 0 }); setShowForm(true); };
  const openEdit = (p: any) => { setEditItem(p); setForm({ title: p.title, slug: p.slug, category: p.category, summary: p.summary || "", description: p.description || "", featured: p.featured || false, published: p.published || true, order: p.order || 0 }); setShowForm(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display font-medium text-2xl text-[#faf8f3]">Programs</h1><p className="text-xs text-[#8a8680] mt-0.5">{progs.length} total programs</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#e8d49a] transition-all hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]"><Plus size={14} /> New Program</button>
      </div>
      {!showForm && (
        <div className="flex items-center gap-3 mb-4 bg-[#141414] border border-[rgba(201,168,76,0.08)] focus-within:border-[rgba(201,168,76,0.25)] px-3 py-2.5 rounded-lg transition-colors">
          <Search size={14} className="text-[#8a8680]" />
          <input type="text" placeholder="Search programs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-xs text-[#faf8f3] placeholder-[#555] outline-none flex-1" />
        </div>
      )}
      {showForm && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-6 rounded-lg mb-6 animate-fadeIn">
          <h3 className="font-display font-medium text-lg text-[#faf8f3] mb-5">{editItem ? "Edit Program" : "Create Program"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Slug *</label><input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Category *</label><input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Display Order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div className="col-span-2"><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Summary</label><textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] resize-none" /></div>
            <div className="col-span-2"><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] resize-none" /></div>
            <div className="flex items-center gap-6 col-span-2">
              <label className="flex items-center gap-2 text-xs text-[#8a8680] cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#c9a84c]" /> Featured</label>
              <label className="flex items-center gap-2 text-xs text-[#8a8680] cursor-pointer"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-[#c9a84c]" /> Published</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => editItem ? updateMut.mutate({ id: editItem.id, ...form }) : createMut.mutate(form)} disabled={createMut.isPending || updateMut.isPending} className="px-6 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#e8d49a] transition-all disabled:opacity-50 flex items-center gap-2"><Save size={14} /> {editItem ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditItem(null); }} className="px-6 py-2.5 border border-[rgba(201,168,76,0.15)] text-[#8a8680] text-xs font-medium uppercase tracking-wider rounded-md hover:text-[#faf8f3] hover:border-[#c9a84c] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {!showForm && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-[rgba(201,168,76,0.08)]">{["Title", "Category", "Featured", "Published", "Actions"].map(h => <th key={h} className="text-left text-[0.6rem] uppercase tracking-wider text-[#8a8680] font-medium px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((p: any) => (
                <tr key={p.id} className="border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors group">
                  <td className="px-4 py-3 text-xs text-[#faf8f3] font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-xs text-[#8a8680]">{p.category}</td>
                  <td className="px-4 py-3 text-xs text-[#c9a84c]">{p.featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-xs text-[#8a8680]">{p.published ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)} className="text-[#8a8680] hover:text-[#c9a84c] transition-colors p-1 rounded hover:bg-[rgba(201,168,76,0.08)]"><Pencil size={13} /></button>
                      <button onClick={() => { if (confirm("Delete?")) deleteMut.mutate({ id: p.id }); }} className="text-[#8a8680] hover:text-red-400 transition-colors p-1 rounded hover:bg-[rgba(255,0,0,0.05)]"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-xs text-[#8a8680]">No programs found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ALUMNI TAB
   ═══════════════════════════════════════════════════════════════ */
function AlumniTab({ showForm, setShowForm, editItem, setEditItem, toast }: any) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.alumni.list.useQuery({ limit: 50 });
  const createMut = trpc.admin.alumniCreate.useMutation({ onSuccess: () => { utils.alumni.list.invalidate(); setShowForm(false); toast("Alumni added", "success"); }, onError: (e) => toast(e.message, "error") });
  const updateMut = trpc.admin.alumniUpdate.useMutation({ onSuccess: () => { utils.alumni.list.invalidate(); setShowForm(false); setEditItem(null); toast("Alumni updated", "success"); }, onError: (e) => toast(e.message, "error") });
  const deleteMut = trpc.admin.alumniDelete.useMutation({ onSuccess: () => { utils.alumni.list.invalidate(); toast("Alumni removed", "success"); }, onError: (e) => toast(e.message, "error") });

  const [form, setForm] = useState({ name: "", role: "", company: "", quote: "", featured: true, published: true });
  const alumniArr: any[] = (data as any) ?? [];
  const openCreate = () => { setEditItem(null); setForm({ name: "", role: "", company: "", quote: "", featured: true, published: true }); setShowForm(true); };
  const openEdit = (a: any) => { setEditItem(a); setForm({ name: a.name, role: a.role, company: a.company, quote: a.quote || "", featured: a.featured || true, published: a.published || true }); setShowForm(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display font-medium text-2xl text-[#faf8f3]">Alumni</h1><p className="text-xs text-[#8a8680] mt-0.5">{alumniArr.length} alumni members</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#e8d49a] transition-all hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]"><Plus size={14} /> New Alumni</button>
      </div>
      {showForm && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-6 rounded-lg mb-6 animate-fadeIn">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Role *</label><input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Company *</label><input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div className="flex items-end pb-2"><label className="flex items-center gap-2 text-xs text-[#8a8680] cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#c9a84c]" /> Featured</label></div>
            <div className="col-span-2"><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Quote</label><textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={2} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] resize-none" /></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => editItem ? updateMut.mutate({ id: editItem.id, ...form }) : createMut.mutate(form)} disabled={createMut.isPending || updateMut.isPending} className="px-6 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#e8d49a] transition-all disabled:opacity-50 flex items-center gap-2"><Save size={14} /> {editItem ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditItem(null); }} className="px-6 py-2.5 border border-[rgba(201,168,76,0.15)] text-[#8a8680] text-xs font-medium uppercase tracking-wider rounded-md hover:text-[#faf8f3] hover:border-[#c9a84c] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {!showForm && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
          {isLoading ? <SkeletonRow cols={5} /> : (
            <table className="w-full">
              <thead><tr className="border-b border-[rgba(201,168,76,0.08)]">{["Name", "Role", "Company", "Featured", "Actions"].map(h => <th key={h} className="text-left text-[0.6rem] uppercase tracking-wider text-[#8a8680] font-medium px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {alumniArr.map((a: any) => (
                  <tr key={a.id} className="border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors group">
                    <td className="px-4 py-3 text-xs text-[#faf8f3] font-medium">{a.name}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{a.role}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{a.company}</td>
                    <td className="px-4 py-3 text-xs text-[#c9a84c]">{a.featured ? "Yes" : "No"}</td>
                    <td className="px-4 py-3"><div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity"><button onClick={() => openEdit(a)} className="text-[#8a8680] hover:text-[#c9a84c] transition-colors p-1 rounded hover:bg-[rgba(201,168,76,0.08)]"><Pencil size={13} /></button><button onClick={() => { if (confirm("Delete?")) deleteMut.mutate({ id: a.id }); }} className="text-[#8a8680] hover:text-red-400 transition-colors p-1 rounded hover:bg-[rgba(255,0,0,0.05)]"><Trash2 size={13} /></button></div></td>
                  </tr>
                ))}
                {alumniArr.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-xs text-[#8a8680]">No alumni found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SPEAKERS TAB
   ═══════════════════════════════════════════════════════════════ */
function SpeakersTab({ showForm, setShowForm, editItem, setEditItem, toast }: any) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.cms.speakerList.useQuery({ limit: 50 });
  const createMut = trpc.admin.speakerCreate.useMutation({ onSuccess: () => { utils.cms.speakerList.invalidate(); setShowForm(false); toast("Speaker created", "success"); }, onError: (e) => toast(e.message, "error") });
  const updateMut = trpc.admin.speakerUpdate.useMutation({ onSuccess: () => { utils.cms.speakerList.invalidate(); setShowForm(false); setEditItem(null); toast("Speaker updated", "success"); }, onError: (e) => toast(e.message, "error") });
  const deleteMut = trpc.admin.speakerDelete.useMutation({ onSuccess: () => { utils.cms.speakerList.invalidate(); toast("Speaker deleted", "success"); }, onError: (e) => toast(e.message, "error") });
  const [form, setForm] = useState({ name: "", title: "", company: "", bio: "", featured: false });

  const speakersArr: any[] = (data as any) ?? [];
  const openCreate = () => { setEditItem(null); setForm({ name: "", title: "", company: "", bio: "", featured: false }); setShowForm(true); };
  const openEdit = (s: any) => { setEditItem(s); setForm({ name: s.name, title: s.title || "", company: s.company || "", bio: s.bio || "", featured: s.featured || false }); setShowForm(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display font-medium text-2xl text-[#faf8f3]">Speakers</h1><p className="text-xs text-[#8a8680] mt-0.5">{speakersArr.length} speakers</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#e8d49a] transition-all hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]"><Plus size={14} /> New Speaker</button>
      </div>
      {showForm && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-6 rounded-lg mb-6 animate-fadeIn">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Company</label><input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div className="flex items-end pb-2"><label className="flex items-center gap-2 text-xs text-[#8a8680] cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#c9a84c]" /> Featured</label></div>
            <div className="col-span-2"><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Bio</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] resize-none" /></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => editItem ? updateMut.mutate({ id: editItem.id, ...form }) : createMut.mutate(form)} disabled={createMut.isPending || updateMut.isPending} className="px-6 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#e8d49a] transition-all disabled:opacity-50 flex items-center gap-2"><Save size={14} /> {editItem ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditItem(null); }} className="px-6 py-2.5 border border-[rgba(201,168,76,0.15)] text-[#8a8680] text-xs font-medium uppercase tracking-wider rounded-md hover:text-[#faf8f3] hover:border-[#c9a84c] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {!showForm && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
          {isLoading ? <SkeletonRow cols={4} /> : (
            <table className="w-full">
              <thead><tr className="border-b border-[rgba(201,168,76,0.08)]">{["Name", "Title", "Company", "Actions"].map(h => <th key={h} className="text-left text-[0.6rem] uppercase tracking-wider text-[#8a8680] font-medium px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {speakersArr.map((s: any) => (
                  <tr key={s.id} className="border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors group">
                    <td className="px-4 py-3 text-xs text-[#faf8f3] font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{s.title}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{s.company}</td>
                    <td className="px-4 py-3"><div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity"><button onClick={() => openEdit(s)} className="text-[#8a8680] hover:text-[#c9a84c] transition-colors p-1 rounded hover:bg-[rgba(201,168,76,0.08)]"><Pencil size={13} /></button><button onClick={() => { if (confirm("Delete?")) deleteMut.mutate({ id: s.id }); }} className="text-[#8a8680] hover:text-red-400 transition-colors p-1 rounded hover:bg-[rgba(255,0,0,0.05)]"><Trash2 size={13} /></button></div></td>
                  </tr>
                ))}
                {speakersArr.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-xs text-[#8a8680]">No speakers found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADVISERS TAB (Full CRUD)
   ═══════════════════════════════════════════════════════════════ */
function AdvisersTab({ showForm, setShowForm, editItem, setEditItem, toast }: any) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.adviser.adminList.useQuery({ limit: 50 });
  const createMut = trpc.adviser.create.useMutation({
    onSuccess: () => { utils.adviser.adminList.invalidate(); setShowForm(false); toast("Adviser created", "success"); },
    onError: (e) => toast(e.message, "error"),
  });
  const updateMut = trpc.adviser.update.useMutation({
    onSuccess: () => { utils.adviser.adminList.invalidate(); setShowForm(false); setEditItem(null); toast("Adviser updated", "success"); },
    onError: (e) => toast(e.message, "error"),
  });
  const deleteMut = trpc.adviser.delete.useMutation({
    onSuccess: () => { utils.adviser.adminList.invalidate(); toast("Adviser deleted", "success"); },
    onError: (e) => toast(e.message, "error"),
  });

  const [form, setForm] = useState({
    name: "",
    title: "",
    company: "",
    bio: "",
    expertise: "",
    imageUrl: "",
    linkedInUrl: "",
    twitterUrl: "",
    websiteUrl: "",
    displayOrder: 0,
    featured: true,
    published: true,
  });

  const advisers: any[] = (data as any) ?? [];

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", title: "", company: "", bio: "", expertise: "", imageUrl: "", linkedInUrl: "", twitterUrl: "", websiteUrl: "", displayOrder: 0, featured: true, published: true });
    setShowForm(true);
  };

  const openEdit = (a: any) => {
    setEditItem(a);
    setForm({
      name: a.name,
      title: a.title || "",
      company: a.company || "",
      bio: a.bio || "",
      expertise: a.expertise || "",
      imageUrl: a.imageUrl || "",
      linkedInUrl: a.linkedInUrl || "",
      twitterUrl: a.twitterUrl || "",
      websiteUrl: a.websiteUrl || "",
      displayOrder: a.displayOrder || 0,
      featured: a.featured || true,
      published: a.published || true,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-medium text-2xl text-[#faf8f3]">Advisers</h1>
          <p className="text-xs text-[#8a8680] mt-0.5">{advisers.length} advisers</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#e8d49a] transition-all hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]">
          <Plus size={14} /> New Adviser
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-6 rounded-lg mb-6 animate-fadeIn">
          <h3 className="font-display font-medium text-lg text-[#faf8f3] mb-5">{editItem ? "Edit Adviser" : "Create Adviser"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Company</label><input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Display Order</label><input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div className="col-span-2"><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Bio</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] resize-none" /></div>
            <div className="col-span-2"><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Expertise (JSON array or comma-separated)</label><input type="text" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} placeholder='["Strategy","Growth"] or Strategy, Growth' className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] placeholder-[#444] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Image URL</label><input type="text" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] placeholder-[#444] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">LinkedIn URL</label><input type="text" value={form.linkedInUrl} onChange={(e) => setForm({ ...form, linkedInUrl: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Twitter URL</label><input type="text" value={form.twitterUrl} onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Website URL</label><input type="text" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div className="flex items-center gap-6 col-span-2">
              <label className="flex items-center gap-2 text-xs text-[#8a8680] cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#c9a84c]" /> Featured</label>
              <label className="flex items-center gap-2 text-xs text-[#8a8680] cursor-pointer"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-[#c9a84c]" /> Published</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => editItem ? updateMut.mutate({ id: editItem.id, ...form }) : createMut.mutate(form)} disabled={createMut.isPending || updateMut.isPending} className="px-6 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#e8d49a] transition-all disabled:opacity-50 flex items-center gap-2"><Save size={14} /> {editItem ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditItem(null); }} className="px-6 py-2.5 border border-[rgba(201,168,76,0.15)] text-[#8a8680] text-xs font-medium uppercase tracking-wider rounded-md hover:text-[#faf8f3] hover:border-[#c9a84c] transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      {!showForm && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
          {isLoading ? <SkeletonRow cols={7} /> : (
            <table className="w-full">
              <thead><tr className="border-b border-[rgba(201,168,76,0.08)]">{["Name", "Title", "Company", "Featured", "Published", "Order", "Actions"].map(h => <th key={h} className="text-left text-[0.6rem] uppercase tracking-wider text-[#8a8680] font-medium px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {advisers.map((a: any) => (
                  <tr key={a.id} className="border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors group">
                    <td className="px-4 py-3 text-xs text-[#faf8f3] font-medium">{a.name}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{a.title}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{a.company || "—"}</td>
                    <td className="px-4 py-3 text-xs text-[#c9a84c]">{a.featured ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{a.published ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8680]">{a.displayOrder ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(a)} className="text-[#8a8680] hover:text-[#c9a84c] transition-colors p-1 rounded hover:bg-[rgba(201,168,76,0.08)]"><Pencil size={13} /></button>
                        <button onClick={() => { if (confirm("Delete this adviser?")) deleteMut.mutate({ id: a.id }); }} className="text-[#8a8680] hover:text-red-400 transition-colors p-1 rounded hover:bg-[rgba(255,0,0,0.05)]"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {advisers.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-xs text-[#8a8680]">No advisers yet. Add your first adviser.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PARTNERS TAB (QA FIX: proper columns)
   ═══════════════════════════════════════════════════════════════ */
function PartnersTab({ toast }: { toast: (m: string, t?: any) => void }) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.partnerList.useQuery({ limit: 50 });
  const updateMut = trpc.admin.partnerUpdateStatus.useMutation({
    onSuccess: () => { utils.admin.partnerList.invalidate(); toast("Status updated", "success"); },
    onError: (e) => toast(e.message, "error"),
  });

  const partners: any[] = (data as any) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display font-medium text-2xl text-[#faf8f3]">Partner Inquiries</h1><p className="text-xs text-[#8a8680] mt-0.5">{partners.length} inquiries received</p></div>
      </div>
      <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
        {isLoading ? <SkeletonRow cols={7} /> : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(201,168,76,0.08)]">
                {["Organization", "Contact", "Email", "Type", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left text-[0.6rem] uppercase tracking-wider text-[#8a8680] font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {partners.map((p: any) => (
                <tr key={p.id} className="border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors group">
                  <td className="px-4 py-3 text-xs text-[#faf8f3] font-medium">{p.organizationName}</td>
                  <td className="px-4 py-3 text-xs text-[#8a8680]">{p.contactName}</td>
                  <td className="px-4 py-3 text-xs text-[#8a8680]">{p.email}</td>
                  <td className="px-4 py-3 text-xs text-[#8a8680]">{p.interestType?.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">
                    <select
                      value={p.status}
                      onChange={(e) => updateMut.mutate({ id: p.id, status: e.target.value as any })}
                      className="bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-2 py-1 rounded outline-none focus:border-[#c9a84c] cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="closed_won">Closed Won</option>
                      <option value="closed_lost">Closed Lost</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8a8680]">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => {}} className="text-[0.6rem] text-[#c9a84c] hover:text-[#e8d49a] uppercase tracking-wider transition-colors">View</button>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-xs text-[#8a8680]">No partner inquiries yet</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTACTS TAB
   ═══════════════════════════════════════════════════════════════ */
function ContactsTab({ toast }: { toast: (m: string, t?: any) => void }) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.contactList.useQuery({ limit: 50 });
  const updateMut = trpc.admin.contactUpdateStatus.useMutation({
    onSuccess: () => { utils.admin.contactList.invalidate(); toast("Status updated", "success"); },
    onError: (e) => toast(e.message, "error"),
  });

  const contacts: any[] = (data as any) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display font-medium text-2xl text-[#faf8f3]">Contact Submissions</h1><p className="text-xs text-[#8a8680] mt-0.5">{contacts.length} submissions</p></div>
      </div>
      <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
        {isLoading ? <SkeletonRow cols={6} /> : (
          <table className="w-full">
            <thead><tr className="border-b border-[rgba(201,168,76,0.08)]">{["Name", "Email", "Subject", "Message", "Status", "Date"].map(h => <th key={h} className="text-left text-[0.6rem] uppercase tracking-wider text-[#8a8680] font-medium px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {contacts.map((c: any) => (
                <tr key={c.id} className="border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors group">
                  <td className="px-4 py-3 text-xs text-[#faf8f3] font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-xs text-[#8a8680]">{c.email}</td>
                  <td className="px-4 py-3 text-xs text-[#8a8680]">{c.subject || "—"}</td>
                  <td className="px-4 py-3 text-xs text-[#8a8680] max-w-[200px] truncate">{c.message}</td>
                  <td className="px-4 py-3">
                    <select value={c.status} onChange={(e) => updateMut.mutate({ id: c.id, status: e.target.value as any })} className="bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-2 py-1 rounded outline-none focus:border-[#c9a84c] cursor-pointer">
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8a8680]">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {contacts.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-xs text-[#8a8680]">No contact submissions yet</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS TAB (with Create)
   ═══════════════════════════════════════════════════════════════ */
function SettingsTab({ toast }: { toast: (m: string, t?: any) => void }) {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.admin.settingsList.useQuery();
  const updateMut = trpc.admin.settingUpdate.useMutation({
    onSuccess: () => { utils.admin.settingsList.invalidate(); toast("Setting saved", "success"); },
    onError: (e) => toast(e.message, "error"),
  });
  const createMut = trpc.admin.settingCreate.useMutation({
    onSuccess: () => { utils.admin.settingsList.invalidate(); toast("Setting created", "success"); },
    onError: (e) => toast(e.message, "error"),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: "", value: "", type: "text" as any, group: "general", label: "" });

  const grouped = (settings as any[])?.reduce((acc: any, s) => {
    const g = s.group || "general";
    if (!acc[g]) acc[g] = [];
    acc[g].push(s);
    return acc;
  }, {}) ?? {};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display font-medium text-2xl text-[#faf8f3]">Site Settings</h1><p className="text-xs text-[#8a8680] mt-0.5">Manage all site configuration</p></div>
        <button onClick={() => { setShowCreate(!showCreate); setNewSetting({ key: "", value: "", type: "text", group: "general", label: "" }); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#e8d49a] transition-all hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]"><Plus size={14} /> Add Setting</button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-5 rounded-lg mb-6 animate-fadeIn">
          <h3 className="font-display font-medium text-sm text-[#faf8f3] mb-4">New Setting</h3>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Key *</label><input type="text" value={newSetting.key} onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })} placeholder="e.g. site_name" className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] placeholder-[#555] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Label</label><input type="text" value={newSetting.label} onChange={(e) => setNewSetting({ ...newSetting, label: e.target.value })} placeholder="Display name" className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] placeholder-[#555] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Group</label><input type="text" value={newSetting.group} onChange={(e) => setNewSetting({ ...newSetting, group: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div className="col-span-2"><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Value</label><input type="text" value={newSetting.value} onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div>
              <label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Type</label>
              <select value={newSetting.type} onChange={(e) => setNewSetting({ ...newSetting, type: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]">
                {["text", "image", "json", "boolean", "number"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { if (newSetting.key) createMut.mutate(newSetting); setShowCreate(false); }} disabled={createMut.isPending} className="px-5 py-2 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#e8d49a] transition-all disabled:opacity-50 flex items-center gap-2"><Save size={13} /> Create</button>
            <button onClick={() => setShowCreate(false)} className="px-5 py-2 border border-[rgba(201,168,76,0.15)] text-[#8a8680] text-xs font-medium uppercase tracking-wider rounded-md hover:text-[#faf8f3] hover:border-[#c9a84c] transition-all">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <SkeletonRow cols={2} /> : (
        <>
          {Object.entries(grouped).map(([group, items]: [string, any]) => (
            <div key={group} className="mb-8">
              <h2 className="text-[0.7rem] uppercase tracking-[0.15em] text-[#c9a84c] font-medium mb-3 flex items-center gap-2">
                <Settings size={12} /> {group}
              </h2>
              <div className="bg-[#141414] border border-[rgba(201,168,76,0.06)] rounded-lg overflow-hidden">
                {items.map((s: any) => (
                  <div key={s.key} className="flex items-center gap-4 px-4 py-3 border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.02)] transition-colors group">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#faf8f3]">{s.label || s.key}</div>
                      <div className="text-[0.6rem] text-[#555] uppercase tracking-wider">{s.type}</div>
                    </div>
                    <div className="flex-[2]">
                      <input type="text" defaultValue={s.value || ""} onBlur={(e) => { if (e.target.value !== s.value) updateMut.mutate({ key: s.key, value: e.target.value }); }} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.08)] text-xs text-[#faf8f3] px-3 py-2 rounded-md outline-none focus:border-[#c9a84c] transition-colors group-hover:border-[rgba(201,168,76,0.15)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTENT TAB (with Create)
   ═══════════════════════════════════════════════════════════════ */
function ContentTab({ toast }: { toast: (m: string, t?: any) => void }) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.contentList.useQuery();
  const updateMut = trpc.admin.contentUpdate.useMutation({
    onSuccess: () => { utils.admin.contentList.invalidate(); toast("Content saved", "success"); },
    onError: (e) => toast(e.message, "error"),
  });
  const createMut = trpc.admin.contentCreate.useMutation({
    onSuccess: () => { utils.admin.contentList.invalidate(); toast("Content block created", "success"); },
    onError: (e) => toast(e.message, "error"),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [newBlock, setNewBlock] = useState({ key: "", title: "", content: "", section: "about", type: "text" as any });

  const blocks: any[] = (data as any) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display font-medium text-2xl text-[#faf8f3]">Content Blocks</h1><p className="text-xs text-[#8a8680] mt-0.5">{blocks.length} content blocks</p></div>
        <button onClick={() => { setShowCreate(!showCreate); setNewBlock({ key: "", title: "", content: "", section: "about", type: "text" }); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#e8d49a] transition-all hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]"><Plus size={14} /> Add Block</button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-5 rounded-lg mb-6 animate-fadeIn">
          <h3 className="font-display font-medium text-sm text-[#faf8f3] mb-4">New Content Block</h3>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Key *</label><input type="text" value={newBlock.key} onChange={(e) => setNewBlock({ ...newBlock, key: e.target.value })} placeholder="unique_key" className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] placeholder-[#555] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Title</label><input type="text" value={newBlock.title} onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]" /></div>
            <div><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Section</label>
              <select value={newBlock.section} onChange={(e) => setNewBlock({ ...newBlock, section: e.target.value })} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c]">
                {["about", "vision", "hero", "programs", "footer"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3"><label className="block text-[0.6rem] uppercase tracking-wider text-[#8a8680] mb-1.5">Content</label><textarea value={newBlock.content} onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })} rows={3} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.1)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] resize-none" /></div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { if (newBlock.key) createMut.mutate({ ...newBlock, published: true }); setShowCreate(false); }} disabled={createMut.isPending} className="px-5 py-2 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-md hover:bg-[#e8d49a] transition-all disabled:opacity-50 flex items-center gap-2"><Save size={13} /> Create</button>
            <button onClick={() => setShowCreate(false)} className="px-5 py-2 border border-[rgba(201,168,76,0.15)] text-[#8a8680] text-xs font-medium uppercase tracking-wider rounded-md hover:text-[#faf8f3] hover:border-[#c9a84c] transition-all">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <SkeletonRow cols={1} /> : (
        <div className="space-y-3">
          {blocks.map((block: any) => (
            <div key={block.id} className="bg-[#141414] border border-[rgba(201,168,76,0.06)] hover:border-[rgba(201,168,76,0.12)] p-5 rounded-lg transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-[#faf8f3]">{block.title || block.key}</div>
                  <div className="text-[0.6rem] uppercase tracking-wider text-[#8a8680] mt-0.5">{block.section} &middot; {block.type} &middot; <span className="text-[#c9a84c]">order {block.displayOrder ?? 0}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[0.6rem] text-[#8a8680] cursor-pointer hover:text-[#e0ddd5] transition-colors">
                    <input type="checkbox" checked={block.published} onChange={(e) => updateMut.mutate({ id: block.id, published: e.target.checked })} className="accent-[#c9a84c]" /> Published
                  </label>
                </div>
              </div>
              <textarea defaultValue={block.content || ""} onBlur={(e) => { if (e.target.value !== block.content) updateMut.mutate({ id: block.id, content: e.target.value }); }} rows={3} className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.06)] text-xs text-[#faf8f3] px-3 py-2.5 rounded-md outline-none focus:border-[#c9a84c] resize-none transition-colors group-hover:border-[rgba(201,168,76,0.1)]" />
            </div>
          ))}
          {blocks.length === 0 && <div className="text-center text-xs text-[#8a8680] py-12">No content blocks yet</div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MONITORING TAB
   ═══════════════════════════════════════════════════════════════ */
function MonitoringTab() {
  const { data: health, refetch } = trpc.health.check.useQuery(undefined, { refetchInterval: 10000 });
  const { data: stats } = trpc.health.stats.useQuery(undefined, { refetchInterval: 30000 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-medium text-2xl text-[#faf8f3]">System Monitoring</h1>
        <button onClick={() => refetch()} className="px-4 py-2 bg-[#c9a84c] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#e8d49a] transition-all flex items-center gap-2 hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]">
          <Zap size={13} /> Refresh
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "System Status", value: health?.status?.toUpperCase() || "CHECKING", color: health?.status === "healthy" ? "text-emerald-400" : "text-amber-400" },
          { label: "DB Latency", value: `${health?.services?.database?.latency ?? "-"}ms`, color: "text-[#c9a84c]" },
          { label: "Response Time", value: `${health?.totalLatency ?? "-"}ms`, color: "text-[#c9a84c]" },
        ].map((card) => (
          <div key={card.label} className="bg-[#141414] border border-[rgba(201,168,76,0.08)] p-5 rounded-lg">
            <div className="text-[0.6rem] uppercase tracking-[0.15em] text-[#8a8680] mb-2">{card.label}</div>
            <div className={`font-mono text-xl font-medium ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Service Details */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.08)] p-5 rounded-lg">
          <div className="text-[0.7rem] uppercase tracking-[0.15em] text-[#c9a84c] font-medium mb-4 flex items-center gap-2"><BarChart3 size={12} /> Database</div>
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs"><span className="text-[#8a8680]">Status</span><span className={health?.services?.database?.status === "up" ? "text-emerald-400" : "text-red-400"}>{health?.services?.database?.status ?? "unknown"}</span></div>
            <div className="flex justify-between text-xs"><span className="text-[#8a8680]">Latency</span><span className="text-[#faf8f3]">{health?.services?.database?.latency ?? "-"}ms</span></div>
          </div>
        </div>
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.08)] p-5 rounded-lg">
          <div className="text-[0.7rem] uppercase tracking-[0.15em] text-[#c9a84c] font-medium mb-4 flex items-center gap-2"><Zap size={12} /> Cache (Redis)</div>
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs"><span className="text-[#8a8680]">Status</span><span className={stats?.cache?.status === "up" ? "text-emerald-400" : "text-red-400"}>{stats?.cache?.status ?? "unknown"}</span></div>
            <div className="flex justify-between text-xs"><span className="text-[#8a8680]">Connected Clients</span><span className="text-[#faf8f3]">{stats?.cache?.connectedClients ?? 0}</span></div>
            <div className="flex justify-between text-xs"><span className="text-[#8a8680]">Cache Hit Rate</span><span className="text-[#c9a84c]">{stats?.cache?.hitRate ?? 0}%</span></div>
          </div>
        </div>
      </div>

      {/* Performance Config */}
      <div className="bg-[#141414] border border-[rgba(201,168,76,0.08)] p-6 rounded-lg">
        <div className="text-[0.7rem] uppercase tracking-[0.15em] text-[#c9a84c] font-medium mb-5 flex items-center gap-2"><TrendingUp size={12} /> Performance Configuration</div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {[
            ["DB Connection Pool", "30 connections"],
            ["Request Queue Limit", "100 queued"],
            ["Query Timeout", "30 seconds"],
            ["Cache TTL (Events)", "120 seconds"],
            ["Cache TTL (Lists)", "60 seconds"],
            ["Registration Lock TTL", "5 seconds"],
            ["Rate Limit (Public)", "100 req/min"],
            ["Rate Limit (Registration)", "10 req/min"],
            ["Burst Limit (Per Event)", "50 req/sec"],
            ["Max Event List Size", "100 items"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs border-b border-[rgba(201,168,76,0.04)] pb-2"><span className="text-[#8a8680]">{k}</span><span className="text-[#faf8f3] font-mono">{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
