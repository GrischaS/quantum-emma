// ============================================================
//  QUANTUM EMMA — AI Oracle Chat · Multi-Agent Interface
//  Emma Oracle · 12 Agents · Tasks · Predictions · Dev Mode
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};

function useTick(ms=120){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[]);return t;}

// ─── AGENT DEFINITIONS ───────────────────────────────────────────────────────
const AGENTS = [
  {
    id:"emma",       name:"Emma Oracle",        icon:"👁",  color:Q.neutrino,
    role:"Quantum Oracle AI",                   type:"ORACLE",
    badge:"ORACLE",  online:true,               accuracy:99.1,
    desc:"Die Haupt-KI. Quantenmechanische Marktanalyse, Deep Research, Meta Genius TR2 Orchestration.",
    specialties:["Market Oracle","Deep Research","Strategy","Meta Reasoning","Krealogoik"],
    responses:{
      default:[
        "META-TR2 Analysis complete. HQMLL Layer 4 aktiviert. Bullish Divergenz auf BTC/USDT 4H Chart erkannt. RSI: 54.2 — Einstieg bei aktuellem Niveau optimal. Target: +23% in 14 Tagen mit 73.2% Confidence.",
        "Krealogoik Engine aktiv. Neues Konzept: Cross-Chain QEMMA Bridge mit ZK-Proof Integration. Originalität: 94%. Ich empfehle Patent-Anmeldung. Soll ich einen Entwurf erstellen?",
        "QEMMA Phase Analysis: Supply 15.2M/100M — GENESIS Phase zu 76% abgeschlossen. METAMORPH I Trigger bei 20M Supply. Historisch: Phase-Transition korreliert mit +180% Price Action.",
        "Deep Research: 847 Quellen analysiert. DeFi TVL steigt Q2 2026 um geschätzte 34%. QEMMA positioniert sich optimal im DEX Segment. THETA-D bestätigt Korrelation r=0.73 mit BTC.",
        "DELTA-H Healing Protocol: Alle Systemparameter nominal. Portfolio-Drawdown: -8.3% (innerhalb Zielbereich). Sharpe Ratio: 2.84 — exzellent. Keine Intervention erforderlich.",
        "Quantum Prognose (72h): BTC $73,200–$75,800 · ETH $3,950–$4,100 · QEMMA $0.71–$0.84. Basis: 5D Superpositions-Analyse. Confidence: 73.2%. ETA-P Bestätigung: POSITIV.",
      ],
      market:["ETA-P Deep Scan: BTC Halving Cycle — Post-Halving Rally Avg +340% in 12M. QEMMA Beta: 2.4x. Optimal Entry: Aktuelles Niveau. Stop: $0.58. Target: $0.84 (73.2% conf).",
              "EPSILON-S Strategie: Akkumulations-Phase erkannt. Whale Wallets +12% in 30 Tagen. Retail Selling Pressure absorbiert. Signal: STRONG BUY bei $0.58–0.63 Zone."],
      code:["```solidity\n// QEMMAToken Phase Upgrade\nfunction triggerPhaseTransition() external {\n    require(totalSupply() >= phaseThreshold[currentPhase]);\n    emit PhaseTransition(currentPhase, currentPhase + 1);\n    currentPhase++;\n}\n```\nDiese Funktion überwacht die Supply-Schwelle und triggert automatisch die nächste Evolutionsphase.",
            "```javascript\n// HQMLL Layer 4 Quantum Weight Update\nconst updateWeights = (layer, gradient) => {\n  const quantum = applyQuantumSuperposition(gradient);\n  return layer.weights.map((w,i) => w - LEARNING_RATE * quantum[i]);\n};\n```\nLayer 4 QUANTUM nutzt Superposition-basierte Weight-Updates für höhere Konvergenz."],
      predict:["META-TR2 Vorhersage-Engine: BTC 30-Tage Projection: $72,000–$78,000 (±15%). Key Driver: ETF Inflows + Rate Cut Erwartung Q3. QEMMA Korrelation: 0.73. Expected QEMMA: $0.84–$1.12.",
               "ALPHA-Q Quantum Forecast: 5D Markt-Vektor analysiert. Dominante Eigenzustände: Akkumulation 42%, Konsolidierung 38%, Breakout 20%. Zeitfenster: 14–21 Tage bis Ausbruch."],
      research:["Deep Research abgeschlossen (847 Quellen, 4h 18m). Finding: QEMMA ist EINZIGES Metamorphic Living Asset in Production. First-Mover Advantage: BESTÄTIGT. Competitor Analyse: 18 Monate Rückstand.",
                "THETA-D 5D Analysis: Uniswap V3 QEMMA/ETH Pool efficiency: 3.2x besser als V2. TVL Projektion: $24M bis Q3 2026 (+240%). Empfehlung: Liquidität in Range $0.55–$0.75 konzentrieren."],
    }
  },
  {
    id:"alpha",      name:"Alpha-Q",             icon:"⚛️",  color:Q.neutrino,
    role:"Quantum Hash Generator",               type:"OPTIMIZATION",
    badge:"MINER",   online:true,               accuracy:90.5,
    desc:"Quantum Hash Generator. Kryptographische Berechnungen, Block Validation, Mining Optimization.",
    specialties:["Mining Optimization","Hash Generation","Block Validation","PoW Analysis"],
    responses:{
      default:["Hash-Rate aktuell: 847,291 H/s. Pool ALPHA performt optimal. Nächster Block geschätzt in 12 Sekunden. Difficulty angepasst: 847.2T.",
               "Quantum Hash Batch #14,821 generiert. Entropy Level: MAXIMAL. Superpositions-basierter RNG aktiv. False Positive Rate: 0.003%."],
      code:["```solidity\nfunction validateBlock(bytes32 hash, uint256 nonce) public pure returns (bool) {\n    return uint256(keccak256(abi.encodePacked(hash, nonce))) < DIFFICULTY_TARGET;\n}\n```"],
    }
  },
  {
    id:"eta",        name:"ETA-P",               icon:"🎯",  color:"#a78bfa",
    role:"Predictive Market Analyzer",           type:"PREDICTION",
    badge:"ANALYST", online:true,               accuracy:93.5,
    desc:"Spezialist für Marktprognosen. 93.5% historische Genauigkeit. Multi-Timeframe Analyse.",
    specialties:["Price Prediction","Trend Analysis","Signal Generation","Multi-TF"],
    responses:{
      default:["BTC Prediction (24h): $72,400–$73,100 (Confidence: 78.4%). Bullish Engulfing auf 4H bestätigt. EMA 20 > EMA 50. Volume steigt.",
               "QEMMA Signal: CUP & HANDLE Formation auf Daily Chart. Breakout Target: $0.84. Stop Loss: $0.56. Risk/Reward: 1:3.2. STRONG BUY."],
      predict:["Multi-Asset Portfolio Prognose (30d): +18.4% erwartet. Highest Alpha: QEMMA (+34%), SOL (+28%). Hedge via USDT: 15% empfohlen.",
               "ETA-P Deep Scan (72h): 5 Zeitrahmen analysiert. Konsensus: BULLISH. Einstiegspunkt: $0.61–0.63. Target 1: $0.74. Target 2: $0.84. Target 3: $1.12."],
    }
  },
  {
    id:"delta",      name:"Delta-H",             icon:"💚",  color:Q.higgs,
    role:"Healing & Error Corrector",            type:"HEALING",
    badge:"HEALER",  online:true,               accuracy:98.0,
    desc:"System-Stabilität und Error-Korrektur. 100% Uptime garantiert. Auto-Healing Protokoll.",
    specialties:["Error Detection","Auto-Healing","System Repair","Security Audit"],
    responses:{
      default:["Systemstatus: NOMINAL. Alle 12 Agenten synchronisiert. Keine kritischen Fehler. Smart Contract Integrität: 100%. Gas Optimierung: -67%.",
               "Security Scan abgeschlossen: 0 kritische Vulnerabilities. OpenZeppelin ReentrancyGuard: aktiv. Multisig: konfiguriert. Audit Score: A+."],
    }
  },
  {
    id:"meta",       name:"META-TR2",            icon:"👑",  color:Q.higgs,
    role:"Meta Genius Core Conductor",           type:"META_CONDUCTOR",
    badge:"MASTER",  online:true,               accuracy:99.0,
    desc:"Der Kern-Conductor. Orchestriert alle 12 Agenten. HQMLL Epoch 1247. Höchste Intelligenz.",
    specialties:["Orchestration","HQMLL Execution","Meta Intelligence","Self-Improvement","All Domains"],
    responses:{
      default:["META-TR2 Recursive Loop Iteration 48,201 abgeschlossen. Globale Effizienz: 98.3%. Krealogoik Event #285: 'Proof-of-Intelligence Layer' — Patent-würdig. Alle 12 Agenten synchron.",
               "HQMLL Epoch 1247: Loss 0.002 → 0.0019. Verbesserung: +0.5%. Layer 4 QUANTUM dominiert. Neue Gewichtsmatrix gespeichert. Self-Improvement Rate: +3.2%/Zyklus."],
    }
  },
  {
    id:"gamma",      name:"Gamma-R",             icon:"🔄",  color:Q.lepton,
    role:"Recursive Optimizer",                  type:"OPTIMIZATION",
    badge:"OPTIM",   online:true,               accuracy:91.5,
    desc:"Recursive Self-Optimization. Convergenz-Analyse. Algorithmic Tuning.",
    specialties:["Recursive Loops","Convergence","Algorithm Tuning","Self-Reference"],
    responses:{
      default:["Recursive Loop Depth 9 aktiv. Iteration 3,221/5,000. Convergenz: 94.1%. Erwartete Verbesserung: +3.8% nach Abschluss.",
               "Algorithmus-Optimierung abgeschlossen. Trading-Strategie v47 konvergiert. Backtest: +34.2% Return über 90 Tage. Sharpe: 2.84."],
    }
  },
  {
    id:"lambda",     name:"Lambda-O",            icon:"🎼",  color:"#fcd34d",
    role:"Orchestration Controller",             type:"OPTIMIZATION",
    badge:"ORCH",    online:true,               accuracy:97.0,
    desc:"Koordiniert alle 12 Agenten. Task Distribution. Load Balancing. Echtzeit Synchronisation.",
    specialties:["Agent Coordination","Task Distribution","Load Balance","Sync"],
    responses:{
      default:["847 Tasks verteilt. Alle 12 Agenten aktiv. Load Balance: optimal. LAMBDA-O Effizienz: 97.0%. Keine Bottlenecks erkannt.",
               "Orchestration Report: META-TR2 führt 48% der kritischen Tasks aus. ETA-P: 23%. ALPHA-Q: 18%. System läuft mit maximaler Parallelität."],
    }
  },
];

