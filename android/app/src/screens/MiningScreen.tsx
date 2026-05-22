// ============================================================
//  QUANTUM EMMA — Android Mining Screen
//  React Native · Expo · © 2026 Grigori Saks
// ============================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const POOLS = [
  { id:1, name:'POOL ALPHA',  icon:'⚛️', agent:'ALPHA-Q', color:'#8b5cf6', active:true,  reward:78,  fee:1.0, miners:'2,847', fill:73 },
  { id:2, name:'POOL BETA',   icon:'🧠', agent:'BETA-N',  color:'#06b6d4', active:true,  reward:78,  fee:1.5, miners:'1,924', fill:61 },
  { id:3, name:'POOL GAMMA',  icon:'🔄', agent:'GAMMA-R', color:'#4ade80', active:true,  reward:78,  fee:0.5, miners:'1,481', fill:54 },
  { id:4, name:'POOL QUANTUM',icon:'💎', agent:'META-TR2',color:'#fbbf24', active:false, reward:156, fee:2.0, miners:'892',   fill:42 },
];

export default function MiningScreen() {
  const [mining, setMining]   = useState(false);
  const [earned, setEarned]   = useState(0);
  const [hashrate, setHashrate] = useState(0);
  const [selectedPool, setSelectedPool] = useState(0);
  const [blockCount, setBlockCount] = useState(847291);

  useEffect(() => {
    const interval = setInterval(() => {
      if (mining) {
        setEarned(e => e + 0.0048);
        setHashrate(h => 220000 + Math.round(Math.sin(Date.now() * 0.001) * 15000));
        if (Math.random() > 0.97) setBlockCount(b => b + 1);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [mining]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#020008','#0a0025','#020008']} style={styles.bg}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⛏ QEMMA MINING</Text>
          <Text style={styles.headerSub}>4 POOLS · BITCOIN-STYLE HALVING</Text>
        </View>

        {/* Mining Control */}
        <View style={[styles.controlCard, { borderColor: mining ? '#4ade8066' : '#8b5cf644' }]}>
          <Text style={styles.miningIcon}>{mining ? '⛏' : '💤'}</Text>
          <Text style={[styles.earnedValue, { color: mining ? '#4ade80' : '#94a3b8' }]}>
            {earned.toFixed(6)} QEMMA
          </Text>
          {mining && (
            <Text style={styles.hashrateText}>{hashrate.toLocaleString()} H/s</Text>
          )}
          <Text style={styles.blockText}>Block #{blockCount.toLocaleString()}</Text>
          <TouchableOpacity
            onPress={() => setMining(m => !m)}
            style={[styles.mineBtn, { backgroundColor: mining ? '#f87171' : '#4ade80' }]}>
            <Text style={styles.mineBtnText}>{mining ? '⏹ STOP MINING' : '▶ START MINING'}</Text>
          </TouchableOpacity>
        </View>

        {/* Pool selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💧 SELECT POOL</Text>
          {POOLS.map((p, i) => (
            <TouchableOpacity key={p.id} onPress={() => setSelectedPool(i)}
              style={[styles.poolCard, {
                borderColor: selectedPool === i ? p.color : p.color + '28',
                backgroundColor: selectedPool === i ? p.color + '18' : p.color + '0a',
              }]}>
              <Text style={styles.poolIcon}>{p.icon}</Text>
              <View style={styles.poolInfo}>
                <Text style={[styles.poolName, { color: p.color }]}>{p.name}</Text>
                <Text style={styles.poolDetail}>
                  Agent: {p.agent} · Fee: {p.fee}% · {p.miners} miners
                </Text>
                <Text style={styles.poolDetail}>
                  Reward: {p.reward} QEMMA/block · Fill: {p.fill}%
                </Text>
              </View>
              <View style={styles.poolStatus}>
                <View style={[styles.statusDot, { backgroundColor: p.active ? '#4ade80' : '#f87171' }]} />
                <Text style={[styles.statusText, { color: p.active ? '#4ade80' : '#f87171' }]}>
                  {p.active ? 'ACTIVE' : 'OFFLINE'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Halving info */}
        <View style={styles.halvingCard}>
          <Text style={styles.halvingTitle}>₿ NEXT HALVING</Text>
          <View style={styles.halvingRow}>
            <View style={styles.halvingItem}>
              <Text style={styles.halvingLabel}>Blocks Left</Text>
              <Text style={styles.halvingValue}>202,709</Text>
            </View>
            <View style={styles.halvingItem}>
              <Text style={styles.halvingLabel}>Days Left</Text>
              <Text style={styles.halvingValue}>~203d</Text>
            </View>
            <View style={styles.halvingItem}>
              <Text style={styles.halvingLabel}>Next Reward</Text>
              <Text style={styles.halvingValue}>39 Q</Text>
            </View>
          </View>
          <View style={styles.halvingBarBg}>
            <View style={[styles.halvingBarFill, { width: '40.4%' }]} />
          </View>
          <Text style={styles.halvingPct}>40.4% of epoch complete</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>QEMMAMining.sol · © 2026 Grigori Saks</Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#020008' },
  bg:           { flex: 1, minHeight: '100%' },
  header:       { padding: 24, paddingTop: 48, alignItems: 'center' },
  headerTitle:  { fontSize: 24, fontWeight: '900', color: '#4ade80', letterSpacing: 2 },
  headerSub:    { fontSize: 11, color: '#065f46', letterSpacing: 2, marginTop: 4 },
  controlCard:  { margin: 16, padding: 24, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 2, alignItems: 'center' },
  miningIcon:   { fontSize: 52, marginBottom: 12 },
  earnedValue:  { fontSize: 28, fontWeight: '900', fontFamily: 'monospace', marginBottom: 6 },
  hashrateText: { fontSize: 14, fontWeight: '700', color: '#4ade80', marginBottom: 6 },
  blockText:    { fontSize: 12, color: '#475569', marginBottom: 16 },
  mineBtn:      { paddingHorizontal: 40, paddingVertical: 14, borderRadius: 30 },
  mineBtnText:  { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  section:      { padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#c4b5fd', letterSpacing: 1, marginBottom: 12 },
  poolCard:     { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  poolIcon:     { fontSize: 24, marginRight: 12 },
  poolInfo:     { flex: 1 },
  poolName:     { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  poolDetail:   { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  poolStatus:   { alignItems: 'center' },
  statusDot:    { width: 8, height: 8, borderRadius: 4 },
  statusText:   { fontSize: 9, fontWeight: '800', marginTop: 4 },
  halvingCard:  { margin: 16, padding: 18, borderRadius: 14, backgroundColor: 'rgba(251,146,60,0.1)', borderWidth: 1, borderColor: 'rgba(251,146,60,0.3)' },
  halvingTitle: { fontSize: 13, fontWeight: '800', color: '#fb923c', letterSpacing: 1, marginBottom: 14 },
  halvingRow:   { flexDirection: 'row', marginBottom: 14 },
  halvingItem:  { flex: 1, alignItems: 'center' },
  halvingLabel: { fontSize: 9, color: '#475569' },
  halvingValue: { fontSize: 18, fontWeight: '900', color: '#fbbf24', marginTop: 4 },
  halvingBarBg: { height: 8, backgroundColor: 'rgba(251,146,60,0.1)', borderRadius: 4, overflow: 'hidden' },
  halvingBarFill:{ height: 8, backgroundColor: '#fb923c', borderRadius: 4 },
  halvingPct:   { fontSize: 10, color: '#475569', marginTop: 6, textAlign: 'center' },
  footer:       { padding: 20, alignItems: 'center' },
  footerText:   { fontSize: 10, color: '#475569' },
});
