// ============================================================
//  QUANTUM EMMA — Trading Screen v2 (Android)
//  Live Charts · Order Book · AI Signals · One-Tap Trade
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Animated, TextInput,
} from "react-native";

const { width } = Dimensions.get("window");

const PAIRS    = ["QEMMA/USDC", "ETH/USDC", "BTC/USDT"];
const INTERVALS = ["1m", "5m", "15m", "1h", "4h"];

const MOCK_ASKS = [
  { price: 0.6380, qty: 12400 },
  { price: 0.6375, qty: 8900  },
  { price: 0.6370, qty: 15600 },
  { price: 0.6368, qty: 4200  },
  { price: 0.6365, qty: 9800  },
];
const MOCK_BIDS = [
  { price: 0.6355, qty: 18700 },
  { price: 0.6350, qty: 11200 },
  { price: 0.6344, qty: 6500  },
  { price: 0.6340, qty: 22100 },
  { price: 0.6335, qty: 8300  },
];

function generateCandles(n = 30) {
  let price = 0.60;
  return Array.from({ length: n }, (_, i) => {
    const open  = price;
    const close = price + (Math.random() - 0.48) * 0.02;
    const high  = Math.max(open, close) + Math.random() * 0.005;
    const low   = Math.min(open, close) - Math.random() * 0.005;
    price = close;
    return { open, close, high, low, ts: Date.now() - (n - i) * 60000 };
  });
}

const C = {
  bg:       "#000d1a",
  card:     "#000f22",
  border:   "rgba(0,255,255,0.12)",
  cyan:     "#00ffff",
  green:    "#00ff80",
  red:      "#ff4444",
  gold:     "#ffaa00",
  dim:      "#556677",
  dimmer:   "#334455",
};

