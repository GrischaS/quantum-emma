// ============================================================
//  QUANTUM EMMA — Mining v5.0 MEGA UPGRADE
//  4 Pools · Halving · Block Explorer · Live Hash Rate
//  4D/5D Holographic · © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};
function useTick(ms=100){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);return t;}
function Bar({v,c,h=6}){return<div style={{height:h,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}><div style={{height:h,width:`${Math.min(v,100)}%`,background:c,borderRadius:3,boxShadow:`0 0 6px ${c}66`,transition:"width .5s"}}/></div>;}

export default function Mining() {
  const tick = useTick(200);
  const [tab, setTab] = useState("pools");
  const [mining, setMining] = useState(false);
  const [hashRate, setHashRate] = useState(142.6);
  const [blockCount, setBlockCount] = useState(18420);
  const [earned, setEarned] = useState(420.0);
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;

  useEffect(()=>{
    if(!mining) return;
    if(tick%5===0) setHashRate(h=>parseFloat((h+(Math.random()-0.48)*2).toFixed(1)));
    if(tick%20===0) { setBlockCount(b=>b+1); setEarned(e=>parseFloat((e+0.24).toFixed(2))); }
  },[tick,mining]);

  const pools = [
    {name:"Quantum Pool",    color:Q.plasma,  reward:"0.48 QEMMA/block", hash:"842 GH/s", miners:1240, fee:"1.0%", diff:"Hard",   power:"180W",  daily:12.4},
    {name:"Plasma Pool",     color:Q.gluon,   reward:"0.24 QEMMA/block", hash:"421 GH/s", miners:680,  fee:"0.8%", diff:"Medium", power:"90W",   daily:6.2},
    {name:"Neutrino Pool",   color:Q.higgs,   reward:"0.12 QEMMA/block", hash:"210 GH/s", miners:340,  fee:"0.5%", diff:"Easy",   power:"45W",   daily:3.1},
    {name:"Genesis Pool",    color:Q.lepton,  reward:"0.06 QEMMA/block", hash:"105 GH/s", miners:120,  fee:"0.2%", diff:"Beginner",power:"22W",  daily:1.5},
  ];

  const recentBlocks = Array.from({length:10},(_,i)=>({
    block: blockCount-i,
    hash: `0x${Math.random().toString(16).slice(2,10)}...${Math.random().toString(16).slice(2,6)}`,
    reward: (0.48-i*0.002).toFixed(3),
    txs: Math.floor(Math.random()*20+5),
    time: `${i===0?"just now":`${i*12}s ago`}`,
    miner: `0x${Math.random().toString(16).slice(2,8)}...`,
  }));

  // Halving: every 210,000 blocks
  const halvingBlock = 210000;
  const blocksToHalving = halvingBlock - (blockCount % halvingBlock);
  const halvingPct = ((blockCount % halvingBlock)/halvingBlock*100).toFixed(1);

  return (
    <div style={{minHeight:"100vh",background:Q.void,color:Q.bright,fontFamily:"'Inter',sans-serif",paddingBottom:40}}>

      {/* HEADER */}
      <div style={{background:Q.deep,borderBottom:`1px solid ${Q.plasma}33`,padding:"14px 24px",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:900,fontSize:18,color:Q.quark}}>⛏ Mining Terminal v5.0</div>
          <div style={{color:Q.dim,fontSize:12}}>4 Pools · Live Hash Rate · Block Explorer · Halving Tracker</div>
        </div>
        <button onClick={()=>setMining(m=>!m)} style={{
          padding:"10px 24px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:800,fontSize:14,
          background:mining?`linear-gradient(135deg,${Q.tauon},${Q.muon})`:`linear-gradient(135deg,${Q.lepton},${Q.gluon})`,
          color:mining?Q.bright:Q.void,boxShadow:`0 0 ${12+pulse*8}px ${mining?Q.tauon:Q.lepton}55`}}>
          {mining?"⏹ Stop Mining":"⛏ Start Mining"}
        </button>
      </div>

      {/* LIVE STATS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,padding:"16px 20px 0",maxWidth:1200,margin:"0 auto"}}>
        {[
          {label:"Hash Rate",    val:`${hashRate} GH/s`, color:Q.plasma, anim:mining},
          {label:"Block Height", val:`#${blockCount.toLocaleString()}`, color:Q.gluon, anim:false},
          {label:"Earned Today", val:`${earned} QEMMA`, color:Q.lepton, anim:mining},
          {label:"Next Halving", val:`${blocksToHalving.toLocaleString()} blocks`, color:Q.higgs, anim:false},
          {label:"Network Diff", val:"14.2 TH", color:Q.boson, anim:false},
        ].map((s,i)=>(
          <div key={i} style={{background:Q.bg1,borderRadius:14,padding:"14px 16px",
            border:`1px solid ${s.color}${s.anim?Math.round((0.2+pulse*0.3)*255).toString(16).padStart(2,"0"):"22"}`,
            boxShadow:s.anim?`0 0 ${10+pulse*10}px ${s.color}22`:"none",transition:"all .3s"}}>
            <div style={{fontSize:10,color:Q.dim,marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:16,fontWeight:900,color:s.color}}>{s.val}</div>
            {s.anim && <div style={{width:6,height:6,borderRadius:"50%",background:Q.lepton,
              marginTop:6,boxShadow:`0 0 ${4+pulse*6}px ${Q.lepton}`,display:"inline-block"}}/>}
          </div>
        ))}
      </div>

      <div style={{maxWidth:1200,margin:"16px auto",padding:"0 20px"}}>

        {/* Halving Bar */}
        <div style={{background:Q.bg1,borderRadius:14,padding:"16px 20px",border:`1px solid ${Q.higgs}33`,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{color:Q.higgs,fontWeight:700}}>⏰ Halving Progress</span>
            <span style={{color:Q.dim,fontSize:12}}>{blocksToHalving.toLocaleString()} blocks remaining · ~{Math.round(blocksToHalving/144)} days</span>
          </div>
          <Bar v={parseFloat(halvingPct)} c={`linear-gradient(90deg,${Q.higgs},${Q.muon})`} h={10}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:Q.dim,marginTop:6}}>
            <span>Block {(blockCount-blockCount%halvingBlock).toLocaleString()}</span>
            <span style={{color:Q.higgs}}>{halvingPct}% complete</span>
            <span>Block {halvingBlock.toLocaleString()}</span>
          </div>
        </div>

        {/* TABS */}
        <div style={{display:"flex",gap:4,background:Q.bg1,borderRadius:10,padding:4,
          border:`1px solid ${Q.plasma}22`,marginBottom:14,width:"fit-content"}}>
          {[["pools","⛏ Pools"],["explorer","🔍 Explorer"],["rewards","💰 Rewards"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:"7px 18px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
              background:tab===t?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:"transparent",
              color:tab===t?Q.bright:Q.dim}}>
              {l}
            </button>
          ))}
        </div>

        {/* POOLS */}
        {tab==="pools" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {pools.map((p,i)=>(
              <div key={i} style={{background:Q.bg1,borderRadius:14,padding:"18px 20px",
                border:`1px solid ${p.color}${Math.round((0.1+pulse*0.1)*255).toString(16).padStart(2,"0")}`,
                boxShadow:`0 0 ${8+pulse*6}px ${p.color}0a`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontWeight:800,fontSize:15,color:p.color}}>{p.name}</div>
                  <span style={{padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,
                    background:`${p.color}20`,color:p.color,border:`1px solid ${p.color}44`}}>{p.diff}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[
                    ["Reward",p.reward,p.color],["Hash Rate",p.hash,Q.gluon],
                    ["Miners",p.miners.toLocaleString(),Q.mid],["Pool Fee",p.fee,Q.higgs],
                    ["Power",p.power,Q.muon],["Daily Est.",`${p.daily} QEMMA`,Q.lepton],
                  ].map(([k,v,c])=>(
                    <div key={k} style={{padding:"6px 8px",background:`${c}0a`,borderRadius:8}}>
                      <div style={{fontSize:9,color:Q.dim}}>{k}</div>
                      <div style={{fontSize:12,fontWeight:700,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
                <button style={{width:"100%",padding:"10px",borderRadius:10,border:`1px solid ${p.color}44`,
                  background:`${p.color}20`,color:p.color,cursor:"pointer",fontWeight:700,fontSize:12}}>
                  ⛏ Join {p.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* EXPLORER */}
        {tab==="explorer" && (
          <div style={{background:Q.bg1,borderRadius:14,padding:"16px",border:`1px solid ${Q.plasma}22`}}>
            <div style={{color:Q.quark,fontWeight:700,marginBottom:12}}>🔍 Recent Blocks</div>
            <div style={{display:"grid",gridTemplateColumns:"80px 1fr 80px 50px 80px 80px",
              gap:8,padding:"0 8px 8px",color:Q.dim,fontSize:10,borderBottom:`1px solid ${Q.plasma}11`,marginBottom:8}}>
              <span>Block</span><span>Hash</span><span>Reward</span><span>Txs</span><span>Miner</span><span style={{textAlign:"right"}}>Time</span>
            </div>
            {recentBlocks.map((b,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"80px 1fr 80px 50px 80px 80px",
                gap:8,padding:"7px 8px",borderRadius:8,background:i===0?`${Q.lepton}08`:"transparent",
                border:`1px solid ${i===0?Q.lepton+"22":"transparent"}`,fontSize:11,marginBottom:3}}>
                <span style={{color:Q.gluon,fontWeight:700}}>#{b.block.toLocaleString()}</span>
                <span style={{color:Q.dim,fontFamily:"monospace",fontSize:10}}>{b.hash}</span>
                <span style={{color:Q.lepton}}>{b.reward} QEMMA</span>
                <span style={{color:Q.mid}}>{b.txs}</span>
                <span style={{color:Q.dim,fontFamily:"monospace",fontSize:10}}>{b.miner}</span>
                <span style={{color:Q.dim,textAlign:"right"}}>{b.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* REWARDS */}
        {tab==="rewards" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{background:Q.bg1,borderRadius:14,padding:"20px",border:`1px solid ${Q.lepton}22`}}>
              <div style={{color:Q.lepton,fontWeight:700,fontSize:14,marginBottom:16}}>💰 Earnings Summary</div>
              {[
                {period:"Today",    amount:"12.4 QEMMA", usd:"$7.81",  color:Q.lepton},
                {period:"This Week",amount:"86.8 QEMMA", usd:"$54.68", color:Q.gluon},
                {period:"This Month",amount:"372 QEMMA", usd:"$234.36",color:Q.plasma},
                {period:"All Time", amount:"4,200 QEMMA",usd:"$2,646", color:Q.higgs},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",
                  padding:"10px 0",borderBottom:`1px solid ${Q.plasma}11`}}>
                  <span style={{color:Q.dim,fontSize:13}}>{r.period}</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:700,color:r.color}}>{r.amount}</div>
                    <div style={{fontSize:10,color:Q.dim}}>{r.usd}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:Q.bg1,borderRadius:14,padding:"20px",border:`1px solid ${Q.plasma}22`}}>
              <div style={{color:Q.quark,fontWeight:700,fontSize:14,marginBottom:16}}>⛏ Mining Calculator</div>
              {[
                {label:"Hash Rate",    val:"142.6 GH/s"},
                {label:"Power Cost",   val:"$0.08/kWh"},
                {label:"Pool Fee",     val:"1.0%"},
                {label:"Daily Revenue",val:"12.4 QEMMA ($7.81)"},
                {label:"Daily Power",  val:"-$0.35"},
                {label:"Daily Profit", val:"$7.46",bold:true,color:Q.lepton},
                {label:"Monthly Profit",val:"$223.80",bold:true,color:Q.lepton},
                {label:"Break-even",   val:"~42 days",color:Q.higgs},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",
                  padding:"8px 0",borderBottom:`1px solid ${Q.plasma}11`,fontSize:13}}>
                  <span style={{color:Q.dim}}>{r.label}</span>
                  <span style={{fontWeight:r.bold?800:600,color:r.color||Q.mid}}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
