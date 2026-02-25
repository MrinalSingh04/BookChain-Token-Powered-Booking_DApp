"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { formatUnits } from "ethers";
import { useState } from "react";

export default function MyBookingsSection() {
  const { myBookings, services, cancelBooking, txStatus, account } = useWeb3();
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  if (!account) return null;

  const getServiceName = (serviceId: bigint) => {
    const svc = services.find(s => s.id === Number(serviceId));
    return svc?.name || `Service #${serviceId}`;
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    await cancelBooking(id);
    setCancellingId(null);
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
          My Bookings
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {myBookings.filter(b => !b.cancelled).length} active · {myBookings.filter(b => b.cancelled).length} cancelled
        </p>
      </div>

      {myBookings.length === 0 ? (
        <div className="text-center py-16 card-glow rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.15)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--acid)", opacity: 0.7 }}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <p className="font-display text-lg font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>No bookings yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Book a service above to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {myBookings.map((booking) => (
            <div
              key={booking.id}
              className="card-glow rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
              style={{ opacity: booking.cancelled ? 0.5 : 1 }}
            >
              <div className="flex items-center gap-4">
                {/* Booking ID badge */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm" style={{ background: booking.cancelled ? "rgba(255,45,120,0.08)" : "rgba(200,255,0,0.08)", border: `1px solid ${booking.cancelled ? "rgba(255,45,120,0.2)" : "rgba(200,255,0,0.2)"}`, color: booking.cancelled ? "#ff2d78" : "var(--acid)" }}>
                  #{booking.id}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{getServiceName(booking.serviceId)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${booking.cancelled ? "badge-cancelled" : "badge-active"}`}>
                      {booking.cancelled ? "Cancelled" : "Active"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
                      Paid: <span style={{ color: "var(--acid)" }}>{parseFloat(formatUnits(booking.amountPaid, 18)).toFixed(2)} BKT</span>
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatDate(booking.timestamp)}</p>
                  </div>
                </div>
              </div>

              {!booking.cancelled && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  disabled={txStatus.loading}
                  className="btn-ghost px-4 py-2 rounded-lg text-sm flex items-center gap-2 flex-shrink-0"
                  style={{ borderColor: "rgba(255,45,120,0.3)", color: "#ff2d78" }}
                >
                  {txStatus.loading && cancellingId === booking.id ? (
                    <>
                      <span className="spinner w-4 h-4" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
                      </svg>
                      Cancel & Refund
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