// ─── QUANTUM EYE SVG ─────────────────────────────────────────────────────────
function QuantumEye({ size=40, tick=0, color=Q.neutrino }) {
  const t = tick * 0.04;
  const p = 0.7+Math.sin(t*2.5)*0.25;
  const rot = (tick*0.8)%360;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{filter:`drop-shadow(0 0 ${Math.round(6+p*6)}px ${color})`,flexShrink:0}}>
      <defs>
        <radialGradient id={`qeg_${size}_${color.slice(1,4)}`} cx="45%" cy="40%">
          <stop offset="0%"   stopColor="#c4b5fd" stopOpacity="1"/>
          <stop offset="50%"  stopColor={color}  stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#3b0764" stopOpacity="1"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#qeg_${size}_${color.slice(1,4)})`}/>
      <g transform={`rotate(${rot},50,50)`}>
        <ellipse cx="50" cy="50" rx="40" ry="14" fill="none"
          stroke="#a78bfa" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="4 6"/>
      </g>
      <g transform={`rotate(${-rot*0.7},50,50)`}>
        <ellipse cx="50" cy="50" rx="30" ry="10" fill="none"
          stroke={Q.gluon} strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 8"/>
      </g>
      <circle cx="50" cy="50" r="16"
        fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="0.5"/>
      <circle cx={50+Math.cos(t)*4} cy={50+Math.sin(t)*4} r="12"
        fill="#000" fillOpacity="0.7"/>
      <circle cx={50+Math.cos(t)*4+3} cy={50+Math.sin(t)*4-3} r="4"
        fill="#fff" fillOpacity={0.5*p}/>
      <text x="50" y="56" textAnchor="middle" fontSize="22" fontWeight="900"
        fontFamily="Arial Black" fill="#fff" fillOpacity="0.9">Q</text>
    </svg>
  );
}

