"use client";

import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#141414",
            color: "#faf8f3",
            border: "1px solid rgba(201,168,76,0.15)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8125rem",
          },
        }}
      />
    </>
  );
}
