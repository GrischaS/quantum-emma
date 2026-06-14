// ============================================================
//  QUANTUM EMMA — Governance DAO v2
//  Live Proposals · On-Chain Voting · Treasury · Quorum
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import React, { useState, useEffect } from "react";

const PROPOSALS = [
  {
    id: 1, title: "QIP-001: QEMMA Token Burn — 5% Supply Reduction",
    status: "active", category: "Tokenomics",
    votes: { for: 8420000, against: 1240000, abstain: 340000 },
    quorum: 10000000, deadline: "2026-06-20", proposer: "0xGri...saks",
    description: "Burn 5M QEMMA tokens from the reserve to increase scarcity and support the token price.",
  },
  {
    id: 2, title: "QIP-002: Uniswap V3 Liquidity Pool — $500K Initial",
    status: "active", category: "DeFi",
    votes: { for: 6800000, against: 580000, abstain: 120000 },
    quorum: 10000000, deadline: "2026-06-22", proposer: "0xAlph...quant",
    description: "Allocate $500K from treasury to seed the QEMMA/ETH Uniswap V3 liquidity pool.",
  },
  {
    id: 3, title: "QIP-003: Staking APY Increase Tier 5 → 75%",
    status: "passed", category: "Staking",
    votes: { for: 12400000, against: 820000, abstain: 200000 },
    quorum: 10000000, deadline: "2026-06-10", proposer: "0xMeta...TR2",
    description: "Increase maximum staking APY from 60% to 75% for Tier 5 (500K+ QEMMA) holders.",
  },
  {
    id: 4, title: "QIP-004: Gate.io Listing Application Budget",
    status: "pending", category: "Exchange",
    votes: { for: 0, against: 0, abstain: 0 },
    quorum: 10000000, deadline: "2026-06-28", proposer: "0xGri...saks",
    description: "Allocate 200K USDC from treasury for Gate.io CEX listing fees and market making.",
  },
];

const STATUS_CONFIG = {
  active:  { color: "#00ffff", bg: "rgba(0,255,255,0.1)",  label: "🔵 Aktiv" },
  passed:  { color: "#00ff80", bg: "rgba(0,255,128,0.1)",  label: "✅ Angenommen" },
  failed:  { color: "#ff4444", bg: "rgba(255,68,68,0.1)",  label: "❌ Abgelehnt" },
  pending: { color: "#ffaa00", bg: "rgba(255,170,0,0.1)",  label: "⏳ Ausstehend" },
};

const TREASURY = [
  { asset: "USDC",   amount: 2400000, icon: "💵", color: "#00ff80" },
  { asset: "ETH",    amount: 48.4,    icon: "⟠",  color: "#8080ff", usdVal: 184888 },
  { asset: "QEMMA",  amount: 15000000,icon: "⚛️", color: "#00ffff", usdVal: 9450000 },
  { asset: "WBTC",   amount: 0.44,    icon: "₿",  color: "#ffaa00", usdVal: 29656 },
];

