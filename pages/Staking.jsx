// ============================================================
//  QUANTUM EMMA — Staking Vault Enterprise v3.0
//  4D/5D Holographic · 5 Tiers · Auto-Compound · Live TVL
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef } from "react";

const Q = {
  void:"#000008", bg0:"#030012", bg1:"#06001e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};
function useTick(ms=100){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[]);return t;}
function Bar({v,c,h=4}){return<div style={{height:h,background:"rgba(255,255,255,0.05)",borderRadius:h/2}}><div style={{height:h,width:`${Math.min(v,100)}%`,background:c,borderRadius:h/2,transition:"width .6s",boxShadow:`0 0 8px ${c}66`}}/></div>;}
function HoloCard({children,color=Q.plasma,style={},tick=0,glow=false}){
  const p=.5+Math.sin(tick*.07)*.28;
  return<div style={{borderRadius:16,padding:"18px 20px",background:`linear-gradient(135deg,${color}12,${color}06,transparent)`,border:`1px solid ${color}${Math.round((p*.22+.08)*255).toString(16).padStart(2,"00")}`,boxShadow:glow?`0 0 ${Math.round(20+p*14)}px ${color}1a,inset 0 0 30px ${color}08`:"none",backdropFilter:"blur(8px)",position:"relative",overflow:"hidden",...style}}>
    <div style={{position:"absolute",top:0,left:`${(-50+tick*1.4)%200}%`,width:"50%",height:"100%",background:`linear-gradient(90deg,transparent,${color}06,transparent)`,pointerEvents:"none"}}/>
    {children}
  </div>;
}

const TIERS = [
  {id:0,name:"FLEXIBLE", lock:0,   apy:12, min:1,      icon:"🔓",color:"#94a3b8",penalty:0,  tvl:12847291,stakers:4821,desc:"No lock. Flexible withdraw anytime."},
  {id:1,name:"BRONZE",   lock:30,  apy:18, min:100,    icon:"🥉",color:"#cd7f32",penalty:15, tvl:9421044, stakers:2944,desc:"30-day lock. Entry level commitment."},
  {id:2,name:"SILVER",   lock:90,  apy:24, min:500,    icon:"🥈",color:"#c0c0c0",penalty:15, tvl:7291822, stakers:1847,desc:"90-day lock. Enhanced yield."},
  {id:3,name:"GOLD",     lock:180, apy:36, min:1000,   icon:"🥇",color:"#fbbf24",penalty:15, tvl:4891033, stakers:921, desc:"180-day lock. Premium rewards."},
  {id:4,name:"QUANTUM",  lock:365, apy:60, min:5000,   icon:"⚛️",color:"#8b5cf6",penalty:15, tvl:18421099,stakers:412, desc:"365-day lock. Maximum 60% APY."},
];

// ─── HOLOGRAPHIC EYE (mini) ───────────────────────────────────────────────────
function MiniEye({size=28,tick,color=Q.neutrino}){
  const t=tick*.03,rot=(tick*.8)%360;
  return(
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{filter:`drop-shadow(0 0 6px ${color})`,flexShrink:0}}>
      <defs><radialGradient id={`me${size}`} cx="42%" cy="38%">
        <stop offset="0%" stopColor="#c4b5fd"/><stop offset="50%" stopColor={color}/><stop offset="100%" stopColor="#3b0764"/>
      </radialGradient></defs>
      <circle cx="50" cy="50" r="48" fill={`url(#me${size})`}/>
      <g transform={`rotate(${rot},50,50)`}>
        <ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity=".5" strokeDasharray="4 6"/>
      </g>
      <circle cx={50+Math.cos(t)*4} cy={50+Math.sin(t)*4} r="11" fill="#000" fillOpacity=".72"/>
      <circle cx={50+Math.cos(t)*4+3} cy={50+Math.sin(t)*4-3} r="4" fill="#fff" fillOpacity=".5"/>
      <text x="50" y="57" textAnchor="middle" fontSize="20" fontWeight="900" fontFamily="Arial Black" fill="#fff" fillOpacity=".9">Q</text>
    </svg>
  );
}

