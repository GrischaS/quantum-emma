// ============================================================
//  QUANTUM EMMA — Wallet & Portfolio Enterprise v3.0
//  Professional like BingX · Phemex · Coinbase
//  Original QEMMA Coin Branding · 4D/5D Holographic
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef } from "react";

// ─── QUANTUM DESIGN SYSTEM ───────────────────────────────────────────────────
const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};

function useTick(ms=80){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[]);return t;}

// ─── ORIGINAL QEMMA COIN LOGO SVG ────────────────────────────────────────────
function QEMMACoin({ size=48, tick=0, animated=true }) {
  const t = tick * 0.03;
  const pulse = animated ? 0.75 + Math.sin(t*2)*0.2 : 1;
  const rot = animated ? (tick*0.8)%360 : 0;
  const innerRot = animated ? (-tick*1.2)%360 : 0;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{
      filter: animated ? `drop-shadow(0 0 ${Math.round(8+pulse*8)}px #8b5cf6) drop-shadow(0 0 ${Math.round(16+pulse*12)}px #7c3aed44)` : `drop-shadow(0 0 8px #8b5cf6)`,
      flexShrink:0,
    }}>
      <defs>
        <radialGradient id={`coinGrad${size}`} cx="40%" cy="35%">
          <stop offset="0%"   stopColor="#c4b5fd" stopOpacity="1"/>
          <stop offset="35%"  stopColor="#8b5cf6" stopOpacity="1"/>
          <stop offset="70%"  stopColor="#6d28d9" stopOpacity="1"/>
          <stop offset="100%" stopColor="#3b0764" stopOpacity="1"/>
        </radialGradient>
        <radialGradient id={`shineGrad${size}`} cx="35%" cy="30%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.35"/>
          <stop offset="60%"  stopColor="#ffffff" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`rimGrad${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#c4b5fd"/>
          <stop offset="50%"  stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#4c1d95"/>
        </linearGradient>
        <filter id={`glow${size}`}>
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer rim */}
      <circle cx="50" cy="50" r="48" fill={`url(#rimGrad${size})`}/>

      {/* Main coin face */}
      <circle cx="50" cy="50" r="44" fill={`url(#coinGrad${size})`}/>

      {/* Orbital ring 1 — animated */}
      <g transform={`rotate(${rot}, 50, 50)`}>
        <ellipse cx="50" cy="50" rx="40" ry="14" fill="none"
          stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="4 6"/>
      </g>

      {/* Orbital ring 2 */}
      <g transform={`rotate(${innerRot}, 50, 50)`}>
        <ellipse cx="50" cy="50" rx="32" ry="11" fill="none"
          stroke="#06b6d4" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 8"/>
      </g>

      {/* Central Q letter */}
      <text x="50" y="58" textAnchor="middle" fontSize="36" fontWeight="900"
        fontFamily="'Arial Black',sans-serif" fill="#ffffff" filter={`url(#glow${size})`}
        style={{letterSpacing:"-2px"}}>Q</text>

      {/* Small E suffix */}
      <text x="67" y="54" textAnchor="middle" fontSize="12" fontWeight="800"
        fontFamily="'Arial',sans-serif" fill="#c4b5fd" opacity="0.9">E</text>

      {/* Shine overlay */}
      <circle cx="50" cy="50" r="44" fill={`url(#shineGrad${size})`}/>

      {/* Orbital particles */}
      {animated && [0,1,2].map(i => {
        const angle = (t * (i%2===0?1.5:-1.2) + i*(Math.PI*2/3));
        const rx = 40, ry = 14;
        const px = 50 + Math.cos(angle)*rx;
        const py = 50 + Math.sin(angle)*ry;
        return (
          <g key={i}>
            <circle cx={px} cy={py} r="2.5" fill="#fbbf24" opacity={0.8*pulse}
              style={{filter:`drop-shadow(0 0 3px #fbbf24)`}}/>
            <circle cx={px} cy={py} r="5" fill="#fbbf24" opacity="0.12"/>
          </g>
        );
      })}

      {/* Bottom text */}
      <text x="50" y="91" textAnchor="middle" fontSize="7" fontWeight="700"
        fontFamily="monospace" fill="#a78bfa" opacity="0.8" letterSpacing="2">QEMMA</text>
    </svg>
  );
}

// ─── COIN LOGOS FOR OTHER ASSETS ─────────────────────────────────────────────
function CoinLogo({ symbol, size=36 }) {
  const configs = {
    BTC:  { bg:["#F7931A","#E67E00"], text:"₿", textColor:"#fff", size:22 },
    ETH:  { bg:["#627EEA","#3C5CE0"], text:"Ξ", textColor:"#fff", size:22 },
    USDT: { bg:["#26A17B","#1a7a5a"], text:"₮", textColor:"#fff", size:20 },
    USDC: { bg:["#2775CA","#1a5fa0"], text:"◎", textColor:"#fff", size:18 },
    BNB:  { bg:["#F3BA2F","#d4a017"], text:"⬡", textColor:"#000", size:20 },
    SOL:  { bg:["#9945FF","#7B2FF7"], text:"◎", textColor:"#fff", size:18 },
    MATIC:{ bg:["#8247E5","#6030c0"], text:"⬡", textColor:"#fff", size:18 },
    AVAX: { bg:["#E84142","#c02020"], text:"▲", textColor:"#fff", size:18 },
    ARB:  { bg:["#28A0F0","#1070c0"], text:"A", textColor:"#fff", size:20 },
    OP:   { bg:["#FF0420","#cc0018"], text:"O", textColor:"#fff", size:20 },
  };
  const c = configs[symbol] || { bg:["#8b5cf6","#6d28d9"], text:symbol[0], textColor:"#fff", size:18 };

  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <defs>
        <radialGradient id={`lg_${symbol}`} cx="40%" cy="35%">
          <stop offset="0%"   stopColor={c.bg[0]}/>
          <stop offset="100%" stopColor={c.bg[1]}/>
        </radialGradient>
        <radialGradient id={`ls_${symbol}`} cx="35%" cy="30%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill={`url(#lg_${symbol})`}/>
      <circle cx="18" cy="18" r="17" fill={`url(#ls_${symbol})`}/>
      <circle cx="18" cy="18" r="17" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <text x="18" y="23" textAnchor="middle" fontSize={c.size} fontWeight="900"
        fontFamily="'Arial Black',sans-serif" fill={c.textColor}>{c.text}</text>
    </svg>
  );
}

