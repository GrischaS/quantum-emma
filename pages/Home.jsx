// ============================================================
//  QUANTUM EMMA — Master Dashboard v5.0 MEGA UPGRADE
//  Live Stats · All Modules · Quantum Eye · Download Center
//  4D/5D Holographic Particle Field · 12-Agent Status
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};

function useTick(ms=80){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);return t;}
function useMouse(){const[m,setM]=useState({x:0.5,y:0.5});useEffect(()=>{const h=e=>setM({x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight});window.addEventListener("mousemove",h);return()=>window.removeEventListener("mousemove",h);},[]);return m;}

// ─── QUANTUM EYE ─────────────────────────────────────────────────────────────
function QuantumEye({ tick, mouse, size=220 }) {
  const t  = tick * 0.02;
  const cx = size/2, cy = size/2;
  const pulse  = 0.6 + Math.sin(t*1.8)*0.25;
  const pulse2 = 0.6 + Math.sin(t*1.2+1)*0.22;
  const iris   = 0.5 + Math.sin(t*2.4)*0.18;
  const pupilX = cx + (mouse.x-0.5)*14;
  const pupilY = cy + (mouse.y-0.5)*10;
  const rot1   = (tick*0.6)%360;
  const rot2   = (-tick*0.9)%360;
  const rot3   = (tick*1.4)%360;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{filter:`drop-shadow(0 0 ${Math.round(18+pulse*14)}px #7c3aed) drop-shadow(0 0 ${Math.round(40+pulse*20)}px #7c3aed44)`,flexShrink:0}}>
      <defs>
        <radialGradient id="eyeBg" cx="42%" cy="38%">
          <stop offset="0%"   stopColor="#c4b5fd"/>
          <stop offset="35%"  stopColor="#8b5cf6"/>
          <stop offset="70%"  stopColor="#6d28d9"/>
          <stop offset="100%" stopColor="#1e0044"/>
        </radialGradient>
        <radialGradient id="irisGrad" cx="42%" cy="38%">
          <stop offset="0%"  stopColor="#00ffff"/>
          <stop offset="60%" stopColor="#06b6d4"/>
          <stop offset="100%" stopColor="#0369a1"/>
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%">
          <stop offset="0%"  stopColor="#7c3aed" stopOpacity={0.15+pulse*0.1}/>
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
        </radialGradient>
        <filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter>
        <filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
      </defs>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={size*0.46} fill="url(#glowGrad)"/>
      {/* Orbit rings */}
      {[0.44,0.38,0.32].map((r,i)=>{
        const rot = i===0?rot1:i===1?rot2:rot3;
        const dashes = i===0?"8,6":i===1?"4,8":"12,4";
        const color  = i===0?Q.plasma:i===1?Q.gluon:Q.quark;
        const op     = 0.3+Math.sin(t*1.5+i)*0.15;
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={size*r} ry={size*r*0.38}
            fill="none" stroke={color} strokeWidth={i===0?1.5:1} strokeDasharray={dashes}
            strokeOpacity={op} transform={`rotate(${rot} ${cx} ${cy})`}/>
        );
      })}
      {/* Orbital dots */}
      {[...Array(8)].map((_,i)=>{
        const a=(i/8*360+rot1)*Math.PI/180;
        const r=size*0.44;
        const x2=cx+r*Math.cos(a), y2=cy+r*Math.sin(a)*0.38;
        return <circle key={i} cx={x2} cy={y2} r={2.5} fill={Q.photon} opacity={0.5+Math.sin(t*2+i)*0.3}
          style={{filter:`drop-shadow(0 0 3px ${Q.photon})`}}/>;
      })}
      {/* Main eye */}
      <ellipse cx={cx} cy={cy} rx={size*0.34} ry={size*0.22} fill="url(#eyeBg)"
        style={{filter:`drop-shadow(0 0 8px ${Q.plasma}88)`}}/>
      {/* Iris */}
      <circle cx={cx} cy={cy} r={size*(0.14+iris*0.03)} fill="url(#irisGrad)"
        style={{filter:`drop-shadow(0 0 6px ${Q.photon})`}}/>
      {/* Iris pattern */}
      {[...Array(12)].map((_,i)=>{
        const a=i/12*Math.PI*2, r1=size*0.08, r2=size*(0.13+iris*0.02);
        return <line key={i}
          x1={cx+r1*Math.cos(a)} y1={cy+r1*Math.sin(a)}
          x2={cx+r2*Math.cos(a)} y2={cy+r2*Math.sin(a)}
          stroke={Q.photon} strokeWidth="0.8" strokeOpacity={0.4+Math.sin(t*2+i)*0.2}/>;
      })}
      {/* Pupil */}
      <circle cx={pupilX} cy={pupilY} r={size*0.056} fill="#000"
        style={{filter:`drop-shadow(0 0 4px #000)`}}/>
      {/* Pupil shine */}
      <circle cx={pupilX-size*0.018} cy={pupilY-size*0.015} r={size*0.016}
        fill="white" opacity="0.7"/>
      {/* Eyelid top */}
      <path d={`M ${cx-size*0.34} ${cy} Q ${cx} ${cy-size*(0.28+pulse2*0.04)} ${cx+size*0.34} ${cy}`}
        fill="none" stroke={Q.quark} strokeWidth="1.5" strokeOpacity={0.5+pulse*0.2}/>
      {/* Eyelid bottom */}
      <path d={`M ${cx-size*0.34} ${cy} Q ${cx} ${cy+size*(0.20+pulse2*0.03)} ${cx+size*0.34} ${cy}`}
        fill="none" stroke={Q.quark} strokeWidth="1.5" strokeOpacity={0.4+pulse*0.15}/>
      {/* Center spark */}
      <circle cx={cx} cy={cy} r={size*0.016}
        fill={Q.photon} opacity={0.8+Math.sin(t*3)*0.18}
        style={{filter:`drop-shadow(0 0 6px ${Q.photon})`}}/>
      {/* 4D grid */}
      {[...Array(5)].map((_,i)=>{
        const y3=cy-size*0.18+i*size*0.09;
        return <line key={i}
          x1={cx-size*0.34} y1={y3} x2={cx+size*0.34} y2={y3}
          stroke={Q.plasma} strokeWidth="0.5" strokeOpacity={0.08+Math.sin(t+i)*0.04}/>;
      })}
    </svg>
  );
}

