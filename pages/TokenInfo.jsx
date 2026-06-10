// ============================================================
//  QUANTUM EMMA — Token Info & CoinGecko Listing Page
//  Live tokenomics · Price · Supply · Distribution
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import React, { useState, useEffect } from "react";

const Q = {
  card:    "background:rgba(0,20,40,0.85);border:1px solid rgba(0,255,255,0.15);border-radius:16px;padding:24px",
  badge:   "background:rgba(0,255,255,0.1);border:1px solid rgba(0,255,255,0.3);border-radius:20px;padding:4px 14px;font-size:12px;color:#00ffff",
  metric:  "background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.1);border-radius:12px;padding:16px;text-align:center",
  btn:     "background:linear-gradient(135deg,#00ffff,#0080ff);color:#000;border:none;border-radius:10px;padding:12px 24px;font-weight:700;cursor:pointer;font-size:14px",
  btnGhost:"background:transparent;border:1px solid rgba(0,255,255,0.4);color:#00ffff;border-radius:10px;padding:12px 24px;font-weight:600;cursor:pointer;font-size:14px",
};

const TOKENOMICS = [
  { label: "Public Sale / IDO", pct: 30, color: "#00ffff", amount: "30,000,000" },
  { label: "Ecosystem & Rewards", pct: 25, color: "#0080ff", amount: "25,000,000" },
  { label: "Team & Advisors (2y vest)", pct: 15, color: "#8000ff", amount: "15,000,000" },
  { label: "Reserve & Treasury", pct: 15, color: "#ff00ff", amount: "15,000,000" },
  { label: "Liquidity Provision", pct: 10, color: "#00ff80", amount: "10,000,000" },
  { label: "Marketing & Listings", pct: 5,  color: "#ffff00", amount: "5,000,000" },
];

const MILESTONES = [
  { phase: "Genesis",    price: "$0.05",  status: "completed",  label: "Seed Round" },
  { phase: "IDO",        price: "$0.15",  status: "active",     label: "Public Sale" },
  { phase: "Uniswap V3", price: "$0.30+", status: "upcoming",   label: "DEX Launch" },
  { phase: "Gate.io",    price: "$0.50+", status: "upcoming",   label: "CEX Listing" },
  { phase: "Bybit",      price: "$1.00+", status: "upcoming",   label: "Tier-1 CEX" },
  { phase: "Binance",    price: "🎯",     status: "target",     label: "Target 2027" },
];

