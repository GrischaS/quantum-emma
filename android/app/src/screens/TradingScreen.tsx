// ============================================================
//  QUANTUM EMMA — Android Trading Terminal v5.0
//  Live Candles · DEX Swap · Order Form · AI Signal
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Rect, Line, Polyline, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';

const { width: W } = Dimensions.get('window');
const Q = {
  void:'#000008', bg1:'#06001e', bg2:'#0a002e',
  plasma:'#7c3aed', neutrino:'#8b5cf6', quark:'#a78bfa', gluon:'#06b6d4',
  photon:'#00ffff', higgs:'#fbbf24', boson:'#f472b6', lepton:'#4ade80',
  muon:'#fb923c', tauon:'#f87171', bright:'#f0f4ff', mid:'#94a3b8', dim:'#475569',
};

function useLiveCandles(base: number, count = 30) {
  const [candles, setCandles] = useState(() => {
    let p = base;
    return Array.from({ length: count }, () => {
      const o = p, c = o * (1 + (Math.random() - 0.49) * 0.025);
      const h = Math.max(o, c) * (1 + Math.random() * 0.01);
      const l = Math.min(o, c) * (1 - Math.random() * 0.01);
      p = c; return { o, c, h, l };
    });
  });
  useEffect(() => {
    const id = setInterval(() => {
      setCandles(prev => {
        const last = prev[prev.length - 1];
        const c = last.c * (1 + (Math.random() - 0.49) * 0.018);
        const h = Math.max(last.c, c) * (1 + Math.random() * 0.008);
        const l = Math.min(last.c, c) * (1 - Math.random() * 0.008);
        return [...prev.slice(1), { o: last.c, c, h, l }];
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return candles;
}

function CandleChart({ candles, width, height = 160 }: any) {
  const prices = candles.flatMap((c: any) => [c.h, c.l]);
  const min = Math.min(...prices), max = Math.max(...prices);
  const range = max - min || 0.001;
  const toY = (p: number) => height - ((p - min) / range) * height;
  const cw = width / candles.length;
  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgGrad id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={Q.lepton} stopOpacity="0.2" />
          <Stop offset="100%" stopColor={Q.lepton} stopOpacity="0" />
        </SvgGrad>
      </Defs>
      {candles.map((c: any, i: number) => {
        const isUp = c.c >= c.o;
        const color = isUp ? Q.lepton : Q.tauon;
        const bodyTop = toY(Math.max(c.o, c.c));
        const bodyH = Math.max(1, Math.abs(toY(c.o) - toY(c.c)));
        return (
          <React.Fragment key={i}>
            <Line x1={i * cw + cw / 2} y1={toY(c.h)} x2={i * cw + cw / 2} y2={toY(c.l)}
              stroke={color} strokeWidth="1" opacity={0.7} />
            <Rect x={i * cw + 1} y={bodyTop} width={cw - 2} height={bodyH}
              fill={isUp ? color + 'cc' : color} rx={1} />
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

export default function TradingScreen() {
  const [tick, setTick] = useState(0);
  const [pair, setPair] = useState('QEMMA');
  const [side, setSide] = useState<'buy'|'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit'|'market'>('limit');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [activeTab, setActiveTab] = useState<'chart'|'swap'>('chart');

  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 500); return () => clearInterval(id); }, []);

  const pairs = [
    { sym: 'QEMMA', base: 0.63, color: Q.neutrino },
    { sym: 'ETH',   base: 3241, color: Q.gluon },
    { sym: 'BTC',   base: 67820,color: Q.higgs },
  ];
  const activePair = pairs.find(p => p.sym === pair) || pairs[0];
  const candles = useLiveCandles(activePair.base, 30);
  const curPrice = candles[candles.length - 1]?.c || activePair.base;
  const change = ((curPrice - activePair.base) / activePair.base * 100).toFixed(2);
  const isUp = parseFloat(change) >= 0;

  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('QEMMA');
  const [swapAmt, setSwapAmt] = useState('');
  const [swapped, setSwapped] = useState(false);
  const toAmt = swapAmt ? (parseFloat(swapAmt) * 3241 / 0.63).toFixed(2) : '';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Q.void} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* PAIR SELECTOR */}
        <View style={s.pairRow}>
          {pairs.map(p => (
            <TouchableOpacity key={p.sym} onPress={() => setPair(p.sym)}
              style={[s.pairBtn, pair === p.sym && { borderColor: p.color + '88', backgroundColor: p.color + '25' }]}>
              <Text style={[s.pairText, { color: pair === p.sym ? p.color : Q.dim }]}>{p.sym}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PRICE HEADER */}
        <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.priceHeader}>
          <Text style={[s.currentPrice, { color: isUp ? Q.lepton : Q.tauon }]}>
            ${curPrice.toFixed(activePair.base < 10 ? 4 : 2)}
          </Text>
          <Text style={[s.changeText, { color: isUp ? Q.lepton : Q.tauon }]}>
            {isUp ? '▲' : '▼'} {change}%
          </Text>
        </LinearGradient>

        {/* TAB SWITCHER */}
        <View style={s.tabRow}>
          {(['chart', 'swap'] as const).map(t => (
            <TouchableOpacity key={t} onPress={() => setActiveTab(t)}
              style={[s.tabBtn, activeTab === t && s.tabBtnActive]}>
              <Text style={[s.tabText, activeTab === t && s.tabTextActive]}>
                {t === 'chart' ? '📊 Chart' : '⚡ Swap'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CHART TAB */}
        {activeTab === 'chart' && (
          <>
            <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.chartCard}>
              <CandleChart candles={candles} width={W - 48} height={160} />
            </LinearGradient>

            {/* ORDER FORM */}
            <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.card}>
              <View style={s.sideRow}>
                <TouchableOpacity onPress={() => setSide('buy')}
                  style={[s.sideBtn, side === 'buy' && s.sideBtnBuy]}>
                  <Text style={[s.sideText, side === 'buy' && { color: Q.void }]}>▲ BUY</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSide('sell')}
                  style={[s.sideBtn, side === 'sell' && s.sideBtnSell]}>
                  <Text style={[s.sideText, side === 'sell' && { color: Q.void }]}>▼ SELL</Text>
                </TouchableOpacity>
              </View>

              <View style={s.typeRow}>
                {(['limit','market'] as const).map(t => (
                  <TouchableOpacity key={t} onPress={() => setOrderType(t)}
                    style={[s.typeBtn, orderType === t && s.typeBtnActive]}>
                    <Text style={[s.typeText, orderType === t && { color: Q.quark }]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {orderType === 'limit' && (
                <TextInput placeholder={`Price: $${curPrice.toFixed(4)}`} placeholderTextColor={Q.dim}
                  value={limitPrice} onChangeText={setLimitPrice} keyboardType="numeric"
                  style={s.input} />
              )}
              <TextInput placeholder="Amount (QEMMA)" placeholderTextColor={Q.dim}
                value={amount} onChangeText={setAmount} keyboardType="numeric" style={s.input} />

              <View style={s.pctRow}>
                {['25%','50%','75%','100%'].map(p => (
                  <TouchableOpacity key={p} style={s.pctBtn}>
                    <Text style={s.pctText}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={[s.orderBtn, { backgroundColor: side === 'buy' ? Q.lepton : Q.tauon }]}>
                <Text style={s.orderBtnText}>{side === 'buy' ? '▲ PLACE BUY ORDER' : '▼ PLACE SELL ORDER'}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        )}

        {/* SWAP TAB */}
        {activeTab === 'swap' && (
          <LinearGradient colors={[Q.bg1, Q.bg2]} style={[s.card, { marginBottom: 32 }]}>
            <Text style={s.cardTitle}>⚡ DEX Swap</Text>
            <View style={s.swapBox}>
              <Text style={s.swapLabel}>From: {fromToken}</Text>
              <TextInput placeholder="0.0" placeholderTextColor={Q.dim} value={swapAmt}
                onChangeText={setSwapAmt} keyboardType="numeric" style={s.input} />
            </View>
            <TouchableOpacity style={s.flipBtn}
              onPress={() => { setFromToken(toToken); setToToken(fromToken); setSwapAmt(''); }}>
              <Text style={{ color: Q.quark, fontSize: 22 }}>⇅</Text>
            </TouchableOpacity>
            <View style={s.swapBox}>
              <Text style={s.swapLabel}>To: {toToken}</Text>
              <Text style={s.swapResult}>{toAmt || '0.0'}</Text>
            </View>
            {swapAmt ? (
              <View style={s.swapInfo}>
                <Text style={s.swapInfoText}>Rate: 1 {fromToken} ≈ {(3241/0.63).toFixed(0)} {toToken}</Text>
                <Text style={s.swapInfoText}>Price Impact: 0.12%  |  Slippage: 0.5%</Text>
              </View>
            ) : null}
            <TouchableOpacity onPress={() => { setSwapped(true); setSwapAmt(''); setTimeout(() => setSwapped(false), 3000); }}
              style={[s.swapBtn, { opacity: swapAmt ? 1 : 0.4 }]}>
              <Text style={s.swapBtnText}>{swapped ? '✅ Swapped!' : `⚡ Swap ${fromToken} → ${toToken}`}</Text>
            </TouchableOpacity>

            {/* Mini signal */}
            <View style={s.signalBox}>
              <Text style={{ color: Q.lepton, fontWeight: '800', fontSize: 12 }}>🤖 AI: STRONG BUY · 94% · ALPHA-7</Text>
              <Text style={{ color: Q.dim, fontSize: 10, marginTop: 4 }}>Target: $1.20 (+90%) · HQMLL Phase 2</Text>
            </View>
          </LinearGradient>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex:1, backgroundColor:Q.void },
  scroll:       { flex:1 },
  pairRow:      { flexDirection:'row', padding:10, gap:8 },
  pairBtn:      { flex:1, padding:8, borderRadius:8, borderWidth:1, borderColor:Q.plasma+'33',
                  alignItems:'center' },
  pairText:     { fontSize:12, fontWeight:'700' },
  priceHeader:  { marginHorizontal:12, borderRadius:12, padding:14, borderWidth:1,
                  borderColor:Q.plasma+'22', flexDirection:'row', alignItems:'center',
                  justifyContent:'space-between', marginBottom:10 },
  currentPrice: { fontSize:26, fontWeight:'900' },
  changeText:   { fontSize:14, fontWeight:'700' },
  tabRow:       { flexDirection:'row', marginHorizontal:12, marginBottom:10,
                  backgroundColor:Q.bg1, borderRadius:10, padding:4,
                  borderWidth:1, borderColor:Q.plasma+'22' },
  tabBtn:       { flex:1, padding:8, borderRadius:8, alignItems:'center' },
  tabBtnActive: { backgroundColor:Q.plasma },
  tabText:      { fontSize:12, fontWeight:'700', color:Q.dim },
  tabTextActive:{ color:Q.bright },
  chartCard:    { marginHorizontal:12, borderRadius:14, padding:14, borderWidth:1,
                  borderColor:Q.plasma+'22', marginBottom:10 },
  card:         { marginHorizontal:12, marginBottom:12, borderRadius:16, padding:16,
                  borderWidth:1, borderColor:Q.plasma+'22' },
  cardTitle:    { fontSize:13, fontWeight:'800', color:Q.quark, marginBottom:12 },
  sideRow:      { flexDirection:'row', gap:8, marginBottom:12 },
  sideBtn:      { flex:1, padding:12, borderRadius:10, borderWidth:1,
                  borderColor:Q.plasma+'44', alignItems:'center' },
  sideBtnBuy:   { backgroundColor:Q.lepton, borderColor:Q.lepton },
  sideBtnSell:  { backgroundColor:Q.tauon, borderColor:Q.tauon },
  sideText:     { fontSize:13, fontWeight:'800', color:Q.mid },
  typeRow:      { flexDirection:'row', gap:6, marginBottom:12 },
  typeBtn:      { flex:1, padding:6, borderRadius:8, borderWidth:1,
                  borderColor:Q.plasma+'33', alignItems:'center' },
  typeBtnActive:{ borderColor:Q.quark, backgroundColor:Q.plasma+'30' },
  typeText:     { fontSize:11, fontWeight:'700', color:Q.dim, textTransform:'capitalize' },
  input:        { backgroundColor:Q.bg2, borderWidth:1, borderColor:Q.plasma+'44',
                  borderRadius:10, padding:12, color:Q.bright, fontSize:14,
                  fontFamily:'monospace', marginBottom:10 },
  pctRow:       { flexDirection:'row', gap:6, marginBottom:12 },
  pctBtn:       { flex:1, padding:6, borderRadius:8, borderWidth:1,
                  borderColor:Q.plasma+'33', alignItems:'center' },
  pctText:      { fontSize:10, color:Q.dim },
  orderBtn:     { padding:14, borderRadius:12, alignItems:'center' },
  orderBtnText: { fontSize:14, fontWeight:'900', color:Q.void },
  swapBox:      { backgroundColor:Q.bg2, borderRadius:12, padding:12,
                  borderWidth:1, borderColor:Q.plasma+'33', marginBottom:8 },
  swapLabel:    { fontSize:11, color:Q.dim, marginBottom:4 },
  swapResult:   { fontSize:22, fontWeight:'700', color:Q.bright, fontFamily:'monospace' },
  flipBtn:      { alignSelf:'center', backgroundColor:Q.plasma+'30', borderRadius:24,
                  width:44, height:44, alignItems:'center', justifyContent:'center',
                  borderWidth:1, borderColor:Q.plasma+'66', marginBottom:8 },
  swapInfo:     { backgroundColor:Q.bg2, borderRadius:8, padding:10, marginBottom:12 },
  swapInfoText: { fontSize:10, color:Q.dim, marginBottom:2 },
  swapBtn:      { padding:14, borderRadius:12, alignItems:'center',
                  backgroundColor:Q.plasma },
  swapBtnText:  { fontSize:13, fontWeight:'900', color:Q.bright },
  signalBox:    { marginTop:12, padding:12, backgroundColor:Q.lepton+'12',
                  borderRadius:10, borderWidth:1, borderColor:Q.lepton+'33' },
});