export default function GovernanceV2() {
  const [selected,   setSelected]   = useState(null);
  const [userVotes,  setUserVotes]   = useState({});
  const [proposals,  setProposals]   = useState(PROPOSALS);
  const [tab,        setTab]         = useState("proposals"); // proposals | treasury | history
  const [filter,     setFilter]      = useState("all");
  const [voting,     setVoting]      = useState(null);

  const totalTreasury = 2400000 + 184888 + 9450000 + 29656;

  const handleVote = async (proposalId, choice) => {
    if (userVotes[proposalId]) return;
    setVoting(proposalId);
    await new Promise(r => setTimeout(r, 1200));
    const power = 15000; // user's voting power in QEMMA
    setProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      return { ...p, votes: { ...p.votes, [choice]: p.votes[choice] + power } };
    }));
    setUserVotes(prev => ({ ...prev, [proposalId]: choice }));
    setVoting(null);
  };

  const filtered = filter === "all"
    ? proposals
    : proposals.filter(p => p.status === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#000d1a", color: "#e0f0ff",
                  fontFamily: "'Rajdhani',sans-serif", padding: 24 }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: "#00ffff", fontSize: 28, fontWeight: 900 }}>
          🗳 Governance DAO v2
        </h1>
        <p style={{ margin: "4px 0 0", color: "#556677", fontSize: 13 }}>
          On-Chain Voting · Treasury · QEMMA Holders entscheiden
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                    gap: 12, marginBottom: 24 }}>
        {[
          { label: "Treasury",      value: `$${(totalTreasury/1e6).toFixed(1)}M`, color: "#00ff80" },
          { label: "Proposals",     value: proposals.length,                       color: "#00ffff" },
          { label: "Aktiv",         value: proposals.filter(p => p.status==="active").length, color: "#00ffff" },
          { label: "Quorum",        value: "10M QEMMA",                            color: "#ffaa00" },
          { label: "Deine Macht",   value: "15K QEMMA",                            color: "#8080ff" },
          { label: "Participation", value: "67.4%",                                color: "#00ff80" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "rgba(0,20,40,0.85)", border: "1px solid rgba(0,255,255,0.12)",
                                    borderRadius: 12, padding: 14, textAlign: "center" }}>
            <div style={{ color: "#556677", fontSize: 11 }}>{label}</div>
            <div style={{ color, fontSize: 20, fontWeight: 800, marginTop: 4 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["proposals","📋 Proposals"],["treasury","💰 Treasury"],["history","📜 History"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
                     background: tab === t ? "rgba(0,255,255,0.12)" : "rgba(255,255,255,0.04)",
                     border: `1px solid ${tab === t ? "#00ffff" : "rgba(255,255,255,0.1)"}`,
                     color: tab === t ? "#00ffff" : "#556677" }}>
            {l}
          </button>
        ))}
        {tab === "proposals" && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {["all","active","passed","pending"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11,
                         background: filter === f ? "rgba(0,255,255,0.08)" : "transparent",
                         border: `1px solid ${filter === f ? "#00ffff" : "rgba(255,255,255,0.08)"}`,
                         color: filter === f ? "#00ffff" : "#556677", textTransform: "capitalize" }}>
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Proposals Tab */}
      {tab === "proposals" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map(p => {
            const total    = p.votes.for + p.votes.against + p.votes.abstain;
            const forPct   = total ? (p.votes.for / total * 100) : 0;
            const agPct    = total ? (p.votes.against / total * 100) : 0;
            const quorumPct= Math.min(100, (total / p.quorum * 100));
            const sc       = STATUS_CONFIG[p.status];
            const voted    = userVotes[p.id];
            const isOpen   = p.status === "active";
            const exp      = selected === p.id;

            return (
              <div key={p.id} style={{ background: "rgba(0,20,40,0.9)",
                                       border: `1px solid ${exp ? "#00ffff44" : "rgba(0,255,255,0.1)"}`,
                                       borderRadius: 16, padding: 20, cursor: "pointer",
                                       transition: "border-color 0.3s" }}
                onClick={() => setSelected(exp ? null : p.id)}>

                {/* Title Row */}
                <div style={{ display: "flex", justifyContent: "space-between",
                              alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}44`,
                                     borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                        {sc.label}
                      </span>
                      <span style={{ color: "#556677", fontSize: 11,
                                     background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "2px 8px" }}>
                        {p.category}
                      </span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "#e0f0ff" }}>{p.title}</div>
                    <div style={{ color: "#556677", fontSize: 11, marginTop: 4 }}>
                      QIP-00{p.id} · {p.proposer} · Deadline: {p.deadline}
                    </div>
                  </div>
                  {voted && (
                    <span style={{ background: "rgba(0,255,128,0.1)", border: "1px solid rgba(0,255,128,0.3)",
                                   borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#00ff80",
                                   fontWeight: 700, whiteSpace: "nowrap" }}>
                      ✅ Abgestimmt: {voted === "for" ? "Dafür" : voted === "against" ? "Dagegen" : "Enthaltung"}
                    </span>
                  )}
                </div>

                {/* Vote Bars */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12,
                                color: "#556677", marginBottom: 4 }}>
                    <span>Dafür: <b style={{ color: "#00ff80" }}>{(p.votes.for/1e6).toFixed(2)}M</b></span>
                    <span>Dagegen: <b style={{ color: "#ff4444" }}>{(p.votes.against/1e6).toFixed(2)}M</b></span>
                    <span>Gesamt: <b style={{ color: "#8899aa" }}>{(total/1e6).toFixed(2)}M</b></span>
                  </div>
                  <div style={{ display: "flex", height: 8, borderRadius: 6, overflow: "hidden",
                                background: "rgba(255,255,255,0.06)" }}>
                    <div style={{ width: `${forPct}%`, background: "#00ff80", transition: "width 0.6s" }} />
                    <div style={{ width: `${agPct}%`, background: "#ff4444", transition: "width 0.6s" }} />
                  </div>
                </div>

                {/* Quorum Bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ color: "#556677", fontSize: 11, whiteSpace: "nowrap" }}>
                    Quorum {quorumPct.toFixed(0)}%
                  </span>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 4 }}>
                    <div style={{ width: `${quorumPct}%`, height: "100%",
                                  background: quorumPct >= 100 ? "#00ff80" : "#ffaa00",
                                  borderRadius: 4, transition: "width 0.6s" }} />
                  </div>
                  <span style={{ color: quorumPct >= 100 ? "#00ff80" : "#ffaa00", fontSize: 11,
                                 fontWeight: 700, whiteSpace: "nowrap" }}>
                    {quorumPct >= 100 ? "✅ Erreicht" : "⏳ Ausstehend"}
                  </span>
                </div>

                {/* Expanded: Description + Voting */}
                {exp && (
                  <div onClick={e => e.stopPropagation()}>
                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 14, marginBottom: 14,
                                  color: "#8899aa", fontSize: 13, lineHeight: 1.6 }}>
                      {p.description}
                    </div>
                    {isOpen && !voted && (
                      <div style={{ display: "flex", gap: 10 }}>
                        {[
                          { choice: "for",     label: "✅ Dafür",     color: "#00ff80" },
                          { choice: "against",  label: "❌ Dagegen",   color: "#ff4444" },
                          { choice: "abstain",  label: "⬜ Enthaltung",color: "#8899aa" },
                        ].map(({ choice, label, color }) => (
                          <button key={choice}
                            onClick={() => handleVote(p.id, choice)}
                            disabled={voting === p.id}
                            style={{ flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                                     fontWeight: 700, fontSize: 14, border: `2px solid ${color}44`,
                                     background: `${color}11`, color,
                                     opacity: voting === p.id ? 0.6 : 1 }}>
                            {voting === p.id ? "⏳..." : label}
                          </button>
                        ))}
                      </div>
                    )}
                    {!isOpen && (
                      <div style={{ textAlign: "center", color: "#556677", fontSize: 13 }}>
                        Abstimmung abgeschlossen · {sc.label}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Treasury Tab */}
      {tab === "treasury" && (
        <div style={{ background: "rgba(0,20,40,0.9)", border: "1px solid rgba(0,255,255,0.12)",
                      borderRadius: 16, padding: 20 }}>
          <h3 style={{ margin: "0 0 20px", color: "#00ffff" }}>
            💰 Treasury — ${(totalTreasury/1e6).toFixed(2)}M gesamt
          </h3>
          {TREASURY.map(t => {
            const usd = t.usdVal || t.amount;
            return (
              <div key={t.asset} style={{ display: "flex", justifyContent: "space-between",
                                          alignItems: "center", padding: "14px 0",
                                          borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: t.color }}>{t.asset}</div>
                    <div style={{ color: "#556677", fontSize: 12 }}>
                      {t.amount.toLocaleString("en", { maximumFractionDigits: 4 })} {t.asset}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#00ffff", fontWeight: 700, fontSize: 18 }}>
                    ${usd.toLocaleString("en", { maximumFractionDigits: 0 })}
                  </div>
                  <div style={{ color: "#556677", fontSize: 11 }}>
                    {((usd / totalTreasury) * 100).toFixed(1)}% des Treasury
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "history" && (
        <div style={{ background: "rgba(0,20,40,0.9)", border: "1px solid rgba(0,255,255,0.12)",
                      borderRadius: 16, padding: 20, color: "#556677", textAlign: "center", fontSize: 14 }}>
          📜 Governance-History wird nach Sepolia-Deployment aus On-Chain-Events geladen.
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 32, color: "#334455", fontSize: 11 }}>
        © 2026 Grigori Saks — Quantum Emma DAO · On-Chain Governance · Patent Pending
      </div>
    </div>
  );
}
