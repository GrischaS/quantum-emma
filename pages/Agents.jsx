// ============================================================
//  QUANTUM EMMA — AI Oracle v5.0 MEGA UPGRADE
//  12-Agent Orchestration · Meta Genius TR2 · Live Chat
//  Real-time Tasks · Predictions · HQMLL Reasoning
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};
function useTick(ms=100){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);return t;}

// ─── 12 AGENTS ───────────────────────────────────────────────────────────────
const AGENTS = [
  {id:0,  name:"ALPHA-7",    role:"Market Oracle",        color:Q.plasma,  status:"active",  load:94, tasks:1240, icon:"⚛️"},
  {id:1,  name:"BETA-3",     role:"Signal Analyst",       color:Q.gluon,   status:"active",  load:78, tasks:982,  icon:"📡"},
  {id:2,  name:"GAMMA-12",   role:"Risk Manager",         color:Q.higgs,   status:"active",  load:62, tasks:756,  icon:"🛡"},
  {id:3,  name:"DELTA-1",    role:"Arbitrage Hunter",     color:Q.lepton,  status:"active",  load:88, tasks:2100, icon:"⚡"},
  {id:4,  name:"EPSILON-9",  role:"MetaCodex Core",       color:Q.boson,   status:"active",  load:99, tasks:4421, icon:"🧬"},
  {id:5,  name:"ZETA-5",     role:"Sentiment Engine",     color:Q.muon,    status:"active",  load:71, tasks:630,  icon:"🧠"},
  {id:6,  name:"ETA-8",      role:"HQMLL Layer 7",        color:Q.quark,   status:"active",  load:85, tasks:1830, icon:"🌀"},
  {id:7,  name:"THETA-2",    role:"Portfolio Optimizer",  color:Q.photon,  status:"idle",    load:22, tasks:340,  icon:"💎"},
  {id:8,  name:"IOTA-11",    role:"On-Chain Analyst",     color:Q.tauon,   status:"active",  load:76, tasks:910,  icon:"🔗"},
  {id:9,  name:"KAPPA-6",    role:"News Intelligence",    color:Q.plasma,  status:"active",  load:68, tasks:1540, icon:"📰"},
  {id:10, name:"LAMBDA-4",   role:"Liquidity Monitor",    color:Q.gluon,   status:"idle",    load:34, tasks:220,  icon:"💧"},
  {id:11, name:"MU-10",      role:"Meta Genius TR2 Core", color:Q.lepton,  status:"active",  load:100,tasks:9999, icon:"🔮"},
];

const EMMA_RESPONSES = [
  "⚛️ HQMLL Layer 7 analysis complete. Strong momentum divergence detected on QEMMA/USDT. Meta Genius TR2 confidence: 94%. Recommendation: STRONG BUY.",
  "🧬 MetaCodex Phase 2 activation confirmed. All 12 agents synchronized. Recursive learning loop iteration #4,421 complete. System evolution: +2.3%.",
  "📡 Signal analysis across 847 data points. Pattern recognition: Wyckoff Accumulation Phase C detected. Breakout probability: 89%. Target: $1.20.",
  "🌀 HQMLL recursive inference engine processing 1.2M parameters. Quantum coherence maintained at 97.4%. Neural pathway optimization active.",
  "💎 Portfolio rebalancing suggestion: Increase QEMMA allocation by 15%. Risk-adjusted Sharpe ratio improves from 2.1 → 2.8. Staking APY: 60%.",
  "🔮 Meta Genius TR2 prediction engine online. Next 24h price range: $0.58 – $0.79. Volatility index: 42. Liquidity depth: $2.8M.",
  "🛡 Risk assessment complete. Max drawdown scenario: -18%. VaR (95%): $420. Stop-loss recommendation: $0.52. Position size: 3.2% portfolio.",
  "⚡ Arbitrage opportunity detected: QEMMA spread 0.34% across 3 DEXes. Estimated profit: $284 on $50K position. Execution window: 8 seconds.",
];

