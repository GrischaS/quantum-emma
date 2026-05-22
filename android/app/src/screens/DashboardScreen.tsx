// ============================================================
//  QUANTUM EMMA — Android Dashboard Screen v4.0
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W } = Dimensions.get('window');
const Q = {
  void:'#000008', bg1:'#06001e',
  plasma:'#7c3aed', neutrino:'#8b5cf6', gluon:'#06b6d4',
  higgs:'#fbbf24', lepton:'#4ade80', muon:'#fb923c',
  tauon:'#f87171', bright:'#f0f4ff', mid:'#94a3b8', dim:'#475569',
};

export default function DashboardScreen() {
  const [tick, setTick] = useState(0);
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    const id = setInterval(() => { setTick(t => t + 1); setEarned(e => e + 0.0001); }, 200);
    return () => clearInterval(id);
  }, []);

  const price   = (0.63 + Math.sin(tick * 0.05) * 0.025).toFixed(4);
  const btc     = (71450 + Math.sin(tick * 0.025) * 280).toFixed(0);
  const eth     = (3840 + Math.sin(tick * 0.032) * 95).toFixed(0);
  const block   = 847291 + Math.floor(tick / 20);

  const coins = [
    { s: 'QEMMA', p: price,   d: '+8.42%', c: Q.neutrino },
    { s: 'BTC',   p: `$${btc}`,d: '+2.34%',c: Q.higgs },
    { s: 'ETH',   p: `$${eth}`,d: '+1.87%',c: Q.gluon },
    { s: 'BNB',   p: '$612',  d: '+0.91%', c: Q.muon },
  ];

  const stats = [
    { l: 'Portfolio',    v: '$50,027', c: Q.neutrino, icon: '💼' },
    { l: 'Staked',       v: '7,500 Q', c: Q.higgs,    icon: '💎' },
    { l: 'Mined Today',  v: `${earned.toFixed(4)} Q`, c: Q.lepton, icon: '⛏' },
    { l: 'AI Accuracy',  v: '98.3%',  c: Q.lepton,   icon: '🤖' },
  ];

  const modules = [
    { label: '💹 Trading',    color: Q.gluon,   desc: 'Pro Charts · AI Signals' },
    { label: '💎 Staking',    color: Q.higgs,   desc: '60% APY · 5 Tiers' },
    { label: '⛏ Mining',     color: Q.lepton,  desc: '4 Pools · Halving' },
    { label: '👁 Oracle Chat',color: Q.plasma,  desc: '12 Agents · Predict' },
    { label: '🗳 Governance', color: Q.gluon,   desc: 'DAO · Treasury' },
    { label: '🔬 Research',   color: Q.neutrino,desc: '8 Domains · 847 Sources' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#020008', '#0a0025', '#020008']} style={styles.bg}>

        {/* Header */}
        <LinearGradient colors={['rgba(124,58,237,0.2)', 'rgba(6,182,212,0.08)']} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>QUANTUM EMMA</Text>
              <Text style={styles.headerSub}>META GENIUS TR2 · ENTERPRISE v4.0</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>QEMMA</Text>
              <Text style={styles.priceValue}>${price}</Text>
              <Text style={styles.priceChange}>▲ +8.42%</Text>
            </View>
          </View>

          {/* Block info */}
          <View style={styles.blockRow}>
            <View style={styles.onlineDot}/>
            <Text style={styles.blockText}>All Systems Online · Block #{block.toLocaleString()}</Text>
          </View>

          {/* Ticker */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ticker}>
            {coins.map((c, i) => (
              <View key={i} style={[styles.tickerItem, { borderColor: c.c + '44' }]}>
                <View style={[styles.tickerDot, { backgroundColor: c.c }]}/>
                <Text style={[styles.tickerSym, { color: c.c }]}>{c.s}</Text>
                <Text style={styles.tickerPrice}>{c.p}</Text>
                <Text style={[styles.tickerChange, { color: Q.lepton }]}>{c.d}</Text>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statCard, { borderColor: s.c + '33', backgroundColor: s.c + '10' }]}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
              <Text style={[styles.statValue, { color: s.c }]}>{s.v}</Text>
            </View>
          ))}
        </View>

        {/* HQMLL bar */}
        <View style={styles.hqmllBox}>
          <View style={styles.hqmllHeader}>
            <Text style={styles.hqmllTitle}>⚡ HQMLL — Layer 7 Active</Text>
            <Text style={styles.hqmllAcc}>98.3%</Text>
          </View>
          {[
            { n: 'QUANTUM',  v: 89, c: Q.gluon },
            { n: 'RECURSIVE',v: 93, c: '#0891b2' },
            { n: 'OUTPUT',   v: 98, c: Q.higgs },
          ].map((l, i) => (
            <View key={i} style={styles.layerRow}>
              <Text style={[styles.layerName, { color: l.c }]}>{l.n}</Text>
              <View style={styles.layerBarBg}>
                <View style={[styles.layerBarFill, { width: `${l.v}%`, backgroundColor: l.c }]}/>
              </View>
              <Text style={[styles.layerVal, { color: l.c }]}>{l.v}%</Text>
            </View>
          ))}
        </View>

        {/* Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 ALL MODULES</Text>
          <View style={styles.moduleGrid}>
            {modules.map((m, i) => (
              <TouchableOpacity key={i} style={[styles.moduleCard, { borderColor: m.color + '44', backgroundColor: m.color + '10' }]}>
                <Text style={[styles.moduleLabel, { color: m.color }]}>{m.label}</Text>
                <Text style={styles.moduleDesc}>{m.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Grigori Saks — Patent Pending — Enterprise v4.0</Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#000008' },
  bg:           { flex: 1, minHeight: '100%' },
  header:       { padding: 20, paddingTop: 52, borderBottomWidth: 1, borderBottomColor: 'rgba(124,58,237,0.2)' },
  headerRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  headerTitle:  { fontSize: 22, fontWeight: '900', color: '#8b5cf6', letterSpacing: 2 },
  headerSub:    { fontSize: 9, color: '#7c3aed', letterSpacing: 1.5, marginTop: 3 },
  priceBox:     { alignItems: 'flex-end', padding: 10, borderRadius: 12, backgroundColor: 'rgba(251,191,36,0.1)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)' },
  priceLabel:   { fontSize: 9, color: '#475569' },
  priceValue:   { fontSize: 20, fontWeight: '900', color: '#fbbf24', fontFamily: 'monospace' },
  priceChange:  { fontSize: 11, fontWeight: '700', color: '#4ade80', marginTop: 2 },
  blockRow:     { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
  onlineDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4ade80' },
  blockText:    { fontSize: 10, color: '#94a3b8' },
  ticker:       { marginHorizontal: -20, paddingHorizontal: 20 },
  tickerItem:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 10, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  tickerDot:    { width: 5, height: 5, borderRadius: 3 },
  tickerSym:    { fontSize: 10, fontWeight: '800' },
  tickerPrice:  { fontSize: 11, fontWeight: '700', color: '#f0f4ff', fontFamily: 'monospace' },
  tickerChange: { fontSize: 9, fontWeight: '700' },
  statsGrid:    { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 8 },
  statCard:     { width: (W - 44) / 2, padding: 14, borderRadius: 13, borderWidth: 1, alignItems: 'center' },
  statIcon:     { fontSize: 22, marginBottom: 6 },
  statLabel:    { fontSize: 9, color: '#475569', letterSpacing: 1, marginBottom: 4 },
  statValue:    { fontSize: 16, fontWeight: '900', fontFamily: 'monospace' },
  hqmllBox:     { margin: 14, padding: 16, borderRadius: 14, backgroundColor: 'rgba(6,182,212,0.08)', borderWidth: 1, borderColor: 'rgba(6,182,212,0.25)' },
  hqmllHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  hqmllTitle:   { fontSize: 12, fontWeight: '800', color: '#06b6d4' },
  hqmllAcc:     { fontSize: 18, fontWeight: '900', color: '#4ade80' },
  layerRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  layerName:    { width: 72, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  layerBarBg:   { flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' },
  layerBarFill: { height: 5, borderRadius: 3 },
  layerVal:     { width: 36, fontSize: 10, fontWeight: '700', textAlign: 'right' },
  section:      { padding: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#a78bfa', letterSpacing: 1, marginBottom: 12 },
  moduleGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moduleCard:   { width: (W - 44) / 2, padding: 14, borderRadius: 13, borderWidth: 1 },
  moduleLabel:  { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  moduleDesc:   { fontSize: 10, color: '#94a3b8' },
  footer:       { padding: 20, alignItems: 'center' },
  footerText:   { fontSize: 9, color: '#475569', textAlign: 'center' },
});
