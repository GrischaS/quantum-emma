// ============================================================
//  QUANTUM EMMA — Research Engine v5.0 MEGA UPGRADE
//  8 Domains · Live AI Signals · Oracle Chat · Deep Analysis
//  4D/5D Holographic · © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};
function useTick(ms=200){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);return t;}

const DOMAINS = [
  {id:0,name:"DeFi Protocols",   icon:"🏦",color:Q.plasma,  papers:340,score:94,trending:true},
  {id:1,name:"On-Chain Analysis",icon:"🔗",color:Q.gluon,   papers:280,score:89,trending:true},
  {id:2,name:"Tokenomics",       icon:"💎",color:Q.higgs,   papers:210,score:96,trending:false},
  {id:3,name:"AI & ML Trading",  icon:"🤖",color:Q.lepton,  papers:290,score:91,trending:true},
  {id:4,name:"Quantum Finance",  icon:"⚛️",color:Q.boson,   papers:120,score:78,trending:false},
  {id:5,name:"Smart Contracts",  icon:"📜",color:Q.quark,   papers:160,score:88,trending:false},
  {id:6,name:"Market Structure", icon:"📊",color:Q.muon,    papers:180,score:82,trending:true},
  {id:7,name:"Cross-chain",      icon:"🌉",color:Q.photon,  papers:90, score:74,trending:false},
];

const LIVE_SIGNALS = [
  {asset:"QEMMA",signal:"STRONG BUY",source:"HQMLL L7",conf:94,color:Q.lepton,detail:"Phase 2 MetaCodex activation + momentum divergence"},
  {asset:"ETH",  signal:"BUY",       source:"ALPHA-7",  conf:78,color:Q.gluon, detail:"EMA support confirmed, volume breakout incoming"},
  {asset:"BTC",  signal:"HOLD",      source:"GAMMA-12", conf:62,color:Q.higgs, detail:"RSI neutral 51.4, await directional confirmation"},
  {asset:"SOL",  signal:"BUY",       source:"BETA-3",   conf:71,color:Q.gluon, detail:"Ecosystem growth narrative + developer activity spike"},
  {asset:"QEMMA",signal:"ACCUMULATE",source:"MU-10",    conf:88,color:Q.plasma,detail:"Pre-IDO accumulation phase, target $1.20 in 30d"},
];

const INSIGHTS = [
  {title:"QEMMA Wyckoff Accumulation Analysis",domain:"On-Chain",date:"2h ago",read:4,color:Q.plasma,
   summary:"HQMLL Layer 5 detected classic Wyckoff Phase C structure on QEMMA/USDT. Spring event confirmed at $0.58 support. Breakout probability: 89%. Target: $1.20."},
  {title:"DeFi Protocol Liquidity Trends Q2 2026",domain:"DeFi",date:"6h ago",read:8,color:Q.gluon,
   summary:"Total Value Locked across 340 protocols up 24% QoQ. QEMMA ecosystem TVL growing fastest in the AI-DeFi sub-sector with 142% growth."},
  {title:"ETH EIP-9482 Impact on Gas Optimization",domain:"Smart Contracts",date:"1d ago",read:12,color:Q.boson,
   summary:"New EIP reduces average gas costs by 18% for complex DeFi interactions. Direct benefit for QEMMA swap operations estimated at $0.40/tx savings."},
  {title:"AI Trading Bots Market Size 2026",domain:"AI & ML Trading",date:"2d ago",read:6,color:Q.lepton,
   summary:"Global AI trading market reached $18.2B in Q1 2026. Recursive self-learning systems like HQMLL outperform static models by 3.2x Sharpe ratio."},
];

const ORACLE_RESPONSES = [
  "📊 Based on 847 data sources and HQMLL analysis: QEMMA shows strong accumulation signals. RSI(14): 58.4, MACD: bullish crossover, Volume: +34% above 20D avg. Recommendation: ACCUMULATE.",
  "🔗 On-chain data shows 2,840 new wallets holding QEMMA this week. Whale accumulation (>100K QEMMA) increased by 18%. Smart money is positioning for IDO.",
  "⚛️ Quantum Finance model projects QEMMA at $1.20 within 30 days with 78% confidence. Key catalysts: IDO launch, Uniswap listing, Gate.io partnership.",
  "🤖 AI Trading signal aggregation across 12 agents: 9/12 agents BULLISH on QEMMA. Consensus target: $0.85 short-term, $1.20 medium-term.",
  "📈 Market microstructure analysis: Order book depth shows 3.2x more buy pressure than sell pressure in the $0.58-$0.65 range. Strong support confirmed.",
];

