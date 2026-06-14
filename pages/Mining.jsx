// ============================================================
//  QUANTUM EMMA — Mining Dashboard v2
//  4 Pools · Hashrate · Block Explorer · Halving Countdown
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import React, { useState, useEffect, useRef } from "react";

const POOLS = [
  { id:1, name:"Quantum Core",   algo:"HQMLL-PoS",  reward:12.4, hashrate:"4.2 TH/s",  miners:847,  color:"#00ffff", icon:"⚛️"  },
  { id:2, name:"Neural Forge",   algo:"AI-PoW",     reward:8.1,  hashrate:"2.8 TH/s",  miners:523,  color:"#0080ff", icon:"🧠" },
  { id:3, name:"Meta Codex",     algo:"HQMLL-v2",   reward:18.6, hashrate:"6.1 TH/s",  miners:1204, color:"#8800ff", icon:"🌀" },
  { id:4, name:"Genesis Vault",  algo:"Pure-PoS",   reward:5.2,  hashrate:"1.4 TH/s",  miners:312,  color:"#00ff80", icon:"🌱" },
];

const USER_POOL = { poolId:3, hashContrib:"0.04 TH/s", earnedToday:2.41, totalEarned:847.2 };

function useBlocks() {
  const [blocks, setBlocks] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      height: 1847230 - i,
      hash:   "0x" + Array.from({length:8}, () => Math.floor(Math.random()*16).toString(16)).join(""),
      txs:    Math.floor(Math.random() * 80 + 20),
      reward: (12 + Math.random() * 6).toFixed(2),
      miner:  "0x" + Array.from({length:4}, () => Math.floor(Math.random()*16).toString(16)).join("") + "...",
      age:    `${i * 13 + Math.floor(Math.random()*5)}s ago`,
    }))
  );

  useEffect(() => {
    const iv = setInterval(() => {
      setBlocks(prev => [{
        height: prev[0].height + 1,
        hash:   "0x" + Array.from({length:8}, () => Math.floor(Math.random()*16).toString(16)).join(""),
        txs:    Math.floor(Math.random() * 80 + 20),
        reward: (12 + Math.random() * 6).toFixed(2),
        miner:  "0x" + Array.from({length:4}, () => Math.floor(Math.random()*16).toString(16)).join("") + "...",
        age:    "just now",
      }, ...prev.slice(0, 7)]);
    }, 13000);
    return () => clearInterval(iv);
  }, []);

  return blocks;
}

