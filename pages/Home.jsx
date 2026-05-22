// ============================================================
//  QUANTUM EMMA — Master Hub v4.1
//  Complete Navigation · All Modules · 4D/5D Holographic
//  Particle Field · Live Data · Download Center
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};

function useTick(ms=60){
  const[t,setT]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);
  return t;
}
function useMousePos(){
  const[p,setP]=useState({x:.5,y:.5});
  useEffect(()=>{
    const h=e=>setP({x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight});
    window.addEventListener("mousemove",h);return()=>window.removeEventListener("mousemove",h);
  },[]);
  return p;
}

// ─── PARTICLE FIELD ──────────────────────────────────────────────────────────
function ParticleField({tick,mouse}){
  const cvRef=useRef();
  const pts=useRef([]);
  useEffect(()=>{
    pts.current=Array.from({length:110},()=>({
      x:Math.random(),y:Math.random(),
      vx:(Math.random()-.5)*.00065,vy:(Math.random()-.5)*.00065,
      r:.35+Math.random()*2.2,life:Math.random()*Math.PI*2,
      spd:.006+Math.random()*.012,
      col:[Q.photon,Q.plasma,Q.neutrino,Q.gluon,Q.higgs,Q.boson,Q.lepton,"#a78bfa","#f472b6"][Math.floor(Math.random()*9)],
      dim:Math.random()>.6,
    }));
  },[]);
  useEffect(()=>{
    const cv=cvRef.current;if(!cv)return;
    const ctx=cv.getContext("2d");
    const W=cv.width=cv.offsetWidth,H=cv.height=cv.offsetHeight;
    ctx.clearRect(0,0,W,H);
    const ps=pts.current;
    ps.forEach(p=>{
      p.life+=p.spd;
      p.x+=p.vx+(mouse.x-.5)*.00018;
      p.y+=p.vy+(mouse.y-.5)*.00018;
      if(p.x<0)p.x=1;if(p.x>1)p.x=0;
      if(p.y<0)p.y=1;if(p.y>1)p.y=0;
    });
    // Connections
    for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){
      const dx=(ps[i].x-ps[j].x)*W,dy=(ps[i].y-ps[j].y)*H,d=Math.sqrt(dx*dx+dy*dy);
      if(d<92){
        ctx.beginPath();ctx.moveTo(ps[i].x*W,ps[i].y*H);ctx.lineTo(ps[j].x*W,ps[j].y*H);
        ctx.strokeStyle=`rgba(139,92,246,${(1-d/92)*.12})`;ctx.lineWidth=.45;ctx.stroke();
      }
    }
    // Dots
    ps.forEach(p=>{
      const x=p.x*W,y=p.y*H;
      const a=(.38+Math.sin(p.life)*.52)*(p.dim?.38:1);
      const r=p.r*(.78+Math.sin(p.life*1.3)*.42);
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=p.col+Math.round(a*255).toString(16).padStart(2,"00");ctx.fill();
      if(!p.dim){ctx.beginPath();ctx.arc(x,y,r*3.2,0,Math.PI*2);ctx.fillStyle=p.col+"0e";ctx.fill();}
    });
    // 4D grid
    ctx.strokeStyle=`rgba(139,92,246,0.035)`;ctx.lineWidth=.45;
    const off=(tick*.28)%60;
    for(let x=-off;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+H*.28,H);ctx.stroke();}
    for(let y=-off;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y+38);ctx.stroke();}
  },[tick,mouse]);
  return <canvas ref={cvRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

// ─── HOLO EYE ────────────────────────────────────────────────────────────────
function HoloEye({size=44,tick,mouse={x:.5,y:.5},color=Q.neutrino}){
  const t=tick*.024,mx=(mouse.x-.5)*.26,my=(mouse.y-.5)*.26;
  const p=.78+Math.sin(t*2.5)*.18,rot=(tick*.78)%360,irot=(-tick*1.1)%360;
  const id=`he${size}${color.slice(1,4)}`;
  return(
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{filter:`drop-shadow(0 0 ${Math.round(8+p*9)}px ${color}) drop-shadow(0 0 ${Math.round(20+p*16)}px ${color}44)`,flexShrink:0}}>
      <defs>
        <radialGradient id={id+"c"} cx={`${50+mx*14}%`} cy={`${50+my*14}%`}>
          <stop offset="0%" stopColor="#c4b5fd"/><stop offset="40%" stopColor={color}/><stop offset="100%" stopColor="#3b0764"/>
        </radialGradient>
        <radialGradient id={id+"s"} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".3"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${id}c)`}/>
      <g transform={`rotate(${rot},50,50)`}><ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity=".45" strokeDasharray="4 6"/></g>
      <g transform={`rotate(${irot},50,50)`}><ellipse cx="50" cy="50" rx="30" ry="10" fill="none" stroke={Q.gluon} strokeWidth=".8" strokeOpacity=".35" strokeDasharray="3 8"/></g>
      <g transform={`rotate(${rot*.55},50,50)`}><ellipse cx="50" cy="50" rx="20" ry="7" fill="none" stroke={Q.higgs} strokeWidth=".6" strokeOpacity=".2" strokeDasharray="2 10"/></g>
      <circle cx={50+mx*12} cy={50+my*12} r="12" fill="#000" fillOpacity=".72"/>
      <circle cx={50+mx*14+3} cy={50+my*14-3} r="4.2" fill="#fff" fillOpacity={.44*p}/>
      <text x="50" y="58" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="Arial Black" fill="#fff" fillOpacity=".92">Q</text>
      <circle cx="50" cy="50" r="48" fill={`url(#${id}s)`}/>
      {[0,1,2].map(i=>{const a=t*(i%2===0?1.5:-1.2)+i*(Math.PI*2/3);return<g key={i}><circle cx={50+Math.cos(a)*40} cy={50+Math.sin(a)*14} r="2.3" fill={Q.higgs} fillOpacity={.84*p}/><circle cx={50+Math.cos(a)*40} cy={50+Math.sin(a)*14} r="5.5" fill={Q.higgs} fillOpacity=".1"/></g>;})}
      <text x="50" y="91" textAnchor="middle" fontSize="5.5" fontFamily="monospace" fill={color} fillOpacity=".65" letterSpacing="2.5">4D·5D·QEMMA</text>
    </svg>
  );
}