// ─── TVL LINE CHART ───────────────────────────────────────────────────────────
function TVLChart({tick}){
  const data=useRef(Array.from({length:30},(_,i)=>48+Math.sin(i*.4)*8+i*.3)).current;
  const h=70,min=Math.min(...data),max=Math.max(...data),range=max-min||1;
  const pts=data.map((v,i)=>`${i*(100/(data.length-1))},${h-((v-min)/range)*h}`).join(" ");
  return(
    <svg width="100%" height={h+16} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id="tvlG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={Q.neutrino} stopOpacity=".35"/>
          <stop offset="100%" stopColor={Q.neutrino} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} 100,${h}`} fill="url(#tvlG)"/>
      <polyline points={pts} fill="none" stroke={Q.neutrino} strokeWidth="2"
        style={{filter:`drop-shadow(0 0 5px ${Q.neutrino})`}}/>
      <circle cx={(data.length-1)*(100/(data.length-1))} cy={h-((data[data.length-1]-min)/range)*h} r="3.5"
        fill={Q.neutrino} style={{filter:`drop-shadow(0 0 7px ${Q.neutrino})`}}/>
      {[0,.5,1].map(f=>(
        <text key={f} x="1" y={h-h*f+4} fontSize="8" fill={Q.dim} fontFamily="monospace">
          {(min+range*f).toFixed(0)}M
        </text>
      ))}
    </svg>
  );
}

// ─── TIER CARD ────────────────────────────────────────────────────────────────
function TierCard({tier,selected,onClick,tick}){
  const p=.5+Math.sin(tick*.07+tier.id*.8)*.38;
  return(
    <div onClick={onClick} style={{
      padding:"20px 16px",borderRadius:16,cursor:"pointer",textAlign:"center",
      background:selected?`${tier.color}22`:`${tier.color}0a`,
      border:`2px solid ${tier.color}${Math.round((selected?.55:.18)*255).toString(16).padStart(2,"00")}`,
      boxShadow:selected?`0 0 28px ${tier.color}28`:`0 0 ${Math.round(p*14)}px ${tier.color}0c`,
      transition:"all .2s",position:"relative",overflow:"hidden",
    }}>
      {selected&&<div style={{position:"absolute",top:0,left:`${(-50+tick*1.6)%200}%`,width:"50%",height:"100%",
        background:`linear-gradient(90deg,transparent,${tier.color}10,transparent)`,pointerEvents:"none"}}/>}
      <div style={{fontSize:30,marginBottom:8,filter:selected?`drop-shadow(0 0 10px ${tier.color})`:"none"}}>{tier.icon}</div>
      <div style={{fontWeight:900,fontSize:12,color:tier.color,letterSpacing:1,marginBottom:3}}>{tier.name}</div>
      <div style={{fontSize:9,color:Q.dim,marginBottom:12}}>{tier.lock===0?"No Lock":`${tier.lock} Days`}</div>
      <div style={{fontSize:32,fontWeight:900,color:tier.color,lineHeight:1,
        textShadow:`0 0 ${Math.round(p*12)}px ${tier.color}`}}>{tier.apy}%</div>
      <div style={{fontSize:9,color:Q.dim,marginTop:3,marginBottom:12}}>APY</div>
      <Bar v={tier.apy/.6} c={tier.color} h={3}/>
      <div style={{marginTop:10,fontSize:9,color:Q.dim}}>{(tier.tvl/1e6).toFixed(1)}M QEMMA TVL</div>
      <div style={{fontSize:9,color:Q.dim,marginTop:2}}>{tier.stakers.toLocaleString()} stakers</div>
    </div>
  );
}

// ─── REWARDS CALCULATOR ───────────────────────────────────────────────────────
function Calculator({tier,tick}){
  const [amt,setAmt]=useState("5000");
  const [compound,setCompound]=useState(true);
  const a=parseFloat(amt||0), r=tier.apy/100;
  const simple=a*r;
  const comp=a*(Math.pow(1+r/365,365)-1);
  const yearly=compound?comp:simple;
  const boost=((comp-simple)/simple*100).toFixed(1);
  const timeline=[7,30,90,180,365].map(d=>({d,v:compound?a*(Math.pow(1+r/365,d)-1):a*r*(d/365)}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <HoloCard color={tier.color} tick={tick} glow>
        <div style={{fontWeight:800,fontSize:12,color:tier.color,letterSpacing:1,marginBottom:14,
          display:"flex",alignItems:"center",gap:10}}>
          <MiniEye size={22} tick={tick} color={tier.color}/>
          🧮 REWARD CALCULATOR — {tier.name}
        </div>

        {/* Amount input */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:9,color:Q.dim,letterSpacing:1,marginBottom:6}}>QEMMA AMOUNT</div>
          <input value={amt} onChange={e=>setAmt(e.target.value)} type="number"
            style={{width:"100%",padding:"12px 16px",borderRadius:11,
              background:"rgba(0,0,0,0.55)",border:`1px solid ${tier.color}44`,
              color:Q.bright,fontSize:22,fontWeight:900,boxSizing:"border-box",fontFamily:"monospace"}}/>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            {[1000,5000,10000,50000,100000].map(v=>(
              <button key={v} onClick={()=>setAmt(String(v))} style={{
                flex:1,padding:"6px",borderRadius:8,border:"none",cursor:"pointer",
                background:parseInt(amt)===v?`${tier.color}28`:"rgba(255,255,255,0.05)",
                color:parseInt(amt)===v?tier.color:Q.dim,fontSize:9,fontWeight:700}}>
                {v>=1000?`${v/1000}k`:v}
              </button>
            ))}
          </div>
        </div>

        {/* Compound toggle */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div onClick={()=>setCompound(c=>!c)} style={{width:42,height:23,borderRadius:12,cursor:"pointer",
            background:compound?tier.color:"rgba(255,255,255,0.1)",position:"relative",transition:"background .2s"}}>
            <div style={{position:"absolute",top:3,left:compound?21:3,width:17,height:17,
              borderRadius:"50%",background:"#fff",transition:"left .2s",
              boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
          </div>
          <span style={{fontSize:11,color:compound?tier.color:Q.dim,fontWeight:700}}>Auto-Compound (Daily)</span>
          {compound&&<span style={{fontSize:9,fontWeight:800,color:Q.lepton,
            background:`${Q.lepton}18`,padding:"2px 8px",borderRadius:20,border:`1px solid ${Q.lepton}33`}}>
            +{boost}% vs simple
          </span>}
        </div>

        {/* 4 reward boxes */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
          {[
            {l:"Daily",   v:(yearly/365).toFixed(2)},
            {l:"Monthly", v:(yearly/12).toFixed(2)},
            {l:"Yearly",  v:yearly.toFixed(2)},
            {l:`${tier.lock||365}d Lock`,v:(yearly*(tier.lock||365)/365).toFixed(2)},
          ].map((r,i)=>(
            <div key={i} style={{padding:"12px 8px",borderRadius:10,textAlign:"center",
              background:"rgba(0,0,0,0.4)",border:`1px solid ${tier.color}22`,
              boxShadow:`0 0 8px ${tier.color}0a`}}>
              <div style={{fontSize:9,color:Q.dim}}>{r.l}</div>
              <div style={{fontSize:15,fontWeight:900,color:tier.color,marginTop:5,fontFamily:"monospace",
                textShadow:`0 0 8px ${tier.color}88`}}>{r.v}</div>
              <div style={{fontSize:8,color:Q.dim,marginTop:2}}>QEMMA</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:9,color:Q.dim,marginBottom:8,letterSpacing:1}}>ROI TIMELINE</div>
          {timeline.map(t=>(
            <div key={t.d} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:9,color:Q.dim,width:34,flexShrink:0}}>{t.d}d</span>
              <div style={{flex:1,height:5,background:"rgba(255,255,255,0.05)",borderRadius:3}}>
                <div style={{height:5,width:`${Math.min(t.v/a*100*5,100)}%`,
                  background:tier.color,borderRadius:3,
                  boxShadow:`0 0 6px ${tier.color}`,transition:"width .5s"}}/>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:tier.color,width:74,textAlign:"right",fontFamily:"monospace"}}>
                +{t.v.toFixed(2)} Q
              </span>
            </div>
          ))}
        </div>

        {/* Stake button */}
        <button style={{width:"100%",padding:"15px",borderRadius:13,border:"none",cursor:"pointer",
          background:`linear-gradient(135deg,${tier.color},${tier.color}aa)`,
          color:"#000",fontSize:14,fontWeight:900,letterSpacing:2,
          boxShadow:`0 4px 20px ${tier.color}44`}}>
          {tier.icon} STAKE {parseFloat(amt||0).toLocaleString()} QEMMA — {tier.name}
        </button>

        {tier.penalty>0&&(
          <div style={{marginTop:10,padding:"8px 12px",borderRadius:9,
            background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.22)",
            fontSize:10,color:Q.mid,textAlign:"center",lineHeight:1.6}}>
            ⚠️ Early exit penalty: <b style={{color:Q.tauon}}>15%</b> ·
            Lock: <b style={{color:tier.color}}>{tier.lock} days</b> ·
            Min stake: <b style={{color:tier.color}}>{tier.min.toLocaleString()} QEMMA</b>
          </div>
        )}
      </HoloCard>
    </div>
  );
}

// ─── VAULT STATS ─────────────────────────────────────────────────────────────
function VaultStats({tick}){
  const totalTVL=TIERS.reduce((s,t)=>s+t.tvl,0);
  const totalS=TIERS.reduce((s,t)=>s+t.stakers,0);
  const rewards=284420+tick*.8;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <HoloCard color={Q.neutrino} tick={tick} glow>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontWeight:800,fontSize:12,color:Q.neutrino,letterSpacing:1}}>📈 TOTAL VALUE LOCKED</div>
          <div style={{fontSize:20,fontWeight:900,color:Q.neutrino,fontFamily:"monospace",
            textShadow:`0 0 12px ${Q.neutrino}`}}>{(totalTVL/1e6).toFixed(2)}M QEMMA</div>
        </div>
        <div style={{fontSize:11,color:Q.lepton,marginBottom:10,fontWeight:700}}>
          ▲ +2.4% (7d) · ${(totalTVL*.63/1e6).toFixed(2)}M USD
        </div>
        <TVLChart tick={tick}/>
      </HoloCard>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {[
          {l:"Total Stakers",   v:totalS.toLocaleString(),   c:Q.gluon},
          {l:"Rewards Paid 7d", v:`${rewards.toFixed(0)} Q`, c:Q.lepton},
          {l:"Average APY",     v:"31.4%",                   c:Q.higgs},
          {l:"QUANTUM TVL",     v:"18.4M Q",                 c:Q.neutrino},
          {l:"Compound Boost",  v:"up to +4.2%",             c:Q.boson},
          {l:"Audit Status",    v:"✓ Audited",               c:Q.lepton},
        ].map((s,i)=>{
          const p=.5+Math.sin(tick*.07+i*.5)*.3;
          return(
            <div key={i} style={{padding:"11px 12px",borderRadius:10,textAlign:"center",
              background:`${s.c}0a`,
              border:`1px solid ${s.c}${Math.round(18+p*14).toString(16).padStart(2,"00")}`,
              boxShadow:`0 0 ${Math.round(p*10)}px ${s.c}0e`}}>
              <div style={{fontSize:8,color:Q.dim,letterSpacing:1}}>{s.l}</div>
              <div style={{fontSize:13,fontWeight:900,color:s.c,marginTop:5,
                textShadow:`0 0 8px ${s.c}88`}}>{s.v}</div>
            </div>
          );
        })}
      </div>

      <HoloCard color={Q.plasma} tick={tick}>
        <div style={{fontWeight:800,fontSize:11,color:Q.plasma,letterSpacing:1,marginBottom:12}}>
          DISTRIBUTION BY TIER
        </div>
        {TIERS.map(t=>(
          <div key={t.id} style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:10}}>
              <span style={{color:t.color,fontWeight:700}}>{t.icon} {t.name}</span>
              <div style={{display:"flex",gap:12,color:Q.dim}}>
                <span style={{fontFamily:"monospace"}}>{(t.tvl/1e6).toFixed(1)}M Q</span>
                <span style={{color:t.color,fontWeight:700}}>{(t.tvl/totalTVL*100).toFixed(1)}%</span>
              </div>
            </div>
            <Bar v={t.tvl/totalTVL*100} c={t.color} h={5}/>
          </div>
        ))}
      </HoloCard>
    </div>
  );
}

// ─── ACTIVE POSITIONS ─────────────────────────────────────────────────────────
function ActivePositions({tick}){
  const [pos]=useState([
    {tier:"QUANTUM",icon:"⚛️",c:Q.neutrino,staked:5000,apy:60,end:"2027-01-14",cost:3150},
    {tier:"GOLD",   icon:"🥇",c:Q.higgs,   staked:2000,apy:36,end:"2026-08-22",cost:1260},
    {tier:"SILVER", icon:"🥈",c:"#c0c0c0", staked:500, apy:24,end:"2026-06-10",cost:315},
  ]);
  const getEarned=p=>(p.staked*p.apy/100/365/24/3600*tick*.1).toFixed(6);

  return(
    <HoloCard color={Q.neutrino} tick={tick}>
      <div style={{fontWeight:800,fontSize:12,color:Q.neutrino,letterSpacing:1,marginBottom:14,
        display:"flex",alignItems:"center",gap:8}}>
        <MiniEye size={20} tick={tick} color={Q.neutrino}/>
        📍 YOUR ACTIVE POSITIONS
      </div>
      {pos.map((p,i)=>(
        <div key={i} style={{
          display:"flex",alignItems:"center",gap:14,
          padding:"14px 16px",borderRadius:13,marginBottom:10,
          background:`${p.c}0a`,border:`1px solid ${p.c}28`,
          boxShadow:`0 0 12px ${p.c}0a`,
        }}>
          <span style={{fontSize:26,filter:`drop-shadow(0 0 8px ${p.c})`}}>{p.icon}</span>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontWeight:900,fontSize:13,color:p.c,
                textShadow:`0 0 8px ${p.c}88`}}>{p.tier}</span>
              <span style={{fontSize:11,color:Q.lepton,fontWeight:800,fontFamily:"monospace"}}>
                +{getEarned(p)} QEMMA
              </span>
            </div>
            <div style={{fontSize:10,color:Q.dim,marginBottom:6}}>
              Staked: <b style={{color:Q.mid}}>{p.staked.toLocaleString()} QEMMA</b> ·
              APY: <b style={{color:p.c}}>{p.apy}%</b> ·
              Unlock: <b style={{color:Q.mid}}>{p.end}</b>
            </div>
            <Bar v={p.staked*p.apy/100/p.staked*100*.6} c={p.c} h={3}/>
          </div>
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            <button style={{padding:"7px 12px",borderRadius:9,border:"none",cursor:"pointer",
              background:`${Q.lepton}14`,color:Q.lepton,fontSize:10,fontWeight:800,
              border:`1px solid ${Q.lepton}33`}}>CLAIM</button>
            <button style={{padding:"7px 12px",borderRadius:9,border:"none",cursor:"pointer",
              background:"rgba(248,113,113,0.1)",color:Q.tauon,fontSize:10,fontWeight:800,
              border:`1px solid ${Q.tauon}22`}}>EXIT</button>
          </div>
        </div>
      ))}
    </HoloCard>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function StakingPage(){
  const tick=useTick(100);
  const [sel,setSel]=useState(4);
  const [tab,setTab]=useState("stake");
  const tier=TIERS[sel];

  return(
    <div style={{minHeight:"100vh",background:Q.void,
      fontFamily:"'Inter',system-ui,sans-serif",color:Q.bright,padding:22,
      backgroundImage:`radial-gradient(${Q.plasma}08 1px,transparent 1px)`,
      backgroundSize:"30px 30px"}}>

      {/* Header */}
      <div style={{padding:"22px 28px",borderRadius:20,marginBottom:20,
        background:`linear-gradient(135deg,${Q.higgs}12,${Q.neutrino}0a,${Q.higgs}06)`,
        border:`1px solid ${Q.higgs}44`,
        boxShadow:`0 0 60px ${Q.higgs}0e,inset 0 0 60px ${Q.neutrino}06`,
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,
          backgroundImage:`linear-gradient(${Q.higgs}06 1px,transparent 1px),linear-gradient(90deg,${Q.higgs}06 1px,transparent 1px)`,
          backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
              <MiniEye size={36} tick={tick} color={Q.higgs}/>
              <div style={{fontWeight:900,fontSize:22,color:Q.higgs,letterSpacing:2,
                textShadow:`0 0 20px ${Q.higgs}88`}}>💎 QEMMA STAKING VAULT</div>
            </div>
            <div style={{color:"#78350f",fontSize:10,letterSpacing:2,fontWeight:700}}>
              5 TIERS · UP TO 60% APY · AUTO-COMPOUND · ENTERPRISE GRADE · © 2026 GRIGORI SAKS
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            {[
              {l:"Total Staked",  v:"7,500 Q",  c:Q.higgs},
              {l:"Total Earned",  v:"284.4 Q",  c:Q.lepton},
              {l:"Best APY",      v:"60%",       c:Q.neutrino},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:"center",padding:"12px 18px",borderRadius:13,
                background:`${s.c}0d`,border:`1px solid ${s.c}33`,
                boxShadow:`0 0 12px ${s.c}18`}}>
                <div style={{fontSize:9,color:Q.dim,letterSpacing:1}}>{s.l}</div>
                <div style={{fontSize:20,fontWeight:900,color:s.c,marginTop:4,fontFamily:"monospace",
                  textShadow:`0 0 10px ${s.c}`}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier selector */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:20}}>
        {TIERS.map((t,i)=><TierCard key={t.id} tier={t} tick={tick} selected={sel===i} onClick={()=>setSel(i)}/>)}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[
          {id:"stake",  label:"Stake & Earn",  icon:"💎"},
          {id:"vaults", label:"Vault Stats",   icon:"📊"},
          {id:"active", label:"My Positions",  icon:"📍"},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"9px 20px",borderRadius:20,border:"none",cursor:"pointer",
            background:tab===t.id?`linear-gradient(135deg,${Q.higgs}35,${Q.neutrino}22)`:"rgba(255,255,255,0.04)",
            color:tab===t.id?Q.bright:Q.dim,fontWeight:700,fontSize:11,
            border:tab===t.id?`1px solid ${Q.higgs}44`:"1px solid transparent",
            boxShadow:tab===t.id?`0 0 16px ${Q.higgs}18`:"none",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Content */}
      {tab==="stake"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
          <Calculator tier={tier} tick={tick}/>
          <VaultStats tick={tick}/>
        </div>
      )}
      {tab==="vaults"&&<VaultStats tick={tick}/>}
      {tab==="active"&&<ActivePositions tick={tick}/>}

      {/* Footer */}
      <div style={{marginTop:18,padding:"12px 18px",borderRadius:12,
        background:`${Q.neutrino}06`,border:`1px solid ${Q.neutrino}14`,
        display:"flex",justifyContent:"space-between",fontSize:10}}>
        <span style={{color:Q.dim}}>QEMMAStaking.sol · OpenZeppelin ReentrancyGuard · Audited · Mainnet Ready</span>
        <span style={{color:Q.plasma,fontWeight:700}}>© 2026 Grigori Saks — Patent Pending — Enterprise v3.0</span>
      </div>
    </div>
  );
}