// ─── HOLOGRAPHIC PRICE CHART ──────────────────────────────────────────────────
function HoloChart({ data, color, height=60, filled=true }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), range = max-min||1;
  const w = 100/(data.length-1);
  const toY = v => height - ((v-min)/range)*height;
  const pts = data.map((v,i) => `${i*w},${toY(v)}`).join(" ");
  const id = `hc_${color.replace("#","")}`;

  return (
    <svg width="100%" height={height+4} style={{overflow:"visible",display:"block"}}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {filled && (
        <polygon points={`0,${height} ${pts} 100,${height}`} fill={`url(#${id})`}/>
      )}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
        style={{filter:`drop-shadow(0 0 4px ${color})`}}/>
      {/* Last dot */}
      <circle cx={(data.length-1)*w} cy={toY(data[data.length-1])} r="3"
        fill={color} style={{filter:`drop-shadow(0 0 6px ${color})`}}/>
    </svg>
  );
}

// ─── ASSET ROW ────────────────────────────────────────────────────────────────
function AssetRow({ asset, tick, onClick, selected }) {
  const liveP = asset.basePrice * (1+Math.sin(tick*0.02+asset.seed)*0.004);
  const liveV = asset.amount * liveP;
  const pnl   = liveV - asset.cost;
  const pnlPct= (pnl/asset.cost)*100;
  const pulse = selected ? 0.3 : 0;

  return (
    <div onClick={onClick} style={{
      display:"grid",
      gridTemplateColumns:"220px 120px 120px 130px 120px 100px",
      padding:"14px 20px", alignItems:"center",
      borderBottom:`1px solid ${Q.plasma}18`,
      background: selected
        ? `linear-gradient(90deg,${Q.plasma}12,${Q.neutrino}06,transparent)`
        : "transparent",
      cursor:"pointer", transition:"background 0.2s",
      borderLeft: selected ? `3px solid ${asset.color}` : "3px solid transparent",
    }}>
      {/* Asset info */}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {asset.symbol === "QEMMA"
          ? <QEMMACoin size={38} tick={tick} animated/>
          : <CoinLogo symbol={asset.symbol} size={38}/>
        }
        <div>
          <div style={{fontWeight:800,fontSize:14,color:asset.color,
            textShadow:selected?`0 0 10px ${asset.color}88`:""}}>{asset.symbol}</div>
          <div style={{fontSize:11,color:Q.dim,marginTop:1}}>{asset.name}</div>
          {asset.symbol==="QEMMA" && (
            <div style={{fontSize:8,color:Q.plasma,marginTop:2,fontWeight:700,letterSpacing:1}}>
              GENESIS PHASE
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div>
        <div style={{fontSize:14,fontWeight:800,color:Q.bright,fontFamily:"monospace"}}>
          ${asset.symbol==="QEMMA"?liveP.toFixed(4):liveP.toFixed(2)}
        </div>
        <div style={{fontSize:10,color:asset.change24h>=0?Q.lepton:Q.tauon,
          fontWeight:700,marginTop:2}}>
          {asset.change24h>=0?"▲":"▼"} {Math.abs(asset.change24h)}% 24h
        </div>
      </div>

      {/* Amount */}
      <div>
        <div style={{fontSize:13,color:Q.mid,fontFamily:"monospace"}}>{asset.amount}</div>
        <div style={{fontSize:10,color:Q.dim,marginTop:2}}>{asset.symbol}</div>
      </div>

      {/* Value */}
      <div>
        <div style={{fontSize:14,fontWeight:800,color:Q.bright,fontFamily:"monospace"}}>
          ${liveV.toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})}
        </div>
        <div style={{fontSize:10,color:Q.dim,marginTop:2}}>{asset.allocation?.toFixed(1)}% alloc</div>
      </div>

      {/* P&L */}
      <div>
        <div style={{fontSize:13,fontWeight:800,color:pnl>=0?Q.lepton:Q.tauon,fontFamily:"monospace"}}>
          {pnl>=0?"+":""}{pnl.toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})}
        </div>
        <div style={{fontSize:10,color:pnl>=0?Q.lepton:Q.tauon,marginTop:2}}>
          {pnlPct>=0?"+":""}{pnlPct.toFixed(2)}%
        </div>
      </div>

      {/* Mini chart */}
      <div style={{height:44,overflow:"hidden"}}>
        <HoloChart data={asset.history} color={pnl>=0?Q.lepton:Q.tauon} height={40} filled={false}/>
      </div>
    </div>
  );
}

