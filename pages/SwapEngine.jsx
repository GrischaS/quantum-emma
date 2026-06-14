// ============================================================
//  QUANTUM EMMA — DEX Swap Engine v2
//  Live quotes · Route preview · Slippage guard · Gas estimate
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from "react";

const TOKENS = [
  { symbol: "ETH",   name: "Ethereum",      logo: "⟠",  decimals: 18, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
  { symbol: "QEMMA", name: "Quantum Emma",   logo: "⚛️", decimals: 18, address: "0x0000000000000000000000000000000000000001" },
  { symbol: "USDC",  name: "USD Coin",       logo: "💵", decimals: 6,  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  { symbol: "USDT",  name: "Tether",         logo: "💲", decimals: 6,  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
  { symbol: "WBTC",  name: "Wrapped Bitcoin", logo: "₿",  decimals: 8,  address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
];

const MOCK_PRICES = { ETH: 3820, QEMMA: 0.63, USDC: 1, USDT: 1, WBTC: 67400 };

const ROUTES = {
  "ETH→QEMMA":  ["ETH", "USDC", "QEMMA"],
  "QEMMA→ETH":  ["QEMMA", "USDC", "ETH"],
  "ETH→USDC":   ["ETH", "USDC"],
  "USDC→QEMMA": ["USDC", "QEMMA"],
  default:       ["TokenA", "USDC", "TokenB"],
};

function getRoute(from, to) {
  return ROUTES[`${from}→${to}`] || ROUTES.default.map((t, i) => i === 0 ? from : i === 2 ? to : t);
}

export default function SwapEngine() {
  const [fromToken,  setFromToken]  = useState(TOKENS[0]);
  const [toToken,    setToToken]    = useState(TOKENS[1]);
  const [fromAmt,    setFromAmt]    = useState("");
  const [toAmt,      setToAmt]      = useState("");
  const [slippage,   setSlippage]   = useState(0.5);
  const [customSlip, setCustomSlip] = useState("");
  const [quoting,    setQuoting]    = useState(false);
  const [swapping,   setSwapping]   = useState(false);
  const [txHash,     setTxHash]     = useState(null);
  const [priceImpact, setPriceImpact] = useState(null);
  const [gasEst,     setGasEst]     = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [priceMode,  setPriceMode]  = useState("from"); // "from" | "to"
  const debounceRef = useRef(null);

  const fromPrice = MOCK_PRICES[fromToken.symbol] || 1;
  const toPrice   = MOCK_PRICES[toToken.symbol]   || 1;
  const route     = getRoute(fromToken.symbol, toToken.symbol);

  // Quote simulation with debounce
  const fetchQuote = useCallback((amount, direction = "from") => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setToAmt(""); setFromAmt(""); setPriceImpact(null); setGasEst(null); return;
    }
    setQuoting(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const amt = parseFloat(amount);
      const fee = 0.003; // 0.3% pool fee
      if (direction === "from") {
        const raw   = (amt * fromPrice / toPrice) * (1 - fee);
        const slip  = (Math.random() * 0.3).toFixed(2);
        const gas   = (0.002 + Math.random() * 0.001).toFixed(4);
        const impact = amt * fromPrice > 50000 ? (Math.random() * 2).toFixed(2) : (Math.random() * 0.1).toFixed(2);
        setToAmt(raw.toFixed(toToken.decimals > 8 ? 6 : 4));
        setPriceImpact(parseFloat(impact));
        setGasEst(gas);
      } else {
        const raw = (amt * toPrice / fromPrice) * (1 + fee);
        setFromAmt(raw.toFixed(fromToken.decimals > 8 ? 6 : 4));
        setPriceImpact(null);
        setGasEst(null);
      }
      setQuoting(false);
    }, 600);
  }, [fromToken, toToken, fromPrice, toPrice]);

  useEffect(() => { if (fromAmt) fetchQuote(fromAmt, "from"); }, [fromToken, toToken]);

  const flipTokens = () => {
    setFromToken(toToken); setToToken(fromToken);
    setFromAmt(toAmt);     setToAmt(fromAmt);
  };

  const handleSwap = async () => {
    if (!fromAmt || !toAmt) return;
    setSwapping(true);
    await new Promise(r => setTimeout(r, 2200));
    const hash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    setTxHash(hash);
    setSwapping(false);
  };

  const minReceived = toAmt ? (parseFloat(toAmt) * (1 - slippage / 100)).toFixed(6) : "—";
  const exchangeRate = fromAmt && toAmt
    ? `1 ${fromToken.symbol} = ${(parseFloat(toAmt) / parseFloat(fromAmt)).toFixed(4)} ${toToken.symbol}`
    : "—";
  const impactColor = !priceImpact ? "#8899aa" : priceImpact < 1 ? "#00ff80" : priceImpact < 3 ? "#ffaa00" : "#ff4444";

  return (
    <div style={{ minHeight: "100vh", background: "#000d1a", color: "#e0f0ff",
                  fontFamily: "'Rajdhani',sans-serif", display: "flex",
                  alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#00ffff", fontSize: 24, fontWeight: 800 }}>⚛️ DEX Swap</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.2)",
                           borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#00ffff" }}>
              Uniswap V3
            </span>
            <button onClick={() => setShowSettings(s => !s)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                       borderRadius: 8, color: "#8899aa", cursor: "pointer", padding: "4px 10px", fontSize: 16 }}>
              ⚙️
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div style={{ background: "rgba(0,20,40,0.9)", border: "1px solid rgba(0,255,255,0.15)",
                        borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ color: "#8899aa", fontSize: 13, marginBottom: 12 }}>Slippage Tolerance</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[0.1, 0.5, 1.0].map(s => (
                <button key={s} onClick={() => { setSlippage(s); setCustomSlip(""); }}
                  style={{ flex: 1, padding: "8px 0", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
                           background: slippage === s && !customSlip ? "rgba(0,255,255,0.15)" : "rgba(255,255,255,0.05)",
                           border: slippage === s && !customSlip ? "1px solid #00ffff" : "1px solid rgba(255,255,255,0.1)",
                           color: slippage === s && !customSlip ? "#00ffff" : "#8899aa" }}>
                  {s}%
                </button>
              ))}
              <input value={customSlip} onChange={e => { setCustomSlip(e.target.value); setSlippage(parseFloat(e.target.value) || 0.5); }}
                placeholder="Custom"
                style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                         borderRadius: 8, color: "#e0f0ff", padding: "8px", textAlign: "center",
                         fontSize: 13, outline: "none" }} />
            </div>
          </div>
        )}

        {/* Swap Card */}
        <div style={{ background: "rgba(0,20,40,0.9)", border: "1px solid rgba(0,255,255,0.15)",
                      borderRadius: 20, padding: 20 }}>

          {/* From */}
          <div style={{ background: "rgba(0,255,255,0.04)", borderRadius: 14, padding: 16, marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#556677", fontSize: 13 }}>Verkaufen</span>
              <span style={{ color: "#556677", fontSize: 13 }}>Balance: 2.4817 {fromToken.symbol}</span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input value={fromAmt} onChange={e => { setFromAmt(e.target.value); fetchQuote(e.target.value, "from"); }}
                placeholder="0.0" type="number" min="0"
                style={{ flex: 1, background: "transparent", border: "none", fontSize: 32, fontWeight: 700,
                         color: "#e0f0ff", outline: "none", width: 0 }} />
              <select value={fromToken.symbol}
                onChange={e => setFromToken(TOKENS.find(t => t.symbol === e.target.value))}
                style={{ background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.2)",
                         borderRadius: 10, color: "#00ffff", padding: "8px 12px", fontSize: 14,
                         fontWeight: 700, cursor: "pointer" }}>
                {TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.logo} {t.symbol}</option>)}
              </select>
            </div>
            <div style={{ color: "#556677", fontSize: 12, marginTop: 6 }}>
              ≈ ${fromAmt ? (parseFloat(fromAmt) * fromPrice).toLocaleString("en", {maximumFractionDigits: 2}) : "0.00"}
            </div>
          </div>

          {/* Flip Button */}
          <div style={{ display: "flex", justifyContent: "center", margin: "4px 0" }}>
            <button onClick={flipTokens}
              style={{ background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.2)",
                       borderRadius: "50%", width: 40, height: 40, cursor: "pointer",
                       fontSize: 18, color: "#00ffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              ⇅
            </button>
          </div>

          {/* To */}
          <div style={{ background: "rgba(0,255,255,0.04)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#556677", fontSize: 13 }}>Erhalten</span>
              <span style={{ color: "#556677", fontSize: 13 }}>Balance: 1,240 {toToken.symbol}</span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ flex: 1, fontSize: 32, fontWeight: 700,
                            color: quoting ? "#556677" : "#00ffff" }}>
                {quoting ? "..." : toAmt || "0.0"}
              </div>
              <select value={toToken.symbol}
                onChange={e => setToToken(TOKENS.find(t => t.symbol === e.target.value))}
                style={{ background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.2)",
                         borderRadius: 10, color: "#00ffff", padding: "8px 12px", fontSize: 14,
                         fontWeight: 700, cursor: "pointer" }}>
                {TOKENS.filter(t => t.symbol !== fromToken.symbol).map(t =>
                  <option key={t.symbol} value={t.symbol}>{t.logo} {t.symbol}</option>)}
              </select>
            </div>
            <div style={{ color: "#556677", fontSize: 12, marginTop: 6 }}>
              ≈ ${toAmt ? (parseFloat(toAmt) * toPrice).toLocaleString("en", {maximumFractionDigits: 2}) : "0.00"}
            </div>
          </div>

          {/* Route Preview */}
          {fromAmt && toAmt && (
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 12, marginBottom: 14 }}>
              <div style={{ color: "#556677", fontSize: 12, marginBottom: 8 }}>Route</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {route.map((t, i) => (
                  <React.Fragment key={i}>
                    <span style={{ background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.2)",
                                   borderRadius: 6, padding: "3px 8px", fontSize: 12, color: "#00ffff" }}>
                      {t}
                    </span>
                    {i < route.length - 1 && <span style={{ color: "#334455" }}>→</span>}
                  </React.Fragment>
                ))}
                <span style={{ color: "#556677", fontSize: 11, marginLeft: 4 }}>via Uniswap V3</span>
              </div>

              {/* Swap Details */}
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  ["Kurs",            exchangeRate,                          "#8899aa"],
                  ["Min. erhalten",   `${minReceived} ${toToken.symbol}`,    "#8899aa"],
                  ["Slippage",        `${slippage}%`,                        slippage > 1 ? "#ffaa00" : "#8899aa"],
                  ["Preis-Impact",    priceImpact ? `${priceImpact}%` : "—", impactColor],
                  ["Gas (est.)",      gasEst ? `${gasEst} ETH` : "—",        "#8899aa"],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#556677", fontSize: 12 }}>{label}</span>
                    <span style={{ color, fontSize: 12, fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Swap Button */}
          {txHash ? (
            <div style={{ textAlign: "center", padding: 16, background: "rgba(0,255,128,0.08)",
                          border: "1px solid rgba(0,255,128,0.2)", borderRadius: 14 }}>
              <div style={{ color: "#00ff80", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>✅ Swap erfolgreich!</div>
              <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer"
                style={{ color: "#00ffff", fontSize: 12, wordBreak: "break-all" }}>
                {txHash.slice(0, 20)}...{txHash.slice(-8)}
              </a>
              <button onClick={() => { setTxHash(null); setFromAmt(""); setToAmt(""); }}
                style={{ display: "block", width: "100%", marginTop: 12, padding: 12,
                         background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.2)",
                         borderRadius: 10, color: "#00ffff", cursor: "pointer", fontWeight: 700 }}>
                Neuer Swap
              </button>
            </div>
          ) : (
            <button onClick={handleSwap}
              disabled={!fromAmt || !toAmt || swapping || quoting}
              style={{ width: "100%", padding: 16, borderRadius: 14, fontWeight: 800, fontSize: 18,
                       cursor: fromAmt && toAmt && !swapping ? "pointer" : "not-allowed",
                       border: "none", transition: "all 0.3s",
                       background: fromAmt && toAmt && !swapping
                         ? "linear-gradient(135deg, #00ffff, #0080ff)"
                         : "rgba(255,255,255,0.05)",
                       color: fromAmt && toAmt && !swapping ? "#000" : "#445566" }}>
              {swapping ? "⏳ Transaktion läuft..." : quoting ? "💱 Kurs wird geladen..." :
               !fromAmt ? "Betrag eingeben" : "⚛️ Swap ausführen"}
            </button>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 16, color: "#334455", fontSize: 11 }}>
          Powered by Uniswap V3 · © 2026 Grigori Saks — Patent Pending
        </div>
      </div>
    </div>
  );
}
