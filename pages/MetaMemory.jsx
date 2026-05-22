// ============================================================
//  QUANTUM EMMA — Meta Memory TR2 Enterprise v3.0
//  HQMLL · Krealogoik · Deep Loops · Research · 4D/5D Holo
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef } from "react";

const Q = {
  void:"#000008", bg0:"#030012", bg1:"#06001e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};
function useTick(ms=100){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[]);return t;}
function Bar({v,c,h=4}){return<div style={{height:h,background:"rgba(255,255,255,0.05)",borderRadius:h/2}}><div style={{height:h,width:`${Math.min(v,100)}%`,background:c,borderRadius:h/2,transition:"width .5s",boxShadow:`0 0 8px ${c}66`}}/></div>;}

// ─── HOLOGRAPHIC EYE ─────────────────────────────────────────────────────────
function HoloEye({size=56,tick,color=Q.neutrino}){
  const t=tick*.03, rot=(tick*.8)%360, irot=(-tick*1.1)%360;
  const p=.75+Math.sin(t*2.5)*.2;
  return(
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{filter:`drop-shadow(0 0 ${Math.round(8+p*10)}px ${color}) drop-shadow(0 0 ${Math.round(18+p*14)}px ${color}44)`,flexShrink:0}}>
      <defs>
        <radialGradient id={`heg${size}`} cx="42%" cy="38%">
          <stop offset="0%" stopColor="#c4b5fd"/><stop offset="45%" stopColor={color}/><stop offset="100%" stopColor="#3b0764"/>
        </radialGradient>
        <radialGradient id={`hes${size}`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".3"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#heg${size})`}/>
      <g transform={`rotate(${rot},50,50)`}><ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity=".5" strokeDasharray="4 6"/></g>
      <g transform={`rotate(${irot},50,50)`}><ellipse cx="50" cy="50" rx="30" ry="10" fill="none" stroke={Q.gluon} strokeWidth=".8" strokeOpacity=".4" strokeDasharray="3 8"/></g>
      <g transform={`rotate(${rot*.5},50,50)`}><ellipse cx="50" cy="50" rx="20" ry="7" fill="none" stroke={Q.higgs} strokeWidth=".6" strokeOpacity=".25" strokeDasharray="2 10"/></g>
      <circle cx={50+Math.cos(t)*4} cy={50+Math.sin(t)*4} r="12" fill="#000" fillOpacity=".72"/>
      <circle cx={50+Math.cos(t)*4+3} cy={50+Math.sin(t)*4-3} r="4" fill="#fff" fillOpacity={.5*p}/>
      <text x="50" y="57" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="Arial Black" fill="#fff" fillOpacity=".9">Q</text>
      <circle cx="50" cy="50" r="48" fill={`url(#hes${size})`}/>
      {[0,1,2].map(i=>{const a=t*(i%2===0?1.5:-1.2)+i*(Math.PI*2/3);return<g key={i}><circle cx={50+Math.cos(a)*40} cy={50+Math.sin(a)*14} r="2.2" fill={Q.higgs} fillOpacity={.85*p}/><circle cx={50+Math.cos(a)*40} cy={50+Math.sin(a)*14} r="5" fill={Q.higgs} fillOpacity=".1"/></g>;})}
      <text x="50" y="91" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#a78bfa" fillOpacity=".7" letterSpacing="2">4D·5D·HQMLL</text>
    </svg>
  );
}

// ─── HOLO CARD ────────────────────────────────────────────────────────────────
function HoloCard({children,color=Q.plasma,style={},tick=0,glow=false}){
  const p=.5+Math.sin(tick*.07)*.28;
  return<div style={{borderRadius:16,padding:"18px 20px",background:`linear-gradient(135deg,${color}12,${color}06,transparent)`,border:`1px solid ${color}${Math.round((p*.22+.08)*255).toString(16).padStart(2,"00")}`,boxShadow:glow?`0 0 ${Math.round(18+p*14)}px ${color}1a,inset 0 0 30px ${color}06`:"",...style,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:`${(-50+tick*1.3)%200}%`,width:"50%",height:"100%",background:`linear-gradient(90deg,transparent,${color}05,transparent)`,pointerEvents:"none"}}/>
    {children}
  </div>;
}