// ─── QEMMA COIN ───────────────────────────────────────────────────────────────
function QEMMACoin({size=40,tick=0}){
  const t=tick*.03,rot=(tick*.8)%360,irot=(-tick*1.2)%360,p=.75+Math.sin(t*2.5)*.2;
  const id=`qcn${size}`;
  return(
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{filter:`drop-shadow(0 0 ${Math.round(7+p*9)}px #8b5cf6) drop-shadow(0 0 ${Math.round(16+p*14)}px #7c3aed44)`,flexShrink:0}}>
      <defs>
        <radialGradient id={id+"g"} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#c4b5fd"/><stop offset="35%" stopColor="#8b5cf6"/>
          <stop offset="70%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#3b0764"/>
        </radialGradient>
        <linearGradient id={id+"r"} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#4c1d95"/>
        </linearGradient>
        <radialGradient id={id+"s"} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".32"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${id}r)`}/>
      <circle cx="50" cy="50" r="44" fill={`url(#${id}g)`}/>
      <g transform={`rotate(${rot},50,50)`}><ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity=".4" strokeDasharray="4 6"/></g>
      <g transform={`rotate(${irot},50,50)`}><ellipse cx="50" cy="50" rx="32" ry="11" fill="none" stroke="#06b6d4" strokeWidth=".8" strokeOpacity=".3" strokeDasharray="3 8"/></g>
      <g transform={`rotate(${rot*.55},50,50)`}><ellipse cx="50" cy="50" rx="22" ry="8" fill="none" stroke="#fbbf24" strokeWidth=".6" strokeOpacity=".18" strokeDasharray="2 10"/></g>
      <text x="50" y="61" textAnchor="middle" fontSize="36" fontWeight="900" fontFamily="Arial Black" fill="#fff" fillOpacity=".94">Q</text>
      <text x="67" y="55" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily="Arial" fill="#c4b5fd" opacity=".88">E</text>
      <circle cx="50" cy="50" r="44" fill={`url(#${id}s)`}/>
      {[0,1,2].map(i=>{const a=t*(i%2===0?1.5:-1.2)+i*(Math.PI*2/3);return<g key={i}><circle cx={50+Math.cos(a)*40} cy={50+Math.sin(a)*14} r="2.5" fill="#fbbf24" fillOpacity={.84*p}/></g>;})}
      <text x="50" y="91" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#a78bfa" fillOpacity=".78" letterSpacing="2">QEMMA</text>
    </svg>
  );
}

// ─── LIVE TICKER ─────────────────────────────────────────────────────────────
function LiveTicker({tick}){
  const coins=[
    {s:"BTC",  p:71450+Math.sin(tick*.024)*285, d:+2.34,c:Q.higgs,   big:true},
    {s:"ETH",  p:3840+Math.sin(tick*.031)*96,   d:+1.87,c:Q.gluon,   big:true},
    {s:"QEMMA",p:0.63+Math.sin(tick*.054)*.026, d:+8.42,c:Q.neutrino,big:false},
    {s:"BNB",  p:612+Math.sin(tick*.028)*18,    d:+0.91,c:Q.muon,    big:true},
    {s:"SOL",  p:184+Math.sin(tick*.040)*9,     d:+3.12,c:"#9945ff", big:true},
    {s:"MATIC",p:1.24+Math.sin(tick*.037)*.04,  d:+5.21,c:Q.plasma,  big:false},
    {s:"ARB",  p:1.84+Math.sin(tick*.033)*.06,  d:+2.80,c:"#28a0f0", big:false},
    {s:"AVAX", p:42.8+Math.sin(tick*.043)*1.8,  d:+2.11,c:Q.tauon,   big:true},
  ];
  return(
    <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none",padding:"2px 0"}}>
      {coins.map((c,i)=>{
        const pulse=.6+Math.sin(tick*.1+i*.7)*.3;
        return(
          <div key={c.s} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 14px",
            borderRadius:30,flexShrink:0,
            background:`${c.c}0d`,
            border:`1px solid ${c.c}${Math.round(pulse*52).toString(16).padStart(2,"00")}`,
            boxShadow:`0 0 ${Math.round(pulse*9)}px ${c.c}12`,
            transition:"border-color .3s"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:c.c,
              boxShadow:`0 0 ${Math.round(pulse*7)}px ${c.c}`}}/>
            <span style={{fontSize:11,fontWeight:800,color:c.c,letterSpacing:.5}}>{c.s}</span>
            <span style={{fontSize:12,fontWeight:700,color:Q.bright,fontFamily:"monospace"}}>
              ${c.big?c.p.toFixed(0):c.p.toFixed(c.p>1?2:4)}
            </span>
            <span style={{fontSize:10,color:c.d>0?Q.lepton:Q.tauon,fontWeight:700}}>
              {c.d>0?"▲":"▼"}{Math.abs(c.d)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── HQMLL LIVE ──────────────────────────────────────────────────────────────
function HQMLLLive({tick}){
  const layers=[
    {n:"INPUT",    l:.048,c:Q.plasma,  w:10},
    {n:"HIDDEN_A", l:.031,c:Q.neutrino,w:14},
    {n:"HIDDEN_B", l:.022,c:"#6d28d9", w:12},
    {n:"QUANTUM",  l:.011,c:Q.gluon,   w:8},
    {n:"RECURSIVE",l:.007,c:"#0891b2", w:10},
    {n:"ATTENTION",l:.004,c:Q.lepton,  w:8},
    {n:"OUTPUT",   l:.002,c:Q.higgs,   w:5},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:7}}>
      {layers.map((l,i)=>{
        const act=.38+Math.sin(tick*.08+i*.55)*.48;
        const loss=l.l+(Math.sin(tick*.05+i)*.0002);
        return(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,
            padding:"8px 12px",borderRadius:10,
            background:`${l.c}${Math.round(act*.11*255).toString(16).padStart(2,"00")}`,
            border:`1px solid ${l.c}${Math.round(act*.28*255).toString(16).padStart(2,"00")}`,
            boxShadow:`0 0 ${Math.round(act*14)}px ${l.c}10`}}>
            <div style={{display:"flex",gap:2,width:56,flexShrink:0,flexWrap:"wrap"}}>
              {Array.from({length:Math.min(l.w,8)}).map((_,j)=>(
                <div key={j} style={{width:6,height:6,borderRadius:"50%",background:l.c,
                  opacity:.22+Math.sin(tick*.1+i*.3+j*.5)*.6,
                  boxShadow:`0 0 ${Math.round(act*6)}px ${l.c}`}}/>
              ))}
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:9}}>
                <span style={{fontWeight:900,color:l.c,letterSpacing:.5}}>L{i+1} {l.n}</span>
                <span style={{color:Q.dim,fontFamily:"monospace"}}>{loss.toFixed(4)}</span>
              </div>
              <div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:3,width:`${(1-l.l/.05)*100}%`,
                  background:`linear-gradient(90deg,${l.c}88,${l.c})`,borderRadius:2,
                  boxShadow:`0 0 6px ${l.c}`,transition:"width .5s"}}/>
              </div>
            </div>
            <div style={{width:9,height:9,borderRadius:"50%",background:l.c,flexShrink:0,
              opacity:act,boxShadow:`0 0 ${Math.round(act*14)}px ${l.c}`}}/>
          </div>
        );
      })}
      <div style={{fontSize:9,color:Q.dim,marginTop:2,textAlign:"center",letterSpacing:.5}}>
        HQMLL Epoch <b style={{color:Q.neutrino}}>1,247</b> · Loss <b style={{color:Q.lepton}}>0.002</b> · Accuracy <b style={{color:Q.lepton}}>98.3%</b>
      </div>
    </div>
  );
}

