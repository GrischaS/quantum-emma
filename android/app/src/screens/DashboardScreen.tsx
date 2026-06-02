// ============================================================
//  QUANTUM EMMA — Android Dashboard v5.0 MEGA UPGRADE
//  Live Stats · 12-Agent Status · IDO Countdown · AI Signals
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Animated, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: W, height: H } = Dimensions.get('window');
const Q = {
  void:'#000008', deep:'#02000f', bg0:'#030012', bg1:'#06001e', bg2:'#0a002e',
  plasma:'#7c3aed', neutrino:'#8b5cf6', quark:'#a78bfa', gluon:'#06b6d4',
  photon:'#00ffff', higgs:'#fbbf24', boson:'#f472b6', lepton:'#4ade80',
  muon:'#fb923c', tauon:'#f87171', bright:'#f0f4ff', mid:'#94a3b8', dim:'#475569',
};

const AGENTS = [
  {name:'ALPHA-7', load:94, color:Q.plasma},
  {name:'BETA-3',  load:78, color:Q.gluon},
  {name:'MU-10',   load:100,color:Q.lepton},
  {name:'ETA-8',   load:85, color:Q.quark},
  {name:'DELTA-1', load:88, color:Q.photon},
  {name:'ZETA-5',  load:71, color:Q.muon},
];

function useCountdown(target: string) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

