"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { useState } from "react";
import { formatUnits } from "ethers";

export default function AdminPanel() {
  const { isOwner, services, isPaused, addService, updateService, pauseSystem, unpauseSystem, txStatus, account } = useWeb3();

  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editActive, setEditActive] = useState(true);

  if (!account || !isOwner) return null;

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;
    await addService(newServiceName, newServicePrice);
    setNewServiceName("");
    setNewServicePrice("");
  };

  const startEdit = (id: number) => {
    const svc = services.find(s => s.id === id);
    if (!svc) return;
    setEditingId(id);
    setEditPrice(parseFloat(formatUnits(svc.price, 18)).toString());
    setEditActive(svc.active);
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;
    await updateService(editingId, editPrice, editActive);
    setEditingId(null);
  };

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(200,255,0,0.12)", border: "1px solid rgba(200,255,0,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
            Admin Panel
          </h2>
          <p className="text-xs" style={{ color: "var(--acid)", opacity: 0.7 }}>Owner privileges active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Controls */}
        <div className="card-glow rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>System Controls</h3>
          
          <div className="flex items-center justify-between p-4 rounded-xl mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="font-medium">System Status</p>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                {isPaused ? "Bookings are disabled" : "Bookings are enabled"}
              </p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${isPaused ? "badge-cancelled" : "badge-active"}`}>
              {isPaused ? "Paused" : "Active"}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={pauseSystem}
              disabled={isPaused || txStatus.loading}
              className="flex-1 btn-ghost py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
              style={{ borderColor: "rgba(255,45,120,0.3)", color: "#ff2d78" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
              Pause System
            </button>
            <button
              onClick={unpauseSystem}
              disabled={!isPaused || txStatus.loading}
              className="flex-1 btn-ghost py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
              style={{ borderColor: isPaused ? "rgba(200,255,0,0.3)" : undefined, color: isPaused ? "var(--acid)" : undefined }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Unpause System
            </button>
          </div>
        </div>

        {/* Add Service */}
        <div className="card-glow rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Add New Service</h3>
          
          <form onSubmit={handleAddService} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Service Name</label>
              <input
                type="text"
                placeholder="e.g. Premium Consultation"
                value={newServiceName}
                onChange={e => setNewServiceName(e.target.value)}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Price (BKT tokens)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 100"
                value={newServicePrice}
                onChange={e => setNewServicePrice(e.target.value)}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={txStatus.loading || !newServiceName || !newServicePrice}
              className="btn-acid py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-1"
            >
              {txStatus.loading ? (
                <><span className="spinner w-4 h-4" />Adding...</>
              ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Service</>
              )}
            </button>
          </form>
        </div>

        {/* Manage Services */}
        {services.length > 0 && (
          <div className="card-glow rounded-2xl p-6 lg:col-span-2">
            <h3 className="font-display font-semibold text-lg mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Manage Services</h3>
            
            <div className="flex flex-col gap-3">
              {services.map(svc => (
                <div key={svc.id} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {editingId === svc.id ? (
                    <form onSubmit={handleUpdateService} className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-sm flex-shrink-0 w-32">{svc.name}</p>
                      <input
                        type="number"
                        step="0.01"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        className="input-dark px-3 py-2 rounded-lg text-sm font-mono w-32"
                        placeholder="New price"
                      />
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div
                          onClick={() => setEditActive(!editActive)}
                          className="relative w-10 h-5 rounded-full transition-all cursor-pointer"
                          style={{ background: editActive ? "var(--acid)" : "rgba(255,255,255,0.1)" }}
                        >
                          <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: editActive ? "22px" : "2px" }} />
                        </div>
                        {editActive ? "Active" : "Inactive"}
                      </label>
                      <div className="flex gap-2 ml-auto">
                        <button type="submit" disabled={txStatus.loading} className="btn-acid px-4 py-1.5 rounded-lg text-xs font-bold">
                          {txStatus.loading ? "Saving..." : "Save"}
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="btn-ghost px-4 py-1.5 rounded-lg text-xs">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-2 py-1 rounded-md" style={{ background: "rgba(200,255,0,0.06)", color: "var(--acid)" }}>#{svc.id}</span>
                        <span className="font-medium text-sm">{svc.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${svc.active ? "badge-active" : "badge-inactive"}`}>
                          {svc.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm" style={{ color: "var(--acid)" }}>
                          {parseFloat(formatUnits(svc.price, 18)).toFixed(2)} BKT
                        </span>
                        <button
                          onClick={() => startEdit(svc.id)}
                          className="btn-ghost px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
