"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { BOOKING_TOKEN_ADDRESS, BOOKING_SYSTEM_ADDRESS } from "@/lib/contracts";

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function DashboardStats() {
  const { account, tokenBalance, tokenSymbol, services, myBookings, isPaused, isOwner } = useWeb3();

  if (!account) return null;

  const stats = [
    {
      label: "Token Balance",
      value: parseFloat(tokenBalance).toFixed(2),
      unit: tokenSymbol,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      ),
      accent: "var(--acid)",
    },
    {
      label: "Available Services",
      value: services.filter(s => s.active).length,
      unit: "services",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        </svg>
      ),
      accent: "#00d4ff",
    },
    {
      label: "My Active Bookings",
      value: myBookings.filter(b => !b.cancelled).length,
      unit: "bookings",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff2d78" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      accent: "#ff2d78",
    },
    {
      label: "System Status",
      value: isPaused ? "Paused" : "Online",
      unit: "",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isPaused ? "#ff2d78" : "#c8ff00"} strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          {isPaused ? <><rect x="9" y="9" width="2" height="6"/><rect x="13" y="9" width="2" height="6"/></> : <polyline points="20 6 9 17 4 12"/>}
        </svg>
      ),
      accent: isPaused ? "#ff2d78" : "var(--acid)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Role indicator */}
      {isOwner && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-fit" style={{ background: "rgba(200,255,0,0.08)", border: "1px solid rgba(200,255,0,0.2)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span className="text-sm font-semibold" style={{ color: "var(--acid)" }}>Contract Owner</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>— Admin access enabled</span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card-glow rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.accent}12`, border: `1px solid ${stat.accent}25` }}>
                {stat.icon}
              </div>
            </div>
            <p className="font-mono font-bold text-2xl" style={{ color: stat.accent }}>
              {stat.value}
              {stat.unit && <span className="text-sm font-normal ml-1.5" style={{ color: "var(--text-muted)" }}>{stat.unit}</span>}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Contract info */}
      <div className="card-glow rounded-2xl p-5">
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Deployed Contracts — Sepolia Testnet</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "BookingToken", addr: BOOKING_TOKEN_ADDRESS },
            { label: "BookingSystem", addr: BOOKING_SYSTEM_ADDRESS },
          ].map(({ label, addr }) => (
            <a
              key={label}
              href={`https://sepolia.etherscan.io/address/${addr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-xl transition-all group"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{label}</p>
                <p className="font-mono text-sm mt-0.5 group-hover:text-acid transition-colors" style={{ color: "var(--text)" }}>{shortenAddress(addr)}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
