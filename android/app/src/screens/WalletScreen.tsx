// ============================================================
//  QUANTUM EMMA — Wallet Screen v2 (Android)
//  Send · Receive · Swap · QR · Multi-Asset · Transaction History
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Animated, Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const ASSETS = [
  { symbol:"QEMMA", name:"Quantum Emma",  icon:"⚛️", balance:15000,   price:0.63,  color:"#00ffff" },
  { symbol:"ETH",   name:"Ethereum",      icon:"⟠",  balance:1.247,   price:3820,  color:"#8080ff" },
  { symbol:"USDC",  name:"USD Coin",      icon:"💵", balance:2400,    price:1.00,  color:"#00ff80" },
  { symbol:"WBTC",  name:"Wrapped BTC",   icon:"₿",  balance:0.018,   price:67400, color:"#ffaa00" },
];

const TX_HISTORY = [
  { id:1, type:"receive", asset:"QEMMA", amount:500,   from:"0xAbc...123", ts:"14 Jun, 09:41", status:"confirmed" },
  { id:2, type:"send",    asset:"ETH",   amount:0.1,   to:"0xDef...456",   ts:"13 Jun, 18:22", status:"confirmed" },
  { id:3, type:"swap",    asset:"USDC",  amount:200,   pair:"ETH→USDC",    ts:"13 Jun, 14:07", status:"confirmed" },
  { id:4, type:"stake",   asset:"QEMMA", amount:1000,  pool:"Meta Codex",  ts:"12 Jun, 11:30", status:"confirmed" },
  { id:5, type:"reward",  asset:"QEMMA", amount:87.4,  from:"Staking",     ts:"11 Jun, 00:00", status:"confirmed" },
];

const C = {
  bg:"#000d1a", card:"#000f22", cyan:"#00ffff",
  green:"#00ff80", red:"#ff4444", gold:"#ffd700",
  dim:"#556677", dimmer:"#334455", border:"rgba(0,255,255,0.12)",
};

const TX_ICON: Record<string, string> = {
  receive:"⬇️", send:"⬆️", swap:"💱", stake:"🏦", reward:"🎁",
};
const TX_COLOR: Record<string, string> = {
  receive: C.green, send: C.red, swap: C.cyan, stake: "#8080ff", reward: C.gold,
};

