// ============================================================
//  QUANTUM EMMA — Android Staking Screen
//  React Native · Expo · © 2026 Grigori Saks
// ============================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TIERS = [
  { id:0, name:'FLEXIBLE', lock:0,   apy:12, badge:'🔓', color:'#94a3b8' },
  { id:1, name:'BRONZE',   lock:30,  apy:18, badge:'🥉', color:'#cd7f32' },
  { id:2, name:'SILVER',   lock:90,  apy:24, badge:'🥈', color:'#c0c0c0' },
  { id:3, name:'GOLD',     lock:180, apy:36, badge:'🥇', color:'#fbbf24' },
  { id:4, name:'QUANTUM',  lock:365, apy:60, badge:'⚛️', color:'#8b5cf6' },
];

export default function StakingScreen() {
  const [selectedTier, setSelectedTier] = useState(4);
  const [amount, setAmount] = useState('5000');
  const [earned, setEarned] = useState(0);

  const tier = TIERS[selectedTier];
  const a = parseFloat(amount || '0');
  const daily   = a * tier.apy / 100 / 365;
  const monthly = a * tier.apy / 100 / 12;
  const yearly  = a * tier.apy / 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setEarned(e => e + (daily / 86400 * 0.5));
    }, 500);
    return () => clearInterval(interval);
  }, [daily]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#020008','#0a0025','#020008']} style={styles.bg}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💎 STAKING VAULT</Text>
          <Text style={styles.headerSub}>5 TIERS · UP TO 60% APY</Text>
          <View style={styles.earnedBadge}>
            <Text style={styles.earnedLabel}>Session Earned</Text>
            <Text style={styles.earnedValue}>{earned.toFixed(6)} QEMMA</Text>
          </View>
        </View>

        {/* Tiers */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiersRow}>
          {TIERS.map((t, i) => (
            <TouchableOpacity key={t.id} onPress={() => setSelectedTier(i)}
              style={[styles.tierCard, { borderColor: selectedTier === i ? t.color : t.color+'33',
                backgroundColor: selectedTier === i ? t.color+'22' : t.color+'0a' }]}>
              <Text style={styles.tierBadge}>{t.badge}</Text>
              <Text style={[styles.tierName, { color: t.color }]}>{t.name}</Text>
              <Text style={[styles.tierAPY, { color: t.color }]}>{t.apy}%</Text>
              <Text style={styles.tierAPYLabel}>APY</Text>
              <Text style={styles.tierLock}>{t.lock === 0 ? 'No Lock' : `${t.lock}d`}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Calculator */}
        <View style={[styles.calcCard, { borderColor: tier.color+'44' }]}>
          <Text style={[styles.calcTitle, { color: tier.color }]}>🧮 REWARD CALCULATOR</Text>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric"
            style={[styles.input, { borderColor: tier.color+'44', color: '#fff' }]}
            placeholder="QEMMA Amount" placeholderTextColor="#475569"/>
          <View style={styles.rewardRow}>
            {[{ l:'Daily', v: daily.toFixed(4) },
              { l:'Monthly', v: monthly.toFixed(2) },
              { l:'Yearly', v: yearly.toFixed(2) }].map((r, i) => (
              <View key={i} style={[styles.rewardBox, { borderColor: tier.color+'22' }]}>
                <Text style={styles.rewardLabel}>{r.l}</Text>
                <Text style={[styles.rewardValue, { color: tier.color }]}>{r.v}</Text>
                <Text style={styles.rewardUnit}>QEMMA</Text>
              </View>
            ))}
          </View>
          {tier.lock > 0 && (
            <Text style={styles.penaltyNote}>⚠️ Early exit: 15% penalty · Lock: {tier.lock} days</Text>
          )}
          <TouchableOpacity style={[styles.stakeBtn, { backgroundColor: tier.color }]}>
            <Text style={styles.stakeBtnText}>{tier.badge} STAKE NOW — {tier.name}</Text>
          </TouchableOpacity>
        </View>

        {/* Active positions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 ACTIVE POSITIONS</Text>
          {[
            { tier:'QUANTUM', badge:'⚛️', staked:5000, apy:60, c:'#8b5cf6', earnings:'0.002847' },
            { tier:'GOLD',    badge:'🥇', staked:2000, apy:36, c:'#fbbf24', earnings:'0.001042' },
          ].map((p, i) => (
            <View key={i} style={[styles.positionCard, { borderColor: p.c+'33' }]}>
              <Text style={styles.positionBadge}>{p.badge}</Text>
              <View style={styles.positionInfo}>
                <Text style={[styles.positionTier, { color: p.c }]}>{p.tier}</Text>
                <Text style={styles.positionDetail}>Staked: {p.staked.toLocaleString()} QEMMA · APY: {p.apy}%</Text>
              </View>
              <View style={styles.positionRight}>
                <Text style={[styles.positionEarnings, { color: '#4ade80' }]}>+{p.earnings}</Text>
                <TouchableOpacity style={[styles.claimBtn, { borderColor: p.c }]}>
                  <Text style={[styles.claimBtnText, { color: p.c }]}>CLAIM</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>QEMMAStaking.sol · Audited · © 2026 Grigori Saks</Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#020008' },
  bg:           { flex: 1, minHeight: '100%' },
  header:       { padding: 24, paddingTop: 48, alignItems: 'center' },
  headerTitle:  { fontSize: 24, fontWeight: '900', color: '#fbbf24', letterSpacing: 2 },
  headerSub:    { fontSize: 11, color: '#78350f', letterSpacing: 2, marginTop: 4 },
  earnedBadge:  { marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: 'rgba(74,222,128,0.1)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', alignItems: 'center' },
  earnedLabel:  { fontSize: 10, color: '#475569' },
  earnedValue:  { fontSize: 20, fontWeight: '900', color: '#4ade80', fontFamily: 'monospace', marginTop: 4 },
  tiersRow:     { paddingHorizontal: 16, marginBottom: 16 },
  tierCard:     { width: 110, padding: 14, borderRadius: 14, marginRight: 10, borderWidth: 2, alignItems: 'center' },
  tierBadge:    { fontSize: 28, marginBottom: 6 },
  tierName:     { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  tierAPY:      { fontSize: 28, fontWeight: '900', marginTop: 6 },
  tierAPYLabel: { fontSize: 9, color: '#475569' },
  tierLock:     { fontSize: 9, color: '#475569', marginTop: 4 },
  calcCard:     { margin: 16, padding: 18, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1 },
  calcTitle:    { fontSize: 13, fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  input:        { padding: 12, borderRadius: 10, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.5)', fontSize: 18, fontWeight: '700', marginBottom: 14 },
  rewardRow:    { flexDirection: 'row', gap: 8, marginBottom: 14 },
  rewardBox:    { flex: 1, padding: 10, borderRadius: 9, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center' },
  rewardLabel:  { fontSize: 9, color: '#475569' },
  rewardValue:  { fontSize: 16, fontWeight: '900', marginTop: 4 },
  rewardUnit:   { fontSize: 8, color: '#475569', marginTop: 2 },
  penaltyNote:  { fontSize: 11, color: '#f87171', marginBottom: 12, textAlign: 'center' },
  stakeBtn:     { padding: 15, borderRadius: 12, alignItems: 'center' },
  stakeBtnText: { color: '#000', fontSize: 15, fontWeight: '900', letterSpacing: 2 },
  section:      { padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#c4b5fd', letterSpacing: 1, marginBottom: 12 },
  positionCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, marginBottom: 10 },
  positionBadge:{ fontSize: 24, marginRight: 12 },
  positionInfo: { flex: 1 },
  positionTier: { fontSize: 13, fontWeight: '800' },
  positionDetail:{ fontSize: 10, color: '#94a3b8', marginTop: 2 },
  positionRight:{ alignItems: 'flex-end' },
  positionEarnings:{ fontSize: 12, fontWeight: '800' },
  claimBtn:     { marginTop: 6, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  claimBtnText: { fontSize: 10, fontWeight: '800' },
  footer:       { padding: 20, alignItems: 'center' },
  footerText:   { fontSize: 10, color: '#475569' },
});