// ─── 12 AGENTS GRID ──────────────────────────────────────────────────────────
function AgentsGrid({tick}){
  const agents=[
    {n:"ALPHA-Q",  icon:"⚛️",c:Q.neutrino,a:90.5,role:"Mining"},
    {n:"BETA-N",   icon:"🧠",c:Q.gluon,   a:91.0,role:"Neural"},
    {n:"GAMMA-R",  icon:"🔄",c:Q.lepton,  a:91.5,role:"Recursive"},
    {n:"DELTA-H",  icon:"💚",c:"#34d399", a:98.0,role:"Healing"},
    {n:"EPSILON-S",icon:"📈",c:Q.boson,   a:92.5,role:"Strategy"},
    {n:"ZETA-M",   icon:"🔮",c:Q.muon,    a:87.0,role:"Prediction"},
    {n:"ETA-P",    icon:"🎯",c:Q.quark,   a:93.5,role:"Analytics"},
    {n:"THETA-D",  icon:"🌀",c:"#60a5fa", a:88.0,role:"Deep Scan"},
    {n:"IOTA-V",   icon:"✅",c:"#a3e635", a:96.0,role:"Validator"},
    {n:"KAPPA-E",  icon:"⚡",c:"#f9a8d4", a:90.0,role:"Executor"},
    {n:"LAMBDA-O", icon:"🎼",c:"#fcd34d", a:97.0,role:"Orchestra"},
    {n:"META-TR2", icon:"👑",c:Q.higgs,   a:99.0,role:"Conductor"},
  ];
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
      {agents.map((a,i)=>{
        const pulse=.38+Math.sin(tick*.07+i*.62)*.48;
        return(
          <div key={i} style={{padding:"11px 7px",borderRadius:11,textAlign:"center",
            background:`${a.c}0b`,
            border:`1px solid ${a.c}${Math.round(14+pulse*20).toString(16).padStart(2,"00")}`,
            boxShadow:`0 0 ${Math.round(pulse*14)}px ${a.c}0e`,
            position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",left:0,right:0,
              top:`${((tick*.68+i*18)%115)-8}%`,height:"1.5px",
              background:`linear-gradient(90deg,transparent,${a.c}44,transparent)`,pointerEvents:"none"}}/>
            <div style={{fontSize:17,marginBottom:4,
              filter:`drop-shadow(0 0 ${Math.round(pulse*7)}px ${a.c})`}}>{a.icon}</div>
            <div style={{fontSize:8,fontWeight:900,color:a.c,letterSpacing:.4,marginBottom:2}}>{a.n}</div>
            <div style={{fontSize:7,color:Q.dim,marginBottom:4}}>{a.role}</div>
            <div style={{fontSize:10,fontWeight:800,color:a.c,
              textShadow:`0 0 6px ${a.c}88`}}>{a.a}%</div>
            <div style={{marginTop:4,height:2,background:"rgba(255,255,255,0.05)",borderRadius:1}}>
              <div style={{height:2,width:`${a.a}%`,background:a.c,borderRadius:1,
                boxShadow:`0 0 4px ${a.c}`}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({icon,label,value,sub,color,tick,i=0}){
  const p=.55+Math.sin(tick*.07+i*.52)*.32;
  return(
    <div style={{padding:"16px 14px",borderRadius:14,textAlign:"center",
      background:`${color}0a`,
      border:`1px solid ${color}${Math.round(16+p*16).toString(16).padStart(2,"00")}`,
      boxShadow:`0 0 ${Math.round(p*14)}px ${color}0d`,
      position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,
        left:`${(-50+tick*1.2+i*11)%200}%`,width:"50%",height:"100%",
        background:`linear-gradient(90deg,transparent,${color}05,transparent)`,pointerEvents:"none"}}/>
      <div style={{fontSize:20,marginBottom:6}}>{icon}</div>
      <div style={{fontSize:8,color:Q.dim,letterSpacing:1.2,marginBottom:4}}>{label}</div>
      <div style={{fontSize:16,fontWeight:900,color,fontFamily:"monospace",
        textShadow:`0 0 10px ${color}88`}}>{value}</div>
      {sub&&<div style={{fontSize:8,color:Q.dim,marginTop:4}}>{sub}</div>}
    </div>
  );
}

// ─── MODULE CARD ─────────────────────────────────────────────────────────────
function ModuleCard({href,icon,label,desc,color,tick,i=0}){
  const p=.48+Math.sin(tick*.06+i*.55)*.36;
  return(
    <a href={href} style={{
      display:"flex",alignItems:"center",gap:14,padding:"16px 18px",borderRadius:14,
      textDecoration:"none",
      background:`${color}0c`,
      border:`1px solid ${color}${Math.round(16+p*17).toString(16).padStart(2,"00")}`,
      boxShadow:`0 0 ${Math.round(p*16)}px ${color}0d`,
      transition:"transform .15s,box-shadow .15s",
      position:"relative",overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:0,
        left:`${(-50+tick*1.15+i*13)%200}%`,width:"50%",height:"100%",
        background:`linear-gradient(90deg,transparent,${color}05,transparent)`,pointerEvents:"none"}}/>
      <div style={{width:46,height:46,borderRadius:12,flexShrink:0,
        background:`${color}18`,border:`1px solid ${color}33`,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
        boxShadow:`0 0 ${Math.round(p*12)}px ${color}22`}}>{icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:800,fontSize:13,color,
          textShadow:`0 0 8px ${color}55`,marginBottom:4}}>{label}</div>
        <div style={{fontSize:10,color:Q.dim,lineHeight:1.45,
          overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",
          WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{desc}</div>
      </div>
      <span style={{fontSize:20,color:`${color}55`,flexShrink:0}}>›</span>
    </a>
  );
}

// ─── NAV DEFINITION ──────────────────────────────────────────────────────────
const NAV=[
  {id:"dashboard", label:"Dashboard",         icon:"📊",color:Q.plasma,   group:"MAIN"},
  {id:"download",  label:"Downloads",          icon:"⬇️",color:Q.higgs,    group:"MAIN"},
  {id:"trading",   label:"Trading Terminal",   icon:"💹",color:Q.gluon,    group:"TRADE", href:"/Trading"},
  {id:"portfolio", label:"Wallet & Portfolio", icon:"💼",color:Q.neutrino, group:"TRADE", href:"/Portfolio"},
  {id:"chat",      label:"Oracle AI Chat",     icon:"👁",color:Q.plasma,   group:"AI",   href:"/Agents"},
  {id:"memory",    label:"Meta Memory TR2",    icon:"🧠",color:Q.quark,    group:"AI",   href:"/MetaMemory"},
  {id:"research",  label:"Deep Research",      icon:"🔬",color:Q.gluon,    group:"AI",   href:"/Research"},
  {id:"mining",    label:"Mining",             icon:"⛏", color:Q.lepton,   group:"DEFI", href:"/Mining"},
  {id:"staking",   label:"Staking Vault",      icon:"💎",color:Q.higgs,    group:"DEFI", href:"/Staking"},
  {id:"governance",label:"DAO Governance",     icon:"🗳", color:Q.gluon,    group:"DEFI", href:"/Governance"},
  {id:"platform",  label:"Platform Hub",       icon:"⚛️",color:Q.plasma,   group:"WEB3", href:"/Platform"},
];
const GROUPS=["MAIN","TRADE","AI","DEFI","WEB3"];

const MODULES=[
  {href:"/Trading",   icon:"💹",label:"Trading Terminal",  color:Q.gluon,   desc:"Pro Candle Chart · Live Order Book · AI Signals · Leverage 1–50x"},
  {href:"/Portfolio", icon:"💼",label:"Wallet & Portfolio",color:Q.neutrino,desc:"QEMMA Coin · Send · Receive · Swap · Transaction History"},
  {href:"/Agents",    icon:"👁",label:"Oracle AI Chat",    color:Q.plasma,  desc:"Emma Oracle · 12 Agents · Tasks · Predictions · Code Generator"},
  {href:"/MetaMemory",icon:"🧠",label:"Meta Memory TR2",   color:Q.quark,   desc:"HQMLL · Krealogoik Engine · Deep Loops · Thought Stream"},
  {href:"/Research",  icon:"🔬",label:"Deep Research",     color:Q.gluon,   desc:"8 Domains · 847 Sources · Agent Analysis · Quantum Oracle"},
  {href:"/Mining",    icon:"⛏", label:"Mining",            color:Q.lepton,  desc:"4 Pools · Halving Clock · Block Explorer · Mine Now"},
  {href:"/Staking",   icon:"💎",label:"Staking Vault",     color:Q.higgs,   desc:"60% APY · 5 Tiers · Auto-Compound · TVL: $33M"},
  {href:"/Governance",icon:"🗳", label:"DAO Governance",   color:Q.gluon,   desc:"On-Chain Voting · Treasury · Proposals · TimelockController"},
  {href:"/Platform",  icon:"⚛️",label:"Platform Hub",      color:Q.plasma,  desc:"Token Launch · Secret Tools · Cloud Drive · Smart Contracts"},
];

// ─── DOWNLOAD PAGE ────────────────────────────────────────────────────────────
function DownloadPage({tick}){
  const [dlState,setDl]=useState({});
  const startDl=k=>{setDl(s=>({...s,[k]:"loading"}));setTimeout(()=>setDl(s=>({...s,[k]:"done"})),3000);};

  const platforms=[
    {
      key:"web",icon:"🌐",title:"WEB APP",sub:"No installation needed",
      color:Q.gluon,size:"Live",version:"v4.1",
      specs:["Chrome 120+","Firefox 121+","Safari 17+","Edge 120+","PWA offline support","All devices"],
      action:()=>window.open("https://quantum-emma-app.base44.app","_blank"),
      btnLabel:"🌐 OPEN WEB APP",btnColor:Q.gluon,
    },
    {
      key:"win",icon:"🪟",title:"WINDOWS APP",sub:"Electron Desktop Application",
      color:Q.neutrino,size:"~148 MB",version:"v4.1.0",
      specs:["Windows 10/11 x64","8 GB RAM min","2 GB disk space","Hardware acceleration","System tray icon","Auto-updates"],
      build:"npm run build:win → dist/QEMMA-Setup-v4.1.0.exe",
      action:()=>startDl("win"),
      btnLabel:"⬇ DOWNLOAD .EXE",btnColor:Q.neutrino,
    },
    {
      key:"apk",icon:"🤖",title:"ANDROID APP",sub:"React Native · Expo",
      color:Q.lepton,size:"~48 MB",version:"v4.1.0",
      specs:["Android 9.0+ (API 28)","ARM64 / x86_64","4 GB RAM min","500 MB storage","Biometric auth","Push notifications"],
      build:"eas build --platform android → QEMMA-v4.1.0.apk",
      action:()=>startDl("apk"),
      btnLabel:"⬇ DOWNLOAD .APK",btnColor:Q.lepton,
    },
  ];

  const allFeatures=[
    "💹 Professional Trading Terminal — Candles, Order Book, AI Signals, Leverage",
    "👁 Oracle AI Chat — Emma + 12 Agents with Live Predictions & Code Generation",
    "💎 Staking Vault — 60% APY, 5 Tiers, Auto-Compound, TVL Charts",
    "⛏ Mining — 4 Pools, Halving Clock, Block Explorer, Live Hash Rate",
    "🧠 Meta Memory TR2 — HQMLL 7 Layers, Krealogoik, Recursive Loops",
    "🔬 Deep Research — 8 Domains, 847 Sources, Agent Analysis, Oracle Chat",
    "🗳 DAO Governance — On-Chain Voting, Treasury $10M, Proposals, Timelock",
    "💼 Wallet & Portfolio — QEMMA Coin, Send, Swap, Transaction History",
    "⚛️ Platform Hub — Token Launch, Secret Tools, Cloud Drive, Smart Contracts",
    "🔐 Secret Tools — Quantum Key Gen, Dark Pool Detector, Neural Clone",
    "📊 Real-time Prices — WebSocket Live Data, 8+ Coins, Live Candles",
    "☁️ Cloud Space Drive — 1TB Encrypted, IPFS, Backup, Library",
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Hero */}
      <div style={{padding:"32px 36px",borderRadius:22,
        background:`linear-gradient(135deg,${Q.higgs}18,${Q.plasma}10,${Q.gluon}08)`,
        border:`1px solid ${Q.higgs}44`,
        boxShadow:`0 0 80px ${Q.higgs}0e,inset 0 0 100px ${Q.plasma}06`,
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,
          backgroundImage:`linear-gradient(${Q.higgs}05 1px,transparent 1px),linear-gradient(90deg,${Q.higgs}05 1px,transparent 1px)`,
          backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:28}}>
          <QEMMACoin size={96} tick={tick}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:900,fontSize:26,color:Q.higgs,letterSpacing:2,marginBottom:8,
              textShadow:`0 0 28px ${Q.higgs}88`}}>QUANTUM EMMA — DOWNLOAD CENTER</div>
            <div style={{fontSize:11,color:"#78350f",letterSpacing:2,marginBottom:12,fontWeight:700}}>
              WEB APP · WINDOWS DESKTOP · ANDROID · ENTERPRISE v4.1
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["10 Modules","12 AI Agents","QEMMA Token","Meta Genius TR2","HQMLL","Patent Pending","© Grigori Saks"].map((b,i)=>(
                <span key={i} style={{padding:"3px 11px",borderRadius:20,fontSize:9,fontWeight:800,
                  color:Q.higgs,background:`${Q.higgs}16`,border:`1px solid ${Q.higgs}35`}}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:10,color:Q.dim,marginBottom:4,letterSpacing:1}}>CURRENT VERSION</div>
            <div style={{fontSize:30,fontWeight:900,color:Q.higgs,fontFamily:"monospace",
              textShadow:`0 0 16px ${Q.higgs}`}}>v4.1.0</div>
            <div style={{fontSize:10,color:Q.lepton,marginTop:5,fontWeight:700}}>✓ All Platforms</div>
            <div style={{fontSize:9,color:Q.dim,marginTop:3}}>Build: 2026.04.13</div>
          </div>
        </div>
      </div>

      {/* Platform Cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18}}>
        {platforms.map((pl,i)=>{
          const p=.5+Math.sin(tick*.07+i*.8)*.3;
          const state=dlState[pl.key];
          return(
            <div key={pl.key} style={{padding:"28px 24px",borderRadius:18,
              background:`linear-gradient(135deg,${pl.color}14,${pl.color}07)`,
              border:`2px solid ${pl.color}${Math.round(40+p*20).toString(16).padStart(2,"00")}`,
              boxShadow:`0 0 ${Math.round(p*30)}px ${pl.color}12`,
              display:"flex",flexDirection:"column",gap:16,
              position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:`${(-50+tick*1.2+i*14)%200}%`,width:"50%",height:"100%",
                background:`linear-gradient(90deg,transparent,${pl.color}07,transparent)`,pointerEvents:"none"}}/>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:54,marginBottom:10,
                  filter:`drop-shadow(0 0 ${Math.round(p*16)}px ${pl.color})`}}>{pl.icon}</div>
                <div style={{fontWeight:900,fontSize:19,color:pl.color,letterSpacing:1,marginBottom:4,
                  textShadow:`0 0 12px ${pl.color}88`}}>{pl.title}</div>
                <div style={{fontSize:11,color:Q.dim,marginBottom:4}}>{pl.sub}</div>
                <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                  <span style={{fontSize:9,fontWeight:700,color:pl.color,background:`${pl.color}15`,
                    padding:"2px 8px",borderRadius:20,border:`1px solid ${pl.color}33`}}>{pl.version}</span>
                  <span style={{fontSize:9,fontWeight:700,color:Q.mid,background:"rgba(255,255,255,0.05)",
                    padding:"2px 8px",borderRadius:20}}>{pl.size}</span>
                </div>
              </div>

              {/* Specs */}
              <div style={{flex:1}}>
                {pl.specs.map((s,j)=>(
                  <div key={j} style={{display:"flex",gap:8,alignItems:"center",marginBottom:7,fontSize:11}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:pl.color,flexShrink:0,
                      boxShadow:`0 0 4px ${pl.color}`}}/>
                    <span style={{color:Q.mid}}>{s}</span>
                  </div>
                ))}
              </div>

              {/* Build command */}
              {pl.build&&(
                <div style={{padding:"10px 12px",borderRadius:10,
                  background:"rgba(0,0,0,0.45)",border:`1px solid ${pl.color}1e`}}>
                  <div style={{fontSize:8,color:Q.dim,marginBottom:5,letterSpacing:1}}>BUILD COMMAND</div>
                  <div style={{fontFamily:"monospace",fontSize:9,color:pl.color,lineHeight:1.7}}>
                    {pl.build}
                  </div>
                </div>
              )}

              {/* CTA */}
              <button onClick={pl.action} style={{
                padding:"15px",borderRadius:13,border:"none",cursor:"pointer",
                background:state==="done"
                  ?`${Q.lepton}44`
                  :state==="loading"
                  ?`rgba(255,255,255,0.06)`
                  :`linear-gradient(135deg,${pl.color}77,${pl.color}55)`,
                color:state==="done"?"#000":Q.bright,
                fontSize:14,fontWeight:900,letterSpacing:2,
                boxShadow:!state?`0 4px 22px ${pl.color}33`:"none",
                transition:"all .3s"}}>
                {state==="loading"?"⏳ PREPARING..."
                  :state==="done"?"✓ READY TO INSTALL"
                  :pl.btnLabel}
              </button>

              <div style={{textAlign:"center",fontSize:9,color:Q.dim}}>
                Quantum Emma {pl.version} · © 2026 Grigori Saks
              </div>
            </div>
          );
        })}
      </div>

      {/* All Features */}
      <div style={{padding:"22px 26px",borderRadius:16,
        background:`linear-gradient(135deg,${Q.plasma}0a,${Q.plasma}06)`,
        border:`1px solid ${Q.plasma}28`}}>
        <div style={{fontWeight:800,fontSize:12,color:Q.plasma,letterSpacing:1,marginBottom:14}}>
          ✅ ALL FEATURES — INCLUDED IN EVERY PLATFORM VERSION
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {allFeatures.map((f,i)=>{
            const p=.5+Math.sin(tick*.06+i*.5)*.28;
            return(
              <div key={i} style={{padding:"10px 14px",borderRadius:10,fontSize:11,color:Q.mid,
                background:"rgba(139,92,246,0.05)",
                border:`1px solid rgba(139,92,246,${.08+p*.05})`,
                lineHeight:1.4}}>{f}</div>
            );
          })}
        </div>
      </div>

      {/* System Requirements */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[
          {title:"Web Browser",icon:"🌐",color:Q.gluon,
            reqs:["Chrome 120+","Firefox 121+","Safari 17+","Edge 120+","JavaScript enabled","WebGL 2.0"]},
          {title:"Windows Desktop",icon:"🪟",color:Q.neutrino,
            reqs:["Windows 10/11 x64","Intel/AMD CPU","8 GB RAM (16 rec.)","2 GB free disk","Node.js 20+ (dev)","Internet connection"]},
          {title:"Android Mobile",icon:"🤖",color:Q.lepton,
            reqs:["Android 9.0+ (API 28)","ARM64 / x86_64","4 GB RAM min","500 MB storage","Internet access","Camera (optional)"]},
        ].map((pl,i)=>(
          <div key={i} style={{padding:"18px 20px",borderRadius:14,
            background:`${pl.color}0a`,border:`1px solid ${pl.color}28`}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:22}}>{pl.icon}</span>
              <div style={{fontWeight:800,fontSize:12,color:pl.color}}>{pl.title}</div>
            </div>
            <div style={{fontSize:10,color:Q.dim,letterSpacing:.5,marginBottom:7}}>REQUIREMENTS</div>
            {pl.reqs.map((r,j)=>(
              <div key={j} style={{display:"flex",gap:8,alignItems:"center",marginBottom:5,fontSize:10}}>
                <div style={{width:4,height:4,borderRadius:"50%",background:pl.color,flexShrink:0,
                  boxShadow:`0 0 3px ${pl.color}`}}/>
                <span style={{color:Q.mid}}>{r}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Smart Contracts */}
      <div style={{padding:"22px 26px",borderRadius:16,
        background:`${Q.neutrino}08`,border:`1px solid ${Q.neutrino}28`}}>
        <div style={{fontWeight:800,fontSize:12,color:Q.neutrino,letterSpacing:1,marginBottom:14}}>
          📜 SMART CONTRACT SUITE — 7 AUDITED · MAINNET READY
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[
            {n:"QEMMAToken",      icon:"🪙",c:Q.neutrino,line:"428"},
            {n:"QEMMAMining",     icon:"⛏", c:Q.lepton,  line:"312"},
            {n:"QEMMAStaking",    icon:"💎",c:Q.higgs,   line:"384"},
            {n:"QEMMAGovernance", icon:"🗳", c:Q.gluon,   line:"521"},
            {n:"QEMMASwap",       icon:"🔄",c:Q.plasma,  line:"247"},
            {n:"QEMMAMetaCodex",  icon:"🧠",c:Q.muon,    line:"389"},
            {n:"QEMMAMetaMemory", icon:"💾",c:Q.boson,   line:"301"},
          ].map((c,i)=>(
            <div key={i} style={{padding:"12px 14px",borderRadius:11,
              background:`${c.c}0a`,border:`1px solid ${c.c}22`,
              display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>{c.icon}</span>
              <div>
                <div style={{fontWeight:700,fontSize:10,color:c.c,fontFamily:"monospace"}}>{c.n}.sol</div>
                <div style={{fontSize:8,color:Q.dim,marginTop:2}}>{c.line} lines · A+</div>
              </div>
            </div>
          ))}
          <div style={{padding:"12px 14px",borderRadius:11,
            background:`${Q.lepton}0a`,border:`1px solid ${Q.lepton}28`,
            display:"flex",alignItems:"center",justifyContent:"center",
            flexDirection:"column",gap:3}}>
            <span style={{fontSize:16}}>✅</span>
            <div style={{fontWeight:800,fontSize:10,color:Q.lepton}}>ALL AUDITED</div>
            <div style={{fontSize:8,color:Q.dim}}>Score: A+</div>
          </div>
        </div>
        <div style={{marginTop:12,padding:"10px 14px",borderRadius:10,
          background:"rgba(0,0,0,0.4)",border:`1px solid ${Q.neutrino}1a`,
          fontFamily:"monospace",fontSize:10,color:Q.neutrino,lineHeight:1.8}}>
          npx hardhat compile &nbsp;→&nbsp; npx hardhat run deploy/deploy.js --network sepolia &nbsp;→&nbsp; --network mainnet
        </div>
      </div>

      {/* Footer */}
      <div style={{padding:"14px 20px",borderRadius:12,
        background:`${Q.plasma}06`,border:`1px solid ${Q.plasma}14`,
        display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10}}>
        <span style={{color:Q.dim}}>Quantum Emma Enterprise v4.1.0 · Build 2026.04.13 · Web · Windows · Android</span>
        <span style={{color:Q.plasma,fontWeight:700}}>© 2026 Grigori Saks — All Rights Reserved — Patent Pending</span>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({tick,mouse}){
  const supply=15200000+tick*3;
  const block=847291+Math.floor(tick/24);
  const totalVal=50027+Math.sin(tick*.02)*182;
  const earned=.0001*tick;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {/* Hero */}
      <div style={{padding:"28px 32px",borderRadius:22,position:"relative",overflow:"hidden",
        background:`linear-gradient(135deg,${Q.plasma}18,${Q.gluon}10,${Q.higgs}08)`,
        border:`1px solid ${Q.plasma}44`,
        boxShadow:`0 0 80px ${Q.plasma}12,inset 0 0 100px ${Q.neutrino}06`}}>
        <div style={{position:"absolute",inset:0,
          backgroundImage:`linear-gradient(${Q.plasma}07 1px,transparent 1px),linear-gradient(90deg,${Q.plasma}07 1px,transparent 1px)`,
          backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:24}}>
          <HoloEye size={104} tick={tick} mouse={mouse}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
              <span style={{fontWeight:900,fontSize:28,color:Q.neutrino,letterSpacing:3,
                textShadow:`0 0 32px ${Q.plasma}88`}}>QUANTUM EMMA</span>
              <span style={{padding:"3px 12px",borderRadius:20,fontSize:10,fontWeight:800,
                color:Q.higgs,background:`${Q.higgs}18`,border:`1px solid ${Q.higgs}44`}}>ENTERPRISE v4.1</span>
              <span style={{padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:800,
                color:Q.lepton,background:`${Q.lepton}12`,border:`1px solid ${Q.lepton}33`}}>● LIVE</span>
            </div>
            <div style={{color:Q.plasma,fontSize:11,letterSpacing:2,marginBottom:10,fontWeight:600}}>
              META GENIUS TR2 · HQMLL 7-LAYER · 12 SELF-ADAPTING AGENTS · 4D/5D QUANTUM · © 2026 GRIGORI SAKS
            </div>
            <div style={{display:"flex",gap:14,fontSize:11,flexWrap:"wrap"}}>
              <span style={{color:Q.lepton,display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:Q.lepton,
                  boxShadow:`0 0 8px ${Q.lepton}`}}/>
                All Systems Nominal
              </span>
              <span style={{color:Q.higgs,fontWeight:700}}>Phase: GENESIS</span>
              <span style={{color:Q.gluon}}>Supply: {supply.toLocaleString("de")}/100M</span>
              <span style={{color:Q.dim,fontFamily:"monospace"}}>Block #{block.toLocaleString()}</span>
              <span style={{color:Q.muon,fontWeight:700}}>💡 Krealogoik #287</span>
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:34,fontWeight:900,color:Q.lepton,fontFamily:"monospace",
              textShadow:`0 0 22px ${Q.lepton}`}}>98.3%</div>
            <div style={{fontSize:9,color:Q.dim,letterSpacing:1}}>AI EFFICIENCY</div>
            <div style={{marginTop:8,padding:"8px 14px",borderRadius:12,
              background:`${Q.higgs}14`,border:`1px solid ${Q.higgs}33`}}>
              <div style={{fontSize:9,color:Q.dim}}>QEMMA PRICE</div>
              <div style={{fontSize:20,fontWeight:900,color:Q.higgs,fontFamily:"monospace",
                textShadow:`0 0 10px ${Q.higgs}`}}>$0.6300</div>
              <div style={{fontSize:10,color:Q.lepton,fontWeight:700,marginTop:2}}>▲ +8.42%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <LiveTicker tick={tick}/>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
        <StatCard icon="💼" label="PORTFOLIO"    value={`$${totalVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}`} sub="Total Value"   color={Q.neutrino} tick={tick} i={0}/>
        <StatCard icon="🪙" label="QEMMA PRICE"  value="$0.6300"  sub="+8.42% 24h"  color={Q.quark}   tick={tick} i={1}/>
        <StatCard icon="📈" label="24H P&L"      value="+$1,847"  sub="+3.8% today" color={Q.lepton}  tick={tick} i={2}/>
        <StatCard icon="💎" label="STAKED"        value="7,500 Q"  sub="QUANTUM Tier" color={Q.higgs}  tick={tick} i={3}/>
        <StatCard icon="⛏"  label="MINED TODAY"  value={`${earned.toFixed(3)} Q`} sub="Pool ALPHA" color={Q.lepton} tick={tick} i={4}/>
        <StatCard icon="🤖" label="AI AGENTS"    value="12/12"    sub="98.3% eff."   color={Q.lepton} tick={tick} i={5}/>
      </div>

      {/* Module Grid */}
      <div>
        <div style={{fontSize:10,fontWeight:800,color:Q.dim,letterSpacing:2,marginBottom:10}}>🚀 ALL MODULES</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {MODULES.map((m,i)=><ModuleCard key={i} {...m} tick={tick} i={i}/>)}
        </div>
      </div>

      {/* HQMLL + Agents */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:14}}>
        <div style={{padding:"18px 20px",borderRadius:16,
          background:`linear-gradient(135deg,${Q.gluon}12,${Q.gluon}06)`,
          border:`1px solid ${Q.gluon}33`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:`${(-50+tick*1.25)%200}%`,width:"50%",height:"100%",
            background:`linear-gradient(90deg,transparent,${Q.gluon}06,transparent)`,pointerEvents:"none"}}/>
          <div style={{fontWeight:800,fontSize:11,color:Q.gluon,letterSpacing:1,marginBottom:12}}>
            ⚡ HQMLL — 7 LAYERS LIVE
          </div>
          <HQMLLLive tick={tick}/>
        </div>
        <div style={{padding:"18px 20px",borderRadius:16,
          background:`linear-gradient(135deg,${Q.plasma}12,${Q.plasma}06)`,
          border:`1px solid ${Q.plasma}33`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:`${(-50+tick*1.15)%200}%`,width:"50%",height:"100%",
            background:`linear-gradient(90deg,transparent,${Q.plasma}05,transparent)`,pointerEvents:"none"}}/>
          <div style={{fontWeight:800,fontSize:11,color:Q.plasma,letterSpacing:1,marginBottom:12}}>
            🤖 META GENIUS TR2 — 12 AGENTS ONLINE
          </div>
          <AgentsGrid tick={tick}/>
        </div>
      </div>

      {/* Footer */}
      <div style={{padding:"12px 18px",borderRadius:12,
        background:`${Q.plasma}06`,border:`1px solid ${Q.plasma}14`,
        display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10}}>
        <span style={{color:Q.dim}}>10 Modules · 12 AI Agents · 7 Smart Contracts · HQMLL · Krealogoik · 4D/5D Quantum</span>
        <span style={{color:Q.plasma,fontWeight:700}}>© 2026 Grigori Saks — Enterprise v4.1 — Patent Pending</span>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({page,setPage,tick,mouse,open,setOpen}){
  return(
    <div style={{
      width:open?244:64,flexShrink:0,
      background:`linear-gradient(180deg,${Q.bg1}f8,${Q.deep}f8)`,
      borderRight:`1px solid ${Q.plasma}22`,
      display:"flex",flexDirection:"column",
      transition:"width .25s cubic-bezier(.4,0,.2,1)",
      overflow:"hidden",zIndex:2,
      boxShadow:`4px 0 32px ${Q.void}88`,
    }}>
      {/* Logo */}
      <div onClick={()=>setOpen(o=>!o)} style={{
        padding:"16px 13px",display:"flex",alignItems:"center",gap:11,flexShrink:0,
        borderBottom:`1px solid ${Q.plasma}18`,cursor:"pointer",
        background:`linear-gradient(135deg,${Q.plasma}08,transparent)`,
      }}>
        <HoloEye size={36} tick={tick} mouse={mouse}/>
        {open&&(
          <div>
            <div style={{fontWeight:900,fontSize:12,color:Q.neutrino,letterSpacing:1,
              textShadow:`0 0 10px ${Q.plasma}88`}}>QUANTUM EMMA</div>
            <div style={{fontSize:8,color:Q.plasma,marginTop:2,letterSpacing:1.5}}>META GENIUS TR2 v4.1</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <div style={{flex:1,overflowY:"auto",padding:"8px 5px",scrollbarWidth:"none"}}>
        {GROUPS.map(group=>{
          const items=NAV.filter(n=>n.group===group);
          return(
            <div key={group} style={{marginBottom:4}}>
              {open&&<div style={{fontSize:7,fontWeight:800,color:Q.dim,letterSpacing:2,
                padding:"8px 9px 4px",opacity:.55}}>{group}</div>}
              {items.map(n=>{
                const active=page===n.id&&!n.href;
                if(n.href){
                  return(
                    <a key={n.id} href={n.href} style={{
                      display:"flex",alignItems:"center",gap:10,width:"100%",
                      padding:open?"9px 11px":"11px 0",borderRadius:10,
                      marginBottom:2,justifyContent:open?"flex-start":"center",
                      background:"transparent",color:Q.dim,textDecoration:"none",
                      borderLeft:"2px solid transparent",transition:"all .15s",
                    }}>
                      <span style={{fontSize:16,flexShrink:0}}>{n.icon}</span>
                      {open&&<span style={{fontSize:11,fontWeight:500,whiteSpace:"nowrap"}}>{n.label}</span>}
                    </a>
                  );
                }
                return(
                  <button key={n.id} onClick={()=>setPage(n.id)} style={{
                    display:"flex",alignItems:"center",gap:10,width:"100%",
                    padding:open?"9px 11px":"11px 0",borderRadius:10,border:"none",
                    cursor:"pointer",marginBottom:2,
                    justifyContent:open?"flex-start":"center",
                    background:active?`${n.color}22`:"transparent",
                    borderLeft:active?`2px solid ${n.color}`:"2px solid transparent",
                    color:active?n.color:Q.dim,transition:"all .15s",
                  }}>
                    <span style={{fontSize:16,flexShrink:0,
                      filter:active?`drop-shadow(0 0 6px ${n.color})`:"none"}}>{n.icon}</span>
                    {open&&<span style={{fontSize:11,fontWeight:active?800:500,whiteSpace:"nowrap",
                      textShadow:active?`0 0 10px ${n.color}88`:"none"}}>{n.label}</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Sidebar footer */}
      {open&&(
        <div style={{padding:"12px 15px",borderTop:`1px solid ${Q.plasma}10`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <QEMMACoin size={20} tick={tick}/>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:Q.higgs}}>$0.6300</div>
              <div style={{fontSize:9,color:Q.lepton,fontWeight:700}}>▲ +8.42%</div>
            </div>
          </div>
          <div style={{fontSize:8,color:Q.dim,lineHeight:1.9}}>
            © 2026 Grigori Saks<br/>
            <span style={{color:Q.plasma}}>Enterprise v4.1 · Patent Pending</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TOPBAR ──────────────────────────────────────────────────────────────────
function Topbar({page,tick}){
  const cur=NAV.find(n=>n.id===page)||NAV[0];
  const block=847291+Math.floor(tick/24);
  return(
    <div style={{
      padding:"0 26px",height:56,flexShrink:0,
      background:`${Q.bg1}cc`,backdropFilter:"blur(22px)",
      borderBottom:`1px solid ${Q.plasma}18`,
      display:"flex",alignItems:"center",justifyContent:"space-between",
      boxShadow:`0 4px 32px ${Q.void}88`,zIndex:1,
    }}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:19,filter:`drop-shadow(0 0 8px ${cur.color})`}}>{cur.icon}</span>
        <span style={{fontWeight:900,fontSize:14,color:cur.color,letterSpacing:1,
          textShadow:`0 0 12px ${cur.color}88`}}>{cur.label.toUpperCase()}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:18,fontSize:11}}>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:Q.lepton,
            boxShadow:`0 0 8px ${Q.lepton}`}}/>
          <span style={{color:Q.lepton,fontWeight:600}}>All Systems Online</span>
        </div>
        <span style={{color:Q.dim,fontFamily:"monospace",fontSize:10}}>
          Block #{block.toLocaleString()}
        </span>
        <span style={{color:Q.higgs,fontWeight:700,textShadow:`0 0 8px ${Q.higgs}88`}}>
          QEMMA $0.6300 ▲ +8.42%
        </span>
        <div style={{
          padding:"7px 18px",borderRadius:22,
          background:`linear-gradient(135deg,${Q.plasma}28,${Q.neutrino}18)`,
          border:`1px solid ${Q.plasma}44`,
          color:Q.neutrino,fontWeight:800,fontSize:11,cursor:"pointer",
          boxShadow:`0 0 14px ${Q.plasma}22`,
        }}>👛 Connect Wallet</div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const tick=useTick(60);
  const mouse=useMousePos();
  const [page,setPage]=useState("dashboard");
  const [sidebarOpen,setSidebarOpen]=useState(true);

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",
      background:Q.void,fontFamily:"'Inter',system-ui,sans-serif",color:Q.bright,
      position:"relative"}}>

      {/* Background particles */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <ParticleField tick={tick} mouse={mouse}/>
      </div>

      <Sidebar page={page} setPage={setPage} tick={tick} mouse={mouse}
        open={sidebarOpen} setOpen={setSidebarOpen}/>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",zIndex:1}}>
        <Topbar page={page} tick={tick}/>
        <div style={{flex:1,overflowY:"auto",padding:"22px 26px",
          scrollbarWidth:"thin",scrollbarColor:`${Q.plasma}44 transparent`,
          backgroundImage:`radial-gradient(${Q.plasma}06 1px,transparent 1px)`,
          backgroundSize:"30px 30px"}}>
          {page==="dashboard" && <DashboardPage tick={tick} mouse={mouse}/>}
          {page==="download"  && <DownloadPage tick={tick}/>}
          <div style={{height:32}}/>
        </div>
      </div>
    </div>
  );
}