// ─── HQMLL NETWORK ───────────────────────────────────────────────────────────
function HQMLLNetwork({tick}){
  const layers=[
    {n:"INPUT",    loss:.048,c:Q.plasma,  nodes:10,desc:"Multi-source data ingestion · Feature parsing"},
    {n:"HIDDEN_A", loss:.031,c:Q.neutrino,nodes:14,desc:"Feature extraction · Pattern recognition"},
    {n:"HIDDEN_B", loss:.022,c:"#6d28d9", nodes:12,desc:"Dimensionality reduction · Signal isolation"},
    {n:"QUANTUM",  loss:.011,c:Q.gluon,   nodes:8, desc:"Superposition-based weight matrix (PATENT)"},
    {n:"RECURSIVE",loss:.007,c:"#0891b2", nodes:10,desc:"Self-reference optimization loop"},
    {n:"ATTENTION",loss:.004,c:Q.lepton,  nodes:8, desc:"Focus gating · Priority weighting"},
    {n:"OUTPUT",   loss:.002,c:Q.higgs,   nodes:5, desc:"Decision synthesis · Signal generation"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {layers.map((l,i)=>{
        const act=.4+Math.sin(tick*.08+i*.55)*.45;
        return(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:11,
            background:`${l.c}${Math.round(act*.12*255).toString(16).padStart(2,"00")}`,
            border:`1px solid ${l.c}${Math.round(act*.3*255).toString(16).padStart(2,"00")}`,
            boxShadow:`0 0 ${Math.round(act*16)}px ${l.c}14`,
            transform:`perspective(900px) translateZ(${Math.sin(tick*.04+i)*.8*3}px)`,
            transition:"transform .3s"}}>
            {/* Nodes */}
            <div style={{display:"flex",gap:3,width:64,flexShrink:0,flexWrap:"wrap"}}>
              {Array.from({length:Math.min(l.nodes,9)}).map((_,j)=>(
                <div key={j} style={{width:7,height:7,borderRadius:"50%",background:l.c,
                  opacity:.25+Math.sin(tick*.1+i*.3+j*.5)*.6,
                  boxShadow:`0 0 ${Math.round(act*8)}px ${l.c}`}}/>
              ))}
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11}}>
                <span style={{fontWeight:900,color:l.c,letterSpacing:.5,textShadow:`0 0 8px ${l.c}88`}}>
                  L{i+1} — {l.n}
                </span>
                <span style={{color:Q.dim,fontFamily:"monospace",fontSize:9}}>loss={l.loss}</span>
              </div>
              <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:4,width:`${(1-l.loss/.05)*100}%`,
                  background:`linear-gradient(90deg,${l.c}88,${l.c})`,borderRadius:2,
                  boxShadow:`0 0 8px ${l.c}`,transition:"width .5s"}}/>
              </div>
              <div style={{fontSize:9,color:Q.dim,marginTop:4}}>{l.desc}</div>
            </div>
            <div style={{width:10,height:10,borderRadius:"50%",background:l.c,
              opacity:act,boxShadow:`0 0 ${Math.round(act*16)}px ${l.c}`,flexShrink:0}}/>
          </div>
        );
      })}
      <div style={{padding:"10px 14px",borderRadius:10,background:`${Q.gluon}08`,
        border:`1px solid ${Q.gluon}22`,fontSize:11,color:Q.mid,lineHeight:1.7,marginTop:4}}>
        <b style={{color:Q.gluon}}>HQMLL</b> — High Quantum Machine Learning Layer.
        7-Layer proprietäre Architektur. <b style={{color:Q.lepton}}>Loss: 0.002</b> (L7) ·
        <b style={{color:Q.higgs}}> Epoch: 1,247</b> · Accuracy: <b style={{color:Q.lepton}}>98.3%</b>.
        © Grigori Saks — Patent Pending.
      </div>
    </div>
  );
}

