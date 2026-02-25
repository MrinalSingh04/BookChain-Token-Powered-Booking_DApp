"use client";

import { useWeb3 } from "@/contexts/Web3Context";

export default function TxToast() {
  const { txStatus } = useWeb3();

  if (txStatus.type === "idle") return null;

  const icons = {
    pending: (
      <span className="spinner w-5 h-5 inline-block flex-shrink-0" />
    ),
    success: (
      <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: "var(--acid)", color: "#0a0d14" }}>✓</span>
    ),
    error: (
      <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: "#ff2d78", color: "white" }}>✕</span>
    ),
  };

  const colors = {
    pending: "rgba(200,255,0,0.1)",
    success: "rgba(200,255,0,0.1)",
    error: "rgba(255,45,120,0.1)",
  };

  const borders = {
    pending: "rgba(200,255,0,0.3)",
    success: "rgba(200,255,0,0.3)",
    error: "rgba(255,45,120,0.3)",
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl toast-enter max-w-sm"
      style={{
        background: colors[txStatus.type],
        border: `1px solid ${borders[txStatus.type]}`,
        backdropFilter: "blur(12px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      {icons[txStatus.type]}
      <p className="text-sm font-medium">{txStatus.message}</p>
    </div>
  );
}
