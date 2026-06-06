// ============================================================
//  QUANTUM EMMA — Portfolio Tracker v5.0 MEGA UPGRADE (B5)
//  Live Wallet, P&L Chart, Holdings, Staking Rewards
//  4D/5D Holographic · © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef } from "react";

const Q = {
  void:"#000008", deep:"#02000f", bg0:"#030012", bg1:"#06001e", bg2:"#0a002e",
  plasma:"#7c3aed", neutrino:"#8b5cf6", quark:"#a78bfa", gluon:"#06b6d4",
  photon:"#00ffff", higgs:"#fbbf24", boson:"#f472b6", lepton:"#4ade80",
  muon:"#fb923c", tauon:"#f87171", bright:"#f0f4ff", mid:"#94a3b8", dim:"#475569",
};

function useTick(ms=120){const[t,setT]=useState(0);useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);return t;}
// ─── METAMASK CONNECT HOOK ────────────────────────────────────────────────────
function useWallet() {
  const [account,   setAccount]   = useState(null);
  const [chainId,   setChainId]   = useState(null);
  const [balance,   setBalance]   = useState(null);
  const [connecting,setConnecting]= useState(false);
  const [error,     setError]     = useState(null);

  const connect = async () => {
    if (!window.ethereum) { setError("MetaMask not detected. Install MetaMask to connect."); return; }
    setConnecting(true); setError(null);
    try {
      const accounts = await window.ethereum.request({ method:"eth_requestAccounts" });
      const chain    = await window.ethereum.request({ method:"eth_chainId" });
      const bal      = await window.ethereum.request({ method:"eth_getBalance", params:[accounts[0],"latest"] });
      setAccount(accounts[0]);
      setChainId(parseInt(chain,16));
      setBalance((parseInt(bal,16)/1e18).toFixed(4));
    } catch(e) { setError(e.message||"Connection failed"); }
    setConnecting(false);
  };

  const disconnect = () => { setAccount(null); setBalance(null); setChainId(null); };

  const shortAddr = account ? account.slice(0,6)+"..."+account.slice(-4) : null;
  const networkName = chainId===1?"Ethereum":chainId===11155111?"Sepolia Testnet":chainId===137?"Polygon":chainId?"Chain #"+chainId:null;
  const isMainnet = chainId===1;
  const isSepolia = chainId===11155111;

  useEffect(()=>{
    if(!window.ethereum) return;
    const handleAcc = (accs) => { if(accs.length===0) disconnect(); else setAccount(accs[0]); };
    const handleChain = (c) => setChainId(parseInt(c,16));
    window.ethereum.on("accountsChanged", handleAcc);
    window.ethereum.on("chainChanged", handleChain);
    return()=>{ window.ethereum.removeListener("accountsChanged",handleAcc); window.ethereum.removeListener("chainChanged",handleChain); };
  },[]);

  return { account, shortAddr, chainId, networkName, balance, connecting, error, connect, disconnect, isMainnet, isSepolia };
}



// ─── P&L SPARKLINE ────────────────────────────────────────────────────────────
function PnLChart({ data, color, height=80 }) {
  const min = Math.min(...data), max = Math.max(...data), range = max-min||1;
  const W = 100/(data.length-1);
  const pts = data.map((v,i)=>`${i*W},${height-((v-min)/range)*height}`).join(" ");
  const area = `${pts} ${(data.length-1)*W},${height} 0,${height}`;
  const isUp = data[data.length-1] >= data[0];
  const c = isUp ? Q.lepton : Q.tauon;
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{width:"100%",height,display:"block"}}>
      <defs>
        <linearGradient id="pnlg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={c} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#pnlg)"/>
      <polyline points={pts} fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx={(data.length-1)*W} cy={height-((data[data.length-1]-min)/range)*height} r="2.5" fill={c}/>
    </svg>
  );
}

