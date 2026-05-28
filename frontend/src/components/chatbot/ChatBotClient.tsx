"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, MessageCircle, Send, Bot, User, Loader2, ExternalLink, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Utility ──────────────────────────────────────────────
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Types ────────────────────────────────────────────────
interface QuickAction {
  label: string;
  response: string;
  link?: string;
  linkLabel?: string;
}

interface SuggestedLink {
  label: string;
  url: string;
}

interface FAQResponse {
  keywords: string[];
  response: string;
  suggestedLinks?: SuggestedLink[];
}

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  quickActions?: QuickAction[];
  suggestedLinks?: SuggestedLink[];
  isContactCTA?: boolean;
  timestamp: Date;
}

export interface ChatbotConfig {
  isEnabled?: boolean;
  botName?: string;
  themeColor?: string;
  position?: "bottom-right" | "bottom-left";
  greeting?: string;
  greetingDelay?: number;
  inputPlaceholder?: string;
  offlineMessage?: string;
  quickActions?: QuickAction[];
  faqResponses?: FAQResponse[];
  fallbackResponse?: string;
  fallbackQuickActions?: boolean;
  typingIndicatorDuration?: number;
  maxConversationLength?: number;
  contactCTA?: string;
  contactButtonText?: string;
  contactLink?: string;
}

// ── UUID Generator ───────────────────────────────────────
let msgId = 0;
const uid = () => `msg-${++msgId}-${Date.now()}`;

// ── Local Storage Helpers ────────────────────────────────
const LS_KEY = "bicta_chat_state";

function loadChatState(): { messages: ChatMessage[]; isOpen: boolean; hasGreeted: boolean } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      messages: parsed.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    };
  } catch {
    return null;
  }
}

function saveChatState(state: { messages: ChatMessage[]; isOpen: boolean; hasGreeted: boolean }) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // Storage full — ignore
  }
}

function clearChatState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_KEY);
}

