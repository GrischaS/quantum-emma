// ============================================================
//  QUANTUM EMMA — AI Signal Dashboard v2
//  12 Agents · Live Confidence · Consensus Engine · Alerts
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import React, { useState, useEffect, useCallback } from "react";

const AGENTS = [
  { id: 1,  name: "Alpha Quant",      role: "Momentum",      emoji: "📈" },
  { id: 2,  name: "Neural Drift",     role: "Sentiment",     emoji: "🧠" },
  { id: 3,  name: "Sigma Wave",       role: "Volatility",    emoji: "〰️" },
  { id: 4,  name: "Oracle Prime",     role: "Macro",         emoji: "🔮" },
  { id: 5,  name: "Chain Pulse",      role: "On-Chain",      emoji: "⛓" },
  { id: 6,  name: "Flux Arbiter",     role: "Arbitrage",     emoji: "⚡" },
  { id: 7,  name: "Deep Codex",       role: "Pattern",       emoji: "🔬" },
  { id: 8,  name: "Quantum Veil",     role: "DeFi",          emoji: "💎" },
  { id: 9,  name: "Echo Matrix",      role: "Correlation",   emoji: "🔗" },
  { id: 10, name: "Apex Sentinel",    role: "Risk",          emoji: "🛡" },
  { id: 11, name: "Meta Genius TR2",  role: "Orchestrator",  emoji: "⚛️" },
  { id: 12, name: "Krealogoik",       role: "Recursive AI",  emoji: "🌀" },
];

const PAIRS = ["QEMMA/USDC", "ETH/USDC", "BTC/USDT", "SOL/USDC"];
const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1d"];

function randomSignal() {
  const r = Math.random();
  if (r < 0.35) return "BUY";
  if (r < 0.6)  return "HOLD";
  return "SELL";
}
function randomConf() { return 50 + Math.floor(Math.random() * 48); }

function buildAgentState() {
  return AGENTS.map(a => ({
    ...a,
    signal:     randomSignal(),
    confidence: randomConf(),
    lastUpdate: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    thinking:   false,
  }));
}

function consensus(agents) {
  const counts = { BUY: 0, HOLD: 0, SELL: 0 };
  agents.forEach(a => { counts[a.signal]++; });
  const weighted = agents.reduce((acc, a) => {
    acc[a.signal] = (acc[a.signal] || 0) + a.confidence;
    return acc;
  }, {});
  const winner = Object.entries(weighted).sort((a, b) => b[1] - a[1])[0][0];
  const avgConf = Math.round(agents.reduce((s, a) => s + a.confidence, 0) / agents.length);
  return { signal: winner, confidence: avgConf, votes: counts };
}

const signalColor = { BUY: "#00ff80", SELL: "#ff4444", HOLD: "#ffaa00" };
const signalBg    = { BUY: "rgba(0,255,128,0.12)", SELL: "rgba(255,68,68,0.12)", HOLD: "rgba(255,170,0,0.12)" };