// ─── PORTFOLIO DONUT ──────────────────────────────────────────────────────────
function DonutChart({ assets, size=160 }) {
  const total = assets.reduce((s,a)=>s+a.value, 0);
  let angle = -90;
  const slices = assets.map(a => {
    const pct = a.value/total;
    const deg = pct*360;
    const start = angle;
    angle += deg;
    return {...a, pct, deg, start};
  });
  const arc = (cx,cy,r,startAngle,endAngle) => {
    const s = startAngle*Math.PI/180, e = endAngle*Math.PI/180;
    const x1=cx+r*Math.cos(s), y1=cy+r*Math.sin(s);
    const x2=cx+r*Math.cos(e), y2=cy+r*Math.sin(e);
    const large = endAngle-startAngle>180?1:0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const cx=size/2, cy=size/2, R=size*0.42, ri=size*0.27;
  return (
    <svg width={size} height={size}>
      {slices.map((s,i)=>(
        <path key={i} d={arc(cx,cy,R,s.start,s.start+s.deg-0.5)}
          fill="none" stroke={s.color} strokeWidth={R-ri}
          style={{filter:`drop-shadow(0 0 4px ${s.color}66)`}}/>
      ))}
      <text x={cx} y={cy-8} textAnchor="middle" fill={Q.bright} fontSize="13" fontWeight="800">
        ${(total/1000).toFixed(1)}K
      </text>
      <text x={cx} y={cy+10} textAnchor="middle" fill={Q.dim} fontSize="9">Portfolio</text>
    </svg>
  );
}

// ─── TOKEN ROW ────────────────────────────────────────────────────────────────
function TokenRow({ asset, tick }) {
  const pulse = 0.5+Math.sin(tick*0.07+asset.id)*0.3;
  const isUp = asset.change >= 0;
  return (
    <div style={{display:"grid",gridTemplateColumns:"32px 1fr 80px 80px 100px 80px",
      gap:8,alignItems:"center",padding:"10px 12px",borderRadius:10,
      background:`${asset.color}08`,border:`1px solid ${asset.color}${Math.round((0.1+pulse*0.08)*255).toString(16).padStart(2,"0")}`,
      transition:"all .3s"}}>
      <div style={{width:32,height:32,borderRadius:"50%",background:asset.color,
        display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:Q.void,
        boxShadow:`0 0 ${6+pulse*6}px ${asset.color}88`}}>
        {asset.symbol[0]}
      </div>
      <div>
        <div style={{fontWeight:700,fontSize:13,color:Q.bright}}>{asset.symbol}</div>
        <div style={{fontSize:10,color:Q.dim}}>{asset.name}</div>
      </div>
      <div style={{textAlign:"right"}}>
        <div style={{fontSize:12,color:Q.bright,fontFamily:"monospace"}}>${asset.price.toFixed(asset.price>10?2:4)}</div>
        <div style={{fontSize:10,color:isUp?Q.lepton:Q.tauon}}>{isUp?"+":""}{asset.change.toFixed(2)}%</div>
      </div>
      <div style={{textAlign:"right",fontSize:12,color:Q.mid,fontFamily:"monospace"}}>
        {asset.balance.toLocaleString()}
      </div>
      <div style={{textAlign:"right"}}>
        <div style={{fontSize:12,fontWeight:700,color:Q.bright,fontFamily:"monospace"}}>${asset.value.toLocaleString(undefined,{maximumFractionDigits:2})}</div>
        <div style={{fontSize:10,color:isUp?Q.lepton:Q.tauon}}>{isUp?"+":"-"}${Math.abs(asset.pnl).toFixed(2)}</div>
      </div>
      <div style={{height:40}}>
        <PnLChart data={asset.spark} height={40}/>
      </div>
    </div>
  );
}


// ─── WALLET CONNECT PANEL ────────────────────────────────────────────────────
function WalletConnectPanel({ wallet, tick }) {
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;
  if (wallet.account) {
    return (
      <div style={{background:Q.bg1,borderRadius:16,padding:"16px 20px",
        border:`1px solid ${Q.lepton}${Math.round((0.15+pulse*0.1)*255).toString(16).padStart(2,"0")}`,
        boxShadow:`0 0 ${10+pulse*8}px ${Q.lepton}18`,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:Q.lepton,
              boxShadow:`0 0 ${6+pulse*4}px ${Q.lepton}`}}/>
            <div>
              <div style={{fontWeight:800,color:Q.lepton,fontSize:13}}>Wallet Connected</div>
              <div style={{fontFamily:"monospace",fontSize:11,color:Q.mid}}>{wallet.shortAddr}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:Q.dim}}>Network</div>
              <div style={{fontSize:12,fontWeight:700,color:wallet.isMainnet?Q.lepton:wallet.isSepolia?Q.higgs:Q.muon}}>
                {wallet.networkName}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:Q.dim}}>ETH Balance</div>
              <div style={{fontSize:12,fontWeight:700,color:Q.gluon}}>{wallet.balance} ETH</div>
            </div>
            <button onClick={wallet.disconnect} style={{
              padding:"6px 12px",borderRadius:8,border:`1px solid ${Q.tauon}44`,
              background:`${Q.tauon}15`,color:Q.tauon,cursor:"pointer",fontSize:11,fontWeight:700}}>
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{background:Q.bg1,borderRadius:16,padding:"16px 20px",
      border:`1px solid ${Q.plasma}${Math.round((0.12+pulse*0.1)*255).toString(16).padStart(2,"0")}`,
      marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
      <div>
        <div style={{fontWeight:800,color:Q.quark,fontSize:13}}>🔗 Connect Wallet</div>
        <div style={{color:Q.dim,fontSize:11,marginTop:2}}>Connect MetaMask to see live balances</div>
        {wallet.error && <div style={{color:Q.tauon,fontSize:11,marginTop:4}}>⚠️ {wallet.error}</div>}
      </div>
      <button onClick={wallet.connect} disabled={wallet.connecting} style={{
        padding:"10px 24px",borderRadius:10,border:`1px solid ${Q.plasma}66`,cursor:"pointer",
        background:`linear-gradient(135deg,${Q.plasma},${Q.gluon})`,
        color:Q.bright,fontWeight:800,fontSize:13,
        boxShadow:`0 0 ${12+pulse*8}px ${Q.plasma}44`,opacity:wallet.connecting?0.7:1}}>
        {wallet.connecting?"🔄 Connecting...":"Connect MetaMask"}
      </button>
    </div>
  );
}

