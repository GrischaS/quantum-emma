// ============================================================
//  QUANTUM EMMA — Deep Research Engine v3.0
//  8 Domains · 12 AI Agents · HQMLL · 4D/5D Holographic
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef } from "react";

const Q = {
  void:"#000008", bg0:"#030012", bg1:"#06001e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};
function useTick(ms=120){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[]);return t;}
function Bar({v,c,h=4}){return<div style={{height:h,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden"}}><div style={{height:h,width:`${Math.min(v,100)}%`,background:c,borderRadius:2,transition:"width .5s",boxShadow:`0 0 6px ${c}55`}}/></div>;}
function Badge({label,color,size=9}){return<span style={{padding:"2px 9px",borderRadius:20,fontSize:size,fontWeight:800,letterSpacing:1,color,background:`${color}18`,border:`1px solid ${color}33`}}>{label}</span>;}
function HoloCard({children,color=Q.plasma,style={},tick=0,glow=false}){
  const p=.5+Math.sin(tick*.07)*.28;
  return<div style={{borderRadius:16,padding:"18px 20px",background:`linear-gradient(135deg,${color}12,${color}06,transparent)`,border:`1px solid ${color}${Math.round((p*.22+.08)*255).toString(16).padStart(2,"00")}`,boxShadow:glow?`0 0 ${Math.round(18+p*14)}px ${color}1a,inset 0 0 30px ${color}06`:"",...style,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:`${(-50+tick*1.3)%200}%`,width:"50%",height:"100%",background:`linear-gradient(90deg,transparent,${color}05,transparent)`,pointerEvents:"none"}}/>
    {children}
  </div>;
}

// ─── EYE ICON ────────────────────────────────────────────────────────────────
function MiniEye({size=24,tick,color=Q.neutrino}){
  const t=tick*.03,rot=(tick*.8)%360;
  return(
    <svg width={size} height={size} viewBox="0 0 100 100" style={{filter:`drop-shadow(0 0 5px ${color})`,flexShrink:0}}>
      <defs><radialGradient id={`mye${size}`} cx="42%" cy="38%">
        <stop offset="0%" stopColor="#c4b5fd"/><stop offset="50%" stopColor={color}/><stop offset="100%" stopColor="#3b0764"/>
      </radialGradient></defs>
      <circle cx="50" cy="50" r="48" fill={`url(#mye${size})`}/>
      <g transform={`rotate(${rot},50,50)`}><ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity=".5" strokeDasharray="4 6"/></g>
      <circle cx={50+Math.cos(t)*4} cy={50+Math.sin(t)*4} r="11" fill="#000" fillOpacity=".72"/>
      <circle cx={50+Math.cos(t)*4+3} cy={50+Math.sin(t)*4-3} r="4" fill="#fff" fillOpacity=".5"/>
      <text x="50" y="57" textAnchor="middle" fontSize="20" fontWeight="900" fontFamily="Arial Black" fill="#fff" fillOpacity=".9">Q</text>
    </svg>
  );
}

// ─── DOMAIN REGISTRY ─────────────────────────────────────────────────────────
const DOMAINS=[
  {id:"market",     label:"Market Analysis",   icon:"📈",color:Q.lepton,  agent:"ETA-P",      sources:847, depth:12,confidence:94,time:"2h 14m"},
  {id:"defi",       label:"DeFi & Protocols",  icon:"🔄",color:Q.gluon,   agent:"THETA-D",    sources:621, depth:9, confidence:91,time:"3h 42m"},
  {id:"quantum",    label:"Quantum Mechanics",  icon:"⚛️",color:Q.neutrino,agent:"ALPHA-Q",    sources:412, depth:12,confidence:87,time:"4h 18m"},
  {id:"ai",         label:"AI & ML Research",   icon:"🧠",color:Q.higgs,   agent:"META-TR2",   sources:1247,depth:12,confidence:98,time:"1h 02m"},
  {id:"blockchain", label:"Blockchain Tech",    icon:"⛓", color:Q.muon,    agent:"IOTA-V",     sources:384, depth:8, confidence:89,time:"2h 55m"},
  {id:"macro",      label:"Macro Economics",    icon:"🌍",color:Q.boson,   agent:"EPSILON-S",  sources:528, depth:7, confidence:82,time:"5h 11m"},
  {id:"nft",        label:"NFT & Web3",         icon:"🖼", color:Q.quark,   agent:"ZETA-M",     sources:284, depth:6, confidence:85,time:"1h 48m"},
  {id:"security",   label:"Security & Audits",  icon:"🔒",color:"#34d399", agent:"DELTA-H",    sources:156, depth:11,confidence:97,time:"6h 33m"},
];

const FINDINGS={
  market:[
    {h:"BTC Halving Cycle Analysis",       body:"Post-halving avg rally: +340% in 12M. Q2 2026 = accumulation phase. QEMMA/BTC corr: r=0.73."},
    {h:"QEMMA Phase Transition Signal",    body:"Supply: 15.2M/20M (76%). METAMORPH I triggers at 20M. Phase transitions historically → +180% price."},
    {h:"Multi-Timeframe Technical Analysis",body:"Bullish divergence 4H RSI. EMA20 > EMA50. Cup-and-handle on Daily. QEMMA target: $0.84."},
    {h:"Volume Profile",                   body:"Whale wallets >100k QEMMA: +12% in 30d. Retail selling absorbed. Accumulation zone: $0.58–0.62."},
  ],
  defi:[
    {h:"Uniswap V3 Concentrated Liquidity",body:"3.2x capital efficiency vs V2. QEMMA/ETH optimal range: $0.55–$0.75. Pool TVL: $4.2M."},
    {h:"Yield Comparison",                 body:"QUANTUM tier (60% APY) = #3 globally sustainable yield. Backed by real mining revenue — no inflation."},
    {h:"Cross-Protocol Arbitrage",         body:"Spread QEMMA/ETH vs QEMMA/USDT: 0.8–1.2%. THETA-D executing auto-arbitrage."},
    {h:"TVL Forecast Q3 2026",             body:"TVL projection: $24M (+240%). Driven by staking expansion and liquidity mining incentives."},
  ],
  quantum:[
    {h:"Superposition Trading Model",      body:"Market as quantum probability field. Wavefunction collapse at decision events. False signal reduction: 34%."},
    {h:"BTC/QEMMA Entanglement",           body:"Non-classical correlation detected. Entanglement coeff: 0.73. Info transfer faster than classical channels."},
    {h:"HQMLL Layer 4 QUANTUM",            body:"Loss 0.011 — best in architecture. Superposition weights outperform classical init by 28%."},
    {h:"5D Market State Vector",           body:"Eigenstates: Accumulation 42%, Consolidation 38%, Breakout-Pending 20%. Signal: POSITIVE."},
  ],
  ai:[
    {h:"HQMLL Architecture Breakthrough",  body:"7-layer achieves SOTA. Layer 5 recursive self-reference → emergent reasoning beyond transformers."},
    {h:"Krealogoik Validation",            body:"286 events. Originality avg: 92.1%. Viability avg: 87.4%. 3 patents filed. Rate: +4.2%/cycle."},
    {h:"12-Agent Convergence",             body:"98.3% efficiency when synchronized. LAMBDA-O latency reduction: 67%. META-TR2 #48,201 = peak."},
    {h:"Self-Improvement Rate",            body:"+3.2% per recursive cycle. Max theoretical: 99.7% in 14 more cycles. Current: 98.3%."},
  ],
  blockchain:[
    {h:"Ethereum L2 Growth",               body:"L2 TVL > L1 for first time March 2026. QEMMA L2 expansion recommended Q3 2026."},
    {h:"Smart Contract Security",          body:"0 exploits since deployment. Gas -67% vs initial. OpenZeppelin v5. Audit: A+."},
    {h:"Competitor Analysis",             body:"0 metamorphic token protocols in production. QEMMA first-mover. Closest competitor: 18M behind."},
    {h:"Cross-Chain Bridge",              body:"Multisig + ZK bridges: 0 hacks in 24M. LayerZero recommended for QEMMA expansion."},
  ],
  macro:[
    {h:"Fed Rate Policy",                  body:"2 cuts Q3/Q4 2026 (60% prob). Historical: rate cuts → crypto bull run within 90 days."},
    {h:"Institutional Adoption",           body:"BTC/ETH institutional holdings +34% YoY. ETF inflows: $2.8B Q1 2026. Market maturing."},
    {h:"Regulatory Clarity",               body:"EU MiCA complete. US framework Q3 2026. Clarity historically → +25% in 6 months."},
    {h:"QEMMA Macro Beta",                 body:"Beta vs BTC: 2.4x. Risk-on environment = optimal. Expected alpha in bull: +180%."},
  ],
  nft:[
    {h:"Utility NFT Outperformance",       body:"Utility NFTs 3:1 over art NFTs in 2026. Quantum Eye: AI metadata + governance + staking boost."},
    {h:"Dynamic Metadata Pioneer",         body:"<0.1% of NFT market has AI-powered dynamic metadata. QEMMA first-mover. Premium: 4–8x."},
    {h:"Web3 Integration Q2 2026",         body:"NFT staking boost (+5% APY), NFT-gated proposals, NFT→mining hashrate bonuses."},
    {h:"Floor Price Projection",           body:"Comparable utility collections: $2.50–$4.20 ETH floor in 12M post-mainnet."},
  ],
  security:[
    {h:"Smart Contract Audit",             body:"7 contracts: Critical 0, High 0, Medium 2 (patched), Low 7 (5 patched). Score: A+."},
    {h:"Governance Attack Vectors",        body:"Flash loan attacks mitigated by 7-day voting lock. Top 10 wallets: 31% — acceptable phase 1."},
    {h:"HQMLL Data Integrity",             body:"keccak256 hash on all ThoughtNodes. DELTA-H verification: 99.97% integrity."},
    {h:"Key Management",                   body:"Multisig 3-of-5 recommended mainnet. Ledger integration verified. Emergency pause tested."},
  ],
};

const PREDICTIONS={
  market:"STRONG BUY — 72h targets: BTC $73,200 / QEMMA $0.71. Confidence: 94%.",
  defi:"ACCUMULATE QEMMA — DeFi integration expanding. TVL +240% forecast.",
  quantum:"QUANTUM SIGNAL: 5D analysis → upward momentum. Entry: current levels.",
  ai:"META-TR2 PEAK PERFORMANCE — System operating at 98.3%. No intervention needed.",
  blockchain:"HOLD — QEMMA first-mover confirmed. 0 competitors in production.",
  macro:"BULLISH MACRO — Rate cuts + institutional adoption = ideal for QEMMA.",
  nft:"BUY Quantum Eye NFTs — AI utility + rarity = long-term value.",
  security:"SECURE — Mainnet ready after multisig setup. A+ audit confirmed.",
};

const RISK_COLORS={LOW:Q.lepton,MEDIUM:Q.higgs,"MEDIUM-HIGH":Q.muon,HIGH:Q.tauon};
const RISKS={market:"MEDIUM",defi:"LOW",quantum:"MEDIUM",ai:"LOW",blockchain:"LOW",macro:"MEDIUM",nft:"MEDIUM-HIGH",security:"LOW"};

// ─── RESEARCH RUNNER ─────────────────────────────────────────────────────────
function ResearchRunner({domain,onComplete}){
  const [phase,setPhase]=useState(0);
  const [progress,setProgress]=useState(0);
  const d=DOMAINS.find(x=>x.id===domain);
  const phases=["Initializing agent...","Connecting data sources...","HQMLL deep scan...","Quantum layer analysis...","Krealogoik synthesis...","Generating report...","Complete ✓"];
  useEffect(()=>{
    let p=0;
    const iv=setInterval(()=>{
      p+=1.6;setProgress(Math.min(p,100));setPhase(Math.floor((p/100)*(phases.length-1)));
      if(p>=100){clearInterval(iv);setTimeout(onComplete,400);}
    },55);
    return()=>clearInterval(iv);
  },[]);
  return(
    <div style={{padding:"48px 32px",textAlign:"center",borderRadius:16,
      background:`${d.color}08`,border:`1px solid ${d.color}28`}}>
      <div style={{fontSize:56,marginBottom:18,filter:`drop-shadow(0 0 20px ${d.color})`}}>{d.icon}</div>
      <div style={{fontWeight:900,fontSize:18,color:d.color,marginBottom:8}}>
        {d.agent} — Deep Research Running
      </div>
      <div style={{fontSize:13,color:Q.mid,marginBottom:24}}>{phases[phase]}</div>
      <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden",marginBottom:10,maxWidth:400,margin:"0 auto 10px"}}>
        <div style={{height:8,width:`${progress}%`,borderRadius:4,
          background:`linear-gradient(90deg,${d.color}88,${d.color})`,
          boxShadow:`0 0 14px ${d.color}77`,transition:"width .1s"}}/>
      </div>
      <div style={{fontSize:11,color:Q.dim}}>{progress.toFixed(0)}% · {d.sources} sources · Depth L{d.depth}</div>
    </div>
  );
}

// ─── REPORT VIEWER ────────────────────────────────────────────────────────────
function ReportViewer({domain,tick}){
  const d=DOMAINS.find(x=>x.id===domain);
  const findings=FINDINGS[domain]||[];
  const prediction=PREDICTIONS[domain]||"";
  const risk=RISKS[domain]||"MEDIUM";
  const rc=RISK_COLORS[risk]||Q.mid;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Header */}
      <div style={{padding:"20px 24px",borderRadius:14,
        background:`${d.color}0e`,border:`1px solid ${d.color}33`,
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:`${(-50+tick*1.2)%200}%`,width:"50%",height:"100%",
          background:`linear-gradient(90deg,transparent,${d.color}07,transparent)`,pointerEvents:"none"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:22,filter:`drop-shadow(0 0 8px ${d.color})`}}>{d.icon}</span>
              <span style={{fontWeight:900,fontSize:16,color:d.color,
                textShadow:`0 0 12px ${d.color}88`}}>{d.label} Report</span>
            </div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              <Badge label={`Agent: ${d.agent}`}  color={d.color}/>
              <Badge label={`${d.sources} Sources`} color={Q.gluon}/>
              <Badge label={`Depth L${d.depth}`}  color={Q.plasma}/>
              <Badge label={`${d.confidence}% Confidence`} color={Q.lepton}/>
              <Badge label={`Risk: ${risk}`}       color={rc}/>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:Q.dim}}>Analysis Time</div>
            <div style={{fontSize:18,fontWeight:900,color:d.color,marginTop:3}}>{d.time}</div>
          </div>
        </div>
        <div style={{marginBottom:4,display:"flex",justifyContent:"space-between",fontSize:10}}>
          <span style={{color:Q.dim}}>Confidence Level</span>
          <span style={{color:Q.lepton,fontWeight:700}}>{d.confidence}%</span>
        </div>
        <Bar v={d.confidence} c={Q.lepton} h={6}/>
      </div>

      {/* Findings */}
      {findings.map((f,i)=>(
        <div key={i} style={{padding:"16px 18px",borderRadius:13,
          background:"rgba(0,0,0,0.3)",border:`1px solid ${d.color}18`}}>
          <div style={{fontWeight:800,fontSize:13,color:d.color,marginBottom:7,
            textShadow:`0 0 8px ${d.color}55`}}>{i+1}. {f.h}</div>
          <div style={{fontSize:12,color:Q.mid,lineHeight:1.75}}>{f.body}</div>
        </div>
      ))}

      {/* Prediction */}
      <div style={{padding:"18px 20px",borderRadius:14,
        background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.3)"}}>
        <div style={{fontSize:10,color:Q.dim,letterSpacing:1,marginBottom:6}}>{d.agent} FINAL PREDICTION</div>
        <div style={{fontSize:15,fontWeight:900,color:Q.lepton,textShadow:`0 0 10px ${Q.lepton}88`}}>
          {prediction}
        </div>
      </div>
    </div>
  );
}

