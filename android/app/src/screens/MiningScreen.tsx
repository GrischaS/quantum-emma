// ============================================================
//  QUANTUM EMMA — Android Mining Terminal v5.0
//  4 Pools · Live HashRate · Block Explorer · Calculator
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: W } = Dimensions.get('window');
const Q = {
  void:'#000008', bg1:'#06001e', bg2:'#0a002e',
  plasma:'#7c3aed', neutrino:'#8b5cf6', quark:'#a78bfa', gluon:'#06b6d4',
  photon:'#00ffff', higgs:'#fbbf24', boson:'#f472b6', lepton:'#4ade80',
  muon:'#fb923c', tauon:'#f87171', bright:'#f0f4ff', mid:'#94a3b8', dim:'#475569',
};

const POOLS = [
  { name:'Quantum Pool',  color:Q.plasma, reward:'0.48/block', hash:'842 GH/s', fee:'1.0%', diff:'Hard',    daily:12.4 },
  { name:'Plasma Pool',   color:Q.gluon,  reward:'0.24/block', hash:'421 GH/s', fee:'0.8%', diff:'Medium',  daily:6.2  },
  { name:'Neutrino Pool', color:Q.higgs,  reward:'0.12/block', hash:'210 GH/s', fee:'0.5%', diff:'Easy',    daily:3.1  },
  { name:'Genesis Pool',  color:Q.lepton, reward:'0.06/block', hash:'105 GH/s', fee:'0.2%', diff:'Beginner',daily:1.5  },
];

