// ============================================================
//  QUANTUM EMMA — Portfolio Tracker v2
//  Live PnL · Multi-Asset · Allocation Chart · History
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import React, { useState, useEffect } from "react";

const ASSETS = [
  { symbol: "QEMMA", name: "Quantum Emma", logo: "⚛️", qty: 15000,  buyPrice: 0.42,  color: "#00ffff" },
  { symbol: "ETH",   name: "Ethereum",     logo: "⟠",  qty: 1.24,   buyPrice: 3200,  color: "#8080ff" },
  { symbol: "BTC",   name: "Bitcoin",      logo: "₿",  qty: 0.018,  buyPrice: 58000, color: "#ffaa00" },
  { symbol: "USDC",  name: "USD Coin",     logo: "💵", qty: 2400,   buyPrice: 1.00,  color: "#00ff80" },
  { symbol: "SOL",   name: "Solana",       logo: "◎",  qty: 12,     buyPrice: 140,   color: "#ff8000" },
];

const LIVE_PRICES = { QEMMA: 0.63, ETH: 3820, BTC: 67400, USDC: 1.00, SOL: 168 };

export default function PortfolioTracker() {
  const [prices,  setPrices]  = useState({ ...LIVE_PRICES });
  const [history, setHistory] = useState([]);
  const [period,  setPeriod]  = useState("7d");
  const [hover,   setHover]   = useState(null);

  // Live price simulation
  useEffect(() => {
    const iv = setInterval(() => {
      setPrices(p => ({
        QEMMA: parseFloat((p.QEMMA + (Math.random() - 0.49) * 0.005).toFixed(4)),
        ETH:   parseFloat((p.ETH   + (Math.random() - 0.49) * 8).toFixed(2)),
        BTC:   parseFloat((p.BTC   + (Math.random() - 0.49) * 80).toFixed(0)),
        USDC:  1.00,
        SOL:   parseFloat((p.SOL   + (Math.random() - 0.49) * 1).toFixed(2)),
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  // Portfolio value history (simulate)
  useEffect(() => {
    const pts = 30;
    let val = 12400;
    setHistory(Array.from({ length: pts }, (_, i) => {
      val += (Math.random() - 0.46) * 200;
      return { x: i, v: Math.max(10000, val) };
    }));
  }, [period]);

  // Computed values
  const assets = ASSETS.map(a => {
    const current  = prices[a.symbol] || a.buyPrice;
    const value    = a.qty * current;
    const cost     = a.qty * a.buyPrice;
    const pnl      = value - cost;
    const pnlPct   = ((pnl / cost) * 100);
    return { ...a, current, value, cost, pnl, pnlPct };
  });

  const totalValue  = assets.reduce((s, a) => s + a.value, 0);
  const totalCost   = assets.reduce((s, a) => s + a.cost,  0);
  const totalPnl    = totalValue - totalCost;
  const totalPnlPct = (totalPnl / totalCost) * 100;

  // Chart helpers
  const minV = Math.min(...history.map(h => h.v));
  const maxV = Math.max(...history.map(h => h.v));
  const toY  = v => 80 - ((v - minV) / (maxV - minV + 1)) * 75;
  const pts  = history.map((h, i) =>
    `${(i / (history.length - 1)) * 340},${toY(h.v)}`).join(" ");

  return (
    <div style={{ minHeight: "100vh", background: "#000d1a", color: "#e0f0ff",
                  fontFamily: "'Rajdhani',sans-serif", padding: 24 }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: "#00ffff", fontSize: 28, fontWeight: 900 }}>
          💼 Portfolio Tracker v2
        </h1>
        <p style={{ margin: "4px 0 0", color: "#556677", fontSize: 13 }}>
          Live PnL · Multi-Asset · Quantum Emma Ecosystem
        </p>
      </div>

      {/* Total Value Card */}
      <div style={{ background: "rgba(0,20,40,0.9)", border: "1px solid rgba(0,255,255,0.2)",
                    borderRadius: 20, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ color: "#556677", fontSize: 13, marginBottom: 6 }}>GESAMTWERT</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#00ffff",
                          textShadow: "0 0 30px rgba(0,255,255,0.5)" }}>
              ${totalValue.toLocaleString("en", { maximumFractionDigits: 0 })}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <span style={{ color: totalPnl >= 0 ? "#00ff80" : "#ff4444",
                             fontSize: 18, fontWeight: 800 }}>
                {totalPnl >= 0 ? "▲" : "▼"} ${Math.abs(totalPnl).toLocaleString("en", { maximumFractionDigits: 0 })}
              </span>
              <span style={{ color: totalPnl >= 0 ? "#00ff80" : "#ff4444",
                             fontSize: 18, fontWeight: 700 }}>
                ({totalPnlPct >= 0 ? "+" : ""}{totalPnlPct.toFixed(2)}%)
              </span>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Investiert",  value: `$${totalCost.toLocaleString("en", { maximumFractionDigits: 0 })}` },
              { label: "Assets",      value: assets.length },
              { label: "24h Change",  value: "+4.1%",  color: "#00ff80" },
              { label: "Best Asset",  value: "QEMMA",  color: "#00ffff" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <div style={{ color: "#556677", fontSize: 11 }}>{label}</div>
                <div style={{ color: color || "#e0f0ff", fontWeight: 700, fontSize: 16 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sparkline Chart */}
        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {["24h", "7d", "30d", "all"].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  style={{ padding: "3px 10px", borderRadius: 8, cursor: "pointer", fontSize: 11,
                           background: period === p ? "rgba(0,255,255,0.15)" : "rgba(255,255,255,0.04)",
                           border: `1px solid ${period === p ? "#00ffff" : "rgba(255,255,255,0.1)"}`,
                           color: period === p ? "#00ffff" : "#556677" }}>
                  {p}
                </button>
              ))}
            </div>
            <svg width="100%" viewBox="0 0 340 90" style={{ display: "block" }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#00ffff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline points={pts + ` 340,90 0,90`} fill="url(#chartGrad)" />
              <polyline points={pts} fill="none" stroke="#00ffff" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Allocation Bars */}
      <div style={{ background: "rgba(0,20,40,0.85)", border: "1px solid rgba(0,255,255,0.12)",
                    borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 16px", color: "#00ffff", fontSize: 16 }}>📊 Allocation</h3>
        <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
          {assets.map(a => (
            <div key={a.symbol}
              title={`${a.symbol}: ${((a.value / totalValue) * 100).toFixed(1)}%`}
              style={{ width: `${(a.value / totalValue) * 100}%`, background: a.color,
                       transition: "width 0.8s" }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {assets.map(a => (
            <div key={a.symbol} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.color }} />
              <span style={{ color: "#8899aa", fontSize: 12 }}>{a.symbol}</span>
              <span style={{ color: a.color, fontSize: 12, fontWeight: 700 }}>
                {((a.value / totalValue) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Table */}
      <div style={{ background: "rgba(0,20,40,0.85)", border: "1px solid rgba(0,255,255,0.12)",
                    borderRadius: 16, padding: 20 }}>
        <h3 style={{ margin: "0 0 16px", color: "#00ffff", fontSize: 16 }}>🪙 Positionen</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: "#556677", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Asset","Menge","Preis","Wert","PnL","PnL %","Alloc"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "right",
                                       textAlign: h === "Asset" ? "left" : "right" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.sort((a, b) => b.value - a.value).map(a => (
                <tr key={a.symbol}
                  onMouseEnter={() => setHover(a.symbol)}
                  onMouseLeave={() => setHover(null)}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)",
                           background: hover === a.symbol ? "rgba(0,255,255,0.04)" : "transparent",
                           cursor: "default" }}>
                  <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{a.logo}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: a.color }}>{a.symbol}</div>
                      <div style={{ color: "#556677", fontSize: 11 }}>{a.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#8899aa" }}>
                    {a.qty.toLocaleString("en", { maximumFractionDigits: 4 })}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#e0f0ff", fontWeight: 600 }}>
                    ${a.current.toLocaleString("en", { maximumFractionDigits: 4 })}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#00ffff", fontWeight: 700 }}>
                    ${a.value.toLocaleString("en", { maximumFractionDigits: 0 })}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right",
                               color: a.pnl >= 0 ? "#00ff80" : "#ff4444", fontWeight: 700 }}>
                    {a.pnl >= 0 ? "+" : ""}${a.pnl.toLocaleString("en", { maximumFractionDigits: 0 })}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right",
                               color: a.pnlPct >= 0 ? "#00ff80" : "#ff4444", fontWeight: 700 }}>
                    {a.pnlPct >= 0 ? "+" : ""}{a.pnlPct.toFixed(1)}%
                  </td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 50, height: 5, background: "rgba(255,255,255,0.08)",
                                    borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${(a.value / totalValue) * 100}%`, height: "100%",
                                      background: a.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ color: "#8899aa", fontSize: 11 }}>
                        {((a.value / totalValue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 24, color: "#334455", fontSize: 11 }}>
        © 2026 Grigori Saks — Quantum Emma · Patent Pending
      </div>
    </div>
  );
}
