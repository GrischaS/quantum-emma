// ============================================================
//  QUANTUM EMMA — DAO Governance Enterprise v3.0
//  4D/5D Holographic · On-Chain Voting · Treasury · Timelock
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef } from "react";

const Q = {
  void:"#000008", bg0:"#030012", bg1:"#06001e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", gluon:"#06b6d4",
  higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};
function useTick(ms=140){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[]);return t;}
function Bar({v,c,h=5}){return<div style={{height:h,background:"rgba(255,255,255,0.05)",borderRadius:h/2}}><div style={{height:h,width:`${Math.min(v,100)}%`,background:c,borderRadius:h/2,transition:"width .6s",boxShadow:`0 0 8px ${c}66`}}/></div>;}
function Badge({label,color}){return<span style={{padding:"2px 9px",borderRadius:20,fontSize:9,fontWeight:800,letterSpacing:1,color,background:`${color}18`,border:`1px solid ${color}33`}}>{label}</span>;}
function HoloCard({children,color=Q.plasma,style={},tick=0,glow=false}){
  const p=.5+Math.sin(tick*.07)*.28;
  return<div style={{borderRadius:16,padding:"18px 20px",background:`linear-gradient(135deg,${color}12,${color}06,transparent)`,border:`1px solid ${color}${Math.round((p*.22+.08)*255).toString(16).padStart(2,"00")}`,boxShadow:glow?`0 0 ${Math.round(18+p*14)}px ${color}1a`:"",...style,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:`${(-50+tick*1.3)%200}%`,width:"50%",height:"100%",background:`linear-gradient(90deg,transparent,${color}06,transparent)`,pointerEvents:"none"}}/>
    {children}
  </div>;
}

const PROPOSALS=[
  {id:1,title:"Raise QUANTUM Staking APY to 72%",      type:"PROTOCOL",    status:"ACTIVE",  cat:"STAKING",
   desc:"Proposal to increase QUANTUM tier APY from 60% to 72% to attract long-term holders and reduce circulating supply. Treasury yield funding confirmed by EPSILON-S.",
   for:847291,against:124033,abstain:12400,quorum:500000,ends:"3d 14h",created:"2026-04-06",
   proposer:"0x742d…12Ab",vp:24500,impact:"HIGH",urgency:"MEDIUM"},
  {id:2,title:"Allocate 500k QEMMA for Uniswap V3",    type:"TREASURY",    status:"ACTIVE",  cat:"DEFI",
   desc:"Deploy 500,000 QEMMA to QEMMA/ETH Uniswap V3 concentrated liquidity pool in range $0.55–$0.75. Expected fee APY: 42%. THETA-D analysis confirms optimal range.",
   for:621044,against:98122,abstain:8200,quorum:500000,ends:"5d 2h",created:"2026-04-07",
   proposer:"0x9f3a…88Dc",vp:18200,impact:"HIGH",urgency:"HIGH"},
  {id:3,title:"META-TR2 HQMLL Upgrade v2.1",           type:"AGENT_CONFIG", status:"PENDING", cat:"AI",
   desc:"Upgrade META-TR2 HQMLL from v2.0 to v2.1. Improved Layer 4 QUANTUM weights. Accuracy gain: +3.2%. DELTA-H validation complete.",
   for:0,against:0,abstain:0,quorum:500000,ends:"7d 0h",created:"2026-04-08",
   proposer:"0x742d…12Ab",vp:24500,impact:"MEDIUM",urgency:"LOW"},
  {id:4,title:"Halving #5 — 156 → 78 QEMMA Reward",   type:"PROTOCOL",    status:"PASSED",  cat:"MINING",
   desc:"Execute Halving #5 at block 1,050,000. Mining reward 156→78 QEMMA/block. Historical: avg +340% post-halving price action.",
   for:921033,against:44211,abstain:6100,quorum:500000,ends:"Done",created:"2026-03-28",
   proposer:"0x742d…12Ab",vp:24500,impact:"CRITICAL",urgency:"HIGH"},
  {id:5,title:"Cross-Chain Bridge — BSC Network",       type:"PROTOCOL",    status:"PENDING", cat:"BLOCKCHAIN",
   desc:"Deploy QEMMA bridge to Binance Smart Chain via LayerZero. Expected +12,000 new users. IOTA-V security audit: APPROVED.",
   for:0,against:0,abstain:0,quorum:500000,ends:"10d 0h",created:"2026-04-09",
   proposer:"0x5c1f…44Ae",vp:9800,impact:"HIGH",urgency:"MEDIUM"},
];