export default function WalletScreen() {
  const [tab,      setTab]      = useState<"assets"|"send"|"receive"|"history">("assets");
  const [selAsset, setSelAsset] = useState(ASSETS[0]);
  const [sendAmt,  setSendAmt]  = useState("");
  const [sendAddr, setSendAddr] = useState("");
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [prices,   setPrices]   = useState(Object.fromEntries(ASSETS.map(a => [a.symbol, a.price])));
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const totalUSD = ASSETS.reduce((s, a) => s + a.balance * (prices[a.symbol] || a.price), 0);

  // Subtle price animation
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue:1.04, duration:1200, useNativeDriver:true }),
      Animated.timing(pulseAnim, { toValue:1.0,  duration:1200, useNativeDriver:true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setPrices(p => ({
        ...p,
        QEMMA: parseFloat((p.QEMMA + (Math.random()-0.49)*0.003).toFixed(4)),
        ETH:   parseFloat((p.ETH   + (Math.random()-0.49)*5).toFixed(2)),
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const handleSend = async () => {
    if (!sendAmt || !sendAddr) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 2000));
    setSending(false); setSent(true);
    setTimeout(() => { setSent(false); setSendAmt(""); setSendAddr(""); setTab("history"); }, 2500);
  };

  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>💼 Wallet</Text>
        <TouchableOpacity style={s.scanBtn}>
          <Text style={{ color:C.cyan, fontSize:22 }}>⊡</Text>
        </TouchableOpacity>
      </View>

      {/* Total Balance */}
      <View style={s.balanceCard}>
        <Text style={s.balLabel}>Gesamtwert</Text>
        <Animated.Text style={[s.balTotal, { transform:[{ scale:pulseAnim }] }]}>
          ${totalUSD.toLocaleString("en",{ maximumFractionDigits:0 })}
        </Animated.Text>
        <Text style={{ color:C.green, fontSize:14, fontWeight:"700", marginTop:4 }}>▲ +4.1% heute</Text>

        {/* Action Buttons */}
        <View style={s.actionRow}>
          {[
            { label:"Senden",    icon:"⬆️", tab:"send"    },
            { label:"Empfangen", icon:"⬇️", tab:"receive" },
            { label:"Tauschen",  icon:"💱", tab:"assets"  },
            { label:"Verlauf",   icon:"📋", tab:"history" },
          ].map(({ label, icon, tab:t }) => (
            <TouchableOpacity key={label} onPress={() => setTab(t as any)} style={s.actionBtn}>
              <View style={[s.actionIcon, { borderColor: tab===t ? C.cyan : C.dimmer,
                                            backgroundColor: tab===t ? "rgba(0,255,255,0.1)" : "transparent" }]}>
                <Text style={{ fontSize:20 }}>{icon}</Text>
              </View>
              <Text style={{ color: tab===t ? C.cyan : C.dim, fontSize:11, marginTop:6, fontWeight:"700" }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Assets Tab */}
      {tab === "assets" && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Meine Assets</Text>
          {ASSETS.map(a => {
            const livePrice = prices[a.symbol] || a.price;
            const usdVal    = a.balance * livePrice;
            return (
              <TouchableOpacity key={a.symbol} onPress={() => setSelAsset(a)}
                style={[s.assetRow, selAsset.symbol === a.symbol && { borderColor: a.color + "66",
                                                                        backgroundColor: a.color + "0a" }]}>
                <View style={[s.assetIcon, { borderColor: a.color + "44" }]}>
                  <Text style={{ fontSize:22 }}>{a.icon}</Text>
                </View>
                <View style={{ flex:1, marginLeft:12 }}>
                  <Text style={{ color:"#e0f0ff", fontWeight:"800", fontSize:15 }}>{a.symbol}</Text>
                  <Text style={{ color:C.dim, fontSize:12 }}>{a.name}</Text>
                </View>
                <View style={{ alignItems:"flex-end" }}>
                  <Text style={{ color:a.color, fontWeight:"800", fontSize:16 }}>
                    {a.balance.toLocaleString("en",{ maximumFractionDigits:4 })}
                  </Text>
                  <Text style={{ color:C.dim, fontSize:12 }}>
                    ${usdVal.toLocaleString("en",{ maximumFractionDigits:0 })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Send Tab */}
      {tab === "send" && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>⬆️ Senden</Text>
          {sent ? (
            <View style={{ padding:32, alignItems:"center" }}>
              <Text style={{ fontSize:48 }}>✅</Text>
              <Text style={{ color:C.green, fontWeight:"900", fontSize:22, marginTop:12 }}>Gesendet!</Text>
              <Text style={{ color:C.dim, marginTop:8, fontSize:13, textAlign:"center" }}>
                Transaktion wird auf Sepolia bestätigt...
              </Text>
            </View>
          ) : (
            <>
              {/* Asset Selector */}
              <View style={s.card}>
                <Text style={{ color:C.dim, fontSize:12, marginBottom:10 }}>Asset wählen</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection:"row", gap:8 }}>
                    {ASSETS.map(a => (
                      <TouchableOpacity key={a.symbol} onPress={() => setSelAsset(a)}
                        style={[s.assetChip, { borderColor: selAsset.symbol===a.symbol ? a.color : C.dimmer,
                                               backgroundColor: selAsset.symbol===a.symbol ? a.color+"22" : "transparent" }]}>
                        <Text style={{ fontSize:16 }}>{a.icon}</Text>
                        <Text style={{ color: selAsset.symbol===a.symbol ? a.color : C.dim,
                                       fontWeight:"700", fontSize:13, marginLeft:6 }}>{a.symbol}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={s.card}>
                <Text style={{ color:C.dim, fontSize:12, marginBottom:8 }}>Empfänger Adresse</Text>
                <TextInput value={sendAddr} onChangeText={setSendAddr}
                  placeholder="0x..." placeholderTextColor={C.dimmer}
                  style={s.input} />

                <Text style={{ color:C.dim, fontSize:12, marginTop:14, marginBottom:8 }}>
                  Betrag ({selAsset.symbol}) · Verfügbar: {selAsset.balance.toLocaleString("en",{maximumFractionDigits:4})}
                </Text>
                <TextInput value={sendAmt} onChangeText={setSendAmt}
                  placeholder="0.00" keyboardType="numeric" placeholderTextColor={C.dimmer}
                  style={[s.input, { fontSize:24, fontWeight:"800" }]} />

                {sendAmt && (
                  <Text style={{ color:C.dim, fontSize:13, marginTop:8 }}>
                    ≈ ${(parseFloat(sendAmt) * (prices[selAsset.symbol] || selAsset.price)).toFixed(2)} USD
                    · Gas: ~0.002 ETH
                  </Text>
                )}

                <TouchableOpacity onPress={handleSend} disabled={sending || !sendAmt || !sendAddr}
                  style={[s.sendBtn, { backgroundColor: sendAmt && sendAddr && !sending ? C.cyan : C.dimmer }]}>
                  <Text style={{ color:"#000", fontWeight:"900", fontSize:16 }}>
                    {sending ? "⏳ Sende..." : `⬆️ ${selAsset.symbol} senden`}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}

      {/* Receive Tab */}
      {tab === "receive" && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>⬇️ Empfangen</Text>
          <View style={[s.card, { alignItems:"center" }]}>
            {/* QR Placeholder */}
            <View style={{ width:180, height:180, borderRadius:16, marginBottom:20,
                           backgroundColor:"#fff", alignItems:"center", justifyContent:"center",
                           borderWidth:4, borderColor:C.cyan }}>
              <Text style={{ fontSize:11, color:"#000", textAlign:"center", fontWeight:"700", padding:8 }}>
                [QR Code]{"\n"}0xGri...Saks{"\n"}QEMMA Wallet
              </Text>
            </View>
            <Text style={{ color:C.cyan, fontWeight:"800", fontSize:15, marginBottom:6 }}>Deine Adresse</Text>
            <Text style={{ color:C.dim, fontSize:12, fontFamily:"monospace", textAlign:"center",
                           backgroundColor:"rgba(0,255,255,0.06)", padding:12, borderRadius:10,
                           borderWidth:1, borderColor:C.border, lineHeight:20 }}>
              0xGri1212Saks1985{"\n"}QuantumEmmaWallet
            </Text>
            <TouchableOpacity style={{ marginTop:16, padding:12, borderRadius:10,
                                       borderWidth:1, borderColor:C.cyan + "44" }}>
              <Text style={{ color:C.cyan, fontWeight:"700", fontSize:14 }}>📋 Adresse kopieren</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>📋 Transaktionsverlauf</Text>
          {TX_HISTORY.map(tx => (
            <View key={tx.id} style={s.txRow}>
              <View style={[s.txIcon, { borderColor:(TX_COLOR[tx.type]||C.dim)+"44",
                                         backgroundColor:(TX_COLOR[tx.type]||C.dim)+"11" }]}>
                <Text style={{ fontSize:20 }}>{TX_ICON[tx.type]}</Text>
              </View>
              <View style={{ flex:1, marginLeft:12 }}>
                <Text style={{ color:"#e0f0ff", fontWeight:"700", fontSize:14, textTransform:"capitalize" }}>
                  {tx.type === "receive" ? "Empfangen"
                   : tx.type === "send"   ? "Gesendet"
                   : tx.type === "swap"   ? `Getauscht (${tx.pair})`
                   : tx.type === "stake"  ? `Gestakt → ${tx.pool}`
                   : "Staking Reward"}
                </Text>
                <Text style={{ color:C.dim, fontSize:11, marginTop:2 }}>{tx.ts}</Text>
              </View>
              <View style={{ alignItems:"flex-end" }}>
                <Text style={{ color:TX_COLOR[tx.type]||C.dim, fontWeight:"800", fontSize:15 }}>
                  {tx.type==="send" ? "-" : "+"}{tx.amount} {tx.asset}
                </Text>
                <Text style={{ color:C.green, fontSize:10, marginTop:2 }}>✅ {tx.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={{ alignItems:"center", marginBottom:32, marginTop:12 }}>
        <Text style={{ color:C.dimmer, fontSize:10 }}>
          © 2026 Grigori Saks — Quantum Emma Wallet · Patent Pending
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  header:      { flexDirection:"row", justifyContent:"space-between", alignItems:"center",
                 padding:16, paddingTop:52, borderBottomWidth:1, borderColor:C.border },
  title:       { color:C.cyan, fontSize:24, fontWeight:"900" },
  scanBtn:     { padding:8, borderRadius:10, borderWidth:1, borderColor:C.border },
  balanceCard: { padding:24, borderBottomWidth:1, borderColor:C.border, alignItems:"center" },
  balLabel:    { color:C.dim, fontSize:13, marginBottom:8 },
  balTotal:    { color:C.cyan, fontSize:48, fontWeight:"900",
                 textShadowColor:"rgba(0,255,255,0.4)", textShadowOffset:{width:0,height:0}, textShadowRadius:20 },
  actionRow:   { flexDirection:"row", gap:16, marginTop:24 },
  actionBtn:   { alignItems:"center" },
  actionIcon:  { width:54, height:54, borderRadius:27, borderWidth:2,
                 alignItems:"center", justifyContent:"center" },
  section:     { padding:16 },
  sectionTitle:{ color:C.cyan, fontSize:18, fontWeight:"800", marginBottom:14 },
  card:        { backgroundColor:C.card, borderRadius:14, padding:16,
                 borderWidth:1, borderColor:C.border, marginBottom:12 },
  assetRow:    { flexDirection:"row", alignItems:"center", padding:14,
                 backgroundColor:C.card, borderRadius:12, borderWidth:1,
                 borderColor:C.border, marginBottom:8 },
  assetIcon:   { width:46, height:46, borderRadius:23, borderWidth:2,
                 alignItems:"center", justifyContent:"center",
                 backgroundColor:"rgba(0,255,255,0.06)" },
  assetChip:   { flexDirection:"row", alignItems:"center", paddingHorizontal:14,
                 paddingVertical:8, borderRadius:20, borderWidth:2 },
  input:       { backgroundColor:"rgba(255,255,255,0.04)", borderWidth:1,
                 borderColor:C.border, borderRadius:10, color:"#e0f0ff",
                 padding:12, fontSize:16, fontWeight:"700" },
  sendBtn:     { marginTop:18, padding:16, borderRadius:12, alignItems:"center" },
  txRow:       { flexDirection:"row", alignItems:"center", padding:14,
                 backgroundColor:C.card, borderRadius:12, borderWidth:1,
                 borderColor:C.border, marginBottom:8 },
  txIcon:      { width:44, height:44, borderRadius:22, borderWidth:2,
                 alignItems:"center", justifyContent:"center" },
});
