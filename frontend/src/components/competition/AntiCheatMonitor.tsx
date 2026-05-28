"use client";

import { Shield, Camera, Maximize, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AntiCheatState } from "@/hooks/useAntiCheat";

interface AntiCheatMonitorProps {
  state: AntiCheatState;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  maxViolations: number;
}

export default function AntiCheatMonitor({
  state,
  videoRef,
  canvasRef,
  maxViolations,
}: AntiCheatMonitorProps) {
  const {
    isFullscreen,
    isCameraOn,
    isFaceVisible,
    violationCount,
    warnings,
    isDisqualified,
  } = state;

  if (isDisqualified) return null;

  return (
    <div className="fixed top-20 right-4 z-40 w-72 space-y-3">
      {/* Camera Feed */}
      <div className="bg-bicta-surface border border-bicta-border rounded-xl overflow-hidden shadow-card-default">
        <div className="flex items-center justify-between px-3 py-2 border-b border-bicta-border">
          <div className="flex items-center gap-2">
            <Camera size={12} className={isCameraOn ? "text-emerald-400" : "text-red-400"} />
            <span className="text-[0.6875rem] uppercase tracking-wider text-bicta-subtle font-body">
              Proctoring
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {isFaceVisible ? (
              <Eye size={12} className="text-emerald-400" />
            ) : (
              <EyeOff size={12} className="text-red-400 animate-pulse" />
            )}
            <span
              className={cn(
                "text-[0.6rem] uppercase tracking-wider font-body",
                isFaceVisible ? "text-emerald-400" : "text-red-400"
              )}
            >
              {isFaceVisible ? "Face OK" : "No Face"}
            </span>
          </div>
        </div>
        <div className="relative aspect-video bg-bicta-void">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-bicta-void/80">
              <Camera size={24} className="text-bicta-subtle" />
            </div>
          )}
        </div>
      </div>

      {/* Status Panel */}
      <div className="bg-bicta-surface border border-bicta-border rounded-xl p-3 space-y-2">
        {/* Fullscreen */}
        <div className="flex items-center gap-2">
          <Maximize
            size={12}
            className={isFullscreen ? "text-emerald-400" : "text-red-400"}
          />
          <span className="text-xs font-body text-bicta-muted">
            Fullscreen: {isFullscreen ? "Active" : "Required"}
          </span>
        </div>

        {/* Camera */}
        <div className="flex items-center gap-2">
          <Camera
            size={12}
            className={isCameraOn ? "text-emerald-400" : "text-red-400"}
          />
          <span className="text-xs font-body text-bicta-muted">
            Camera: {isCameraOn ? "On" : "Required"}
          </span>
        </div>

        {/* Violations */}
        <div className="flex items-center gap-2">
          <Shield
            size={12}
            className={
              violationCount === 0
                ? "text-emerald-400"
                : violationCount < maxViolations
                  ? "text-bicta-gold"
                  : "text-red-400"
            }
          />
          <span className="text-xs font-body text-bicta-muted">
            Violations:{" "}
            <span
              className={cn(
                "font-medium",
                violationCount === 0
                  ? "text-emerald-400"
                  : violationCount < maxViolations
                    ? "text-bicta-gold"
                    : "text-red-400"
              )}
            >
              {violationCount}/{maxViolations}
            </span>
          </span>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-1.5">
          {warnings.slice(-3).map((warning, i) => (
            <div
              key={i}
              className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 animate-fade-in-up"
            >
              <AlertTriangle size={12} className="text-red-400 shrink-0 mt-0.5" />
              <span className="text-[0.7rem] font-body text-red-300 leading-snug">
                {warning}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
