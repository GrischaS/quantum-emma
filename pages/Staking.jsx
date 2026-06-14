// ============================================================
//  QUANTUM EMMA — Staking Dashboard v2
//  5 Tiers · Live APY · Compound Calculator · Reward Claim
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import React, { useState, useEffect } from "react";

const TIERS = [
  { id: 1, name: "Genesis",    min: 1000,   max: 9999,   apy: 25, color: "#00aaff", icon: "🌱" },
  { id: 2, name: "Quantum",   min: 10000,  max: 49999,  apy: 35, color: "#0066ff", icon: "⚡" },
  { id: 3, name: "Nexus",     min: 50000,  max: 99999,  apy: 45, color: "#8800ff", icon: "💎" },
  { id: 4, name: "Ascension", min: 100000, max: 499999, apy: 55, color: "#ff00ff", icon: "🚀" },
  { id: 5, name: "Apex",      min: 500000, max: null,   apy: 75, color: "#ffd700", icon: "⚛️" },
];

const USER_STAKE = { amount: 15000, tier: 2, since: "2026-04-01", pendingReward: 87.4 };

export default function StakingV2() {
  const [calcAmt,   setCalcAmt]   = useState("15000");
  const [calcDays,  setCalcDays]  = useState("365");
  const [claiming,  setClaiming]  = useState(false);
  const [claimed,   setClaimed]   = useState(false);
  const [reward,    setReward]    = useState(USER_STAKE.pendingReward);
  const [stakeAmt,  setStakeAmt]  = useState("");
  const [staking,   setStaking]   = useState(false);
  const [totalStaked, setTotal]   = useState(48200000);

  // Reward counter — ticks up in realtime
  useEffect(() => {
    const iv = setInterval(() => {
      setReward(r => parseFloat((r + 0.000042).toFixed(6)));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const userTier    = TIERS.find(t => USER_STAKE.amount >= t.min && (t.max === null || USER_STAKE.amount <= t.max)) || TIERS[0];
  const calcTier    = TIERS.slice().reverse().find(t => parseFloat(calcAmt) >= t.min) || TIERS[0];
  const calcReward  = ((parseFloat(calcAmt) || 0) * (calcTier.apy / 100) * (parseFloat(calcDays) || 365) / 365);
  const calcCompound= ((parseFloat(calcAmt) || 0) * Math.pow(1 + calcTier.apy / 100 / 365, parseFloat(calcDays) || 365)) - (parseFloat(calcAmt) || 0);
  const stakeDays   = Math.floor((Date.now() - new Date(USER_STAKE.since)) / 86400000);

  const handleClaim = async () => {
    setClaiming(true);
    await new Promise(r => setTimeout(r, 1800));
    setClaiming(false); setClaimed(true);
    setTimeout(() => setClaimed(false), 4000);
    setReward(0.000042);
  };

  const handleStake = async () => {
    if (!stakeAmt) return;
    setStaking(true);
    await new Promise(r => setTimeout(r, 2000));
    setStaking(false); setStakeAmt("");
    setTotal(t => t + parseInt(stakeAmt));
  };

  return (
    <div style={{ minHeight:"100vh", background:"#000d1a", color:"#e0f0ff",
                  fontFamily:"'Rajdhani',sans-serif", padding:24 }}>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, color:"#00ffff", fontSize:28, fontWeight:900 }}>🏦 Staking v2</h1>
        <p style={{ margin:"4px 0 0", color:"#556677", fontSize:13 }}>
          5 Tiers · Bis 75% APY · {(totalStaked/1e6).toFixed(1)}M QEMMA gestakt
        </p>
      </div>

      {/* User Position */}
      <div style={{ background:"rgba(0,20,40,0.9)", border:`2px solid ${userTier.color}44`,
                    borderRadius:20, padding:24, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ color:"#556677", fontSize:13, marginBottom:6 }}>DEINE POSITION</div>
            <div style={{ fontSize:40, fontWeight:900, color:userTier.color }}>
              {USER_STAKE.amount.toLocaleString()} QEMMA
            </div>
            <div style={{ display:"flex", gap:10, marginTop:8, flexWrap:"wrap" }}>
              <span style={{ background:userTier.color+"22", border:`1px solid ${userTier.color}44`,
                             borderRadius:20, padding:"3px 12px", color:userTier.color,
                             fontSize:13, fontWeight:700 }}>
                {userTier.icon} {userTier.name} Tier
              </span>
              <span style={{ color:"#556677", fontSize:13, marginTop:3 }}>
                {stakeDays} Tage gestakt · seit {USER_STAKE.since}
              </span>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"#556677", fontSize:12 }}>APY</div>
            <div style={{ fontSize:48, fontWeight:900, color:"#00ff80",
                          textShadow:"0 0 20px rgba(0,255,128,0.5)" }}>
              {userTier.apy}%
            </div>
          </div>
        </div>

        {/* Pending Reward */}
        <div style={{ marginTop:20, background:"rgba(0,255,128,0.06)", border:"1px solid rgba(0,255,128,0.2)",
                      borderRadius:14, padding:16, display:"flex",
                      justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ color:"#556677", fontSize:12, marginBottom:4 }}>AUSSTEHENDE REWARDS</div>
            <div style={{ fontSize:32, fontWeight:900, color:"#00ff80",
                          fontVariantNumeric:"tabular-nums" }}>
              {reward.toFixed(6)} QEMMA
            </div>
            <div style={{ color:"#334455", fontSize:12, marginTop:2 }}>
              ≈ ${(reward * 0.63).toFixed(2)} USD
            </div>
          </div>
          {claimed ? (
            <div style={{ color:"#00ff80", fontWeight:800, fontSize:18 }}>✅ Claimed!</div>
          ) : (
            <button onClick={handleClaim} disabled={claiming}
              style={{ padding:"12px 28px", borderRadius:12, fontWeight:800, fontSize:16, cursor:"pointer",
                       border:"none", background: claiming ? "rgba(0,255,128,0.1)" : "#00ff80",
                       color: claiming ? "#00ff80" : "#000" }}>
              {claiming ? "⏳ Claiming..." : "💰 Claim Rewards"}
            </button>
          )}
        </div>
      </div>

      {/* Tier Overview */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",
                    gap:12, marginBottom:20 }}>
        {TIERS.map(t => {
          const isUser = t.id === userTier.id;
          return (
            <div key={t.id} style={{ background: isUser ? `${t.color}18` : "rgba(0,20,40,0.85)",
                                      border:`${isUser ? 2 : 1}px solid ${isUser ? t.color : t.color+"33"}`,
                                      borderRadius:14, padding:16, transition:"all 0.3s",
                                      position:"relative", overflow:"hidden" }}>
              {isUser && (
                <div style={{ position:"absolute", top:8, right:8, background:t.color,
                               color:"#000", fontSize:9, fontWeight:900,
                               borderRadius:6, padding:"2px 6px" }}>AKTIV</div>
              )}
              <div style={{ fontSize:24, marginBottom:8 }}>{t.icon}</div>
              <div style={{ color:t.color, fontWeight:800, fontSize:16 }}>{t.name}</div>
              <div style={{ color:"#556677", fontSize:11, marginBottom:10 }}>
                {t.min.toLocaleString()}{t.max ? ` – ${t.max.toLocaleString()}` : "+"} QEMMA
              </div>
              <div style={{ fontSize:32, fontWeight:900, color:t.color }}>{t.apy}%</div>
              <div style={{ color:"#334455", fontSize:11 }}>APY</div>
              {/* Progress to next tier */}
              {isUser && t.max && (
                <div style={{ marginTop:10 }}>
                  <div style={{ color:"#556677", fontSize:10, marginBottom:4 }}>
                    Nächstes Tier: {(TIERS[t.id].min - USER_STAKE.amount).toLocaleString()} QEMMA fehlen
                  </div>
                  <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:4, height:4 }}>
                    <div style={{ width:`${((USER_STAKE.amount - t.min) / (t.max - t.min)) * 100}%`,
                                  height:"100%", background:t.color, borderRadius:4 }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compound Calculator */}
      <div style={{ background:"rgba(0,20,40,0.85)", border:"1px solid rgba(0,255,255,0.12)",
                    borderRadius:16, padding:20, marginBottom:20 }}>
        <h3 style={{ margin:"0 0 16px", color:"#00ffff", fontSize:17 }}>🧮 Compound Calculator</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          {[
            { label:"QEMMA Betrag", val:calcAmt, set:setCalcAmt, ph:"15000" },
            { label:"Tage",         val:calcDays, set:setCalcDays, ph:"365" },
          ].map(({ label, val, set, ph }) => (
            <div key={label}>
              <div style={{ color:"#556677", fontSize:12, marginBottom:6 }}>{label}</div>
              <input value={val} onChange={e => set(e.target.value)} placeholder={ph}
                type="number" min="0"
                style={{ width:"100%", background:"rgba(255,255,255,0.05)",
                         border:"1px solid rgba(0,255,255,0.15)", borderRadius:10,
                         color:"#e0f0ff", padding:"10px 14px", fontSize:16,
                         fontWeight:700, outline:"none", boxSizing:"border-box" }} />
            </div>
          ))}
        </div>
        <div style={{ background:calcTier.color+"11", border:`1px solid ${calcTier.color}33`,
                      borderRadius:12, padding:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12 }}>
            {[
              { label:"Tier",          val:`${calcTier.icon} ${calcTier.name}`, color:calcTier.color },
              { label:"APY",           val:`${calcTier.apy}%`,                  color:calcTier.color },
              { label:"Einfacher Ertrag", val:`${calcReward.toFixed(2)} QEMMA`, color:"#00ff80" },
              { label:"Mit Compound",  val:`${calcCompound.toFixed(2)} QEMMA`,  color:"#00ffff" },
              { label:"Wert (@ $0.63)", val:`$${(calcCompound * 0.63).toFixed(0)}`, color:"#ffd700" },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div style={{ color:"#556677", fontSize:11 }}>{label}</div>
                <div style={{ color, fontWeight:800, fontSize:18, marginTop:4 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stake More */}
      <div style={{ background:"rgba(0,20,40,0.85)", border:"1px solid rgba(0,255,255,0.12)",
                    borderRadius:16, padding:20 }}>
        <h3 style={{ margin:"0 0 14px", color:"#00ffff", fontSize:17 }}>➕ Mehr staken</h3>
        <div style={{ display:"flex", gap:12 }}>
          <input value={stakeAmt} onChange={e => setStakeAmt(e.target.value)}
            placeholder="QEMMA Menge eingeben..." type="number" min="0"
            style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(0,255,255,0.15)",
                     borderRadius:10, color:"#e0f0ff", padding:"12px 16px", fontSize:16, outline:"none" }} />
          <button onClick={handleStake} disabled={staking || !stakeAmt}
            style={{ padding:"12px 24px", borderRadius:10, fontWeight:800, fontSize:15, cursor:"pointer",
                     border:"none", background: stakeAmt && !staking
                       ? "linear-gradient(135deg,#00ffff,#0080ff)" : "rgba(255,255,255,0.05)",
                     color: stakeAmt && !staking ? "#000" : "#556677" }}>
            {staking ? "⏳..." : "🏦 Staken"}
          </button>
        </div>
        {stakeAmt && (
          <div style={{ color:"#556677", fontSize:12, marginTop:8 }}>
            Neues Tier nach Stake: {(TIERS.slice().reverse().find(t => (USER_STAKE.amount + parseInt(stakeAmt)) >= t.min) || TIERS[0]).name}
            · APY: {(TIERS.slice().reverse().find(t => (USER_STAKE.amount + parseInt(stakeAmt)) >= t.min) || TIERS[0]).apy}%
          </div>
        )}
      </div>

      <div style={{ textAlign:"center", marginTop:24, color:"#334455", fontSize:11 }}>
        © 2026 Grigori Saks — Quantum Emma Staking · Patent Pending
      </div>
    </div>
  );
}
