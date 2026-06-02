// ============================================================
//  QUANTUM EMMA — Staking v5.0 MEGA UPGRADE
//  5 Tiers · 60% APY · Live Calculator · Auto-Compound
//  4D/5D Holographic · © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};
function useTick(ms=150){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);return t;}

const TIERS = [
  {id:0,name:"FLEXIBLE",  icon:"🔓",apy:12,lock:0,     color:Q.mid,    min:100,   badge:"No Lock"},
  {id:1,name:"BRONZE",    icon:"🥉",apy:18,lock:30,    color:Q.muon,   min:500,   badge:"30 Days"},
  {id:2,name:"SILVER",    icon:"🥈",apy:24,lock:90,    color:Q.mid,    min:1000,  badge:"90 Days"},
  {id:3,name:"GOLD",      icon:"🥇",apy:36,lock:180,   color:Q.higgs,  min:5000,  badge:"180 Days"},
  {id:4,name:"QUANTUM",   icon:"⚛️",apy:60,lock:365,   color:Q.plasma, min:10000, badge:"365 Days"},
];

export default function Staking() {
  const tick = useTick(150);
  const [selectedTier, setSelectedTier] = useState(TIERS[4]);
  const [stakeAmount, setStakeAmount] = useState("10000");
  const [tab, setTab] = useState("stake");
  const [staking, setStaking] = useState(false);
  const [staked, setStaked] = useState(false);
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;

  const amount = parseFloat(stakeAmount)||0;
  const price = 0.63;
  const daily    = (amount * selectedTier.apy/100/365).toFixed(2);
  const weekly   = (amount * selectedTier.apy/100/52).toFixed(2);
  const monthly  = (amount * selectedTier.apy/100/12).toFixed(2);
  const yearly   = (amount * selectedTier.apy/100).toFixed(2);
  const totalEnd = (amount + parseFloat(yearly)).toFixed(2);

  const handleStake = () => {
    if (!amount) return;
    setStaking(true);
    setTimeout(()=>{ setStaking(false); setStaked(true); }, 2000);
  };

  const myPositions = [
    {tier:"QUANTUM",   staked:25000,  earned:1240.5, lock:"365d", apy:60,  color:Q.plasma, days:142},
    {tier:"GOLD",      staked:10000,  earned:312.8,  lock:"180d", apy:36,  color:Q.higgs,  days:67},
    {tier:"SILVER",    staked:5000,   earned:98.2,   lock:"90d",  apy:24,  color:Q.mid,    days:23},
  ];

  return (
    <div style={{minHeight:"100vh",background:Q.void,color:Q.bright,fontFamily:"'Inter',sans-serif",paddingBottom:40}}>

      {/* HEADER */}
      <div style={{background:Q.deep,borderBottom:`1px solid ${Q.plasma}33`,padding:"14px 24px",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:900,fontSize:18,color:Q.quark}}>🔒 Staking Center v5.0</div>
          <div style={{color:Q.dim,fontSize:12}}>5 Lock Tiers · Up to 60% APY · Auto-Compound · Smart Contract Secured</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          {[{l:"Total Staked",v:"$25.2M",c:Q.plasma},{l:"Avg APY",v:"48.2%",c:Q.lepton},{l:"Stakers",v:"4,820",c:Q.gluon}].map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"6px 14px",borderRadius:8,
              background:`${s.c}15`,border:`1px solid ${s.c}33`}}>
              <div style={{fontSize:15,fontWeight:900,color:s.c}}>{s.v}</div>
              <div style={{fontSize:9,color:Q.dim}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px"}}>

        {/* TIER CARDS */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:20}}>
          {TIERS.map(t=>{
            const sel = selectedTier.id===t.id;
            const p = 0.5+Math.sin(tick*0.07+t.id)*0.3;
            return (
              <div key={t.id} onClick={()=>setSelectedTier(t)} style={{
                padding:"14px 12px",borderRadius:14,cursor:"pointer",textAlign:"center",
                background:sel?`${t.color}25`:`${t.color}0a`,
                border:`2px solid ${t.color}${sel?"cc":Math.round((0.1+p*0.1)*255).toString(16).padStart(2,"0")}`,
                boxShadow:sel?`0 0 ${14+p*10}px ${t.color}55`:"none",transition:"all .2s"}}>
                <div style={{fontSize:24,marginBottom:4}}>{t.icon}</div>
                <div style={{fontWeight:800,fontSize:12,color:sel?t.color:Q.mid,marginBottom:2}}>{t.name}</div>
                <div style={{fontSize:22,fontWeight:900,color:t.color,textShadow:sel?`0 0 ${8+p*6}px ${t.color}`:"none"}}>{t.apy}%</div>
                <div style={{fontSize:9,color:Q.dim}}>APY</div>
                <div style={{marginTop:6,padding:"2px 6px",borderRadius:20,fontSize:9,fontWeight:700,
                  background:`${t.color}20`,color:t.color,display:"inline-block"}}>{t.badge}</div>
              </div>
            );
          })}
        </div>

        {/* TABS */}
        <div style={{display:"flex",gap:4,background:Q.bg1,borderRadius:10,padding:4,
          border:`1px solid ${Q.plasma}22`,marginBottom:16,width:"fit-content"}}>
          {[["stake","⚡ Stake"],["positions","💼 My Positions"],["calculator","🧮 Calculator"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:"7px 18px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
              background:tab===t?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:"transparent",
              color:tab===t?Q.bright:Q.dim}}>
              {l}
            </button>
          ))}
        </div>

        {/* STAKE TAB */}
        {tab==="stake" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16}}>
            <div style={{background:Q.bg1,borderRadius:14,padding:"22px",border:`1px solid ${selectedTier.color}33`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <span style={{fontSize:28}}>{selectedTier.icon}</span>
                <div>
                  <div style={{fontWeight:900,fontSize:18,color:selectedTier.color}}>{selectedTier.name} TIER</div>
                  <div style={{color:Q.dim,fontSize:12}}>{selectedTier.lock>0?`${selectedTier.lock}-day lock`:"No lock period"} · Min: {selectedTier.min.toLocaleString()} QEMMA</div>
                </div>
                <div style={{marginLeft:"auto",fontSize:32,fontWeight:900,color:selectedTier.color,
                  textShadow:`0 0 ${12+pulse*8}px ${selectedTier.color}`}}>
                  {selectedTier.apy}% <span style={{fontSize:14}}>APY</span>
                </div>
              </div>

              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>Amount to Stake (QEMMA)</div>
                <div style={{display:"flex",gap:6}}>
                  <input value={stakeAmount} onChange={e=>setStakeAmount(e.target.value)}
                    placeholder={selectedTier.min.toString()}
                    style={{flex:1,background:Q.bg2,border:`1px solid ${selectedTier.color}44`,borderRadius:10,
                      padding:"12px 14px",color:Q.bright,fontSize:16,fontWeight:700,outline:"none",fontFamily:"monospace"}}/>
                  <button onClick={()=>setStakeAmount("50000")} style={{
                    padding:"12px 14px",borderRadius:10,border:`1px solid ${selectedTier.color}44`,
                    background:`${selectedTier.color}20`,color:selectedTier.color,cursor:"pointer",fontWeight:700,fontSize:11}}>MAX</button>
                </div>
                <div style={{display:"flex",gap:6,marginTop:8}}>
                  {[25,50,75,100].map(p=>(
                    <button key={p} onClick={()=>setStakeAmount(String(Math.floor(50000*p/100)))} style={{
                      flex:1,padding:"5px",borderRadius:8,border:`1px solid ${Q.plasma}33`,
                      background:"transparent",color:Q.dim,cursor:"pointer",fontSize:10}}>{p}%</button>
                  ))}
                </div>
                {amount>0 && <div style={{color:Q.dim,fontSize:11,marginTop:6}}>≈ ${(amount*price).toFixed(2)} USDT</div>}
              </div>

              {staked ? (
                <div style={{textAlign:"center",padding:"20px",background:`${Q.lepton}10`,borderRadius:12,
                  border:`1px solid ${Q.lepton}33`}}>
                  <div style={{fontSize:32,marginBottom:8}}>🎉</div>
                  <div style={{fontWeight:900,color:Q.lepton,fontSize:16}}>Successfully Staked!</div>
                  <div style={{color:Q.dim,fontSize:12,marginTop:4}}>
                    {stakeAmount} QEMMA locked for {selectedTier.lock||"∞"} days at {selectedTier.apy}% APY
                  </div>
                </div>
              ) : (
                <button onClick={handleStake} disabled={!amount||amount<selectedTier.min||staking} style={{
                  width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:amount>=selectedTier.min?"pointer":"not-allowed",
                  background:amount>=selectedTier.min
                    ?`linear-gradient(135deg,${selectedTier.color},${Q.gluon})`
                    :`${Q.plasma}33`,
                  color:Q.bright,fontWeight:800,fontSize:15,letterSpacing:1,
                  boxShadow:amount>=selectedTier.min?`0 0 20px ${selectedTier.color}55`:"none"}}>
                  {staking?"⏳ Staking...":amount<selectedTier.min?`Min: ${selectedTier.min.toLocaleString()} QEMMA`:`🔒 Stake ${selectedTier.name} Tier`}
                </button>
              )}
            </div>

            {/* Rewards preview */}
            <div style={{background:Q.bg1,borderRadius:14,padding:"20px",border:`1px solid ${selectedTier.color}33`}}>
              <div style={{color:Q.quark,fontWeight:700,marginBottom:14}}>💰 Projected Rewards</div>
              {[
                {p:"Daily",   v:daily,  c:Q.mid},
                {p:"Weekly",  v:weekly, c:Q.mid},
                {p:"Monthly", v:monthly,c:Q.gluon},
                {p:"Yearly",  v:yearly, c:selectedTier.color},
              ].map(r=>(
                <div key={r.p} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"10px 0",borderBottom:`1px solid ${Q.plasma}11`}}>
                  <span style={{color:Q.dim,fontSize:13}}>{r.p}</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:700,color:r.c,fontSize:14}}>+{r.v} QEMMA</div>
                    <div style={{fontSize:10,color:Q.dim}}>${(parseFloat(r.v)*price).toFixed(2)}</div>
                  </div>
                </div>
              ))}
              <div style={{marginTop:12,padding:"12px",background:`${selectedTier.color}10`,borderRadius:10,
                border:`1px solid ${selectedTier.color}33`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{color:Q.dim,fontSize:11}}>Principal</span>
                  <span style={{color:Q.mid,fontSize:12}}>{amount.toLocaleString()} QEMMA</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{color:Q.dim,fontSize:11}}>End of Period</span>
                  <span style={{fontWeight:800,color:selectedTier.color,fontSize:14}}>{parseFloat(totalEnd).toLocaleString()} QEMMA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MY POSITIONS */}
        {tab==="positions" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {myPositions.map((pos,i)=>{
              const progress = (pos.days/parseInt(pos.lock))*100;
              return (
                <div key={i} style={{background:Q.bg1,borderRadius:14,padding:"20px",
                  border:`1px solid ${pos.color}33`,
                  boxShadow:`0 0 ${8+pulse*6}px ${pos.color}0a`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:16,color:pos.color}}>{pos.tier} TIER</div>
                      <div style={{color:Q.dim,fontSize:11,marginTop:2}}>Lock: {pos.lock} · {pos.days} days elapsed</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:22,fontWeight:900,color:pos.color}}>{pos.apy}%</div>
                      <div style={{fontSize:10,color:Q.dim}}>APY</div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                    {[
                      {l:"Staked",   v:`${pos.staked.toLocaleString()} QEMMA`,c:Q.bright},
                      {l:"Earned",   v:`+${pos.earned} QEMMA`,c:Q.lepton},
                      {l:"Value",    v:`$${(pos.staked*price).toLocaleString()}`,c:pos.color},
                    ].map((s,j)=>(
                      <div key={j} style={{textAlign:"center",padding:"8px",background:`${s.c}08`,borderRadius:8}}>
                        <div style={{fontSize:10,color:Q.dim,marginBottom:2}}>{s.l}</div>
                        <div style={{fontWeight:700,color:s.c,fontSize:13}}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:Q.dim,marginBottom:4}}>
                      <span>Lock Progress</span><span>{progress.toFixed(1)}%</span>
                    </div>
                    <div style={{height:6,background:`${pos.color}20`,borderRadius:3}}>
                      <div style={{height:6,width:`${progress}%`,background:pos.color,borderRadius:3,
                        boxShadow:`0 0 8px ${pos.color}88`}}/>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10}}>
                    <button style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${Q.lepton}44`,
                      background:`${Q.lepton}15`,color:Q.lepton,cursor:"pointer",fontWeight:700,fontSize:12}}>
                      Claim {pos.earned} QEMMA
                    </button>
                    <button style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${Q.dim}33`,
                      background:"transparent",color:Q.dim,cursor:"pointer",fontSize:12}}>
                      Compound
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CALCULATOR */}
        {tab==="calculator" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{background:Q.bg1,borderRadius:14,padding:"22px",border:`1px solid ${Q.plasma}22`}}>
              <div style={{color:Q.quark,fontWeight:700,fontSize:14,marginBottom:16}}>🧮 Staking Calculator</div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>Amount (QEMMA)</div>
                <input value={stakeAmount} onChange={e=>setStakeAmount(e.target.value)}
                  style={{width:"100%",background:Q.bg2,border:`1px solid ${Q.plasma}44`,borderRadius:8,
                    padding:"10px 12px",color:Q.bright,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"monospace"}}/>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>Select Tier</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {TIERS.map(t=>(
                    <button key={t.id} onClick={()=>setSelectedTier(t)} style={{
                      padding:"8px 12px",borderRadius:8,border:`1px solid ${selectedTier.id===t.id?t.color:Q.plasma+"22"}`,
                      background:selectedTier.id===t.id?`${t.color}20`:"transparent",
                      color:selectedTier.id===t.id?t.color:Q.dim,cursor:"pointer",fontWeight:700,fontSize:12,
                      display:"flex",justifyContent:"space-between"}}>
                      <span>{t.icon} {t.name}</span><span>{t.apy}% APY</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{background:Q.bg1,borderRadius:14,padding:"22px",border:`1px solid ${selectedTier.color}33`}}>
              <div style={{color:Q.quark,fontWeight:700,fontSize:14,marginBottom:16}}>📊 Projection Results</div>
              <div style={{textAlign:"center",padding:"16px",background:`${selectedTier.color}10`,borderRadius:12,
                border:`1px solid ${selectedTier.color}33`,marginBottom:16}}>
                <div style={{fontSize:11,color:Q.dim,marginBottom:4}}>Yearly Earnings</div>
                <div style={{fontSize:32,fontWeight:900,color:selectedTier.color,
                  textShadow:`0 0 ${12+pulse*8}px ${selectedTier.color}`}}>
                  +{yearly} QEMMA
                </div>
                <div style={{color:Q.dim,fontSize:12}}>${(parseFloat(yearly)*price).toFixed(2)}</div>
              </div>
              {[
                ["Daily",   daily,   Q.dim],
                ["Weekly",  weekly,  Q.mid],
                ["Monthly", monthly, Q.gluon],
                ["6 Months",(amount*selectedTier.apy/100/2).toFixed(2), Q.plasma],
                ["1 Year",  yearly,  selectedTier.color],
              ].map(([p,v,c])=>(
                <div key={p} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",
                  borderBottom:`1px solid ${Q.plasma}11`,fontSize:12}}>
                  <span style={{color:Q.dim}}>{p}</span>
                  <span style={{color:c,fontWeight:700}}>+{parseFloat(v).toLocaleString()} QEMMA (${(parseFloat(v)*price).toFixed(2)})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