// ─── ORACLE CHAT ─────────────────────────────────────────────────────────────
function OracleChat({tick}){
  const [msgs,setMsgs]=useState([
    {r:"emma",t:"🔮 Quantum Emma Research Oracle online. META-TR2 aktiv. Alle 12 Agenten bereit. Was soll ich für Sie analysieren, Grigori?"},
  ]);
  const [input,setInput]=useState("");
  const [typing,setTyping]=useState(false);
  const endRef=useRef();
  const responses=[
    "ETA-P Deep Scan: BTC Halving Cycle aktiv. Post-Halving avg +340%. QEMMA Korrelation: 0.73. Signal: AKKUMULIEREN bei $0.61–$0.63. Target: $0.84.",
    "THETA-D DeFi Analyse: Uniswap V3 QEMMA/ETH Pool TVL: $4.2M. APY Fees: 42%. Optimal Range $0.55–$0.75. Slippage: minimal. Pool: GESUND.",
    "ALPHA-Q Quantum Scan: 5D Marktvektor berechnet. Akkumulation 42%, Konsolidierung 38%, Ausbruch-Pending 20%. Signal: POSITIV.",
    "META-TR2 Recursive Loop #48,202: Effizienz 98.3%. Krealogoik Event #287 generiert: 'Quantum Proof-of-Originality' — Patent-würdig!",
    "EPSILON-S Macro: Fed Rate Cuts Q3 2026: 60% Wahrscheinlichkeit. Historisch: → Crypto Bullrun in 90 Tagen. QEMMA Beta: 2.4x BTC.",
    "DELTA-H Security: Alle 7 Smart Contracts — Score A+. 0 Critical Vulnerabilities. Gas -67% optimiert. Mainnet: FREIGEGEBEN.",
    "IOTA-V Blockchain: 0 Metamorphic Token Konkurrenten in Production. First-Mover BESTÄTIGT. Patent-Moat: STARK. 18 Monate voraus.",
    "ZETA-M NFT Scan: Quantum Eye = Top 5% Utility NFTs. AI-Metadaten = einzigartig global. Floor-Projektion: $2.50–$4.20 ETH (12M).",
  ];
  const send=()=>{
    if(!input.trim())return;
    const msg=input.trim(); setInput(""); setTyping(true);
    const now=new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});
    setMsgs(m=>[...m,{r:"user",t:msg,time:now}]);
    setTimeout(()=>{
      const res=responses[Math.floor(Math.random()*responses.length)];
      setMsgs(m=>[...m,{r:"emma",t:res,time:now,conf:Math.round(65+Math.random()*33)}]);
      setTyping(false);
    },1400+Math.random()*900);
  };
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs,typing]);

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",minHeight:460}}>
      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,
        padding:"14px",background:"rgba(0,0,0,0.35)",borderRadius:"12px 12px 0 0",
        border:`1px solid ${Q.plasma}22`,scrollbarWidth:"thin",
        scrollbarColor:`${Q.plasma}44 transparent`}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",gap:9,justifyContent:m.r==="user"?"flex-end":"flex-start"}}>
            {m.r==="emma"&&(
              <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,
                background:`${Q.plasma}22`,border:`1px solid ${Q.plasma}44`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>👁</div>
            )}
            <div style={{maxWidth:"80%"}}>
              <div style={{padding:"11px 15px",borderRadius:m.r==="user"?"16px 16px 4px 16px":"4px 16px 16px 16px",
                background:m.r==="emma"?`${Q.plasma}14`:"rgba(124,58,237,0.38)",
                border:`1px solid ${m.r==="emma"?"rgba(139,92,246,0.28)":"rgba(124,58,237,0.5)"}`,
                fontSize:12,color:Q.bright,lineHeight:1.7}}>
                {m.t}
              </div>
              {m.r==="emma"&&m.conf&&(
                <div style={{display:"flex",gap:7,marginTop:5,alignItems:"center"}}>
                  <div style={{fontSize:9,color:Q.dim}}>Confidence:</div>
                  <div style={{height:3,width:50,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
                    <div style={{height:3,width:`${m.conf}%`,background:Q.neutrino,borderRadius:2}}/>
                  </div>
                  <div style={{fontSize:9,color:Q.neutrino,fontWeight:700}}>{m.conf}%</div>
                </div>
              )}
              {m.time&&<div style={{fontSize:8,color:Q.dim,marginTop:4}}>{m.time}</div>}
            </div>
          </div>
        ))}
        {typing&&(
          <div style={{display:"flex",gap:9,alignItems:"center"}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:`${Q.plasma}22`,
              border:`1px solid ${Q.plasma}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>👁</div>
            <div style={{display:"flex",gap:5,padding:"12px 16px",background:`${Q.plasma}10`,
              borderRadius:"4px 16px 16px 16px",border:`1px solid ${Q.plasma}22`}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{width:7,height:7,borderRadius:"50%",background:Q.neutrino,
                  opacity:.3+i*.25}}/>
              ))}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      {/* Input */}
      <div style={{display:"flex",gap:8,padding:"10px",
        background:`${Q.plasma}08`,borderRadius:"0 0 12px 12px",
        border:`1px solid ${Q.plasma}18`,borderTop:"none"}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask Research Oracle anything..."
          style={{flex:1,padding:"9px 14px",borderRadius:20,
            background:"rgba(0,0,0,0.4)",border:`1px solid ${Q.plasma}33`,
            color:Q.bright,fontSize:12,outline:"none"}}/>
        <button onClick={send} style={{padding:"9px 18px",borderRadius:20,border:"none",
          cursor:"pointer",
          background:`linear-gradient(135deg,${Q.plasma}66,${Q.gluon}44)`,
          color:Q.bright,fontWeight:900,fontSize:13,
          boxShadow:`0 4px 12px ${Q.plasma}33`}}>⚛️</button>
      </div>
    </div>
  );
}

// ─── LIVE SIGNALS PANEL ───────────────────────────────────────────────────────
function LiveSignals({tick}){
  const signals=[
    {asset:"QEMMA",sig:"STRONG BUY",conf:88.4,t:"14d",dir:"up",  c:Q.neutrino,agent:"ETA-P"},
    {asset:"BTC",  sig:"BUY",       conf:73.2,t:"72h",dir:"up",  c:Q.higgs,   agent:"ETA-P"},
    {asset:"ETH",  sig:"HOLD",      conf:68.1,t:"7d", dir:"up",  c:Q.gluon,   agent:"THETA-D"},
    {asset:"SOL",  sig:"BUY",       conf:61.8,t:"3d", dir:"up",  c:"#9945ff", agent:"EPSILON-S"},
    {asset:"MATIC",sig:"SELL",      conf:71.2,t:"5d", dir:"down",c:Q.plasma,  agent:"ETA-P"},
    {asset:"DeFi", sig:"ACCUMULATE",conf:84.1,t:"30d",dir:"up",  c:Q.lepton,  agent:"THETA-D"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{fontWeight:800,fontSize:11,color:Q.higgs,letterSpacing:1,marginBottom:4}}>
        🔮 LIVE AI SIGNALS
      </div>
      {signals.map((s,i)=>{
        const p=.6+Math.sin(tick*.07+i*.8)*.3;
        return(
          <div key={i} style={{padding:"12px 14px",borderRadius:12,
            background:`${s.c}0c`,
            border:`1px solid ${s.c}${Math.round(20+p*16).toString(16).padStart(2,"00")}`,
            boxShadow:`0 0 ${Math.round(p*12)}px ${s.c}0e`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <span style={{fontWeight:900,fontSize:14,color:s.c,
                  textShadow:`0 0 8px ${s.c}88`}}>{s.asset}</span>
                <span style={{fontSize:8,color:Q.dim}}>{s.agent}</span>
              </div>
              <span style={{fontWeight:900,fontSize:11,
                color:s.dir==="up"?Q.lepton:Q.tauon}}>
                {s.dir==="up"?"▲":"▼"} {s.sig}
              </span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:5}}>
              <span style={{color:Q.dim}}>Timeframe: {s.t}</span>
              <span style={{color:s.c,fontWeight:700}}>{s.conf}%</span>
            </div>
            <Bar v={s.conf} c={s.c} h={3}/>
          </div>
        );
      })}
      {/* Sentiment */}
      <div style={{padding:"12px 14px",borderRadius:12,marginTop:4,
        background:`${Q.lepton}08`,border:`1px solid ${Q.lepton}25`}}>
        <div style={{fontSize:10,fontWeight:800,color:Q.lepton,marginBottom:8}}>⚡ MARKET SENTIMENT</div>
        {[
          {l:"Fear & Greed",  v:"72 — GREED",     c:Q.higgs},
          {l:"QEMMA Signal",  v:"STRONG BUY",     c:Q.lepton},
          {l:"BTC Dominance", v:"52.4%",           c:Q.higgs},
          {l:"Market Phase",  v:"ACCUMULATION",   c:Q.lepton},
          {l:"Volatility",    v:"MEDIUM",          c:Q.mid},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",
            fontSize:10,padding:"3px 0",
            borderBottom:i<4?`1px solid rgba(255,255,255,0.04)`:"none"}}>
            <span style={{color:Q.dim}}>{s.l}</span>
            <span style={{color:s.c,fontWeight:700}}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DOMAIN GRID ─────────────────────────────────────────────────────────────
function DomainGrid({onSelect,tick}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {DOMAINS.map((d,i)=>{
        const p=.5+Math.sin(tick*.07+i*.6)*.35;
        return(
          <div key={d.id} onClick={()=>onSelect(d.id)} style={{
            padding:"20px 14px",borderRadius:14,cursor:"pointer",textAlign:"center",
            background:`${d.color}0d`,
            border:`1px solid ${d.color}${Math.round(18+p*16).toString(16).padStart(2,"00")}`,
            boxShadow:`0 0 ${Math.round(p*16)}px ${d.color}0e`,
            transition:"all .15s",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:`${(-50+tick*1.2+i*10)%200}%`,width:"50%",height:"100%",
              background:`linear-gradient(90deg,transparent,${d.color}06,transparent)`,pointerEvents:"none"}}/>
            <div style={{fontSize:30,marginBottom:10,filter:`drop-shadow(0 0 ${Math.round(p*8)}px ${d.color})`}}>
              {d.icon}
            </div>
            <div style={{fontWeight:800,fontSize:12,color:d.color,letterSpacing:.5,marginBottom:4,
              textShadow:`0 0 8px ${d.color}88`}}>{d.label}</div>
            <div style={{fontSize:9,color:Q.dim,marginBottom:8}}>Agent: {d.agent}</div>
            <div style={{fontSize:9,color:Q.dim,marginBottom:6}}>{d.sources} sources · L{d.depth}</div>
            <div style={{padding:"3px 0",borderTop:`1px solid ${d.color}18`}}>
              <span style={{fontSize:9,fontWeight:800,color:d.color}}>{d.confidence}% confidence</span>
            </div>
            <button style={{marginTop:10,width:"100%",padding:"7px",borderRadius:9,
              border:"none",cursor:"pointer",
              background:`${d.color}1e`,border:`1px solid ${d.color}33`,
              color:d.color,fontSize:10,fontWeight:800}}>
              🔬 RUN RESEARCH
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function ResearchPage(){
  const tick=useTick(120);
  const [tab,setTab]=useState("domains");
  const [selectedDomain,setSelectedDomain]=useState(null);
  const [running,setRunning]=useState(false);
  const [completed,setCompleted]=useState(new Set());

  const startResearch=(domainId)=>{
    setSelectedDomain(domainId);
    setRunning(true);
    setTab("report");
  };

  return(
    <div style={{minHeight:"100vh",background:Q.void,
      fontFamily:"'Inter',system-ui,sans-serif",color:Q.bright,padding:22,
      backgroundImage:`radial-gradient(${Q.gluon}06 1px,transparent 1px)`,backgroundSize:"30px 30px"}}>

      {/* Header */}
      <div style={{padding:"20px 26px",borderRadius:20,marginBottom:20,
        background:`linear-gradient(135deg,${Q.gluon}12,${Q.neutrino}0a,${Q.gluon}06)`,
        border:`1px solid ${Q.gluon}44`,boxShadow:`0 0 50px ${Q.gluon}0a`,
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,
          backgroundImage:`linear-gradient(${Q.gluon}06 1px,transparent 1px),linear-gradient(90deg,${Q.gluon}06 1px,transparent 1px)`,
          backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <MiniEye size={48} tick={tick} color={Q.gluon}/>
            <div>
              <div style={{fontWeight:900,fontSize:22,color:Q.gluon,letterSpacing:2,
                textShadow:`0 0 20px ${Q.gluon}88`}}>🔬 DEEP RESEARCH ENGINE</div>
              <div style={{color:"#164e63",fontSize:10,letterSpacing:2,marginTop:4,fontWeight:700}}>
                8 DOMAINS · 12 AI AGENTS · HQMLL POWERED · KREALOGOIK · © 2026 GRIGORI SAKS
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            {[
              {l:"Domains",   v:"8",           c:Q.gluon},
              {l:"Agents",    v:"12",          c:Q.neutrino},
              {l:"Avg Conf",  v:"90.4%",       c:Q.lepton},
              {l:"Completed", v:`${completed.size}`,c:Q.higgs},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:"center",padding:"10px 16px",borderRadius:11,
                background:`${s.c}0d`,border:`1px solid ${s.c}33`}}>
                <div style={{fontSize:9,color:Q.dim,letterSpacing:1}}>{s.l}</div>
                <div style={{fontSize:18,fontWeight:900,color:s.c,marginTop:4,
                  textShadow:`0 0 8px ${s.c}`}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:18}}>
        {[
          {id:"oracle",  label:"Oracle Chat",   icon:"👁"},
          {id:"domains", label:"All Domains",   icon:"🌐"},
          {id:"report",  label:"Latest Report", icon:"📋"},
          {id:"signals", label:"Live Signals",  icon:"🔮"},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"9px 20px",borderRadius:20,border:"none",cursor:"pointer",
            background:tab===t.id
              ?`linear-gradient(135deg,${Q.gluon}35,${Q.neutrino}22)`
              :"rgba(6,182,212,0.07)",
            color:tab===t.id?Q.bright:Q.dim,fontWeight:700,fontSize:11,
            border:tab===t.id?`1px solid ${Q.gluon}44`:"1px solid transparent",
            boxShadow:tab===t.id?`0 0 16px ${Q.gluon}14`:"none",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Content */}
      {tab==="oracle"&&(
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
          <HoloCard color={Q.plasma} tick={tick} glow>
            <div style={{fontWeight:800,fontSize:12,color:Q.plasma,letterSpacing:1,marginBottom:14}}>
              👁 QUANTUM EMMA RESEARCH ORACLE
            </div>
            <OracleChat tick={tick}/>
          </HoloCard>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <LiveSignals tick={tick}/>
          </div>
        </div>
      )}

      {tab==="domains"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <DomainGrid onSelect={startResearch} tick={tick}/>
        </div>
      )}

      {tab==="report"&&(
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
          <div>
            {/* Domain switcher */}
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
              {DOMAINS.map(d=>(
                <button key={d.id} onClick={()=>{setSelectedDomain(d.id);setRunning(false);setCompleted(c=>new Set([...c,d.id]));}} style={{
                  display:"flex",alignItems:"center",gap:6,padding:"6px 14px",
                  borderRadius:20,border:"none",cursor:"pointer",
                  background:selectedDomain===d.id?`${d.color}25`:"rgba(255,255,255,0.04)",
                  color:selectedDomain===d.id?d.color:Q.dim,fontSize:10,fontWeight:700}}>
                  {d.icon} {d.label}
                </button>
              ))}
            </div>

            {running&&selectedDomain
              ? <ResearchRunner domain={selectedDomain} onComplete={()=>{setRunning(false);setCompleted(c=>new Set([...c,selectedDomain]));}}/>
              : selectedDomain
              ? <ReportViewer domain={selectedDomain} tick={tick}/>
              : (
                <div style={{padding:"48px",textAlign:"center",borderRadius:14,
                  background:"rgba(0,0,0,0.3)",border:`1px solid ${Q.plasma}18`}}>
                  <div style={{fontSize:40,marginBottom:12}}>🔬</div>
                  <div style={{fontSize:15,fontWeight:700,color:Q.mid,marginBottom:8}}>No report selected</div>
                  <div style={{fontSize:12,color:Q.dim}}>Go to "All Domains" and click "RUN RESEARCH"</div>
                </div>
              )
            }
          </div>
          <LiveSignals tick={tick}/>
        </div>
      )}

      {tab==="signals"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <HoloCard color={Q.higgs} tick={tick} glow>
            <LiveSignals tick={tick}/>
          </HoloCard>
          <HoloCard color={Q.gluon} tick={tick}>
            <div style={{fontWeight:800,fontSize:12,color:Q.gluon,letterSpacing:1,marginBottom:14}}>
              📊 MARKET OVERVIEW
            </div>
            {[
              {asset:"QEMMA",price:"$0.6300",change:"+8.42%",target:"$0.84",c:Q.neutrino},
              {asset:"BTC",  price:"$71,450",change:"+2.34%",target:"$73,800",c:Q.higgs},
              {asset:"ETH",  price:"$3,840", change:"+1.87%",target:"$4,100", c:Q.gluon},
              {asset:"SOL",  price:"$184",   change:"+3.12%",target:"$195",   c:"#9945ff"},
              {asset:"BNB",  price:"$612",   change:"+0.91%",target:"$630",   c:Q.muon},
            ].map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,
                padding:"10px 0",borderBottom:i<4?`1px solid rgba(255,255,255,0.04)`:"none"}}>
                <span style={{fontWeight:900,fontSize:13,color:a.c,width:60,
                  textShadow:`0 0 8px ${a.c}88`}}>{a.asset}</span>
                <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:Q.bright,flex:1}}>
                  {a.price}
                </span>
                <span style={{fontSize:11,fontWeight:700,color:Q.lepton,width:60}}>{a.change}</span>
                <span style={{fontSize:10,color:Q.dim}}>→ {a.target}</span>
              </div>
            ))}
          </HoloCard>
        </div>
      )}

      {/* Footer */}
      <div style={{marginTop:18,padding:"10px 16px",borderRadius:10,
        background:`${Q.gluon}06`,border:`1px solid ${Q.gluon}12`,
        display:"flex",justifyContent:"space-between",fontSize:10}}>
        <span style={{color:Q.dim}}>Deep Research Engine · 8 Domains · 12 Agents · HQMLL · Krealogoik</span>
        <span style={{color:Q.plasma,fontWeight:700}}>© 2026 Grigori Saks — Patent Pending — v3.0</span>
      </div>
    </div>
  );
}