// ─── ASSET DETAIL PANEL ───────────────────────────────────────────────────────
function AssetDetail({ asset, tick }) {
  const [action, setAction] = useState("buy");
  const [amt, setAmt] = useState("");
  if (!asset) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      height:"100%",flexDirection:"column",gap:12}}>
      <div style={{fontSize:40,opacity:0.3}}>📊</div>
      <div style={{fontSize:13,color:Q.dim}}>Select an asset to view details</div>
    </div>
  );

  const liveP = asset.basePrice*(1+Math.sin(tick*0.02+asset.seed)*0.004);
  const liveV = asset.amount*liveP;
  const pnl   = liveV-asset.cost;
  const pnlPct=(pnl/asset.cost)*100;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,padding:"20px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        {asset.symbol==="QEMMA"
          ? <QEMMACoin size={64} tick={tick} animated/>
          : <CoinLogo symbol={asset.symbol} size={64}/>
        }
        <div style={{flex:1}}>
          <div style={{fontWeight:900,fontSize:22,color:asset.color,
            textShadow:`0 0 20px ${asset.color}66`}}>{asset.symbol}</div>
          <div style={{fontSize:13,color:Q.mid}}>{asset.name}</div>
          <div style={{fontSize:22,fontWeight:900,color:Q.bright,
            fontFamily:"monospace",marginTop:4}}>
            ${asset.symbol==="QEMMA"?liveP.toFixed(4):liveP.toFixed(2)}
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:11,color:Q.dim}}>24h Change</div>
          <div style={{fontSize:18,fontWeight:900,
            color:asset.change24h>=0?Q.lepton:Q.tauon,marginTop:4}}>
            {asset.change24h>=0?"+":""}{asset.change24h}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{padding:"14px",borderRadius:12,
        background:"rgba(0,0,0,0.4)",border:`1px solid ${asset.color}22`}}>
        <HoloChart data={asset.longHistory||asset.history} color={asset.color} height={100}/>
        <div style={{display:"flex",justifyContent:"space-between",
          marginTop:6,fontSize:9,color:Q.dim}}>
          <span>30d ago</span><span>15d ago</span><span>Today</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[
          {l:"Holdings",  v:`${asset.amount} ${asset.symbol}`,         c:asset.color},
          {l:"Value",     v:`$${liveV.toFixed(2)}`,                    c:Q.bright},
          {l:"P&L",       v:`${pnl>=0?"+":""}$${pnl.toFixed(2)}`,     c:pnl>=0?Q.lepton:Q.tauon},
          {l:"Return",    v:`${pnlPct>=0?"+":""}${pnlPct.toFixed(2)}%`,c:pnlPct>=0?Q.lepton:Q.tauon},
          {l:"Avg Price", v:`$${(asset.cost/asset.amount).toFixed(asset.symbol==="QEMMA"?4:2)}`,c:Q.mid},
          {l:"Cost Basis",v:`$${asset.cost.toFixed(2)}`,               c:Q.mid},
        ].map((s,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:9,
            background:`${s.c}0a`,border:`1px solid ${s.c}18`}}>
            <div style={{fontSize:9,color:Q.dim,letterSpacing:1}}>{s.l}</div>
            <div style={{fontSize:14,fontWeight:800,color:s.c,marginTop:4,fontFamily:"monospace"}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Trade */}
      <div style={{padding:"14px",borderRadius:13,
        background:"rgba(0,0,0,0.4)",border:`1px solid ${Q.plasma}22`}}>
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {["buy","sell","send","receive"].map(a=>(
            <button key={a} onClick={()=>setAction(a)} style={{
              flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
              background:action===a?(a==="buy"?`${Q.lepton}22`:a==="sell"?`${Q.tauon}22`:`${Q.plasma}22`):"rgba(255,255,255,0.04)",
              color:action===a?(a==="buy"?Q.lepton:a==="sell"?Q.tauon:Q.neutrino):Q.dim,
              fontWeight:800,fontSize:10,letterSpacing:1,
              borderBottom:action===a?`2px solid ${a==="buy"?Q.lepton:a==="sell"?Q.tauon:Q.neutrino}`:"2px solid transparent",
            }}>{a.toUpperCase()}</button>
          ))}
        </div>
        <input value={amt} onChange={e=>setAmt(e.target.value)} type="number"
          placeholder={`Amount (${asset.symbol})`}
          style={{width:"100%",padding:"10px 14px",borderRadius:9,
            background:"rgba(0,0,0,0.5)",
            border:`1px solid ${action==="buy"?Q.lepton:action==="sell"?Q.tauon:Q.plasma}33`,
            color:Q.bright,fontSize:14,fontWeight:700,boxSizing:"border-box",marginBottom:10}}/>
        <button style={{width:"100%",padding:"12px",borderRadius:11,border:"none",cursor:"pointer",
          background:action==="buy"?`linear-gradient(135deg,${Q.lepton}66,#22c55e44)`:
                    action==="sell"?`linear-gradient(135deg,${Q.tauon}66,#dc262644)`:
                    `linear-gradient(135deg,${Q.plasma}55,${Q.gluon}33)`,
          color:Q.bright,fontSize:13,fontWeight:900,letterSpacing:2,
          boxShadow:`0 4px 16px ${action==="buy"?Q.lepton:action==="sell"?Q.tauon:Q.plasma}22`}}>
          {action==="buy"?`▲ BUY ${asset.symbol}`:action==="sell"?`▼ SELL ${asset.symbol}`:
           action==="send"?`📤 SEND ${asset.symbol}`:`📥 RECEIVE ${asset.symbol}`}
        </button>
      </div>

      {asset.symbol==="QEMMA"&&(
        <div style={{padding:"12px 14px",borderRadius:11,
          background:`${Q.plasma}12`,border:`1px solid ${Q.plasma}33`,
          fontSize:11,lineHeight:1.7,color:Q.mid}}>
          <div style={{fontWeight:800,color:Q.neutrino,marginBottom:6}}>⚛️ QEMMA Token Info</div>
          <div>Phase: <b style={{color:Q.higgs}}>GENESIS</b> · Supply: 15.2M/100M</div>
          <div>Next Phase at: <b style={{color:Q.neutrino}}>20M supply</b></div>
          <div>Next Halving: <b style={{color:Q.muon}}>Block 1,050,000 (~203 days)</b></div>
          <div>Staking APY: <b style={{color:Q.lepton}}>up to 60% (QUANTUM Tier)</b></div>
        </div>
      )}
    </div>
  );
}

