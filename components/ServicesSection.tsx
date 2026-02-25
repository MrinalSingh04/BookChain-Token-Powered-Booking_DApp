"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { formatUnits } from "ethers";
import { useState } from "react";

export default function ServicesSection() {
  const { services, isPaused, account, bookService, txStatus, refreshData } = useWeb3();
  const [bookingId, setBookingId] = useState<number | null>(null);

  const handleBook = async (id: number) => {
    setBookingId(id);
    await bookService(id);
    setBookingId(null);
  };

  if (!account) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
            Available Services
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {services.filter(s => s.active).length} services available
          </p>
        </div>
        <button onClick={refreshData} className="btn-ghost px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {isPaused && (
        <div className="mb-6 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: "rgba(255,45,120,0.08)", border: "1px solid rgba(255,45,120,0.25)" }}>
          <span style={{ color: "#ff2d78" }}>⏸</span>
          <p className="text-sm" style={{ color: "#ff2d78" }}>System is paused. Bookings are temporarily disabled.</p>
        </div>
      )}

      {services.length === 0 ? (
        <div className="text-center py-16 card-glow rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.15)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--acid)", opacity: 0.7 }}>
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <p className="font-display text-lg font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>No services yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Admin needs to add services first</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="card-glow rounded-2xl p-6 flex flex-col gap-4 animate-fade-up"
              style={{ opacity: svc.active ? 1 : 0.5 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: svc.active ? "rgba(200,255,0,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${svc.active ? "rgba(200,255,0,0.25)" : "rgba(255,255,255,0.08)"}` }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={svc.active ? "#c8ff00" : "#6b7280"} strokeWidth="2">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>{svc.name}</p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>ID: #{svc.id}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${svc.active ? "badge-active" : "badge-inactive"}`}>
                  {svc.active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Price */}
              <div className="py-4 px-4 rounded-xl" style={{ background: "rgba(200,255,0,0.04)", border: "1px solid rgba(200,255,0,0.1)" }}>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Service Price</p>
                <p className="font-mono font-bold text-2xl mt-1" style={{ color: "var(--acid)" }}>
                  {parseFloat(formatUnits(svc.price, 18)).toFixed(2)}
                  <span className="text-sm font-normal ml-2" style={{ color: "var(--text-muted)" }}>BKT</span>
                </p>
              </div>

              {/* Book button */}
              <button
                onClick={() => handleBook(svc.id)}
                disabled={!svc.active || isPaused || txStatus.loading}
                className="btn-acid w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                {txStatus.loading && bookingId === svc.id ? (
                  <>
                    <span className="spinner w-4 h-4 inline-block" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
                    </svg>
                    Book Now
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
