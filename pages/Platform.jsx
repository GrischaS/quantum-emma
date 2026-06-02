// ============================================================
//  QUANTUM EMMA — Token Launch Dashboard v5.0 (B3)
//  IDO Countdown · Whitelist · Tokenomics · Fundraising
//  4D/5D Holographic · © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};

function useTick(ms=100){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);return t;}
function Bar({v,c,h=8}){return<div style={{height:h,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}><div style={{height:h,width:`${Math.min(v,100)}%`,background:c,borderRadius:4,transition:"width 1s",boxShadow:`0 0 8px ${c}66`}}/></div>;}

// ─── COUNTDOWN TIMER ──────────────────────────────────────────────────────────
function Countdown({ targetDate }) {
  const [time, setTime] = useState({d:0,h:0,m:0,s:0});
  useEffect(()=>{
    const update = () => {
      const diff = Math.max(0, new Date(targetDate)-Date.now());
      setTime({
        d: Math.floor(diff/86400000),
        h: Math.floor((diff%86400000)/3600000),
        m: Math.floor((diff%3600000)/60000),
        s: Math.floor((diff%60000)/1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return ()=>clearInterval(id);
  },[targetDate]);
  return (
    <div style={{display:"flex",gap:12,justifyContent:"center"}}>
      {[["d","Days"],["h","Hours"],["m","Mins"],["s","Secs"]].map(([k,l])=>(
        <div key={k} style={{textAlign:"center",background:`${Q.plasma}15`,borderRadius:12,
          padding:"12px 16px",border:`1px solid ${Q.plasma}44`,minWidth:64}}>
          <div style={{fontSize:28,fontWeight:900,color:Q.photon,fontFamily:"monospace",
            textShadow:`0 0 16px ${Q.photon}`}}>{String(time[k]).padStart(2,"0")}</div>
          <div style={{fontSize:10,color:Q.dim,marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// ─── TOKENOMICS RING CHART ────────────────────────────────────────────────────
function TokenomicsChart({ size=200 }) {
  const segments = [
    {label:"Public IDO",    pct:30, color:Q.plasma},
    {label:"Team",          pct:15, color:Q.higgs},
    {label:"Ecosystem",     pct:20, color:Q.gluon},
    {label:"Staking Pool",  pct:15, color:Q.lepton},
    {label:"Reserve",       pct:10, color:Q.boson},
    {label:"Marketing",     pct:10, color:Q.muon},
  ];
  const cx=size/2, cy=size/2, R=size*0.42, ri=size*0.28;
  let angle=-90;
  return (
    <div style={{position:"relative",display:"inline-block"}}>
      <svg width={size} height={size}>
        {segments.map((s,i)=>{
          const deg=s.pct*3.6;
          const start=angle, end=angle+deg-1;
          angle+=deg;
          const sr=start*Math.PI/180, er=end*Math.PI/180;
          const x1=cx+R*Math.cos(sr),y1=cy+R*Math.sin(sr);
          const x2=cx+R*Math.cos(er),y2=cy+R*Math.sin(er);
          const large=deg>180?1:0;
          const x3=cx+ri*Math.cos(er),y3=cy+ri*Math.sin(er);
          const x4=cx+ri*Math.cos(sr),y4=cy+ri*Math.sin(sr);
          return (
            <path key={i} d={`M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ri} ${ri} 0 ${large} 0 ${x4} ${y4} Z`}
              fill={s.color} fillOpacity="0.85" stroke={Q.void} strokeWidth="1.5"
              style={{filter:`drop-shadow(0 0 4px ${s.color}66)`}}/>
          );
        })}
        <text x={cx} y={cy-6} textAnchor="middle" fill={Q.bright} fontSize="13" fontWeight="900">100M</text>
        <text x={cx} y={cy+10} textAnchor="middle" fill={Q.dim} fontSize="9">QEMMA</text>
      </svg>
    </div>
  );
}

// ─── WHITELIST FORM ───────────────────────────────────────────────────────────
function WhitelistForm() {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [tier, setTier] = useState("standard");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email || !wallet) return;
    setLoading(true);
    setTimeout(()=>{ setLoading(false); setSubmitted(true); }, 1500);
  };

  if (submitted) return (
    <div style={{textAlign:"center",padding:"30px 20px"}}>
      <div style={{fontSize:40,marginBottom:12}}>🎉</div>
      <div style={{fontSize:18,fontWeight:900,color:Q.lepton,marginBottom:8}}>You're on the Whitelist!</div>
      <div style={{color:Q.dim,fontSize:13}}>Check your email for confirmation. IDO starts July 15, 2026.</div>
      <div style={{marginTop:16,padding:"10px 16px",background:`${Q.lepton}15`,borderRadius:10,
        border:`1px solid ${Q.lepton}33`,fontSize:12,color:Q.lepton}}>
        Tier: {tier.toUpperCase()} · Allocation: {tier==="diamond"?"$5,000":tier==="gold"?"$2,500":"$1,000"}
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div>
        <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>Email Address</div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
          style={{width:"100%",background:Q.bg2,border:`1px solid ${Q.plasma}44`,borderRadius:8,
            padding:"10px 12px",color:Q.bright,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
      </div>
      <div>
        <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>Wallet Address (EVM)</div>
        <input value={wallet} onChange={e=>setWallet(e.target.value)} placeholder="0x..."
          style={{width:"100%",background:Q.bg2,border:`1px solid ${Q.plasma}44`,borderRadius:8,
            padding:"10px 12px",color:Q.bright,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"monospace"}}/>
      </div>
      <div>
        <div style={{fontSize:11,color:Q.dim,marginBottom:6}}>Tier</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
          {[
            {id:"standard",label:"🌟 Standard",alloc:"$1,000",color:Q.mid},
            {id:"gold",    label:"🥇 Gold",    alloc:"$2,500",color:Q.higgs},
            {id:"diamond", label:"💎 Diamond", alloc:"$5,000",color:Q.photon},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTier(t.id)} style={{
              padding:"8px",borderRadius:8,border:`1px solid ${tier===t.id?t.color:Q.plasma+"22"}`,
              background:tier===t.id?`${t.color}20`:"transparent",
              color:tier===t.id?t.color:Q.dim,cursor:"pointer",fontSize:11,textAlign:"center"}}>
              <div style={{fontWeight:700}}>{t.label}</div>
              <div style={{fontSize:10,marginTop:2}}>{t.alloc}</div>
            </button>
          ))}
        </div>
      </div>
      <button onClick={submit} disabled={!email||!wallet||loading} style={{
        padding:"13px",borderRadius:12,border:"none",cursor:email&&wallet?"pointer":"not-allowed",
        background:email&&wallet?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:`${Q.plasma}33`,
        color:Q.bright,fontWeight:800,fontSize:14,letterSpacing:1,
        boxShadow:email&&wallet?`0 0 20px ${Q.plasma}55`:"none"}}>
        {loading?"⏳ Registering...":"⚡ Join Whitelist"}
      </button>
    </div>
  );
}

// ─── MAIN PLATFORM ────────────────────────────────────────────────────────────
export default function Platform() {
  const tick = useTick(100);
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;
  const [tab, setTab] = useState("ido");

  // IDO target: July 15, 2026
  const IDO_DATE = "2026-07-15T12:00:00Z";
  const raised = 2840000;
  const target = 5000000;
  const raisedPct = (raised/target*100).toFixed(1);

  const tokenomics = [
    {label:"Public IDO",   pct:30, color:Q.plasma,  tokens:"30M",  price:"$0.15"},
    {label:"Ecosystem",    pct:20, color:Q.gluon,   tokens:"20M",  price:"Locked 12m"},
    {label:"Team",         pct:15, color:Q.higgs,   tokens:"15M",  price:"Locked 24m"},
    {label:"Staking Pool", pct:15, color:Q.lepton,  tokens:"15M",  price:"Rewards"},
    {label:"Reserve",      pct:10, color:Q.boson,   tokens:"10M",  price:"DAO"},
    {label:"Marketing",    pct:10, color:Q.muon,    tokens:"10M",  price:"Vesting"},
  ];

  const roadmap = [
    {phase:"Q1 2026",title:"Genesis Launch",   status:"done",   items:["Token Contract","HQMLL v1","Platform Beta"]},
    {phase:"Q2 2026",title:"Enterprise v4.1",  status:"done",   items:["7 Smart Contracts","CI/CD Pipeline","124 Tests"]},
    {phase:"Q3 2026",title:"IDO + DEX Launch", status:"active", items:["Whitelist IDO","Uniswap V3","CoinGecko Listing"]},
    {phase:"Q4 2026",title:"Mobile + Scale",   status:"soon",   items:["Android App","iOS App","Gate.io Listing"]},
    {phase:"Q1 2027",title:"AI Intelligence",  status:"soon",   items:["Meta Genius TR3","On-chain AI","DAO Governance"]},
  ];

  const exchanges = [
    {name:"Uniswap V3",  stage:"IDO",      status:"active", logo:"🦄",color:Q.boson},
    {name:"CoinGecko",   stage:"Listing",  status:"active", logo:"🦎",color:Q.lepton},
    {name:"Gate.io",     stage:"Q4 2026",  status:"soon",   logo:"🔵",color:Q.gluon},
    {name:"MEXC",        stage:"Q4 2026",  status:"soon",   logo:"🔴",color:Q.tauon},
    {name:"Bybit",       stage:"Q1 2027",  status:"future", logo:"🟡",color:Q.higgs},
    {name:"Binance",     stage:"Target",   status:"future", logo:"💛",color:Q.higgs},
  ];

  return (
    <div style={{minHeight:"100vh",background:Q.void,color:Q.bright,fontFamily:"'Inter',sans-serif",paddingBottom:40}}>

      {/* ── HERO BANNER ── */}
      <div style={{background:`linear-gradient(135deg,${Q.void},${Q.bg2},${Q.void})`,
        borderBottom:`1px solid ${Q.plasma}44`,padding:"40px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>

        {/* Particle BG */}
        {Array.from({length:20},(_,i)=>(
          <div key={i} style={{position:"absolute",
            left:`${(i*47+tick*0.3)%100}%`,top:`${(i*31+tick*0.2)%100}%`,
            width:2+i%3,height:2+i%3,borderRadius:"50%",
            background:i%3===0?Q.plasma:i%3===1?Q.gluon:Q.photon,
            opacity:0.2+Math.sin(tick*0.05+i)*0.15,pointerEvents:"none"}}/>
        ))}

        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:11,letterSpacing:4,color:Q.plasma,fontWeight:700,marginBottom:8}}>
            ⚛️ QUANTUM EMMA · OFFICIAL TOKEN LAUNCH
          </div>
          <div style={{fontSize:36,fontWeight:900,background:`linear-gradient(135deg,${Q.photon},${Q.plasma},${Q.boson})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8,lineHeight:1.2}}>
            QEMMA IDO
          </div>
          <div style={{color:Q.mid,fontSize:14,marginBottom:24}}>
            The AI-Native Trading Token · 100M Max Supply · IDO Price: $0.15
          </div>
          <Countdown targetDate={IDO_DATE}/>
        </div>
      </div>

      {/* ── FUNDRAISE BAR ── */}
      <div style={{background:Q.deep,padding:"20px 24px",borderBottom:`1px solid ${Q.plasma}22`}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{color:Q.bright,fontWeight:700}}>🔥 Fundraising Progress</span>
            <span style={{color:Q.higgs,fontWeight:700}}>{raisedPct}% of $5M Target</span>
          </div>
          <div style={{height:14,background:`${Q.plasma}15`,borderRadius:7,overflow:"hidden",
            border:`1px solid ${Q.plasma}33`}}>
            <div style={{height:"100%",width:`${raisedPct}%`,
              background:`linear-gradient(90deg,${Q.plasma},${Q.gluon},${Q.photon})`,
              borderRadius:7,transition:"width 1s",
              boxShadow:`0 0 16px ${Q.gluon}88`}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:11}}>
            <span style={{color:Q.lepton,fontWeight:700}}>Raised: ${(raised/1e6).toFixed(2)}M</span>
            <span style={{color:Q.dim}}>2,840 Contributors</span>
            <span style={{color:Q.dim}}>Target: $5.00M</span>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{maxWidth:1200,margin:"20px auto",padding:"0 16px",
        display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
        {[
          {label:"IDO Price",   value:"$0.15",  color:Q.plasma},
          {label:"Max Supply",  value:"100M",   color:Q.gluon},
          {label:"Circulating", value:"15.2M",  color:Q.higgs},
          {label:"Current",     value:"$0.63",  color:Q.lepton},
          {label:"Target MCap", value:"$15M",   color:Q.boson},
        ].map((s,i)=>(
          <div key={i} style={{background:Q.bg1,borderRadius:12,padding:"14px",textAlign:"center",
            border:`1px solid ${s.color}${Math.round((0.1+pulse*0.1)*255).toString(16).padStart(2,"0")}`}}>
            <div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.value}</div>
            <div style={{fontSize:10,color:Q.dim,marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── TABS ── */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 16px"}}>
        <div style={{display:"flex",gap:4,background:Q.bg1,borderRadius:10,padding:4,
          border:`1px solid ${Q.plasma}22`,marginBottom:16,width:"fit-content"}}>
          {[["ido","🚀 IDO"],["tokenomics","💎 Tokenomics"],["roadmap","🗺 Roadmap"],["exchanges","📈 Exchanges"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:"7px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
              background:tab===t?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:"transparent",
              color:tab===t?Q.bright:Q.dim,boxShadow:tab===t?`0 0 10px ${Q.plasma}44`:"none"}}>
              {l}
            </button>
          ))}
        </div>

        {/* IDO TAB */}
        {tab==="ido" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:16}}>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:Q.bg1,borderRadius:14,padding:"20px",border:`1px solid ${Q.plasma}22`}}>
                <div style={{color:Q.quark,fontWeight:700,fontSize:15,marginBottom:16}}>📋 IDO Details</div>
                {[
                  ["Sale Type","Public IDO + Whitelist"],
                  ["IDO Price","$0.15 per QEMMA"],
                  ["Total Raise","$4,500,000 (30M tokens)"],
                  ["Min Buy","$100 (667 QEMMA)"],
                  ["Max Buy","$5,000 (33,333 QEMMA)"],
                  ["Vesting","20% TGE · 80% over 6 months"],
                  ["Network","Ethereum (ERC-20)"],
                  ["Launch Date","July 15, 2026 — 12:00 UTC"],
                  ["DEX Listing","Uniswap V3 — same day"],
                  ["Listing Price","$0.25 (+67% from IDO)"],
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",
                    padding:"8px 0",borderBottom:`1px solid ${Q.plasma}11`,fontSize:13}}>
                    <span style={{color:Q.dim}}>{k}</span>
                    <span style={{color:Q.bright,fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{background:Q.bg1,borderRadius:14,padding:"20px",border:`1px solid ${Q.higgs}22`}}>
                <div style={{color:Q.higgs,fontWeight:700,fontSize:14,marginBottom:12}}>⚠️ Important Dates</div>
                {[
                  {date:"Jun 20, 2026", event:"Whitelist Opens",   done:false},
                  {date:"Jul 10, 2026", event:"Whitelist Closes",  done:false},
                  {date:"Jul 15, 2026", event:"IDO Launch",        done:false},
                  {date:"Jul 15, 2026", event:"Uniswap Listing",   done:false},
                  {date:"Aug 15, 2026", event:"First Vesting",     done:false},
                ].map((d,i)=>(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"8px 0",
                    borderBottom:`1px solid ${Q.plasma}11`}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:d.done?Q.lepton:Q.plasma,flexShrink:0,
                      boxShadow:`0 0 6px ${d.done?Q.lepton:Q.plasma}`}}/>
                    <div style={{flex:1,fontSize:13,color:Q.mid}}>{d.event}</div>
                    <div style={{fontSize:11,color:Q.dim,fontFamily:"monospace"}}>{d.date}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:Q.bg1,borderRadius:14,padding:"20px",border:`1px solid ${Q.plasma}33`,
              boxShadow:`0 0 ${16+pulse*8}px ${Q.plasma}1a`}}>
              <div style={{color:Q.quark,fontWeight:700,fontSize:15,marginBottom:16}}>🎯 Join Whitelist</div>
              <WhitelistForm/>
            </div>
          </div>
        )}

        {/* TOKENOMICS TAB */}
        {tab==="tokenomics" && (
          <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:16}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
              <div style={{background:Q.bg1,borderRadius:14,padding:"20px",border:`1px solid ${Q.plasma}22`,width:"100%",textAlign:"center"}}>
                <div style={{color:Q.quark,fontWeight:700,marginBottom:14}}>💎 Token Distribution</div>
                <TokenomicsChart size={200}/>
              </div>
            </div>
            <div style={{background:Q.bg1,borderRadius:14,padding:"20px",border:`1px solid ${Q.plasma}22`}}>
              <div style={{color:Q.quark,fontWeight:700,fontSize:14,marginBottom:16}}>📊 Allocation Breakdown</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {tokenomics.map((t,i)=>(
                  <div key={i} style={{padding:"12px 14px",borderRadius:10,background:`${t.color}0a`,
                    border:`1px solid ${t.color}22`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:10,height:10,borderRadius:"50%",background:t.color,
                          boxShadow:`0 0 6px ${t.color}`}}/>
                        <span style={{fontWeight:700,color:Q.bright,fontSize:13}}>{t.label}</span>
                      </div>
                      <div style={{display:"flex",gap:16,fontSize:12}}>
                        <span style={{color:t.color,fontWeight:700}}>{t.pct}%</span>
                        <span style={{color:Q.mid}}>{t.tokens}</span>
                        <span style={{color:Q.dim}}>{t.price}</span>
                      </div>
                    </div>
                    <Bar v={t.pct} c={t.color} h={6}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ROADMAP TAB */}
        {tab==="roadmap" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {roadmap.map((r,i)=>{
              const c = r.status==="done"?Q.lepton:r.status==="active"?Q.plasma:Q.dim;
              return (
                <div key={i} style={{display:"flex",gap:16,padding:"16px 20px",borderRadius:14,
                  background:Q.bg1,border:`1px solid ${c}${r.status==="active"?"66":"22"}`,
                  boxShadow:r.status==="active"?`0 0 ${14+pulse*10}px ${c}1a`:"none"}}>
                  <div style={{minWidth:80,textAlign:"center"}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:`${c}20`,border:`2px solid ${c}`,
                      display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 4px",
                      boxShadow:`0 0 ${r.status==="active"?10+pulse*8:4}px ${c}66`}}>
                      {r.status==="done"?"✓":r.status==="active"?"⚡":"○"}
                    </div>
                    <div style={{fontSize:10,color:Q.dim}}>{r.phase}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:15,color:c,marginBottom:8}}>{r.title}</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {r.items.map((item,j)=>(
                        <span key={j} style={{padding:"3px 10px",borderRadius:20,fontSize:11,
                          background:`${c}15`,color:c,border:`1px solid ${c}33`}}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* EXCHANGES TAB */}
        {tab==="exchanges" && (
          <div>
            <div style={{color:Q.dim,fontSize:13,marginBottom:16}}>
              Exchange listing strategy: Uniswap → CoinGecko → Tier-2 CEX → Tier-1 CEX
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {exchanges.map((ex,i)=>{
                const c = ex.status==="active"?ex.color:ex.status==="soon"?Q.higgs:Q.dim;
                return (
                  <div key={i} style={{background:Q.bg1,borderRadius:14,padding:"18px 20px",
                    border:`1px solid ${c}${ex.status==="active"?"66":"22"}`,
                    boxShadow:ex.status==="active"?`0 0 ${12+pulse*8}px ${c}1a`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <div style={{fontSize:28}}>{ex.logo}</div>
                      <div>
                        <div style={{fontWeight:800,color:Q.bright,fontSize:14}}>{ex.name}</div>
                        <div style={{fontSize:10,color:c,fontWeight:700,
                          background:`${c}15`,padding:"2px 8px",borderRadius:20,border:`1px solid ${c}33`,display:"inline-block",marginTop:2}}>
                          {ex.status==="active"?"🟢 Active":ex.status==="soon"?"🟡 Soon":"🔵 Planned"}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
                      <span style={{color:Q.dim}}>Stage</span>
                      <span style={{color:c,fontWeight:700}}>{ex.stage}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
