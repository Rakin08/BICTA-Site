"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ViolationEvent } from "@/types/competition";

export interface AntiCheatState {
  isFullscreen: boolean;
  isCameraOn: boolean;
  isFaceVisible: boolean;
  violationCount: number;
  violations: ViolationEvent[];
  isDisqualified: boolean;
  disqualificationReason: string;
  warnings: string[];
  cameraStream: MediaStream | null;
}

export interface AntiCheatActions {
  requestFullscreen: () => Promise<void>;
  requestCamera: () => Promise<void>;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  logManualViolation: (type: ViolationEvent["type"], details?: string) => void;
}

interface UseAntiCheatOptions {
  maxViolations?: number;
  enableCamera?: boolean;
  enableFullscreen?: boolean;
  onDisqualified?: (reason: string, violations: ViolationEvent[]) => void;
  onViolation?: (violation: ViolationEvent) => void;
}

// Face detection using simple canvas pixel analysis
// In production, use face-api.js or MediaPipe for proper face detection
function detectFaceInFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): { faceVisible: boolean; faceCount: number } {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { faceVisible: false, faceCount: 0 };

  canvas.width = 320;
  canvas.height = 240;
  ctx.drawImage(video, 0, 0, 320, 240);

  const frame = ctx.getImageData(0, 0, 320, 240);
  const data = frame.data;

  // Simple skin-tone pixel detection as proxy for face presence
  // This is a lightweight heuristic — replace with face-api.js for production
  let skinPixels = 0;
  const totalPixels = data.length / 4;
  const sampleStep = 4; // Sample every 4th pixel for performance

  for (let i = 0; i < data.length; i += 4 * sampleStep) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // HSV-based skin tone detection (simplified)
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max === min) continue;

    // Skin tone range: warm colors with red > green > blue
    if (r > 95 && g > 40 && b > 20 && r > g && r > b && max - min > 15) {
      skinPixels++;
    }
  }

  const skinRatio = skinPixels / (totalPixels / sampleStep);
  // Face typically occupies 5-40% of frame in proper positioning
  const faceVisible = skinRatio > 0.03 && skinRatio < 0.5;
  const faceCount = skinRatio > 0.01 ? 1 : 0; // Simplified — production should use proper face counting

  // Draw debug overlay
  ctx.strokeStyle = faceVisible ? "#10b981" : "#ef4444";
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 40, 200, 160);

  // Status text
  ctx.fillStyle = faceVisible ? "#10b981" : "#ef4444";
  ctx.font = "14px sans-serif";
  ctx.fillText(faceVisible ? "FACE DETECTED" : "NO FACE", 10, 20);

  return { faceVisible, faceCount };
}

