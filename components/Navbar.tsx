"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { useState } from "react";

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Navbar() {
  const { account, tokenBalance, tokenSymbol, isConnecting, isCorrectNetwork, connect, disconnect, switchToSepolia } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="relative z-50 border-b" style={{ borderColor: "var(--border)", background: "rgba(10,13,20,0.85)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg" style={{ background: "var(--acid)", opacity: 0.15 }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <span className="font-display font-800 text-xl tracking-tight" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
            Book<span style={{ color: "var(--acid)" }}>Chain</span>
          </span>
        </div>

        {/* Network + Wallet */}
        <div className="flex items-center gap-3">
          {account && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono" style={{ background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.15)" }}>
              <span style={{ color: "var(--text-muted)" }}>Balance:</span>
              <span style={{ color: "var(--acid)" }} className="font-semibold">
                {parseFloat(tokenBalance).toFixed(2)} <span className="text-xs">{tokenSymbol}</span>
              </span>
            </div>
          )}

          {account && !isCorrectNetwork && (
            <button
              onClick={switchToSepolia}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "rgba(255,45,120,0.12)", border: "1px solid rgba(255,45,120,0.3)", color: "#ff2d78" }}
            >
              ⚠ Switch to Sepolia
            </button>
          )}

          {account ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all btn-ghost"
              >
                <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: isCorrectNetwork ? "var(--acid)" : "#ff2d78" }} />
                <span className="font-mono">{shortenAddress(account)}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ opacity: 0.5, transform: showDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M1 4l5 5 5-5"/>
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                  <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Connected</p>
                    <p className="font-mono text-sm mt-0.5">{shortenAddress(account)}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { disconnect(); setShowDropdown(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:bg-red-500/10"
                      style={{ color: "#ff2d78" }}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="btn-acid px-5 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <span className="spinner w-4 h-4 inline-block" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12V7H5a2 2 0 010-4h14v4M21 12a2 2 0 010 4H5a2 2 0 000 4h16v-4"/>
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </nav>
  );
}