export default function TradingScreen() {
  const [pair,       setPair]       = useState(PAIRS[0]);
  const [interval,   setInterval_]  = useState("5m");
  const [candles,    setCandles]    = useState(generateCandles(30));
  const [price,      setPrice]      = useState(0.6358);
  const [change,     setChange]     = useState(+2.41);
  const [tab,        setTab]        = useState<"chart"|"book"|"trades">("chart");
  const [side,       setSide]       = useState<"buy"|"sell">("buy");
  const [amount,     setAmount]     = useState("");
  const [orderType,  setOrderType]  = useState<"market"|"limit">("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [signal,     setSignal]     = useState({ action: "BUY", conf: 89, agents: 12 });
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for live price
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0,  duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Simulate live price ticks
  useEffect(() => {
    const iv = setInterval(() => {
      setPrice(p => parseFloat((p + (Math.random() - 0.49) * 0.002).toFixed(4)));
      setChange(c => parseFloat((c + (Math.random() - 0.5) * 0.05).toFixed(2)));
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  // Candle minimap renderer
  const candleW = (width - 80) / candles.length;
  const prices  = candles.flatMap(c => [c.high, c.low]);
  const minP    = Math.min(...prices);
  const maxP    = Math.max(...prices);
  const toY     = (p: number) => ((maxP - p) / (maxP - minP)) * 80;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pairLabel}>{pair}</Text>
          <Text style={styles.pairSub}>Quantum Emma DEX</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {PAIRS.map(p => (
              <TouchableOpacity key={p} onPress={() => setPair(p)}
                style={[styles.pairBtn, pair === p && styles.pairBtnActive]}>
                <Text style={{ color: pair === p ? C.cyan : C.dim, fontSize: 11, fontWeight: "700" }}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Live Price */}
      <View style={styles.priceCard}>
        <Animated.Text style={[styles.price, { transform: [{ scale: pulseAnim }] }]}>
          ${price.toFixed(4)}
        </Animated.Text>
        <View style={{ flexDirection: "row", gap: 16, marginTop: 6 }}>
          <Text style={{ color: change >= 0 ? C.green : C.red, fontWeight: "700", fontSize: 16 }}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
          </Text>
          <Text style={{ color: C.dim, fontSize: 13, marginTop: 2 }}>24h</Text>
          <Text style={{ color: C.dim, fontSize: 13, marginTop: 2 }}>Vol: 2.4M USDC</Text>
        </View>
      </View>

      {/* AI Signal Banner */}
      <TouchableOpacity style={[styles.signalBanner,
        { borderColor: signal.action === "BUY" ? C.green + "55" : C.red + "55",
          backgroundColor: signal.action === "BUY" ? "rgba(0,255,128,0.08)" : "rgba(255,68,68,0.08)" }]}>
        <Text style={{ fontSize: 18 }}>⚛️</Text>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ color: signal.action === "BUY" ? C.green : C.red, fontWeight: "800", fontSize: 15 }}>
            AI Signal: {signal.action}
          </Text>
          <Text style={{ color: C.dim, fontSize: 11 }}>
            {signal.agents}/12 Agenten · {signal.conf}% Konfidenz · Meta Genius TR2
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: signal.action === "BUY" ? C.green : C.red, fontSize: 20, fontWeight: "900" }}>
            {signal.conf}%
          </Text>
        </View>
      </TouchableOpacity>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(["chart", "book", "trades"] as const).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
            <Text style={{ color: tab === t ? C.cyan : C.dim, fontWeight: "700", fontSize: 13 }}>
              {t === "chart" ? "📈 Chart" : t === "book" ? "📋 Orderbuch" : "⚡ Trades"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Tab */}
      {tab === "chart" && (
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {INTERVALS.map(i => (
              <TouchableOpacity key={i} onPress={() => setInterval_(i)}
                style={[styles.intervalBtn, interval === i && styles.intervalBtnActive]}>
                <Text style={{ color: interval === i ? C.cyan : C.dim, fontSize: 11, fontWeight: "700" }}>{i}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Candle MiniChart */}
          <View style={{ height: 100, flexDirection: "row", alignItems: "flex-end",
                         borderBottomWidth: 1, borderColor: C.dimmer, paddingBottom: 4 }}>
            {candles.map((c, i) => {
              const isGreen = c.close >= c.open;
              const bodyH   = Math.max(2, Math.abs(toY(c.open) - toY(c.close)));
              const bodyY   = Math.min(toY(c.open), toY(c.close));
              return (
                <View key={i} style={{ width: candleW, alignItems: "center", position: "relative" }}>
                  {/* Wick */}
                  <View style={{ position: "absolute", top: toY(c.high), width: 1,
                                 height: toY(c.low) - toY(c.high),
                                 backgroundColor: isGreen ? C.green : C.red, left: candleW / 2 - 0.5 }} />
                  {/* Body */}
                  <View style={{ position: "absolute", top: bodyY, width: Math.max(candleW - 2, 1),
                                 height: bodyH, borderRadius: 1,
                                 backgroundColor: isGreen ? C.green : C.red }} />
                </View>
              );
            })}
          </View>
          <Text style={{ color: C.dimmer, fontSize: 10, marginTop: 6, textAlign: "center" }}>
            {interval} Candlestick Chart · Live
          </Text>
        </View>
      )}

      {/* Order Book Tab */}
      {tab === "book" && (
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.green, fontWeight: "700", marginBottom: 8, fontSize: 13 }}>Bids (Kaufen)</Text>
              {MOCK_BIDS.map((b, i) => (
                <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ color: C.green, fontSize: 12 }}>${b.price.toFixed(4)}</Text>
                  <Text style={{ color: C.dim,   fontSize: 12 }}>{b.qty.toLocaleString()}</Text>
                </View>
              ))}
            </View>
            <View style={{ width: 1, backgroundColor: C.dimmer }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.red, fontWeight: "700", marginBottom: 8, fontSize: 13 }}>Asks (Verkaufen)</Text>
              {MOCK_ASKS.map((a, i) => (
                <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ color: C.red,  fontSize: 12 }}>${a.price.toFixed(4)}</Text>
                  <Text style={{ color: C.dim,  fontSize: 12 }}>{a.qty.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <Text style={{ color: C.cyan, fontSize: 16, fontWeight: "800" }}>Spread: $0.0025 (0.04%)</Text>
          </View>
        </View>
      )}

      {/* Order Form */}
      <View style={styles.card}>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <TouchableOpacity onPress={() => setSide("buy")}
            style={[styles.sideBtn, { borderColor: side === "buy" ? C.green : C.dimmer,
                                      backgroundColor: side === "buy" ? "rgba(0,255,128,0.12)" : "transparent" }]}>
            <Text style={{ color: side === "buy" ? C.green : C.dim, fontWeight: "800", fontSize: 15 }}>Kaufen</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSide("sell")}
            style={[styles.sideBtn, { borderColor: side === "sell" ? C.red : C.dimmer,
                                      backgroundColor: side === "sell" ? "rgba(255,68,68,0.12)" : "transparent" }]}>
            <Text style={{ color: side === "sell" ? C.red : C.dim, fontWeight: "800", fontSize: 15 }}>Verkaufen</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
          {(["market","limit"] as const).map(o => (
            <TouchableOpacity key={o} onPress={() => setOrderType(o)}
              style={[styles.orderTypeBtn, orderType === o && styles.orderTypeBtnActive]}>
              <Text style={{ color: orderType === o ? C.cyan : C.dim, fontSize: 12, fontWeight: "700" }}>
                {o === "market" ? "Market" : "Limit"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {orderType === "limit" && (
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Limit Preis (USDC)</Text>
            <TextInput value={limitPrice} onChangeText={setLimitPrice} placeholder="0.0000"
              keyboardType="numeric" placeholderTextColor={C.dimmer}
              style={styles.input} />
          </View>
        )}

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Menge (QEMMA)</Text>
          <TextInput value={amount} onChangeText={setAmount} placeholder="0.00"
            keyboardType="numeric" placeholderTextColor={C.dimmer}
            style={styles.input} />
        </View>

        {amount && (
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}>
            <Text style={{ color: C.dim, fontSize: 12 }}>Gesamt (USDC)</Text>
            <Text style={{ color: C.cyan, fontSize: 12, fontWeight: "700" }}>
              ${(parseFloat(amount) * price).toFixed(2) || "0.00"}
            </Text>
          </View>
        )}

        <TouchableOpacity style={[styles.executeBtn,
          { backgroundColor: side === "buy" ? C.green : C.red }]}>
          <Text style={{ color: "#000", fontWeight: "900", fontSize: 16 }}>
            {side === "buy" ? "⚡ Kaufen" : "⚡ Verkaufen"} · {pair.split("/")[0]}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "center", marginBottom: 32, marginTop: 8 }}>
        <Text style={{ color: C.dimmer, fontSize: 10 }}>
          © 2026 Grigori Saks — Quantum Emma · Patent Pending
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                      padding: 16, paddingTop: 52, borderBottomWidth: 1, borderColor: C.border },
  pairLabel:        { color: C.cyan, fontSize: 20, fontWeight: "900" },
  pairSub:          { color: C.dim, fontSize: 11, marginTop: 2 },
  pairBtn:          { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
                      borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  pairBtnActive:    { borderColor: C.cyan, backgroundColor: "rgba(0,255,255,0.08)" },
  priceCard:        { padding: 20, borderBottomWidth: 1, borderColor: C.border },
  price:            { color: C.cyan, fontSize: 42, fontWeight: "900",
                      textShadowColor: "rgba(0,255,255,0.4)", textShadowOffset: {width:0,height:0}, textShadowRadius: 20 },
  signalBanner:     { margin: 12, borderRadius: 14, padding: 14, flexDirection: "row",
                      alignItems: "center", borderWidth: 1 },
  tabBar:           { flexDirection: "row", marginHorizontal: 12, marginBottom: 4,
                      borderRadius: 12, overflow: "hidden",
                      borderWidth: 1, borderColor: C.border },
  tabBtn:           { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabBtnActive:     { backgroundColor: "rgba(0,255,255,0.08)",
                      borderBottomWidth: 2, borderColor: C.cyan },
  intervalBtn:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
                      borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  intervalBtnActive:{ borderColor: C.cyan, backgroundColor: "rgba(0,255,255,0.1)" },
  card:             { margin: 12, padding: 16, backgroundColor: C.card,
                      borderRadius: 14, borderWidth: 1, borderColor: C.border },
  sideBtn:          { flex: 1, padding: 12, borderRadius: 10, borderWidth: 2, alignItems: "center" },
  orderTypeBtn:     { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8,
                      borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  orderTypeBtnActive: { borderColor: C.cyan, backgroundColor: "rgba(0,255,255,0.1)" },
  inputRow:         { marginBottom: 12 },
  inputLabel:       { color: C.dim, fontSize: 12, marginBottom: 6 },
  input:            { backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1,
                      borderColor: C.border, borderRadius: 10, color: "#e0f0ff",
                      padding: 12, fontSize: 16, fontWeight: "700" },
  executeBtn:       { padding: 16, borderRadius: 12, alignItems: "center" },
});
