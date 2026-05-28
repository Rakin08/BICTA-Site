"use client";

import { ShieldAlert, Ban, ListX } from "lucide-react";
import type { ViolationEvent } from "@/types/competition";

interface DisqualifiedOverlayProps {
  reason: string;
  violations: ViolationEvent[];
  userName?: string;
  onExit: () => void;
}

export default function DisqualifiedOverlay({
  reason,
  violations,
  userName = "Participant",
  onExit,
}: DisqualifiedOverlayProps) {
  const violationTypes: Record<string, string> = {
    tab_switch: "Tab Switching",
    fullscreen_exit: "Exited Fullscreen",
    copy_paste: "Copy/Paste Attempt",
    right_click: "Right-Click Attempt",
    camera_off: "Camera Turned Off",
    face_not_visible: "Face Not Visible",
    multiple_faces: "Multiple Faces Detected",
    screenshot: "Screenshot Attempt",
    window_blur: "Window Lost Focus",
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bicta-void flex items-center justify-center p-4">
      <div className="bg-bicta-surface border border-red-500/30 rounded-2xl p-8 md:p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={36} className="text-red-400" />
        </div>

        <h1 className="font-display text-3xl text-red-400 mb-2">
          Disqualified
        </h1>
        <p className="font-body text-bicta-muted mb-2">
          {userName}, you have been disqualified from this competition.
        </p>
        <p className="font-body text-sm text-red-300/80 mb-8 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
          {reason}
        </p>

        {/* Violation Summary */}
        <div className="text-left mb-8">
          <h3 className="font-body text-xs uppercase tracking-wider text-bicta-subtle mb-3 flex items-center gap-2">
            <ListX size={14} /> Violation Log
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {violations.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between bg-bicta-raised rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Ban size={12} className="text-red-400" />
                  <span className="text-xs font-body text-bicta-muted">
                    {violationTypes[v.type] || v.type}
                  </span>
                </div>
                <span className="text-[0.6rem] font-mono text-bicta-subtle">
                  {new Date(v.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onExit}
          className="w-full px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-body font-medium text-sm uppercase tracking-wider rounded-lg hover:bg-red-500/20 transition-colors"
        >
          Exit Exam
        </button>
      </div>
    </div>
  );
}
