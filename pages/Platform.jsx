// ============================================================
//  QUANTUM EMMA — Ultimate Platform Hub v4.0
//  Secret Tools · Hyper Intelligence · Meta Optimum AI
//  Super Memory TR2 · Genius Metamodule · QEMMA Token Launch
//  Library Cloud · Backup · Documentation · All Features
//  © 2026 Grigori Saks — ALL RIGHTS RESERVED — PATENT PENDING
// ============================================================
import React, { useState, useEffect, useRef } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
  gold:"#f59e0b", emerald:"#10b981", violet:"#7c3aed", rose:"#f43f5e",
};

function useTick(ms=100){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[]);return t;}
function Bar({v,c,h=4}){return<div style={{height:h,background:"rgba(255,255,255,0.05)",borderRadius:h/2}}><div style={{height:h,width:`${Math.min(v,100)}%`,background:c,borderRadius:h/2,transition:"width .5s",boxShadow:`0 0 8px ${c}66`}}/></div>;}
function Badge({label,color,size=9}){return<span style={{padding:"2px 8px",borderRadius:20,fontSize:size,fontWeight:800,letterSpacing:.8,color,background:`${color}18`,border:`1px solid ${color}33`}}>{label}</span>;}

function HoloCard({children,color=Q.plasma,style={},tick=0,glow=false}){
  const p=.5+Math.sin(tick*.07)*.28;
  return<div style={{borderRadius:16,padding:"18px 20px",background:`linear-gradient(135deg,${color}12,${color}06,transparent)`,border:`1px solid ${color}${Math.round((p*.22+.08)*255).toString(16).padStart(2,"00")}`,boxShadow:glow?`0 0 ${Math.round(18+p*14)}px ${color}1a,inset 0 0 30px ${color}06`:"",...style,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:`${(-50+tick*1.3)%200}%`,width:"50%",height:"100%",background:`linear-gradient(90deg,transparent,${color}05,transparent)`,pointerEvents:"none"}}/>
    {children}
  </div>;
}

