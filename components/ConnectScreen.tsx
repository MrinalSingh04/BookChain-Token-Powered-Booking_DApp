"use client";

import { useWeb3 } from "@/contexts/Web3Context";

export default function ConnectScreen() {
  const { connect, isConnecting } = useWeb3();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      {/* Glowing orb */}
      <div className="relative mb-10">
        <div className="absolute -inset-16 rounded-full" style={{ background: "radial-gradient(circle, rgba(200,255,0,0.06) 0%, transparent 70%)", filter: "blur(20px)" }} />
        <div className="relative w-28 h-28 rounded-3xl flex items-center justify-center" style={{ background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.2)", boxShadow: "0 0 60px rgba(200,255,0,0.1)" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6"/>
            <path d="M2 12l10 5 10-5" stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3"/>
          </svg>
        </div>
      </div>

      {/* Headline */}
      <h1 className="font-display text-5xl font-extrabold mb-4 leading-tight tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
        Booking on the<br />
        <span className="text-gradient">Blockchain</span>
      </h1>
      <p className="text-lg mb-10 max-w-md" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
        A decentralized booking platform powered by ERC-20 tokens and smart contracts on Sepolia testnet.
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl w-full">
        {[
          { icon: "🔐", title: "Non-Custodial", desc: "Full ownership of your tokens" },
          { icon: "⚡", title: "Instant Refunds", desc: "Cancel anytime, get paid back" },
          { icon: "🛡", title: "Immutable Records", desc: "All bookings on-chain forever" },
        ].map(f => (
          <div key={f.title} className="card-glow rounded-2xl p-5 text-left">
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="font-semibold text-sm">{f.title}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={connect}
        disabled={isConnecting}
        className="btn-acid px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-3"
      >
        {isConnecting ? (
          <>
            <span className="spinner w-5 h-5 inline-block" />
            Connecting to MetaMask...
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12V7H5a2 2 0 010-4h14v4M21 12a2 2 0 010 4H5a2 2 0 000 4h16v-4"/>
            </svg>
            Connect Wallet to Start
          </>
        )}
      </button>

      <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
        Requires MetaMask · Sepolia Testnet
      </p>
    </div>
  );
}
