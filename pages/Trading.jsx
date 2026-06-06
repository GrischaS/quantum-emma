// ============================================================
//  QUANTUM EMMA — Trading Terminal v5.0 MEGA UPGRADE
//  B1: DEX Swap UI + B2: Live Preis-Chart + B4: AI Signals
//  4D/5D Holographic · © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};

function useTick(ms=80){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);return t;}

// ─── PRICE ENGINE ─────────────────────────────────────────────────────────────
function usePriceEngine() {
  const [prices, setPrices] = useState({
    QEMMA:{price:0.63,change:2.47,volume:1820000,mcap:9576000},
    ETH:  {price:3241.50,change:1.12,volume:18400000000,mcap:389000000000},
    BTC:  {price:67820,change:-0.34,volume:28900000000,mcap:1330000000000},
    USDT: {price:1.00,change:0.01,volume:45000000000,mcap:110000000000},
  });
  const tick = useTick(2000);
  useEffect(() => {
    setPrices(prev => {
      const next = {};
      for (const [sym, d] of Object.entries(prev)) {
        if (sym === "USDT") { next[sym] = d; continue; }
        const drift = (Math.random() - 0.495) * 0.003;
        const newPrice = d.price * (1 + drift);
        const newChange = d.change + (Math.random()-0.5)*0.05;
        next[sym] = {...d, price: newPrice, change: newChange};
      }
      return next;
    });
  }, [tick]);
  return prices;
}

// ─── CANDLE GENERATOR ─────────────────────────────────────────────────────────
function useCandles(basePrice=0.63, count=60) {
  const [candles, setCandles] = useState(() => {
    const arr = [];
    let p = basePrice;
    for (let i = 0; i < count; i++) {
      const o = p;
      const c = o * (1 + (Math.random()-0.49)*0.025);
      const h = Math.max(o,c) * (1 + Math.random()*0.012);
      const l = Math.min(o,c) * (1 - Math.random()*0.012);
      arr.push({o,c,h,l,v:Math.random()*100+20,t:Date.now()-((count-i)*60000)});
      p = c;
    }
    return arr;
  });
  const tick = useTick(3000);
  useEffect(() => {
    setCandles(prev => {
      const last = prev[prev.length-1];
      const c = last.c * (1 + (Math.random()-0.49)*0.02);
      const h = Math.max(last.c,c)*(1+Math.random()*0.01);
      const l = Math.min(last.c,c)*(1-Math.random()*0.01);
      return [...prev.slice(1), {o:last.c,c,h,l,v:Math.random()*100+20,t:Date.now()}];
    });
  }, [tick]);
  return candles;
}

