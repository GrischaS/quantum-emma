// ============================================================
//  QUANTUM EMMA — Mining Enterprise v3.0
//  4D/5D Holographic · 4 Pools · Halving · Block Explorer
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef } from "react";

const Q = {
  void:"#000008", bg0:"#030012", bg1:"#06001e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", gluon:"#06b6d4",
  higgs:"#fbbf24", lepton:"#4ade80", muon:"#fb923c",
  tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};
function useTick(ms=90){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[]);return t;}
function Bar({v,c,h=4}){return<div style={{height:h,background:"rgba(255,255,255,0.05)",borderRadius:h/2}}><div style={{height:h,width:`${Math.min(v,100)}%`,background:c,borderRadius:h/2,transition:"width .5s",boxShadow:`0 0 6px ${c}66`}}/></div>;}
function HoloCard({children,color=Q.plasma,style={},tick=0,glow=false}){
  const p=.5+Math.sin(tick*.07)*.28;
  return<div style={{borderRadius:16,padding:"16px 18px",background:`linear-gradient(135deg,${color}12,${color}06,transparent)`,border:`1px solid ${color}${Math.round((p*.22+.08)*255).toString(16).padStart(2,"00")}`,boxShadow:glow?`0 0 ${Math.round(18+p*14)}px ${color}1a`:"",...style,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:`${(-50+tick*1.3)%200}%`,width:"50%",height:"100%",background:`linear-gradient(90deg,transparent,${color}06,transparent)`,pointerEvents:"none"}}/>
    {children}
  </div>;
}

const POOLS=[
  {id:1,name:"POOL ALPHA",  icon:"⚛️",agent:"ALPHA-Q", color:Q.neutrino,active:true, hr:847291,reward:78, fee:1.0,miners:2847,blocks:14821,mined:1142000,fill:73,eff:94.2},
  {id:2,name:"POOL BETA",   icon:"🧠",agent:"BETA-N",  color:Q.gluon,   active:true, hr:621044,reward:78, fee:1.5,miners:1924,blocks:10291,mined:803000, fill:61,eff:91.8},
  {id:3,name:"POOL GAMMA",  icon:"🔄",agent:"GAMMA-R", color:Q.lepton,  active:true, hr:514822,reward:78, fee:0.5,miners:1481,blocks:8847, mined:690000, fill:54,eff:96.4},
  {id:4,name:"POOL QUANTUM",icon:"💎",agent:"META-TR2",color:Q.higgs,   active:false,hr:0,     reward:156,fee:2.0,miners:892, blocks:4291, mined:670000, fill:42,eff:89.1},
];