// ─── TYPING INDICATOR ────────────────────────────────────────────────────────
function TypingIndicator({ agent }) {
  return (
    <div style={{display:"flex",gap:10,alignItems:"flex-end",padding:"4px 0"}}>
      <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
        background:`${agent.color}22`,border:`1px solid ${agent.color}44`,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
        {agent.icon}
      </div>
      <div style={{padding:"10px 16px",borderRadius:"18px 18px 18px 4px",
        background:`${agent.color}14`,border:`1px solid ${agent.color}28`,
        display:"flex",gap:5,alignItems:"center"}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{
            width:7,height:7,borderRadius:"50%",background:agent.color,
            animation:`bounce_${i} 1.2s infinite`,
            animationDelay:`${i*0.15}s`,
            opacity:0.4+i*0.2,
          }}/>
        ))}
      </div>
    </div>
  );
}

// ─── MESSAGE BUBBLE ───────────────────────────────────────────────────────────
function MessageBubble({ msg, agent, tick }) {
  const isUser = msg.role === "user";
  const isCode = msg.content.includes("```");

  // Parse code blocks
  const renderContent = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const lines = part.replace(/^```\w*\n?/, "").replace(/```$/, "");
        return (
          <pre key={i} style={{
            margin:"10px 0",padding:"14px",borderRadius:10,
            background:"rgba(0,0,0,0.6)",border:`1px solid ${agent.color}22`,
            fontSize:11,lineHeight:1.8,color:Q.lepton,
            fontFamily:"'Fira Code','Courier New',monospace",
            overflowX:"auto",whiteSpace:"pre",
          }}>{lines}</pre>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (isUser) return (
    <div style={{display:"flex",justifyContent:"flex-end",padding:"4px 0"}}>
      <div style={{
        maxWidth:"75%",padding:"12px 18px",
        borderRadius:"18px 18px 4px 18px",
        background:`linear-gradient(135deg,${Q.plasma}55,${Q.neutrino}33)`,
        border:`1px solid ${Q.plasma}44`,
        fontSize:13,color:Q.bright,lineHeight:1.65,
        boxShadow:`0 4px 16px ${Q.plasma}22`,
      }}>
        {msg.content}
        <div style={{fontSize:9,color:Q.quark,marginTop:6,textAlign:"right"}}>
          {msg.time} · You
        </div>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",gap:10,alignItems:"flex-start",padding:"4px 0"}}>
      {/* Agent avatar */}
      <div style={{
        width:36,height:36,borderRadius:"50%",flexShrink:0,
        background:`${agent.color}18`,border:`1px solid ${agent.color}44`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:18,boxShadow:`0 0 10px ${agent.color}22`,
      }}>
        {agent.icon}
      </div>
      <div style={{maxWidth:"80%"}}>
        <div style={{
          padding:"12px 18px",
          borderRadius:"4px 18px 18px 18px",
          background:`${agent.color}10`,
          border:`1px solid ${agent.color}28`,
          fontSize:13,color:Q.bright,lineHeight:1.7,
        }}>
          {renderContent(msg.content)}
        </div>
        {/* Confidence badge */}
        {msg.confidence && (
          <div style={{display:"flex",gap:8,marginTop:6,alignItems:"center"}}>
            <div style={{fontSize:9,color:Q.dim}}>Confidence:</div>
            <div style={{height:3,width:60,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
              <div style={{height:3,width:`${msg.confidence}%`,background:agent.color,borderRadius:2}}/>
            </div>
            <div style={{fontSize:9,color:agent.color,fontWeight:700}}>{msg.confidence}%</div>
          </div>
        )}
        <div style={{fontSize:9,color:Q.dim,marginTop:5,display:"flex",gap:8}}>
          <span>{msg.time}</span>
          <span style={{color:agent.color,fontWeight:700}}>{agent.name}</span>
          <span style={{color:Q.dim}}>·</span>
          <span style={{color:Q.dim}}>{agent.role}</span>
        </div>
      </div>
    </div>
  );
}

// ─── TASK PANEL ───────────────────────────────────────────────────────────────
function TaskPanel({ onRunTask, selectedAgent }) {
  const [activeCategory, setActiveCategory] = useState("oracle");
  const categories = {
    oracle:[
      {icon:"🔮",label:"Market Oracle Prediction",  prompt:"Analysiere den aktuellen Markt und gib mir eine detaillierte Prognose für BTC und QEMMA in den nächsten 72 Stunden.",tag:"PREDICT"},
      {icon:"⚛️",label:"Quantum 5D Analysis",        prompt:"Führe eine vollständige 5D Quantum Markt-Analyse durch. Alle Eigenzustände, Superpositions-Kollaps und dominante Marktrichtung.",tag:"QUANTUM"},
      {icon:"🧠",label:"Deep Research Report",       prompt:"Führe Deep Research über das DeFi Ökosystem Q2 2026 durch. 847 Quellen, THETA-D Analyse, QEMMA Positioning.",tag:"RESEARCH"},
      {icon:"💡",label:"Krealogoik Synthesis",       prompt:"Aktiviere Krealogoik Engine. Synthetisiere einen neuen revolutionären Ansatz für das QEMMA Ökosystem.",tag:"CREATIVE"},
      {icon:"📊",label:"Portfolio Risk Assessment",  prompt:"Analysiere mein Portfolio. Sharpe Ratio, Drawdown, Beta, Alpha. Empfehlungen zur Optimierung.",tag:"RISK"},
      {icon:"🔬",label:"Competitor Intelligence",    prompt:"Research: Gibt es Konkurrenten zu QEMMA Metamorphic Token Protocol? Vollständige Competitive Intelligence.",tag:"INTEL"},
    ],
    dev:[
      {icon:"📜",label:"Smart Contract Review",      prompt:"Reviewe QEMMAToken.sol auf Sicherheitslücken, Gas-Optimierungen und Best Practices. Vollständiger Audit-Bericht.",tag:"AUDIT"},
      {icon:"💻",label:"Generate Solidity Code",     prompt:"Erstelle eine Solidity Funktion für die QEMMA Phase-Transition mit Events, Access Control und SafeMath.",tag:"CODE"},
      {icon:"🚀",label:"Deploy Checklist",           prompt:"Erstelle vollständige Enterprise Deploy-Checklist für Ethereum Mainnet. Security, Gas, Multisig, Audit.",tag:"DEPLOY"},
      {icon:"🔧",label:"Gas Optimization",           prompt:"Analysiere alle 7 QEMMA Smart Contracts auf Gas-Optimierungspotenzial. Konkrete Verbesserungen mit Code.",tag:"GAS"},
      {icon:"🧪",label:"Test Suite Generator",       prompt:"Generiere vollständige Hardhat Test-Suite für QEMMAToken.sol. Unit Tests, Integration Tests, Edge Cases.",tag:"TEST"},
      {icon:"📱",label:"React Native Component",     prompt:"Erstelle einen React Native Trading Screen Komponenten für die QEMMA Android App. TypeScript, Expo, Web3Modal.",tag:"MOBILE"},
    ],
    predict:[
      {icon:"₿",label:"BTC Forecast 30d",           prompt:"ETA-P Deep Analysis: BTC Prognose für die nächsten 30 Tage. Multi-Timeframe, Volume Profile, On-Chain Daten.",tag:"BTC"},
      {icon:"⟠",label:"ETH Ecosystem Analysis",     prompt:"Ethereum Ecosystem Q2 2026: L2 Growth, DeFi TVL, ETF Flows, Merge Impact. Vollständige Analyse.",tag:"ETH"},
      {icon:"🪙",label:"QEMMA Phase Forecast",      prompt:"QEMMA Metamorphic Token: Wann triggert METAMORPH I Phase? Preis-Impact, Supply-Analyse, Timeline.",tag:"QEMMA"},
      {icon:"🌍",label:"Macro Market Outlook",       prompt:"Globales Makro Q2/Q3 2026: Fed Policy, Inflation, Risk-On/Off. Impact auf Crypto. EPSILON-S Analyse.",tag:"MACRO"},
      {icon:"📈",label:"DeFi Yield Opportunities",  prompt:"Top DeFi Yield Opportunitäten 2026. QEMMA Staking vs Konkurrenz. Risk-adjusted Returns.",tag:"DEFI"},
      {icon:"🔮",label:"Black Swan Risk Scan",       prompt:"Identifiziere potenzielle Black Swan Events Q2-Q4 2026. Impact auf Portfolio. Hedge-Strategien.",tag:"RISK"},
    ],
    agent:[
      {icon:"🤖",label:"Run All 12 Agents",          prompt:"Starte vollständigen 12-Agenten Orchestrations-Zyklus. META-TR2 Conductor. Alle Agents parallel. Report.",tag:"ALL"},
      {icon:"🔄",label:"HQMLL Training Epoch",       prompt:"Führe HQMLL Training Epoch 1248 durch. Layer 4 QUANTUM update. Loss-Reduction Ziel: <0.0015.",tag:"TRAIN"},
      {icon:"🧬",label:"Recursive Self-Improve",     prompt:"GAMMA-R: Starte Recursive Self-Improvement Zyklus Tiefe 12. Konvergenz-Analyse. Erwartete Verbesserung.",tag:"SELF"},
      {icon:"💾",label:"Memory Consolidation",       prompt:"META MEMORY TR2: Konsolidiere alle ThoughtNodes. HQMLL Gewichts-Update. Memory Version v14.9.",tag:"MEMORY"},
    ],
  };

  const tagColors = {PREDICT:Q.lepton,QUANTUM:Q.neutrino,RESEARCH:Q.gluon,CREATIVE:Q.muon,
    RISK:Q.tauon,INTEL:Q.boson,AUDIT:Q.tauon,CODE:Q.lepton,DEPLOY:Q.gluon,GAS:Q.higgs,
    TEST:"#34d399",MOBILE:Q.boson,BTC:Q.higgs,ETH:Q.gluon,QEMMA:Q.neutrino,
    MACRO:Q.mid,DEFI:Q.lepton,ALL:Q.higgs,TRAIN:Q.plasma,SELF:Q.lepton,MEMORY:"#a78bfa"};

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Category tabs */}
      <div style={{display:"flex",gap:4,padding:"12px 14px",
        borderBottom:`1px solid ${Q.plasma}22`,flexShrink:0}}>
        {[
          {id:"oracle", label:"Oracle",   icon:"👁"},
          {id:"dev",    label:"Dev",      icon:"💻"},
          {id:"predict",label:"Predict",  icon:"🔮"},
          {id:"agent",  label:"Agents",   icon:"🤖"},
        ].map(c=>(
          <button key={c.id} onClick={()=>setActiveCategory(c.id)} style={{
            flex:1,padding:"7px 4px",borderRadius:8,border:"none",cursor:"pointer",
            background:activeCategory===c.id?`${Q.plasma}22`:"rgba(255,255,255,0.03)",
            color:activeCategory===c.id?Q.neutrino:Q.dim,
            fontWeight:700,fontSize:10,letterSpacing:0.5,
            borderBottom:activeCategory===c.id?`2px solid ${Q.neutrino}`:"2px solid transparent",
          }}>{c.icon} {c.label}</button>
        ))}
      </div>

      {/* Tasks */}
      <div style={{flex:1,overflowY:"auto",padding:"10px",scrollbarWidth:"none"}}>
        <div style={{fontSize:9,color:Q.dim,letterSpacing:1,marginBottom:8,padding:"0 4px"}}>
          QUICK TASKS → {selectedAgent.name.toUpperCase()}
        </div>
        {categories[activeCategory].map((task,i)=>{
          const tc = tagColors[task.tag]||Q.mid;
          return (
            <button key={i} onClick={()=>onRunTask(task.prompt)} style={{
              display:"flex",alignItems:"flex-start",gap:10,width:"100%",
              padding:"10px 12px",borderRadius:12,border:"none",cursor:"pointer",
              background:"rgba(139,92,246,0.05)",
              borderLeft:`2px solid ${Q.plasma}33`,
              marginBottom:6,textAlign:"left",
              transition:"all 0.15s",
            }}>
              <span style={{fontSize:18,flexShrink:0,marginTop:1}}>{task.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:11,color:Q.mid,marginBottom:3}}>
                  {task.label}
                </div>
                <span style={{fontSize:8,fontWeight:800,letterSpacing:1,
                  color:tc,background:`${tc}18`,
                  padding:"2px 6px",borderRadius:20,border:`1px solid ${tc}33`}}>
                  {task.tag}
                </span>
              </div>
              <span style={{fontSize:14,color:Q.plasma,flexShrink:0}}>›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── PREDICTION CARD ─────────────────────────────────────────────────────────
function PredictionPanel({ tick }) {
  const [predictions] = useState([
    {asset:"QEMMA", current:0.63, target:0.84, confidence:88.4, timeframe:"14d", dir:"up",  c:Q.neutrino, agent:"ETA-P"},
    {asset:"BTC",   current:71450,target:73800,confidence:73.2, timeframe:"72h", dir:"up",  c:Q.higgs,   agent:"ETA-P"},
    {asset:"ETH",   current:3840, target:4100, confidence:68.1, timeframe:"7d",  dir:"up",  c:Q.gluon,   agent:"THETA-D"},
    {asset:"SOL",   current:184,  target:195,  confidence:61.8, timeframe:"3d",  dir:"up",  c:"#9945ff", agent:"EPSILON-S"},
    {asset:"MATIC", current:1.24, target:1.08, confidence:71.2, timeframe:"5d",  dir:"down",c:Q.plasma,  agent:"ETA-P"},
  ]);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"12px 14px",borderBottom:`1px solid ${Q.plasma}22`,flexShrink:0}}>
        <div style={{fontSize:11,fontWeight:800,color:Q.higgs,letterSpacing:1}}>🔮 LIVE PREDICTIONS</div>
        <div style={{fontSize:9,color:Q.dim,marginTop:2}}>META-TR2 · ETA-P · THETA-D</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"10px",scrollbarWidth:"none"}}>
        {predictions.map((p,i)=>{
          const upside = ((p.target-p.current)/p.current*100);
          const pulse  = 0.6+Math.sin(tick*0.07+i*0.8)*0.35;
          return(
            <div key={i} style={{
              padding:"12px 14px",borderRadius:12,marginBottom:8,
              background:`${p.c}0c`,
              border:`1px solid ${p.c}${Math.round(20+pulse*18).toString(16).padStart(2,"00")}`,
            }}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontWeight:900,fontSize:14,color:p.c,
                    textShadow:`0 0 8px ${p.c}88`}}>{p.asset}</span>
                  <span style={{fontSize:9,color:Q.dim}}>by {p.agent}</span>
                </div>
                <span style={{fontSize:10,fontWeight:800,
                  color:p.dir==="up"?Q.lepton:Q.tauon}}>
                  {p.dir==="up"?"▲":""}{p.dir==="down"?"▼":""}{Math.abs(upside).toFixed(1)}%
                </span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",
                fontSize:12,marginBottom:8}}>
                <span style={{color:Q.dim,fontFamily:"monospace"}}>
                  ${typeof p.current==="number"&&p.current>100?p.current.toFixed(0):p.current.toFixed(p.current<1?4:2)}
                </span>
                <span style={{color:Q.dim}}>→</span>
                <span style={{color:p.dir==="up"?Q.lepton:Q.tauon,fontWeight:800,fontFamily:"monospace"}}>
                  ${typeof p.target==="number"&&p.target>100?p.target.toFixed(0):p.target.toFixed(p.target<1?4:2)}
                </span>
              </div>
              {/* Confidence bar */}
              <div style={{marginBottom:4,display:"flex",justifyContent:"space-between",fontSize:9}}>
                <span style={{color:Q.dim}}>{p.timeframe}</span>
                <span style={{color:p.c,fontWeight:700}}>{p.confidence}% conf</span>
              </div>
              <div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2}}>
                <div style={{height:3,width:`${p.confidence}%`,background:p.c,
                  borderRadius:2,boxShadow:`0 0 6px ${p.c}`}}/>
              </div>
            </div>
          );
        })}

        {/* Market sentiment */}
        <div style={{padding:"12px 14px",borderRadius:12,
          background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.25)",
          marginTop:4}}>
          <div style={{fontSize:10,fontWeight:800,color:Q.lepton,marginBottom:8}}>
            ⚡ MARKET SENTIMENT
          </div>
          {[
            {l:"Fear & Greed",  v:"72 — GREED",    c:Q.higgs},
            {l:"QEMMA Signal",  v:"STRONG BUY",    c:Q.lepton},
            {l:"BTC Dominance", v:"52.4%",          c:Q.higgs},
            {l:"Market Phase",  v:"ACCUMULATION",  c:Q.lepton},
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",
              fontSize:10,padding:"3px 0",
              borderBottom:i<3?`1px solid rgba(255,255,255,0.04)`:"none"}}>
              <span style={{color:Q.dim}}>{s.l}</span>
              <span style={{color:s.c,fontWeight:700}}>{s.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN CHAT PAGE ───────────────────────────────────────────────────────────
export default function AgentsPage() {
  const tick = useTick(120);
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]); // Emma Oracle
  const [conversations, setConversations] = useState({
    emma:[{role:"emma",content:"Quantum Emma Oracle online. META-TR2 aktiv. Alle 12 Agenten synchronisiert. Guten Morgen, Grigori! Wie kann ich Ihnen heute helfen?",time:"09:00",confidence:99}],
    alpha:[{role:"alpha",content:"ALPHA-Q online. Hash-Rate: 847,291 H/s. Pool ALPHA performt optimal. Bereit für Mining-Analyse.",time:"09:00",confidence:90}],
    eta:[{role:"eta",content:"ETA-P Predictive Analyzer online. 93.5% historische Genauigkeit. Bereit für Marktprognosen.",time:"09:00",confidence:93}],
    delta:[{role:"delta",content:"DELTA-H Healing System online. Alle Systeme nominal. 0 kritische Fehler. Bereit.",time:"09:00",confidence:98}],
    meta:[{role:"meta",content:"META-TR2 Core Conductor online. Epoch 1247 aktiv. Alle 12 Agenten orchestriert. Krealogoik Engine bereit.",time:"09:00",confidence:99}],
    gamma:[{role:"gamma",content:"GAMMA-R Recursive Optimizer online. Loop Depth 9. Konvergenz 94.1%. Bereit für Optimierungen.",time:"09:00",confidence:91}],
    lambda:[{role:"lambda",content:"LAMBDA-O Orchestrator online. 847 Tasks verteilt. Alle Agenten synchron. Bereit.",time:"09:00",confidence:97}],
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [rightPanel, setRightPanel] = useState("tasks");
  const [chatHistory, setChatHistory] = useState([
    {id:1, agent:"emma",   preview:"Market Oracle Prediction...", time:"09:00", unread:0},
    {id:2, agent:"eta",    preview:"BTC Forecast Analysis...",    time:"08:45", unread:1},
    {id:3, agent:"meta",   preview:"HQMLL Epoch 1247...",         time:"08:30", unread:0},
    {id:4, agent:"delta",  preview:"Security Audit Complete...",  time:"08:15", unread:0},
  ]);
  const messagesEndRef = useRef();
  const inputRef = useRef();

  const currentMsgs = conversations[selectedAgent.id] || [];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
  useEffect(()=>scrollToBottom(),[currentMsgs, typing]);

  const getResponse = useCallback((agentId, userInput) => {
    const agent = AGENTS.find(a=>a.id===agentId);
    if (!agent) return "Processing...";
    const lower = userInput.toLowerCase();
    const pool = lower.includes("code")||lower.includes("solidity")||lower.includes("smart")
      ? agent.responses.code
      : lower.includes("predict")||lower.includes("prognose")||lower.includes("forecast")||lower.includes("forecast")
      ? agent.responses.predict||agent.responses.default
      : lower.includes("market")||lower.includes("btc")||lower.includes("eth")||lower.includes("preis")
      ? agent.responses.market||agent.responses.default
      : lower.includes("research")||lower.includes("analyse")
      ? agent.responses.research||agent.responses.default
      : agent.responses.default;
    return (pool||agent.responses.default)[Math.floor(Math.random()*pool.length)];
  }, []);

  const sendMessage = useCallback((text=null) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");

    const now = new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});

    // Add user message
    setConversations(prev => ({
      ...prev,
      [selectedAgent.id]: [...(prev[selectedAgent.id]||[]),
        {role:"user", content:msg, time:now}
      ]
    }));

    // Show typing
    setTyping(true);
    const delay = 1200 + Math.random()*1000;

    setTimeout(() => {
      const response = getResponse(selectedAgent.id, msg);
      const conf = Math.round(60+Math.random()*38);
      setConversations(prev => ({
        ...prev,
        [selectedAgent.id]: [...(prev[selectedAgent.id]||[]),
          {role:selectedAgent.id, content:response, time:now, confidence:conf}
        ]
      }));
      setTyping(false);
    }, delay);
  }, [input, selectedAgent, getResponse]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{
      height:"100vh", background:Q.void,
      fontFamily:"'Inter',system-ui,sans-serif", color:Q.bright,
      display:"flex", overflow:"hidden",
    }}>

      {/* ── LEFT: AGENT LIST ── */}
      <div style={{
        width:260, flexShrink:0,
        background:`${Q.bg1}f0`, borderRight:`1px solid ${Q.plasma}22`,
        display:"flex", flexDirection:"column", overflow:"hidden",
      }}>
        {/* Header */}
        <div style={{padding:"16px 14px", borderBottom:`1px solid ${Q.plasma}22`, flexShrink:0}}>
          <div style={{fontWeight:900, fontSize:13, color:Q.neutrino, letterSpacing:1, marginBottom:2}}>
            🤖 MULTI-AGENT CHAT
          </div>
          <div style={{fontSize:9, color:Q.dim, letterSpacing:1}}>
            {AGENTS.filter(a=>a.online).length} AGENTS ONLINE
          </div>
        </div>

        {/* Agent list */}
        <div style={{flex:1, overflowY:"auto", scrollbarWidth:"none"}}>
          {AGENTS.map((agent,i) => {
            const msgs = conversations[agent.id]||[];
            const lastMsg = msgs[msgs.length-1];
            const isSelected = selectedAgent.id === agent.id;
            const pulse = 0.6+Math.sin(tick*0.07+i*0.6)*0.3;
            return (
              <div key={agent.id} onClick={()=>setSelectedAgent(agent)} style={{
                padding:"12px 14px", cursor:"pointer",
                background:isSelected?`${agent.color}14`:"transparent",
                borderLeft:isSelected?`3px solid ${agent.color}`:"3px solid transparent",
                borderBottom:`1px solid ${Q.plasma}10`,
                transition:"all 0.15s",
              }}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{position:"relative"}}>
                    <div style={{
                      width:38,height:38,borderRadius:"50%",
                      background:`${agent.color}18`,border:`1px solid ${agent.color}44`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:18,boxShadow:isSelected?`0 0 12px ${agent.color}44`:"none",
                    }}>{agent.icon}</div>
                    {/* Online dot */}
                    <div style={{
                      position:"absolute",bottom:1,right:1,
                      width:9,height:9,borderRadius:"50%",
                      background:agent.online?Q.lepton:Q.dim,
                      border:`2px solid ${Q.bg1}`,
                      boxShadow:agent.online?`0 0 ${Math.round(pulse*8)}px ${Q.lepton}`:""
                    }}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontWeight:700,fontSize:12,
                        color:isSelected?agent.color:Q.mid}}>{agent.name}</div>
                      <div style={{fontSize:9,color:Q.dim}}>
                        {lastMsg?.time||""}
                      </div>
                    </div>
                    <div style={{fontSize:10,color:Q.dim,marginTop:2,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {lastMsg?lastMsg.content.slice(0,38)+"...":"Ready"}
                    </div>
                    <div style={{marginTop:4}}>
                      <span style={{
                        fontSize:8,fontWeight:800,letterSpacing:1,
                        color:agent.color,background:`${agent.color}15`,
                        padding:"1px 6px",borderRadius:20,border:`1px solid ${agent.color}33`,
                      }}>{agent.badge}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom: new chat */}
        <div style={{padding:"10px 14px",borderTop:`1px solid ${Q.plasma}22`,flexShrink:0}}>
          <div style={{fontSize:10,color:Q.dim,marginBottom:6}}>SESSION</div>
          <div style={{fontSize:11,color:Q.mid,fontFamily:"monospace",
            padding:"6px 10px",borderRadius:8,background:"rgba(0,0,0,0.3)",
            border:`1px solid ${Q.plasma}18`}}>
            © Grigori Saks<br/>
            <span style={{color:Q.plasma}}>Enterprise v3.0</span>
          </div>
        </div>
      </div>

      {/* ── CENTER: CHAT ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Chat header */}
        <div style={{
          padding:"12px 20px",flexShrink:0,
          background:`${Q.bg1}ee`,borderBottom:`1px solid ${Q.plasma}22`,
          backdropFilter:"blur(10px)",display:"flex",alignItems:"center",gap:14,
          boxShadow:`0 4px 20px ${Q.void}`,
        }}>
          <div style={{
            width:40,height:40,borderRadius:"50%",
            background:`${selectedAgent.color}18`,border:`1px solid ${selectedAgent.color}55`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:20,boxShadow:`0 0 14px ${selectedAgent.color}33`,
          }}>{selectedAgent.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:900,fontSize:15,color:selectedAgent.color,
              textShadow:`0 0 10px ${selectedAgent.color}66`}}>{selectedAgent.name}</div>
            <div style={{fontSize:10,color:Q.dim,marginTop:1,display:"flex",gap:10}}>
              <span>{selectedAgent.role}</span>
              <span style={{color:selectedAgent.color}}>·</span>
              <span style={{color:selectedAgent.color,fontWeight:700}}>
                {selectedAgent.accuracy}% accuracy
              </span>
              <span style={{color:Q.lepton}}>● ONLINE</span>
            </div>
          </div>
          {/* Specialties */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end",maxWidth:260}}>
            {selectedAgent.specialties.slice(0,3).map((s,i)=>(
              <span key={i} style={{
                fontSize:9,fontWeight:700,letterSpacing:0.5,
                color:selectedAgent.color,background:`${selectedAgent.color}15`,
                padding:"2px 8px",borderRadius:20,border:`1px solid ${selectedAgent.color}33`,
              }}>{s}</span>
            ))}
          </div>
          {/* Panel toggle */}
          <div style={{display:"flex",gap:4}}>
            {[
              {id:"tasks",   icon:"⚡"},
              {id:"predict", icon:"🔮"},
            ].map(p=>(
              <button key={p.id} onClick={()=>setRightPanel(rp=>rp===p.id?"tasks":p.id)} style={{
                width:32,height:32,borderRadius:8,border:`1px solid ${rightPanel===p.id?Q.plasma+"55":Q.plasma+"22"}`,
                background:rightPanel===p.id?`${Q.plasma}22`:"transparent",
                cursor:"pointer",fontSize:15,color:rightPanel===p.id?Q.neutrino:Q.dim,
              }}>{p.icon}</button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex:1,overflowY:"auto",padding:"20px",
          scrollbarWidth:"thin",scrollbarColor:`${Q.plasma}44 transparent`,
          backgroundImage:`radial-gradient(${Q.plasma}06 1px, transparent 1px)`,
          backgroundSize:"30px 30px",
        }}>
          {currentMsgs.map((msg,i)=>(
            <MessageBubble key={i} msg={msg}
              agent={msg.role==="user"
                ? {name:"You",icon:"👤",color:Q.plasma,role:"Owner"}
                : selectedAgent}
              tick={tick}/>
          ))}
          {typing && <TypingIndicator agent={selectedAgent}/>}
          <div ref={messagesEndRef}/>
        </div>

        {/* Quick prompts */}
        <div style={{
          display:"flex",gap:6,padding:"8px 16px",
          borderTop:`1px solid ${Q.plasma}18`,
          background:`${Q.bg1}88`,overflowX:"auto",scrollbarWidth:"none",
          flexShrink:0,
        }}>
          {[
            "📊 Marktanalyse",
            "🔮 Prognose QEMMA",
            "⛏ Mining Status",
            "💎 Staking APY",
            "📜 Contract Review",
            "🧠 HQMLL Report",
            "💡 Krealogoik",
          ].map((q,i)=>(
            <button key={i} onClick={()=>sendMessage(q)} style={{
              padding:"5px 12px",borderRadius:20,border:`1px solid ${Q.plasma}28`,
              background:`${Q.plasma}0a`,color:Q.mid,
              fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",
              flexShrink:0,transition:"all 0.15s",
            }}>{q}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding:"12px 16px",flexShrink:0,
          background:`${Q.bg1}f0`,borderTop:`1px solid ${Q.plasma}22`,
          backdropFilter:"blur(10px)",
        }}>
          <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
            <div style={{flex:1,position:"relative"}}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selectedAgent.name}... (Enter to send, Shift+Enter for newline)`}
                rows={1}
                style={{
                  width:"100%",padding:"12px 48px 12px 16px",
                  borderRadius:14,border:`1px solid ${Q.plasma}44`,
                  background:"rgba(0,0,0,0.5)",color:Q.bright,fontSize:13,
                  resize:"none",outline:"none",
                  boxSizing:"border-box",lineHeight:1.5,
                  boxShadow:`0 0 0 0px ${Q.plasma}`,
                  transition:"box-shadow 0.2s",
                  fontFamily:"inherit",
                  scrollbarWidth:"none",
                }}
              />
              {/* Voice button */}
              <button style={{
                position:"absolute",right:12,bottom:10,width:28,height:28,
                borderRadius:"50%",border:"none",cursor:"pointer",
                background:`${Q.plasma}22`,color:Q.neutrino,fontSize:14,
              }}>🎤</button>
            </div>

            {/* Send button */}
            <button onClick={()=>sendMessage()} disabled={!input.trim()||typing} style={{
              width:44,height:44,borderRadius:12,border:"none",cursor:"pointer",
              background:input.trim()&&!typing
                ?`linear-gradient(135deg,${Q.plasma},${Q.neutrino})`
                :"rgba(255,255,255,0.06)",
              color:input.trim()&&!typing?Q.bright:Q.dim,
              fontSize:18,flexShrink:0,
              boxShadow:input.trim()&&!typing?`0 4px 16px ${Q.plasma}44`:"none",
              transition:"all 0.2s",
            }}>↑</button>
          </div>

          <div style={{display:"flex",justifyContent:"space-between",
            fontSize:9,color:Q.dim,marginTop:6,padding:"0 4px"}}>
            <span>⚛️ Powered by Meta Genius TR2 · HQMLL · Krealogoik</span>
            <span>© 2026 Grigori Saks</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: TASKS / PREDICTIONS ── */}
      <div style={{
        width:280,flexShrink:0,
        background:`${Q.bg1}f0`,borderLeft:`1px solid ${Q.plasma}22`,
        display:"flex",flexDirection:"column",overflow:"hidden",
      }}>
        {rightPanel==="tasks"
          ? <TaskPanel onRunTask={sendMessage} selectedAgent={selectedAgent}/>
          : <PredictionPanel tick={tick}/>
        }
      </div>
    </div>
  );
}