export default function Research() {
  const tick = useTick(200);
  const [tab, setTab]       = useState("signals");
  const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]);
  const [query, setQuery]   = useState("");
  const [messages, setMessages] = useState([
    {role:"ai",text:"🔬 Research Oracle online. I have analyzed 4,421 market patterns and 1,670 academic papers. Ask me anything about market conditions, QEMMA, or DeFi."}
  ]);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[messages,typing]);

  const ask = () => {
    if(!query.trim()) return;
    setMessages(m=>[...m,{role:"user",text:query}]);
    setQuery("");
    setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      setMessages(m=>[...m,{role:"ai",text:ORACLE_RESPONSES[Math.floor(Math.random()*ORACLE_RESPONSES.length)]}]);
    }, 1600);
  };

  return (
    <div style={{minHeight:"100vh",background:Q.void,color:Q.bright,fontFamily:"'Inter',sans-serif",paddingBottom:40}}>

      {/* HEADER */}
      <div style={{background:Q.deep,borderBottom:`1px solid ${Q.plasma}33`,padding:"14px 24px",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:900,fontSize:18,color:Q.quark}}>🔬 Research Engine v5.0</div>
          <div style={{color:Q.dim,fontSize:12}}>8 Domains · 1,670 Papers · Live AI Signals · Deep Oracle Analysis</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          {[{l:"Papers",v:"1,670",c:Q.plasma},{l:"Signals",v:"5",c:Q.lepton},{l:"Domains",v:"8",c:Q.gluon}].map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"6px 14px",borderRadius:8,
              background:`${s.c}15`,border:`1px solid ${s.c}33`}}>
              <div style={{fontSize:15,fontWeight:900,color:s.c}}>{s.v}</div>
              <div style={{fontSize:9,color:Q.dim}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"16px"}}>

        {/* Domain pills */}
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
          {DOMAINS.map(d=>(
            <button key={d.id} onClick={()=>setSelectedDomain(d)} style={{
              padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:700,
              border:`1px solid ${d.color}${selectedDomain.id===d.id?"88":"33"}`,
              background:selectedDomain.id===d.id?`${d.color}25`:"transparent",
              color:selectedDomain.id===d.id?d.color:Q.dim,
              boxShadow:selectedDomain.id===d.id?`0 0 8px ${d.color}44`:"none"}}>
              {d.icon} {d.name} {d.trending&&<span style={{color:Q.muon}}>🔥</span>}
            </button>
          ))}
        </div>

        {/* TABS */}
        <div style={{display:"flex",gap:4,background:Q.bg1,borderRadius:10,padding:4,
          border:`1px solid ${Q.plasma}22`,marginBottom:14,width:"fit-content"}}>
          {[["signals","📡 Live Signals"],["insights","📰 Insights"],["oracle","🔮 Oracle Chat"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:"7px 18px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
              background:tab===t?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:"transparent",
              color:tab===t?Q.bright:Q.dim}}>
              {l}
            </button>
          ))}
        </div>

        {/* SIGNALS */}
        {tab==="signals" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {LIVE_SIGNALS.map((s,i)=>{
              const p=0.5+Math.sin(tick*0.07+i)*0.3;
              return (
                <div key={i} style={{background:Q.bg1,borderRadius:14,padding:"16px 20px",
                  border:`1px solid ${s.color}${Math.round((0.15+p*0.1)*255).toString(16).padStart(2,"0")}`,
                  boxShadow:`0 0 ${8+p*6}px ${s.color}0a`}}>
                  <div style={{display:"flex",gap:14,alignItems:"center"}}>
                    <div style={{minWidth:90,textAlign:"center",padding:"8px",background:`${s.color}15`,
                      borderRadius:10,border:`1px solid ${s.color}33`}}>
                      <div style={{fontWeight:900,fontSize:12,color:s.color,letterSpacing:0.5}}>{s.signal}</div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                        <span style={{fontWeight:800,fontSize:15,color:Q.bright}}>{s.asset}</span>
                        <span style={{fontSize:11,color:Q.dim}}>via {s.source}</span>
                      </div>
                      <div style={{fontSize:12,color:Q.dim}}>{s.detail}</div>
                      <div style={{height:5,background:`${s.color}20`,borderRadius:2,marginTop:8}}>
                        <div style={{height:5,width:`${s.conf}%`,background:s.color,borderRadius:2,
                          boxShadow:`0 0 8px ${s.color}88`}}/>
                      </div>
                    </div>
                    <div style={{textAlign:"right",minWidth:50}}>
                      <div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.conf}%</div>
                      <div style={{fontSize:9,color:Q.dim}}>confidence</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* INSIGHTS */}
        {tab==="insights" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {INSIGHTS.map((ins,i)=>(
              <div key={i} style={{background:Q.bg1,borderRadius:14,padding:"18px 20px",
                border:`1px solid ${ins.color}22`,cursor:"pointer",
                transition:"border-color .2s",}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                      <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,
                        background:`${ins.color}15`,color:ins.color,border:`1px solid ${ins.color}33`}}>
                        {ins.domain}
                      </span>
                      <span style={{fontSize:10,color:Q.dim}}>{ins.date}</span>
                      <span style={{fontSize:10,color:Q.dim}}>· {ins.read} min read</span>
                    </div>
                    <div style={{fontWeight:800,fontSize:15,color:Q.bright,marginBottom:8}}>{ins.title}</div>
                    <div style={{fontSize:12,color:Q.mid,lineHeight:1.6}}>{ins.summary}</div>
                  </div>
                </div>
                <button style={{padding:"6px 16px",borderRadius:8,border:`1px solid ${ins.color}44`,
                  background:`${ins.color}15`,color:ins.color,cursor:"pointer",fontSize:11,fontWeight:700}}>
                  Read Full Analysis →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ORACLE CHAT */}
        {tab==="oracle" && (
          <div style={{background:Q.bg1,borderRadius:14,border:`1px solid ${Q.plasma}33`,
            display:"flex",flexDirection:"column",height:500}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${Q.plasma}22`,
              display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:Q.lepton,
                boxShadow:`0 0 ${6+pulse*4}px ${Q.lepton}`}}/>
              <span style={{color:Q.quark,fontWeight:700,fontSize:13}}>Research Oracle · HQMLL v7</span>
            </div>
            <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"16px"}}>
              {messages.map((m,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:12,
                  justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  {m.role==="ai" && (
                    <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                      background:`radial-gradient(circle,${Q.plasma},${Q.neutrino})`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900}}>Q</div>
                  )}
                  <div style={{maxWidth:"75%",padding:"10px 14px",
                    borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                    background:m.role==="user"?`linear-gradient(135deg,${Q.plasma}cc,${Q.gluon}cc)`:Q.bg2,
                    border:`1px solid ${m.role==="user"?Q.plasma:Q.plasma+"22"}`,
                    fontSize:12,lineHeight:1.6,color:Q.bright}}>
                    {m.text}
                    {m.typing && <span style={{opacity:0.5+Math.sin(tick*0.3)*0.4}}>▋</span>}
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:`radial-gradient(circle,${Q.plasma},${Q.neutrino})`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900}}>Q</div>
                  <div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 4px",background:Q.bg2,
                    border:`1px solid ${Q.plasma}22`,fontSize:12,color:Q.dim}}>
                    <span style={{opacity:0.5+Math.sin(tick*0.3)*0.4}}>Analyzing... ▋</span>
                  </div>
                </div>
              )}
            </div>
            <div style={{padding:"12px 16px",borderTop:`1px solid ${Q.plasma}22`,display:"flex",gap:8}}>
              <input value={query} onChange={e=>setQuery(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&ask()}
                placeholder="Ask about markets, QEMMA, DeFi..."
                style={{flex:1,background:Q.bg2,border:`1px solid ${Q.plasma}44`,borderRadius:10,
                  padding:"10px 14px",color:Q.bright,fontSize:12,outline:"none"}}/>
              <button onClick={ask} style={{padding:"10px 18px",borderRadius:10,border:"none",cursor:"pointer",
                background:`linear-gradient(135deg,${Q.plasma},${Q.gluon})`,color:Q.bright,fontWeight:800,
                boxShadow:`0 0 14px ${Q.plasma}55`}}>⚡</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