// ─── HASH STREAM ─────────────────────────────────────────────────────────────
function HashStream({active,color,tick}){
  const chars="0123456789abcdef";
  const rnd=()=>Array.from({length:16},()=>chars[Math.floor(Math.random()*16)]).join("");
  const [hashes,setHashes]=useState([rnd(),rnd(),rnd(),rnd()]);
  useEffect(()=>{if(active&&tick%4===0)setHashes(h=>[rnd(),...h.slice(0,3)]);},[tick,active]);
  return(
    <div style={{fontFamily:"monospace",fontSize:9,lineHeight:2}}>
      {hashes.map((h,i)=>(
        <div key={i} style={{color:`${color}${Math.round((90-i*18)).toString(16).padStart(2,"00")}`,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          0x{h}…{Math.floor(Math.random()*65535).toString(16).padStart(4,"0")}
        </div>
      ))}
    </div>
  );
}

// ─── POOL CARD ────────────────────────────────────────────────────────────────
function PoolCard({pool,tick}){
  const p=.5+Math.sin(tick*.08+pool.id*.9)*.38;
  const hr=Math.round(pool.hr*(pool.active?(.91+Math.sin(tick*.1+pool.id)*.09):0));
  return(
    <div style={{padding:"20px 18px",borderRadius:16,
      background:`${pool.color}0e`,
      border:`2px solid ${pool.color}${Math.round((pool.active?.35:.18)*255).toString(16).padStart(2,"00")}`,
      boxShadow:pool.active?`0 0 ${Math.round(p*24)}px ${pool.color}14`:"none",
      position:"relative",overflow:"hidden"}}>
      {pool.active&&<div style={{position:"absolute",top:0,left:`${(-50+tick*1.5)%200}%`,width:"50%",height:"100%",
        background:`linear-gradient(90deg,transparent,${pool.color}08,transparent)`,pointerEvents:"none"}}/>}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div>
          <div style={{fontSize:26,marginBottom:5,filter:pool.active?`drop-shadow(0 0 ${Math.round(p*10)}px ${pool.color})`:"none"}}>{pool.icon}</div>
          <div style={{fontWeight:900,fontSize:14,color:pool.color,letterSpacing:1,
            textShadow:pool.active?`0 0 10px ${pool.color}88`:"none"}}>{pool.name}</div>
          <div style={{fontSize:9,color:Q.dim,marginTop:2}}>Agent: <b style={{color:pool.color}}>{pool.agent}</b></div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{padding:"4px 10px",borderRadius:20,fontSize:9,fontWeight:800,
            color:pool.active?Q.lepton:Q.tauon,
            background:`${pool.active?Q.lepton:Q.tauon}14`,
            border:`1px solid ${pool.active?Q.lepton:Q.tauon}33`}}>
            {pool.active?"● ACTIVE":"○ OFFLINE"}
          </div>
          <div style={{fontSize:9,color:Q.dim,marginTop:5}}>{pool.miners.toLocaleString()} miners</div>
        </div>
      </div>

      {/* Hash stream */}
      {pool.active&&(
        <div style={{background:"rgba(0,0,0,0.45)",borderRadius:9,padding:"8px 10px",marginBottom:12,
          border:`1px solid ${pool.color}18`}}>
          <HashStream active={pool.active} color={pool.color} tick={tick}/>
        </div>
      )}

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
        {[
          {l:"Hash Rate",    v:pool.active?`${hr.toLocaleString()} H/s`:"Offline"},
          {l:"Reward/Block", v:`${pool.reward} QEMMA`},
          {l:"Blocks Found", v:pool.blocks.toLocaleString()},
          {l:"Total Mined",  v:`${(pool.mined/1e6).toFixed(2)}M Q`},
          {l:"Pool Fee",     v:`${pool.fee}%`},
          {l:"Efficiency",   v:`${pool.eff}%`},
        ].map((s,i)=>(
          <div key={i} style={{padding:"7px 10px",borderRadius:8,
            background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{fontSize:8,color:Q.dim,letterSpacing:.5}}>{s.l}</div>
            <div style={{fontSize:11,fontWeight:800,color:pool.color,marginTop:3,
              textShadow:`0 0 6px ${pool.color}66`}}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{marginBottom:5,display:"flex",justifyContent:"space-between",fontSize:9}}>
        <span style={{color:Q.dim}}>Pool Capacity</span>
        <span style={{color:pool.color,fontWeight:700}}>{pool.fill}%</span>
      </div>
      <Bar v={pool.fill} c={pool.color} h={5}/>

      <button style={{marginTop:12,width:"100%",padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
        background:pool.active?`${pool.color}1a`:`${Q.lepton}12`,
        color:pool.active?pool.color:Q.lepton,fontWeight:800,fontSize:10,letterSpacing:1,
        border:`1px solid ${pool.active?pool.color:Q.lepton}33`}}>
        {pool.active?"⏸ PAUSE POOL":"▶ JOIN POOL"}
      </button>
    </div>
  );
}

// ─── HALVING CLOCK ────────────────────────────────────────────────────────────
function HalvingClock({tick}){
  const block=847291+Math.floor(tick/22);
  const next=1050000, rem=next-block;
  const prog=((block%210000)/210000)*100;
  const days=Math.floor(rem/7200), hours=Math.floor((rem%7200)/300);
  const history=[
    {n:"Genesis",    b:"0",         r:"2,500 Q", date:"2024-01-01",done:true},
    {n:"Halving #1", b:"210,000",   r:"1,250 Q", date:"2024-05-14",done:true},
    {n:"Halving #2", b:"420,000",   r:"625 Q",   date:"2024-10-18",done:true},
    {n:"Halving #3", b:"630,000",   r:"312 Q",   date:"2025-03-24",done:true},
    {n:"Halving #4", b:"840,000",   r:"156 Q",   date:"2025-09-01",done:true},
    {n:"Halving #5", b:"1,050,000", r:"78 Q",    date:"~2026-06",  done:false},
    {n:"Halving #6", b:"1,260,000", r:"39 Q",    date:"~2027-03",  done:false},
    {n:"Halving #7", b:"1,470,000", r:"19.5 Q",  date:"~2027-12",  done:false},
  ];
  return(
    <div style={{padding:"22px 24px",borderRadius:16,
      background:`linear-gradient(135deg,${Q.muon}10,${Q.higgs}06)`,
      border:`1px solid ${Q.muon}33`,
      boxShadow:`0 0 40px ${Q.muon}0e`}}>
      <div style={{fontWeight:900,fontSize:16,color:Q.muon,letterSpacing:2,marginBottom:16,
        textShadow:`0 0 20px ${Q.muon}88`}}>₿ BITCOIN-STYLE HALVING CLOCK</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:18}}>
        {[
          {l:"Current Block",  v:block.toLocaleString(),       c:Q.muon},
          {l:"Next Halving",   v:"1,050,000",                 c:Q.higgs},
          {l:"Blocks Left",    v:rem.toLocaleString(),        c:Q.tauon},
          {l:"Days Left",      v:`~${days}d ${hours}h`,       c:Q.lepton},
          {l:"Current Reward", v:"78 QEMMA",                  c:Q.neutrino},
        ].map((s,i)=>(
          <div key={i} style={{textAlign:"center",padding:"14px 8px",borderRadius:11,
            background:"rgba(0,0,0,0.35)",border:`1px solid ${s.c}22`}}>
            <div style={{fontSize:8,color:Q.dim,letterSpacing:1}}>{s.l}</div>
            <div style={{fontSize:15,fontWeight:900,color:s.c,marginTop:6,fontFamily:"monospace",
              textShadow:`0 0 8px ${s.c}88`}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:8,display:"flex",justifyContent:"space-between",fontSize:11}}>
        <span style={{color:Q.muon,fontWeight:700}}>Epoch Progress</span>
        <span style={{color:Q.higgs,fontWeight:800}}>{prog.toFixed(2)}%</span>
      </div>
      <div style={{height:10,background:"rgba(251,146,60,0.1)",borderRadius:5,overflow:"hidden",marginBottom:20}}>
        <div style={{height:10,width:`${prog}%`,borderRadius:5,
          background:"linear-gradient(90deg,#fb923c,#fbbf24)",
          boxShadow:"0 0 14px rgba(251,146,60,0.7)",transition:"width .5s"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {history.map((h,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:10,
            background:!h.done?"rgba(251,146,60,0.12)":"rgba(0,0,0,0.25)",
            border:`1px solid ${!h.done?"rgba(251,146,60,0.4)":"rgba(255,255,255,0.05)"}`}}>
            <div style={{fontSize:9,fontWeight:800,color:!h.done?Q.muon:Q.dim}}>{h.n}</div>
            <div style={{fontSize:13,fontWeight:900,color:!h.done?Q.higgs:Q.mid,marginTop:4}}>{h.r}</div>
            <div style={{fontSize:8,color:Q.dim,marginTop:3}}>Block {h.b}</div>
            <div style={{fontSize:8,marginTop:4,fontWeight:700,
              color:h.done?Q.lepton:Q.muon}}>{h.done?"✓ COMPLETE":h.date==="~2026-06"?"⏳ NEXT":h.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BLOCK EXPLORER ───────────────────────────────────────────────────────────
function BlockExplorer({tick}){
  const [blocks,setBlocks]=useState(()=>Array.from({length:14},(_,i)=>({
    height:847291-i,
    hash:"0x"+Math.random().toString(16).slice(2,12)+"…",
    miner:["ALPHA-Q","GAMMA-R","META-TR2","BETA-N","IOTA-V","DELTA-H"][i%6],
    reward:78,txs:Math.floor(Math.random()*28)+1,size:Math.floor(Math.random()*80+20)+"KB",
    time:new Date(Date.now()-i*12000),age:i,
  })));
  useEffect(()=>{
    if(tick%22===0) setBlocks(prev=>[{
      height:prev[0].height+1,hash:"0x"+Math.random().toString(16).slice(2,12)+"…",
      miner:["ALPHA-Q","GAMMA-R","META-TR2","BETA-N","IOTA-V","DELTA-H"][Math.floor(Math.random()*6)],
      reward:78,txs:Math.floor(Math.random()*28)+1,size:Math.floor(Math.random()*80+20)+"KB",
      time:new Date(),age:0,
    },...prev.slice(0,13)]);
  },[tick]);
  const mc={["ALPHA-Q"]:Q.neutrino,["GAMMA-R"]:Q.lepton,["META-TR2"]:Q.higgs,["BETA-N"]:Q.gluon,["IOTA-V"]:"#60a5fa",["DELTA-H"]:"#fcd34d"};
  return(
    <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${Q.plasma}22`}}>
      <div style={{display:"grid",gridTemplateColumns:"90px 1fr 80px 60px 50px 60px 80px",
        padding:"10px 16px",background:Q.bg1,fontSize:8,color:Q.dim,letterSpacing:1.5,
        borderBottom:`1px solid ${Q.plasma}18`}}>
        <span>BLOCK</span><span>HASH</span><span>MINER</span><span>REWARD</span><span>TXS</span><span>SIZE</span><span>AGE</span>
      </div>
      {blocks.map((b,i)=>(
        <div key={b.height} style={{display:"grid",
          gridTemplateColumns:"90px 1fr 80px 60px 50px 60px 80px",
          padding:"10px 16px",alignItems:"center",
          background:i===0?"rgba(139,92,246,0.10)":"rgba(0,0,0,0.15)",
          borderBottom:`1px solid rgba(255,255,255,0.03)`,
          transition:"background .3s"}}>
          <span style={{fontWeight:900,fontSize:12,color:Q.neutrino,fontFamily:"monospace"}}>
            #{b.height.toLocaleString()}
          </span>
          <span style={{fontSize:10,color:Q.dim,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.hash}</span>
          <span style={{fontSize:10,fontWeight:800,color:mc[b.miner]||Q.mid,textShadow:`0 0 6px ${mc[b.miner]||Q.mid}66`}}>{b.miner}</span>
          <span style={{fontSize:11,fontWeight:800,color:Q.higgs}}>{b.reward} Q</span>
          <span style={{fontSize:11,color:Q.mid}}>{b.txs}</span>
          <span style={{fontSize:10,color:Q.dim}}>{b.size}</span>
          <span style={{fontSize:9,color:Q.dim}}>{i===0?"just now":`${Math.round((Date.now()-b.time)/1000)}s ago`}</span>
        </div>
      ))}
    </div>
  );
}

// ─── MINING CONTROL ───────────────────────────────────────────────────────────
function MiningControl({tick}){
  const [mining,setMining]=useState(false);
  const [pool,setPool]=useState(0);
  const [threads,setThreads]=useState(4);
  const [earned,setEarned]=useState(0);
  useEffect(()=>{
    if(!mining)return;
    const rate=[.0042,.0031,.0026,.0078][pool]*(threads/4);
    const t=setInterval(()=>setEarned(e=>e+rate),200);
    return()=>clearInterval(t);
  },[mining,pool,threads]);
  const hr=mining?Math.round((220000+Math.sin(tick*.1)*15000)*(threads/4)):0;

  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <HoloCard color={mining?Q.lepton:Q.neutrino} tick={tick} glow={mining}>
        <div style={{textAlign:"center",padding:"10px 0 20px"}}>
          <div style={{fontSize:56,marginBottom:12,
            filter:mining?`drop-shadow(0 0 20px ${Q.lepton})`:"none",
            transition:"filter .3s"}}>{mining?"⛏":"💤"}</div>
          <div style={{fontSize:30,fontWeight:900,
            color:mining?Q.lepton:Q.mid,fontFamily:"monospace",marginBottom:4,
            textShadow:mining?`0 0 20px ${Q.lepton}88`:""}}>{earned.toFixed(6)}</div>
          <div style={{fontSize:11,color:Q.dim}}>QEMMA earned this session</div>
          {mining&&<div style={{fontSize:14,fontWeight:700,color:Q.lepton,marginTop:8,fontFamily:"monospace",
            textShadow:`0 0 12px ${Q.lepton}`}}>{hr.toLocaleString()} H/s</div>}
        </div>

        <div style={{marginBottom:12}}>
          <div style={{fontSize:9,color:Q.dim,letterSpacing:1,marginBottom:6}}>SELECT POOL</div>
          <select value={pool} onChange={e=>setPool(parseInt(e.target.value))} style={{
            width:"100%",padding:"9px 12px",borderRadius:10,
            background:"rgba(0,0,0,0.5)",border:`1px solid ${Q.neutrino}33`,
            color:Q.bright,fontSize:12}}>
            {["POOL ALPHA (1% fee)","POOL BETA (1.5% fee)","POOL GAMMA (0.5% — lowest)","POOL QUANTUM (2% — 2x reward)"].map((p,i)=>(
              <option key={i} value={i}>{p}</option>
            ))}
          </select>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:6}}>
            <span style={{color:Q.dim}}>CPU Threads</span>
            <span style={{color:Q.higgs,fontWeight:800}}>{threads} / 8</span>
          </div>
          <input type="range" min={1} max={8} value={threads}
            onChange={e=>setThreads(parseInt(e.target.value))}
            style={{width:"100%",accentColor:Q.neutrino}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:Q.dim,marginTop:3}}>
            <span>Eco (1)</span><span>Balanced (4)</span><span>Max (8)</span>
          </div>
        </div>

        <button onClick={()=>setMining(m=>!m)} style={{
          width:"100%",padding:"15px",borderRadius:13,border:"none",cursor:"pointer",
          background:mining
            ?"linear-gradient(135deg,#f87171,#dc2626)"
            :"linear-gradient(135deg,#4ade80,#22c55e)",
          color:"#000",fontSize:15,fontWeight:900,letterSpacing:2,
          boxShadow:mining?"0 4px 20px rgba(248,113,113,.4)":"0 4px 20px rgba(74,222,128,.4)"}}>
          {mining?"⏹ STOP MINING":"▶ START MINING"}
        </button>

        {mining&&(
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[
              {l:"Est. Hourly", v:(earned/((tick*.09)||1)*3600).toFixed(4)},
              {l:"Est. Daily",  v:(earned/((tick*.09)||1)*86400).toFixed(3)},
            ].map((s,i)=>(
              <div key={i} style={{padding:"9px",borderRadius:9,textAlign:"center",
                background:"rgba(0,0,0,0.35)",border:`1px solid ${Q.lepton}18`}}>
                <div style={{fontSize:9,color:Q.dim}}>{s.l}</div>
                <div style={{fontSize:13,fontWeight:900,color:Q.lepton,marginTop:3,fontFamily:"monospace"}}>{s.v} Q</div>
              </div>
            ))}
          </div>
        )}
      </HoloCard>
      <BlockExplorer tick={tick}/>
    </div>
  );
}

// ─── NETWORK STATS ────────────────────────────────────────────────────────────
function NetworkStats({tick}){
  const hr=2847291+Math.round(Math.sin(tick*.05)*55000);
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {[
        {l:"Network Hash Rate",v:`${(hr/1e6).toFixed(2)}M H/s`,c:Q.lepton,   icon:"⚡"},
        {l:"Active Miners",    v:"7,144",                       c:Q.gluon,   icon:"⛏"},
        {l:"Total Mined",      v:"15.2M QEMMA",                c:Q.neutrino,icon:"🪙"},
        {l:"Next Halving",     v:"~203 days",                   c:Q.muon,    icon:"⏳"},
        {l:"Block Time",       v:"~12 sec",                    c:Q.mid,     icon:"⏱"},
        {l:"Difficulty",       v:"847.2T",                      c:Q.higgs,   icon:"🎯"},
        {l:"Pools Active",     v:"3 / 4",                       c:Q.lepton,  icon:"💧"},
        {l:"Global Efficiency",v:"94.7%",                       c:"#34d399", icon:"✅"},
      ].map((s,i)=>{
        const p=.5+Math.sin(tick*.06+i*.5)*.35;
        return(
          <div key={i} style={{padding:"16px",borderRadius:13,textAlign:"center",
            background:`${s.c}0a`,
            border:`1px solid ${s.c}${Math.round(18+p*14).toString(16).padStart(2,"00")}`,
            boxShadow:`0 0 ${Math.round(p*12)}px ${s.c}0e`}}>
            <div style={{fontSize:22,marginBottom:7}}>{s.icon}</div>
            <div style={{fontSize:8,color:Q.dim,letterSpacing:1.2}}>{s.l}</div>
            <div style={{fontSize:15,fontWeight:900,color:s.c,marginTop:5,fontFamily:"monospace",
              textShadow:`0 0 8px ${s.c}88`}}>{s.v}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function MiningPage(){
  const tick=useTick(90);
  const [tab,setTab]=useState("pools");
  const totalH=2847291+Math.round(Math.sin(tick*.05)*55000);

  return(
    <div style={{minHeight:"100vh",background:Q.void,
      fontFamily:"'Inter',system-ui,sans-serif",color:Q.bright,padding:22,
      backgroundImage:`radial-gradient(${Q.lepton}06 1px,transparent 1px)`,
      backgroundSize:"30px 30px"}}>

      {/* Header */}
      <div style={{padding:"20px 26px",borderRadius:20,marginBottom:20,
        background:`linear-gradient(135deg,${Q.lepton}10,${Q.neutrino}08,${Q.lepton}06)`,
        border:`1px solid ${Q.lepton}44`,boxShadow:`0 0 50px ${Q.lepton}0a,inset 0 0 60px ${Q.gluon}06`,
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,
          backgroundImage:`linear-gradient(${Q.lepton}06 1px,transparent 1px),linear-gradient(90deg,${Q.lepton}06 1px,transparent 1px)`,
          backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:900,fontSize:22,color:Q.lepton,letterSpacing:2,marginBottom:5,
              textShadow:`0 0 20px ${Q.lepton}88`}}>⛏ QEMMA MINING</div>
            <div style={{color:"#065f46",fontSize:10,letterSpacing:2,fontWeight:700}}>
              4 POOLS · PROOF-OF-WORK · BITCOIN HALVING · 12 AGENT ORCHESTRATION · © 2026 GRIGORI SAKS
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:28,fontWeight:900,color:Q.lepton,fontFamily:"monospace",
              textShadow:`0 0 16px ${Q.lepton}`}}>{totalH.toLocaleString()}</div>
            <div style={{fontSize:9,color:Q.dim,letterSpacing:1}}>TOTAL NETWORK H/s</div>
            <div style={{fontSize:10,color:Q.higgs,marginTop:4,fontWeight:700}}>
              Block #{(847291+Math.floor(tick/22)).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:18}}>
        {[
          {id:"pools",   label:"Mining Pools",   icon:"💧"},
          {id:"halving", label:"Halving Clock",  icon:"₿"},
          {id:"control", label:"Mine Now",       icon:"⛏"},
          {id:"explorer",label:"Block Explorer", icon:"🔍"},
          {id:"network", label:"Network Stats",  icon:"🌐"},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"9px 20px",borderRadius:20,border:"none",cursor:"pointer",
            background:tab===t.id
              ?`linear-gradient(135deg,${Q.lepton}35,${Q.gluon}22)`
              :"rgba(74,222,128,0.06)",
            color:tab===t.id?Q.bright:Q.dim,fontWeight:700,fontSize:11,
            border:tab===t.id?`1px solid ${Q.lepton}44`:"1px solid transparent",
            boxShadow:tab===t.id?`0 0 16px ${Q.lepton}14`:"none",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab==="pools"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {POOLS.map(p=><PoolCard key={p.id} pool={p} tick={tick}/>)}
      </div>}
      {tab==="halving"&&<HalvingClock tick={tick}/>}
      {tab==="control"&&<MiningControl tick={tick}/>}
      {tab==="explorer"&&<BlockExplorer tick={tick}/>}
      {tab==="network"&&<NetworkStats tick={tick}/>}

      <div style={{marginTop:18,padding:"10px 16px",borderRadius:10,
        background:`${Q.lepton}06`,border:`1px solid ${Q.lepton}12`,
        display:"flex",justifyContent:"space-between",fontSize:10}}>
        <span style={{color:Q.dim}}>QEMMAMining.sol · 4 Pools · Bitcoin-Style Halving · Agent Orchestration</span>
        <span style={{color:Q.plasma,fontWeight:700}}>© 2026 Grigori Saks — Enterprise v3.0</span>
      </div>
    </div>
  );
}