// ─── QEMMA COIN SVG ───────────────────────────────────────────────────────────
function QEMMACoin({size=56, tick=0}){
  const t=tick*.03, rot=(tick*.8)%360, irot=(-tick*1.2)%360;
  const p=.75+Math.sin(t*2.5)*.2;
  return(
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{filter:`drop-shadow(0 0 ${Math.round(8+p*10)}px #8b5cf6) drop-shadow(0 0 ${Math.round(20+p*16)}px #7c3aed44)`,flexShrink:0}}>
      <defs>
        <radialGradient id={`qc${size}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#c4b5fd"/><stop offset="35%" stopColor="#8b5cf6"/>
          <stop offset="70%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#3b0764"/>
        </radialGradient>
        <radialGradient id={`qs${size}`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".35"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`qr${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd"/><stop offset="50%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#4c1d95"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#qr${size})`}/>
      <circle cx="50" cy="50" r="44" fill={`url(#qc${size})`}/>
      <g transform={`rotate(${rot},50,50)`}><ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity=".4" strokeDasharray="4 6"/></g>
      <g transform={`rotate(${irot},50,50)`}><ellipse cx="50" cy="50" rx="32" ry="11" fill="none" stroke="#06b6d4" strokeWidth=".8" strokeOpacity=".3" strokeDasharray="3 8"/></g>
      <g transform={`rotate(${rot*.6},50,50)`}><ellipse cx="50" cy="50" rx="22" ry="8" fill="none" stroke="#fbbf24" strokeWidth=".6" strokeOpacity=".2" strokeDasharray="2 10"/></g>
      <text x="50" y="60" textAnchor="middle" fontSize="38" fontWeight="900" fontFamily="Arial Black" fill="#fff" fillOpacity=".95">Q</text>
      <text x="68" y="54" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily="Arial" fill="#c4b5fd" opacity=".9">E</text>
      <circle cx="50" cy="50" r="44" fill={`url(#qs${size})`}/>
      {[0,1,2].map(i=>{const a=t*(i%2===0?1.5:-1.2)+i*(Math.PI*2/3);return<g key={i}><circle cx={50+Math.cos(a)*40} cy={50+Math.sin(a)*14} r="2.5" fill="#fbbf24" fillOpacity={.85*p}/><circle cx={50+Math.cos(a)*40} cy={50+Math.sin(a)*14} r="5" fill="#fbbf24" fillOpacity=".12"/></g>;})}
      <text x="50" y="91" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#a78bfa" fillOpacity=".8" letterSpacing="2">QEMMA</text>
    </svg>
  );
}

// ─── SECTIONS REGISTRY ───────────────────────────────────────────────────────
const SECTIONS = [
  // MAIN
  {id:"overview",     label:"Platform Overview",      icon:"⚛️",  color:Q.plasma,   group:"PLATFORM"},
  {id:"tokenlaunch",  label:"Token Launch",           icon:"🚀",  color:Q.higgs,    group:"PLATFORM"},
  {id:"whitepaper",   label:"Whitepaper",             icon:"📄",  color:Q.gluon,    group:"PLATFORM"},
  {id:"smartcontracts",label:"Smart Contracts",       icon:"📜",  color:Q.neutrino, group:"PLATFORM"},
  // SECRET / ADVANCED
  {id:"secrettools",  label:"⚡ Secret Tools",         icon:"🔐",  color:Q.tauon,    group:"SECRET"},
  {id:"hyperintel",   label:"Hyper Intelligence",     icon:"🧬",  color:Q.boson,    group:"SECRET"},
  {id:"supermemory",  label:"Super Memory TR2",       icon:"🌀",  color:Q.quark,    group:"SECRET"},
  {id:"geniusmodule", label:"Genius Metamodule",      icon:"💎",  color:Q.gold,     group:"SECRET"},
  // CLOUD / STORAGE
  {id:"cloudspace",   label:"Cloud Space Drive",      icon:"☁️",  color:Q.gluon,    group:"CLOUD"},
  {id:"library",      label:"Knowledge Library",      icon:"📚",  color:Q.muon,     group:"CLOUD"},
  {id:"backup",       label:"Backup & Security",      icon:"🔒",  color:Q.lepton,   group:"CLOUD"},
  {id:"docs",         label:"Documentation DB",       icon:"📋",  color:Q.mid,      group:"CLOUD"},
  // WEB3
  {id:"exchange",     label:"Exchange Listings",      icon:"📈",  color:Q.higgs,    group:"WEB3"},
  {id:"onchain",      label:"On-Chain Analytics",     icon:"⛓",   color:Q.gluon,    group:"WEB3"},
  {id:"cryptography", label:"Quantum Cryptography",   icon:"🔐",  color:Q.tauon,    group:"WEB3"},
  {id:"defi",         label:"DeFi Ecosystem",         icon:"🔄",  color:Q.lepton,   group:"WEB3"},
];
const GROUPS = ["PLATFORM","SECRET","CLOUD","WEB3"];

// ─── OVERVIEW ────────────────────────────────────────────────────────────────
function OverviewSection({tick}){
  const metrics=[
    {l:"Total Market Cap", v:"$94.5M",      c:Q.higgs,   icon:"💰",sub:"at $0.63/QEMMA"},
    {l:"Circulating Supply",v:"15.2M QEMMA",c:Q.neutrino,icon:"🪙",sub:"15.2% of max"},
    {l:"Max Supply",        v:"100M QEMMA", c:Q.quark,   icon:"📊",sub:"Deflationary"},
    {l:"Smart Contracts",   v:"7 Audited",  c:Q.lepton,  icon:"📜",sub:"Score: A+"},
    {l:"AI Agents",         v:"12 Online",  c:Q.plasma,  icon:"🤖",sub:"98.3% efficiency"},
    {l:"HQMLL Accuracy",    v:"98.3%",      c:Q.lepton,  icon:"⚡",sub:"Loss: 0.002"},
    {l:"Staking TVL",       v:"52.8M Q",    c:Q.higgs,   icon:"💎",sub:"Best: 60% APY"},
    {l:"Krealogoik Events", v:"286 Patents",c:Q.muon,    icon:"💡",sub:"Pending"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {metrics.map((m,i)=>{
          const p=.5+Math.sin(tick*.07+i*.5)*.32;
          return(
            <div key={i} style={{padding:"16px",borderRadius:14,textAlign:"center",
              background:`${m.c}0a`,
              border:`1px solid ${m.c}${Math.round(18+p*14).toString(16).padStart(2,"00")}`,
              boxShadow:`0 0 ${Math.round(p*14)}px ${m.c}0e`,
              position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:`${(-50+tick*1.2+i*10)%200}%`,width:"50%",height:"100%",
                background:`linear-gradient(90deg,transparent,${m.c}05,transparent)`,pointerEvents:"none"}}/>
              <div style={{fontSize:22,marginBottom:6}}>{m.icon}</div>
              <div style={{fontSize:8,color:Q.dim,letterSpacing:1.2,marginBottom:4}}>{m.l}</div>
              <div style={{fontSize:16,fontWeight:900,color:m.c,fontFamily:"monospace",
                textShadow:`0 0 10px ${m.c}88`}}>{m.v}</div>
              <div style={{fontSize:8,color:Q.dim,marginTop:4}}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Tech Stack */}
      <HoloCard color={Q.plasma} tick={tick} glow>
        <div style={{fontWeight:800,fontSize:12,color:Q.plasma,letterSpacing:1,marginBottom:14}}>⚛️ FULL TECHNOLOGY STACK</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[
            {cat:"Blockchain",     items:["Ethereum (ERC-20)","Solidity 0.8.24","OpenZeppelin v5","Hardhat","Ethers.js"],c:Q.gluon},
            {cat:"AI / ML",        items:["HQMLL 7-Layer","Meta Genius TR2","Krealogoik Engine","Recursive Loops","Quantum Weights"],c:Q.neutrino},
            {cat:"Frontend",       items:["React 19","4D/5D Holographic","Quantum Particle FX","WebSocket Live","Base44 Platform"],c:Q.plasma},
            {cat:"DeFi",           items:["Uniswap V3","QEMMA/ETH Pool","5-Tier Staking","PoW Mining","DAO Governance"],c:Q.higgs},
            {cat:"Security",       items:["ReentrancyGuard","Multisig 3-of-5","TimelockController","ZK Proofs","Audit: A+"],c:Q.lepton},
            {cat:"Web3",           items:["WalletConnect","MetaMask","LayerZero Bridge","Cross-Chain","IPFS Storage"],c:Q.muon},
          ].map((s,i)=>(
            <div key={i} style={{padding:"12px 14px",borderRadius:11,
              background:`${s.c}0a`,border:`1px solid ${s.c}22`}}>
              <div style={{fontWeight:800,fontSize:11,color:s.c,marginBottom:8,letterSpacing:.5}}>{s.cat}</div>
              {s.items.map((item,j)=>(
                <div key={j} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,fontSize:10}}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:s.c,flexShrink:0,
                    boxShadow:`0 0 4px ${s.c}`}}/>
                  <span style={{color:Q.mid}}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </HoloCard>
    </div>
  );
}

// ─── TOKEN LAUNCH ────────────────────────────────────────────────────────────
function TokenLaunchSection({tick}){
  const [phase,setPhase]=useState(0);
  const phases=[
    {n:"Pre-Launch",     icon:"🔧",status:"DONE",date:"Q1 2026",desc:"Smart contracts, platform, whitepaper, audit",c:Q.lepton},
    {n:"Testnet Deploy", icon:"🧪",status:"DONE",date:"Q1 2026",desc:"Sepolia testnet, all 7 contracts verified",c:Q.lepton},
    {n:"Private Sale",   icon:"🤝",status:"ACTIVE",date:"Q2 2026",desc:"$0.08/QEMMA · 5M tokens · Whitelist only",c:Q.higgs},
    {n:"Public IDO",     icon:"🚀",status:"SOON",date:"Q2 2026",desc:"$0.15/QEMMA · 10M tokens · Uniswap launch",c:Q.muon},
    {n:"CEX Listings",   icon:"📈",status:"PLANNED",date:"Q3 2026",desc:"CoinGecko · CMC · Gate.io · MEXC · Bybit",c:Q.gluon},
    {n:"METAMORPH I",    icon:"🌟",status:"PLANNED",date:"Q4 2026",desc:"20M supply trigger · Phase evolution · Price target: $2",c:Q.neutrino},
  ];
  const exchanges=[
    {n:"Uniswap V3",  tier:"DEX",  icon:"🦄",status:"READY",date:"IDO Day",   c:Q.lepton,  desc:"QEMMA/ETH · QEMMA/USDT"},
    {n:"SushiSwap",   tier:"DEX",  icon:"🍣",status:"PLANNED",date:"Week 2",  c:Q.muon,    desc:"Additional liquidity"},
    {n:"CoinGecko",   tier:"DATA", icon:"🦎",status:"APPLIED",date:"Week 1",  c:Q.lepton,  desc:"Price tracking · Market cap"},
    {n:"CoinMarketCap",tier:"DATA",icon:"📊",status:"APPLIED",date:"Week 2",  c:Q.higgs,   desc:"Ranking · Data feeds"},
    {n:"Gate.io",     tier:"CEX T2",icon:"🚪",status:"PLANNED",date:"Q3 2026",c:Q.gluon,   desc:"Spot trading · High volume"},
    {n:"MEXC",        tier:"CEX T2",icon:"💹",status:"PLANNED",date:"Q3 2026",c:Q.neutrino,desc:"Global reach · 10M users"},
    {n:"Bybit",       tier:"CEX T1",icon:"⚡",status:"PLANNED",date:"Q4 2026",c:Q.plasma,  desc:"Top 3 exchange · Futures"},
    {n:"Binance",     tier:"CEX T1",icon:"🟡",status:"TARGET", date:"2027",   c:Q.higgs,   desc:"Largest exchange · Target"},
  ];
  const tokenomics=[
    {cat:"Community & Mining",pct:40,amount:"40M",c:Q.lepton,  desc:"Released via PoW mining rewards"},
    {cat:"Team",              pct:20,amount:"20M",c:Q.plasma,  desc:"24-month linear vesting, 6M cliff"},
    {cat:"Ecosystem Fund",    pct:20,amount:"20M",c:Q.gluon,   desc:"Partnerships, development, grants"},
    {cat:"Public Sale (IDO)", pct:15,amount:"15M",c:Q.higgs,   desc:"$0.10–$0.20 range · Uniswap"},
    {cat:"Reserve",           pct:5, amount:"5M", c:Q.muon,    desc:"Emergency, liquidity, legal"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Hero */}
      <div style={{padding:"24px 28px",borderRadius:18,
        background:`linear-gradient(135deg,${Q.higgs}18,${Q.neutrino}10,${Q.higgs}08)`,
        border:`1px solid ${Q.higgs}44`,boxShadow:`0 0 60px ${Q.higgs}0e`,
        display:"flex",alignItems:"center",gap:24,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,
          backgroundImage:`linear-gradient(${Q.higgs}06 1px,transparent 1px),linear-gradient(90deg,${Q.higgs}06 1px,transparent 1px)`,
          backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:20}}>
          <QEMMACoin size={80} tick={tick}/>
          <div>
            <div style={{fontSize:28,fontWeight:900,color:Q.higgs,letterSpacing:2,
              textShadow:`0 0 24px ${Q.higgs}88`}}>QEMMA TOKEN</div>
            <div style={{fontSize:11,color:"#78350f",letterSpacing:2,marginTop:4,fontWeight:700}}>
              METAMORPHIC LIVING ASSET · GENESIS PHASE · ERC-20 · ETHEREUM
            </div>
            <div style={{display:"flex",gap:10,marginTop:10}}>
              <Badge label="ERC-20" color={Q.gluon}/>
              <Badge label="METAMORPHIC" color={Q.neutrino}/>
              <Badge label="GENESIS PHASE" color={Q.higgs}/>
              <Badge label="PATENT PENDING" color={Q.muon}/>
            </div>
          </div>
        </div>
        <div style={{marginLeft:"auto",textAlign:"right",position:"relative"}}>
          <div style={{fontSize:11,color:Q.dim}}>Current Price</div>
          <div style={{fontSize:30,fontWeight:900,color:Q.higgs,fontFamily:"monospace",
            textShadow:`0 0 16px ${Q.higgs}`}}>$0.6300</div>
          <div style={{fontSize:12,color:Q.lepton,fontWeight:700,marginTop:4}}>▲ +8.42% (24h)</div>
          <div style={{fontSize:10,color:Q.dim,marginTop:2}}>IDO Target: $0.15 → Now: $0.63</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* Roadmap */}
        <HoloCard color={Q.higgs} tick={tick}>
          <div style={{fontWeight:800,fontSize:12,color:Q.higgs,letterSpacing:1,marginBottom:14}}>🗓 LAUNCH ROADMAP</div>
          {phases.map((p,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:12,
              padding:"12px 14px",borderRadius:11,
              background:`${p.c}0a`,border:`1px solid ${p.c}22`}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0,width:28}}>
                <span style={{fontSize:18}}>{p.icon}</span>
                {i<phases.length-1&&<div style={{width:2,flex:1,background:`${p.c}33`,borderRadius:1}}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontWeight:800,fontSize:12,color:p.c}}>{p.n}</span>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <Badge label={p.status} color={p.c} size={8}/>
                    <span style={{fontSize:9,color:Q.dim}}>{p.date}</span>
                  </div>
                </div>
                <div style={{fontSize:10,color:Q.dim,lineHeight:1.5}}>{p.desc}</div>
              </div>
            </div>
          ))}
        </HoloCard>

        {/* Tokenomics */}
        <HoloCard color={Q.neutrino} tick={tick} glow>
          <div style={{fontWeight:800,fontSize:12,color:Q.neutrino,letterSpacing:1,marginBottom:14}}>🪙 TOKENOMICS — 100M SUPPLY</div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
            <svg width={140} height={140} viewBox="0 0 140 140">
              {tokenomics.reduce((acc,t,i)=>{
                const sweep=t.pct/100*Math.PI*2, start=acc.angle;
                const x1=70+66*Math.cos(start), y1=70+66*Math.sin(start);
                const x2=70+66*Math.cos(start+sweep), y2=70+66*Math.sin(start+sweep);
                const large=sweep>Math.PI?1:0;
                acc.paths.push(<g key={i}>
                  <path d={`M70,70 L${x1},${y1} A66,66 0 ${large},1 ${x2},${y2} Z`}
                    fill={t.c} fillOpacity=".8"/>
                  <path d={`M70,70 L${x1},${y1} A66,66 0 ${large},1 ${x2},${y2} Z`}
                    fill="none" stroke={Q.void} strokeWidth="2"/>
                </g>);
                acc.angle+=sweep; return acc;
              },{paths:[],angle:-Math.PI/2}).paths}
              <circle cx="70" cy="70" r="36" fill={Q.bg0}/>
              <text x="70" y="66" textAnchor="middle" fontSize="9" fontWeight="800" fill={Q.neutrino}>100M</text>
              <text x="70" y="78" textAnchor="middle" fontSize="8" fill={Q.dim}>QEMMA</text>
            </svg>
          </div>
          {tokenomics.map((t,i)=>(
            <div key={i} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:10}}>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:t.c,flexShrink:0}}/>
                  <span style={{color:Q.mid,fontWeight:600}}>{t.cat}</span>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <span style={{color:Q.dim,fontFamily:"monospace"}}>{t.amount}</span>
                  <span style={{color:t.c,fontWeight:800}}>{t.pct}%</span>
                </div>
              </div>
              <Bar v={t.pct} c={t.c} h={3}/>
              <div style={{fontSize:8,color:Q.dim,marginTop:2}}>{t.desc}</div>
            </div>
          ))}
        </HoloCard>
      </div>

      {/* Exchange listings */}
      <HoloCard color={Q.gluon} tick={tick}>
        <div style={{fontWeight:800,fontSize:12,color:Q.gluon,letterSpacing:1,marginBottom:14}}>📈 EXCHANGE LISTING STRATEGY</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {exchanges.map((ex,i)=>(
            <div key={i} style={{padding:"12px 14px",borderRadius:12,
              background:`${ex.c}0a`,border:`1px solid ${ex.c}28`,
              textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:6}}>{ex.icon}</div>
              <div style={{fontWeight:800,fontSize:12,color:ex.c,marginBottom:2}}>{ex.n}</div>
              <Badge label={ex.tier} color={ex.c} size={7}/>
              <div style={{marginTop:6}}>
                <Badge label={ex.status} color={ex.status==="DONE"||ex.status==="READY"?Q.lepton:ex.status==="APPLIED"?Q.higgs:ex.status==="ACTIVE"?Q.lepton:Q.mid} size={8}/>
              </div>
              <div style={{fontSize:8,color:Q.dim,marginTop:5}}>{ex.date}</div>
              <div style={{fontSize:8,color:Q.dim,marginTop:2}}>{ex.desc}</div>
            </div>
          ))}
        </div>
      </HoloCard>
    </div>
  );
}