// ─── PARTICLE FIELD ──────────────────────────────────────────────────────────
function ParticleField({ tick, count=60 }) {
  const particles = useRef(Array.from({length:count},(_,i)=>({
    x:Math.random()*100, y:Math.random()*100,
    vx:(Math.random()-0.5)*0.04, vy:(Math.random()-0.5)*0.04,
    size:Math.random()*2.5+0.5,
    color:[Q.plasma,Q.gluon,Q.photon,Q.quark,Q.lepton][i%5],
    phase:Math.random()*Math.PI*2,
  }))).current;

  useEffect(()=>{
    particles.forEach(p=>{
      p.x = (p.x+p.vx+100)%100;
      p.y = (p.y+p.vy+100)%100;
    });
  },[tick]);

  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
      {particles.map((p,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${p.x}%`, top:`${p.y}%`,
          width:p.size, height:p.size, borderRadius:"50%",
          background:p.color,
          opacity:0.15+Math.sin(tick*0.04+p.phase)*0.12,
          boxShadow:`0 0 ${p.size*3}px ${p.color}`,
          transition:"opacity .5s",
        }}/>
      ))}
    </div>
  );
}

// ─── LIVE PRICE TICKER ───────────────────────────────────────────────────────
function PriceTicker({ tick }) {
  const [prices, setPrices] = useState([
    {sym:"QEMMA",price:0.6300,change:+2.47,color:Q.neutrino},
    {sym:"ETH",  price:3241.5,change:+1.12,color:Q.gluon},
    {sym:"BTC",  price:67820, change:-0.34,color:Q.higgs},
    {sym:"SOL",  price:182.4, change:+3.21,color:Q.lepton},
    {sym:"BNB",  price:612.8, change:+0.88,color:Q.higgs},
    {sym:"ARB",  price:1.24,  change:-1.02,color:Q.muon},
  ]);
  useEffect(()=>{
    if(tick%25!==0) return;
    setPrices(p=>p.map(x=>x.sym==="QEMMA"?x:{...x,
      price:x.price*(1+(Math.random()-0.495)*0.003),
      change:x.change+(Math.random()-0.5)*0.1}));
  },[tick]);
  return (
    <div style={{background:Q.deep,borderBottom:`1px solid ${Q.plasma}22`,
      padding:"6px 0",overflow:"hidden",whiteSpace:"nowrap"}}>
      <div style={{display:"inline-flex",gap:32,padding:"0 24px",animation:"scroll 30s linear infinite"}}>
        {[...prices,...prices].map((p,i)=>(
          <span key={i} style={{fontSize:11,fontFamily:"monospace"}}>
            <span style={{color:p.color,fontWeight:700}}>{p.sym}</span>
            <span style={{color:Q.bright,marginLeft:6}}>${p.price.toFixed(p.price>100?1:4)}</span>
            <span style={{color:p.change>=0?Q.lepton:Q.tauon,marginLeft:4}}>
              {p.change>=0?"+":""}{p.change.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon, tick, glow=false }) {
  const pulse = 0.5+Math.sin(tick*0.06)*0.3;
  return (
    <div style={{background:Q.bg1,borderRadius:16,padding:"18px 20px",
      border:`1px solid ${color}${Math.round((0.12+pulse*0.12)*255).toString(16).padStart(2,"0")}`,
      boxShadow:glow?`0 0 ${16+pulse*12}px ${color}22`:`0 0 ${6+pulse*4}px ${color}0a`,
      position:"relative",overflow:"hidden",transition:"all .3s"}}>
      {/* Shimmer */}
      <div style={{position:"absolute",top:0,left:`${(-60+tick*0.8)%220}%`,
        width:"60%",height:"100%",
        background:`linear-gradient(90deg,transparent,${color}06,transparent)`,
        pointerEvents:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div style={{fontSize:11,color:Q.dim,fontWeight:600}}>{label}</div>
        <span style={{fontSize:20}}>{icon}</span>
      </div>
      <div style={{fontSize:22,fontWeight:900,color,
        textShadow:glow?`0 0 ${10+pulse*8}px ${color}`:""}}>{value}</div>
      {sub && <div style={{fontSize:10,color:Q.dim,marginTop:4}}>{sub}</div>}
    </div>
  );
}

// ─── MODULE CARD ─────────────────────────────────────────────────────────────
function ModuleCard({ mod, tick }) {
  const pulse = 0.5+Math.sin(tick*0.07+mod.id)*0.3;
  return (
    <div style={{background:`${mod.color}0a`,borderRadius:16,padding:"16px",cursor:"pointer",
      border:`1px solid ${mod.color}${Math.round((0.1+pulse*0.12)*255).toString(16).padStart(2,"0")}`,
      boxShadow:`0 0 ${8+pulse*8}px ${mod.color}0a`,
      transition:"all .25s",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:`${(-80+tick*1.1+mod.id*20)%220}%`,
        width:"70%",height:"100%",
        background:`linear-gradient(90deg,transparent,${mod.color}05,transparent)`,
        pointerEvents:"none"}}/>
      <div style={{fontSize:26,marginBottom:8}}>{mod.icon}</div>
      <div style={{fontWeight:800,fontSize:13,color:mod.color,marginBottom:4}}>{mod.name}</div>
      <div style={{fontSize:11,color:Q.dim,lineHeight:1.5,marginBottom:10}}>{mod.desc}</div>
      {mod.stat && (
        <div style={{padding:"5px 10px",background:`${mod.color}15`,borderRadius:20,
          border:`1px solid ${mod.color}33`,display:"inline-block",
          fontSize:10,fontWeight:700,color:mod.color}}>{mod.stat}</div>
      )}
    </div>
  );
}

// ─── AGENT STATUS MINI ───────────────────────────────────────────────────────
function AgentMini({ agent, tick }) {
  const pulse = 0.5+Math.sin(tick*0.08+agent.id)*0.3;
  const isActive = agent.load > 30;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",
      borderRadius:8,background:`${agent.color}08`,border:`1px solid ${agent.color}18`}}>
      <div style={{width:6,height:6,borderRadius:"50%",flexShrink:0,
        background:isActive?Q.lepton:Q.dim,
        boxShadow:isActive?`0 0 ${3+pulse*3}px ${Q.lepton}`:""}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:9,fontWeight:700,color:agent.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{agent.name}</div>
        <div style={{height:3,background:`${agent.color}20`,borderRadius:1,marginTop:2}}>
          <div style={{height:3,width:`${agent.load}%`,background:agent.color,borderRadius:1}}/>
        </div>
      </div>
      <span style={{fontSize:9,color:Q.dim,flexShrink:0}}>{agent.load}%</span>
    </div>
  );
}

// ─── MAIN HOME ───────────────────────────────────────────────────────────────
export default function Home() {
  const tick  = useTick(80);
  const mouse = useMouse();
  const [qPrice, setQPrice]   = useState(0.6300);
  const [qChange, setQChange] = useState(+2.47);
  const [loop, setLoop]       = useState(4421);
  const [coherence, setCoherence] = useState(97.4);
  const [tab, setTab] = useState("dashboard");

  useEffect(()=>{
    if(tick%30===0) {
      setQPrice(p=>parseFloat((p*(1+(Math.random()-0.494)*0.003)).toFixed(4)));
      setQChange(c=>parseFloat((c+(Math.random()-0.5)*0.05).toFixed(2)));
    }
    if(tick%12===0) setLoop(l=>l+1);
    if(tick%9===0)  setCoherence(c=>parseFloat(Math.min(99.9,Math.max(90,c+(Math.random()-0.45)*0.2)).toFixed(1)));
  },[tick]);

  const pulse = 0.5+Math.sin(tick*0.05)*0.3;

  const agents = [
    {id:0,name:"ALPHA-7",  color:Q.plasma,  load:94},
    {id:1,name:"BETA-3",   color:Q.gluon,   load:78},
    {id:2,name:"GAMMA-12", color:Q.higgs,   load:62},
    {id:3,name:"DELTA-1",  color:Q.lepton,  load:88},
    {id:4,name:"EPSILON-9",color:Q.boson,   load:99},
    {id:5,name:"ZETA-5",   color:Q.muon,    load:71},
    {id:6,name:"ETA-8",    color:Q.quark,   load:85},
    {id:7,name:"THETA-2",  color:Q.photon,  load:22},
    {id:8,name:"IOTA-11",  color:Q.tauon,   load:76},
    {id:9,name:"KAPPA-6",  color:Q.plasma,  load:68},
    {id:10,name:"LAMBDA-4",color:Q.gluon,   load:34},
    {id:11,name:"MU-10",   color:Q.lepton,  load:100},
  ];

  const modules = [
    {id:0, name:"Trading Terminal",  icon:"📊",color:Q.gluon,   desc:"Live charts, DEX swap, AI signals, order book",       stat:"QEMMA $"+qPrice.toFixed(4)},
    {id:1, name:"Portfolio Tracker", icon:"💼",color:Q.plasma,  desc:"P&L dashboard, holdings, staking rewards, tx history", stat:"$51,763 total"},
    {id:2, name:"AI Oracle",         icon:"🤖",color:Q.boson,   desc:"12-agent chat, predictions, task monitor",             stat:"94% accuracy"},
    {id:3, name:"MetaMemory HQMLL",  icon:"🧠",color:Q.photon,  desc:"7-layer recursive AI, on-chain memory, knowledge",     stat:"Loop #"+loop.toLocaleString()},
    {id:4, name:"Mining Terminal",   icon:"⛏",color:Q.higgs,   desc:"4 pools, live hashrate, block explorer, calculator",   stat:"12.4 QEMMA/day"},
    {id:5, name:"Staking Center",    icon:"🔒",color:Q.lepton,  desc:"5 tiers, up to 60% APY, auto-compound",               stat:"60% APY"},
    {id:6, name:"DAO Governance",    icon:"🏛",color:Q.quark,   desc:"Proposals, live voting, treasury, DAO stats",          stat:"2 active votes"},
    {id:7, name:"Research Engine",   icon:"🔬",color:Q.muon,    desc:"8 domains, AI signals, oracle chat, insights",         stat:"1,670 papers"},
    {id:8, name:"Token Launch",      icon:"🚀",color:Q.boson,   desc:"IDO dashboard, whitelist, tokenomics, roadmap",        stat:"Jul 15 IDO"},
  ];

  const downloads = [
    {name:"Web App",     icon:"🌐",url:"https://quantum-emma-app.base44.app",   tag:"Live",  color:Q.gluon,  action:"Open App"},
    {name:"Windows EXE", icon:"🖥",url:"#",                                     tag:"v4.1",  color:Q.plasma, action:"Download EXE"},
    {name:"Android APK", icon:"📱",url:"#",                                     tag:"v4.0",  color:Q.lepton, action:"Download APK"},
    {name:"Source Code", icon:"💻",url:"https://github.com/GrischaS/quantum-emma",tag:"GitHub",color:Q.higgs,action:"View Code"},
  ];

  return (
    <div style={{minHeight:"100vh",background:Q.void,color:Q.bright,fontFamily:"'Inter',sans-serif",position:"relative"}}>
      <ParticleField tick={tick}/>

      {/* PRICE TICKER */}
      <PriceTicker tick={tick}/>

      {/* HERO SECTION */}
      <div style={{position:"relative",zIndex:1,padding:"40px 24px 30px",textAlign:"center",
        background:`radial-gradient(ellipse at 50% 0%,${Q.plasma}18,transparent 70%)`}}>

        {/* Quantum Eye */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
          <QuantumEye tick={tick} mouse={mouse} size={200}/>
        </div>

        {/* Title */}
        <div style={{fontSize:11,letterSpacing:5,color:Q.plasma,fontWeight:700,marginBottom:10}}>
          ⚛️ QUANTUM EMMA ENTERPRISE v5.0
        </div>
        <div style={{fontSize:clamp(28,4,48)||36,fontWeight:900,lineHeight:1.15,marginBottom:8,
          background:`linear-gradient(135deg,${Q.photon},${Q.plasma},${Q.boson})`,
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          The AI-Native<br/>Trading Platform
        </div>
        <div style={{color:Q.mid,fontSize:14,marginBottom:20}}>
          12-Agent Orchestration · HQMLL v7 · On-Chain Intelligence · IDO July 15, 2026
        </div>

        {/* Live QEMMA price */}
        <div style={{display:"inline-flex",alignItems:"center",gap:16,
          background:`${Q.plasma}15`,border:`1px solid ${Q.plasma}${Math.round((0.2+pulse*0.15)*255).toString(16).padStart(2,"0")}`,
          borderRadius:16,padding:"12px 28px",boxShadow:`0 0 ${16+pulse*12}px ${Q.plasma}22`}}>
          <div>
            <div style={{fontSize:10,color:Q.dim}}>QEMMA Price</div>
            <div style={{fontSize:26,fontWeight:900,color:Q.lepton,
              textShadow:`0 0 ${10+pulse*8}px ${Q.lepton}`}}>${qPrice.toFixed(4)}</div>
          </div>
          <div style={{width:1,height:36,background:`${Q.plasma}44`}}/>
          <div>
            <div style={{fontSize:10,color:Q.dim}}>24h Change</div>
            <div style={{fontSize:18,fontWeight:800,color:qChange>=0?Q.lepton:Q.tauon}}>
              {qChange>=0?"+":""}{qChange.toFixed(2)}%
            </div>
          </div>
          <div style={{width:1,height:36,background:`${Q.plasma}44`}}/>
          <div>
            <div style={{fontSize:10,color:Q.dim}}>Loop #</div>
            <div style={{fontSize:18,fontWeight:800,color:Q.photon}}>#{loop.toLocaleString()}</div>
          </div>
          <div style={{width:1,height:36,background:`${Q.plasma}44`}}/>
          <div>
            <div style={{fontSize:10,color:Q.dim}}>Coherence</div>
            <div style={{fontSize:18,fontWeight:800,color:Q.photon}}>{coherence}%</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{position:"relative",zIndex:1,display:"flex",justifyContent:"center",marginBottom:24}}>
        <div style={{display:"flex",gap:4,background:Q.bg1,borderRadius:12,padding:4,
          border:`1px solid ${Q.plasma}22`}}>
          {[["dashboard","⚛️ Dashboard"],["agents","🤖 Agents"],["downloads","📦 Downloads"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:"8px 22px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
              background:tab===t?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:"transparent",
              color:tab===t?Q.bright:Q.dim,boxShadow:tab===t?`0 0 12px ${Q.plasma}44`:"none"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:1300,margin:"0 auto",padding:"0 16px 40px"}}>

        {/* DASHBOARD TAB */}
        {tab==="dashboard" && (
          <>
            {/* Top stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
              <StatCard label="Portfolio Value"  value="$51,763" sub="↑ $942 today"        color={Q.plasma}  icon="💼" tick={tick} glow/>
              <StatCard label="QEMMA Holdings"  value="50,000"  sub="$31,500 · 60.8%"     color={Q.neutrino}icon="⚛️" tick={tick}/>
              <StatCard label="Staking Rewards"  value="+1,651"  sub="QEMMA this month"    color={Q.lepton}  icon="🔒" tick={tick}/>
              <StatCard label="Mining Earned"    value="420"     sub="QEMMA all time"       color={Q.higgs}   icon="⛏" tick={tick}/>
              <StatCard label="AI Loop"          value={`#${loop.toLocaleString()}`} sub={`${coherence}% coherence`} color={Q.photon} icon="🌀" tick={tick} glow/>
            </div>

            {/* Module grid */}
            <div style={{color:Q.quark,fontWeight:700,fontSize:14,marginBottom:12}}>
              ⚛️ Platform Modules
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
              {modules.map(m=><ModuleCard key={m.id} mod={m} tick={tick}/>)}
            </div>

            {/* IDO countdown + live signals row */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{background:Q.bg1,borderRadius:16,padding:"18px 20px",
                border:`1px solid ${Q.plasma}${Math.round((0.15+pulse*0.12)*255).toString(16).padStart(2,"0")}`,
                boxShadow:`0 0 ${12+pulse*10}px ${Q.plasma}18`}}>
                <div style={{color:Q.quark,fontWeight:700,marginBottom:14}}>🚀 IDO Countdown — July 15, 2026</div>
                <IDOCountdown/>
                <div style={{marginTop:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}>
                    <span style={{color:Q.dim}}>Whitelist Progress</span>
                    <span style={{color:Q.lepton,fontWeight:700}}>2,840 / 5,000 spots</span>
                  </div>
                  <div style={{height:8,background:`${Q.plasma}15`,borderRadius:4}}>
                    <div style={{height:8,width:"56.8%",
                      background:`linear-gradient(90deg,${Q.plasma},${Q.gluon})`,borderRadius:4,
                      boxShadow:`0 0 10px ${Q.gluon}66`}}/>
                  </div>
                </div>
              </div>

              <div style={{background:Q.bg1,borderRadius:16,padding:"18px 20px",
                border:`1px solid ${Q.lepton}22`}}>
                <div style={{color:Q.lepton,fontWeight:700,marginBottom:12}}>🤖 Live AI Signals</div>
                {[
                  {asset:"QEMMA",sig:"STRONG BUY",conf:94,color:Q.lepton,agent:"ALPHA-7"},
                  {asset:"ETH",  sig:"BUY",        conf:78,color:Q.gluon, agent:"BETA-3"},
                  {asset:"BTC",  sig:"HOLD",        conf:62,color:Q.higgs, agent:"GAMMA-12"},
                  {asset:"SOL",  sig:"BUY",         conf:71,color:Q.gluon, agent:"DELTA-1"},
                ].map((s,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"7px 0",borderBottom:`1px solid ${Q.plasma}11`}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontWeight:700,color:Q.bright,fontSize:12,width:50}}>{s.asset}</span>
                      <span style={{fontSize:10,color:s.color,fontWeight:700,
                        background:`${s.color}15`,padding:"2px 8px",borderRadius:20,border:`1px solid ${s.color}33`}}>
                        {s.sig}
                      </span>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:10,color:Q.dim}}>{s.agent}</span>
                      <span style={{fontSize:12,fontWeight:800,color:s.color}}>{s.conf}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* AGENTS TAB */}
        {tab==="agents" && (
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
              {[
                {l:"Active Agents", v:`${agents.filter(a=>a.load>30).length}/12`, c:Q.lepton},
                {l:"Total Tasks",   v:"22,841",c:Q.gluon},
                {l:"Avg Load",      v:`${Math.round(agents.reduce((s,a)=>s+a.load,0)/agents.length)}%`,c:Q.plasma},
              ].map((s,i)=>(
                <div key={i} style={{background:Q.bg1,borderRadius:12,padding:"14px",textAlign:"center",
                  border:`1px solid ${s.c}33`}}>
                  <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:11,color:Q.dim}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {agents.map(a=><AgentMini key={a.id} agent={a} tick={tick}/>)}
            </div>
            <div style={{marginTop:16,background:Q.bg1,borderRadius:14,padding:"16px 20px",
              border:`1px solid ${Q.photon}22`}}>
              <div style={{color:Q.photon,fontWeight:700,marginBottom:8}}>⚛️ Meta Genius TR2 — System State</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {[
                  {l:"HQMLL Loop",  v:`#${loop.toLocaleString()}`,c:Q.plasma},
                  {l:"Coherence",   v:`${coherence}%`,c:Q.photon},
                  {l:"Accuracy",    v:"94.2%",c:Q.lepton},
                  {l:"Evolutions",  v:"42",c:Q.gluon},
                ].map((s,i)=>(
                  <div key={i} style={{textAlign:"center",padding:"10px",background:`${s.c}0a`,borderRadius:10,border:`1px solid ${s.c}22`}}>
                    <div style={{fontSize:18,fontWeight:900,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:10,color:Q.dim}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* DOWNLOADS TAB */}
        {tab==="downloads" && (
          <>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:18,fontWeight:900,color:Q.quark,marginBottom:6}}>📦 Download Center</div>
              <div style={{color:Q.dim,fontSize:13}}>Quantum Emma Enterprise v5.0 — All Platforms</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,maxWidth:800,margin:"0 auto 32px"}}>
              {downloads.map((d,i)=>(
                <a key={i} href={d.url} target="_blank" rel="noreferrer"
                  style={{textDecoration:"none",display:"block"}}>
                  <div style={{background:Q.bg1,borderRadius:16,padding:"24px",textAlign:"center",
                    border:`1px solid ${d.color}${Math.round((0.12+pulse*0.12)*255).toString(16).padStart(2,"0")}`,
                    boxShadow:`0 0 ${10+pulse*8}px ${d.color}12`,cursor:"pointer",transition:"all .3s"}}>
                    <div style={{fontSize:40,marginBottom:12}}>{d.icon}</div>
                    <div style={{fontWeight:800,fontSize:16,color:d.color,marginBottom:4}}>{d.name}</div>
                    <div style={{padding:"3px 12px",borderRadius:20,fontSize:10,fontWeight:700,
                      background:`${d.color}20`,color:d.color,border:`1px solid ${d.color}33`,
                      display:"inline-block",marginBottom:14}}>{d.tag}</div>
                    <div style={{padding:"10px",borderRadius:10,
                      background:`linear-gradient(135deg,${d.color}cc,${d.color}88)`,
                      color:Q.void,fontWeight:800,fontSize:13}}>
                      {d.action} →
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Build instructions */}
            <div style={{background:Q.bg1,borderRadius:14,padding:"20px",
              border:`1px solid ${Q.plasma}22`,maxWidth:800,margin:"0 auto"}}>
              <div style={{color:Q.quark,fontWeight:700,marginBottom:12}}>🔧 Build Instructions</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {label:"Web App (Vite)",   cmd:"npm run dev",               color:Q.gluon},
                  {label:"Windows EXE",      cmd:"npm run build:win",          color:Q.plasma},
                  {label:"Android APK",      cmd:"eas build --platform android --profile preview", color:Q.lepton},
                  {label:"Docker",           cmd:"docker-compose up -d",       color:Q.gluon},
                  {label:"Deploy Contracts", cmd:"npx hardhat run contracts/deploy/deploy.js --network sepolia", color:Q.higgs},
                ].map((b,i)=>(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"8px 12px",
                    background:Q.bg2,borderRadius:8,border:`1px solid ${b.color}22`}}>
                    <span style={{fontSize:11,color:b.color,fontWeight:700,minWidth:140}}>{b.label}</span>
                    <code style={{flex:1,fontSize:11,color:Q.mid,fontFamily:"monospace"}}>{b.cmd}</code>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── IDO COUNTDOWN ───────────────────────────────────────────────────────────
function IDOCountdown() {
  const [time, setTime] = useState({d:0,h:0,m:0,s:0});
  useEffect(()=>{
    const update=()=>{
      const diff=Math.max(0,new Date("2026-07-15T12:00:00Z")-Date.now());
      setTime({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),
               m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)});
    };
    update(); const id=setInterval(update,1000); return()=>clearInterval(id);
  },[]);
  return (
    <div style={{display:"flex",gap:8,justifyContent:"center"}}>
      {[["d","D"],["h","H"],["m","M"],["s","S"]].map(([k,l])=>(
        <div key={k} style={{textAlign:"center",background:`${Q.plasma}15`,borderRadius:10,
          padding:"8px 12px",border:`1px solid ${Q.plasma}44`,minWidth:52}}>
          <div style={{fontSize:22,fontWeight:900,color:Q.photon,fontFamily:"monospace",
            textShadow:`0 0 10px ${Q.photon}`}}>{String(time[k]).padStart(2,"0")}</div>
          <div style={{fontSize:9,color:Q.dim}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// tiny helper to avoid ReferenceError on clamp
function clamp(min,a,max){return Math.min(max,Math.max(min,a));}