export function useAntiCheat(options: UseAntiCheatOptions = {}): {
  state: AntiCheatState;
  actions: AntiCheatActions;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
} {
  const {
    maxViolations = 3,
    enableCamera = true,
    enableFullscreen = true,
    onDisqualified,
    onViolation,
  } = options;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFaceVisible, setIsFaceVisible] = useState(true);
  const [violationCount, setViolationCount] = useState(0);
  const [violations, setViolations] = useState<ViolationEvent[]>([]);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const monitoringRef = useRef(false);
  const faceCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const violationCounts = useRef<Record<string, number>>({});

  const addWarning = useCallback((msg: string) => {
    setWarnings((prev) => [...prev.slice(-4), msg]);
  }, []);

  const logViolation = useCallback(
    (type: ViolationEvent["type"], details?: string) => {
      if (isDisqualified) return;

      const count = (violationCounts.current[type] || 0) + 1;
      violationCounts.current[type] = count;

      const violation: ViolationEvent = {
        id: `${Date.now()}-${type}-${count}`,
        type,
        timestamp: new Date().toISOString(),
        details,
        count,
      };

      setViolations((prev) => [...prev, violation]);
      setViolationCount((prev) => prev + 1);
      onViolation?.(violation);

      // Check if max violations reached
      const newTotal = violationCount + 1;
      if (newTotal >= maxViolations) {
        const reason = `Maximum violations (${maxViolations}) reached. Last violation: ${type}${details ? ` — ${details}` : ""}`;
        setIsDisqualified(true);
        setDisqualificationReason(reason);
        onDisqualified?.(reason, [...violations, violation]);
        stopMonitoringInternal();
      } else {
        addWarning(
          `⚠️ Warning ${newTotal}/${maxViolations}: ${type.replace(/_/g, " ")}${details ? ` — ${details}` : ""}`
        );
      }
    },
    [isDisqualified, violationCount, maxViolations, violations, onDisqualified, onViolation, addWarning]
  );

  const stopMonitoringInternal = useCallback(() => {
    monitoringRef.current = false;
    if (faceCheckInterval.current) {
      clearInterval(faceCheckInterval.current);
      faceCheckInterval.current = null;
    }
  }, []);

  // Fullscreen
  const requestFullscreen = useCallback(async () => {
    if (!enableFullscreen) return;
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      }
    } catch {
      addWarning("Fullscreen mode required. Please enable it.");
    }
  }, [enableFullscreen, addWarning]);

  // Camera
  const requestCamera = useCallback(async () => {
    if (!enableCamera) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraStream(stream);
      setIsCameraOn(true);
    } catch (err) {
      const msg = `Camera access denied: ${err instanceof Error ? err.message : "Unknown error"}`;
      addWarning(msg);
      logViolation("camera_off", msg);
    }
  }, [enableCamera, addWarning, logViolation]);

  // Face monitoring
  const startFaceMonitoring = useCallback(() => {
    if (!enableCamera || !canvasRef.current || !videoRef.current) return;

    faceCheckInterval.current = setInterval(() => {
      if (!monitoringRef.current || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      if (video.readyState < 2) return; // HAVE_CURRENT_DATA

      const result = detectFaceInFrame(video, canvasRef.current);
      setIsFaceVisible(result.faceVisible);

      if (!result.faceVisible) {
        logViolation("face_not_visible", "Face not detected in camera frame");
      }
    }, 2000); // Check every 2 seconds
  }, [enableCamera, logViolation]);

  // Start all monitoring
  const startMonitoring = useCallback(() => {
    if (monitoringRef.current) return;
    monitoringRef.current = true;

    // Fullscreen monitoring
    if (enableFullscreen) {
      requestFullscreen();
    }

    // Camera + face monitoring
    if (enableCamera) {
      requestCamera().then(() => {
        startFaceMonitoring();
      });
    }
  }, [enableFullscreen, enableCamera, requestFullscreen, requestCamera, startFaceMonitoring]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    stopMonitoringInternal();

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsCameraOn(false);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stopMonitoringInternal, cameraStream]);

  // Event listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);

      if (!isFS && monitoringRef.current && enableFullscreen && !isDisqualified) {
        logViolation("fullscreen_exit", "User exited fullscreen mode");
        addWarning("Fullscreen mode exited. Please return to fullscreen.");
        // Try to re-enter fullscreen
        requestFullscreen();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && monitoringRef.current && !isDisqualified) {
        logViolation("tab_switch", "User switched to another tab or minimized window");
      }
    };

    const handleBlur = () => {
      if (monitoringRef.current && !isDisqualified) {
        logViolation("window_blur", "Window lost focus");
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      if (monitoringRef.current && !isDisqualified) {
        e.preventDefault();
        logViolation("copy_paste", "Copy/paste attempt blocked");
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      if (monitoringRef.current && !isDisqualified) {
        e.preventDefault();
        logViolation("copy_paste", "Paste attempt blocked");
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (monitoringRef.current && !isDisqualified) {
        e.preventDefault();
        logViolation("right_click", "Right-click attempt blocked");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!monitoringRef.current || isDisqualified) return;

      // Block common shortcuts
      const blockedKeys: string[] = [];

      // Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "x")) {
        e.preventDefault();
        blockedKeys.push(`Ctrl+${e.key.toUpperCase()}`);
      }

      // Ctrl+P (print)
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        blockedKeys.push("Ctrl+P");
      }

      // Ctrl+S (save)
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        blockedKeys.push("Ctrl+S");
      }

      // F12 (dev tools)
      if (e.key === "F12") {
        e.preventDefault();
        blockedKeys.push("F12");
      }

      // Alt+Tab detection (approximate via Alt key)
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        blockedKeys.push("Alt+Tab");
      }

      // Cmd+Tab (Mac)
      if (e.metaKey && e.key === "Tab") {
        e.preventDefault();
        blockedKeys.push("Cmd+Tab");
      }

      // Ctrl+Shift+I/J (dev tools)
      if (e.ctrlKey && e.shiftKey && (e.key === "i" || e.key === "j" || e.key === "c")) {
        e.preventDefault();
        blockedKeys.push(`Ctrl+Shift+${e.key.toUpperCase()}`);
      }

      if (blockedKeys.length > 0) {
        logViolation("copy_paste", `Keyboard shortcut blocked: ${blockedKeys.join(", ")}`);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [logViolation, addWarning, isDisqualified, enableFullscreen, requestFullscreen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoringInternal();
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream, stopMonitoringInternal]);

  return {
    state: {
      isFullscreen,
      isCameraOn,
      isFaceVisible,
      violationCount,
      violations,
      isDisqualified,
      disqualificationReason,
      warnings,
      cameraStream,
    },
    actions: {
      requestFullscreen,
      requestCamera,
      startMonitoring,
      stopMonitoring,
      logManualViolation: logViolation,
    },
    videoRef,
    canvasRef,
  };
}