function HalvingCountdown() {
  const HALVING_BLOCK = 2100000;
  const CURRENT_BLOCK = 1847230;
  const blocksLeft    = HALVING_BLOCK - CURRENT_BLOCK;
  const secondsLeft   = blocksLeft * 13;

  const [sLeft, setSLeft] = useState(secondsLeft);
  useEffect(() => {
    const iv = setInterval(() => setSLeft(s => s - 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const d = Math.floor(sLeft / 86400);
  const h = Math.floor((sLeft % 86400) / 3600);
  const m = Math.floor((sLeft % 3600) / 60);
  const s = sLeft % 60;
  const pct = ((CURRENT_BLOCK / HALVING_BLOCK) * 100).toFixed(1);

  return (
    <div style={{ background:"rgba(255,170,0,0.08)", border:"1px solid rgba(255,170,0,0.25)",
                  borderRadius:16, padding:20, marginBottom:20 }}>
      <div style={{ color:"#ffaa00", fontWeight:800, fontSize:16, marginBottom:12 }}>
        ⏳ Nächstes Halving — Block #{HALVING_BLOCK.toLocaleString()}
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:14, flexWrap:"wrap" }}>
        {[[d,"Tage"],[h,"Std"],[m,"Min"],[s,"Sek"]].map(([val, lbl]) => (
          <div key={lbl} style={{ textAlign:"center", minWidth:60 }}>
            <div style={{ fontSize:36, fontWeight:900, color:"#ffaa00",
                          fontVariantNumeric:"tabular-nums", lineHeight:1 }}>
              {String(val).padStart(2,"0")}
            </div>
            <div style={{ color:"#556677", fontSize:11, marginTop:4 }}>{lbl}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:8, height:8, overflow:"hidden", marginBottom:8 }}>
        <div style={{ width:`${pct}%`, height:"100%", background:"linear-gradient(90deg,#ffaa00,#ff8800)",
                      boxShadow:"0 0 12px #ffaa0088", borderRadius:8, transition:"width 1s" }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#556677" }}>
        <span>{CURRENT_BLOCK.toLocaleString()} / {HALVING_BLOCK.toLocaleString()} Blocks</span>
        <span>{pct}% complete · {blocksLeft.toLocaleString()} blocks left</span>
      </div>
    </div>
  );
}

export default function MiningV2() {
  const blocks = useBlocks();
  const [hashrate, setHashrate] = useState(14.5);
  const [earned,   setEarned]   = useState(USER_POOL.earnedToday);
  const [tab,      setTab]      = useState("pools");
  const [joining,  setJoining]  = useState(null);
  const [joined,   setJoined]   = useState(USER_POOL.poolId);

  useEffect(() => {
    const iv = setInterval(() => {
      setHashrate(h => parseFloat((h + (Math.random() - 0.48) * 0.2).toFixed(2)));
      setEarned(e   => parseFloat((e + 0.0000167).toFixed(7)));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const userPool = POOLS.find(p => p.id === joined);

  const handleJoin = async (poolId) => {
    setJoining(poolId);
    await new Promise(r => setTimeout(r, 1500));
    setJoining(null);
    setJoined(poolId);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#000d1a", color:"#e0f0ff",
                  fontFamily:"'Rajdhani',sans-serif", padding:24 }}>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, color:"#00ffff", fontSize:28, fontWeight:900 }}>⛏ Mining v2</h1>
        <p style={{ margin:"4px 0 0", color:"#556677", fontSize:13 }}>
          4 Pools · HQMLL-PoS Algorithm · Block Explorer · Live Hashrate
        </p>
      </div>

      {/* Live Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
                    gap:12, marginBottom:20 }}>
        {[
          { label:"Netzwerk Hashrate", val:`${hashrate} TH/s`,          color:"#00ffff" },
          { label:"Heute verdient",    val:`${earned.toFixed(4)} QEMMA`, color:"#00ff80" },
          { label:"Gesamt verdient",   val:`${USER_POOL.totalEarned} QEMMA`, color:"#00ffff" },
          { label:"Mein Pool",         val:userPool?.name || "—",        color:userPool?.color || "#556677" },
          { label:"Block Height",      val:`#${blocks[0]?.height?.toLocaleString()}`, color:"#ffd700" },
          { label:"Block Zeit",        val:"~13 Sek",                    color:"#8899aa" },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background:"rgba(0,20,40,0.85)",
                                    border:"1px solid rgba(0,255,255,0.1)",
                                    borderRadius:12, padding:14, textAlign:"center" }}>
            <div style={{ color:"#556677", fontSize:11, marginBottom:4 }}>{label}</div>
            <div style={{ color, fontWeight:800, fontSize:16, fontVariantNumeric:"tabular-nums" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Halving Countdown */}
      <HalvingCountdown />

      {/* Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[["pools","⛏ Pools"],["explorer","🔍 Block Explorer"],["stats","📊 Stats"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:"8px 18px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:13,
                     background: tab===t ? "rgba(0,255,255,0.12)" : "rgba(255,255,255,0.04)",
                     border:`1px solid ${tab===t ? "#00ffff" : "rgba(255,255,255,0.1)"}`,
                     color: tab===t ? "#00ffff" : "#556677" }}>{l}</button>
        ))}
      </div>

      {/* Pool Cards */}
      {tab === "pools" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {POOLS.map(pool => {
            const isJoined  = joined === pool.id;
            const isJoining = joining === pool.id;
            return (
              <div key={pool.id} style={{ background: isJoined ? `${pool.color}14` : "rgba(0,20,40,0.85)",
                                           border:`${isJoined?2:1}px solid ${isJoined ? pool.color : pool.color+"33"}`,
                                           borderRadius:16, padding:20, transition:"all 0.3s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <div>
                    <div style={{ fontSize:28, marginBottom:4 }}>{pool.icon}</div>
                    <div style={{ color:pool.color, fontWeight:800, fontSize:17 }}>{pool.name}</div>
                    <div style={{ color:"#556677", fontSize:12 }}>{pool.algo}</div>
                  </div>
                  {isJoined && (
                    <span style={{ background:pool.color+"22", border:`1px solid ${pool.color}44`,
                                   color:pool.color, borderRadius:20, padding:"4px 10px",
                                   fontSize:11, fontWeight:800, height:"fit-content" }}>AKTIV</span>
                  )}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
                  {[
                    { l:"Reward/Block", v:`${pool.reward} QEMMA`, c:pool.color },
                    { l:"Hashrate",     v:pool.hashrate,           c:"#8899aa" },
                    { l:"Miner",        v:pool.miners.toLocaleString(), c:"#8899aa" },
                  ].map(({ l,v,c }) => (
                    <div key={l}>
                      <div style={{ color:"#334455", fontSize:10 }}>{l}</div>
                      <div style={{ color:c, fontWeight:700, fontSize:14, marginTop:2 }}>{v}</div>
                    </div>
                  ))}
                </div>
                {/* Pool fill bar */}
                <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:6, height:6, overflow:"hidden", marginBottom:14 }}>
                  <div style={{ width:`${(pool.miners / 1500) * 100}%`, height:"100%",
                                background:pool.color, borderRadius:6,
                                boxShadow:`0 0 8px ${pool.color}` }} />
                </div>
                <button onClick={() => handleJoin(pool.id)} disabled={isJoined || isJoining}
                  style={{ width:"100%", padding:"10px 0", borderRadius:10, fontWeight:700, fontSize:14,
                           cursor: isJoined ? "default" : "pointer", border:"none",
                           background: isJoined ? `${pool.color}22`
                             : isJoining ? "rgba(255,255,255,0.05)"
                             : `linear-gradient(135deg,${pool.color},${pool.color}88)`,
                           color: isJoined ? pool.color : isJoining ? "#556677" : "#000" }}>
                  {isJoined ? `✅ Beigetreten` : isJoining ? "⏳ Joining..." : `⛏ Pool beitreten`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Block Explorer */}
      {tab === "explorer" && (
        <div style={{ background:"rgba(0,20,40,0.85)", border:"1px solid rgba(0,255,255,0.12)",
                      borderRadius:16, padding:20, overflowX:"auto" }}>
          <div style={{ color:"#00ffff", fontWeight:700, fontSize:16, marginBottom:14 }}>
            🔴 LIVE — Block Explorer
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:500 }}>
            <thead>
              <tr style={{ color:"#556677", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                {["Block","Hash","Txs","Reward","Miner","Zeit"].map(h => (
                  <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blocks.map((b, i) => (
                <tr key={b.height} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)",
                                            background: i===0 ? "rgba(0,255,255,0.04)" : "transparent",
                                            transition:"background 0.5s" }}>
                  <td style={{ padding:"10px 12px", color:"#00ffff", fontWeight:700 }}>#{b.height.toLocaleString()}</td>
                  <td style={{ padding:"10px 12px", color:"#556677", fontFamily:"monospace", fontSize:12 }}>{b.hash}</td>
                  <td style={{ padding:"10px 12px", color:"#8899aa" }}>{b.txs}</td>
                  <td style={{ padding:"10px 12px", color:"#00ff80", fontWeight:700 }}>{b.reward} QEMMA</td>
                  <td style={{ padding:"10px 12px", color:"#8899aa", fontFamily:"monospace", fontSize:12 }}>{b.miner}</td>
                  <td style={{ padding:"10px 12px", color:"#334455", fontSize:11 }}>{b.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "stats" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
          {[
            { label:"Total Blocks",    val:"1,847,230",   color:"#00ffff" },
            { label:"Total Rewards",   val:"22.4M QEMMA", color:"#00ff80" },
            { label:"Avg Block Time",  val:"13.2 Sek",    color:"#8899aa" },
            { label:"Total Miners",    val:"2,886",        color:"#ffd700" },
            { label:"Network Diff.",   val:"4.81 TH",      color:"#ff8800" },
            { label:"Blocks / Halving",val:"252,770 left", color:"#ffaa00" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background:"rgba(0,20,40,0.85)", border:"1px solid rgba(0,255,255,0.1)",
                                      borderRadius:14, padding:20, textAlign:"center" }}>
              <div style={{ color:"#556677", fontSize:12, marginBottom:8 }}>{label}</div>
              <div style={{ color, fontWeight:800, fontSize:22 }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign:"center", marginTop:28, color:"#334455", fontSize:11 }}>
        © 2026 Grigori Saks — Quantum Emma Mining · Patent Pending
      </div>
    </div>
  );
}