export default function MiningScreen() {
  const [mining, setMining]     = useState(false);
  const [hashRate, setHashRate] = useState(142.6);
  const [blockN, setBlockN]     = useState(18420);
  const [earned, setEarned]     = useState(420.0);
  const [tab, setTab]           = useState<'pools'|'explorer'|'rewards'>('pools');
  const halvingPct = ((blockN % 210000) / 210000 * 100).toFixed(1);

  useEffect(() => {
    if (!mining) return;
    const id = setInterval(() => {
      setHashRate(h => parseFloat((h + (Math.random() - 0.48) * 1.5).toFixed(1)));
      if (Math.random() > 0.8) { setBlockN(b => b + 1); setEarned(e => parseFloat((e + 0.24).toFixed(2))); }
    }, 600);
    return () => clearInterval(id);
  }, [mining]);

  const blocks = Array.from({ length: 6 }, (_, i) => ({
    n: blockN - i, reward: (0.48 - i * 0.002).toFixed(3),
    txs: Math.floor(Math.random() * 18 + 4),
    time: i === 0 ? 'now' : `${i * 12}s ago`,
  }));

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Q.void} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.header}>
          <Text style={s.headerTitle}>⛏ Mining Terminal v5.0</Text>
          <View style={s.statsGrid}>
            {[
              { l:'Hash Rate', v:`${hashRate} GH/s`, c:Q.plasma, anim:mining },
              { l:'Block #',   v:`#${blockN.toLocaleString()}`, c:Q.gluon,  anim:false },
              { l:'Earned',    v:`${earned} QEMMA`,  c:Q.lepton, anim:mining },
              { l:'Diff',      v:'14.2 TH',           c:Q.higgs,  anim:false },
            ].map((st, i) => (
              <View key={i} style={[s.statCard, { borderColor: st.c + (st.anim && mining ? '66' : '22') }]}>
                <Text style={[s.statVal, { color: st.c }]}>{st.v}</Text>
                <Text style={s.statLabel}>{st.l}</Text>
                {st.anim && mining && <View style={[s.dot, { backgroundColor: Q.lepton }]} />}
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={() => setMining(m => !m)}
            style={[s.mineBtn, { backgroundColor: mining ? Q.tauon : Q.lepton }]}>
            <Text style={s.mineBtnText}>{mining ? '⏹ Stop Mining' : '⛏ Start Mining'}</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* HALVING BAR */}
        <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.halvingCard}>
          <View style={s.halvingHeader}>
            <Text style={s.halvingTitle}>⏰ Halving Progress</Text>
            <Text style={s.halvingPct}>{halvingPct}%</Text>
          </View>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${halvingPct}%` as any }]} />
          </View>
          <Text style={s.halvingInfo}>{(210000 - blockN % 210000).toLocaleString()} blocks remaining</Text>
        </LinearGradient>

        {/* TABS */}
        <View style={s.tabRow}>
          {(['pools','explorer','rewards'] as const).map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)}
              style={[s.tabBtn, tab === t && s.tabActive]}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>
                {t === 'pools' ? '⛏ Pools' : t === 'explorer' ? '🔍 Explorer' : '💰 Rewards'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* POOLS */}
        {tab === 'pools' && (
          <View style={s.section}>
            {POOLS.map((p, i) => (
              <LinearGradient key={i} colors={[p.color + '18', p.color + '08']} style={s.poolCard}>
                <View style={s.poolHeader}>
                  <Text style={[s.poolName, { color: p.color }]}>{p.name}</Text>
                  <View style={[s.diffBadge, { borderColor: p.color + '55', backgroundColor: p.color + '20' }]}>
                    <Text style={[s.diffText, { color: p.color }]}>{p.diff}</Text>
                  </View>
                </View>
                <View style={s.poolStats}>
                  {[['Reward',p.reward],['Hash',p.hash],['Fee',p.fee],['Daily',`${p.daily} QEMMA`]].map(([l,v]) => (
                    <View key={l} style={s.poolStat}>
                      <Text style={s.poolStatLabel}>{l}</Text>
                      <Text style={[s.poolStatVal, { color: l === 'Daily' ? Q.lepton : Q.bright }]}>{v}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={[s.joinBtn, { borderColor: p.color + '44', backgroundColor: p.color + '20' }]}>
                  <Text style={[s.joinBtnText, { color: p.color }]}>⛏ Join {p.name}</Text>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>
        )}

        {/* EXPLORER */}
        {tab === 'explorer' && (
          <LinearGradient colors={[Q.bg1, Q.bg2]} style={[s.card, {marginBottom:32}]}>
            <Text style={s.cardTitle}>🔍 Recent Blocks</Text>
            {blocks.map((b, i) => (
              <View key={i} style={[s.blockRow, i === 0 && s.blockRowNew]}>
                <Text style={s.blockNum}>#{b.n.toLocaleString()}</Text>
                <Text style={s.blockReward}>{b.reward} QEMMA</Text>
                <Text style={s.blockTxs}>{b.txs} txs</Text>
                <Text style={s.blockTime}>{b.time}</Text>
              </View>
            ))}
          </LinearGradient>
        )}

        {/* REWARDS */}
        {tab === 'rewards' && (
          <LinearGradient colors={[Q.bg1, Q.bg2]} style={[s.card, {marginBottom:32}]}>
            <Text style={s.cardTitle}>💰 Earnings Summary</Text>
            {[
              { p:'Today',     v:'12.4 QEMMA', usd:'$7.81',  c:Q.lepton  },
              { p:'This Week', v:'86.8 QEMMA', usd:'$54.68', c:Q.gluon   },
              { p:'Month',     v:'372 QEMMA',  usd:'$234',   c:Q.plasma  },
              { p:'All Time',  v:'4,200 QEMMA',usd:'$2,646', c:Q.higgs   },
            ].map((r, i) => (
              <View key={i} style={s.rewardRow}>
                <Text style={s.rewardLabel}>{r.p}</Text>
                <View style={{alignItems:'flex-end'}}>
                  <Text style={[s.rewardVal, {color:r.c}]}>{r.v}</Text>
                  <Text style={s.rewardUsd}>{r.usd}</Text>
                </View>
              </View>
            ))}
            <View style={[s.profitBox, {borderColor:Q.lepton+'44'}]}>
              <Text style={{color:Q.dim,fontSize:11}}>Daily Profit (after power)</Text>
              <Text style={{color:Q.lepton,fontSize:20,fontWeight:'900'}}>$7.46 / day</Text>
              <Text style={{color:Q.dim,fontSize:10,marginTop:2}}>Break-even: ~42 days</Text>
            </View>
          </LinearGradient>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex:1, backgroundColor:Q.void },
  scroll:        { flex:1 },
  header:        { padding:16, margin:12, borderRadius:14, borderWidth:1, borderColor:Q.plasma+'22' },
  headerTitle:   { fontSize:15, fontWeight:'900', color:Q.quark, marginBottom:12, textAlign:'center' },
  statsGrid:     { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:12 },
  statCard:      { width:(W-60)/2, padding:10, borderRadius:10, borderWidth:1,
                   backgroundColor:Q.bg2, position:'relative' },
  statVal:       { fontSize:13, fontWeight:'900' },
  statLabel:     { fontSize:9, color:Q.dim, marginTop:2 },
  dot:           { position:'absolute', top:8, right:8, width:6, height:6, borderRadius:3 },
  mineBtn:       { padding:14, borderRadius:12, alignItems:'center' },
  mineBtnText:   { fontSize:14, fontWeight:'900', color:Q.void },
  halvingCard:   { marginHorizontal:12, marginBottom:10, borderRadius:14, padding:14,
                   borderWidth:1, borderColor:Q.higgs+'33' },
  halvingHeader: { flexDirection:'row', justifyContent:'space-between', marginBottom:8 },
  halvingTitle:  { fontSize:12, fontWeight:'700', color:Q.higgs },
  halvingPct:    { fontSize:12, fontWeight:'700', color:Q.higgs },
  progressBg:    { height:8, backgroundColor:Q.higgs+'20', borderRadius:4, overflow:'hidden', marginBottom:6 },
  progressFill:  { height:8, backgroundColor:Q.higgs, borderRadius:4 },
  halvingInfo:   { fontSize:10, color:Q.dim },
  tabRow:        { flexDirection:'row', marginHorizontal:12, marginBottom:10,
                   backgroundColor:Q.bg1, borderRadius:10, padding:4, borderWidth:1, borderColor:Q.plasma+'22' },
  tabBtn:        { flex:1, padding:8, borderRadius:8, alignItems:'center' },
  tabActive:     { backgroundColor:Q.plasma },
  tabText:       { fontSize:10, fontWeight:'700', color:Q.dim },
  tabTextActive: { color:Q.bright },
  section:       { paddingHorizontal:12, marginBottom:32 },
  poolCard:      { borderRadius:14, padding:14, marginBottom:10, borderWidth:1, borderColor:Q.plasma+'22' },
  poolHeader:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  poolName:      { fontSize:14, fontWeight:'800' },
  diffBadge:     { borderRadius:20, paddingHorizontal:8, paddingVertical:2, borderWidth:1 },
  diffText:      { fontSize:10, fontWeight:'700' },
  poolStats:     { flexDirection:'row', gap:6, marginBottom:10 },
  poolStat:      { flex:1, backgroundColor:Q.bg2, borderRadius:8, padding:6, alignItems:'center' },
  poolStatLabel: { fontSize:9, color:Q.dim, marginBottom:2 },
  poolStatVal:   { fontSize:11, fontWeight:'700' },
  joinBtn:       { padding:10, borderRadius:10, borderWidth:1, alignItems:'center' },
  joinBtnText:   { fontSize:12, fontWeight:'700' },
  card:          { marginHorizontal:12, borderRadius:16, padding:16, borderWidth:1, borderColor:Q.plasma+'22' },
  cardTitle:     { fontSize:13, fontWeight:'800', color:Q.quark, marginBottom:12 },
  blockRow:      { flexDirection:'row', alignItems:'center', paddingVertical:8,
                   borderBottomWidth:1, borderBottomColor:Q.plasma+'11', gap:8 },
  blockRowNew:   { backgroundColor:Q.lepton+'08', borderRadius:6, paddingHorizontal:4 },
  blockNum:      { color:Q.gluon, fontWeight:'700', fontSize:11, width:70 },
  blockReward:   { color:Q.lepton, fontSize:11, flex:1 },
  blockTxs:      { color:Q.mid, fontSize:10, width:40 },
  blockTime:     { color:Q.dim, fontSize:10, width:45, textAlign:'right' },
  rewardRow:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                   paddingVertical:10, borderBottomWidth:1, borderBottomColor:Q.plasma+'11' },
  rewardLabel:   { fontSize:13, color:Q.dim },
  rewardVal:     { fontSize:13, fontWeight:'700' },
  rewardUsd:     { fontSize:10, color:Q.dim, marginTop:2 },
  profitBox:     { marginTop:12, padding:14, borderRadius:12, borderWidth:1,
                   backgroundColor:Q.lepton+'0a', alignItems:'center' },
});