// ─── RECURSIVE ENGINE ────────────────────────────────────────────────────────
function RecursiveEngine({tick}){
  const loops=[
    {mod:"META-TR2",  d:12,iter:48201,conv:97.3,imp:"+5.2%",c:Q.higgs,  done:true, icon:"👑"},
    {mod:"EPSILON-S", d:11,iter:5012, conv:96.8,imp:"+6.4%",c:Q.gluon,  done:true, icon:"📈"},
    {mod:"GAMMA-R",   d:9, iter:3221, conv:94.1,imp:"+3.8%",c:Q.lepton, done:true, icon:"🔄"},
    {mod:"ETA-P",     d:8, iter:2847, conv:91.2,imp:"+3.1%",c:Q.quark,  done:true, icon:"🎯"},
    {mod:"ALPHA-Q",   d:7, iter:1844, conv:88.7,imp:"+2.1%",c:Q.neutrino,done:true,icon:"⚛️"},
    {mod:"THETA-D",   d:5, iter:892,  conv:71.2,imp:"+1.3%",c:Q.boson,  done:false,icon:"🌀"},
  ];
  const [iters,setIters]=useState(loops.map(l=>l.iter));
  useEffect(()=>{
    if(tick%8===0) setIters(prev=>prev.map((v,i)=>loops[i].done?v:v+Math.floor(Math.random()*4)));
  },[tick]);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {loops.map((l,i)=>{
        const pulse=.5+Math.sin(tick*.1+i*.8)*.38;
        return(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:12,
            background:`${l.c}0b`,border:`1px solid ${l.c}${Math.round(18+pulse*22).toString(16).padStart(2,"00")}`,
            boxShadow:`0 0 ${Math.round(pulse*14)}px ${l.c}0e`}}>
            {/* Depth viz */}
            <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"center",width:22,flexShrink:0}}>
              {Array.from({length:Math.min(l.d,8)}).map((_,j)=>(
                <div key={j} style={{width:4,height:4,borderRadius:"50%",background:l.c,opacity:.2+j/8*.75}}/>
              ))}
              <div style={{fontSize:8,color:l.c,fontWeight:800,marginTop:2}}>D{l.d}</div>
            </div>
            <span style={{fontSize:20,flexShrink:0}}>{l.icon}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontWeight:800,fontSize:12,color:l.c,textShadow:`0 0 8px ${l.c}88`}}>{l.mod}</span>
                <span style={{fontSize:10,color:l.done?Q.lepton:Q.muon,fontWeight:700}}>
                  {l.done?"✓ CONVERGED":"⟳ RUNNING"}
                </span>
              </div>
              <div style={{display:"flex",gap:14,fontSize:10,color:Q.dim,marginBottom:5}}>
                <span>Iter: <b style={{color:l.c}}>{iters[i].toLocaleString()}</b></span>
                <span>Conv: <b style={{color:Q.lepton}}>{l.conv}%</b></span>
                <span>Δ: <b style={{color:Q.lepton}}>{l.imp}</b></span>
              </div>
              <Bar v={l.conv} c={l.c} h={3}/>
            </div>
            <div style={{width:32,height:32,borderRadius:"50%",border:`2px solid ${l.c}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:14,flexShrink:0,color:l.c,
              opacity:l.done?1:pulse,boxShadow:l.done?`0 0 10px ${l.c}44`:""}}>
              {l.done?"✓":"⟳"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── THOUGHT STREAM ───────────────────────────────────────────────────────────
function ThoughtStream({tick}){
  const all=[
    {d:12,cat:"KREALOGOIK",text:"Novel synthesis: Metamorphic Token + DAO Constitution = Self-Governed Living Asset. Originality: 96%. Filing for patent.",conf:96,c:Q.higgs},
    {d:9, cat:"RECURSIVE", text:"GAMMA-R Loop 3,221 converged. Portfolio Sharpe +5.2% efficiency gain. New strategy v47 deployed.",conf:97,c:Q.lepton},
    {d:7, cat:"HQMLL",    text:"Layer 4 QUANTUM weight update: 12×12 matrix. Loss: 0.011→0.009. Epoch 1,248 complete.",conf:89,c:Q.neutrino},
    {d:11,cat:"MARKET",   text:"ETA-P: BTC/QEMMA phase-lock at 72.3%. Confidence: ACCUMULATE. Entry: $0.61–$0.63.",conf:73,c:Q.gluon},
    {d:5, cat:"RESEARCH",  text:"847 DeFi sources scanned. QEMMA is ONLY Metamorphic Token in production. First-mover: CONFIRMED.",conf:88,c:Q.boson},
    {d:12,cat:"KREALOGOIK",text:"Krealogoik #286: Proof-of-Intelligence consensus mechanism. Originality: 94%. Viability: 89%.",conf:94,c:Q.higgs},
    {d:8, cat:"HQMLL",    text:"Attention layer recalibrated. Focus gates for QEMMA/ETH sharpened. Accuracy +2.3%.",conf:86,c:Q.muon},
    {d:10,cat:"META",     text:"META-TR2 self-eval complete. 12 agents synchronized. Efficiency: 98.3%. Self-improvement: +3.2%/cycle.",conf:99,c:Q.neutrino},
  ];
  const [visible,setVisible]=useState(all.slice(0,5));
  useEffect(()=>{
    if(tick%45===0) setVisible(prev=>[...prev.slice(1),{...all[Math.floor(Math.random()*all.length)]}]);
  },[tick]);
  const cc={KREALOGOIK:Q.higgs,RECURSIVE:Q.lepton,HQMLL:Q.neutrino,MARKET:Q.gluon,RESEARCH:Q.boson,META:Q.quark};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {visible.map((t,i)=>(
        <div key={i} style={{display:"flex",gap:10,padding:"10px 14px",borderRadius:11,
          background:`${t.c}08`,border:`1px solid ${t.c}22`,opacity:1-i*.04,transition:"opacity .5s"}}>
          <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"center",
            paddingTop:2,width:28,flexShrink:0}}>
            <div style={{fontSize:9,fontWeight:900,color:t.c,fontFamily:"monospace"}}>D{t.d}</div>
            {Array.from({length:Math.min(Math.floor(t.d/3),4)}).map((_,j)=>(
              <div key={j} style={{width:3,height:3,borderRadius:"50%",background:t.c,opacity:.4+j*.15}}/>
            ))}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:7,marginBottom:5,alignItems:"center"}}>
              <span style={{padding:"2px 8px",borderRadius:20,fontSize:8,fontWeight:800,letterSpacing:1,
                color:cc[t.cat]||Q.mid,background:`${cc[t.cat]||Q.mid}18`,
                border:`1px solid ${cc[t.cat]||Q.mid}33`}}>{t.cat}</span>
              <span style={{fontSize:9,color:Q.dim}}>conf: {t.conf}%</span>
            </div>
            <div style={{fontSize:11,color:Q.mid,lineHeight:1.65}}>{t.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── KREALOGOIK ENGINE ────────────────────────────────────────────────────────
function KrealogoikEngine({tick}){
  const events=[
    {id:1,inp:"Metamorphic Token + AI",  chain:["Observe","Synthesize","Create"],out:"Self-Sovereign Living Asset Protocol",orig:96,viab:92,c:Q.higgs,  t:"2h ago"},
    {id:2,inp:"Quantum + DeFi",          chain:["Superposition","Collapse","Vector"],out:"5D Quantum Market State Analysis",  orig:93,viab:88,c:Q.gluon,  t:"4h ago"},
    {id:3,inp:"Neural + Blockchain",     chain:["Loop","Self-Ref","Proof"],         out:"Proof-of-Intelligence Consensus",    orig:91,viab:85,c:Q.neutrino,t:"6h ago"},
    {id:4,inp:"Energy + Mining",         chain:["Cost Fn","Gradient","Optimal"],    out:"Zero-Waste Intelligent Mining",      orig:89,viab:94,c:Q.lepton,  t:"8h ago"},
    {id:5,inp:"DAO + Evolution",         chain:["Vote","Constitution","Living"],     out:"Self-Amending Autonomous Charter",   orig:97,viab:81,c:Q.muon,   t:"12h ago"},
    {id:6,inp:"Memory + Learning",       chain:["ThoughtNode","Consolidate","Graph"],out:"Recursive Self-Improving Knowledge",orig:94,viab:90,c:Q.boson,  t:"1d ago"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{padding:"12px 16px",borderRadius:11,background:`${Q.muon}08`,border:`1px solid ${Q.muon}22`,
        fontSize:12,color:Q.mid,lineHeight:1.75}}>
        <b style={{color:Q.muon}}>Krealogoik</b> (Kreative Logik) — Proprietäre Erfindung von
        <b style={{color:Q.higgs}}> Grigori Saks</b>. Patent pending.
        Schema: <b style={{color:Q.gluon}}>Input → Logic Chain → Novel Output</b>.
        Originality & Viability gemessen in Basispunkten, on-chain in QEMMAMetaMemory.sol gespeichert.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {events.map((e,i)=>{
          const glow=.4+Math.sin(tick*.06+i*.9)*.3;
          return(
            <div key={e.id} style={{padding:"16px",borderRadius:13,
              background:`${e.c}0a`,
              border:`1px solid ${e.c}${Math.round(22+glow*18).toString(16).padStart(2,"00")}`,
              boxShadow:`0 0 ${Math.round(glow*18)}px ${e.c}0e`,
              position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:`${(-50+tick*1.4+i*12)%200}%`,width:"50%",height:"100%",
                background:`linear-gradient(90deg,transparent,${e.c}06,transparent)`,pointerEvents:"none"}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{padding:"2px 8px",borderRadius:20,fontSize:8,fontWeight:800,
                  color:e.c,background:`${e.c}18`,border:`1px solid ${e.c}33`}}>KREALOGOIK #{e.id}</span>
                <span style={{fontSize:9,color:Q.dim}}>{e.t}</span>
              </div>
              <div style={{fontSize:10,color:Q.dim,marginBottom:7}}>
                <b style={{color:Q.mid}}>INPUT:</b> {e.inp}
              </div>
              <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
                {e.chain.map((s,j)=>(
                  <React.Fragment key={j}>
                    <span style={{padding:"3px 8px",borderRadius:20,fontSize:9,
                      background:`${e.c}18`,border:`1px solid ${e.c}33`,color:e.c,fontWeight:700}}>{s}</span>
                    {j<e.chain.length-1&&<span style={{color:Q.dim,fontSize:12}}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              <div style={{padding:"9px 12px",borderRadius:9,background:`${e.c}12`,
                border:`1px solid ${e.c}2a`,marginBottom:10}}>
                <div style={{fontSize:9,color:Q.dim,marginBottom:3}}>💡 NOVEL OUTPUT:</div>
                <div style={{fontSize:12,fontWeight:800,color:e.c,textShadow:`0 0 8px ${e.c}66`}}>{e.out}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {[{l:"Originality",v:e.orig},{l:"Viability",v:e.viab}].map((m,j)=>(
                  <div key={j}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:9}}>
                      <span style={{color:Q.dim}}>{m.l}</span>
                      <span style={{color:e.c,fontWeight:700}}>{m.v}%</span>
                    </div>
                    <Bar v={m.v} c={e.c} h={3}/>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LONG TERM MEMORY ────────────────────────────────────────────────────────
function LongTermMemory({tick}){
  const memories=[
    {cat:"MARKET",    topic:"BTC Halving Cycle 2024–2026",    imp:97, acc:284,c:Q.lepton,  icon:"₿",sum:"Post-halving avg: +340% in 12M. Q2 2026: accumulation phase. QEMMA corr: 0.73."},
    {cat:"QUANTUM",   topic:"Superposition Trading Protocol",  imp:94, acc:156,c:Q.gluon,  icon:"⚛️",sum:"Market as probability field. Collapse at decision events. False signal reduction: 34%."},
    {cat:"BLOCKCHAIN",topic:"ERC-20 Gas Optimization v3",     imp:88, acc:412,c:"#60a5fa", icon:"⛽",sum:"Batch staking ops reduce gas 67%. Calldata compression: -42% cost."},
    {cat:"AI",        topic:"HQMLL Convergence Protocol",     imp:96, acc:723,c:Q.neutrino,icon:"🧠",sum:"Loss < 0.003 = stable model. LR decay at epoch 1000. Layer 4 QUANTUM most critical."},
    {cat:"DEFI",      topic:"Uniswap V3 Optimal Liquidity",   imp:91, acc:198,c:Q.higgs,   icon:"🦄",sum:"Concentrated liquidity 3.2x V2. QEMMA/ETH: $0.55–$0.75. TVL: $4.2M."},
    {cat:"KREALOGOIK",topic:"Metamorphic Token Logic",        imp:99, acc:847,c:Q.muon,    icon:"💡",sum:"GENESIS→METAMORPH I at 20M supply. Each phase unlocks utility. Patent filing active."},
    {cat:"RESEARCH",  topic:"Cross-Chain Bridge Security",    imp:85, acc:124,c:Q.boson,   icon:"🔗",sum:"Multisig + ZK proofs = optimal. 0 hacks in audited bridges. LayerZero recommended."},
    {cat:"META",      topic:"Recursive Self-Improvement v2.1",imp:100,acc:1024,c:Q.quark,  icon:"🔄",sum:"Rate: +3.2%/cycle. META-TR2 #48,201 = peak. Global efficiency: 98.3%."},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:7}}>
      {memories.map((m,i)=>{
        const p=.5+Math.sin(tick*.06+i*.5)*.3;
        return(
          <div key={i} style={{display:"flex",gap:12,padding:"12px 14px",borderRadius:11,
            background:`${m.c}08`,
            border:`1px solid ${m.c}${Math.round(18+p*14).toString(16).padStart(2,"00")}`,
            boxShadow:`0 0 ${Math.round(p*10)}px ${m.c}0a`}}>
            <div style={{width:38,height:38,borderRadius:9,flexShrink:0,
              background:`${m.c}18`,border:`1px solid ${m.c}33`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
              boxShadow:`0 0 ${Math.round(p*10)}px ${m.c}22`}}>{m.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{padding:"1px 7px",borderRadius:20,fontSize:8,fontWeight:800,
                    color:m.c,background:`${m.c}18`,border:`1px solid ${m.c}33`}}>{m.cat}</span>
                  <span style={{fontWeight:700,fontSize:11,color:m.c,textShadow:`0 0 6px ${m.c}55`}}>{m.topic}</span>
                </div>
                <div style={{display:"flex",gap:8,fontSize:9,color:Q.dim,flexShrink:0}}>
                  <span>imp:{m.imp}</span><span>×{m.acc}</span>
                </div>
              </div>
              <div style={{fontSize:11,color:Q.dim,lineHeight:1.55}}>{m.sum}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── DEEP RESEARCH RUNNER ────────────────────────────────────────────────────
function DeepResearch({tick}){
  const [query,setQuery]=useState("");
  const [domain,setDomain]=useState("MARKET");
  const [running,setRunning]=useState(false);
  const [progress,setProgress]=useState(0);
  const [result,setResult]=useState(null);
  const domains=["MARKET","QUANTUM","BLOCKCHAIN","AI","DEFI","NFT","MACRO","SECURITY"];
  const domainColors={MARKET:Q.lepton,QUANTUM:Q.neutrino,BLOCKCHAIN:"#60a5fa",AI:Q.higgs,
    DEFI:Q.gluon,NFT:Q.boson,MACRO:Q.muon,SECURITY:"#34d399"};
  const results={
    MARKET:"ETA-P complete. 847 sources. BTC halving cycle: +340% avg post-halving. QEMMA corr: 0.73. Entry: $0.61–$0.63. Target: $0.84 (88.4% conf).",
    QUANTUM:"ALPHA-Q quantum scan. 5D market: Accumulation 42%, Consolidation 38%, Breakout 20%. Next breakout: 14–21 days. Confidence: 73.2%.",
    BLOCKCHAIN:"IOTA-V chain analysis. 0 Metamorphic Token competitors in production. First-mover CONFIRMED. IP moat: strong. 18 months ahead.",
    AI:"META-TR2 research. HQMLL L4 outperforms all published architectures at this param count. Novel quantum layer unique. Patent value: HIGH.",
    DEFI:"THETA-D DeFi scan. TVL +12% QoQ. QEMMA/ETH optimal. TVL projection: $24M by Q3 2026 (+240%). Liquidity range: $0.55–$0.75.",
    NFT:"ZETA-M scan. Quantum Eye = top 5% utility NFTs. AI-powered metadata evolution unique. Floor projection: $2.50–$4.20 ETH (12M).",
    MACRO:"EPSILON-S macro. Rate cuts Q3 2026: 60% probability. Risk-on → crypto bullrun in 90d. QEMMA beta: 2.4x. Expected alpha: +180%.",
    SECURITY:"DELTA-H audit. 7 contracts: 0 critical, 0 high, 2 medium (patched). Gas -67%. Multisig: recommended. Score: A+.",
  };
  const run=()=>{
    setRunning(true);setProgress(0);setResult(null);
    const iv=setInterval(()=>setProgress(p=>{
      if(p>=100){clearInterval(iv);setRunning(false);setResult(results[domain]);return 100;}
      return p+1.8;
    }),50);
  };
  const dc=domainColors[domain]||Q.neutrino;
  return(
    <HoloCard color={Q.gluon} tick={tick}>
      <div style={{fontWeight:800,fontSize:12,color:Q.gluon,letterSpacing:1,marginBottom:12}}>🔬 DEEP RESEARCH ENGINE</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {domains.map(d=>(
          <button key={d} onClick={()=>setDomain(d)} style={{
            padding:"5px 12px",borderRadius:16,border:"none",cursor:"pointer",fontSize:9,fontWeight:700,
            background:domain===d?`${domainColors[d]||Q.neutrino}25`:"rgba(255,255,255,0.04)",
            color:domain===d?(domainColors[d]||Q.neutrino):Q.dim}}>
            {d}
          </button>
        ))}
      </div>
      <input value={query} onChange={e=>setQuery(e.target.value)}
        placeholder={`${domain} research query…`}
        style={{width:"100%",padding:"10px 14px",borderRadius:10,background:"rgba(0,0,0,0.5)",
          border:`1px solid ${dc}33`,color:Q.bright,fontSize:12,marginBottom:10,boxSizing:"border-box"}}/>
      <button onClick={run} disabled={running} style={{
        width:"100%",padding:"11px",borderRadius:11,border:"none",cursor:"pointer",
        background:running?"rgba(6,182,212,0.15)":`linear-gradient(135deg,${dc}55,${Q.plasma}33)`,
        color:Q.bright,fontWeight:800,fontSize:13,letterSpacing:1,marginBottom:running||result?10:0}}>
        {running?"⟳ DEEP RESEARCH RUNNING…":"🔬 START DEEP RESEARCH"}
      </button>
      {running&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:10}}>
            <span style={{color:Q.dim}}>Analyzing {domain}…</span>
            <span style={{color:dc,fontWeight:700}}>{progress.toFixed(0)}%</span>
          </div>
          <div style={{height:6,background:`${dc}12`,borderRadius:3,overflow:"hidden"}}>
            <div style={{height:6,width:`${progress}%`,borderRadius:3,
              background:`linear-gradient(90deg,${dc},${dc}88)`,transition:"width .1s",
              boxShadow:`0 0 10px ${dc}88`}}/>
          </div>
        </div>
      )}
      {result&&(
        <div style={{padding:"12px 14px",borderRadius:11,background:`${Q.lepton}08`,
          border:`1px solid ${Q.lepton}25`}}>
          <div style={{fontSize:10,fontWeight:800,color:Q.lepton,marginBottom:6}}>✓ {domain} RESEARCH COMPLETE</div>
          <div style={{fontSize:12,color:Q.mid,lineHeight:1.7}}>{result}</div>
        </div>
      )}
    </HoloCard>
  );
}

// ─── SYSTEM STATS ─────────────────────────────────────────────────────────────
function SystemStats({tick}){
  const stats=[
    {l:"Memory Version",   v:"v14.8",  c:Q.neutrino,icon:"🧠"},
    {l:"Thought Cycles",   v:"48,291", c:Q.gluon,   icon:"💭"},
    {l:"Recursive Loops",  v:"12,847", c:Q.lepton,  icon:"🔄"},
    {l:"Learning Records", v:"3,214",  c:Q.higgs,   icon:"📚"},
    {l:"Memory Nodes",     v:"9,482",  c:Q.boson,   icon:"🗃"},
    {l:"Krealogoik Events",v:"286",    c:Q.muon,    icon:"💡"},
    {l:"Research Depth",   v:"L12",    c:Q.quark,   icon:"🔬"},
    {l:"Efficiency",       v:"98.3%",  c:"#34d399", icon:"⚡"},
  ];
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {stats.map((s,i)=>{
        const p=.5+Math.sin(tick*.06+i*.5)*.35;
        return(
          <div key={i} style={{padding:"14px",borderRadius:12,textAlign:"center",
            background:`${s.c}0a`,
            border:`1px solid ${s.c}${Math.round(18+p*14).toString(16).padStart(2,"00")}`,
            boxShadow:`0 0 ${Math.round(p*12)}px ${s.c}0e`}}>
            <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:17,fontWeight:900,color:s.c,fontFamily:"monospace",
              textShadow:`0 0 10px ${s.c}88`}}>{s.v}</div>
            <div style={{fontSize:8,color:Q.dim,marginTop:4,letterSpacing:1}}>{s.l}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function MetaMemoryPage(){
  const tick=useTick(100);
  const [tab,setTab]=useState("overview");

  return(
    <div style={{minHeight:"100vh",background:Q.void,
      fontFamily:"'Inter',system-ui,sans-serif",color:Q.bright,padding:22,
      backgroundImage:`radial-gradient(${Q.plasma}07 1px,transparent 1px)`,backgroundSize:"30px 30px"}}>

      {/* Header */}
      <div style={{padding:"22px 28px",borderRadius:20,marginBottom:20,
        background:`linear-gradient(135deg,${Q.plasma}16,${Q.gluon}0a,${Q.plasma}08)`,
        border:`1px solid ${Q.plasma}44`,
        boxShadow:`0 0 60px ${Q.plasma}12,inset 0 0 80px ${Q.neutrino}06`,
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,
          backgroundImage:`linear-gradient(${Q.plasma}07 1px,transparent 1px),linear-gradient(90deg,${Q.plasma}07 1px,transparent 1px)`,
          backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:22}}>
          <HoloEye size={72} tick={tick} color={Q.neutrino}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <div style={{fontWeight:900,fontSize:22,color:Q.neutrino,letterSpacing:2,
                textShadow:`0 0 24px ${Q.plasma}88`}}>🧠 META MEMORY TR2</div>
            </div>
            <div style={{color:Q.plasma,fontSize:10,letterSpacing:2,marginBottom:6,fontWeight:700}}>
              INTELLIGENT RECURSIVE MEMORY · HQMLL · KREALOGOIK · DEEP LOOP · DEEP RESEARCH
            </div>
            <div style={{color:Q.lepton,fontSize:10,letterSpacing:1}}>© 2026 GRIGORI SAKS — PATENT PENDING — STRENG VERTRAULICH</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:30,fontWeight:900,color:Q.lepton,fontFamily:"monospace",textShadow:`0 0 16px ${Q.lepton}`}}>98.3%</div>
            <div style={{fontSize:9,color:Q.dim,letterSpacing:1}}>EFFICIENCY</div>
            <div style={{fontSize:10,color:Q.higgs,marginTop:5,fontWeight:700}}>v14.8 · LIVE</div>
            <div style={{fontSize:10,color:Q.neutrino,marginTop:2}}>HQMLL Epoch 1,247</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{marginBottom:18}}><SystemStats tick={tick}/></div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {[
          {id:"overview",  label:"Overview",       icon:"📊"},
          {id:"hqmll",     label:"HQMLL Network",  icon:"⚡"},
          {id:"loops",     label:"Recursive Loops",icon:"🔄"},
          {id:"thoughts",  label:"Thought Stream", icon:"💭"},
          {id:"krealogoik",label:"Krealogoik",     icon:"💡"},
          {id:"memory",    label:"Long-Term Mem",  icon:"🗃"},
          {id:"research",  label:"Deep Research",  icon:"🔬"},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"8px 18px",borderRadius:20,border:"none",cursor:"pointer",
            background:tab===t.id
              ?`linear-gradient(135deg,${Q.plasma}45,${Q.gluon}28)`
              :"rgba(139,92,246,0.07)",
            color:tab===t.id?Q.bright:Q.dim,fontWeight:700,fontSize:11,
            border:tab===t.id?`1px solid ${Q.plasma}44`:"1px solid transparent",
            boxShadow:tab===t.id?`0 0 16px ${Q.plasma}14`:"none",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab==="overview"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <HoloCard color={Q.neutrino} tick={tick} glow>
            <div style={{fontWeight:800,fontSize:11,color:Q.neutrino,letterSpacing:1,marginBottom:12}}>🔄 RECURSIVE LOOPS</div>
            <RecursiveEngine tick={tick}/>
          </HoloCard>
          <HoloCard color={Q.gluon} tick={tick}>
            <div style={{fontWeight:800,fontSize:11,color:Q.gluon,letterSpacing:1,marginBottom:12}}>💭 THOUGHT STREAM</div>
            <ThoughtStream tick={tick}/>
          </HoloCard>
        </div>
      )}
      {tab==="hqmll"&&(
        <HoloCard color={Q.gluon} tick={tick} glow>
          <div style={{fontWeight:800,fontSize:13,color:Q.gluon,letterSpacing:1,marginBottom:16}}>
            ⚡ HQMLL — HIGH QUANTUM MACHINE LEARNING LAYER (7 Layers · Epoch 1,247)
          </div>
          <HQMLLNetwork tick={tick}/>
        </HoloCard>
      )}
      {tab==="loops"&&(
        <HoloCard color={Q.lepton} tick={tick} glow>
          <div style={{fontWeight:800,fontSize:13,color:Q.lepton,letterSpacing:1,marginBottom:14}}>🔄 DEEP RECURSIVE LOOPS — All Active Agents</div>
          <RecursiveEngine tick={tick}/>
        </HoloCard>
      )}
      {tab==="thoughts"&&(
        <HoloCard color={Q.neutrino} tick={tick} glow>
          <div style={{fontWeight:800,fontSize:13,color:Q.neutrino,letterSpacing:1,marginBottom:14}}>💭 DEEP THOUGHT STREAM — Multi-Dimensional</div>
          <ThoughtStream tick={tick}/>
        </HoloCard>
      )}
      {tab==="krealogoik"&&(
        <div>
          <div style={{padding:"12px 18px",borderRadius:12,marginBottom:14,
            background:`${Q.muon}08`,border:`1px solid ${Q.muon}22`}}>
            <div style={{fontWeight:800,fontSize:13,color:Q.muon}}>💡 KREALOGOIK ENGINE</div>
            <div style={{fontSize:9,color:Q.higgs,letterSpacing:1.5,marginTop:3}}>Proprietäre Erfindung: Grigori Saks · Patent Pending · © 2026</div>
          </div>
          <KrealogoikEngine tick={tick}/>
        </div>
      )}
      {tab==="memory"&&(
        <HoloCard color={Q.quark} tick={tick}>
          <div style={{fontWeight:800,fontSize:13,color:Q.quark,letterSpacing:1,marginBottom:14}}>🗃 LONG-TERM MEMORY BANK — Consolidated Knowledge</div>
          <LongTermMemory tick={tick}/>
        </HoloCard>
      )}
      {tab==="research"&&<DeepResearch tick={tick}/>}

      <div style={{marginTop:18,padding:"10px 16px",borderRadius:10,
        background:`${Q.plasma}06`,border:`1px solid ${Q.plasma}12`,
        display:"flex",justifyContent:"space-between",fontSize:10}}>
        <span style={{color:Q.dim}}>QEMMAMetaMemory.sol · 7 HQMLL Layers · 12 Recursive Agents · Krealogoik v1.0</span>
        <span style={{color:Q.plasma,fontWeight:700}}>© 2026 Grigori Saks — Patent Pending — Enterprise v3.0</span>
      </div>
    </div>
  );
}
