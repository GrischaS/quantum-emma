// ============================================================
//  QUANTUM EMMA — Professional Trading Terminal v3.0
//  4D/5D Holographic · BingX/Phemex Style · Live WebSocket
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};

function useTick(ms=60){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[]);return t;}

// ─── LIVE CANDLE CHART ────────────────────────────────────────────────────────
function CandleChart({ candles, height=220, overlay=true }) {
  const min = Math.min(...candles.map(c=>c.l));
  const max = Math.max(...candles.map(c=>c.h));
  const range = max - min || 1;
  const toY = p => height - ((p - min) / range) * height;
  const W = 100 / candles.length;

  // EMA lines (simulated)
  const ema20 = candles.map((c,i) => ({
    x: i*W+W/2,
    y: toY(c.c * 0.998 + (Math.sin(i*0.3)*0.004)*c.c)
  }));
  const ema50 = candles.map((c,i) => ({
    x: i*W+W/2,
    y: toY(c.c * 0.991 + (Math.sin(i*0.2)*0.005)*c.c)
  }));

  return (
    <div style={{height,position:"relative",width:"100%",userSelect:"none"}}>
      {/* Grid */}
      {[0,0.25,0.5,0.75,1].map(f=>(
        <React.Fragment key={f}>
          <div style={{position:"absolute",left:0,right:32,top:height*f,
            height:1,background:"rgba(139,92,246,0.06)"}}/>
          <div style={{position:"absolute",right:0,top:height*f-8,
            fontSize:8,color:Q.dim,fontFamily:"monospace",textAlign:"right",paddingRight:2}}>
            ${(max - range*f).toFixed(max>1000?0:2)}
          </div>
        </React.Fragment>
      ))}

      {/* SVG overlay (EMAs) */}
      {overlay && (
        <svg style={{position:"absolute",inset:0,width:"calc(100% - 32px)",height:"100%",overflow:"visible"}} preserveAspectRatio="none">
          <polyline points={ema20.map(p=>`${p.x},${p.y}`).join(" ")}
            fill="none" stroke={Q.higgs} strokeWidth="1" strokeOpacity="0.6"/>
          <polyline points={ema50.map(p=>`${p.x},${p.y}`).join(" ")}
            fill="none" stroke={Q.gluon} strokeWidth="1" strokeOpacity="0.5"/>
        </svg>
      )}

      {/* Candles */}
      <div style={{display:"flex",height:"100%",paddingRight:32}}>
        {candles.map((c,i)=>{
          const bull = c.c >= c.o;
          const col  = bull ? Q.lepton : Q.tauon;
          const bTop = toY(Math.max(c.o,c.c));
          const bH   = Math.max(Math.abs(toY(c.o)-toY(c.c)),1.5);
          return (
            <div key={i} style={{flex:1,position:"relative",height:"100%"}}>
              {/* Wick */}
              <div style={{position:"absolute",left:"50%",width:1,
                top:toY(c.h),height:toY(c.l)-toY(c.h),
                background:col,opacity:0.7,transform:"translateX(-50%)"}}/>
              {/* Body */}
              <div style={{position:"absolute",left:"10%",right:"10%",
                top:bTop,height:bH,
                background:bull?`${col}cc`:col,
                borderRadius:1,
                boxShadow:i===candles.length-1?`0 0 6px ${col}88`:""}}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── VOLUME BARS ─────────────────────────────────────────────────────────────
function VolumeBars({ candles, height=40 }) {
  const maxV = Math.max(...candles.map(c=>c.v||1));
  return (
    <div style={{display:"flex",alignItems:"flex-end",height,paddingRight:32,gap:0}}>
      {candles.map((c,i)=>(
        <div key={i} style={{
          flex:1,height:`${((c.v||1)/maxV)*100}%`,
          background:c.c>=c.o?`${Q.lepton}44`:`${Q.tauon}33`,
          borderRadius:"2px 2px 0 0",
        }}/>
      ))}
    </div>
  );
}

// ─── RSI PANEL ───────────────────────────────────────────────────────────────
function RSIPanel({ candles, height=40 }) {
  const rsis = candles.map((c,i)=>52+Math.sin(i*0.28)*24);
  const min=20,max=80,range=max-min;
  const pts = rsis.map((v,i)=>`${i*100/(rsis.length-1)},${height-((v-min)/range)*height}`).join(" ");
  return (
    <div style={{height,position:"relative",paddingRight:32}}>
      {/* Overbought/oversold lines */}
      {[30,70].map(lv=>(
        <div key={lv} style={{position:"absolute",left:0,right:32,
          top:height-((lv-min)/range)*height,
          height:1,background:lv===70?`${Q.tauon}44`:`${Q.lepton}44`}}/>
      ))}
      <svg width="100%" height={height} style={{overflow:"visible"}} preserveAspectRatio="none">
        <polyline points={pts} fill="none" stroke={Q.quark} strokeWidth="1.5"
          style={{filter:`drop-shadow(0 0 3px ${Q.quark})`}}/>
      </svg>
      <div style={{position:"absolute",right:0,top:0,fontSize:8,color:Q.dim}}>RSI</div>
    </div>
  );
}

// ─── ORDER BOOK ──────────────────────────────────────────────────────────────
function OrderBook({ mid, tick }) {
  const asks = Array.from({length:12},(_,i)=>({
    p: mid+(i+1)*11+Math.sin(tick*0.1+i)*3,
    a: +(0.04+Math.random()*1.1).toFixed(4),
  })).map(o=>({...o,t:+(o.p*o.a).toFixed(0)}));

  const bids = Array.from({length:12},(_,i)=>({
    p: mid-(i+1)*11-Math.sin(tick*0.1+i)*3,
    a: +(0.05+Math.random()*0.9).toFixed(4),
  })).map(o=>({...o,t:+(o.p*o.a).toFixed(0)}));

  const maxT = Math.max(...asks.map(o=>o.t),...bids.map(o=>o.t));

  const Row = ({o,side}) => (
    <div style={{display:"flex",justifyContent:"space-between",
      padding:"3px 8px",fontSize:10,position:"relative",fontFamily:"monospace",
      transition:"background 0.2s"}}>
      <div style={{position:"absolute",top:0,bottom:0,
        right:0,width:`${(o.t/maxT)*80}%`,
        background:side==="ask"?`${Q.tauon}09`:`${Q.lepton}07`}}/>
      <span style={{color:side==="ask"?Q.tauon:Q.lepton,fontWeight:700,zIndex:1}}>
        {o.p.toFixed(1)}
      </span>
      <span style={{color:Q.mid,zIndex:1}}>{o.a.toFixed(4)}</span>
      <span style={{color:Q.dim,zIndex:1}}>${o.t.toLocaleString()}</span>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",fontSize:10}}>
      <div style={{display:"flex",justifyContent:"space-between",
        padding:"5px 8px",fontSize:8,color:Q.dim,letterSpacing:1,
        borderBottom:`1px solid ${Q.plasma}18`}}>
        <span>PRICE</span><span>QTY</span><span>TOTAL</span>
      </div>
      {asks.slice().reverse().map((o,i)=><Row key={`a${i}`} o={o} side="ask"/>)}
      {/* Spread */}
      <div style={{textAlign:"center",padding:"6px 8px",
        background:`${Q.gluon}10`,
        borderTop:`1px solid ${Q.gluon}20`,borderBottom:`1px solid ${Q.gluon}20`}}>
        <span style={{fontSize:14,fontWeight:900,color:Q.photon,fontFamily:"monospace",
          textShadow:`0 0 10px ${Q.photon}`}}>{mid.toFixed(2)}</span>
        <span style={{fontSize:9,color:Q.dim,marginLeft:8}}>
          Spread: ${(asks[0]?.p-bids[0]?.p).toFixed(1)}
        </span>
      </div>
      {bids.map((o,i)=><Row key={`b${i}`} o={o} side="bid"/>)}
    </div>
  );
}

// ─── TRADE FEED ───────────────────────────────────────────────────────────────
function TradeFeed({ mid, tick }) {
  const [trades, setTrades] = useState(()=>
    Array.from({length:18},(_,i)=>({
      id:i, side:Math.random()>.5?"buy":"sell",
      price:mid+(Math.random()-.5)*30,
      amount:+(0.001+Math.random()*.18).toFixed(4),
      time:new Date(Date.now()-i*7000),
    }))
  );
  useEffect(()=>{
    if(tick%10===0){
      setTrades(prev=>[{
        id:Date.now(),side:Math.random()>.5?"buy":"sell",
        price:mid+(Math.random()-.5)*28,
        amount:+(0.001+Math.random()*.15).toFixed(4),
        time:new Date(),
      },...prev.slice(0,22)]);
    }
  },[tick]);

  return (
    <div style={{display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"space-between",
        padding:"5px 8px",fontSize:8,color:Q.dim,letterSpacing:1,
        borderBottom:`1px solid ${Q.plasma}18`}}>
        <span>PRICE</span><span>QTY</span><span>TIME</span>
      </div>
      {trades.map(t=>(
        <div key={t.id} style={{display:"flex",justifyContent:"space-between",
          padding:"3px 8px",fontSize:10,fontFamily:"monospace"}}>
          <span style={{color:t.side==="buy"?Q.lepton:Q.tauon,fontWeight:700}}>
            {t.price.toFixed(2)}
          </span>
          <span style={{color:Q.mid}}>{t.amount}</span>
          <span style={{color:Q.dim,fontSize:9}}>
            {t.time.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── INDICATORS BAR ──────────────────────────────────────────────────────────
function IndicatorsBar({ price, tick }) {
  const rsi  = 52+Math.sin(tick*0.04)*18;
  const macd = 0.12+Math.sin(tick*0.03)*0.08;
  const bb_u = (price*1.022).toFixed(0);
  const bb_l = (price*0.978).toFixed(0);
  return (
    <div style={{display:"flex",gap:14,padding:"6px 14px",fontSize:10,
      background:"rgba(0,0,0,0.35)",borderBottom:`1px solid ${Q.plasma}14`,
      flexWrap:"wrap",overflowX:"auto",scrollbarWidth:"none"}}>
      {[
        {l:"RSI(14)",  v:rsi.toFixed(1),      c:rsi>70?Q.tauon:rsi<30?Q.lepton:Q.mid},
        {l:"MACD",     v:macd.toFixed(3),      c:macd>0?Q.lepton:Q.tauon},
        {l:"BB Upper", v:`$${bb_u}`,           c:Q.mid},
        {l:"BB Lower", v:`$${bb_l}`,           c:Q.mid},
        {l:"EMA 20",   v:`$${(price*.998).toFixed(0)}`, c:Q.higgs},
        {l:"EMA 50",   v:`$${(price*.991).toFixed(0)}`, c:Q.gluon},
        {l:"Volume",   v:"$2.41B",             c:Q.mid},
        {l:"AI Signal",v:"BUY ▲",              c:Q.lepton},
        {l:"Conf.",    v:"73.2%",              c:Q.neutrino},
      ].map((s,i)=>(
        <div key={i} style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
          <span style={{color:Q.dim}}>{s.l}:</span>
          <span style={{color:s.c,fontWeight:700}}>{s.v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── POSITION TABLE ───────────────────────────────────────────────────────────
function PositionTable({ price }) {
  const positions = [
    {sym:"BTC/USDT", side:"LONG",  size:0.18, entry:70200, lev:5,  c:Q.lepton},
    {sym:"ETH/USDT", side:"LONG",  size:2.5,  entry:3780,  lev:3,  c:Q.lepton},
    {sym:"QEMMA/ETH",side:"LONG",  size:5000, entry:0.000163,lev:1,c:Q.neutrino},
  ];
  return (
    <div>
      <div style={{display:"grid",
        gridTemplateColumns:"1.4fr 60px 70px 80px 80px 60px 80px",
        padding:"5px 12px",fontSize:8,color:Q.dim,letterSpacing:1,
        borderBottom:`1px solid ${Q.plasma}18`}}>
        <span>SYMBOL</span><span>SIDE</span><span>SIZE</span>
        <span>ENTRY</span><span>MARK</span><span>LEV</span><span>PNL</span>
      </div>
      {positions.map((p,i)=>{
        const mark  = p.sym==="BTC/USDT"?price:p.sym==="ETH/USDT"?3840:0.000168;
        const pnl   = (mark-p.entry)*p.size*p.lev;
        const pnlPct= ((mark-p.entry)/p.entry)*100*p.lev;
        return (
          <div key={i} style={{display:"grid",
            gridTemplateColumns:"1.4fr 60px 70px 80px 80px 60px 80px",
            padding:"7px 12px",fontSize:10,fontFamily:"monospace",
            borderBottom:`1px solid ${Q.plasma}10`,
            background:i%2===0?"rgba(139,92,246,0.02)":"transparent"}}>
            <span style={{color:p.c,fontWeight:700}}>{p.sym}</span>
            <span style={{color:Q.lepton}}>{p.side}</span>
            <span style={{color:Q.mid}}>{p.size}</span>
            <span style={{color:Q.dim,fontSize:9}}>
              {p.entry<1?p.entry.toFixed(6):p.entry.toFixed(1)}
            </span>
            <span style={{color:Q.bright,fontSize:9}}>
              {mark<1?mark.toFixed(6):mark.toFixed(1)}
            </span>
            <span style={{color:Q.higgs}}>{p.lev}x</span>
            <span style={{color:pnl>=0?Q.lepton:Q.tauon,fontWeight:700}}>
              {pnl>=0?"+":""}{pnl.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── ORDER FORM ───────────────────────────────────────────────────────────────
function OrderForm({ price, pair, tick }) {
  const [side,  setSide]  = useState("buy");
  const [otype, setOType] = useState("limit");
  const [lev,   setLev]   = useState(1);
  const [amt,   setAmt]   = useState("");
  const [oprice,setOPrice]= useState(price.toFixed(2));
  const [sl,    setSL]    = useState("");
  const [tp,    setTP]    = useState("");

  const total = parseFloat(oprice||0)*parseFloat(amt||0)*lev;

  useEffect(()=>{ if(otype==="market") setOPrice(price.toFixed(2)); },[price,otype]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:10,padding:"12px"}}>
      {/* Buy / Sell */}
      <div style={{display:"flex",gap:6}}>
        {["buy","sell"].map(s=>(
          <button key={s} onClick={()=>setSide(s)} style={{
            flex:1,padding:"10px",borderRadius:10,border:"none",cursor:"pointer",
            background:side===s
              ?(s==="buy"?`${Q.lepton}28`:`${Q.tauon}28`)
              :"rgba(255,255,255,0.04)",
            color:side===s?(s==="buy"?Q.lepton:Q.tauon):Q.dim,
            fontWeight:900,fontSize:13,letterSpacing:1,
            borderBottom:side===s?`2px solid ${s==="buy"?Q.lepton:Q.tauon}`:"2px solid transparent",
          }}>{s==="buy"?"▲ BUY":"▼ SELL"}</button>
        ))}
      </div>

      {/* Order type */}
      <div style={{display:"flex",gap:4}}>
        {["market","limit","stop","oco"].map(t=>(
          <button key={t} onClick={()=>setOType(t)} style={{
            flex:1,padding:"5px",borderRadius:7,border:"none",cursor:"pointer",fontSize:9,
            background:otype===t?`${Q.plasma}22`:"rgba(255,255,255,0.04)",
            color:otype===t?Q.neutrino:Q.dim,fontWeight:700,letterSpacing:0.5,
          }}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* Leverage */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:5}}>
          <span style={{color:Q.dim}}>Leverage</span>
          <span style={{color:Q.higgs,fontWeight:800}}>{lev}x</span>
        </div>
        <div style={{display:"flex",gap:4}}>
          {[1,3,5,10,20,50].map(l=>(
            <button key={l} onClick={()=>setLev(l)} style={{
              flex:1,padding:"5px",borderRadius:6,border:"none",cursor:"pointer",
              background:lev===l?`${Q.higgs}22`:"rgba(255,255,255,0.04)",
              color:lev===l?Q.higgs:Q.dim,fontSize:9,fontWeight:700,
            }}>{l}x</button>
          ))}
        </div>
      </div>

      {/* Price */}
      {otype!=="market"&&(
        <div>
          <div style={{fontSize:9,color:Q.dim,marginBottom:4,letterSpacing:1}}>PRICE (USDT)</div>
          <input value={oprice} onChange={e=>setOPrice(e.target.value)}
            style={{width:"100%",padding:"9px 12px",borderRadius:9,
              background:"rgba(0,0,0,0.5)",
              border:`1px solid ${side==="buy"?Q.lepton:Q.tauon}44`,
              color:Q.bright,fontSize:14,fontWeight:700,boxSizing:"border-box"}}/>
        </div>
      )}

      {/* Amount */}
      <div>
        <div style={{fontSize:9,color:Q.dim,marginBottom:4,letterSpacing:1}}>AMOUNT</div>
        <input value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0.000"
          style={{width:"100%",padding:"9px 12px",borderRadius:9,
            background:"rgba(0,0,0,0.5)",
            border:`1px solid ${Q.plasma}33`,
            color:Q.bright,fontSize:14,fontWeight:700,boxSizing:"border-box"}}/>
        <div style={{display:"flex",gap:4,marginTop:6}}>
          {[25,50,75,100].map(p=>(
            <button key={p} onClick={()=>setAmt((p/100*0.5).toFixed(4))} style={{
              flex:1,padding:"4px",borderRadius:6,border:`1px solid ${Q.plasma}22`,
              background:"rgba(255,255,255,0.04)",color:Q.dim,fontSize:9,cursor:"pointer",
            }}>{p}%</button>
          ))}
        </div>
      </div>

      {/* SL / TP */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div>
          <div style={{fontSize:9,color:Q.tauon,marginBottom:4}}>Stop Loss</div>
          <input value={sl} onChange={e=>setSL(e.target.value)} placeholder="Optional"
            style={{width:"100%",padding:"7px 10px",borderRadius:8,
              background:"rgba(0,0,0,0.4)",border:`1px solid ${Q.tauon}22`,
              color:Q.bright,fontSize:11,boxSizing:"border-box"}}/>
        </div>
        <div>
          <div style={{fontSize:9,color:Q.lepton,marginBottom:4}}>Take Profit</div>
          <input value={tp} onChange={e=>setTP(e.target.value)} placeholder="Optional"
            style={{width:"100%",padding:"7px 10px",borderRadius:8,
              background:"rgba(0,0,0,0.4)",border:`1px solid ${Q.lepton}22`,
              color:Q.bright,fontSize:11,boxSizing:"border-box"}}/>
        </div>
      </div>

      {/* Summary */}
      <div style={{padding:"9px 12px",borderRadius:9,
        background:"rgba(0,0,0,0.35)",border:`1px solid ${Q.plasma}18`}}>
        {[
          {l:"Order Value",    v:`$${total.toFixed(2)}`},
          {l:"Margin Req.",    v:`$${(total/lev).toFixed(2)}`},
          {l:"Est. Fee (0.1%)",v:`$${(total*0.001).toFixed(2)}`},
          {l:"Liquidation",   v:lev>1?`$${(parseFloat(oprice||0)*(1-0.9/lev)).toFixed(0)}`:"—"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",
            fontSize:10,padding:"3px 0",
            borderBottom:i<3?`1px solid rgba(255,255,255,0.04)`:"none"}}>
            <span style={{color:Q.dim}}>{r.l}</span>
            <span style={{color:Q.mid,fontWeight:600}}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button style={{padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
        background:side==="buy"
          ?`linear-gradient(135deg,${Q.lepton}88,#22c55e66)`
          :`linear-gradient(135deg,${Q.tauon}88,#dc262666)`,
        color:Q.bright,fontSize:14,fontWeight:900,letterSpacing:2,
        boxShadow:`0 4px 20px ${side==="buy"?Q.lepton:Q.tauon}33`}}>
        {side==="buy"?`▲ BUY ${pair.split("/")[0]}`:`▼ SELL ${pair.split("/")[0]}`}
      </button>

      {/* AI Signal */}
      <div style={{padding:"9px 11px",borderRadius:10,
        background:`${Q.plasma}0e`,border:`1px solid ${Q.plasma}28`}}>
        <div style={{fontSize:9,fontWeight:800,color:Q.plasma,marginBottom:5,letterSpacing:1}}>
          ⚛️ EMMA AI SIGNAL
        </div>
        {[
          {s:"BTC",  sig:"BUY",  conf:73.2, c:Q.lepton},
          {s:"ETH",  sig:"HOLD", conf:61.8, c:Q.higgs},
          {s:"QEMMA",sig:"BUY",  conf:88.4, c:Q.neutrino},
        ].map((a,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",
            fontSize:10,marginBottom:4}}>
            <span style={{color:Q.dim,fontWeight:700}}>{a.s}</span>
            <span style={{color:a.c,fontWeight:800}}>{a.sig}</span>
            <span style={{color:Q.dim}}>{a.conf}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAIRS SIDEBAR ────────────────────────────────────────────────────────────
function PairsList({ selected, onSelect, tick }) {
  const pairs = [
    {sym:"BTC/USDT",  p:71450+Math.sin(tick*.025)*290,  c:+2.34, color:Q.higgs},
    {sym:"ETH/USDT",  p:3840 +Math.sin(tick*.032)*95,   c:+1.87, color:Q.gluon},
    {sym:"QEMMA/USDT",p:0.6300+Math.sin(tick*.055)*.025,c:+8.42, color:Q.neutrino},
    {sym:"QEMMA/ETH", p:0.000164+Math.sin(tick*.04)*.000004,c:+6.21,color:Q.neutrino},
    {sym:"BNB/USDT",  p:612  +Math.sin(tick*.028)*18,   c:+0.91, color:Q.muon},
    {sym:"SOL/USDT",  p:184  +Math.sin(tick*.041)*9,    c:+3.12, color:"#9945ff"},
    {sym:"MATIC/USDT",p:1.24 +Math.sin(tick*.038)*.04,  c:+5.21, color:Q.plasma},
    {sym:"ARB/USDT",  p:1.84 +Math.sin(tick*.035)*.06,  c:+2.80, color:"#28a0f0"},
    {sym:"OP/USDT",   p:2.84 +Math.sin(tick*.044)*.09,  c:-0.94, color:Q.tauon},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"8px 10px",borderBottom:`1px solid ${Q.plasma}18`,flexShrink:0}}>
        <input placeholder="Search pair..." style={{
          width:"100%",padding:"6px 10px",borderRadius:8,
          background:"rgba(0,0,0,0.4)",border:`1px solid ${Q.plasma}22`,
          color:Q.mid,fontSize:11,boxSizing:"border-box"}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none"}}>
        {pairs.map((p,i)=>(
          <div key={i} onClick={()=>onSelect(p.sym)} style={{
            padding:"9px 12px",cursor:"pointer",
            background:selected===p.sym?`${p.color}14`:"transparent",
            borderLeft:selected===p.sym?`2px solid ${p.color}`:"2px solid transparent",
            borderBottom:`1px solid ${Q.plasma}10`,
            transition:"all 0.15s",
          }}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
              <span style={{fontWeight:700,fontSize:11,
                color:selected===p.sym?p.color:Q.mid}}>{p.sym}</span>
              <span style={{fontSize:11,fontWeight:700,fontFamily:"monospace",color:Q.bright}}>
                {p.p<1?p.p.toFixed(6):p.p.toFixed(2)}
              </span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:9,color:Q.dim}}>Vol: $2.41B</span>
              <span style={{fontSize:9,color:p.c>=0?Q.lepton:Q.tauon,fontWeight:700}}>
                {p.c>=0?"▲":"▼"}{Math.abs(p.c)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function TradingPage() {
  const tick  = useTick(60);
  const [pair,    setPair]    = useState("BTC/USDT");
  const [tf,      setTF]      = useState("4h");
  const [tab,     setTab]     = useState("positions");
  const [bookTab, setBookTab] = useState("book");

  const btcPrice = 71450 + Math.sin(tick*0.025)*290;

  // Generate candles
  const candles = useRef(Array.from({length:80},(_,i)=>{
    const base = 71000+Math.sin(i*.38)*1900;
    const open = base+(Math.random()-.5)*400;
    const close= base+(Math.random()-.5)*400+(Math.random()-.5)*200;
    return {
      o:open, c:close,
      h:Math.max(open,close)+(Math.random()*600),
      l:Math.min(open,close)-(Math.random()*600),
      v:600+Math.random()*1400,
    };
  })).current;

  const tfs = ["1m","5m","15m","1h","4h","1d","1w"];
  const indicators = ["MA","BB","MACD","RSI","VOL","ICHIMOKU"];

  return (
    <div style={{
      height:"100vh", background:Q.void,
      fontFamily:"'Inter',system-ui,sans-serif", color:Q.bright,
      display:"flex", flexDirection:"column", overflow:"hidden",
    }}>
      {/* ── TOP BAR ── */}
      <div style={{
        display:"flex", alignItems:"center", gap:12, padding:"0 14px",
        height:50, flexShrink:0,
        background:`${Q.bg1}f8`, borderBottom:`1px solid ${Q.plasma}22`,
        boxShadow:`0 4px 20px ${Q.void}`,
      }}>
        <div style={{fontWeight:900,fontSize:13,color:Q.neutrino,letterSpacing:1}}>
          ⚛️ QE TERMINAL
        </div>
        <div style={{width:1,height:24,background:`${Q.plasma}33`}}/>
        {/* Pair info */}
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div>
            <div style={{fontSize:18,fontWeight:900,color:Q.photon,fontFamily:"monospace",
              textShadow:`0 0 12px ${Q.photon}88`}}>{btcPrice.toFixed(2)}</div>
            <div style={{fontSize:9,color:Q.lepton}}>▲ +2.34%</div>
          </div>
          {[
            {l:"24h High",v:"$73,120"},
            {l:"24h Low", v:"$69,841"},
            {l:"24h Vol", v:"$2.41B"},
            {l:"Open Int",v:"$8.2B"},
            {l:"Funding",  v:"0.012%"},
          ].map((s,i)=>(
            <div key={i} style={{borderLeft:`1px solid ${Q.plasma}22`,paddingLeft:12}}>
              <div style={{fontSize:8,color:Q.dim,letterSpacing:1}}>{s.l}</div>
              <div style={{fontSize:11,fontWeight:700,color:Q.mid,marginTop:2}}>{s.v}</div>
            </div>
          ))}
        </div>

        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,
            padding:"5px 12px",borderRadius:20,
            background:`${Q.lepton}14`,border:`1px solid ${Q.lepton}33`}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:Q.lepton,
              boxShadow:`0 0 6px ${Q.lepton}`}}/>
            <span style={{fontSize:10,color:Q.lepton,fontWeight:700}}>WS LIVE</span>
          </div>
          <button style={{padding:"6px 14px",borderRadius:8,
            border:`1px solid ${Q.plasma}33`,background:`${Q.plasma}18`,
            color:Q.neutrino,fontSize:10,fontWeight:700,cursor:"pointer"}}>
            Full Screen
          </button>
        </div>
      </div>

      {/* ── INDICATORS BAR ── */}
      <IndicatorsBar price={btcPrice} tick={tick}/>

      {/* ── MAIN LAYOUT ── */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* Pairs list */}
        <div style={{
          width:200, flexShrink:0,
          borderRight:`1px solid ${Q.plasma}18`,
          background:`${Q.bg1}88`,
        }}>
          <PairsList selected={pair} onSelect={setPair} tick={tick}/>
        </div>

        {/* Chart area */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Timeframe + indicators */}
          <div style={{display:"flex",gap:4,padding:"6px 10px",
            borderBottom:`1px solid ${Q.plasma}14`,flexShrink:0,
            background:"rgba(0,0,0,0.2)"}}>
            {tfs.map(t=>(
              <button key={t} onClick={()=>setTF(t)} style={{
                padding:"3px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,
                background:tf===t?`${Q.plasma}28`:"transparent",
                color:tf===t?Q.neutrino:Q.dim,fontWeight:tf===t?800:400,
              }}>{t}</button>
            ))}
            <div style={{width:1,height:20,background:`${Q.plasma}22`,margin:"0 4px"}}/>
            {indicators.map(ind=>(
              <span key={ind} style={{padding:"3px 8px",borderRadius:6,cursor:"pointer",
                background:"rgba(139,92,246,0.08)",color:Q.quark,fontSize:9,fontWeight:700}}>
                {ind}
              </span>
            ))}
            <div style={{marginLeft:"auto",fontSize:9,color:Q.dim,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{color:Q.higgs}}>━ EMA20</span>
              <span style={{color:Q.gluon}}>━ EMA50</span>
            </div>
          </div>

          {/* Chart */}
          <div style={{flex:1,padding:"8px 6px 0",overflow:"hidden"}}>
            <CandleChart candles={candles} height={200}/>
            <div style={{height:1,background:`${Q.plasma}14`,margin:"3px 0"}}/>
            <VolumeBars candles={candles} height={35}/>
            <div style={{height:1,background:`${Q.plasma}14`,margin:"3px 0"}}/>
            <RSIPanel candles={candles} height={32}/>
          </div>

          {/* Emma AI bar */}
          <div style={{
            padding:"7px 14px",flexShrink:0,
            background:`${Q.plasma}0d`,
            borderTop:`1px solid ${Q.plasma}22`,
            display:"flex",gap:12,alignItems:"center",
          }}>
            <span style={{fontSize:16,filter:`drop-shadow(0 0 6px ${Q.plasma})`}}>👁</span>
            <div style={{flex:1}}>
              <div style={{fontSize:9,fontWeight:800,color:Q.plasma,letterSpacing:1}}>
                EMMA AI · ETA-P PREDICTION MODULE
              </div>
              <div style={{fontSize:11,color:Q.mid,marginTop:2}}>
                Bullish Divergenz erkannt. Support: ${(btcPrice-380).toFixed(0)}.
                Target: ${(btcPrice+920).toFixed(0)}. Stop: ${(btcPrice-620).toFixed(0)}.
                Timeframe: 14 Tage.
              </div>
            </div>
            <div style={{textAlign:"center",padding:"6px 14px",borderRadius:9,
              background:`${Q.lepton}14`,border:`1px solid ${Q.lepton}33`}}>
              <div style={{fontSize:16,fontWeight:900,color:Q.lepton}}>73.2%</div>
              <div style={{fontSize:8,color:Q.dim,letterSpacing:1}}>CONFIDENCE</div>
            </div>
          </div>

          {/* Bottom tabs */}
          <div style={{flexShrink:0,borderTop:`1px solid ${Q.plasma}18`,maxHeight:160}}>
            <div style={{display:"flex",borderBottom:`1px solid ${Q.plasma}14`}}>
              {["positions","orders","history","emma"].map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{
                  padding:"6px 14px",border:"none",cursor:"pointer",fontSize:10,
                  background:"transparent",
                  color:tab===t?Q.neutrino:Q.dim,
                  borderBottom:tab===t?`2px solid ${Q.neutrino}`:"2px solid transparent",
                  fontWeight:700,letterSpacing:0.5,textTransform:"uppercase",
                }}>{t}</button>
              ))}
            </div>
            <div style={{maxHeight:120,overflowY:"auto"}}>
              {tab==="positions"&&<PositionTable price={btcPrice}/>}
              {tab==="orders"&&(
                <div style={{padding:"14px",fontSize:11,color:Q.dim,textAlign:"center"}}>
                  No open orders
                </div>
              )}
              {tab==="history"&&<TradeFeed mid={btcPrice} tick={tick}/>}
              {tab==="emma"&&(
                <div style={{padding:"10px 14px",fontSize:11,color:Q.mid,lineHeight:1.7}}>
                  <b style={{color:Q.neutrino}}>⚛️ Emma Oracle:</b> ETA-P Analyse bestätigt bullisches
                  Sentiment. QEMMA/ETH Pool zeigt Akkumulation. Empfehlung: DCA-Strategie bei
                  $0.61–$0.63. Target: $0.84 in 14 Tagen. Confidence: 88.4%.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order book + trades */}
        <div style={{
          width:230, flexShrink:0,
          borderLeft:`1px solid ${Q.plasma}18`,
          background:`${Q.bg1}88`,
          display:"flex",flexDirection:"column",overflow:"hidden",
        }}>
          <div style={{display:"flex",borderBottom:`1px solid ${Q.plasma}18`,flexShrink:0}}>
            {["book","trades"].map(t=>(
              <button key={t} onClick={()=>setBookTab(t)} style={{
                flex:1,padding:"7px",border:"none",cursor:"pointer",fontSize:9,fontWeight:700,
                background:"transparent",letterSpacing:1,
                color:bookTab===t?Q.gluon:Q.dim,
                borderBottom:bookTab===t?`2px solid ${Q.gluon}`:"2px solid transparent",
              }}>{t==="book"?"ORDER BOOK":"TRADES"}</button>
            ))}
          </div>
          <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none"}}>
            {bookTab==="book"
              ? <OrderBook mid={btcPrice} tick={tick}/>
              : <TradeFeed mid={btcPrice} tick={tick}/>
            }
          </div>
        </div>

        {/* Order form */}
        <div style={{
          width:240, flexShrink:0,
          borderLeft:`1px solid ${Q.plasma}18`,
          background:`${Q.bg1}88`,
          overflowY:"auto",scrollbarWidth:"thin",
          scrollbarColor:`${Q.plasma}44 transparent`,
        }}>
          <OrderForm price={btcPrice} pair={pair} tick={tick}/>
        </div>
      </div>
    </div>
  );
}