const SC={ACTIVE:Q.lepton,PENDING:Q.higgs,PASSED:Q.neutrino,FAILED:Q.tauon};
const TC={PROTOCOL:Q.gluon,TREASURY:Q.higgs,AGENT_CONFIG:Q.neutrino,PARAMETER:Q.muon};

// ─── VOTE MODAL ───────────────────────────────────────────────────────────────
function VoteModal({proposal,onClose,tick}){
  const [vote,setVote]=useState("");
  const [reason,setReason]=useState("");
  const [done,setDone]=useState(false);
  if(!proposal)return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,
      backdropFilter:"blur(4px)"}}>
      <div style={{width:500,padding:"32px",borderRadius:22,
        background:`linear-gradient(135deg,${Q.bg1},${Q.bg0})`,
        border:`1px solid ${Q.neutrino}44`,
        boxShadow:`0 0 80px ${Q.plasma}18`}}>
        {!done?(
          <>
            <div style={{fontWeight:900,fontSize:18,color:Q.neutrino,marginBottom:8}}>🗳 CAST VOTE ON-CHAIN</div>
            <div style={{fontSize:13,color:Q.mid,marginBottom:20,lineHeight:1.6}}>{proposal.title}</div>
            <div style={{fontSize:10,color:Q.dim,marginBottom:12,letterSpacing:1}}>
              YOUR VOTING POWER: <b style={{color:Q.higgs}}>{proposal.vp.toLocaleString()} QEMMA</b>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {[{v:"for",l:"✓ FOR",c:Q.lepton},{v:"against",l:"✗ AGAINST",c:Q.tauon},{v:"abstain",l:"◎ ABSTAIN",c:Q.dim}].map(b=>(
                <button key={b.v} onClick={()=>setVote(b.v)} style={{
                  flex:1,padding:"13px",borderRadius:12,border:vote===b.v?`2px solid ${b.c}55`:"2px solid transparent",
                  cursor:"pointer",background:vote===b.v?`${b.c}22`:"rgba(255,255,255,0.04)",
                  color:vote===b.v?b.c:Q.dim,fontWeight:900,fontSize:13,transition:"all .15s"}}>
                  {b.l}
                </button>
              ))}
            </div>
            <textarea value={reason} onChange={e=>setReason(e.target.value)}
              placeholder="Reason (optional)..." rows={3}
              style={{width:"100%",padding:"10px 14px",borderRadius:10,
                background:"rgba(0,0,0,0.5)",border:"1px solid rgba(139,92,246,0.25)",
                color:Q.bright,fontSize:12,resize:"none",boxSizing:"border-box",marginBottom:14}}/>
            <div style={{display:"flex",gap:10}}>
              <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:11,border:"none",cursor:"pointer",
                background:"rgba(255,255,255,0.05)",color:Q.dim,fontWeight:700,fontSize:13}}>CANCEL</button>
              <button onClick={()=>vote&&setDone(true)} style={{flex:2,padding:"12px",borderRadius:11,border:"none",
                cursor:"pointer",fontWeight:900,fontSize:13,letterSpacing:1,
                background:vote?`linear-gradient(135deg,${Q.neutrino}66,${Q.gluon}44)`:"rgba(255,255,255,0.05)",
                color:vote?Q.bright:Q.dim,boxShadow:vote?`0 4px 16px ${Q.plasma}33`:"none"}}>
                {vote?`CONFIRM ${vote.toUpperCase()}`:"SELECT A VOTE"}
              </button>
            </div>
          </>
        ):(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:52,marginBottom:16}}>✅</div>
            <div style={{fontWeight:900,fontSize:18,color:Q.lepton,marginBottom:8}}>Vote Submitted On-Chain!</div>
            <div style={{fontSize:12,color:Q.mid,marginBottom:20,lineHeight:1.6}}>
              Your <b style={{color:vote==="for"?Q.lepton:vote==="against"?Q.tauon:Q.dim}}>{vote.toUpperCase()}</b> vote
              has been recorded. TX confirmed in ~15s.
            </div>
            <div style={{padding:"10px 16px",borderRadius:10,background:"rgba(0,0,0,0.4)",
              fontSize:11,color:Q.dim,fontFamily:"monospace",marginBottom:20}}>
              TX: 0x{Math.random().toString(16).slice(2,18)}…
            </div>
            <button onClick={onClose} style={{padding:"12px 32px",borderRadius:12,border:"none",cursor:"pointer",
              background:`linear-gradient(135deg,${Q.lepton},#22c55e)`,color:"#000",fontWeight:900,fontSize:14}}>
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROPOSAL CARD ────────────────────────────────────────────────────────────
function ProposalCard({p,onVote,tick}){
  const [exp,setExp]=useState(false);
  const tot=p.for+p.against+p.abstain;
  const fp=tot>0?(p.for/tot*100):0, ap=tot>0?(p.against/tot*100):0;
  const qpct=tot/p.quorum*100;
  const sc=SC[p.status]||Q.dim;
  const pulse=.5+Math.sin(tick*.07)*.28;
  return(
    <div style={{borderRadius:16,overflow:"hidden",
      border:`1px solid ${sc}${Math.round((pulse*.22+.1)*255).toString(16).padStart(2,"00")}`,
      background:`${sc}06`,marginBottom:12,
      boxShadow:`0 0 ${Math.round(pulse*14)}px ${sc}0a`}}>
      <div style={{padding:"18px 20px",cursor:"pointer",position:"relative",overflow:"hidden"}}
        onClick={()=>setExp(e=>!e)}>
        <div style={{position:"absolute",top:0,left:`${(-50+tick*1.2)%200}%`,width:"50%",height:"100%",
          background:`linear-gradient(90deg,transparent,${sc}04,transparent)`,pointerEvents:"none"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,position:"relative"}}>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
            <Badge label={`#${p.id}`} color={Q.dim}/>
            <Badge label={p.type} color={TC[p.type]||Q.mid}/>
            <Badge label={p.status} color={sc}/>
            <Badge label={`${p.impact} IMPACT`} color={p.impact==="CRITICAL"?Q.tauon:p.impact==="HIGH"?Q.muon:Q.mid}/>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:11,color:Q.dim}}>{p.ends}</span>
            <span style={{fontSize:18,color:Q.dim,transform:exp?"rotate(90deg)":"rotate(0deg)",transition:"transform .2s"}}>›</span>
          </div>
        </div>
        <div style={{fontWeight:800,fontSize:16,color:Q.bright,marginBottom:10,position:"relative"}}>{p.title}</div>
        {tot>0&&(
          <>
            <div style={{height:8,background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden",display:"flex",marginBottom:6}}>
              <div style={{width:`${fp}%`,background:Q.lepton,transition:"width .6s",boxShadow:`0 0 8px ${Q.lepton}88`}}/>
              <div style={{width:`${ap}%`,background:Q.tauon,transition:"width .6s"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
              <span style={{color:Q.lepton,fontWeight:700}}>✓ {(p.for/1000).toFixed(0)}k ({fp.toFixed(1)}%)</span>
              <span style={{color:Q.dim,fontSize:10}}>Quorum: {Math.min(qpct,100).toFixed(0)}%</span>
              <span style={{color:Q.tauon,fontWeight:700}}>✗ {(p.against/1000).toFixed(0)}k ({ap.toFixed(1)}%)</span>
            </div>
          </>
        )}
        {tot===0&&<div style={{fontSize:11,color:Q.dim,fontStyle:"italic",position:"relative"}}>Voting not yet started · Opens soon</div>}
      </div>

      {exp&&(
        <div style={{padding:"0 20px 20px",borderTop:`1px solid ${sc}18`}}>
          <div style={{fontSize:13,color:Q.mid,lineHeight:1.75,marginBottom:16,marginTop:16}}>{p.desc}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
            {[
              {l:"FOR",     v:p.for.toLocaleString(),                     c:Q.lepton},
              {l:"AGAINST", v:p.against.toLocaleString(),                 c:Q.tauon},
              {l:"ABSTAIN", v:p.abstain.toLocaleString(),                 c:Q.dim},
              {l:"QUORUM",  v:`${Math.min(qpct,100).toFixed(1)}%`,       c:qpct>=100?Q.lepton:Q.higgs},
            ].map((s,i)=>(
              <div key={i} style={{padding:"10px",borderRadius:9,textAlign:"center",
                background:`${s.c}0a`,border:`1px solid ${s.c}22`}}>
                <div style={{fontSize:9,color:Q.dim}}>{s.l}</div>
                <div style={{fontSize:16,fontWeight:900,color:s.c,marginTop:4,fontFamily:"monospace"}}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:Q.dim,marginBottom:14}}>
            <span>Proposer: <b style={{color:Q.mid,fontFamily:"monospace"}}>{p.proposer}</b></span>
            <span>Created: {p.created}</span>
            <span>VP: <b style={{color:Q.higgs}}>{p.vp.toLocaleString()} QEMMA</b></span>
          </div>
          {p.status==="ACTIVE"&&(
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>onVote(p)} style={{flex:2,padding:"12px",borderRadius:11,
                border:"none",cursor:"pointer",fontWeight:900,fontSize:13,letterSpacing:1,
                background:`linear-gradient(135deg,${Q.lepton}44,${Q.gluon}33)`,color:Q.bright,
                boxShadow:`0 4px 16px ${Q.lepton}22`}}>🗳 CAST VOTE</button>
              <button style={{flex:1,padding:"12px",borderRadius:11,
                border:`1px solid ${Q.dim}22`,background:"transparent",
                color:Q.dim,fontSize:12,cursor:"pointer",fontWeight:700}}>📤 DELEGATE</button>
            </div>
          )}
          {p.status==="PASSED"&&(
            <div style={{padding:"10px 14px",borderRadius:10,
              background:`${Q.neutrino}10`,border:`1px solid ${Q.neutrino}28`,
              fontSize:12,color:Q.neutrino,fontWeight:700}}>
              ✅ PASSED — 2-day timelock active → Auto-executes via TimelockController
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TREASURY ────────────────────────────────────────────────────────────────
function Treasury({tick}){
  const assets=[
    {sym:"QEMMA",bal:"12,847,291",usd:"$8.09M",c:Q.neutrino,icon:"🪙",pct:62},
    {sym:"ETH",  bal:"284.20",    usd:"$1.09M",c:Q.gluon,   icon:"⟠", pct:22},
    {sym:"USDC", bal:"847,000",   usd:"$847k", c:"#60a5fa",  icon:"💵",pct:16},
  ];
  return(
    <HoloCard color={Q.higgs} tick={tick} glow>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
        <div style={{fontWeight:800,fontSize:13,color:Q.higgs}}>🏦 DAO TREASURY</div>
        <div>
          <div style={{fontSize:22,fontWeight:900,color:Q.higgs,fontFamily:"monospace",
            textShadow:`0 0 12px ${Q.higgs}`}}>$10.03M</div>
          <div style={{fontSize:9,color:Q.lepton,textAlign:"right",marginTop:2}}>▲ +2.4% (7d)</div>
        </div>
      </div>
      {assets.map((a,i)=>(
        <div key={i} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:16}}>{a.icon}</span>
              <span style={{fontWeight:700,fontSize:12,color:a.c}}>{a.sym}</span>
            </div>
            <div style={{display:"flex",gap:12,fontSize:11}}>
              <span style={{color:Q.dim,fontFamily:"monospace"}}>{a.bal}</span>
              <span style={{fontWeight:700,color:a.c}}>{a.usd}</span>
              <span style={{color:Q.dim}}>{a.pct}%</span>
            </div>
          </div>
          <Bar v={a.pct} c={a.c} h={5}/>
        </div>
      ))}
      <div style={{marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[
          {l:"Monthly Spend",  v:"$124k",                  c:Q.tauon},
          {l:"Monthly Revenue",v:"$284k",                  c:Q.lepton},
          {l:"Runway",         v:"∞ Self-sustaining",      c:Q.lepton},
          {l:"Next Proposal",  v:"500k Q → Uniswap",      c:Q.higgs},
        ].map((s,i)=>(
          <div key={i} style={{padding:"9px 11px",borderRadius:9,
            background:"rgba(0,0,0,0.3)",border:`1px solid ${s.c}14`}}>
            <div style={{fontSize:9,color:Q.dim}}>{s.l}</div>
            <div style={{fontSize:11,fontWeight:700,color:s.c,marginTop:3}}>{s.v}</div>
          </div>
        ))}
      </div>
    </HoloCard>
  );
}

// ─── NEW PROPOSAL ─────────────────────────────────────────────────────────────
function NewProposal({tick}){
  const [title,setTitle]=useState("");
  const [type,setType]=useState("PROTOCOL");
  const [desc,setDesc]=useState("");
  const [done,setDone]=useState(false);
  if(done)return(
    <div style={{padding:"40px",textAlign:"center",borderRadius:14,
      background:`${Q.lepton}08`,border:`1px solid ${Q.lepton}28`}}>
      <div style={{fontSize:40,marginBottom:12}}>✅</div>
      <div style={{fontWeight:800,fontSize:16,color:Q.lepton,marginBottom:8}}>Proposal Submitted!</div>
      <div style={{fontSize:12,color:Q.mid}}>Requires 10,000 QEMMA. 7-day voting period active.</div>
    </div>
  );
  return(
    <HoloCard color={Q.neutrino} tick={tick}>
      <div style={{fontWeight:800,fontSize:13,color:Q.neutrino,letterSpacing:1,marginBottom:14}}>📝 SUBMIT NEW PROPOSAL</div>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:9,color:Q.dim,letterSpacing:1,marginBottom:5}}>TITLE</div>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Short, clear title..."
          style={{width:"100%",padding:"11px 14px",borderRadius:10,background:"rgba(0,0,0,0.5)",
            border:`1px solid ${Q.neutrino}33`,color:Q.bright,fontSize:13,boxSizing:"border-box"}}/>
      </div>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:9,color:Q.dim,letterSpacing:1,marginBottom:5}}>TYPE</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["PROTOCOL","TREASURY","AGENT_CONFIG","PARAMETER","EMERGENCY"].map(t=>(
            <button key={t} onClick={()=>setType(t)} style={{
              padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:10,
              background:type===t?`${TC[t]||Q.neutrino}25`:"rgba(255,255,255,0.05)",
              color:type===t?(TC[t]||Q.neutrino):Q.dim,fontWeight:700}}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:9,color:Q.dim,letterSpacing:1,marginBottom:5}}>DESCRIPTION</div>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)}
          placeholder="Detailed description, rationale, expected outcome..."
          style={{width:"100%",padding:"11px 14px",borderRadius:10,background:"rgba(0,0,0,0.5)",
            border:`1px solid ${Q.neutrino}28`,color:Q.bright,fontSize:12,height:120,
            resize:"vertical",boxSizing:"border-box"}}/>
      </div>
      <div style={{padding:"10px 14px",borderRadius:10,background:`${Q.higgs}08`,
        border:`1px solid ${Q.higgs}22`,fontSize:11,color:Q.mid,marginBottom:14,lineHeight:1.6}}>
        ⚠️ Requires <b style={{color:Q.higgs}}>10,000 QEMMA</b> to submit ·
        7-day voting · 2-day timelock · 500k quorum
      </div>
      <button onClick={()=>title&&desc&&setDone(true)} style={{
        width:"100%",padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
        background:`linear-gradient(135deg,${Q.neutrino}66,${Q.gluon}44)`,
        color:Q.bright,fontSize:14,fontWeight:900,letterSpacing:2,
        boxShadow:`0 4px 20px ${Q.neutrino}22`}}>
        🗳 SUBMIT PROPOSAL (10,000 QEMMA)
      </button>
    </HoloCard>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function GovernancePage(){
  const tick=useTick(140);
  const [tab,setTab]=useState("proposals");
  const [modal,setModal]=useState(null);
  const active=PROPOSALS.filter(p=>p.status==="ACTIVE").length;
  const totalV=PROPOSALS.reduce((s,p)=>s+p.for+p.against+p.abstain,0);

  return(
    <div style={{minHeight:"100vh",background:Q.void,
      fontFamily:"'Inter',system-ui,sans-serif",color:Q.bright,padding:22,
      backgroundImage:`radial-gradient(${Q.gluon}06 1px,transparent 1px)`,backgroundSize:"30px 30px"}}>

      {modal&&<VoteModal proposal={modal} onClose={()=>setModal(null)} tick={tick}/>}

      {/* Header */}
      <div style={{padding:"20px 26px",borderRadius:20,marginBottom:20,
        background:`linear-gradient(135deg,${Q.gluon}12,${Q.neutrino}0a,${Q.gluon}06)`,
        border:`1px solid ${Q.gluon}44`,boxShadow:`0 0 50px ${Q.gluon}0a`,
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,
          backgroundImage:`linear-gradient(${Q.gluon}06 1px,transparent 1px),linear-gradient(90deg,${Q.gluon}06 1px,transparent 1px)`,
          backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:900,fontSize:22,color:Q.gluon,letterSpacing:2,marginBottom:5,
              textShadow:`0 0 20px ${Q.gluon}88`}}>🗳 DAO GOVERNANCE</div>
            <div style={{color:"#164e63",fontSize:10,letterSpacing:2,fontWeight:700}}>
              ON-CHAIN VOTING · 7-DAY PERIODS · 500K QUORUM · 2-DAY TIMELOCK · © 2026 GRIGORI SAKS
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            {[
              {l:"Active",       v:active,                         c:Q.lepton},
              {l:"Total Props",  v:PROPOSALS.length,              c:Q.gluon},
              {l:"Votes Cast",   v:`${(totalV/1e6).toFixed(2)}M`, c:Q.neutrino},
              {l:"Your VP",      v:"24,500 Q",                    c:Q.higgs},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:"center",padding:"12px 16px",borderRadius:12,
                background:`${s.c}0d`,border:`1px solid ${s.c}33`,boxShadow:`0 0 10px ${s.c}14`}}>
                <div style={{fontSize:9,color:Q.dim,letterSpacing:1}}>{s.l}</div>
                <div style={{fontSize:20,fontWeight:900,color:s.c,marginTop:4,
                  textShadow:`0 0 8px ${s.c}`}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:18}}>
        {[
          {id:"proposals",label:"Proposals",    icon:"📋"},
          {id:"treasury", label:"Treasury",     icon:"🏦"},
          {id:"new",      label:"New Proposal", icon:"➕"},
          {id:"history",  label:"My Votes",     icon:"📜"},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"9px 20px",borderRadius:20,border:"none",cursor:"pointer",
            background:tab===t.id?`linear-gradient(135deg,${Q.gluon}35,${Q.neutrino}22)`:"rgba(6,182,212,0.06)",
            color:tab===t.id?Q.bright:Q.dim,fontWeight:700,fontSize:11,
            border:tab===t.id?`1px solid ${Q.gluon}44`:"1px solid transparent",
            boxShadow:tab===t.id?`0 0 16px ${Q.gluon}14`:"none",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab==="proposals"&&(
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18}}>
          <div>{PROPOSALS.map(p=><ProposalCard key={p.id} p={p} onVote={setModal} tick={tick}/>)}</div>
          <Treasury tick={tick}/>
        </div>
      )}
      {tab==="treasury"&&<Treasury tick={tick}/>}
      {tab==="new"&&<div style={{maxWidth:560}}><NewProposal tick={tick}/></div>}
      {tab==="history"&&(
        <HoloCard color={Q.neutrino} tick={tick}>
          <div style={{fontWeight:800,fontSize:12,color:Q.neutrino,letterSpacing:1,marginBottom:14}}>📜 VOTING HISTORY</div>
          {[
            {id:4,t:"Halving #5 Reward",        v:"FOR",    o:"PASSED",  d:"2026-03-28",c:Q.lepton},
            {id:3,t:"CoinGecko Integration",    v:"FOR",    o:"PASSED",  d:"2026-03-14",c:Q.lepton},
            {id:2,t:"Mining Difficulty +15%",   v:"AGAINST",o:"FAILED",  d:"2026-02-28",c:Q.tauon},
            {id:1,t:"Genesis Pool Fee: 0→1%",  v:"FOR",    o:"PASSED",  d:"2026-02-14",c:Q.lepton},
          ].map((h,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",
              borderBottom:i<3?`1px solid rgba(255,255,255,0.04)`:"none"}}>
              <Badge label={`#${h.id}`} color={Q.dim}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:Q.bright}}>{h.t}</div>
                <div style={{fontSize:10,color:Q.dim,marginTop:2}}>{h.d} · 24,500 QEMMA VP</div>
              </div>
              <Badge label={h.v} color={h.v==="FOR"?Q.lepton:Q.tauon}/>
              <Badge label={h.o} color={h.o==="PASSED"?Q.neutrino:Q.tauon}/>
            </div>
          ))}
        </HoloCard>
      )}

      <div style={{marginTop:18,padding:"10px 16px",borderRadius:10,
        background:`${Q.gluon}06`,border:`1px solid ${Q.gluon}12`,
        display:"flex",justifyContent:"space-between",fontSize:10}}>
        <span style={{color:Q.dim}}>QEMMAGovernance.sol · TimelockController · On-Chain · Audited</span>
        <span style={{color:Q.plasma,fontWeight:700}}>© 2026 Grigori Saks — Enterprise v3.0</span>
      </div>
    </div>
  );
}
