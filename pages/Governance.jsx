// ============================================================
//  QUANTUM EMMA — DAO Governance v5.0 MEGA UPGRADE
//  Proposals · Live Voting · Treasury · DAO Stats
//  4D/5D Holographic · © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};
function useTick(ms=200){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);return t;}

const PROPOSALS = [
  {id:"QEP-012",title:"Increase Staking APY to 75% for Quantum Tier",
   status:"active",   forV:68,againstV:18,abstain:14,ends:"2d 4h",quorum:82,color:Q.lepton,
   desc:"Proposal to boost Quantum Tier staking rewards to attract long-term holders and reduce circulating supply.",author:"ALPHA-7"},
  {id:"QEP-011",title:"List QEMMA on Gate.io Exchange",
   status:"active",   forV:91,againstV:6, abstain:3, ends:"5d 1h",quorum:94,color:Q.gluon,
   desc:"Strategic listing on Gate.io to expand market access across Asian markets and increase liquidity depth.",author:"Community"},
  {id:"QEP-010",title:"Deploy HQMLL v8 on Mainnet",
   status:"passed",   forV:87,againstV:8, abstain:5, ends:"Ended",quorum:89,color:Q.plasma,
   desc:"Upgrade MetaMemory recursive engine to v8 with 3x performance improvement.",author:"EPSILON-9"},
  {id:"QEP-009",title:"Allocate $200K Treasury for Marketing",
   status:"passed",   forV:73,againstV:20,abstain:7, ends:"Ended",quorum:78,color:Q.higgs,
   desc:"Fund a 6-month marketing campaign targeting DeFi communities on Twitter and YouTube.",author:"MU-10"},
  {id:"QEP-008",title:"Reduce Pool Fee from 1.5% to 1.0%",
   status:"failed",   forV:41,againstV:52,abstain:7, ends:"Ended",quorum:48,color:Q.tauon,
   desc:"Reduce mining pool fees to attract more miners and increase network hash rate.",author:"Community"},
];