export default function DashboardScreen() {
  const [tick, setTick] = useState(0);
  const [loop, setLoop] = useState(4421);
  const [coherence, setCoherence] = useState(97.4);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const countdown = useCountdown('2026-07-15T12:00:00Z');

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      if (Math.random() > 0.85) setLoop(l => l + 1);
      if (Math.random() > 0.9) setCoherence(c =>
        parseFloat(Math.min(99.9, Math.max(90, c + (Math.random() - 0.45) * 0.3)).toFixed(1)));
    }, 300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const price  = (0.63 + Math.sin(tick * 0.04) * 0.025).toFixed(4);
  const change = (2.47 + Math.sin(tick * 0.02) * 0.3).toFixed(2);
  const isUp   = parseFloat(change) >= 0;

  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0,1], outputRange: [0.5, 1] });

  const signals = [
    { asset:'QEMMA', sig:'STRONG BUY', conf:94, color:Q.lepton },
    { asset:'ETH',   sig:'BUY',        conf:78, color:Q.gluon  },
    { asset:'BTC',   sig:'HOLD',       conf:62, color:Q.higgs  },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Q.void} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <LinearGradient colors={[Q.deep, Q.bg2, Q.void]} style={s.header}>
          <Text style={s.headerSub}>⚛️ QUANTUM EMMA v5.0</Text>
          <Text style={s.headerTitle}>Master Dashboard</Text>

          {/* Live QEMMA price */}
          <View style={s.priceBox}>
            <View style={s.priceItem}>
              <Text style={s.priceLabel}>QEMMA</Text>
              <Animated.Text style={[s.priceValue, { opacity: pulseOpacity, color: isUp ? Q.lepton : Q.tauon }]}>
                ${price}
              </Animated.Text>
              <Text style={[s.priceChange, { color: isUp ? Q.lepton : Q.tauon }]}>
                {isUp ? '▲' : '▼'} {change}%
              </Text>
            </View>
            <View style={s.divider} />
            <View style={s.priceItem}>
              <Text style={s.priceLabel}>Loop #</Text>
              <Text style={[s.priceValue, { color: Q.photon }]}>#{loop.toLocaleString()}</Text>
              <Text style={[s.priceChange, { color: Q.dim }]}>{coherence}% coherence</Text>
            </View>
          </View>
        </LinearGradient>

        {/* STAT CARDS */}
        <View style={s.statsRow}>
          {[
            { label: 'Portfolio',    val: '$51,763', color: Q.plasma,   icon: '💼' },
            { label: 'Staking',      val: '+1,651',  color: Q.lepton,   icon: '🔒' },
            { label: 'Mining',       val: '420 QEMMA',color: Q.higgs,   icon: '⛏' },
            { label: 'Agents',       val: '10/12',   color: Q.gluon,    icon: '🤖' },
          ].map((stat, i) => (
            <LinearGradient key={i} colors={[stat.color + '22', stat.color + '08']} style={s.statCard}>
              <Text style={s.statIcon}>{stat.icon}</Text>
              <Text style={[s.statVal, { color: stat.color }]}>{stat.val}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* IDO COUNTDOWN */}
        <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.card}>
          <Text style={s.cardTitle}>🚀 IDO Countdown — July 15, 2026</Text>
          <View style={s.countdownRow}>
            {[['d','D'], ['h','H'], ['m','M'], ['s','S']].map(([k, l]) => (
              <View key={k} style={s.countdownBox}>
                <Text style={s.countdownNum}>{String((countdown as any)[k]).padStart(2,'0')}</Text>
                <Text style={s.countdownLabel}>{l}</Text>
              </View>
            ))}
          </View>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: '56.8%' }]} />
          </View>
          <Text style={s.progressText}>2,840 / 5,000 Whitelist Spots</Text>
        </LinearGradient>

        {/* AI SIGNALS */}
        <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.card}>
          <View style={s.cardHeader}>
            <Animated.View style={[s.liveIndicator, { opacity: pulseOpacity }]} />
            <Text style={s.cardTitle}>🤖 Live AI Signals — Meta Genius TR2</Text>
          </View>
          {signals.map((sig, i) => (
            <View key={i} style={s.signalRow}>
              <Text style={[s.signalAsset, { color: Q.bright }]}>{sig.asset}</Text>
              <View style={[s.signalBadge, { backgroundColor: sig.color + '22', borderColor: sig.color + '55' }]}>
                <Text style={[s.signalText, { color: sig.color }]}>{sig.sig}</Text>
              </View>
              <View style={s.confBar}>
                <View style={[s.confFill, { width: `${sig.conf}%` as any, backgroundColor: sig.color }]} />
              </View>
              <Text style={[s.confNum, { color: sig.color }]}>{sig.conf}%</Text>
            </View>
          ))}
        </LinearGradient>

        {/* AGENT GRID */}
        <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.card}>
          <Text style={s.cardTitle}>⚡ Agent Network Status</Text>
          <View style={s.agentGrid}>
            {AGENTS.map((a, i) => (
              <View key={i} style={[s.agentCard, { borderColor: a.color + '44' }]}>
                <View style={[s.agentDot, { backgroundColor: a.load > 30 ? Q.lepton : Q.dim }]} />
                <Text style={[s.agentName, { color: a.color }]}>{a.name}</Text>
                <View style={s.agentBarBg}>
                  <View style={[s.agentBarFill, { width: `${a.load}%` as any, backgroundColor: a.color }]} />
                </View>
                <Text style={[s.agentLoad, { color: Q.dim }]}>{a.load}%</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* QUICK ACTIONS */}
        <LinearGradient colors={[Q.bg1, Q.bg2]} style={[s.card, { marginBottom: 32 }]}>
          <Text style={s.cardTitle}>⚡ Quick Actions</Text>
          <View style={s.actionsGrid}>
            {[
              { label:'Trade',  icon:'📊', color:Q.gluon   },
              { label:'Swap',   icon:'⚡', color:Q.plasma  },
              { label:'Stake',  icon:'🔒', color:Q.lepton  },
              { label:'Mine',   icon:'⛏', color:Q.higgs   },
              { label:'Vote',   icon:'🏛', color:Q.quark   },
              { label:'Chat AI',icon:'🤖', color:Q.boson   },
            ].map((a, i) => (
              <TouchableOpacity key={i} style={[s.actionBtn, { borderColor: a.color + '44' }]}>
                <Text style={s.actionIcon}>{a.icon}</Text>
                <Text style={[s.actionLabel, { color: a.color }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex:1, backgroundColor:Q.void },
  scroll:        { flex:1 },
  header:        { padding:20, paddingTop:10, alignItems:'center' },
  headerSub:     { fontSize:10, letterSpacing:3, color:Q.plasma, fontWeight:'700', marginBottom:4 },
  headerTitle:   { fontSize:22, fontWeight:'900', color:Q.bright, marginBottom:16 },
  priceBox:      { flexDirection:'row', backgroundColor:Q.plasma+'18', borderRadius:14,
                   padding:14, borderWidth:1, borderColor:Q.plasma+'44', alignItems:'center' },
  priceItem:     { flex:1, alignItems:'center' },
  priceLabel:    { fontSize:10, color:Q.dim, marginBottom:2 },
  priceValue:    { fontSize:22, fontWeight:'900' },
  priceChange:   { fontSize:11, fontWeight:'700', marginTop:2 },
  divider:       { width:1, height:40, backgroundColor:Q.plasma+'44', marginHorizontal:12 },
  statsRow:      { flexDirection:'row', flexWrap:'wrap', padding:10, gap:8 },
  statCard:      { width:(W-36)/2, borderRadius:12, padding:12, borderWidth:1, borderColor:Q.plasma+'22' },
  statIcon:      { fontSize:20, marginBottom:4 },
  statVal:       { fontSize:18, fontWeight:'900' },
  statLabel:     { fontSize:10, color:Q.dim, marginTop:2 },
  card:          { marginHorizontal:12, marginBottom:12, borderRadius:16, padding:16,
                   borderWidth:1, borderColor:Q.plasma+'22' },
  cardHeader:    { flexDirection:'row', alignItems:'center', gap:8, marginBottom:12 },
  cardTitle:     { fontSize:13, fontWeight:'800', color:Q.quark, marginBottom:12 },
  liveIndicator: { width:8, height:8, borderRadius:4, backgroundColor:Q.lepton },
  countdownRow:  { flexDirection:'row', justifyContent:'center', gap:8, marginBottom:12 },
  countdownBox:  { backgroundColor:Q.plasma+'18', borderRadius:10, padding:10,
                   borderWidth:1, borderColor:Q.plasma+'44', alignItems:'center', minWidth:60 },
  countdownNum:  { fontSize:26, fontWeight:'900', color:Q.photon, fontVariant:['tabular-nums'] },
  countdownLabel:{ fontSize:9, color:Q.dim, marginTop:2 },
  progressBar:   { height:8, backgroundColor:Q.plasma+'15', borderRadius:4, overflow:'hidden' },
  progressFill:  { height:8, backgroundColor:Q.plasma, borderRadius:4 },
  progressText:  { fontSize:10, color:Q.dim, marginTop:6, textAlign:'center' },
  signalRow:     { flexDirection:'row', alignItems:'center', marginBottom:10, gap:8 },
  signalAsset:   { width:50, fontWeight:'700', fontSize:12 },
  signalBadge:   { borderRadius:20, paddingHorizontal:8, paddingVertical:2, borderWidth:1 },
  signalText:    { fontSize:10, fontWeight:'800' },
  confBar:       { flex:1, height:4, backgroundColor:Q.plasma+'20', borderRadius:2, overflow:'hidden' },
  confFill:      { height:4, borderRadius:2 },
  confNum:       { width:32, fontSize:11, fontWeight:'800', textAlign:'right' },
  agentGrid:     { flexDirection:'row', flexWrap:'wrap', gap:8 },
  agentCard:     { width:(W-60)/2, borderRadius:8, padding:8,
                   borderWidth:1, backgroundColor:Q.bg2 },
  agentDot:      { width:6, height:6, borderRadius:3, marginBottom:4 },
  agentName:     { fontSize:10, fontWeight:'800', marginBottom:4 },
  agentBarBg:    { height:3, backgroundColor:Q.plasma+'20', borderRadius:2, overflow:'hidden', marginBottom:2 },
  agentBarFill:  { height:3, borderRadius:2 },
  agentLoad:     { fontSize:9 },
  actionsGrid:   { flexDirection:'row', flexWrap:'wrap', gap:8 },
  actionBtn:     { width:(W-68)/3, borderRadius:12, padding:12, alignItems:'center',
                   borderWidth:1, backgroundColor:Q.bg2 },
  actionIcon:    { fontSize:22, marginBottom:4 },
  actionLabel:   { fontSize:10, fontWeight:'700' },
});