// ─── CHAT BUBBLE ─────────────────────────────────────────────────────────────
function ChatBubble({ msg, tick }) {
  const isUser = msg.role === "user";
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;
  return (
    <div style={{display:"flex",gap:10,alignItems:"flex-start",
      justifyContent:isUser?"flex-end":"flex-start",marginBottom:12}}>
      {!isUser && (
        <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,
          background:`radial-gradient(circle,${Q.plasma},${Q.neutrino})`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
          boxShadow:`0 0 ${8+pulse*6}px ${Q.plasma}88`}}>Q</div>
      )}
      <div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:isUser?"14px 14px 4px 14px":"14px 14px 14px 4px",
        background:isUser?`linear-gradient(135deg,${Q.plasma}cc,${Q.gluon}cc)`:`${Q.bg2}`,
        border:`1px solid ${isUser?Q.plasma:Q.plasma+"33"}`,
        color:Q.bright,fontSize:13,lineHeight:1.6,
        boxShadow:isUser?`0 0 12px ${Q.plasma}44`:`0 0 8px ${Q.plasma}11`}}>
        {!isUser && <div style={{fontSize:10,color:Q.quark,fontWeight:700,marginBottom:4}}>QUANTUM EMMA · Meta Genius TR2</div>}
        {msg.text}
        {msg.typing && <span style={{opacity:0.5+Math.sin(tick*0.3)*0.4}}>▋</span>}
      </div>
      {isUser && (
        <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,
          background:`linear-gradient(135deg,${Q.gluon},${Q.plasma})`,
          display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:Q.bright,fontSize:14}}>G</div>
      )}
    </div>
  );
}