export default function AISignalDashboard() {
  const [agents,    setAgents]    = useState(buildAgentState);
  const [pair,      setPair]      = useState(PAIRS[0]);
  const [tf,        setTf]        = useState("15m");
  const [autoRefresh, setAuto]    = useState(true);
  const [lastScan,  setLastScan]  = useState(new Date().toLocaleTimeString("de-DE"));
  const [alerts,    setAlerts]    = useState([]);
  const [scanning,  setScanning]  = useState(false);
  const [selected,  setSelected]  = useState(null);

  const con = consensus(agents);

  const runScan = useCallback(() => {
    setScanning(true);
    // Animate agents one by one
    AGENTS.forEach((a, i) => {
      setTimeout(() => {
        setAgents(prev => prev.map((ag, idx) =>
          idx === i ? { ...ag, thinking: true } : ag));
        setTimeout(() => {
          const sig  = randomSignal();
          const conf = randomConf();
          setAgents(prev => prev.map((ag, idx) =>
            idx === i ? { ...ag, signal: sig, confidence: conf, thinking: false,
                          lastUpdate: new Date().toLocaleTimeString("de-DE") } : ag));
        }, 300);
      }, i * 120);
    });
    setTimeout(() => {
      setScanning(false);
      setLastScan(new Date().toLocaleTimeString("de-DE"));
      // Generate alert if strong consensus
      const newCon = consensus(buildAgentState());
      if (newCon.confidence > 80) {
        setAlerts(prev => [{
          id: Date.now(),
          msg: `🔔 Starkes ${newCon.signal} Signal auf ${pair} — ${newCon.confidence}% Konfidenz`,
          ts:  new Date().toLocaleTimeString("de-DE"),
          type: newCon.signal,
        }, ...prev.slice(0, 4)]);
      }
    }, AGENTS.length * 120 + 400);
  }, [pair]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const iv = setInterval(runScan, 15000);
    return () => clearInterval(iv);
  }, [autoRefresh, runScan]);

  return (
    <div style={{ minHeight: "100vh", background: "#000d1a", color: "#e0f0ff",
                  fontFamily: "'Rajdhani',sans-serif", padding: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#00ffff" }}>
            ⚛️ AI Signal Dashboard v2
          </h1>
          <p style={{ margin: "4px 0 0", color: "#556677", fontSize: 13 }}>
            12-Agenten Orchestrator · Meta Genius TR2 · Letzter Scan: {lastScan}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PAIRS.map(p => (
            <button key={p} onClick={() => setPair(p)}
              style={{ padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontWeight: 700, fontSize: 13,
                       background: pair === p ? "rgba(0,255,255,0.15)" : "rgba(255,255,255,0.04)",
                       border: `1px solid ${pair === p ? "#00ffff" : "rgba(255,255,255,0.1)"}`,
                       color: pair === p ? "#00ffff" : "#8899aa" }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Timeframes + Controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {TIMEFRAMES.map(t => (
          <button key={t} onClick={() => setTf(t)}
            style={{ padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13,
                     background: tf === t ? "rgba(0,128,255,0.2)" : "rgba(255,255,255,0.04)",
                     border: `1px solid ${tf === t ? "#0080ff" : "rgba(255,255,255,0.1)"}`,
                     color: tf === t ? "#0080ff" : "#8899aa" }}>
            {t}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setAuto(a => !a)}
            style={{ padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                     background: autoRefresh ? "rgba(0,255,128,0.1)" : "rgba(255,255,255,0.04)",
                     border: `1px solid ${autoRefresh ? "#00ff80" : "rgba(255,255,255,0.1)"}`,
                     color: autoRefresh ? "#00ff80" : "#8899aa" }}>
            {autoRefresh ? "⏸ Auto" : "▶ Auto"}
          </button>
          <button onClick={runScan} disabled={scanning}
            style={{ padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
                     background: scanning ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg,#00ffff,#0080ff)",
                     border: "none", color: scanning ? "#8899aa" : "#000" }}>
            {scanning ? "⏳ Scannt..." : "🔄 Scan"}
          </button>
        </div>
      </div>

      {/* Consensus Card */}
      <div style={{ background: signalBg[con.signal], border: `1px solid ${signalColor[con.signal]}44`,
                    borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ color: "#8899aa", fontSize: 13, marginBottom: 6 }}>KONSENS-SIGNAL · {pair} · {tf}</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: signalColor[con.signal],
                          textShadow: `0 0 30px ${signalColor[con.signal]}88` }}>
              {con.signal}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#8899aa", fontSize: 13 }}>Konfidenz</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: signalColor[con.signal] }}>{con.confidence}%</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {Object.entries(con.votes).map(([sig, cnt]) => (
              <div key={sig} style={{ textAlign: "center" }}>
                <div style={{ color: signalColor[sig], fontWeight: 700, fontSize: 18 }}>{cnt}</div>
                <div style={{ color: "#556677", fontSize: 11 }}>{sig}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Confidence Bar */}
        <div style={{ marginTop: 16, background: "rgba(0,0,0,0.3)", borderRadius: 8, height: 8, overflow: "hidden" }}>
          <div style={{ width: `${con.confidence}%`, height: "100%", background: signalColor[con.signal],
                        boxShadow: `0 0 12px ${signalColor[con.signal]}`, transition: "width 0.8s", borderRadius: 8 }} />
        </div>
      </div>

      {/* Agent Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 20 }}>
        {agents.map(a => (
          <div key={a.id} onClick={() => setSelected(selected?.id === a.id ? null : a)}
            style={{ background: a.thinking ? "rgba(0,255,255,0.08)" : "rgba(0,20,40,0.85)",
                     border: `1px solid ${selected?.id === a.id ? "#00ffff" : a.thinking ? "rgba(0,255,255,0.3)" : "rgba(0,255,255,0.1)"}`,
                     borderRadius: 12, padding: 14, cursor: "pointer", transition: "all 0.3s",
                     boxShadow: a.thinking ? "0 0 16px rgba(0,255,255,0.2)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{a.emoji} {a.name}</div>
                <div style={{ color: "#556677", fontSize: 11 }}>{a.role}</div>
              </div>
              <div style={{ background: signalBg[a.signal], border: `1px solid ${signalColor[a.signal]}44`,
                            borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 800,
                            color: signalColor[a.signal] }}>
                {a.thinking ? "..." : a.signal}
              </div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 6, height: 5, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ width: a.thinking ? "100%" : `${a.confidence}%`, height: "100%",
                            background: a.thinking
                              ? "linear-gradient(90deg,transparent,#00ffff,transparent)"
                              : signalColor[a.signal],
                            transition: "width 0.6s", borderRadius: 6,
                            animation: a.thinking ? "pulse 0.8s infinite" : "none" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: signalColor[a.signal], fontSize: 12, fontWeight: 700 }}>
                {a.thinking ? "Analysiert..." : `${a.confidence}%`}
              </span>
              <span style={{ color: "#334455", fontSize: 11 }}>{a.lastUpdate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ background: "rgba(0,20,40,0.85)", border: "1px solid rgba(0,255,255,0.15)",
                      borderRadius: 14, padding: 16 }}>
          <div style={{ color: "#00ffff", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🔔 Signal Alerts</div>
          {alerts.map(al => (
            <div key={al.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                                      padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ color: signalColor[al.type] || "#8899aa", fontSize: 13 }}>{al.msg}</span>
              <span style={{ color: "#334455", fontSize: 11 }}>{al.ts}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 24, color: "#334455", fontSize: 11 }}>
        © 2026 Grigori Saks — Quantum Emma · Meta Genius TR2 · Patent Pending
      </div>
    </div>
  );
}