export default function Governance() {
  const tick = useTick(200);
  const [tab, setTab] = useState("proposals");
  const [votes, setVotes] = useState({});
  const [newProposal, setNewProposal] = useState(false);
  const [propTitle, setPropTitle] = useState("");
  const [propDesc, setPropDesc]   = useState("");
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;

  const vote = (id, side) => {
    setVotes(v=>({...v,[id]:side}));
  };

  const treasury = {total:4200000,allocated:1840000,available:2360000};
  const treasuryPct = (treasury.allocated/treasury.total*100).toFixed(1);

  return (
    <div style={{minHeight:"100vh",background:Q.void,color:Q.bright,fontFamily:"'Inter',sans-serif",paddingBottom:40}}>

      {/* HEADER */}
      <div style={{background:Q.deep,borderBottom:`1px solid ${Q.plasma}33`,padding:"14px 24px",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:900,fontSize:18,color:Q.quark}}>🏛 DAO Governance v5.0</div>
          <div style={{color:Q.dim,fontSize:12}}>On-Chain Voting · Proposals · Treasury · Community Power</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          {[{l:"Proposals",v:"12",c:Q.plasma},{l:"Voters",v:"3,240",c:Q.gluon},{l:"Quorum",c:Q.lepton,v:"82%"}].map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"6px 14px",borderRadius:8,
              background:`${s.c}15`,border:`1px solid ${s.c}33`}}>
              <div style={{fontSize:15,fontWeight:900,color:s.c}}>{s.v}</div>
              <div style={{fontSize:9,color:Q.dim}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px"}}>

        {/* TREASURY BAR */}
        <div style={{background:Q.bg1,borderRadius:14,padding:"16px 20px",border:`1px solid ${Q.higgs}33`,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{color:Q.higgs,fontWeight:700}}>🏦 DAO Treasury</span>
            <div style={{display:"flex",gap:16,fontSize:12}}>
              <span style={{color:Q.dim}}>Total: <span style={{color:Q.bright,fontWeight:700}}>${(treasury.total/1e6).toFixed(1)}M</span></span>
              <span style={{color:Q.dim}}>Allocated: <span style={{color:Q.muon,fontWeight:700}}>${(treasury.allocated/1e6).toFixed(2)}M</span></span>
              <span style={{color:Q.dim}}>Available: <span style={{color:Q.lepton,fontWeight:700}}>${(treasury.available/1e6).toFixed(2)}M</span></span>
            </div>
          </div>
          <div style={{height:10,background:`${Q.higgs}15`,borderRadius:5,overflow:"hidden",border:`1px solid ${Q.higgs}22`}}>
            <div style={{height:"100%",width:`${treasuryPct}%`,
              background:`linear-gradient(90deg,${Q.muon},${Q.higgs})`,borderRadius:5,
              boxShadow:`0 0 10px ${Q.higgs}66`,transition:"width 1s"}}/>
          </div>
          <div style={{fontSize:10,color:Q.dim,marginTop:4}}>{treasuryPct}% allocated</div>
        </div>

        {/* TABS */}
        <div style={{display:"flex",gap:4,background:Q.bg1,borderRadius:10,padding:4,
          border:`1px solid ${Q.plasma}22`,marginBottom:16,width:"fit-content"}}>
          {[["proposals","📋 Proposals"],["create","✍️ Create Proposal"],["stats","📊 DAO Stats"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:"7px 18px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
              background:tab===t?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:"transparent",
              color:tab===t?Q.bright:Q.dim}}>
              {l}
            </button>
          ))}
        </div>

        {/* PROPOSALS */}
        {tab==="proposals" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {PROPOSALS.map(p=>{
              const voted = votes[p.id];
              const c = p.status==="active"?p.color:p.status==="passed"?Q.lepton:Q.tauon;
              const pulse2 = 0.5+Math.sin(tick*0.05)*0.3;
              return (
                <div key={p.id} style={{background:Q.bg1,borderRadius:14,padding:"20px",
                  border:`1px solid ${c}${p.status==="active"?Math.round((0.15+pulse2*0.1)*255).toString(16).padStart(2,"0"):"22"}`,
                  boxShadow:p.status==="active"?`0 0 ${8+pulse2*6}px ${c}0a`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:11,color:Q.dim,fontFamily:"monospace"}}>{p.id}</span>
                        <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,
                          background:p.status==="active"?`${c}20`:p.status==="passed"?`${Q.lepton}20`:`${Q.tauon}20`,
                          color:p.status==="active"?c:p.status==="passed"?Q.lepton:Q.tauon,
                          border:`1px solid ${p.status==="active"?c:p.status==="passed"?Q.lepton:Q.tauon}44`}}>
                          {p.status==="active"?"🟢 Active":p.status==="passed"?"✅ Passed":"❌ Failed"}
                        </span>
                      </div>
                      <div style={{fontWeight:800,fontSize:15,color:Q.bright,marginBottom:6}}>{p.title}</div>
                      <div style={{fontSize:12,color:Q.dim,lineHeight:1.5}}>{p.desc}</div>
                    </div>
                    <div style={{textAlign:"right",marginLeft:16,flexShrink:0}}>
                      <div style={{fontSize:11,color:Q.dim}}>Ends: {p.ends}</div>
                      <div style={{fontSize:11,color:Q.mid}}>By: {p.author}</div>
                    </div>
                  </div>

                  {/* Vote bars */}
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
                    {[
                      {label:"For",     val:p.forV,     color:Q.lepton},
                      {label:"Against", val:p.againstV, color:Q.tauon},
                      {label:"Abstain", val:p.abstain,  color:Q.dim},
                    ].map(v=>(
                      <div key={v.label} style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:50,fontSize:11,color:v.color,fontWeight:700}}>{v.label}</div>
                        <div style={{flex:1,height:6,background:`${v.color}20`,borderRadius:3}}>
                          <div style={{height:6,width:`${v.val}%`,background:v.color,borderRadius:3,
                            boxShadow:`0 0 6px ${v.color}88`}}/>
                        </div>
                        <div style={{width:35,fontSize:11,color:v.color,textAlign:"right"}}>{v.val}%</div>
                      </div>
                    ))}
                  </div>

                  {/* Quorum */}
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:12,fontSize:11}}>
                    <span style={{color:Q.dim}}>Quorum:</span>
                    <div style={{flex:1,height:4,background:`${Q.gluon}20`,borderRadius:2}}>
                      <div style={{height:4,width:`${p.quorum}%`,background:Q.gluon,borderRadius:2}}/>
                    </div>
                    <span style={{color:Q.gluon,fontWeight:700}}>{p.quorum}%</span>
                  </div>

                  {/* Vote buttons */}
                  {p.status==="active" && (
                    <div style={{display:"flex",gap:8}}>
                      {["For","Against","Abstain"].map((s,i)=>{
                        const vc = s==="For"?Q.lepton:s==="Against"?Q.tauon:Q.dim;
                        const isVoted = voted===s;
                        return (
                          <button key={s} onClick={()=>vote(p.id,s)} style={{
                            flex:1,padding:"8px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:12,
                            border:`1px solid ${vc}${isVoted?"cc":"44"}`,
                            background:isVoted?`${vc}30`:"transparent",
                            color:isVoted?vc:Q.dim,
                            boxShadow:isVoted?`0 0 10px ${vc}44`:"none"}}>
                            {isVoted?"✓ Voted":"Vote"} {s}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CREATE PROPOSAL */}
        {tab==="create" && (
          <div style={{background:Q.bg1,borderRadius:14,padding:"24px",border:`1px solid ${Q.plasma}33`,maxWidth:700}}>
            <div style={{color:Q.quark,fontWeight:700,fontSize:15,marginBottom:20}}>✍️ Create New Proposal</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>Proposal Title</div>
                <input value={propTitle} onChange={e=>setPropTitle(e.target.value)}
                  placeholder="e.g. Increase QEMMA Staking APY to 75%"
                  style={{width:"100%",background:Q.bg2,border:`1px solid ${Q.plasma}44`,borderRadius:8,
                    padding:"10px 12px",color:Q.bright,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div>
                <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>Description</div>
                <textarea value={propDesc} onChange={e=>setPropDesc(e.target.value)}
                  placeholder="Describe your proposal in detail..."
                  rows={5} style={{width:"100%",background:Q.bg2,border:`1px solid ${Q.plasma}44`,borderRadius:8,
                    padding:"10px 12px",color:Q.bright,fontSize:13,outline:"none",resize:"vertical",
                    fontFamily:"inherit",boxSizing:"border-box"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>Voting Period</div>
                  <select style={{width:"100%",background:Q.bg2,border:`1px solid ${Q.plasma}44`,borderRadius:8,
                    padding:"10px 12px",color:Q.bright,fontSize:13,outline:"none"}}>
                    {["3 days","5 days","7 days","14 days"].map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>Category</div>
                  <select style={{width:"100%",background:Q.bg2,border:`1px solid ${Q.plasma}44`,borderRadius:8,
                    padding:"10px 12px",color:Q.bright,fontSize:13,outline:"none"}}>
                    {["Tokenomics","Exchange Listing","Protocol Upgrade","Treasury","Marketing","Other"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{padding:"12px",background:`${Q.higgs}10`,borderRadius:8,border:`1px solid ${Q.higgs}22`,fontSize:11,color:Q.dim}}>
                ⚠️ Requirements: Hold min. 10,000 QEMMA · Stake min. 5,000 QEMMA · Proposal fee: 100 QEMMA
              </div>
              <button disabled={!propTitle||!propDesc} style={{
                padding:"13px",borderRadius:12,border:"none",cursor:propTitle&&propDesc?"pointer":"not-allowed",
                background:propTitle&&propDesc?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:`${Q.plasma}33`,
                color:Q.bright,fontWeight:800,fontSize:14,
                boxShadow:propTitle&&propDesc?`0 0 16px ${Q.plasma}55`:"none"}}>
                🏛 Submit Proposal (100 QEMMA)
              </button>
            </div>
          </div>
        )}

        {/* DAO STATS */}
        {tab==="stats" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[
              {label:"Total Proposals",val:"12",sub:"8 passed · 2 failed · 2 active",color:Q.plasma},
              {label:"Total Voters",   val:"3,240",sub:"Unique wallets participated",color:Q.gluon},
              {label:"Avg Quorum",     val:"81.4%",sub:"Across all proposals",color:Q.lepton},
              {label:"Voting Power",   val:"100M",sub:"Total QEMMA supply",color:Q.higgs},
              {label:"Treasury Size",  val:"$4.2M",sub:"Multi-sig secured",color:Q.boson},
              {label:"Pass Rate",      val:"80%",sub:"8 of 10 completed proposals",color:Q.muon},
            ].map((s,i)=>(
              <div key={i} style={{background:Q.bg1,borderRadius:14,padding:"20px",
                border:`1px solid ${s.color}${Math.round((0.1+pulse*0.1)*255).toString(16).padStart(2,"0")}`,
                boxShadow:`0 0 ${8+pulse*6}px ${s.color}0a`}}>
                <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>{s.label}</div>
                <div style={{fontSize:26,fontWeight:900,color:s.color,marginBottom:4}}>{s.val}</div>
                <div style={{fontSize:11,color:Q.dim}}>{s.sub}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