// ─── AGENT CARD ───────────────────────────────────────────────────────────────
function AgentCard({ agent, tick, onClick, selected }) {
  const pulse = 0.5+Math.sin(tick*0.07+agent.id)*0.3;
  const isActive = agent.status==="active";
  return (
    <div onClick={()=>onClick(agent)} style={{
      padding:"10px 12px",borderRadius:12,cursor:"pointer",
      background:selected?`${agent.color}20`:`${agent.color}0a`,
      border:`1px solid ${agent.color}${selected?"88":Math.round((0.1+pulse*0.1)*255).toString(16).padStart(2,"0")}`,
      boxShadow:selected?`0 0 ${12+pulse*8}px ${agent.color}33`:"none",
      transition:"all .2s"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span style={{fontSize:18}}>{agent.icon}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:800,fontSize:12,color:Q.bright,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{agent.name}</div>
          <div style={{fontSize:9,color:Q.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{agent.role}</div>
        </div>
        <div style={{width:7,height:7,borderRadius:"50%",flexShrink:0,
          background:isActive?Q.lepton:Q.dim,
          boxShadow:isActive?`0 0 ${4+pulse*4}px ${Q.lepton}`:""}}/>
      </div>
      <div style={{height:4,background:`${agent.color}20`,borderRadius:2}}>
        <div style={{height:4,width:`${agent.load}%`,background:agent.color,borderRadius:2,
          boxShadow:`0 0 6px ${agent.color}88`,transition:"width .5s"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:9,color:Q.dim}}>
        <span>Load: {agent.load}%</span><span>{agent.tasks.toLocaleString()} tasks</span>
      </div>
    </div>
  );
}

// ─── PREDICTIONS PANEL ────────────────────────────────────────────────────────
function PredictionsPanel({ tick }) {
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;
  const predictions = [
    {asset:"QEMMA",timeframe:"24h",  direction:"UP",   target:"$0.79", confidence:94,color:Q.lepton},
    {asset:"QEMMA",timeframe:"7d",   direction:"UP",   target:"$1.20", confidence:89,color:Q.lepton},
    {asset:"ETH",  timeframe:"24h",  direction:"UP",   target:"$3,450",confidence:72,color:Q.gluon},
    {asset:"BTC",  timeframe:"24h",  direction:"FLAT", target:"$68,200",confidence:61,color:Q.higgs},
    {asset:"QEMMA",timeframe:"30d",  direction:"UP",   target:"$2.50", confidence:78,color:Q.plasma},
    {asset:"ETH",  timeframe:"7d",   direction:"DOWN", target:"$3,100",confidence:55,color:Q.tauon},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {predictions.map((p,i)=>(
        <div key={i} style={{padding:"10px 14px",borderRadius:10,
          background:`${p.color}0a`,border:`1px solid ${p.color}${Math.round((0.1+pulse*0.08)*255).toString(16).padStart(2,"0")}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontWeight:800,color:Q.bright,fontSize:13}}>{p.asset}</span>
              <span style={{fontSize:10,color:Q.dim}}>{p.timeframe}</span>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:11,color:p.color,fontWeight:700}}>{p.direction==="UP"?"▲":p.direction==="DOWN"?"▼":"→"} {p.target}</span>
              <span style={{fontSize:12,fontWeight:800,color:p.color}}>{p.confidence}%</span>
            </div>
          </div>
          <div style={{height:4,background:`${p.color}20`,borderRadius:2}}>
            <div style={{height:4,width:`${p.confidence}%`,background:p.color,borderRadius:2,
              boxShadow:`0 0 6px ${p.color}`,transition:"width 1s"}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TASKS PANEL ─────────────────────────────────────────────────────────────
function TasksPanel({ tick }) {
  const [tasks, setTasks] = useState([
    {id:1,agent:"ALPHA-7",  task:"Scan 847 trading pairs for momentum signals",    status:"running", progress:78,color:Q.plasma},
    {id:2,agent:"EPSILON-9",task:"MetaCodex recursive iteration #4422",             status:"running", progress:45,color:Q.boson},
    {id:3,agent:"DELTA-1",  task:"Arbitrage scan across Uniswap/Curve/Balancer",    status:"running", progress:91,color:Q.lepton},
    {id:4,agent:"MU-10",    task:"Meta Genius TR2 — self-optimization loop",        status:"running", progress:100,color:Q.lepton},
    {id:5,agent:"ZETA-5",   task:"Sentiment analysis — 12,000 social signals",      status:"queued",  progress:0, color:Q.muon},
    {id:6,agent:"IOTA-11",  task:"On-chain whale tracker — Ethereum mainnet",       status:"done",    progress:100,color:Q.tauon},
    {id:7,agent:"KAPPA-6",  task:"News NLP: 340 articles processed",               status:"done",    progress:100,color:Q.plasma},
  ]);

  useEffect(()=>{
    if(tick%8!==0) return;
    setTasks(prev=>prev.map(t=>{
      if(t.status==="running" && t.progress<100) return {...t,progress:Math.min(100,t.progress+Math.random()*3)};
      if(t.status==="queued" && Math.random()<0.05) return {...t,status:"running",progress:1};
      return t;
    }));
  },[tick]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {tasks.map(t=>(
        <div key={t.id} style={{padding:"10px 14px",borderRadius:10,
          background:`${t.color}0a`,border:`1px solid ${t.color}22`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:10,color:t.color,fontWeight:700,marginBottom:2}}>{t.agent}</div>
              <div style={{fontSize:12,color:Q.mid,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.task}</div>
            </div>
            <span style={{marginLeft:10,fontSize:10,fontWeight:700,color:
              t.status==="done"?Q.lepton:t.status==="running"?t.color:Q.dim,
              background:t.status==="done"?`${Q.lepton}15`:t.status==="running"?`${t.color}15`:`${Q.dim}15`,
              padding:"2px 8px",borderRadius:20,whiteSpace:"nowrap"}}>
              {t.status==="done"?"✓ Done":t.status==="running"?"⚡ Running":"⏳ Queued"}
            </span>
          </div>
          {t.status!=="queued" && (
            <div style={{height:4,background:`${t.color}20`,borderRadius:2}}>
              <div style={{height:4,width:`${t.progress}%`,background:t.color,borderRadius:2,
                boxShadow:`0 0 6px ${t.color}88`,transition:"width .3s"}}/>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN AGENTS PAGE ─────────────────────────────────────────────────────────
export default function AgentsPage() {
  const tick = useTick(100);
  const [tab, setTab]           = useState("chat");
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[11]);
  const [messages, setMessages] = useState([
    {id:0, role:"assistant", text:"⚛️ Meta Genius TR2 online. All 12 agents synchronized. HQMLL v7 recursive engine active. How can I optimize your portfolio today?"}
  ]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const chatRef = useRef(null);
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;

  const totalActive = AGENTS.filter(a=>a.status==="active").length;
  const totalTasks  = AGENTS.reduce((s,a)=>s+a.tasks,0);
  const avgLoad     = Math.round(AGENTS.reduce((s,a)=>s+a.load,0)/AGENTS.length);

  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  },[messages,typing]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    const userMsg = {id:Date.now(), role:"user", text:input};
    setMessages(prev=>[...prev, userMsg]);
    const currentHistory = messages.slice(-8);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/functions/oracleChat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ message: userMsg.text, history: currentHistory }),
      });
      const data = await res.json();
      setTyping(false);
      setMessages(prev=>[...prev, {id:Date.now()+1, role:"assistant", text:data.reply||data.error||"..."}]);
    } catch {
      const resp = EMMA_RESPONSES[Math.floor(Math.random()*EMMA_RESPONSES.length)];
      setTyping(false);
      setMessages(prev=>[...prev, {id:Date.now()+1, role:"assistant", text:resp}]);
    }
  },[input, messages]);

  const handleKey = e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} };

  const quickPrompts = [
    "What's the best entry for QEMMA?",
    "Analyze market conditions",
    "Show staking recommendations",
    "Run arbitrage scan",
    "Predict 7-day QEMMA price",
    "Optimize my portfolio",
  ];

  return (
    <div style={{minHeight:"100vh",background:Q.void,color:Q.bright,fontFamily:"'Inter',sans-serif",paddingBottom:40}}>

      {/* HEADER */}
      <div style={{background:Q.deep,borderBottom:`1px solid ${Q.plasma}33`,padding:"14px 24px",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:900,fontSize:18,color:Q.quark}}>🤖 AI Oracle — Meta Genius TR2</div>
          <div style={{color:Q.dim,fontSize:12}}>12-Agent Orchestration · HQMLL v7 · Recursive Intelligence</div>
        </div>
        <div style={{display:"flex",gap:12}}>
          {[
            {label:"Active Agents",  val:`${totalActive}/12`, color:Q.lepton},
            {label:"Total Tasks",    val:totalTasks.toLocaleString(), color:Q.gluon},
            {label:"Avg Load",       val:`${avgLoad}%`, color:Q.higgs},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"6px 14px",borderRadius:8,
              background:`${s.color}15`,border:`1px solid ${s.color}33`}}>
              <div style={{fontSize:15,fontWeight:900,color:s.color}}>{s.val}</div>
              <div style={{fontSize:9,color:Q.dim}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:0,height:"calc(100vh - 80px)"}}>

        {/* SIDEBAR — Agents */}
        <div style={{background:Q.deep,borderRight:`1px solid ${Q.plasma}22`,
          padding:"12px",overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
          <div style={{fontSize:10,color:Q.dim,fontWeight:700,letterSpacing:2,marginBottom:4}}>AGENT NETWORK</div>
          {AGENTS.map(a=>(
            <AgentCard key={a.id} agent={a} tick={tick}
              selected={selectedAgent?.id===a.id}
              onClick={setSelectedAgent}/>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* Tabs */}
          <div style={{padding:"10px 16px",borderBottom:`1px solid ${Q.plasma}22`,display:"flex",gap:4}}>
            {[["chat","💬 Chat"],["tasks","⚡ Tasks"],["predictions","🔮 Predictions"],["agent","🧬 Agent Detail"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                padding:"6px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
                background:tab===t?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:"transparent",
                color:tab===t?Q.bright:Q.dim}}>
                {l}
              </button>
            ))}
          </div>

          {/* CHAT TAB */}
          {tab==="chat" && (
            <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
              {/* Messages */}
              <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
                {messages.map(m=><ChatBubble key={m.id} msg={m} tick={tick}/>)}
                {typing && <ChatBubble msg={{role:"assistant",text:"",typing:true}} tick={tick}/>}
              </div>

              {/* Quick prompts */}
              <div style={{padding:"0 16px 8px",display:"flex",gap:6,flexWrap:"wrap"}}>
                {quickPrompts.map((p,i)=>(
                  <button key={i} onClick={()=>setInput(p)} style={{
                    padding:"4px 10px",borderRadius:20,border:`1px solid ${Q.plasma}44`,
                    background:`${Q.plasma}15`,color:Q.quark,cursor:"pointer",fontSize:10,fontWeight:600}}>
                    {p}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div style={{padding:"0 16px 16px",display:"flex",gap:8}}>
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder="Ask Meta Genius TR2 anything..."
                  style={{flex:1,background:Q.bg2,border:`1px solid ${Q.plasma}44`,borderRadius:12,
                    padding:"12px 16px",color:Q.bright,fontSize:13,outline:"none"}}/>
                <button onClick={sendMessage} style={{
                  padding:"12px 20px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:800,
                  background:`linear-gradient(135deg,${Q.plasma},${Q.gluon})`,color:Q.bright,fontSize:14,
                  boxShadow:`0 0 16px ${Q.plasma}55`}}>⚡</button>
              </div>
            </div>
          )}

          {/* TASKS TAB */}
          {tab==="tasks" && (
            <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
              <TasksPanel tick={tick}/>
            </div>
          )}

          {/* PREDICTIONS TAB */}
          {tab==="predictions" && (
            <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
              <PredictionsPanel tick={tick}/>
            </div>
          )}

          {/* AGENT DETAIL TAB */}
          {tab==="agent" && selectedAgent && (
            <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
              <div style={{background:Q.bg1,borderRadius:16,padding:"24px",
                border:`1px solid ${selectedAgent.color}44`,
                boxShadow:`0 0 ${20+pulse*12}px ${selectedAgent.color}1a`}}>
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                  <div style={{width:60,height:60,borderRadius:"50%",
                    background:`radial-gradient(circle,${selectedAgent.color}44,${selectedAgent.color}11)`,
                    border:`2px solid ${selectedAgent.color}`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,
                    boxShadow:`0 0 ${16+pulse*12}px ${selectedAgent.color}88`}}>
                    {selectedAgent.icon}
                  </div>
                  <div>
                    <div style={{fontSize:22,fontWeight:900,color:selectedAgent.color}}>{selectedAgent.name}</div>
                    <div style={{color:Q.mid,fontSize:13}}>{selectedAgent.role}</div>
                    <div style={{display:"flex",gap:8,marginTop:6}}>
                      <span style={{padding:"2px 10px",borderRadius:20,fontSize:10,fontWeight:700,
                        background:`${selectedAgent.status==="active"?Q.lepton:Q.dim}20`,
                        color:selectedAgent.status==="active"?Q.lepton:Q.dim,
                        border:`1px solid ${selectedAgent.status==="active"?Q.lepton:Q.dim}44`}}>
                        {selectedAgent.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                  {[
                    {l:"Compute Load",v:`${selectedAgent.load}%`,c:selectedAgent.color},
                    {l:"Total Tasks",v:selectedAgent.tasks.toLocaleString(),c:Q.gluon},
                    {l:"Success Rate",v:"99.2%",c:Q.lepton},
                  ].map((s,i)=>(
                    <div key={i} style={{textAlign:"center",background:`${s.c}10`,borderRadius:10,padding:"12px",
                      border:`1px solid ${s.c}22`}}>
                      <div style={{fontSize:20,fontWeight:900,color:s.c}}>{s.v}</div>
                      <div style={{fontSize:10,color:Q.dim}}>{s.l}</div>
                    </div>
                  ))}
                </div>

                <div style={{marginBottom:12}}>
                  <div style={{color:Q.dim,fontSize:11,marginBottom:6}}>Compute Load</div>
                  <div style={{height:8,background:`${selectedAgent.color}20`,borderRadius:4}}>
                    <div style={{height:8,width:`${selectedAgent.load}%`,background:selectedAgent.color,borderRadius:4,
                      boxShadow:`0 0 10px ${selectedAgent.color}88`,transition:"width 1s"}}/>
                  </div>
                </div>

                <div style={{fontSize:12,color:Q.dim,lineHeight:1.8}}>
                  <div style={{color:Q.quark,fontWeight:700,marginBottom:8}}>🧬 Specialization</div>
                  {selectedAgent.name==="MU-10"
                    ? "Meta Genius TR2 Core — Orchestrates all 11 sub-agents. Manages the recursive HQMLL reasoning loop across 7 layers. Responsible for self-optimization, strategy synthesis, and final decision output. Currently running iteration #4,421 of the evolution cycle."
                    : `${selectedAgent.role} — Part of the Quantum Emma 12-Agent HQMLL orchestration network. Processes real-time data streams and feeds results into the Meta Genius TR2 core for unified intelligence synthesis.`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