// ─── CHART COMPONENT ──────────────────────────────────────────────────────────
function CandleChart({ candles, height=260, timeframe="1m" }) {
  const min = Math.min(...candles.map(c=>c.l));
  const max = Math.max(...candles.map(c=>c.h));
  const range = max - min || 0.001;
  const toY = p => height - ((p-min)/range)*height;
  const W = 100/candles.length;
  const last = candles[candles.length-1];
  const first = candles[0];
  const totalChange = ((last.c-first.o)/first.o*100).toFixed(2);
  const isUp = totalChange >= 0;

  // EMA calculations
  const ema = (arr, period) => {
    const k = 2/(period+1), result = [];
    arr.forEach((v,i) => result.push(i===0 ? v : v*k + result[i-1]*(1-k)));
    return result;
  };
  const closes = candles.map(c=>c.c);
  const ema20 = ema(closes,20);
  const ema50 = ema(closes,50);

  const pointStr = (arr) => arr.map((v,i)=>`${i*W+W/2},${toY(v)}`).join(" ");

  return (
    <div style={{position:"relative",width:"100%",height,userSelect:"none",fontFamily:"monospace"}}>
      {/* Grid lines */}
      {[0,0.25,0.5,0.75,1].map(f=>(
        <div key={f} style={{position:"absolute",left:0,right:36,top:height*f,
          height:1,background:"rgba(139,92,246,0.08)",display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
          <span style={{position:"absolute",right:0,top:-7,fontSize:9,color:Q.dim,width:34,textAlign:"right"}}>
            ${(max-range*f).toFixed(max>100?0:4)}
          </span>
        </div>
      ))}

      {/* SVG for EMAs */}
      <svg style={{position:"absolute",inset:0,width:"calc(100% - 36px)",height:"100%",overflow:"visible"}}>
        <polyline points={pointStr(ema20)} fill="none" stroke={Q.photon} strokeWidth="1" strokeOpacity="0.6"/>
        <polyline points={pointStr(ema50)} fill="none" stroke={Q.higgs} strokeWidth="1" strokeOpacity="0.6"/>
      </svg>

      {/* Candles */}
      <div style={{position:"absolute",inset:0,right:36,display:"flex",alignItems:"flex-end"}}>
        {candles.map((c,i)=>{
          const isBull = c.c >= c.o;
          const color = isBull ? Q.lepton : Q.tauon;
          const bodyTop = toY(Math.max(c.o,c.c));
          const bodyH = Math.max(1, Math.abs(toY(c.o)-toY(c.c)));
          const wickTop = toY(c.h);
          const wickH = toY(c.l)-wickTop;
          return (
            <div key={i} style={{position:"absolute",left:`${i*W}%`,width:`${W*0.75}%`,top:0,bottom:0}}>
              <div style={{position:"absolute",left:"40%",top:wickTop,height:wickH,width:1,background:color,opacity:.7}}/>
              <div style={{position:"absolute",left:0,right:0,top:bodyTop,height:bodyH,
                background:isBull?`${color}cc`:color,border:`1px solid ${color}`,borderRadius:1,
                boxShadow:`0 0 3px ${color}44`}}/>
            </div>
          );
        })}
      </div>

      {/* Current price line */}
      <div style={{position:"absolute",left:0,right:36,top:toY(last.c),
        height:1,background:`${isUp?Q.lepton:Q.tauon}88`,borderTop:`1px dashed ${isUp?Q.lepton:Q.tauon}66`}}>
        <span style={{position:"absolute",right:-36,top:-9,fontSize:9,color:isUp?Q.lepton:Q.tauon,
          background:Q.bg2,padding:"1px 3px",borderRadius:3,whiteSpace:"nowrap"}}>
          ${last.c.toFixed(4)}
        </span>
      </div>

      {/* EMA Legend */}
      <div style={{position:"absolute",top:6,left:6,display:"flex",gap:12,fontSize:9,color:Q.dim}}>
        <span style={{color:Q.photon}}>EMA20</span>
        <span style={{color:Q.higgs}}>EMA50</span>
        <span style={{color:isUp?Q.lepton:Q.tauon,marginLeft:8}}>{isUp?"▲":"▼"} {totalChange}%</span>
      </div>
    </div>
  );
}

// ─── ORDER BOOK ───────────────────────────────────────────────────────────────
function OrderBook({ price }) {
  const tick = useTick(1500);
  const asks = Array.from({length:8},(_,i)=>({
    price: price*(1+0.001*(i+1)*(1+Math.sin(tick*0.1+i)*0.3)),
    size: (Math.random()*500+50).toFixed(2),
    total: 0,
  })).reverse();
  const bids = Array.from({length:8},(_,i)=>({
    price: price*(1-0.001*(i+1)*(1+Math.sin(tick*0.1+i)*0.3)),
    size: (Math.random()*500+50).toFixed(2),
    total: 0,
  }));
  const maxSize = Math.max(...[...asks,...bids].map(r=>parseFloat(r.size)));

  return (
    <div style={{fontSize:10,fontFamily:"monospace"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",color:Q.dim,padding:"0 4px 4px",borderBottom:`1px solid ${Q.plasma}22`}}>
        <span>Price (USDT)</span><span style={{textAlign:"right"}}>Amount</span><span style={{textAlign:"right"}}>Total</span>
      </div>
      {asks.map((a,i)=>(
        <div key={i} style={{position:"relative",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
          padding:"2px 4px",color:Q.tauon}}>
          <div style={{position:"absolute",right:0,top:0,bottom:0,
            width:`${(parseFloat(a.size)/maxSize)*100}%`,background:`${Q.tauon}12`}}/>
          <span>{a.price.toFixed(4)}</span>
          <span style={{textAlign:"right"}}>{a.size}</span>
          <span style={{textAlign:"right"}}>{(a.price*parseFloat(a.size)).toFixed(0)}</span>
        </div>
      ))}
      <div style={{textAlign:"center",padding:"6px 0",fontSize:14,fontWeight:800,
        color:Q.lepton,borderTop:`1px solid ${Q.plasma}22`,borderBottom:`1px solid ${Q.plasma}22`}}>
        ${price.toFixed(4)}
      </div>
      {bids.map((b,i)=>(
        <div key={i} style={{position:"relative",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
          padding:"2px 4px",color:Q.lepton}}>
          <div style={{position:"absolute",right:0,top:0,bottom:0,
            width:`${(parseFloat(b.size)/maxSize)*100}%`,background:`${Q.lepton}12`}}/>
          <span>{b.price.toFixed(4)}</span>
          <span style={{textAlign:"right"}}>{b.size}</span>
          <span style={{textAlign:"right"}}>{(b.price*parseFloat(b.size)).toFixed(0)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── DEX SWAP UI (B1) ────────────────────────────────────────────────────────
function DexSwap({ prices }) {
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("QEMMA");
  const [fromAmt, setFromAmt] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [swapping, setSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const tokens = ["QEMMA","ETH","BTC","USDT"];
  const fromPrice = prices[fromToken]?.price || 1;
  const toPrice   = prices[toToken]?.price   || 1;
  const toAmt     = fromAmt ? (parseFloat(fromAmt)*fromPrice/toPrice).toFixed(6) : "";
  const priceImpact = parseFloat(fromAmt||0) > 500 ? "1.24" : parseFloat(fromAmt||0) > 100 ? "0.48" : "0.12";
  const minReceived = toAmt ? (parseFloat(toAmt)*(1-parseFloat(slippage)/100)).toFixed(6) : "0";

  const handleSwap = () => {
    if (!fromAmt) return;
    setSwapping(true);
    setTimeout(() => { setSwapping(false); setSwapSuccess(true); setFromAmt(""); }, 2200);
    setTimeout(() => setSwapSuccess(false), 5000);
  };

  const flip = () => { setFromToken(toToken); setToToken(fromToken); setFromAmt(""); };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <span style={{color:Q.quark,fontWeight:700,fontSize:13}}>⚛️ DEX Swap</span>
        <button onClick={()=>setShowSettings(!showSettings)} style={{background:"none",border:"none",color:Q.dim,cursor:"pointer",fontSize:16}}>⚙️</button>
      </div>

      {/* Slippage settings */}
      {showSettings && (
        <div style={{background:`${Q.plasma}15`,borderRadius:10,padding:"10px 12px",border:`1px solid ${Q.plasma}33`}}>
          <div style={{color:Q.mid,fontSize:11,marginBottom:6}}>Slippage Tolerance</div>
          <div style={{display:"flex",gap:6}}>
            {["0.1","0.5","1.0"].map(s=>(
              <button key={s} onClick={()=>setSlippage(s)} style={{
                flex:1,padding:"4px",borderRadius:8,border:`1px solid ${slippage===s?Q.photon:Q.plasma}44`,
                background:slippage===s?`${Q.photon}20`:"transparent",color:slippage===s?Q.photon:Q.mid,
                cursor:"pointer",fontSize:11
              }}>{s}%</button>
            ))}
            <input value={slippage} onChange={e=>setSlippage(e.target.value)}
              style={{width:50,padding:"4px",borderRadius:8,border:`1px solid ${Q.plasma}44`,
                background:"transparent",color:Q.bright,fontSize:11,textAlign:"center"}}/>
          </div>
        </div>
      )}

      {/* From */}
      <div style={{background:`${Q.plasma}12`,borderRadius:12,padding:"12px 14px",border:`1px solid ${Q.plasma}33`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{color:Q.dim,fontSize:11}}>From</span>
          <span style={{color:Q.dim,fontSize:11}}>Balance: 1,240.00 {fromToken}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input value={fromAmt} onChange={e=>setFromAmt(e.target.value)} placeholder="0.0"
            style={{flex:1,background:"none",border:"none",color:Q.bright,fontSize:22,fontWeight:700,outline:"none",fontFamily:"monospace"}}/>
          <select value={fromToken} onChange={e=>setFromToken(e.target.value)} style={{
            background:Q.bg2,border:`1px solid ${Q.plasma}44`,color:Q.bright,borderRadius:8,
            padding:"6px 10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
            {tokens.filter(t=>t!==toToken).map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        {fromAmt && <div style={{color:Q.dim,fontSize:10,marginTop:4}}>≈ ${(parseFloat(fromAmt)*fromPrice).toFixed(2)}</div>}
      </div>

      {/* Flip button */}
      <div style={{display:"flex",justifyContent:"center"}}>
        <button onClick={flip} style={{background:`${Q.plasma}30`,border:`1px solid ${Q.plasma}66`,
          color:Q.quark,borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 0 12px ${Q.plasma}44`}}>⇅</button>
      </div>

      {/* To */}
      <div style={{background:`${Q.gluon}10`,borderRadius:12,padding:"12px 14px",border:`1px solid ${Q.gluon}33`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{color:Q.dim,fontSize:11}}>To (estimated)</span>
          <span style={{color:Q.dim,fontSize:11}}>Balance: 50,000 {toToken}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{flex:1,color:toAmt?Q.bright:Q.dim,fontSize:22,fontWeight:700,fontFamily:"monospace"}}>
            {toAmt || "0.0"}
          </div>
          <select value={toToken} onChange={e=>setToToken(e.target.value)} style={{
            background:Q.bg2,border:`1px solid ${Q.gluon}44`,color:Q.bright,borderRadius:8,
            padding:"6px 10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
            {tokens.filter(t=>t!==fromToken).map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        {toAmt && <div style={{color:Q.dim,fontSize:10,marginTop:4}}>≈ ${(parseFloat(toAmt)*toPrice).toFixed(2)}</div>}
      </div>

      {/* Trade info */}
      {fromAmt && (
        <div style={{background:`${Q.bg2}`,borderRadius:10,padding:"8px 12px",fontSize:10,color:Q.dim,display:"flex",flexDirection:"column",gap:4}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span>Rate</span><span style={{color:Q.mid}}>1 {fromToken} = {(fromPrice/toPrice).toFixed(4)} {toToken}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span>Price Impact</span>
            <span style={{color:parseFloat(priceImpact)>1?Q.tauon:Q.lepton}}>{priceImpact}%</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span>Min. Received</span><span style={{color:Q.mid}}>{minReceived} {toToken}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span>Slippage</span><span style={{color:Q.higgs}}>{slippage}%</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span>Network Fee</span><span style={{color:Q.mid}}>~$2.40 ETH</span>
          </div>
        </div>
      )}

      {/* Swap Button */}
      <button onClick={handleSwap} disabled={!fromAmt||swapping} style={{
        padding:"14px",borderRadius:14,border:"none",cursor:fromAmt?"pointer":"not-allowed",
        background: swapSuccess ? `linear-gradient(135deg,${Q.lepton},${Q.gluon})`
          : swapping ? `${Q.plasma}66`
          : fromAmt ? `linear-gradient(135deg,${Q.plasma},${Q.gluon})`
          : `${Q.plasma}33`,
        color:Q.bright,fontWeight:800,fontSize:15,letterSpacing:1,
        boxShadow: fromAmt ? `0 0 20px ${Q.plasma}66` : "none",
        transition:"all .3s",
      }}>
        {swapSuccess ? "✅ Swap Successful!" : swapping ? "⏳ Swapping..." : fromAmt ? `⚡ Swap ${fromToken} → ${toToken}` : "Enter Amount"}
      </button>
    </div>
  );
}

// ─── AI SIGNAL ENGINE (B4) ────────────────────────────────────────────────────
function AISignalEngine({ tick }) {
  const signals = [
    { agent:"ALPHA-7",   signal:"STRONG BUY",  confidence:94, color:Q.lepton,  asset:"QEMMA", reason:"HQMLL momentum divergence detected" },
    { agent:"BETA-3",    signal:"BUY",          confidence:78, color:Q.gluon,   asset:"ETH",   reason:"Support at EMA50 confirmed" },
    { agent:"GAMMA-12",  signal:"HOLD",         confidence:62, color:Q.higgs,   asset:"BTC",   reason:"RSI neutral zone, await breakout" },
    { agent:"DELTA-1",   signal:"SELL",         confidence:71, color:Q.tauon,   asset:"USDT",  reason:"Inflation hedge signal weakening" },
    { agent:"EPSILON-9", signal:"STRONG BUY",   confidence:89, color:Q.lepton,  asset:"QEMMA", reason:"MetaCodex Phase 2 activation" },
  ];

  const pulse = 0.5 + Math.sin(tick*0.07)*0.3;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:Q.lepton,
          boxShadow:`0 0 ${8+pulse*6}px ${Q.lepton}`,animation:"none"}}/>
        <span style={{color:Q.quark,fontWeight:700,fontSize:12}}>META GENIUS TR2 — Live Signals</span>
      </div>
      {signals.map((s,i)=>(
        <div key={i} style={{background:`${s.color}0e`,borderRadius:10,padding:"8px 12px",
          border:`1px solid ${s.color}${Math.round((0.2+pulse*0.1)*255).toString(16).padStart(2,"0")}`,
          display:"flex",gap:10,alignItems:"center"}}>
          <div style={{minWidth:70}}>
            <div style={{fontSize:9,color:Q.dim}}>{s.agent}</div>
            <div style={{fontSize:11,fontWeight:800,color:s.color}}>{s.signal}</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:Q.mid,marginBottom:3}}>{s.asset} · {s.reason}</div>
            <div style={{height:4,background:`${s.color}22`,borderRadius:2}}>
              <div style={{height:4,width:`${s.confidence}%`,background:s.color,borderRadius:2,
                boxShadow:`0 0 6px ${s.color}88`,transition:"width 1s"}}/>
            </div>
          </div>
          <div style={{fontSize:13,fontWeight:800,color:s.color,minWidth:35,textAlign:"right"}}>
            {s.confidence}%
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── RECENT TRADES ────────────────────────────────────────────────────────────
function RecentTrades({ price }) {
  const tick = useTick(800);
  const [trades, setTrades] = useState(() =>
    Array.from({length:12},(_,i)=>({
      id:i, price: price*(0.998+Math.random()*0.004),
      size:(Math.random()*200+5).toFixed(2),
      side:Math.random()>0.5?"buy":"sell",
      time: new Date(Date.now()-i*8000).toLocaleTimeString()
    }))
  );
  useEffect(()=>{
    if (tick%3!==0) return;
    setTrades(prev=>[{
      id:Date.now(), price: price*(0.999+Math.random()*0.002),
      size:(Math.random()*150+5).toFixed(2),
      side:Math.random()>0.5?"buy":"sell",
      time:new Date().toLocaleTimeString()
    },...prev.slice(0,11)]);
  },[tick]);
  return (
    <div style={{fontSize:10,fontFamily:"monospace"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",color:Q.dim,
        padding:"0 4px 4px",borderBottom:`1px solid ${Q.plasma}22`}}>
        <span>Price</span><span style={{textAlign:"right"}}>Size</span><span style={{textAlign:"right"}}>Time</span>
      </div>
      {trades.map(tr=>(
        <div key={tr.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
          padding:"2px 4px",color:tr.side==="buy"?Q.lepton:Q.tauon}}>
          <span>{tr.price.toFixed(4)}</span>
          <span style={{textAlign:"right"}}>{tr.size}</span>
          <span style={{textAlign:"right",color:Q.dim}}>{tr.time}</span>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN TRADING TERMINAL ────────────────────────────────────────────────────

// ─── TRADINGVIEW LIVE CHART ───────────────────────────────────────────────────
function TradingViewChart({ symbol="ETHUSD", theme="dark" }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if(!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize:          true,
      symbol:            symbol,
      interval:          "60",
      timezone:          "Europe/Berlin",
      theme:             theme,
      style:             "1",
      locale:            "en",
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      hide_top_toolbar:  false,
      save_image:        false,
      backgroundColor:   "rgba(0,0,8,1)",
      gridColor:         "rgba(124,58,237,0.08)",
      studies:           ["STD;EMA","STD;MACD","STD;Volume"],
      container_id:      "tv_chart_container",
    });
    ref.current.appendChild(script);
    return () => { if(ref.current) ref.current.innerHTML = ""; };
  }, [symbol]);

  return (
    <div style={{width:"100%",height:400,borderRadius:14,overflow:"hidden",
      border:`1px solid #7c3aed33`,background:"#000008",position:"relative"}}>
      <div ref={ref} id="tv_chart_container"
        className="tradingview-widget-container"
        style={{width:"100%",height:"100%"}}/>
    </div>
  );
}

export default function TradingTerminal() {
  const tick = useTick(80);
  const prices = usePriceEngine();
  const candles = useCandles(prices.QEMMA.price, 60);
  const [pair, setPair] = useState("QEMMA/USDT");
  const [orderType, setOrderType] = useState("limit");
  const [side, setSide] = useState("buy");
  const [limitPrice, setLimitPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [tab, setTab] = useState("chart"); // chart | swap | signals
  const [pairTab, setPairTab] = useState("QEMMA");

  const qPrice = prices.QEMMA;
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;

  const pairs = [
    {sym:"QEMMA", label:"QEMMA/USDT", change:qPrice.change},
    {sym:"ETH",   label:"ETH/USDT",   change:prices.ETH.change},
    {sym:"BTC",   label:"BTC/USDT",   change:prices.BTC.change},
  ];

  const activePair = pairs.find(p=>p.sym===pairTab) || pairs[0];
  const activePrice = prices[pairTab] || prices.QEMMA;

  return (
    <div style={{minHeight:"100vh",background:Q.void,color:Q.bright,fontFamily:"'Inter',sans-serif",paddingBottom:40}}>
      {/* ── HEADER BAR ── */}
      <div style={{background:Q.deep,borderBottom:`1px solid ${Q.plasma}33`,padding:"10px 20px",
        display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <svg width={28} height={28} viewBox="0 0 100 100" style={{filter:`drop-shadow(0 0 6px ${Q.neutrino})`}}>
            <circle cx="50" cy="50" r="48" fill="url(#hg)" stroke={Q.plasma} strokeWidth="2"/>
            <defs><radialGradient id="hg" cx="40%" cy="35%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#3b0764"/></radialGradient></defs>
            <text x="50" y="67" textAnchor="middle" fontSize="44" fontWeight="900" fill="white" fontFamily="monospace">Q</text>
          </svg>
          <span style={{fontWeight:900,fontSize:15,color:Q.quark,letterSpacing:1}}>QEMMA</span>
        </div>

        {/* Pair selector */}
        <div style={{display:"flex",gap:4}}>
          {pairs.map(p=>(
            <button key={p.sym} onClick={()=>setPairTab(p.sym)} style={{
              padding:"4px 12px",borderRadius:8,border:`1px solid ${pairTab===p.sym?Q.plasma:Q.plasma+"33"}`,
              background:pairTab===p.sym?`${Q.plasma}30`:"transparent",color:pairTab===p.sym?Q.quark:Q.mid,
              cursor:"pointer",fontSize:11,fontWeight:700}}>
              {p.label}
              <span style={{marginLeft:4,color:p.change>=0?Q.lepton:Q.tauon,fontSize:10}}>
                {p.change>=0?"+":""}{p.change.toFixed(2)}%
              </span>
            </button>
          ))}
        </div>

        {/* Live price */}
        <div style={{marginLeft:"auto",textAlign:"right"}}>
          <div style={{fontSize:22,fontWeight:900,color:activePrice.change>=0?Q.lepton:Q.tauon,
            textShadow:`0 0 ${8+pulse*8}px ${activePrice.change>=0?Q.lepton:Q.tauon}`}}>
            ${activePrice.price.toFixed(pairTab==="QEMMA"?4:2)}
          </div>
          <div style={{fontSize:11,color:Q.dim}}>
            Vol: ${(activePrice.volume/1e6).toFixed(1)}M · MCap: ${(activePrice.mcap/1e9).toFixed(2)}B
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:0,maxWidth:1400,margin:"0 auto",padding:"16px 16px 0"}}>

        {/* LEFT COLUMN */}
        <div style={{display:"flex",flexDirection:"column",gap:12,paddingRight:12}}>

          {/* Tab switcher */}
          <div style={{display:"flex",gap:4,background:`${Q.bg1}`,borderRadius:10,padding:4,border:`1px solid ${Q.plasma}22`}}>
            {[["chart","📊 Chart"],["swap","⚡ Swap"],["signals","🤖 AI Signals"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1,padding:"6px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
                background:tab===t?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:"transparent",
                color:tab===t?Q.bright:Q.dim,boxShadow:tab===t?`0 0 12px ${Q.plasma}44`:"none"}}>
                {l}
              </button>
            ))}
          </div>

          {/* Chart */}
          {tab==="chart" && (
            <div style={{background:Q.bg1,borderRadius:14,padding:"14px",border:`1px solid ${Q.plasma}22`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{color:Q.quark,fontWeight:700}}>⚛️ QEMMA/USDT — Live Candlestick</span>
                <div style={{display:"flex",gap:4}}>
                  {["1m","5m","15m","1h","4h","1D"].map(tf=>(
                    <button key={tf} style={{padding:"2px 8px",borderRadius:6,border:`1px solid ${Q.plasma}33`,
                      background:"transparent",color:tf==="1m"?Q.photon:Q.dim,cursor:"pointer",fontSize:10}}>
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <CandleChart candles={candles} height={280}/>
            </div>
          )}

          {/* DEX Swap */}
          {tab==="swap" && (
            <div style={{background:Q.bg1,borderRadius:14,padding:"20px",border:`1px solid ${Q.plasma}22`}}>
              <DexSwap prices={prices}/>
            </div>
          )}

          {/* AI Signals */}
          {tab==="signals" && (
            <div style={{background:Q.bg1,borderRadius:14,padding:"16px",border:`1px solid ${Q.plasma}22`}}>
              <AISignalEngine tick={tick}/>
            </div>
          )}

          {/* Order Book + Recent Trades */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:Q.bg1,borderRadius:12,padding:"12px",border:`1px solid ${Q.plasma}22`}}>
              <div style={{color:Q.quark,fontWeight:700,fontSize:12,marginBottom:8}}>📖 Order Book</div>
              <OrderBook price={activePrice.price}/>
            </div>
            <div style={{background:Q.bg1,borderRadius:12,padding:"12px",border:`1px solid ${Q.plasma}22`}}>
              <div style={{color:Q.quark,fontWeight:700,fontSize:12,marginBottom:8}}>🔄 Recent Trades</div>
              <RecentTrades price={activePrice.price}/>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Order Form */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:Q.bg1,borderRadius:14,padding:"16px",border:`1px solid ${Q.plasma}22`}}>

            {/* Buy/Sell toggle */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:14}}>
              <button onClick={()=>setSide("buy")} style={{
                padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:800,fontSize:13,
                background:side==="buy"?`linear-gradient(135deg,${Q.lepton}cc,${Q.gluon}cc)`:`${Q.lepton}15`,
                color:side==="buy"?Q.void:Q.lepton,boxShadow:side==="buy"?`0 0 16px ${Q.lepton}44`:"none"}}>
                ▲ BUY
              </button>
              <button onClick={()=>setSide("sell")} style={{
                padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:800,fontSize:13,
                background:side==="sell"?`linear-gradient(135deg,${Q.tauon}cc,${Q.muon}cc)`:`${Q.tauon}15`,
                color:side==="sell"?Q.void:Q.tauon,boxShadow:side==="sell"?`0 0 16px ${Q.tauon}44`:"none"}}>
                ▼ SELL
              </button>
            </div>

            {/* Order type */}
            <div style={{display:"flex",gap:4,marginBottom:12}}>
              {["limit","market","stop"].map(t=>(
                <button key={t} onClick={()=>setOrderType(t)} style={{
                  flex:1,padding:"5px",borderRadius:8,border:`1px solid ${Q.plasma}${orderType===t?"88":"22"}`,
                  background:orderType===t?`${Q.plasma}30`:"transparent",
                  color:orderType===t?Q.quark:Q.dim,cursor:"pointer",fontSize:10,fontWeight:700,textTransform:"capitalize"}}>
                  {t}
                </button>
              ))}
            </div>

            {/* Available balance */}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:Q.dim,marginBottom:10}}>
              <span>Available</span>
              <span style={{color:Q.mid}}>{side==="buy"?"$10,420.00 USDT":"50,000 QEMMA"}</span>
            </div>

            {/* Price input (limit) */}
            {orderType==="limit" && (
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,color:Q.dim,marginBottom:4}}>Limit Price (USDT)</div>
                <div style={{display:"flex",gap:4}}>
                  <input value={limitPrice} onChange={e=>setLimitPrice(e.target.value)}
                    placeholder={activePrice.price.toFixed(4)}
                    style={{flex:1,background:`${Q.bg2}`,border:`1px solid ${Q.plasma}33`,borderRadius:8,
                      padding:"8px 10px",color:Q.bright,fontSize:13,outline:"none",fontFamily:"monospace"}}/>
                  <button onClick={()=>setLimitPrice(activePrice.price.toFixed(4))} style={{
                    padding:"8px 8px",borderRadius:8,border:`1px solid ${Q.plasma}44`,
                    background:`${Q.plasma}20`,color:Q.quark,cursor:"pointer",fontSize:10}}>Mkt</button>
                </div>
              </div>
            )}

            {/* Amount */}
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:Q.dim,marginBottom:4}}>Amount (QEMMA)</div>
              <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00"
                style={{width:"100%",background:`${Q.bg2}`,border:`1px solid ${Q.plasma}33`,borderRadius:8,
                  padding:"8px 10px",color:Q.bright,fontSize:13,outline:"none",fontFamily:"monospace",boxSizing:"border-box"}}/>
              {/* Quick % */}
              <div style={{display:"flex",gap:4,marginTop:6}}>
                {["25%","50%","75%","100%"].map(p=>(
                  <button key={p} onClick={()=>setAmount((50000*parseInt(p)/100).toString())} style={{
                    flex:1,padding:"3px",borderRadius:6,border:`1px solid ${Q.plasma}33`,
                    background:"transparent",color:Q.dim,cursor:"pointer",fontSize:10}}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Total */}
            {amount && (
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:Q.dim,
                marginBottom:10,padding:"6px 8px",background:`${Q.plasma}0a`,borderRadius:6}}>
                <span>Total</span>
                <span style={{color:Q.mid}}>${(parseFloat(amount||0)*activePrice.price).toFixed(2)} USDT</span>
              </div>
            )}

            {/* Submit */}
            <button style={{
              width:"100%",padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
              fontWeight:800,fontSize:14,letterSpacing:1,
              background:side==="buy"
                ?`linear-gradient(135deg,${Q.lepton},${Q.gluon})`
                :`linear-gradient(135deg,${Q.tauon},${Q.muon})`,
              color:Q.void,
              boxShadow:`0 0 20px ${side==="buy"?Q.lepton:Q.tauon}55`}}>
              {side==="buy"?"▲ PLACE BUY ORDER":"▼ PLACE SELL ORDER"}
            </button>
          </div>

          {/* Mini AI signal widget */}
          <div style={{background:Q.bg1,borderRadius:14,padding:"14px",border:`1px solid ${Q.lepton}22`}}>
            <div style={{color:Q.lepton,fontWeight:700,fontSize:11,marginBottom:8}}>🤖 AI Recommendation</div>
            <div style={{textAlign:"center",padding:"12px 0"}}>
              <div style={{fontSize:28,fontWeight:900,color:Q.lepton,
                textShadow:`0 0 ${12+pulse*8}px ${Q.lepton}`}}>STRONG BUY</div>
              <div style={{color:Q.dim,fontSize:11,marginTop:4}}>Confidence: 94% · ALPHA-7</div>
              <div style={{height:6,background:`${Q.lepton}22`,borderRadius:3,marginTop:8}}>
                <div style={{height:6,width:"94%",background:`linear-gradient(90deg,${Q.lepton},${Q.gluon})`,
                  borderRadius:3,boxShadow:`0 0 10px ${Q.lepton}88`}}/>
              </div>
            </div>
            <div style={{fontSize:10,color:Q.dim,marginTop:8,lineHeight:1.5}}>
              HQMLL momentum divergence + Phase 2 MetaCodex activation detected. Target: $1.20 (+90%)
            </div>
          </div>

          {/* Market stats */}
          <div style={{background:Q.bg1,borderRadius:14,padding:"14px",border:`1px solid ${Q.plasma}22`}}>
            <div style={{color:Q.quark,fontWeight:700,fontSize:11,marginBottom:10}}>📊 Market Stats</div>
            {[
              ["24h High","$0.7140",Q.lepton],
              ["24h Low","$0.5820",Q.tauon],
              ["24h Vol","$1.82M",Q.mid],
              ["Open","$0.6147",Q.mid],
              ["Funding","0.0100%",Q.higgs],
            ].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",
                padding:"4px 0",borderBottom:`1px solid ${Q.plasma}11`,fontSize:11}}>
                <span style={{color:Q.dim}}>{l}</span><span style={{color:c}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