// ─── WALLET CONNECT PANEL ─────────────────────────────────────────────────────
function WalletConnect({ onConnect }) {
  const tick = useTick(80);
  const pulse = 0.7+Math.sin(tick*0.08)*0.25;

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      minHeight:"100vh",background:Q.void,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:480,padding:"40px",borderRadius:24,
        background:`linear-gradient(135deg,${Q.bg1},${Q.bg2})`,
        border:`1px solid ${Q.plasma}44`,
        boxShadow:`0 0 60px ${Q.plasma}18, 0 0 120px ${Q.plasma}08`}}>

        {/* QEMMA Logo */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
            <QEMMACoin size={80} tick={tick} animated/>
          </div>
          <div style={{fontWeight:900,fontSize:22,color:Q.neutrino,letterSpacing:3,
            textShadow:`0 0 20px ${Q.plasma}88`}}>QUANTUM EMMA</div>
          <div style={{fontSize:11,color:Q.plasma,letterSpacing:2,marginTop:4}}>
            WALLET & PORTFOLIO
          </div>
        </div>

        {/* Wallets */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {[
            {n:"MetaMask",       icon:"🦊", c:"#fb923c", desc:"Most popular · Browser extension"},
            {n:"WalletConnect",  icon:"🔵", c:"#3b99fc", desc:"Mobile wallet via QR Code"},
            {n:"Coinbase Wallet",icon:"🔵", c:"#0052ff", desc:"Coinbase official wallet"},
            {n:"Trust Wallet",   icon:"🛡", c:"#3375bb", desc:"Binance Trust Wallet"},
            {n:"Ledger",         icon:"🔒", c:"#e2e8f0", desc:"Hardware wallet — most secure"},
          ].map((w,i)=>(
            <button key={i} onClick={()=>onConnect(w.n)} style={{
              display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:14,
              background:`${w.c}0e`,border:`1px solid ${w.c}33`,cursor:"pointer",
              textAlign:"left",transition:"all 0.15s",
            }}>
              <span style={{fontSize:26}}>{w.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:w.c}}>{w.n}</div>
                <div style={{fontSize:11,color:Q.dim,marginTop:2}}>{w.desc}</div>
              </div>
              <span style={{fontSize:18,color:`${w.c}66`}}>→</span>
            </button>
          ))}
        </div>

        <div style={{textAlign:"center",fontSize:11,color:Q.dim,lineHeight:1.6}}>
          🔒 Secure connection · Non-custodial · Your keys, your crypto<br/>
          <span style={{color:Q.plasma}}>© 2026 Grigori Saks — Patent Pending</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PORTFOLIO PAGE ──────────────────────────────────────────────────────
export default function PortfolioPage() {
  const tick = useTick(80);
  const [connected, setConnected] = useState(false);
  const [walletName, setWalletName] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tab, setTab] = useState("portfolio");
  const [showSend, setShowSend] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [sendAmt, setSendAmt] = useState("");
  const [sendAsset, setSendAsset] = useState("QEMMA");

  const address = "0x742d35Cc6634C0532925a3b8D4C9b6eA7e3f12Ab";

  // Asset data
  const assets = [
    {
      symbol:"QEMMA",name:"Quantum Emma",color:Q.neutrino,basePrice:0.63,
      amount:"24,500",amountNum:24500,cost:12000,seed:1,change24h:+8.42,
      history:Array.from({length:30},(_,i)=>0.38+Math.sin(i*.38)*0.1+i*0.008),
      longHistory:Array.from({length:60},(_,i)=>0.28+Math.sin(i*.28)*0.14+i*0.006),
      allocation:31.9,
    },
    {
      symbol:"ETH",name:"Ethereum",color:Q.gluon,basePrice:3840,
      amount:"5.2000",amountNum:5.2,cost:16800,seed:2,change24h:+1.87,
      history:Array.from({length:30},(_,i)=>3200+Math.sin(i*.35)*220+i*28),
      longHistory:Array.from({length:60},(_,i)=>2800+Math.sin(i*.25)*350+i*18),
      allocation:41.4,
    },
    {
      symbol:"BTC",name:"Bitcoin",color:Q.higgs,basePrice:71450,
      amount:"0.1800",amountNum:0.18,cost:10200,seed:3,change24h:+2.34,
      history:Array.from({length:30},(_,i)=>62000+Math.sin(i*.3)*3200+i*420),
      longHistory:Array.from({length:60},(_,i)=>52000+Math.sin(i*.22)*5000+i*320),
      allocation:26.6,
    },
    {
      symbol:"BNB",name:"BNB",color:Q.higgs,basePrice:612,
      amount:"2.8400",amountNum:2.84,cost:1400,seed:4,change24h:+0.91,
      history:Array.from({length:30},(_,i)=>560+Math.sin(i*.4)*28+i*1.8),
      longHistory:Array.from({length:60},(_,i)=>480+Math.sin(i*.3)*40+i*2.1),
      allocation:0,
    },
    {
      symbol:"SOL",name:"Solana",color:"#9945ff",basePrice:184,
      amount:"18.500",amountNum:18.5,cost:2800,seed:5,change24h:+3.12,
      history:Array.from({length:30},(_,i)=>160+Math.sin(i*.45)*16+i*0.8),
      longHistory:Array.from({length:60},(_,i)=>120+Math.sin(i*.35)*24+i*1.1),
      allocation:0,
    },
    {
      symbol:"USDT",name:"Tether USD",color:Q.lepton,basePrice:1.0,
      amount:"8,450.00",amountNum:8450,cost:8450,seed:6,change24h:0,
      history:Array.from({length:30},()=>1.0),
      longHistory:Array.from({length:60},()=>1.0),
      allocation:0,
    },
    {
      symbol:"USDC",name:"USD Coin",color:"#60a5fa",basePrice:1.0,
      amount:"4,437.50",amountNum:4437.5,cost:4437.5,seed:7,change24h:0,
      history:Array.from({length:30},()=>1.0),
      longHistory:Array.from({length:60},()=>1.0),
      allocation:0,
    },
  ];

  // Fix allocations
  const totalVal = assets.reduce((s,a)=>s+a.amountNum*a.basePrice,0);
  const assetsWithAlloc = assets.map(a=>({
    ...a, allocation:(a.amountNum*a.basePrice/totalVal*100)
  }));

  const totalCost = assets.reduce((s,a)=>s+a.cost,0);
  const totalPnL  = totalVal-totalCost;
  const totalPnLPct=(totalPnL/totalCost)*100;

  const sel = selectedAsset!==null ? assetsWithAlloc[selectedAsset] : null;

  if(!connected) return <WalletConnect onConnect={name=>{setConnected(true);setWalletName(name);}}/>;

  return (
    <div style={{
      minHeight:"100vh",background:Q.void,
      fontFamily:"'Inter',system-ui,sans-serif",color:Q.bright,
      display:"flex",flexDirection:"column",
    }}>
      {/* ── TOP HEADER ── */}
      <div style={{
        padding:"0 28px",height:56,flexShrink:0,
        background:`${Q.bg1}f0`,borderBottom:`1px solid ${Q.plasma}22`,
        backdropFilter:"blur(20px)",display:"flex",alignItems:"center",
        justifyContent:"space-between",
        boxShadow:`0 4px 30px ${Q.void}`,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <QEMMACoin size={32} tick={tick} animated/>
          <div>
            <div style={{fontWeight:900,fontSize:13,color:Q.neutrino,letterSpacing:1}}>
              QUANTUM EMMA
            </div>
            <div style={{fontSize:8,color:Q.plasma,letterSpacing:1.5}}>ENTERPRISE WALLET</div>
          </div>
        </div>

        {/* Nav tabs */}
        <div style={{display:"flex",gap:2}}>
          {[
            {id:"portfolio",label:"Portfolio",icon:"📊"},
            {id:"assets",   label:"Assets",   icon:"🪙"},
            {id:"send",     label:"Send",      icon:"📤"},
            {id:"receive",  label:"Receive",   icon:"📥"},
            {id:"swap",     label:"Swap",      icon:"🔄"},
            {id:"history",  label:"History",   icon:"📋"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",
              background:tab===t.id?`${Q.plasma}22`:"transparent",
              color:tab===t.id?Q.neutrino:Q.dim,
              fontWeight:700,fontSize:11,
              borderBottom:tab===t.id?`2px solid ${Q.neutrino}`:"2px solid transparent",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>

        {/* Wallet info */}
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:Q.lepton,fontWeight:700}}>
              ● {walletName}
            </div>
            <div style={{fontSize:9,color:Q.dim,fontFamily:"monospace",marginTop:1}}>
              {address.slice(0,8)}...{address.slice(-6)}
            </div>
          </div>
          <button onClick={()=>setConnected(false)} style={{
            padding:"6px 12px",borderRadius:20,border:`1px solid ${Q.tauon}33`,
            background:`${Q.tauon}0a`,color:Q.tauon,fontSize:10,fontWeight:700,cursor:"pointer"
          }}>Disconnect</button>
        </div>
      </div>

      {/* ── PORTFOLIO OVERVIEW BANNER ── */}
      {(tab==="portfolio"||tab==="assets") && (
        <div style={{
          padding:"20px 28px",
          background:`linear-gradient(135deg,${Q.plasma}14,${Q.gluon}08,${Q.higgs}06)`,
          borderBottom:`1px solid ${Q.plasma}22`,
          display:"flex",alignItems:"center",gap:28,
        }}>
          {/* Total */}
          <div>
            <div style={{fontSize:11,color:Q.dim,letterSpacing:1,marginBottom:4}}>TOTAL PORTFOLIO VALUE</div>
            <div style={{fontSize:36,fontWeight:900,color:Q.bright,fontFamily:"monospace",
              textShadow:`0 0 20px ${Q.plasma}44`}}>
              ${totalVal.toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})}
            </div>
            <div style={{fontSize:12,color:totalPnL>=0?Q.lepton:Q.tauon,marginTop:4,fontWeight:700}}>
              {totalPnL>=0?"+":""}{totalPnL.toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})} USD
              ({totalPnLPct>=0?"+":""}{totalPnLPct.toFixed(2)}%) All Time
            </div>
          </div>

          <div style={{width:1,height:60,background:`${Q.plasma}33`}}/>

          {/* Return metrics */}
          {[
            {l:"24h",  v:"+$1,847",  p:"+4.0%",  c:Q.lepton},
            {l:"7d",   v:"+$5,291",  p:"+12.7%", c:Q.lepton},
            {l:"30d",  v:"+$11,840", p:"+34.2%", c:Q.lepton},
            {l:"Sharpe",v:"2.84",    p:"ratio",  c:Q.higgs},
          ].map((s,i)=>(
            <div key={i}>
              <div style={{fontSize:9,color:Q.dim,letterSpacing:1,marginBottom:4}}>{s.l}</div>
              <div style={{fontSize:16,fontWeight:900,color:s.c,fontFamily:"monospace"}}>{s.v}</div>
              <div style={{fontSize:10,color:s.c,opacity:0.7,marginTop:2}}>{s.p}</div>
            </div>
          ))}

          <div style={{marginLeft:"auto",display:"flex",gap:12}}>
            {/* Allocation donut (simple) */}
            <svg width={80} height={80} viewBox="0 0 80 80">
              {assetsWithAlloc.slice(0,5).reduce((acc,a,i)=>{
                const pct=a.allocation/100;
                const startAngle=acc.angle, sweep=pct*Math.PI*2;
                const x1=40+38*Math.cos(startAngle), y1=40+38*Math.sin(startAngle);
                const x2=40+38*Math.cos(startAngle+sweep), y2=40+38*Math.sin(startAngle+sweep);
                const large=sweep>Math.PI?1:0;
                acc.paths.push(
                  <path key={i} d={`M40,40 L${x1},${y1} A38,38 0 ${large},1 ${x2},${y2} Z`}
                    fill={a.color} fillOpacity="0.8"/>
                );
                acc.angle+=sweep;
                return acc;
              },{paths:[],angle:-Math.PI/2}).paths}
              <circle cx="40" cy="40" r="22" fill={Q.bg0}/>
              <text x="40" y="44" textAnchor="middle" fontSize="9" fontWeight="800"
                fill={Q.neutrino} fontFamily="monospace">ALLOC</text>
            </svg>

            {/* Legend */}
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:4}}>
              {assetsWithAlloc.slice(0,5).map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:10}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:a.color}}/>
                  <span style={{color:Q.mid}}>{a.symbol}</span>
                  <span style={{color:a.color,fontWeight:700}}>{a.allocation.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* ── ASSET TABLE + DETAIL ── */}
        {(tab==="portfolio"||tab==="assets") && (
          <>
            {/* Left: asset table */}
            <div style={{flex:1,overflowY:"auto",scrollbarWidth:"thin",
              scrollbarColor:`${Q.plasma}44 transparent`}}>

              {/* Table header */}
              <div style={{
                display:"grid",
                gridTemplateColumns:"220px 120px 120px 130px 120px 100px",
                padding:"10px 20px",
                background:`${Q.bg1}`,
                borderBottom:`1px solid ${Q.plasma}22`,
                fontSize:9,color:Q.dim,letterSpacing:1.5,fontWeight:700,
                position:"sticky",top:0,zIndex:5,backdropFilter:"blur(10px)",
              }}>
                <span>ASSET</span><span>PRICE</span><span>HOLDINGS</span>
                <span>VALUE</span><span>P&L</span><span>7D CHART</span>
              </div>

              {assetsWithAlloc.map((a,i)=>(
                <AssetRow key={i} asset={a} tick={tick}
                  onClick={()=>setSelectedAsset(i===selectedAsset?null:i)}
                  selected={i===selectedAsset}/>
              ))}

              {/* Total row */}
              <div style={{
                display:"grid",
                gridTemplateColumns:"220px 120px 120px 130px 120px 100px",
                padding:"16px 20px",
                background:`${Q.plasma}0a`,
                borderTop:`1px solid ${Q.plasma}33`,
              }}>
                <div style={{fontWeight:900,color:Q.neutrino,fontSize:13}}>TOTAL</div>
                <div/>
                <div/>
                <div style={{fontWeight:900,color:Q.bright,fontSize:15,fontFamily:"monospace"}}>
                  ${totalVal.toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})}
                </div>
                <div>
                  <div style={{fontWeight:900,color:totalPnL>=0?Q.lepton:Q.tauon,
                    fontSize:13,fontFamily:"monospace"}}>
                    {totalPnL>=0?"+":""}{totalPnL.toFixed(2)}
                  </div>
                  <div style={{fontSize:10,color:totalPnL>=0?Q.lepton:Q.tauon}}>
                    {totalPnLPct>=0?"+":""}{totalPnLPct.toFixed(2)}%
                  </div>
                </div>
                <div/>
              </div>
            </div>

            {/* Right: detail panel */}
            <div style={{
              width:340,flexShrink:0,overflowY:"auto",
              borderLeft:`1px solid ${Q.plasma}22`,
              background:`${Q.bg1}88`,backdropFilter:"blur(10px)",
            }}>
              <AssetDetail asset={sel} tick={tick}/>
            </div>
          </>
        )}

        {/* ── SEND ── */}
        {tab==="send" && (
          <div style={{flex:1,display:"flex",alignItems:"flex-start",
            justifyContent:"center",padding:"40px 20px",overflowY:"auto"}}>
            <div style={{width:480,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{fontWeight:900,fontSize:20,color:Q.neutrino,marginBottom:4}}>📤 SEND</div>

              {/* Asset selector */}
              <div style={{padding:"14px 16px",borderRadius:14,
                background:"rgba(0,0,0,0.4)",border:`1px solid ${Q.plasma}22`}}>
                <div style={{fontSize:10,color:Q.dim,letterSpacing:1,marginBottom:10}}>SELECT ASSET</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["QEMMA","ETH","BTC","USDT","USDC"].map(s=>(
                    <button key={s} onClick={()=>setSendAsset(s)} style={{
                      display:"flex",alignItems:"center",gap:8,padding:"8px 14px",
                      borderRadius:30,border:`1px solid ${sendAsset===s?Q.neutrino+"66":Q.dim+"22"}`,
                      background:sendAsset===s?`${Q.plasma}22`:"rgba(255,255,255,0.04)",
                      color:sendAsset===s?Q.neutrino:Q.dim,cursor:"pointer",
                    }}>
                      {s==="QEMMA"
                        ? <QEMMACoin size={20} tick={tick} animated/>
                        : <CoinLogo symbol={s} size={20}/>}
                      <span style={{fontWeight:700,fontSize:11}}>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient */}
              <div>
                <div style={{fontSize:10,color:Q.dim,letterSpacing:1,marginBottom:6}}>RECIPIENT ADDRESS</div>
                <input value={sendTo} onChange={e=>setSendTo(e.target.value)}
                  placeholder="0x... or ENS name"
                  style={{width:"100%",padding:"12px 16px",borderRadius:11,
                    background:"rgba(0,0,0,0.5)",border:`1px solid ${Q.plasma}33`,
                    color:Q.bright,fontSize:13,boxSizing:"border-box"}}/>
              </div>

              {/* Amount */}
              <div>
                <div style={{display:"flex",justifyContent:"space-between",
                  fontSize:10,color:Q.dim,letterSpacing:1,marginBottom:6}}>
                  <span>AMOUNT ({sendAsset})</span>
                  <span>Balance: {sendAsset==="QEMMA"?"24,500 QEMMA":sendAsset==="ETH"?"5.2 ETH":"8,450 USDT"}</span>
                </div>
                <input value={sendAmt} onChange={e=>setSendAmt(e.target.value)} type="number"
                  placeholder="0.00"
                  style={{width:"100%",padding:"12px 16px",borderRadius:11,
                    background:"rgba(0,0,0,0.5)",border:`1px solid ${Q.plasma}33`,
                    color:Q.bright,fontSize:18,fontWeight:900,boxSizing:"border-box"}}/>
                <div style={{display:"flex",gap:6,marginTop:8}}>
                  {["25%","50%","75%","MAX"].map(p=>(
                    <button key={p} style={{flex:1,padding:"6px",borderRadius:8,
                      border:`1px solid ${Q.plasma}22`,background:"rgba(255,255,255,0.04)",
                      color:Q.dim,fontSize:10,cursor:"pointer",fontWeight:700}}>{p}</button>
                  ))}
                </div>
              </div>

              {/* Fee info */}
              <div style={{padding:"12px 16px",borderRadius:11,
                background:`${Q.higgs}0a`,border:`1px solid ${Q.higgs}22`}}>
                {[
                  {l:"Network Fee",  v:"~$1.20 (0.0003 ETH)"},
                  {l:"Est. Time",    v:"~15 seconds"},
                  {l:"Total Send",   v:sendAmt?`${sendAmt} ${sendAsset}`:"—"},
                ].map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",
                    fontSize:11,padding:"4px 0",
                    borderBottom:i<2?`1px solid rgba(255,255,255,0.04)`:"none"}}>
                    <span style={{color:Q.dim}}>{r.l}</span>
                    <span style={{color:Q.mid,fontWeight:600}}>{r.v}</span>
                  </div>
                ))}
              </div>

              <button disabled={!sendTo||!sendAmt} style={{
                padding:"16px",borderRadius:14,border:"none",cursor:"pointer",
                background:sendTo&&sendAmt?`linear-gradient(135deg,${Q.plasma}66,${Q.gluon}44)`:"rgba(255,255,255,0.06)",
                color:sendTo&&sendAmt?Q.bright:Q.dim,fontSize:15,fontWeight:900,letterSpacing:2,
                boxShadow:sendTo&&sendAmt?`0 4px 24px ${Q.plasma}33`:"none",
              }}>📤 SEND TRANSACTION</button>
            </div>
          </div>
        )}

        {/* ── RECEIVE ── */}
        {tab==="receive" && (
          <div style={{flex:1,display:"flex",alignItems:"center",
            justifyContent:"center",padding:40}}>
            <div style={{width:400,display:"flex",flexDirection:"column",
              alignItems:"center",gap:16}}>
              <div style={{fontWeight:900,fontSize:20,color:Q.neutrino}}>📥 RECEIVE</div>

              {/* QR code placeholder */}
              <div style={{
                width:220,height:220,borderRadius:20,
                background:`${Q.plasma}12`,border:`2px solid ${Q.plasma}44`,
                display:"flex",flexDirection:"column",
                alignItems:"center",justifyContent:"center",
                boxShadow:`0 0 40px ${Q.plasma}22`,
              }}>
                <div style={{
                  display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,
                  width:140,height:140,
                }}>
                  {Array.from({length:49}).map((_,i)=>(
                    <div key={i} style={{
                      borderRadius:2,
                      background:Math.random()>0.5?Q.neutrino:`${Q.plasma}22`,
                      opacity:0.8+Math.random()*0.2,
                    }}/>
                  ))}
                </div>
                <div style={{fontSize:10,color:Q.plasma,marginTop:10,fontWeight:700}}>
                  SCAN TO RECEIVE
                </div>
              </div>

              {/* Address */}
              <div style={{width:"100%",padding:"12px 16px",borderRadius:12,
                background:"rgba(0,0,0,0.4)",border:`1px solid ${Q.plasma}33`,
                fontFamily:"monospace",fontSize:11,color:Q.mid,
                wordBreak:"break-all",textAlign:"center",lineHeight:1.6}}>
                {address}
              </div>

              <div style={{display:"flex",gap:10,width:"100%"}}>
                {[
                  {l:"📋 Copy Address",icon:"📋",c:Q.neutrino},
                  {l:"📤 Share",       icon:"📤",c:Q.gluon},
                ].map((b,i)=>(
                  <button key={i} style={{flex:1,padding:"12px",borderRadius:12,
                    border:`1px solid ${b.c}33`,background:`${b.c}12`,
                    color:b.c,fontWeight:800,fontSize:13,cursor:"pointer"}}>
                    {b.l}
                  </button>
                ))}
              </div>

              {/* Multi-coin receive */}
              <div style={{width:"100%",padding:"14px 16px",borderRadius:13,
                background:"rgba(0,0,0,0.3)",border:`1px solid ${Q.plasma}18`}}>
                <div style={{fontSize:10,color:Q.dim,letterSpacing:1,marginBottom:10}}>
                  SUPPORTED TOKENS ON THIS ADDRESS
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {["QEMMA","ETH","USDT","USDC","DAI","WBTC"].map(s=>(
                    <div key={s} style={{display:"flex",alignItems:"center",gap:6,
                      padding:"5px 10px",borderRadius:20,
                      background:"rgba(255,255,255,0.04)"}}>
                      {s==="QEMMA"
                        ? <QEMMACoin size={16} tick={tick} animated/>
                        : <CoinLogo symbol={s} size={16}/>}
                      <span style={{fontSize:10,color:Q.mid,fontWeight:700}}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SWAP ── */}
        {tab==="swap" && (
          <div style={{flex:1,display:"flex",alignItems:"flex-start",
            justifyContent:"center",padding:"40px 20px",overflowY:"auto"}}>
            <SwapPanel tick={tick}/>
          </div>
        )}

        {/* ── HISTORY ── */}
        {tab==="history" && (
          <div style={{flex:1,overflowY:"auto",padding:"0"}}>
            <TransactionHistory tick={tick}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SWAP PANEL ───────────────────────────────────────────────────────────────
function SwapPanel({ tick }) {
  const [from,setFrom]=useState("ETH");
  const [to,  setTo  ]=useState("QEMMA");
  const [amt, setAmt ]=useState("1");
  const rate = 2381+Math.sin(tick*.04)*65;
  const tokens=["ETH","QEMMA","USDT","USDC","BTC","BNB","SOL"];

  return (
    <div style={{width:480,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{fontWeight:900,fontSize:20,color:Q.boson,marginBottom:4}}>🔄 SWAP</div>

      {/* From */}
      <div style={{padding:"16px",borderRadius:14,
        background:"rgba(0,0,0,0.45)",border:`1px solid ${Q.plasma}28`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:10,color:Q.dim,letterSpacing:1}}>FROM</span>
          <span style={{fontSize:10,color:Q.dim}}>Balance: 5.2 {from}</span>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <select value={from} onChange={e=>setFrom(e.target.value)} style={{
              background:"rgba(139,92,246,0.15)",border:`1px solid ${Q.plasma}44`,
              color:Q.neutrino,padding:"10px 40px 10px 14px",borderRadius:11,
              fontSize:14,fontWeight:900,cursor:"pointer",appearance:"none",
            }}>
              {tokens.filter(t=>t!==to).map(t=><option key={t}>{t}</option>)}
            </select>
            <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
              pointerEvents:"none",color:Q.plasma}}>▾</div>
          </div>
          <input value={amt} onChange={e=>setAmt(e.target.value)} type="number"
            style={{flex:1,background:"transparent",border:"none",color:Q.bright,
              fontSize:26,fontWeight:900,textAlign:"right",outline:"none",fontFamily:"monospace"}}/>
        </div>
        <div style={{fontSize:10,color:Q.dim,marginTop:6,textAlign:"right"}}>
          ≈ ${(parseFloat(amt||0)*3840).toFixed(2)} USD
        </div>
      </div>

      {/* Swap arrow */}
      <div style={{textAlign:"center"}}>
        <button onClick={()=>{setFrom(to);setTo(from);}} style={{
          width:40,height:40,borderRadius:"50%",border:`1px solid ${Q.plasma}44`,
          background:`${Q.plasma}18`,cursor:"pointer",fontSize:18,color:Q.neutrino,
          boxShadow:`0 0 12px ${Q.plasma}22`,
        }}>⇅</button>
      </div>

      {/* To */}
      <div style={{padding:"16px",borderRadius:14,
        background:"rgba(0,0,0,0.45)",border:`1px solid ${Q.lepton}28`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:10,color:Q.dim,letterSpacing:1}}>TO</span>
          <span style={{fontSize:10,color:Q.dim}}>Balance: 24,500 QEMMA</span>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <select value={to} onChange={e=>setTo(e.target.value)} style={{
              background:"rgba(74,222,128,0.12)",border:`1px solid ${Q.lepton}33`,
              color:Q.lepton,padding:"10px 40px 10px 14px",borderRadius:11,
              fontSize:14,fontWeight:900,cursor:"pointer",appearance:"none",
            }}>
              {tokens.filter(t=>t!==from).map(t=><option key={t}>{t}</option>)}
            </select>
            <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
              pointerEvents:"none",color:Q.lepton}}>▾</div>
          </div>
          <div style={{flex:1,textAlign:"right",fontSize:26,fontWeight:900,
            color:Q.lepton,fontFamily:"monospace"}}>
            {(parseFloat(amt||0)*rate).toFixed(4)}
          </div>
        </div>
        <div style={{fontSize:10,color:Q.dim,marginTop:6,textAlign:"right"}}>
          ≈ ${(parseFloat(amt||0)*rate*0.63).toFixed(2)} USD
        </div>
      </div>

      {/* Rate details */}
      <div style={{padding:"12px 16px",borderRadius:11,
        background:"rgba(0,0,0,0.35)",border:`1px solid ${Q.plasma}18`}}>
        {[
          {l:"Exchange Rate", v:`1 ${from} = ${rate.toFixed(2)} ${to}`},
          {l:"Uniswap V3 Fee",v:"0.30%"},
          {l:"Price Impact",  v:"<0.01%"},
          {l:"Min. Received", v:`${(parseFloat(amt||0)*rate*0.995).toFixed(4)} ${to}`},
          {l:"Router",        v:"0xe592…61564"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",
            fontSize:11,padding:"5px 0",
            borderBottom:i<4?`1px solid rgba(255,255,255,0.04)`:"none"}}>
            <span style={{color:Q.dim}}>{r.l}</span>
            <span style={{color:Q.mid,fontWeight:600}}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* Slippage */}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:10,color:Q.dim}}>Slippage:</span>
        {["0.1%","0.5%","1.0%","Custom"].map(s=>(
          <button key={s} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${Q.plasma}22`,
            background:s==="0.5%"?`${Q.plasma}20`:"rgba(255,255,255,0.04)",
            color:s==="0.5%"?Q.neutrino:Q.dim,fontSize:10,cursor:"pointer",fontWeight:700}}>{s}</button>
        ))}
      </div>

      <button style={{padding:"16px",borderRadius:14,border:"none",cursor:"pointer",
        background:`linear-gradient(135deg,${Q.boson}55,${Q.plasma}44)`,
        color:Q.bright,fontSize:15,fontWeight:900,letterSpacing:2,
        boxShadow:`0 4px 24px ${Q.boson}22`}}>
        🔄 EXECUTE SWAP
      </button>

      <div style={{fontSize:10,color:Q.dim,textAlign:"center"}}>
        Powered by Uniswap V3 · © 2026 Grigori Saks
      </div>
    </div>
  );
}

// ─── TRANSACTION HISTORY ─────────────────────────────────────────────────────
function TransactionHistory({ tick }) {
  const txs = [
    {hash:"0x4f2a…9b1c",type:"SWAP",   icon:"🔄",from:"1.0 ETH",    to:"2,381 QEMMA", status:"✓",gas:"$4.20",time:"2m ago",  c:Q.lepton},
    {hash:"0xa8b3…2e4f",type:"STAKE",  icon:"💎",from:"5,000 QEMMA",to:"QUANTUM Vault",status:"✓",gas:"$2.10",time:"14m ago", c:Q.neutrino},
    {hash:"0x72cd…5a8e",type:"RECEIVE",icon:"📥",from:"0x9f3a…88Dc",to:"500 QEMMA",   status:"✓",gas:"$0.00",time:"1h ago",  c:Q.gluon},
    {hash:"0x1f9e…7d3b",type:"VOTE",   icon:"🗳",from:"DAO #001",   to:"FOR",          status:"✓",gas:"$1.40",time:"2h ago",  c:Q.higgs},
    {hash:"0x8c4a…1f2d",type:"CLAIM",  icon:"🎁",from:"REWARDS",    to:"284.4 QEMMA",  status:"✓",gas:"$1.90",time:"3h ago",  c:Q.muon},
    {hash:"0x3b7f…9e1a",type:"SEND",   icon:"📤",from:"24,500 Q",   to:"0x742d…12Ab",  status:"✓",gas:"$0.60",time:"5h ago",  c:Q.boson},
    {hash:"0xc4d1…3f8b",type:"MINE",   icon:"⛏",from:"POOL ALPHA", to:"78 QEMMA",    status:"✓",gas:"$0.80",time:"6h ago",  c:Q.lepton},
    {hash:"0x7a2e…6c1d",type:"SWAP",   icon:"🔄",from:"500 USDT",   to:"793.7 QEMMA", status:"✓",gas:"$3.20",time:"8h ago",  c:Q.gluon},
    {hash:"0xb9f3…2a4e",type:"APPROVE",icon:"✅",from:"USDT",       to:"Unlimited",   status:"✓",gas:"$2.80",time:"8h ago",  c:Q.mid},
    {hash:"0x5c8d…1b3a",type:"BUY",    icon:"▲",from:"2.0 ETH",    to:"4,762 QEMMA", status:"✓",gas:"$4.10",time:"1d ago",  c:Q.lepton},
  ];

  return (
    <div>
      {/* Table header */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"120px 80px 1fr 1fr 60px 50px 80px",
        padding:"10px 24px",
        background:Q.bg1,borderBottom:`1px solid ${Q.plasma}22`,
        fontSize:9,color:Q.dim,letterSpacing:1.5,fontWeight:700,
        position:"sticky",top:0,zIndex:5,
      }}>
        <span>TX HASH</span><span>TYPE</span><span>FROM</span><span>TO</span>
        <span>STATUS</span><span>GAS</span><span>TIME</span>
      </div>

      {txs.map((tx,i)=>(
        <div key={i} style={{
          display:"grid",
          gridTemplateColumns:"120px 80px 1fr 1fr 60px 50px 80px",
          padding:"14px 24px",alignItems:"center",
          borderBottom:`1px solid ${Q.plasma}12`,
          background:i%2===0?"rgba(139,92,246,0.02)":"transparent",
          transition:"background 0.15s",cursor:"pointer",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>{tx.icon}</span>
            <span style={{fontSize:10,color:tx.c,fontFamily:"monospace",cursor:"pointer",
              textDecoration:"underline"}}>{tx.hash}</span>
          </div>
          <span style={{fontSize:10,fontWeight:800,color:tx.c,
            padding:"3px 8px",borderRadius:20,background:`${tx.c}15`,
            display:"inline-block"}}>{tx.type}</span>
          <span style={{fontSize:11,color:Q.mid,fontFamily:"monospace",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.from}</span>
          <span style={{fontSize:11,color:Q.mid,fontFamily:"monospace",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.to}</span>
          <span style={{fontSize:12,color:Q.lepton,fontWeight:700}}>{tx.status}</span>
          <span style={{fontSize:10,color:Q.dim}}>{tx.gas}</span>
          <span style={{fontSize:10,color:Q.dim}}>{tx.time}</span>
        </div>
      ))}

      <div style={{padding:"16px 24px",display:"flex",justifyContent:"center"}}>
        <button style={{padding:"8px 24px",borderRadius:20,
          border:`1px solid ${Q.plasma}33`,background:"transparent",
          color:Q.neutrino,fontSize:11,fontWeight:700,cursor:"pointer"}}>
          View All on Etherscan →
        </button>
      </div>
    </div>
  );
}
