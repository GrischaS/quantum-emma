// ============================================================
//  QUANTUM EMMA — Android Trading Screen v4.0
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W } = Dimensions.get('window');
const Q = {
  void:'#000008', bg1:'#06001e',
  plasma:'#7c3aed', neutrino:'#8b5cf6', gluon:'#06b6d4',
  higgs:'#fbbf24', lepton:'#4ade80', muon:'#fb923c',
  tauon:'#f87171', bright:'#f0f4ff', mid:'#94a3b8', dim:'#475569',
};

export default function TradingScreen() {
  const [tick, setTick] = useState(0);
  const [side, setSide] = useState<'buy'|'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [pair, setPair] = useState('BTC/USDT');

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 150);
    return () => clearInterval(id);
  }, []);

  const btc   = (71450 + Math.sin(tick * 0.025) * 290).toFixed(2);
  const eth   = (3840  + Math.sin(tick * 0.032) * 95).toFixed(2);
  const qemma = (0.63  + Math.sin(tick * 0.055) * 0.025).toFixed(4);

  const pairs = [
    { sym: 'BTC/USDT',   p: btc,   d: '+2.34%', c: Q.higgs },
    { sym: 'ETH/USDT',   p: eth,   d: '+1.87%', c: Q.gluon },
    { sym: 'QEMMA/USDT', p: qemma, d: '+8.42%', c: Q.neutrino },
    { sym: 'SOL/USDT',   p: '184', d: '+3.12%', c: '#9945ff' },
  ];

  const asks = Array.from({ length: 6 }, (_, i) => ({
    p: (parseFloat(btc) + (i + 1) * 11).toFixed(2),
    a: (0.04 + Math.random() * 0.8).toFixed(4),
  }));
  const bids = Array.from({ length: 6 }, (_, i) => ({
    p: (parseFloat(btc) - (i + 1) * 11).toFixed(2),
    a: (0.05 + Math.random() * 0.7).toFixed(4),
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#020008', '#0a0020']} style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💹 TRADING TERMINAL</Text>
          <View style={styles.liveChip}>
            <View style={styles.liveDot}/>
            <Text style={styles.liveText}>WS LIVE</Text>
          </View>
        </View>

        {/* Pairs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pairScroll}>
          {pairs.map((p, i) => (
            <TouchableOpacity key={i} onPress={() => setPair(p.sym)}
              style={[styles.pairChip, { borderColor: p.c + '44', backgroundColor: pair === p.sym ? p.c + '22' : p.c + '0a' }]}>
              <Text style={[styles.pairSym, { color: p.c }]}>{p.sym}</Text>
              <Text style={styles.pairPrice}>{p.p}</Text>
              <Text style={[styles.pairChange, { color: Q.lepton }]}>{p.d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Price hero */}
        <LinearGradient colors={['rgba(6,182,212,0.12)', 'transparent']} style={styles.priceHero}>
          <Text style={styles.pairName}>{pair}</Text>
          <Text style={styles.priceMain}>{pair.startsWith('BTC') ? btc : pair.startsWith('ETH') ? eth : qemma}</Text>
          <Text style={[styles.priceChange2, { color: Q.lepton }]}>▲ +2.34% (24h)</Text>
          <View style={styles.statsRow}>
            {[
              { l: '24h High', v: '$73,120' },
              { l: '24h Low',  v: '$69,841' },
              { l: '24h Vol',  v: '$2.41B'  },
            ].map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statLbl}>{s.l}</Text>
                <Text style={styles.statVal}>{s.v}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Emma AI Signal */}
        <View style={styles.aiBox}>
          <Text style={styles.aiIcon}>👁</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>EMMA AI · ETA-P SIGNAL</Text>
            <Text style={styles.aiText}>Bullish divergenz erkannt. Target: $73,200. Conf: 73.2%</Text>
          </View>
          <View style={styles.aiConf}>
            <Text style={styles.aiConfVal}>73.2%</Text>
            <Text style={styles.aiConfLbl}>CONF</Text>
          </View>
        </View>

        {/* Order Book (mini) */}
        <View style={styles.bookSection}>
          <Text style={styles.bookTitle}>📖 ORDER BOOK</Text>
          <View style={styles.bookRow}>
            {/* Asks */}
            <View style={{ flex: 1 }}>
              {asks.slice(0,5).reverse().map((a, i) => (
                <View key={i} style={styles.askRow}>
                  <Text style={styles.askPrice}>{a.p}</Text>
                  <Text style={styles.bookAmt}>{a.a}</Text>
                </View>
              ))}
            </View>
            <View style={styles.bookMid}>
              <Text style={styles.bookMidPrice}>{btc}</Text>
              <Text style={styles.bookSpread}>spread: $11</Text>
            </View>
            {/* Bids */}
            <View style={{ flex: 1 }}>
              {bids.slice(0,5).map((b, i) => (
                <View key={i} style={styles.bidRow}>
                  <Text style={styles.bidPrice}>{b.p}</Text>
                  <Text style={styles.bookAmt}>{b.a}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Order Form */}
        <View style={styles.orderForm}>
          <View style={styles.sideRow}>
            <TouchableOpacity onPress={() => setSide('buy')}
              style={[styles.sideBtn, side === 'buy' && styles.buyActive]}>
              <Text style={[styles.sideBtnText, { color: side === 'buy' ? Q.lepton : Q.dim }]}>▲ BUY</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSide('sell')}
              style={[styles.sideBtn, side === 'sell' && styles.sellActive]}>
              <Text style={[styles.sideBtnText, { color: side === 'sell' ? Q.tauon : Q.dim }]}>▼ SELL</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLbl}>AMOUNT</Text>
          <TextInput value={amount} onChangeText={setAmount} placeholder="0.000"
            placeholderTextColor={Q.dim} keyboardType="numeric"
            style={[styles.input, { borderColor: side === 'buy' ? Q.lepton + '44' : Q.tauon + '44' }]}/>

          <View style={styles.pctRow}>
            {['25%', '50%', '75%', 'MAX'].map((p, i) => (
              <TouchableOpacity key={i} style={styles.pctBtn}>
                <Text style={styles.pctText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.orderBtn, { backgroundColor: side === 'buy' ? Q.lepton + 'cc' : Q.tauon + 'cc' }]}>
            <Text style={styles.orderBtnText}>
              {side === 'buy' ? '▲ BUY BTC' : '▼ SELL BTC'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Grigori Saks — Enterprise v4.0</Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#000008' },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 52 },
  headerTitle:   { fontSize: 18, fontWeight: '900', color: '#06b6d4', letterSpacing: 1 },
  liveChip:      { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: 'rgba(74,222,128,0.12)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)' },
  liveDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ade80' },
  liveText:      { fontSize: 9, fontWeight: '800', color: '#4ade80', letterSpacing: 1 },
  pairScroll:    { paddingHorizontal: 14, marginBottom: 12 },
  pairChip:      { marginRight: 8, padding: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },
  pairSym:       { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  pairPrice:     { fontSize: 13, fontWeight: '900', color: '#f0f4ff', fontFamily: 'monospace', marginTop: 3 },
  pairChange:    { fontSize: 9, fontWeight: '700', marginTop: 2 },
  priceHero:     { margin: 14, padding: 18, borderRadius: 16 },
  pairName:      { fontSize: 11, color: '#94a3b8', letterSpacing: 1, marginBottom: 4 },
  priceMain:     { fontSize: 32, fontWeight: '900', color: '#00ffff', fontFamily: 'monospace' },
  priceChange2:  { fontSize: 13, fontWeight: '700', marginTop: 4, marginBottom: 12 },
  statsRow:      { flexDirection: 'row', gap: 16 },
  statItem:      { flex: 1 },
  statLbl:       { fontSize: 8, color: '#475569', letterSpacing: 1 },
  statVal:       { fontSize: 11, fontWeight: '700', color: '#94a3b8', marginTop: 3 },
  aiBox:         { flexDirection: 'row', alignItems: 'center', gap: 12, margin: 14, padding: 14, borderRadius: 13, backgroundColor: 'rgba(124,58,237,0.12)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)' },
  aiIcon:        { fontSize: 22 },
  aiTitle:       { fontSize: 9, fontWeight: '800', color: '#8b5cf6', letterSpacing: 1 },
  aiText:        { fontSize: 11, color: '#94a3b8', marginTop: 3 },
  aiConf:        { alignItems: 'center', padding: 10, borderRadius: 10, backgroundColor: 'rgba(74,222,128,0.12)' },
  aiConfVal:     { fontSize: 18, fontWeight: '900', color: '#4ade80' },
  aiConfLbl:     { fontSize: 8, color: '#475569', letterSpacing: 1 },
  bookSection:   { margin: 14, padding: 14, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)' },
  bookTitle:     { fontSize: 11, fontWeight: '800', color: '#8b5cf6', letterSpacing: 1, marginBottom: 10 },
  bookRow:       { flexDirection: 'row', gap: 8 },
  askRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  bidRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  askPrice:      { fontSize: 10, fontWeight: '700', color: '#f87171', fontFamily: 'monospace' },
  bidPrice:      { fontSize: 10, fontWeight: '700', color: '#4ade80', fontFamily: 'monospace' },
  bookAmt:       { fontSize: 9, color: '#475569', fontFamily: 'monospace' },
  bookMid:       { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  bookMidPrice:  { fontSize: 13, fontWeight: '900', color: '#00ffff', fontFamily: 'monospace' },
  bookSpread:    { fontSize: 8, color: '#475569', marginTop: 3 },
  orderForm:     { margin: 14, padding: 16, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.25)' },
  sideRow:       { flexDirection: 'row', gap: 8, marginBottom: 14 },
  sideBtn:       { flex: 1, padding: 12, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  buyActive:     { backgroundColor: 'rgba(74,222,128,0.2)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.4)' },
  sellActive:    { backgroundColor: 'rgba(248,113,113,0.2)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.4)' },
  sideBtnText:   { fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  inputLbl:      { fontSize: 9, color: '#475569', letterSpacing: 1, marginBottom: 6 },
  input:         { padding: 12, borderRadius: 10, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.5)', color: '#f0f4ff', fontSize: 18, fontWeight: '900', fontFamily: 'monospace', marginBottom: 10 },
  pctRow:        { flexDirection: 'row', gap: 6, marginBottom: 14 },
  pctBtn:        { flex: 1, padding: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)' },
  pctText:       { fontSize: 10, fontWeight: '700', color: '#94a3b8' },
  orderBtn:      { padding: 16, borderRadius: 13, alignItems: 'center' },
  orderBtnText:  { fontSize: 15, fontWeight: '900', color: '#000', letterSpacing: 2 },
  footer:        { padding: 20, alignItems: 'center' },
  footerText:    { fontSize: 9, color: '#475569' },
});