// ── Default Config ───────────────────────────────────────
const DEFAULT_CONFIG: Required<ChatbotConfig> = {
  isEnabled: true,
  botName: "BICTA Assistant",
  themeColor: "#c9a84c",
  position: "bottom-right",
  greeting: "Hello! Welcome to BICTA. How can I help you today?",
  greetingDelay: 3000,
  inputPlaceholder: "Type your message...",
  offlineMessage: "Thank you for chatting with us! For further assistance, email us at info@bicta.org",
  quickActions: [
    { label: "Programs", response: "BICTA runs three flagship programs:\n\n1. **AI Olympiad** — National competition for students\n2. **AI for SDG** — AI solutions for Sustainable Development Goals\n3. **Datathon Series** — Data science competitions\n\nWhich would you like to learn more about?", link: "/programs/", linkLabel: "View All Programs" },
    { label: "Events", response: "We host multiple events throughout the year including competitions, workshops, summits, and training programs. Check our Events page for the latest updates!", link: "/events/", linkLabel: "View Events" },
    { label: "Partners", response: "BICTA collaborates with leading universities, tech companies, and government bodies. Join our partner network to make an impact!", link: "/partners/", linkLabel: "Become a Partner" },
    { label: "Contact", response: "You can reach us through our Contact page or email us directly at info@bicta.org. We'd love to hear from you!", link: "/contact/", linkLabel: "Go to Contact" },
  ],
  faqResponses: [
    {
      keywords: ["hello", "hi", "hey", "greetings"],
      response: "Hello there! Welcome to BICTA — Bangladesh ICT Alliance. How can I assist you today? Feel free to ask about our programs, events, partnerships, or anything else!",
    },
    {
      keywords: ["register", "signup", "sign up", "join", "enroll", "registration"],
      response: "You can register for our competitions and events through the Events page. Select the event you're interested in and click the Register button. For program participation, visit our Programs page!",
      suggestedLinks: [{ label: "View Events", url: "/events/" }, { label: "View Programs", url: "/programs/" }],
    },
    {
      keywords: ["program", "olympiad", "datathon", "sdg", "ai for sdg"],
      response: "Our three flagship programs are:\n\n**AI Olympiad** — A national-level competition that tests students' AI and programming skills through multiple rounds.\n\n**AI for SDG** — Encourages participants to develop AI-powered solutions addressing UN Sustainable Development Goals.\n\n**Datathon Series** — Data science competitions where participants solve real-world problems using data analysis and machine learning.",
      suggestedLinks: [{ label: "Explore Programs", url: "/programs/" }],
    },
    {
      keywords: ["event", "competition", "contest", "hackathon"],
      response: "We organize various events throughout the year:\n\n- **AI Olympiad Finals** — Annual national championship\n- **Datathon Challenges** — Quarterly data science competitions\n- **AI for SDG Showcase** — Solution presentations\n- **Training Workshops** — Regular skill-building sessions\n- **Annual Summit** — Industry-academia convergence\n\nCheck our Events page for upcoming dates!",
      suggestedLinks: [{ label: "Browse Events", url: "/events/" }],
    },
    {
      keywords: ["partner", "sponsor", "collaboration", "support", "donate"],
      response: "BICTA partners with universities, tech companies, government agencies, and international organizations. We offer multiple partnership tiers: Platinum, Gold, and Silver. Each tier comes with unique benefits including brand visibility, talent access, and event co-hosting opportunities.",
      suggestedLinks: [{ label: "Partner with Us", url: "/partners/" }],
    },
    {
      keywords: ["contact", "email", "phone", "reach", "help", "support"],
      response: "You can reach BICTA through:\n\n- **Email:** info@bicta.org\n- **Contact Page:** Visit our contact page for the inquiry form\n- **Social Media:** Follow us for updates\n\nOur team typically responds within 24-48 hours.",
      suggestedLinks: [{ label: "Contact Page", url: "/contact/" }],
    },
    {
      keywords: ["about", "what is", "who", "bicta"],
      response: "BICTA (Bangladesh ICT Alliance) is a pioneering initiative bridging academia and industry through national programs. We focus on developing ICT talent in Bangladesh through competitions, training, and partnerships. Our mission is to position Bangladesh as a global hub for AI and data science talent.",
      suggestedLinks: [{ label: "Learn More About Us", url: "/about/" }],
    },
    {
      keywords: ["eligibility", "who can", "qualify", "requirement"],
      response: "Eligibility varies by program:\n\n**AI Olympiad:** University students (undergraduate/graduate) from Bangladesh\n**AI for SDG:** Open to students, professionals, and teams\n**Datathon:** Anyone with data science interest — students, professionals, researchers\n\nSpecific eligibility criteria are listed on each event's page.",
    },
    {
      keywords: ["prize", "award", "winner", "reward", "scholarship"],
      response: "Yes! Our competitions offer exciting prizes:\n\n**AI Olympiad:** Cash prizes, certificates, internship opportunities with partner companies\n**Datathon:** Prize pool, mentorship programs, industry recognition\n**AI for SDG:** Grants for implementation, showcase at international forums\n\nPrize details are announced with each event.",
    },
    {
      keywords: ["schedule", "date", "when", "time", "deadline", "upcoming"],
      response: "Event schedules are updated regularly on our Events page. Key annual milestones:\n\n- **AI Olympiad:** Registration opens January, Finals in July\n- **Datathon Series:** Quarterly (March, June, September, December)\n- **AI for SDG:** Annual cycle with showcases in November\n- **Training Workshops:** Monthly sessions\n\nVisit our Events page for exact dates!",
      suggestedLinks: [{ label: "View Event Calendar", url: "/events/" }],
    },
    {
      keywords: ["thank", "thanks", "appreciate", "goodbye", "bye"],
      response: "You're very welcome! It was a pleasure helping you. Feel free to come back anytime if you have more questions about BICTA, our programs, or events. Have a great day!",
    },
    {
      keywords: ["location", "where", "address", "office", "dhaka", "bangladesh"],
      response: "BICTA operates nationwide in Bangladesh with our primary activities centered in Dhaka. We collaborate with universities and organizations across the country. Our events are hosted at various partner venues. Specific event locations are shared on the event detail pages.",
    },
  ],
  fallbackResponse: "I'm not sure I understood that correctly. Here are some things I can help you with:",
  fallbackQuickActions: true,
  typingIndicatorDuration: 1200,
  maxConversationLength: 10,
  contactCTA: "Would you like to speak with our team directly?",
  contactButtonText: "Contact Us",
  contactLink: "/contact/",
};