// ─── MAIN PORTFOLIO ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const tick = useTick(120);
  const wallet = useWallet();
  const [tab, setTab] = useState("overview");
  const [walletConnected, setWalletConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Generate sparkline data
  const spark = (base, n=20) => Array.from({length:n},(_,i)=>base*(0.95+Math.random()*0.1+i*0.001));

  const [assets, setAssets] = useState([
    {id:0, symbol:"QEMMA", name:"Quantum Emma",   price:0.6300, change:2.47,  balance:50000,   value:31500,  pnl:756,   color:Q.neutrino, spark:spark(0.63)},
    {id:1, symbol:"ETH",   name:"Ethereum",        price:3241.5, change:1.12,  balance:3.24,    value:10502,  pnl:115,   color:Q.gluon,    spark:spark(3241)},
    {id:2, symbol:"BTC",   name:"Bitcoin",          price:67820,  change:-0.34, balance:0.082,   value:5561,   pnl:-18,   color:Q.higgs,    spark:spark(67820)},
    {id:3, symbol:"USDT",  name:"Tether",           price:1.00,   change:0.01,  balance:4200,    value:4200,   pnl:0,     color:Q.lepton,   spark:Array.from({length:20},()=>1)},
  ]);

  // Simulate live price updates
  useEffect(()=>{
    if(tick%5!==0) return;
    setAssets(prev=>prev.map(a=>{
      if(a.symbol==="USDT") return a;
      const drift=(Math.random()-0.495)*0.004;
      const newPrice=a.price*(1+drift);
      const newValue=a.balance*newPrice;
      const newSpark=[...a.spark.slice(1), newPrice];
      return {...a,price:newPrice,value:newValue,spark:newSpark,change:a.change+(Math.random()-0.5)*0.08};
    }));
  },[tick]);

  const totalValue = assets.reduce((s,a)=>s+a.value,0);
  const totalPnl   = assets.reduce((s,a)=>s+a.pnl,0);
  const pnlPct     = (totalPnl/totalValue*100).toFixed(2);
  const pulse = 0.5+Math.sin(tick*0.05)*0.3;

  // P&L history (simulated 30-day)
  const pnlHistory = Array.from({length:30},(_,i)=>
    51200 + Math.sin(i*0.4)*3000 + i*200 + Math.random()*1000
  );
  pnlHistory.push(totalValue);

  const connectWallet = () => {
    setConnecting(true);
    setTimeout(()=>{ setConnecting(false); setWalletConnected(true); }, 1800);
  };

  // Staking rewards
  const stakingRewards = [
    {pool:"QEMMA Quantum Tier", apy:"60%", staked:25000, earned:1240.5, color:Q.plasma},
    {pool:"QEMMA Gold Tier",    apy:"36%", staked:10000, earned:312.8,  color:Q.higgs},
    {pool:"QEMMA Silver Tier",  apy:"24%", staked:5000,  earned:98.2,   color:Q.mid},
  ];

  // Tx history
  const txHistory = [
    {type:"Swap",    from:"ETH → QEMMA",  amount:"+15,820 QEMMA",  usd:"$9,968", time:"2h ago",   color:Q.lepton,  icon:"⚡"},
    {type:"Stake",   from:"QEMMA Stake",   amount:"-25,000 QEMMA",  usd:"$15,750",time:"1d ago",   color:Q.neutrino,icon:"🔒"},
    {type:"Receive", from:"Mining Reward", amount:"+420 QEMMA",     usd:"$265",   time:"2d ago",   color:Q.lepton,  icon:"⛏"},
    {type:"Send",    from:"→ 0x7f3a...",   amount:"-500 USDT",      usd:"$500",   time:"3d ago",   color:Q.tauon,   icon:"↗"},
    {type:"Buy",     from:"ETH Purchase",  amount:"+1.5 ETH",       usd:"$4,862", time:"5d ago",   color:Q.gluon,   icon:"💎"},
  ];

  return (
    <div style={{minHeight:"100vh",background:Q.void,color:Q.bright,fontFamily:"'Inter',sans-serif",paddingBottom:40}}>

      {/* ── HEADER ── */}
      <div style={{background:Q.deep,borderBottom:`1px solid ${Q.plasma}33`,padding:"16px 24px",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontWeight:900,fontSize:20,color:Q.quark}}>💼 Portfolio Tracker</div>
          <div style={{color:Q.dim,fontSize:12}}>Real-time holdings · P&L · Staking · Transactions</div>
        </div>
        {walletConnected ? (
          <div style={{display:"flex",alignItems:"center",gap:8,background:`${Q.lepton}15`,
            border:`1px solid ${Q.lepton}44`,borderRadius:10,padding:"6px 14px"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:Q.lepton,
              boxShadow:`0 0 ${6+pulse*4}px ${Q.lepton}`}}/>
            <span style={{color:Q.lepton,fontSize:12,fontFamily:"monospace"}}>0x7f3a...k9Qm</span>
          </div>
        ) : (
          <button onClick={connectWallet} disabled={connecting} style={{
            padding:"8px 20px",borderRadius:10,border:`1px solid ${Q.plasma}66`,
            background:`linear-gradient(135deg,${Q.plasma},${Q.gluon})`,color:Q.bright,
            fontWeight:700,cursor:"pointer",fontSize:13,
            boxShadow:`0 0 16px ${Q.plasma}55`}}>
            {connecting?"⏳ Connecting...":"🔗 Connect Wallet"}
          </button>
        )}
      </div>

      <div style={{maxWidth:1300,margin:"0 auto",padding:"20px 16px"}}>

        {/* ── STATS ROW ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
          {[
            {label:"Total Portfolio",value:`$${totalValue.toLocaleString(undefined,{maximumFractionDigits:0})}`,
             sub:"All assets",color:Q.plasma},
            {label:"24h P&L",value:`${totalPnl>=0?"+":"-"}$${Math.abs(totalPnl).toFixed(2)}`,
             sub:`${pnlPct}%`,color:totalPnl>=0?Q.lepton:Q.tauon},
            {label:"Staking Rewards",value:"+$1,651.50",sub:"This month",color:Q.higgs},
            {label:"QEMMA Holdings",value:"50,000",sub:"$31,500 · 61.5%",color:Q.neutrino},
          ].map((s,i)=>(
            <div key={i} style={{background:Q.bg1,borderRadius:14,padding:"16px 18px",
              border:`1px solid ${s.color}${Math.round((0.1+pulse*0.1)*255).toString(16).padStart(2,"0")}`,
              boxShadow:`0 0 ${10+pulse*8}px ${s.color}0a`}}>
              <div style={{fontSize:11,color:Q.dim,marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.value}</div>
              <div style={{fontSize:10,color:Q.dim,marginTop:2}}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{display:"flex",gap:4,background:Q.bg1,borderRadius:10,padding:4,
          border:`1px solid ${Q.plasma}22`,marginBottom:16,width:"fit-content"}}>
          {[["overview","📊 Overview"],["staking","🔒 Staking"],["history","📋 History"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:"7px 18px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
              background:tab===t?`linear-gradient(135deg,${Q.plasma},${Q.gluon})`:"transparent",
              color:tab===t?Q.bright:Q.dim,boxShadow:tab===t?`0 0 10px ${Q.plasma}44`:"none"}}>
              {l}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab==="overview" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:16}}>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {/* P&L Chart */}
              <div style={{background:Q.bg1,borderRadius:14,padding:"16px",border:`1px solid ${Q.plasma}22`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{color:Q.quark,fontWeight:700}}>📈 Portfolio Performance (30D)</span>
                  <span style={{color:Q.lepton,fontSize:12,fontWeight:700}}>+18.4%</span>
                </div>
                <PnLChart data={pnlHistory} height={120}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:Q.dim,marginTop:6}}>
                  <span>30 days ago</span><span>Today</span>
                </div>
              </div>

              {/* Holdings */}
              <div style={{background:Q.bg1,borderRadius:14,padding:"16px",border:`1px solid ${Q.plasma}22`}}>
                <div style={{display:"grid",gridTemplateColumns:"32px 1fr 80px 80px 100px 80px",
                  gap:8,padding:"0 12px 8px",color:Q.dim,fontSize:10,borderBottom:`1px solid ${Q.plasma}11`}}>
                  <span/><span>Asset</span><span style={{textAlign:"right"}}>Price</span>
                  <span style={{textAlign:"right"}}>Balance</span><span style={{textAlign:"right"}}>Value / P&L</span>
                  <span style={{textAlign:"right"}}>7D Chart</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>
                  {assets.map(a=><TokenRow key={a.id} asset={a} tick={tick}/>)}
                </div>
              </div>
            </div>

            {/* Donut sidebar */}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:Q.bg1,borderRadius:14,padding:"16px",border:`1px solid ${Q.plasma}22`,textAlign:"center"}}>
                <div style={{color:Q.quark,fontWeight:700,marginBottom:12}}>🥧 Allocation</div>
                <div style={{display:"flex",justifyContent:"center"}}>
                  <DonutChart assets={assets.map(a=>({...a,color:a.color}))} size={160}/>
                </div>
                <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}>
                  {assets.map(a=>(
                    <div key={a.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:a.color,boxShadow:`0 0 4px ${a.color}`}}/>
                        <span style={{color:Q.mid}}>{a.symbol}</span>
                      </div>
                      <span style={{color:Q.bright,fontWeight:700}}>
                        {(a.value/totalValue*100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{background:Q.bg1,borderRadius:14,padding:"14px",border:`1px solid ${Q.plasma}22`}}>
                <div style={{color:Q.quark,fontWeight:700,fontSize:12,marginBottom:10}}>⚡ Quick Actions</div>
                {[
                  {label:"Swap Tokens",   icon:"🔄",color:Q.gluon},
                  {label:"Stake QEMMA",   icon:"🔒",color:Q.plasma},
                  {label:"Receive",       icon:"📥",color:Q.lepton},
                  {label:"Send",          icon:"📤",color:Q.higgs},
                ].map((a,i)=>(
                  <button key={i} style={{width:"100%",marginBottom:6,padding:"8px 12px",borderRadius:8,
                    border:`1px solid ${a.color}33`,background:`${a.color}10`,color:a.color,
                    cursor:"pointer",fontWeight:600,fontSize:12,textAlign:"left",display:"flex",gap:8,alignItems:"center"}}>
                    <span>{a.icon}</span><span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAKING TAB */}
        {tab==="staking" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:4}}>
              {[
                {label:"Total Staked",value:"$25,200",color:Q.plasma},
                {label:"Total Earned",value:"$1,651.50",color:Q.lepton},
                {label:"Avg APY",color:Q.higgs,value:"48.2%"},
              ].map((s,i)=>(
                <div key={i} style={{background:Q.bg1,borderRadius:12,padding:"14px 16px",
                  border:`1px solid ${s.color}33`,textAlign:"center"}}>
                  <div style={{fontSize:10,color:Q.dim,marginBottom:4}}>{s.label}</div>
                  <div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.value}</div>
                </div>
              ))}
            </div>
            {stakingRewards.map((pool,i)=>{
              const p=0.5+Math.sin(tick*0.07+i)*0.3;
              return (
                <div key={i} style={{background:Q.bg1,borderRadius:14,padding:"18px 20px",
                  border:`1px solid ${pool.color}${Math.round((0.15+p*0.1)*255).toString(16).padStart(2,"0")}`,
                  boxShadow:`0 0 ${10+p*10}px ${pool.color}0a`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div>
                      <div style={{fontWeight:700,color:Q.bright}}>{pool.pool}</div>
                      <div style={{fontSize:11,color:Q.dim,marginTop:2}}>Locked · Auto-compound</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:22,fontWeight:900,color:pool.color}}>{pool.apy}</div>
                      <div style={{fontSize:10,color:Q.dim}}>APY</div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                    <div style={{textAlign:"center",padding:"8px",background:`${pool.color}10`,borderRadius:8}}>
                      <div style={{fontSize:10,color:Q.dim}}>Staked</div>
                      <div style={{fontWeight:700,color:Q.bright}}>{pool.staked.toLocaleString()} QEMMA</div>
                    </div>
                    <div style={{textAlign:"center",padding:"8px",background:`${Q.lepton}10`,borderRadius:8}}>
                      <div style={{fontSize:10,color:Q.dim}}>Earned</div>
                      <div style={{fontWeight:700,color:Q.lepton}}>+{pool.earned} QEMMA</div>
                    </div>
                    <button style={{padding:"8px",borderRadius:8,border:`1px solid ${pool.color}44`,
                      background:`${pool.color}20`,color:pool.color,cursor:"pointer",fontWeight:700,fontSize:12}}>
                      Claim Rewards
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* HISTORY TAB */}
        {tab==="history" && (
          <div style={{background:Q.bg1,borderRadius:14,padding:"16px",border:`1px solid ${Q.plasma}22`}}>
            <div style={{color:Q.quark,fontWeight:700,marginBottom:12}}>📋 Transaction History</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {txHistory.map((tx,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                  borderRadius:10,background:`${tx.color}08`,border:`1px solid ${tx.color}22`}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:`${tx.color}20`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
                    {tx.icon}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:Q.bright}}>{tx.type}</div>
                    <div style={{fontSize:11,color:Q.dim}}>{tx.from}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:700,fontSize:13,color:tx.color}}>{tx.amount}</div>
                    <div style={{fontSize:11,color:Q.dim}}>{tx.usd}</div>
                  </div>
                  <div style={{fontSize:10,color:Q.dim,minWidth:45,textAlign:"right"}}>{tx.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