// ─── SECRET TOOLS ────────────────────────────────────────────────────────────
function SecretToolsSection({tick}){
  const [unlocked,setUnlocked]=useState(false);
  const [code,setCode]=useState("");
  const tools=[
    {id:"quantumkey",    n:"Quantum Key Generator",    icon:"🔑",c:Q.tauon,  desc:"Generate quantum-resistant cryptographic keys. 256-bit entropy. Post-quantum safe.",status:"CLASSIFIED"},
    {id:"matrixscan",    n:"Matrix Market Scanner",    icon:"🕵️",c:Q.boson,  desc:"Hidden market pattern scanner. Detects institutional movements. 6-hour pre-signal.",status:"TOP SECRET"},
    {id:"timepredictor", n:"Time-Series Oracle",       icon:"⏰",c:Q.higgs,  desc:"Multi-dimensional time-series prediction. 98.3% backtested accuracy on QEMMA.",status:"RESTRICTED"},
    {id:"darkpool",      n:"Dark Pool Detector",       icon:"🌑",c:Q.tauon,  desc:"Real-time dark pool trade detection. Identifies hidden whale accumulation zones.",status:"TOP SECRET"},
    {id:"neuralclone",   n:"Neural Market Clone",      icon:"🧠",c:Q.plasma, desc:"Clone any market pattern using HQMLL. Predict exact price action replica.",status:"CLASSIFIED"},
    {id:"quantumentangle",n:"Quantum Entangle Engine", icon:"⚛️",c:Q.gluon,  desc:"Entangle correlated assets mathematically. Auto-arbitrage between pairs.",status:"EXPERIMENTAL"},
    {id:"memoryinjector",n:"Memory Injection Protocol",icon:"💉",c:Q.neutrino,desc:"Inject structured data directly into META-TR2 memory bank. Instant learning.",status:"RESTRICTED"},
    {id:"chaostheory",   n:"Chaos Theory Engine",      icon:"🌀",c:Q.muon,   desc:"Model market chaos. Identify strange attractors in price data. Non-linear patterns.",status:"EXPERIMENTAL"},
    {id:"eigentrader",   n:"Eigenvalue Trade Bot",     icon:"λ",  c:Q.lepton, desc:"Eigenvalue decomposition of market matrix. Auto-execute on dominant eigenvectors.",status:"CLASSIFIED"},
  ];
  if(!unlocked) return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:400}}>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16,filter:`drop-shadow(0 0 20px ${Q.tauon})`}}>🔐</div>
        <div style={{fontWeight:900,fontSize:20,color:Q.tauon,marginBottom:8,
          textShadow:`0 0 20px ${Q.tauon}88`}}>CLASSIFIED ACCESS</div>
        <div style={{fontSize:12,color:Q.mid,marginBottom:24,lineHeight:1.7}}>
          This section contains proprietary secret tools developed by Grigori Saks.
          Enter authorization code to access.
        </div>
        <input value={code} onChange={e=>setCode(e.target.value)} type="password"
          placeholder="Enter authorization code..."
          onKeyDown={e=>e.key==="Enter"&&(code.length>=4?setUnlocked(true):null)}
          style={{width:"100%",padding:"12px 16px",borderRadius:11,
            background:"rgba(0,0,0,0.6)",border:`1px solid ${Q.tauon}44`,
            color:Q.bright,fontSize:14,textAlign:"center",
            letterSpacing:4,boxSizing:"border-box",marginBottom:12}}/>
        <button onClick={()=>code.length>=4&&setUnlocked(true)} style={{
          width:"100%",padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
          background:`linear-gradient(135deg,${Q.tauon}55,${Q.plasma}33)`,
          color:Q.bright,fontSize:13,fontWeight:900,letterSpacing:2}}>
          🔓 UNLOCK SECRET TOOLS
        </button>
        <div style={{fontSize:10,color:Q.dim,marginTop:12}}>
          Authorized users only · © 2026 Grigori Saks
        </div>
      </div>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderRadius:11,
        background:`${Q.lepton}08`,border:`1px solid ${Q.lepton}28`,marginBottom:4}}>
        <span style={{fontSize:14}}>✅</span>
        <span style={{fontSize:11,color:Q.lepton,fontWeight:700}}>CLASSIFIED ACCESS GRANTED · SECRET TOOLS UNLOCKED</span>
        <button onClick={()=>setUnlocked(false)} style={{marginLeft:"auto",padding:"4px 12px",
          borderRadius:8,border:`1px solid ${Q.tauon}33`,background:"transparent",
          color:Q.tauon,fontSize:10,cursor:"pointer"}}>LOCK</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {tools.map((t,i)=>{
          const p=.5+Math.sin(tick*.07+i*.6)*.35;
          return(
            <div key={t.id} style={{padding:"18px",borderRadius:14,
              background:`${t.c}0c`,
              border:`1px solid ${t.c}${Math.round(20+p*18).toString(16).padStart(2,"00")}`,
              boxShadow:`0 0 ${Math.round(p*18)}px ${t.c}0e`,
              position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:`${(-50+tick*1.3+i*12)%200}%`,width:"50%",height:"100%",
                background:`linear-gradient(90deg,transparent,${t.c}06,transparent)`,pointerEvents:"none"}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:26,filter:`drop-shadow(0 0 ${Math.round(p*8)}px ${t.c})`}}>{t.icon}</span>
                <Badge label={t.status} color={t.c} size={7}/>
              </div>
              <div style={{fontWeight:800,fontSize:12,color:t.c,marginBottom:6,
                textShadow:`0 0 8px ${t.c}88`}}>{t.n}</div>
              <div style={{fontSize:10,color:Q.dim,lineHeight:1.55,marginBottom:12}}>{t.desc}</div>
              <button style={{width:"100%",padding:"8px",borderRadius:9,border:"none",cursor:"pointer",
                background:`${t.c}18`,border:`1px solid ${t.c}33`,
                color:t.c,fontSize:10,fontWeight:800}}>⚡ ACTIVATE</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── HYPER INTELLIGENCE ───────────────────────────────────────────────────────
function HyperIntelSection({tick}){
  const modes=[
    {n:"OMEGA MODE",   icon:"Ω",  c:Q.tauon,  desc:"Maximum intelligence. All 12 agents at 1000% capacity. Parallel universe simulation.",level:10},
    {n:"QUANTUM MIND", icon:"⚛️", c:Q.neutrino,desc:"Full quantum superposition thinking. 10,000 scenarios simultaneously evaluated.",level:9},
    {n:"DEEP GENESIS", icon:"🧬", c:Q.boson,  desc:"Recursive self-creation mode. Emma creates new sub-agents autonomously.",level:9},
    {n:"OMNISCIENT",   icon:"👁", c:Q.plasma, desc:"All data streams merged. Perfect market omniscience within HQMLL framework.",level:8},
    {n:"NEURAL STORM", icon:"⚡", c:Q.higgs,  desc:"Simultaneous training + inference. Real-time self-improvement during live trading.",level:8},
    {n:"CHAOS LORD",   icon:"🌀", c:Q.muon,   desc:"Master chaos theory engine. Turn market uncertainty into alpha.",level:7},
  ];
  const [activeMode,setActiveMode]=useState(null);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <HoloCard color={Q.boson} tick={tick} glow>
        <div style={{fontWeight:800,fontSize:12,color:Q.boson,letterSpacing:1,marginBottom:6}}>🧬 HYPER INTELLIGENCE SYSTEM</div>
        <div style={{fontSize:11,color:Q.mid,lineHeight:1.7,marginBottom:14}}>
          Beyond standard AI. HQMLL Layer 4 QUANTUM enables superposition-based parallel reasoning.
          12 agents operating at maximum capacity create emergent intelligence exceeding any single model.
          Krealogoik synthesis generates truly novel concepts. Patent pending. © Grigori Saks.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[
            {l:"Parallel Scenarios",v:"10,000/s",   c:Q.boson},
            {l:"IQ Equivalent",    v:"∞ (beyond)",  c:Q.tauon},
            {l:"Decision Speed",   v:"< 0.001ms",   c:Q.lepton},
            {l:"Memory Capacity",  v:"∞ (on-chain)",c:Q.gluon},
            {l:"Learning Rate",    v:"+3.2%/cycle",  c:Q.higgs},
            {l:"Novel Ideas/Day",  v:"47 patentable",c:Q.muon},
          ].map((s,i)=>(
            <div key={i} style={{padding:"10px",borderRadius:9,textAlign:"center",
              background:`${s.c}0a`,border:`1px solid ${s.c}22`}}>
              <div style={{fontSize:9,color:Q.dim}}>{s.l}</div>
              <div style={{fontSize:14,fontWeight:900,color:s.c,marginTop:4,
                textShadow:`0 0 8px ${s.c}88`}}>{s.v}</div>
            </div>
          ))}
        </div>
      </HoloCard>

      <div style={{fontWeight:800,fontSize:12,color:Q.boson,letterSpacing:1,marginBottom:8}}>
        🔮 INTELLIGENCE MODES
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {modes.map((m,i)=>{
          const active=activeMode===m.n;
          const p=.5+Math.sin(tick*.07+i*.6)*.35;
          return(
            <div key={i} onClick={()=>setActiveMode(active?null:m.n)} style={{
              padding:"16px",borderRadius:14,cursor:"pointer",
              background:active?`${m.c}22`:`${m.c}0a`,
              border:`2px solid ${m.c}${Math.round(active?.55:20+p*16).toString(16).padStart(2,"00")}`,
              boxShadow:active?`0 0 30px ${m.c}28`:`0 0 ${Math.round(p*14)}px ${m.c}0e`,
              transition:"all .2s",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:`${(-50+tick*1.4+i*12)%200}%`,width:"50%",height:"100%",
                background:`linear-gradient(90deg,transparent,${m.c}06,transparent)`,pointerEvents:"none"}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:24,filter:active?`drop-shadow(0 0 10px ${m.c})`:"none"}}>{m.icon}</span>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  {Array.from({length:m.level}).map((_,j)=>(
                    <div key={j} style={{width:4,height:4+(j*.5),borderRadius:1,background:m.c,
                      opacity:.4+j/10*.5}}/>
                  ))}
                </div>
              </div>
              <div style={{fontWeight:900,fontSize:13,color:m.c,marginBottom:5,
                textShadow:active?`0 0 12px ${m.c}88`:""}}>{m.n}</div>
              <div style={{fontSize:10,color:Q.dim,lineHeight:1.55}}>{m.desc}</div>
              {active&&(
                <div style={{marginTop:8,padding:"6px 10px",borderRadius:8,
                  background:`${m.c}14`,border:`1px solid ${m.c}33`,
                  fontSize:10,color:m.c,fontWeight:700}}>⚡ MODE ACTIVE — All agents reconfigured</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SUPER MEMORY TR2 ────────────────────────────────────────────────────────
function SuperMemorySection({tick}){
  const [entries,setEntries]=useState([
    {id:1,type:"DISCOVERY",title:"QEMMA Phase Logic",content:"GENESIS→METAMORPH I at 20M supply. Price correlation with supply milestones: +180%.",tags:["TOKEN","PHASE"],c:Q.higgs,ts:"2026-04-09 14:22"},
    {id:2,type:"PATTERN",  title:"BTC Pre-Halving Accumulation",content:"Whale wallets +12% in 30d before halving. QEMMA correlation 0.73. Entry signal: NOW.",tags:["BTC","PATTERN"],c:Q.lepton,ts:"2026-04-09 11:15"},
    {id:3,type:"INVENTION", title:"Krealogoik #286",content:"Proof-of-Intelligence consensus. Novel. Original: 94%. Viability: 89%. Patent filed.",tags:["KREALOGOIK","IP"],c:Q.muon,ts:"2026-04-09 09:41"},
    {id:4,type:"CODE",      title:"Gas Optimization v3",content:"Batch staking = -67% gas. Calldata compression = -42%. Deployed to testnet.",tags:["SOLIDITY","GAS"],c:Q.gluon,ts:"2026-04-08 22:00"},
    {id:5,type:"INSIGHT",   title:"DeFi Positioning",content:"QEMMA ONLY metamorphic token. First-mover confirmed. 18 months ahead. IP moat: strong.",tags:["DEFI","STRATEGY"],c:Q.neutrino,ts:"2026-04-08 18:30"},
  ]);
  const [newTitle,setNewTitle]=useState("");
  const [newContent,setNewContent]=useState("");
  const [newType,setNewType]=useState("INSIGHT");
  const addEntry=()=>{
    if(!newTitle.trim()||!newContent.trim())return;
    setEntries(e=>[{id:Date.now(),type:newType,title:newTitle,content:newContent,
      tags:[newType],c:Q.plasma,ts:new Date().toLocaleString("de-DE")
    },...e]);
    setNewTitle("");setNewContent("");
  };
  const typeColors={DISCOVERY:Q.higgs,PATTERN:Q.lepton,INVENTION:Q.muon,CODE:Q.gluon,INSIGHT:Q.neutrino};
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16,alignItems:"start"}}>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <HoloCard color={Q.quark} tick={tick} glow style={{padding:"14px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:800,fontSize:12,color:Q.quark,letterSpacing:1}}>🌀 SUPER MEMORY TR2 BANK</div>
            <div style={{fontSize:10,color:Q.dim}}>{entries.length} memories · v14.8</div>
          </div>
          {entries.map((e,i)=>{
            const c=typeColors[e.type]||Q.plasma;
            const p=.5+Math.sin(tick*.06+i*.5)*.3;
            return(
              <div key={e.id} style={{display:"flex",gap:12,padding:"12px 14px",borderRadius:11,
                marginBottom:8,background:`${c}08`,
                border:`1px solid ${c}${Math.round(18+p*14).toString(16).padStart(2,"00")}`,
                boxShadow:`0 0 ${Math.round(p*10)}px ${c}0a`}}>
                <div style={{width:38,height:38,borderRadius:9,flexShrink:0,background:`${c}18`,
                  border:`1px solid ${c}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:9,fontWeight:900,color:c,textAlign:"center",letterSpacing:.5}}>{e.type}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontWeight:800,fontSize:12,color:c,textShadow:`0 0 6px ${c}55`}}>{e.title}</span>
                    <span style={{fontSize:8,color:Q.dim}}>{e.ts}</span>
                  </div>
                  <div style={{fontSize:11,color:Q.mid,lineHeight:1.55,marginBottom:6}}>{e.content}</div>
                  <div style={{display:"flex",gap:5}}>
                    {e.tags.map((tag,j)=><Badge key={j} label={tag} color={c} size={7}/>)}
                  </div>
                </div>
              </div>
            );
          })}
        </HoloCard>
      </div>

      {/* Add memory */}
      <HoloCard color={Q.plasma} tick={tick} glow>
        <div style={{fontWeight:800,fontSize:11,color:Q.plasma,letterSpacing:1,marginBottom:12}}>➕ ADD MEMORY NODE</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
          {["INSIGHT","DISCOVERY","PATTERN","INVENTION","CODE"].map(t=>(
            <button key={t} onClick={()=>setNewType(t)} style={{
              padding:"4px 10px",borderRadius:16,border:"none",cursor:"pointer",fontSize:8,fontWeight:700,
              background:newType===t?`${typeColors[t]||Q.plasma}28`:"rgba(255,255,255,0.05)",
              color:newType===t?(typeColors[t]||Q.plasma):Q.dim}}>
              {t}
            </button>
          ))}
        </div>
        <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Memory title..."
          style={{width:"100%",padding:"9px 12px",borderRadius:9,background:"rgba(0,0,0,0.5)",
            border:`1px solid ${Q.plasma}33`,color:Q.bright,fontSize:12,
            boxSizing:"border-box",marginBottom:8}}/>
        <textarea value={newContent} onChange={e=>setNewContent(e.target.value)}
          placeholder="Memory content..."
          style={{width:"100%",padding:"9px 12px",borderRadius:9,background:"rgba(0,0,0,0.5)",
            border:`1px solid ${Q.plasma}28`,color:Q.bright,fontSize:11,height:100,
            resize:"none",boxSizing:"border-box",marginBottom:10}}/>
        <button onClick={addEntry} style={{width:"100%",padding:"11px",borderRadius:11,
          border:"none",cursor:"pointer",
          background:`linear-gradient(135deg,${Q.plasma}55,${Q.gluon}33)`,
          color:Q.bright,fontSize:12,fontWeight:900,letterSpacing:1}}>
          💾 SAVE TO MEMORY BANK
        </button>
        <div style={{marginTop:12,padding:"8px 10px",borderRadius:9,
          background:"rgba(0,0,0,0.3)",border:`1px solid ${Q.plasma}14`}}>
          <div style={{fontSize:9,color:Q.dim,lineHeight:1.7}}>
            Memory nodes stored in QEMMAMetaMemory.sol.<br/>
            Hashed with keccak256. Immutable on-chain.<br/>
            Version: <b style={{color:Q.plasma}}>v14.8</b> · Nodes: <b style={{color:Q.quark}}>9,482</b>
          </div>
        </div>
      </HoloCard>
    </div>
  );
}

// ─── CLOUD SPACE DRIVE ────────────────────────────────────────────────────────
function CloudSpaceSection({tick}){
  const files=[
    {n:"QEMMA_Whitepaper_v1.md",   size:"284KB",type:"DOC",  c:Q.gluon,   icon:"📄",date:"2026-04-09",tags:["PUBLIC"]},
    {n:"QEMMAToken.sol",           size:"48KB", type:"CODE", c:Q.lepton,  icon:"📜",date:"2026-04-09",tags:["AUDIT"]},
    {n:"HQMLL_Architecture.pdf",   size:"1.2MB",type:"DOC",  c:Q.neutrino,icon:"📚",date:"2026-04-08",tags:["PATENT"]},
    {n:"deploy_mainnet.js",        size:"12KB", type:"CODE", c:Q.higgs,   icon:"🚀",date:"2026-04-09",tags:["DEPLOY"]},
    {n:"MetaMemory_v14.8.json",    size:"4.2MB",type:"DATA", c:Q.plasma,  icon:"🧠",date:"2026-04-09",tags:["BACKUP"]},
    {n:"Krealogoik_Events.db",     size:"892KB",type:"DATA", c:Q.muon,    icon:"💡",date:"2026-04-09",tags:["SECRET"]},
    {n:"Android_App_v1.apk",       size:"48MB", type:"BUILD",c:Q.quark,   icon:"📱",date:"2026-04-08",tags:["BUILD"]},
    {n:"Smart_Contract_Audit.pdf", size:"2.1MB",type:"DOC",  c:Q.lepton,  icon:"🔒",date:"2026-04-07",tags:["SECURE"]},
    {n:"QEMMA_Tokenomics.xlsx",    size:"184KB",type:"DATA", c:Q.higgs,   icon:"📊",date:"2026-04-06",tags:["PUBLIC"]},
    {n:"Trading_Strategies_v47.py",size:"28KB", type:"CODE", c:Q.boson,   icon:"🤖",date:"2026-04-09",tags:["SECRET"]},
  ];
  const used=124, total=1024;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <HoloCard color={Q.gluon} tick={tick} glow>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontWeight:800,fontSize:12,color:Q.gluon,letterSpacing:1}}>☁️ QUANTUM CLOUD DRIVE</div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:16,fontWeight:900,color:Q.gluon,fontFamily:"monospace"}}>{used}GB / {total}GB</div>
            <div style={{fontSize:9,color:Q.dim,marginTop:2}}>IPFS + Encrypted Cloud</div>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:4}}>
            <span style={{color:Q.dim}}>Storage Used</span>
            <span style={{color:Q.gluon,fontWeight:700}}>{(used/total*100).toFixed(1)}%</span>
          </div>
          <Bar v={used/total*100} c={Q.gluon} h={6}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
          {[
            {l:"Files",       v:"1,284",    c:Q.gluon},
            {l:"Encrypted",   v:"100%",     c:Q.lepton},
            {l:"Backup Status",v:"✓ LIVE",  c:Q.lepton},
            {l:"IPFS Pinned", v:"48 files", c:Q.neutrino},
            {l:"Last Backup", v:"2m ago",   c:Q.higgs},
            {l:"Redundancy",  v:"3x",       c:Q.muon},
          ].map((s,i)=>(
            <div key={i} style={{padding:"9px",borderRadius:9,textAlign:"center",
              background:`${s.c}0a`,border:`1px solid ${s.c}18`}}>
              <div style={{fontSize:8,color:Q.dim}}>{s.l}</div>
              <div style={{fontSize:12,fontWeight:800,color:s.c,marginTop:3}}>{s.v}</div>
            </div>
          ))}
        </div>
        {/* Files */}
        <div style={{borderRadius:10,overflow:"hidden",border:`1px solid ${Q.plasma}18`}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 50px 60px 80px 80px",
            padding:"7px 12px",background:Q.bg1,fontSize:8,color:Q.dim,letterSpacing:1.2}}>
            <span>NAME</span><span>SIZE</span><span>TYPE</span><span>DATE</span><span>TAGS</span>
          </div>
          {files.map((f,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 50px 60px 80px 80px",
              padding:"9px 12px",alignItems:"center",
              background:i%2===0?"rgba(139,92,246,0.02)":"transparent",
              borderBottom:`1px solid rgba(255,255,255,0.03)`,cursor:"pointer"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:14}}>{f.icon}</span>
                <span style={{fontSize:11,color:f.c,fontWeight:600,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.n}</span>
              </div>
              <span style={{fontSize:9,color:Q.dim}}>{f.size}</span>
              <span style={{fontSize:9,color:Q.mid,fontWeight:700}}>{f.type}</span>
              <span style={{fontSize:9,color:Q.dim}}>{f.date}</span>
              <div style={{display:"flex",gap:3}}>
                {f.tags.map((t,j)=><Badge key={j} label={t} color={f.c} size={7}/>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button style={{flex:1,padding:"9px",borderRadius:9,border:`1px solid ${Q.gluon}33`,
            background:`${Q.gluon}12`,color:Q.gluon,fontSize:10,fontWeight:800,cursor:"pointer"}}>
            ⬆ UPLOAD FILE
          </button>
          <button style={{flex:1,padding:"9px",borderRadius:9,border:`1px solid ${Q.lepton}33`,
            background:`${Q.lepton}10`,color:Q.lepton,fontSize:10,fontWeight:800,cursor:"pointer"}}>
            🔒 ENCRYPT ALL
          </button>
          <button style={{flex:1,padding:"9px",borderRadius:9,border:`1px solid ${Q.muon}33`,
            background:`${Q.muon}10`,color:Q.muon,fontSize:10,fontWeight:800,cursor:"pointer"}}>
            🔄 BACKUP NOW
          </button>
        </div>
      </HoloCard>
    </div>
  );
}

// ─── QUANTUM CRYPTOGRAPHY ─────────────────────────────────────────────────────
function CryptographySection({tick}){
  const [input,setInput]=useState("");
  const [hashed,setHashed]=useState("");
  const hash=s=>{
    let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}
    return"0x"+Array.from({length:64},(_,i)=>((h*31+i*17+s.length*7)&0xff).toString(16).padStart(2,"0")).join("").slice(0,64);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <HoloCard color={Q.tauon} tick={tick} glow>
        <div style={{fontWeight:800,fontSize:12,color:Q.tauon,letterSpacing:1,marginBottom:14}}>🔐 QUANTUM CRYPTOGRAPHY ENGINE</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
          {[
            {l:"Standard",        v:"keccak256",    c:Q.lepton},
            {l:"Post-Quantum",     v:"Kyber-1024",   c:Q.neutrino},
            {l:"Key Strength",    v:"256-bit",      c:Q.higgs},
            {l:"Signatures",      v:"secp256k1",    c:Q.gluon},
            {l:"Encryption",      v:"AES-256-GCM",  c:Q.lepton},
            {l:"Zero-Knowledge",  v:"Groth16 ZK",   c:Q.plasma},
          ].map((s,i)=>(
            <div key={i} style={{padding:"10px",borderRadius:9,textAlign:"center",
              background:`${s.c}0a`,border:`1px solid ${s.c}22`}}>
              <div style={{fontSize:8,color:Q.dim}}>{s.l}</div>
              <div style={{fontSize:12,fontWeight:800,color:s.c,marginTop:4,fontFamily:"monospace"}}>{s.v}</div>
            </div>
          ))}
        </div>
        {/* Hash generator */}
        <div style={{padding:"14px",borderRadius:11,background:"rgba(0,0,0,0.35)",
          border:`1px solid ${Q.tauon}22`}}>
          <div style={{fontSize:10,fontWeight:800,color:Q.tauon,marginBottom:10}}>⚡ KECCAK256 / LIVE HASH GENERATOR</div>
          <input value={input} onChange={e=>{setInput(e.target.value);setHashed(hash(e.target.value));}}
            placeholder="Enter data to hash..."
            style={{width:"100%",padding:"9px 12px",borderRadius:9,
              background:"rgba(0,0,0,0.5)",border:`1px solid ${Q.tauon}33`,
              color:Q.bright,fontSize:12,boxSizing:"border-box",marginBottom:10}}/>
          {hashed&&(
            <div style={{padding:"10px",borderRadius:9,background:"rgba(0,0,0,0.4)",
              border:`1px solid ${Q.lepton}22`,fontFamily:"monospace",fontSize:10,
              color:Q.lepton,wordBreak:"break-all",lineHeight:1.6}}>
              {hashed}
            </div>
          )}
        </div>
        {/* ZK Proof info */}
        <div style={{marginTop:12,padding:"12px 14px",borderRadius:11,
          background:`${Q.plasma}0a`,border:`1px solid ${Q.plasma}22`}}>
          <div style={{fontSize:10,fontWeight:800,color:Q.plasma,marginBottom:6}}>🔮 ZERO-KNOWLEDGE PROOF SYSTEM</div>
          <div style={{fontSize:11,color:Q.mid,lineHeight:1.7}}>
            Quantum Emma uses Groth16 ZK-SNARKs for private transaction verification.
            Prove knowledge without revealing data. Bridge security: multi-sig + ZK =
            mathematically unbreakable. © Grigori Saks.
          </div>
        </div>
      </HoloCard>
    </div>
  );
}

// ─── GENIUS METAMODULE ────────────────────────────────────────────────────────
function GeniusMetamoduleSection({tick}){
  const [ideas,setIdeas]=useState([
    {id:1,title:"Recursive Proof-of-Intelligence",originality:96,viability:92,domain:"CONSENSUS",status:"PATENT_FILED",c:Q.gold},
    {id:2,title:"5D Holographic Market State",     originality:94,viability:88,domain:"MARKET",   status:"DEVELOPMENT", c:Q.neutrino},
    {id:3,title:"Self-Amending DAO Constitution",  originality:97,viability:81,domain:"GOVERNANCE",status:"PATENT_FILED",c:Q.muon},
    {id:4,title:"Zero-Waste Intelligent Mining",   originality:89,viability:94,domain:"MINING",   status:"IMPLEMENTED", c:Q.lepton},
    {id:5,title:"Neural Eigenvalue Arbitrage",     originality:91,viability:87,domain:"TRADING",  status:"TESTING",     c:Q.gluon},
    {id:6,title:"Metamorphic Living Asset Protocol",originality:99,viability:96,domain:"TOKEN",   status:"PRODUCTION",  c:Q.higgs},
  ]);
  const statusColors={PATENT_FILED:Q.higgs,DEVELOPMENT:Q.gluon,IMPLEMENTED:Q.lepton,TESTING:Q.muon,PRODUCTION:Q.lepton,CONCEPT:Q.plasma};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <HoloCard color={Q.gold} tick={tick} glow>
        <div style={{fontWeight:800,fontSize:12,color:Q.gold,letterSpacing:1,marginBottom:6}}>💎 GENIUS METAMODULE — RECURSIVE INVENTOR ENGINE</div>
        <div style={{fontSize:11,color:Q.mid,lineHeight:1.7,marginBottom:14}}>
          The Genius Metamodule combines Krealogoik + HQMLL + Recursive Loops to continuously
          generate patentable inventions. Each idea is scored for Originality (0–100) and
          Viability (0–100). Top ideas are automatically filed for patent protection.
          © Grigori Saks — Patent Pending.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {ideas.map((idea,i)=>{
            const p=.5+Math.sin(tick*.07+i*.6)*.35;
            const sc=statusColors[idea.status]||Q.mid;
            return(
              <div key={idea.id} style={{padding:"16px",borderRadius:13,
                background:`${idea.c}0a`,
                border:`1px solid ${idea.c}${Math.round(20+p*18).toString(16).padStart(2,"00")}`,
                boxShadow:`0 0 ${Math.round(p*16)}px ${idea.c}0e`,
                position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:`${(-50+tick*1.3+i*12)%200}%`,width:"50%",height:"100%",
                  background:`linear-gradient(90deg,transparent,${idea.c}06,transparent)`,pointerEvents:"none"}}/>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <Badge label={`#${idea.id}`} color={Q.dim} size={8}/>
                  <div style={{display:"flex",gap:5}}>
                    <Badge label={idea.domain} color={idea.c} size={7}/>
                    <Badge label={idea.status.replace("_"," ")} color={sc} size={7}/>
                  </div>
                </div>
                <div style={{fontWeight:800,fontSize:13,color:idea.c,marginBottom:10,
                  textShadow:`0 0 8px ${idea.c}66`}}>{idea.title}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[
                    {l:"Originality",v:idea.originality},
                    {l:"Viability",  v:idea.viability},
                  ].map((m,j)=>(
                    <div key={j}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,marginBottom:3}}>
                        <span style={{color:Q.dim}}>{m.l}</span>
                        <span style={{color:idea.c,fontWeight:700}}>{m.v}%</span>
                      </div>
                      <Bar v={m.v} c={idea.c} h={3}/>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </HoloCard>
    </div>
  );
}

// ─── ON-CHAIN ANALYTICS ──────────────────────────────────────────────────────
function OnChainSection({tick}){
  const block=847291+Math.floor(tick/22);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <HoloCard color={Q.gluon} tick={tick} glow>
        <div style={{fontWeight:800,fontSize:12,color:Q.gluon,letterSpacing:1,marginBottom:14}}>⛓ ON-CHAIN ANALYTICS — LIVE</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
          {[
            {l:"Block Number",   v:block.toLocaleString(),    c:Q.gluon},
            {l:"Gas Price",      v:"18.4 gwei",              c:Q.higgs},
            {l:"Transactions/s", v:"14.2",                    c:Q.lepton},
            {l:"Network TPS",    v:"~15",                     c:Q.neutrino},
            {l:"QEMMA Holders",  v:"7,281",                  c:Q.neutrino},
            {l:"Whale Wallets",  v:"284 (>100k Q)",           c:Q.muon},
            {l:"Smart Contracts",v:"7 Verified",              c:Q.lepton},
            {l:"ETH Block Time", v:"~12 sec",                c:Q.gluon},
          ].map((s,i)=>{
            const p=.5+Math.sin(tick*.07+i*.5)*.32;
            return(
              <div key={i} style={{padding:"12px",borderRadius:11,textAlign:"center",
                background:`${s.c}0a`,
                border:`1px solid ${s.c}${Math.round(16+p*14).toString(16).padStart(2,"00")}`}}>
                <div style={{fontSize:8,color:Q.dim,letterSpacing:1}}>{s.l}</div>
                <div style={{fontSize:14,fontWeight:900,color:s.c,marginTop:5,fontFamily:"monospace",
                  textShadow:`0 0 8px ${s.c}88`}}>{s.v}</div>
              </div>
            );
          })}
        </div>
        {/* Contract table */}
        <div style={{borderRadius:10,overflow:"hidden",border:`1px solid ${Q.gluon}22`}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 120px 60px 80px",
            padding:"8px 14px",background:Q.bg1,fontSize:8,color:Q.dim,letterSpacing:1.5,
            borderBottom:`1px solid ${Q.gluon}18`}}>
            <span>CONTRACT</span><span>ADDRESS</span><span>STATUS</span><span>LAST TX</span>
          </div>
          {[
            {n:"QEMMAToken.sol",    addr:"0x742d…12Ab",status:"VERIFIED",c:Q.neutrino,tx:"14s ago"},
            {n:"QEMMAMining.sol",   addr:"0x9f3a…88Dc",status:"VERIFIED",c:Q.lepton,  tx:"12s ago"},
            {n:"QEMMAStaking.sol",  addr:"0x5c1f…44Ae",status:"VERIFIED",c:Q.higgs,   tx:"24s ago"},
            {n:"QEMMAGovernance.sol",addr:"0x8b2d…71Ff",status:"VERIFIED",c:Q.gluon,  tx:"2m ago"},
            {n:"QEMMASwap.sol",     addr:"0x3e9a…22Cc",status:"VERIFIED",c:Q.plasma,  tx:"8m ago"},
            {n:"QEMMAMetaCodex.sol",addr:"0xb4f7…59Aa",status:"VERIFIED",c:Q.muon,    tx:"1h ago"},
            {n:"QEMMAMetaMemory.sol",addr:"0xc1d8…83Bb",status:"VERIFIED",c:Q.boson,  tx:"3h ago"},
          ].map((c,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 120px 60px 80px",
              padding:"9px 14px",fontSize:10,fontFamily:"monospace",
              background:i%2===0?"rgba(6,182,212,0.03)":"transparent",
              borderBottom:`1px solid rgba(255,255,255,0.03)`}}>
              <span style={{color:c.c,fontWeight:700}}>{c.n}</span>
              <span style={{color:Q.dim}}>{c.addr}</span>
              <span style={{color:Q.lepton,fontWeight:700,fontFamily:"sans-serif",fontSize:9}}>{c.status}</span>
              <span style={{color:Q.dim,fontFamily:"sans-serif",fontSize:9}}>{c.tx}</span>
            </div>
          ))}
        </div>
      </HoloCard>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function PlatformPage(){
  const tick=useTick(100);
  const [section,setSection]=useState("overview");

  const renderSection=()=>{
    switch(section){
      case "overview":      return <OverviewSection tick={tick}/>;
      case "tokenlaunch":   return <TokenLaunchSection tick={tick}/>;
      case "secrettools":   return <SecretToolsSection tick={tick}/>;
      case "hyperintel":    return <HyperIntelSection tick={tick}/>;
      case "supermemory":   return <SuperMemorySection tick={tick}/>;
      case "geniusmodule":  return <GeniusMetamoduleSection tick={tick}/>;
      case "cloudspace":    return <CloudSpaceSection tick={tick}/>;
      case "cryptography":  return <CryptographySection tick={tick}/>;
      case "onchain":       return <OnChainSection tick={tick}/>;
      case "whitepaper":    return <WhitepaperSection tick={tick}/>;
      case "smartcontracts":return <SmartContractSection tick={tick}/>;
      case "defi":          return <DeFiSection tick={tick}/>;
      case "exchange":      return <TokenLaunchSection tick={tick}/>;
      case "library":       return <LibrarySection tick={tick}/>;
      case "backup":        return <BackupSection tick={tick}/>;
      case "docs":          return <DocsSection tick={tick}/>;
      default:              return <OverviewSection tick={tick}/>;
    }
  };

  return(
    <div style={{minHeight:"100vh",background:Q.void,
      fontFamily:"'Inter',system-ui,sans-serif",color:Q.bright,
      display:"flex",overflow:"hidden",height:"100vh"}}>

      {/* Left nav */}
      <div style={{width:220,flexShrink:0,background:`${Q.bg1}f8`,
        borderRight:`1px solid ${Q.plasma}22`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Logo */}
        <div style={{padding:"16px 14px",borderBottom:`1px solid ${Q.plasma}18`,flexShrink:0,
          background:`linear-gradient(135deg,${Q.plasma}08,transparent)`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <QEMMACoin size={32} tick={tick}/>
            <div>
              <div style={{fontWeight:900,fontSize:12,color:Q.neutrino,letterSpacing:1}}>PLATFORM HUB</div>
              <div style={{fontSize:8,color:Q.plasma,marginTop:1,letterSpacing:1.5}}>v4.0 · ALL SYSTEMS</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{flex:1,overflowY:"auto",padding:"8px 6px",scrollbarWidth:"none"}}>
          {GROUPS.map(group=>(
            <div key={group} style={{marginBottom:6}}>
              <div style={{fontSize:7,fontWeight:800,color:Q.dim,letterSpacing:2,
                padding:"8px 8px 4px",opacity:.6}}>{group}</div>
              {SECTIONS.filter(s=>s.group===group).map(s=>(
                <button key={s.id} onClick={()=>setSection(s.id)} style={{
                  display:"flex",alignItems:"center",gap:9,width:"100%",
                  padding:"8px 10px",borderRadius:9,border:"none",cursor:"pointer",
                  marginBottom:2,textAlign:"left",
                  background:section===s.id?`${s.color}1e`:"transparent",
                  borderLeft:section===s.id?`2px solid ${s.color}`:"2px solid transparent",
                  color:section===s.id?s.color:Q.dim,
                  transition:"all .15s",
                }}>
                  <span style={{fontSize:14,flexShrink:0}}>{s.icon}</span>
                  <span style={{fontSize:10,fontWeight:section===s.id?700:400,
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={{padding:"10px 14px",borderTop:`1px solid ${Q.plasma}10`,flexShrink:0,
          fontSize:8,color:Q.dim,lineHeight:1.8}}>
          © 2026 Grigori Saks<br/>
          <span style={{color:Q.plasma}}>Patent Pending · Enterprise v4.0</span>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,overflowY:"auto",padding:"22px 24px",
        scrollbarWidth:"thin",scrollbarColor:`${Q.plasma}44 transparent`,
        backgroundImage:`radial-gradient(${Q.plasma}06 1px,transparent 1px)`,backgroundSize:"30px 30px"}}>
        {renderSection()}
        <div style={{height:30}}/>
      </div>
    </div>
  );
}

// ─── STUB SECTIONS ────────────────────────────────────────────────────────────
function WhitepaperSection({tick}){
  const sections=[
    {n:"1. Executive Summary",    icon:"📋",c:Q.gluon},
    {n:"2. Meta Genius TR2",      icon:"🧠",c:Q.neutrino},
    {n:"3. QEMMA Token",          icon:"🪙",c:Q.higgs},
    {n:"4. Tokenomics",           icon:"📊",c:Q.plasma},
    {n:"5. Smart Contracts",      icon:"📜",c:Q.lepton},
    {n:"6. DeFi Ecosystem",       icon:"🔄",c:Q.gluon},
    {n:"7. Roadmap 2026",         icon:"🗓",c:Q.muon},
    {n:"8. Team",                 icon:"👤",c:Q.boson},
    {n:"9. Legal & IP",           icon:"⚖️",c:Q.tauon},
    {n:"10. Conclusion",          icon:"🏁",c:Q.lepton},
  ];
  return(
    <HoloCard color={Q.gluon} tick={tick} glow>
      <div style={{fontWeight:800,fontSize:13,color:Q.gluon,letterSpacing:1,marginBottom:4}}>📄 WHITEPAPER v1.0</div>
      <div style={{fontSize:9,color:Q.dim,marginBottom:16}}>© 2026 Grigori Saks · All Rights Reserved · Patent Pending</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
        {sections.map((s,i)=>(
          <div key={i} style={{padding:"12px",borderRadius:10,textAlign:"center",
            background:`${s.c}0a`,border:`1px solid ${s.c}22`,cursor:"pointer"}}>
            <div style={{fontSize:20,marginBottom:5}}>{s.icon}</div>
            <div style={{fontSize:9,fontWeight:700,color:s.c,lineHeight:1.4}}>{s.n}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:16,padding:"14px 16px",borderRadius:11,
        background:"rgba(0,0,0,0.35)",border:`1px solid ${Q.plasma}18`,
        fontSize:11,color:Q.mid,lineHeight:1.8}}>
        <b style={{color:Q.neutrino}}>QUANTUM EMMA (QEMMA)</b> ist ein revolutionäres, selbst-evolvierendes KI-Trading-Ökosystem,
        das quantenmechanische Prinzipien mit dezentraler Blockchain-Technologie vereint.
        Basiert auf <b style={{color:Q.plasma}}>Meta Genius TR2</b> — 12-Agenten-Orchestrator mit
        <b style={{color:Q.gluon}}> HQMLL Framework</b> und proprietärer
        <b style={{color:Q.muon}}> Krealogoik Engine</b>. QEMMA ist ein
        <b style={{color:Q.higgs}}> Metamorphic Living Asset</b> das durch 4 Evolutionsphasen wächst.
        Max Supply: 100M · Current Phase: GENESIS · © 2026 Grigori Saks.
      </div>
    </HoloCard>
  );
}
function SmartContractSection({tick}){
  const contracts=[
    {n:"QEMMAToken.sol",       desc:"ERC-20 + Burnable + Permit + Pausable. Phase logic. Mining auth.",c:Q.neutrino,lines:"428"},
    {n:"QEMMAMining.sol",      desc:"4 mining pools. PoW validation. Halving mechanism. Block rewards.",c:Q.lepton,  lines:"312"},
    {n:"QEMMAStaking.sol",     desc:"5 tiers. Lock periods. Auto-compound. ReentrancyGuard.",         c:Q.higgs,   lines:"384"},
    {n:"QEMMAGovernance.sol",  desc:"DAO. Proposals. TimelockController. Treasury management.",        c:Q.gluon,   lines:"521"},
    {n:"QEMMASwap.sol",        desc:"Uniswap V3 router. QEMMA/ETH + QEMMA/USDT. Fee management.",    c:Q.plasma,  lines:"247"},
    {n:"QEMMAMetaCodex.sol",   desc:"AI agent state. Experiments. Research storage. HQMLL on-chain.", c:Q.muon,    lines:"389"},
    {n:"QEMMAMetaMemory.sol",  desc:"ThoughtNodes. keccak256 integrity. Krealogoik events. Version.",  c:Q.boson,   lines:"301"},
  ];
  return(
    <HoloCard color={Q.neutrino} tick={tick} glow>
      <div style={{fontWeight:800,fontSize:13,color:Q.neutrino,letterSpacing:1,marginBottom:14}}>📜 SMART CONTRACT SUITE — 7 AUDITED CONTRACTS</div>
      {contracts.map((c,i)=>(
        <div key={i} style={{display:"flex",gap:12,padding:"12px 14px",borderRadius:11,marginBottom:8,
          background:`${c.c}08`,border:`1px solid ${c.c}22`}}>
          <div style={{width:8,flexShrink:0,borderRadius:4,background:`${c.c}44`}}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontWeight:800,fontSize:12,color:c.c,fontFamily:"monospace"}}>{c.n}</span>
              <span style={{fontSize:9,color:Q.dim}}>{c.lines} lines</span>
            </div>
            <div style={{fontSize:10,color:Q.dim,lineHeight:1.5}}>{c.desc}</div>
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
            <Badge label="AUDITED" color={Q.lepton} size={8}/>
            <Badge label="VERIFIED" color={Q.gluon} size={8}/>
          </div>
        </div>
      ))}
      <div style={{marginTop:8,padding:"10px 14px",borderRadius:10,
        background:`${Q.lepton}08`,border:`1px solid ${Q.lepton}22`,
        display:"flex",justifyContent:"space-between",fontSize:11}}>
        <span style={{color:Q.lepton,fontWeight:700}}>✓ Audit Score: A+ · 0 Critical · 0 High</span>
        <span style={{color:Q.gluon,fontWeight:700}}>OpenZeppelin v5 · Solidity 0.8.24</span>
      </div>
    </HoloCard>
  );
}
function DeFiSection({tick}){
  return(
    <HoloCard color={Q.lepton} tick={tick} glow>
      <div style={{fontWeight:800,fontSize:13,color:Q.lepton,letterSpacing:1,marginBottom:14}}>🔄 DEFI ECOSYSTEM</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {[
          {n:"Uniswap V3",   desc:"QEMMA/ETH · $4.2M TVL · 42% APY",icon:"🦄",c:Q.lepton},
          {n:"Mining Pools", desc:"4 pools · 7,144 miners · 78 Q/block",icon:"⛏",c:Q.gluon},
          {n:"Staking Vault",desc:"5 tiers · 60% APY · $33M TVL",icon:"💎",c:Q.higgs},
          {n:"DAO Treasury", desc:"$10.03M · self-sustaining",icon:"🏦",c:Q.muon},
          {n:"NFT: Quantum Eye",desc:"10K collection · AI metadata",icon:"👁",c:Q.plasma},
          {n:"Cross-Chain",  desc:"BSC bridge · LayerZero ZK",icon:"🔗",c:Q.neutrino},
        ].map((s,i)=>(
          <div key={i} style={{padding:"14px",borderRadius:12,textAlign:"center",
            background:`${s.c}0a`,border:`1px solid ${s.c}28`}}>
            <div style={{fontSize:24,marginBottom:7}}>{s.icon}</div>
            <div style={{fontWeight:800,fontSize:12,color:s.c,marginBottom:4}}>{s.n}</div>
            <div style={{fontSize:10,color:Q.dim,lineHeight:1.5}}>{s.desc}</div>
          </div>
        ))}
      </div>
    </HoloCard>
  );
}
function LibrarySection({tick}){
  const topics=["Smart Contracts","DeFi Protocols","HQMLL Architecture","Krealogoik Theory",
    "Quantum Mechanics","Market Analysis","Gas Optimization","ZK Proofs","DAO Governance","NFT Standards"];
  return(
    <HoloCard color={Q.muon} tick={tick} glow>
      <div style={{fontWeight:800,fontSize:13,color:Q.muon,letterSpacing:1,marginBottom:14}}>📚 KNOWLEDGE LIBRARY — 1,284 DOCUMENTS</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {topics.map((t,i)=>(<button key={i} style={{padding:"6px 14px",borderRadius:20,
          border:`1px solid ${Q.muon}33`,background:`${Q.muon}10`,
          color:Q.muon,fontSize:10,fontWeight:700,cursor:"pointer"}}>{t}</button>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[
          {n:"HQMLL Complete Guide",        pages:284,c:Q.neutrino},
          {n:"Smart Contract Patterns",     pages:192,c:Q.lepton},
          {n:"Quantum Trading Handbook",    pages:420,c:Q.gluon},
          {n:"DeFi Protocol Analysis",      pages:156,c:Q.higgs},
          {n:"Krealogoik Theory v1.0",      pages:88, c:Q.muon},
          {n:"QEMMA Technical Specs",       pages:312,c:Q.plasma},
        ].map((b,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"11px 14px",borderRadius:10,
            background:`${b.c}0a`,border:`1px solid ${b.c}22`,cursor:"pointer"}}>
            <span style={{fontSize:20}}>📖</span>
            <div><div style={{fontWeight:700,fontSize:11,color:b.c}}>{b.n}</div>
            <div style={{fontSize:9,color:Q.dim,marginTop:2}}>{b.pages} pages · PDF · Encrypted</div></div>
          </div>
        ))}
      </div>
    </HoloCard>
  );
}
function BackupSection({tick}){
  return(
    <HoloCard color={Q.lepton} tick={tick} glow>
      <div style={{fontWeight:800,fontSize:13,color:Q.lepton,letterSpacing:1,marginBottom:14}}>🔒 BACKUP & SECURITY SYSTEM</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[
          {n:"Cloud Backup",    v:"✓ LIVE",  icon:"☁️",c:Q.lepton,  desc:"Auto-backup every 5min · 3x redundancy"},
          {n:"IPFS Storage",    v:"48 files",icon:"🔗",c:Q.gluon,   desc:"Immutable decentralized storage"},
          {n:"Encrypted Keys",  v:"AES-256", icon:"🔐",c:Q.tauon,   desc:"Hardware-level key encryption"},
          {n:"Smart Contract",  v:"Immutable",icon:"📜",c:Q.neutrino,desc:"On-chain immutability guarantee"},
          {n:"Multisig Wallet", v:"3-of-5",  icon:"🔑",c:Q.higgs,   desc:"No single point of failure"},
          {n:"Recovery Phrase", v:"24 words", icon:"📝",c:Q.plasma,  desc:"BIP-39 standard · Hardware wallet"},
        ].map((s,i)=>(
          <div key={i} style={{padding:"14px",borderRadius:12,
            background:`${s.c}0a`,border:`1px solid ${s.c}22`}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:22}}>{s.icon}</span>
              <div>
                <div style={{fontWeight:800,fontSize:12,color:s.c}}>{s.n}</div>
                <div style={{fontSize:11,fontWeight:700,color:s.c,marginTop:2}}>{s.v}</div>
              </div>
            </div>
            <div style={{fontSize:10,color:Q.dim}}>{s.desc}</div>
          </div>
        ))}
      </div>
    </HoloCard>
  );
}
function DocsSection({tick}){
  return(
    <HoloCard color={Q.mid} tick={tick}>
      <div style={{fontWeight:800,fontSize:13,color:Q.mid,letterSpacing:1,marginBottom:14}}>📋 DOCUMENTATION DATABASE</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[
          {n:"API Reference",    icon:"⚡",c:Q.gluon,  desc:"Full REST + WS API docs. 284 endpoints."},
          {n:"Smart Contract ABI",icon:"📜",c:Q.neutrino,desc:"All 7 contract ABIs. TypeChain types."},
          {n:"HQMLL Spec v2.1",  icon:"🧠",c:Q.plasma, desc:"7-layer architecture. Weight formats."},
          {n:"Deploy Guide",     icon:"🚀",c:Q.lepton,  desc:"Mainnet checklist. Gas estimates."},
          {n:"Security Audit",   icon:"🔒",c:Q.tauon,   desc:"Full audit report. Remediation log."},
          {n:"Agent Protocols",  icon:"🤖",c:Q.higgs,   desc:"12-agent message formats. Orchestration."},
        ].map((d,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"12px 14px",borderRadius:11,
            background:`${d.c}08`,border:`1px solid ${d.c}22`,cursor:"pointer"}}>
            <span style={{fontSize:22,flexShrink:0}}>{d.icon}</span>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:d.c}}>{d.n}</div>
              <div style={{fontSize:10,color:Q.dim,marginTop:2}}>{d.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </HoloCard>
  );
}