// ── Response Matching Engine ─────────────────────────────
function findBestResponse(
  userText: string,
  faqResponses: FAQResponse[]
): FAQResponse | null {
  const lower = userText.toLowerCase().trim();

  // Exact keyword match
  for (const faq of faqResponses) {
    for (const kw of faq.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return faq;
      }
    }
  }

  // Word overlap scoring
  const userWords = lower.split(/\s+/);
  let bestMatch: FAQResponse | null = null;
  let bestScore = 0;

  for (const faq of faqResponses) {
    let score = 0;
    for (const kw of faq.keywords) {
      const kwWords = kw.toLowerCase().split(/\s+/);
      for (const kwWord of kwWords) {
        if (userWords.includes(kwWord)) score += 2;
        // Partial word match
        for (const uw of userWords) {
          if (uw.length > 3 && kwWord.includes(uw)) score += 1;
          if (kwWord.length > 3 && uw.includes(kwWord)) score += 1;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  // Threshold: need at least 2 points to be a match
  return bestScore >= 2 ? bestMatch : null;
}

// ── Main ChatBot Component ───────────────────────────────
export default function ChatBot({ config }: { config?: ChatbotConfig }) {
  const cfg: Required<ChatbotConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
    quickActions: config?.quickActions ?? DEFAULT_CONFIG.quickActions,
    faqResponses: config?.faqResponses ?? DEFAULT_CONFIG.faqResponses,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = loadChatState();
    if (saved) {
      setMessages(saved.messages);
      setIsOpen(saved.isOpen);
      setHasGreeted(saved.hasGreeted);
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    saveChatState({ messages, isOpen, hasGreeted });
  }, [messages, isOpen, hasGreeted]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Greeting on first visit
  useEffect(() => {
    if (!hasGreeted && !isOpen) {
      const timer = setTimeout(() => {
        setShowBadge(true);
      }, cfg.greetingDelay);
      return () => clearTimeout(timer);
    }
  }, [hasGreeted, isOpen, cfg.greetingDelay]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setShowBadge(false);
    if (!hasGreeted) {
      setHasGreeted(true);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "bot",
            text: cfg.greeting,
            quickActions: cfg.quickActions,
            timestamp: new Date(),
          },
        ]);
      }, cfg.typingIndicatorDuration);
    }
  }, [hasGreeted, cfg.greeting, cfg.typingIndicatorDuration, cfg.quickActions]);

  const addBotMessage = useCallback(
    (
      text: string,
      options?: {
        quickActions?: QuickAction[];
        suggestedLinks?: SuggestedLink[];
        isContactCTA?: boolean;
      }
    ) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "bot",
            text,
            quickActions: options?.quickActions,
            suggestedLinks: options?.suggestedLinks,
            isContactCTA: options?.isContactCTA,
            timestamp: new Date(),
          },
        ]);
      }, cfg.typingIndicatorDuration);
    },
    [cfg.typingIndicatorDuration]
  );

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      // Add user message
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "user", text: text.trim(), timestamp: new Date() },
      ]);
      setInput("");

      // Find matching response
      const match = findBestResponse(text, cfg.faqResponses);

      if (match) {
        addBotMessage(match.response, {
          suggestedLinks: match.suggestedLinks,
        });
      } else {
        // Fallback response
        const shouldShowQuickActions = cfg.fallbackQuickActions;
        addBotMessage(cfg.fallbackResponse, {
          quickActions: shouldShowQuickActions ? cfg.quickActions : undefined,
        });
      }

      // Check if we should show contact CTA
      const newMessageCount = messages.length + 2; // user + bot
      if (newMessageCount >= (cfg.maxConversationLength || 10)) {
        setTimeout(() => {
          addBotMessage(cfg.contactCTA, {
            isContactCTA: true,
          });
        }, cfg.typingIndicatorDuration + 500);
      }
    },
    [messages.length, cfg, addBotMessage]
  );

  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      // Show user clicked the button
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "user",
          text: action.label,
          timestamp: new Date(),
        },
      ]);

      // Show bot response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const botMsg: ChatMessage = {
          id: uid(),
          role: "bot",
          text: action.response,
          timestamp: new Date(),
        };
        if (action.link) {
          botMsg.suggestedLinks = [
            { label: action.linkLabel || "Learn More", url: action.link },
          ];
        }
        setMessages((prev) => [...prev, botMsg]);
      }, cfg.typingIndicatorDuration);
    },
    [cfg.typingIndicatorDuration]
  );

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setHasGreeted(false);
    clearChatState();
    // Re-trigger greeting
    setTimeout(() => {
      handleOpen();
    }, 100);
  }, [handleOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  // Don't render if disabled
  if (cfg.isEnabled === false) return null;

  const isRight = cfg.position === "bottom-right";

  return (
    <>
      {/* ── Chat Toggle Button ── */}
      <div
        className={cn(
          "fixed bottom-6 z-50 flex flex-col items-end gap-2",
          isRight ? "right-6" : "left-6"
        )}
      >
        {/* Notification Badge */}
        {showBadge && !isOpen && (
          <div
            className="mb-1 max-w-[260px] cursor-pointer rounded-xl bg-bicta-elevated px-4 py-3 shadow-lg shadow-black/30 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-500"
            onClick={handleOpen}
          >
            <p className="text-sm text-bicta-cream/90">{cfg.greeting}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-bicta-gold/80">
              <span>Click to chat</span>
              <ChevronRight className="w-3 h-3" />
            </div>
            {/* Arrow */}
            <div
              className={cn(
                "absolute -bottom-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-bicta-elevated",
                isRight ? "right-6" : "left-6"
              )}
            />
          </div>
        )}

        <button
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          className={cn(
            "group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
            "bg-gradient-to-br from-bicta-gold to-amber-600 text-bicta-void"
          )}
          style={{ background: `linear-gradient(135deg, ${cfg.themeColor}, ${cfg.themeColor}dd)` }}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X className="h-6 w-6 transition-transform duration-300 rotate-0" />
          ) : (
            <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
          )}
          {/* Pulse ring */}
          {!isOpen && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: cfg.themeColor }}
            />
          )}
        </button>
      </div>

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50",
            "bg-bicta-void/95 backdrop-blur-xl",
            "animate-in fade-in slide-in-from-bottom-5 duration-300",
            // Mobile: full screen
            "inset-4 sm:inset-auto",
            // Desktop: floating panel
            "sm:bottom-24 sm:w-[420px] sm:h-[600px]",
            isRight ? "sm:right-6" : "sm:left-6"
          )}
          ref={chatContainerRef}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b border-white/10"
            style={{
              background: `linear-gradient(135deg, ${cfg.themeColor}22, ${cfg.themeColor}11)`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${cfg.themeColor}33` }}
              >
                <Bot className="h-5 w-5" style={{ color: cfg.themeColor }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-bicta-cream">
                  {cfg.botName}
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-bicta-cream/50">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="rounded-lg p-2 text-bicta-cream/40 hover:text-bicta-cream/80 hover:bg-white/5 transition-colors text-xs"
                title="Restart conversation"
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-bicta-cream/40 hover:text-bicta-cream/80 hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${cfg.themeColor}15` }}
                >
                  <Bot className="h-8 w-8" style={{ color: cfg.themeColor }} />
                </div>
                <div>
                  <p className="text-bicta-cream/80 font-medium text-sm">
                    {cfg.botName}
                  </p>
                  <p className="text-bicta-cream/40 text-xs mt-1 max-w-[250px]">
                    Ask me about programs, events, partnerships, or anything about BICTA!
                  </p>
                </div>
                {/* Suggested quick actions */}
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {cfg.quickActions.slice(0, 4).map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action)}
                      className="rounded-full px-3 py-1.5 text-xs border border-white/10 text-bicta-cream/60 hover:text-bicta-cream hover:border-white/20 hover:bg-white/5 transition-all"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div
                  className={cn(
                    "flex gap-2.5",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-0.5",
                      msg.role === "user"
                        ? "bg-white/10"
                        : "bg-white/5"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="h-3.5 w-3.5 text-bicta-cream/60" />
                    ) : (
                      <Bot
                        className="h-3.5 w-3.5"
                        style={{ color: cfg.themeColor }}
                      />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-bicta-gold/20 text-bicta-cream border border-bicta-gold/20"
                        : "bg-bicta-elevated text-bicta-cream/90 border border-white/5"
                    )}
                    style={
                      msg.role === "user"
                        ? {
                            backgroundColor: `${cfg.themeColor}20`,
                            borderColor: `${cfg.themeColor}30`,
                          }
                        : {}
                    }
                  >
                    {/* Parse basic markdown-like formatting */}
                    <MessageText text={msg.text} />
                  </div>
                </div>

                {/* Suggested Links */}
                {msg.suggestedLinks && msg.suggestedLinks.length > 0 && (
                  <div
                    className={cn(
                      "flex flex-wrap gap-2",
                      msg.role === "user" ? "justify-end pr-10" : "pl-10"
                    )}
                  >
                    {msg.suggestedLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80 border"
                        style={{
                          backgroundColor: `${cfg.themeColor}15`,
                          borderColor: `${cfg.themeColor}30`,
                          color: cfg.themeColor,
                        }}
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Quick Action Buttons */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div
                    className={cn(
                      "flex flex-wrap gap-2",
                      msg.role === "user" ? "justify-end pr-10" : "pl-10"
                    )}
                  >
                    {msg.quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80 border"
                        style={{
                          backgroundColor: `${cfg.themeColor}15`,
                          borderColor: `${cfg.themeColor}30`,
                          color: cfg.themeColor,
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Contact CTA */}
                {msg.isContactCTA && (
                  <div className="flex justify-center pl-10">
                    <a
                      href={cfg.contactLink}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90"
                      style={{ backgroundColor: cfg.themeColor, color: "#0a0a0a" }}
                    >
                      {cfg.contactButtonText}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={cn(
                    "text-[10px] text-bicta-cream/20",
                    msg.role === "user" ? "text-right pr-10" : "pl-10"
                  )}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5"
                >
                  <Bot
                    className="h-3.5 w-3.5"
                    style={{ color: cfg.themeColor }}
                  />
                </div>
                <div className="rounded-2xl bg-bicta-elevated border border-white/5 px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span
                      className="h-2 w-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: cfg.themeColor,
                        animationDelay: "0ms",
                      }}
                    />
                    <span
                      className="h-2 w-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: cfg.themeColor,
                        animationDelay: "150ms",
                      }}
                    />
                    <span
                      className="h-2 w-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: cfg.themeColor,
                        animationDelay: "300ms",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 px-4 py-3 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={cfg.inputPlaceholder}
              className="flex-1 rounded-xl bg-bicta-elevated border border-white/10 px-4 py-2.5 text-sm text-bicta-cream placeholder:text-bicta-cream/30 focus:outline-none focus:border-bicta-gold/50 transition-colors"
              style={{
                // @ts-ignore
                "--tw-border-opacity": 1,
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
              style={{ backgroundColor: cfg.themeColor }}
            >
              <Send className="h-4 w-4 text-bicta-void" />
            </button>
          </form>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/5 text-center">
            <p className="text-[10px] text-bicta-cream/20">
              Powered by BICTA
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ── Message Text Parser ──────────────────────────────────
function MessageText({ text }: { text: string }) {
  // Parse **bold** and basic formatting
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-bicta-cream">
              {part.slice(2, -2)}
            </strong>
          );
        }
        // Handle newlines
        return (
          <span key={i}>
            {part.split("\n").map((line, j) => (
              <React.Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </span>
        );
      })}
    </>
  );
}