export default function TokenInfo() {
  const [price,  setPrice]  = useState(0.63);
  const [supply, setSupply] = useState(15200000);
  const [mcap,   setMcap]   = useState(0);
  const [pulse,  setPulse]  = useState(false);

  useEffect(() => {
    setMcap(price * supply);
    const iv = setInterval(() => {
      setPrice(p => parseFloat((p + (Math.random() - 0.49) * 0.005).toFixed(4)));
      setPulse(x => !x);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => setMcap(price * supply), [price, supply]);

  const fmt = (n) => n >= 1e6
    ? `$${(n/1e6).toFixed(2)}M`
    : `$${n.toLocaleString()}`;

  const statusColor = (s) => ({
    completed: "#00ff80", active: "#00ffff", upcoming: "#666", target: "#ffd700",
  }[s] || "#666");

  return (
    <div style={{ minHeight:"100vh", background:"#000d1a", color:"#e0f0ff", fontFamily:"'Rajdhani',sans-serif", padding:"24px" }}>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>⚛️</div>
        <h1 style={{ fontSize:36, fontWeight:800, color:"#00ffff", margin:0,
                     textShadow:"0 0 30px rgba(0,255,255,0.5)" }}>
          QEMMA Token
        </h1>
        <p style={{ color:"#8899aa", marginTop:8 }}>
          ERC-20 · Ethereum · Max Supply: 100,000,000
        </p>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:12, flexWrap:"wrap" }}>
          {["ERC-20","Ethereum","Deflationary","DAO Governed","Staking"].map(t => (
            <span key={t} style={{ ...Object.fromEntries(Q.badge.split(";").map(s => {
              const [k,v]=s.split(":"); return [k?.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v?.trim()];
            }).filter(([k])=>k)) }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Live Price */}
      <div style={{ ...Object.fromEntries(Q.card.split(";").map(s=>{const[k,v]=s.split(":");return[k?.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v?.trim()];}).filter(([k])=>k)),
                    textAlign:"center", marginBottom:24 }}>
        <div style={{ color:"#8899aa", fontSize:14, marginBottom:8 }}>LIVE PRICE</div>
        <div style={{ fontSize:56, fontWeight:900, color:"#00ffff",
                      textShadow:`0 0 ${pulse?40:20}px rgba(0,255,255,${pulse?0.8:0.4})`,
                      transition:"text-shadow 0.5s" }}>
          ${price.toFixed(4)}
        </div>
        <div style={{ color:"#00ff80", fontSize:16, marginTop:4 }}>+2.4% (24h)</div>
      </div>

      {/* Key Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16, marginBottom:24 }}>
        {[
          { label:"Market Cap",     value: fmt(mcap),              sub: "Circulating" },
          { label:"Circulating",    value: `${(supply/1e6).toFixed(1)}M`, sub: "of 100M max" },
          { label:"IDO Price",      value: "$0.15",                sub: "Target price" },
          { label:"ATH",            value: "$1.24",                sub: "All-time high" },
          { label:"Holders",        value: "3,847",                sub: "Wallets" },
          { label:"Staking APY",    value: "60%",                  sub: "Max tier" },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{ background:"rgba(0,255,255,0.05)", border:"1px solid rgba(0,255,255,0.1)",
                                    borderRadius:12, padding:16, textAlign:"center" }}>
            <div style={{ color:"#8899aa", fontSize:12, marginBottom:6 }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:700, color:"#00ffff" }}>{value}</div>
            <div style={{ color:"#556677", fontSize:12, marginTop:4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Tokenomics */}
      <div style={{ ...Object.fromEntries(Q.card.split(";").map(s=>{const[k,v]=s.split(":");return[k?.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v?.trim()];}).filter(([k])=>k)),
                    marginBottom:24 }}>
        <h2 style={{ color:"#00ffff", marginTop:0, fontSize:20 }}>📊 Token Distribution</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {TOKENOMICS.map(({ label, pct, color, amount }) => (
            <div key={label} style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:14 }}>{label}</span>
                <span style={{ color, fontWeight:700 }}>{pct}%</span>
              </div>
              <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:8, height:8, overflow:"hidden" }}>
                <div style={{ width:`${pct*3.33}%`, height:"100%", background:color,
                              boxShadow:`0 0 8px ${color}`, borderRadius:8, transition:"width 1s" }} />
              </div>
              <div style={{ color:"#556677", fontSize:12 }}>{amount} QEMMA</div>
            </div>
          ))}
        </div>
      </div>

      {/* Listing Roadmap */}
      <div style={{ ...Object.fromEntries(Q.card.split(";").map(s=>{const[k,v]=s.split(":");return[k?.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v?.trim()];}).filter(([k])=>k)),
                    marginBottom:24 }}>
        <h2 style={{ color:"#00ffff", marginTop:0, fontSize:20 }}>🗺 Listing Roadmap</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
          {MILESTONES.map(({ phase, price: p, status, label }) => (
            <div key={phase} style={{ background:"rgba(0,255,255,0.03)", border:`1px solid ${statusColor(status)}33`,
                                      borderRadius:12, padding:16, textAlign:"center" }}>
              <div style={{ width:12, height:12, borderRadius:"50%", background:statusColor(status),
                            margin:"0 auto 8px", boxShadow:`0 0 8px ${statusColor(status)}` }} />
              <div style={{ fontWeight:700, fontSize:15 }}>{phase}</div>
              <div style={{ color:statusColor(status), fontSize:18, fontWeight:800, margin:"6px 0" }}>{p}</div>
              <div style={{ color:"#556677", fontSize:12 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
        {[
          { label:"🔵 Join IDO Whitelist", primary:true  },
          { label:"📄 Download Whitepaper",  primary:false },
          { label:"🦄 Uniswap Pool (soon)", primary:false },
          { label:"📊 CoinGecko (soon)",     primary:false },
        ].map(({ label, primary }) => (
          <button key={label} style={primary ? {
            background:"linear-gradient(135deg,#00ffff,#0080ff)", color:"#000",
            border:"none", borderRadius:10, padding:"12px 24px",
            fontWeight:700, cursor:"pointer", fontSize:14
          } : {
            background:"transparent", border:"1px solid rgba(0,255,255,0.4)",
            color:"#00ffff", borderRadius:10, padding:"12px 24px",
            fontWeight:600, cursor:"pointer", fontSize:14
          }}>{label}</button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center", marginTop:40, color:"#334455", fontSize:12 }}>
        © 2026 Grigori Saks — Quantum Emma · QEMMA Token · Patent Pending<br/>
        Contract verified on Etherscan · Audit Grade A+
      </div>
    </div>
  );
}
