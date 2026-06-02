// ============================================================
//  QUANTUM EMMA — Android Staking v5.0
//  5 Tiers · 60% APY · Live Calculator · My Positions
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: W } = Dimensions.get('window');
const Q = {
  void:'#000008', bg1:'#06001e', bg2:'#0a002e',
  plasma:'#7c3aed', neutrino:'#8b5cf6', quark:'#a78bfa', gluon:'#06b6d4',
  photon:'#00ffff', higgs:'#fbbf24', boson:'#f472b6', lepton:'#4ade80',
  muon:'#fb923c', tauon:'#f87171', bright:'#f0f4ff', mid:'#94a3b8', dim:'#475569',
};

const TIERS = [
  { name:'FLEXIBLE', icon:'🔓', apy:12, lock:0,   color:Q.mid,    min:100   },
  { name:'BRONZE',   icon:'🥉', apy:18, lock:30,  color:Q.muon,   min:500   },
  { name:'SILVER',   icon:'🥈', apy:24, lock:90,  color:Q.mid,    min:1000  },
  { name:'GOLD',     icon:'🥇', apy:36, lock:180, color:Q.higgs,  min:5000  },
  { name:'QUANTUM',  icon:'⚛️', apy:60, lock:365, color:Q.plasma, min:10000 },
];

const POSITIONS = [
  { tier:'QUANTUM', staked:25000, earned:1240.5, lock:'365d', apy:60, color:Q.plasma, progress:39 },
  { tier:'GOLD',    staked:10000, earned:312.8,  lock:'180d', apy:36, color:Q.higgs,  progress:37 },
];

export default function StakingScreen() {
  const [selectedTier, setSelectedTier] = useState(TIERS[4]);
  const [amount, setAmount] = useState('10000');
  const [tab, setTab] = useState<'stake'|'positions'|'calc'>('stake');
  const [staked, setStaked] = useState(false);
  const price = 0.63;
  const amt   = parseFloat(amount) || 0;
  const daily   = (amt * selectedTier.apy / 100 / 365).toFixed(2);
  const monthly = (amt * selectedTier.apy / 100 / 12).toFixed(2);
  const yearly  = (amt * selectedTier.apy / 100).toFixed(2);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Q.void} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.header}>
          <Text style={s.headerTitle}>🔒 Staking Center v5.0</Text>
          <View style={s.statsRow}>
            {[{l:'Total Staked',v:'$25.2M',c:Q.plasma},{l:'Avg APY',v:'48.2%',c:Q.lepton},{l:'Stakers',v:'4,820',c:Q.gluon}].map((st,i) => (
              <View key={i} style={[s.statCard, {borderColor: st.c+'33'}]}>
                <Text style={[s.statVal, {color: st.c}]}>{st.v}</Text>
                <Text style={s.statLabel}>{st.l}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* TIER SELECTOR */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tierScroll} contentContainerStyle={{gap:8,padding:4}}>
          {TIERS.map((t, i) => (
            <TouchableOpacity key={i} onPress={() => setSelectedTier(t)}
              style={[s.tierCard, {borderColor: selectedTier.name===t.name ? t.color+'88' : t.color+'22',
                backgroundColor: selectedTier.name===t.name ? t.color+'25' : t.color+'0a'}]}>
              <Text style={s.tierIcon}>{t.icon}</Text>
              <Text style={[s.tierName, {color: selectedTier.name===t.name ? t.color : Q.dim}]}>{t.name}</Text>
              <Text style={[s.tierApy, {color: t.color}]}>{t.apy}%</Text>
              <Text style={s.tierLabel}>APY</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TABS */}
        <View style={s.tabRow}>
          {(['stake','positions','calc'] as const).map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)}
              style={[s.tabBtn, tab === t && s.tabActive]}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>
                {t === 'stake' ? '⚡ Stake' : t === 'positions' ? '💼 Positions' : '🧮 Calc'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* STAKE TAB */}
        {tab === 'stake' && (
          <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.card}>
            <View style={s.tierHeader}>
              <Text style={s.tierHeaderIcon}>{selectedTier.icon}</Text>
              <View>
                <Text style={[s.tierHeaderName, {color: selectedTier.color}]}>{selectedTier.name} TIER</Text>
                <Text style={s.tierHeaderSub}>Min: {selectedTier.min.toLocaleString()} QEMMA · {selectedTier.lock>0?`${selectedTier.lock}d lock`:'No lock'}</Text>
              </View>
              <Text style={[s.tierHeaderApy, {color: selectedTier.color}]}>{selectedTier.apy}%{'\n'}<Text style={{fontSize:11,fontWeight:'400'}}>APY</Text></Text>
            </View>

            <TextInput placeholder="Amount (QEMMA)" placeholderTextColor={Q.dim} keyboardType="numeric"
              value={amount} onChangeText={setAmount} style={s.input} />
            <View style={s.pctRow}>
              {['25%','50%','75%','100%'].map(p => (
                <TouchableOpacity key={p} style={s.pctBtn} onPress={() => setAmount(String(Math.floor(50000*parseInt(p)/100)))}>
                  <Text style={s.pctText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {amt > 0 && (
              <View style={s.rewardBox}>
                {[['Daily',daily],['Monthly',monthly],['Yearly',yearly]].map(([l,v]) => (
                  <View key={l} style={s.rewardRow}>
                    <Text style={s.rewardLabel}>{l}</Text>
                    <Text style={[s.rewardVal, {color: selectedTier.color}]}>+{v} QEMMA</Text>
                  </View>
                ))}
              </View>
            )}

            {staked ? (
              <View style={[s.successBox, {borderColor: Q.lepton+'33'}]}>
                <Text style={{color: Q.lepton, fontWeight:'800', fontSize:14, textAlign:'center'}}>🎉 Staked Successfully!</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={() => { setStaked(true); setTimeout(() => setStaked(false), 3000); }}
                style={[s.stakeBtn, {backgroundColor: selectedTier.color, opacity: amt >= selectedTier.min ? 1 : 0.4}]}>
                <Text style={s.stakeBtnText}>🔒 Stake {selectedTier.name} Tier</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        )}

        {/* POSITIONS TAB */}
        {tab === 'positions' && (
          <View style={s.section}>
            {POSITIONS.map((pos, i) => (
              <LinearGradient key={i} colors={[pos.color+'18', pos.color+'08']} style={s.posCard}>
                <View style={s.posHeader}>
                  <Text style={[s.posName, {color: pos.color}]}>{pos.tier} TIER</Text>
                  <Text style={[s.posApy, {color: pos.color}]}>{pos.apy}% APY</Text>
                </View>
                <View style={s.posStats}>
                  {[['Staked',`${pos.staked.toLocaleString()} QEMMA`],['Earned',`+${pos.earned} QEMMA`],['Lock',pos.lock]].map(([l,v]) => (
                    <View key={l} style={s.posStat}>
                      <Text style={s.posStatLabel}>{l}</Text>
                      <Text style={[s.posStatVal, {color: l==='Earned'?Q.lepton:Q.bright}]}>{v}</Text>
                    </View>
                  ))}
                </View>
                <View style={s.progressBg}>
                  <View style={[s.progressFill, {width: `${pos.progress}%` as any, backgroundColor: pos.color}]} />
                </View>
                <Text style={s.progressLabel}>{pos.progress}% of lock period complete</Text>
                <TouchableOpacity style={[s.claimBtn, {borderColor: Q.lepton+'44'}]}>
                  <Text style={{color: Q.lepton, fontWeight:'800', fontSize:12}}>Claim {pos.earned} QEMMA</Text>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>
        )}

        {/* CALCULATOR TAB */}
        {tab === 'calc' && (
          <LinearGradient colors={[Q.bg1, Q.bg2]} style={[s.card, {marginBottom:32}]}>
            <Text style={s.cardTitle}>🧮 APY Calculator</Text>
            <TextInput placeholder="Amount (QEMMA)" placeholderTextColor={Q.dim} keyboardType="numeric"
              value={amount} onChangeText={setAmount} style={s.input} />
            <View style={s.calcResult}>
              <Text style={[s.calcBig, {color: selectedTier.color}]}>+{yearly}</Text>
              <Text style={s.calcLabel}>QEMMA / year @ {selectedTier.apy}% APY</Text>
              <Text style={s.calcUsd}>${(parseFloat(yearly||'0')*price).toFixed(2)} USD</Text>
            </View>
            {[['Daily',daily],['Weekly',(amt*selectedTier.apy/100/52).toFixed(2)],['Monthly',monthly],['Yearly',yearly]].map(([l,v]) => (
              <View key={l} style={s.calcRow}>
                <Text style={s.calcRowLabel}>{l}</Text>
                <Text style={[s.calcRowVal, {color: selectedTier.color}]}>+{parseFloat(v).toLocaleString()} QEMMA (${(parseFloat(v)*price).toFixed(2)})</Text>
              </View>
            ))}
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
  statsRow:      { flexDirection:'row', gap:8 },
  statCard:      { flex:1, padding:8, borderRadius:10, borderWidth:1, alignItems:'center',
                   backgroundColor:Q.bg2 },
  statVal:       { fontSize:14, fontWeight:'900' },
  statLabel:     { fontSize:9, color:Q.dim, marginTop:2 },
  tierScroll:    { paddingHorizontal:12, marginBottom:10 },
  tierCard:      { width:90, borderRadius:12, padding:12, borderWidth:1.5, alignItems:'center' },
  tierIcon:      { fontSize:22, marginBottom:4 },
  tierName:      { fontSize:9, fontWeight:'800', marginBottom:2 },
  tierApy:       { fontSize:22, fontWeight:'900' },
  tierLabel:     { fontSize:9, color:Q.dim },
  tabRow:        { flexDirection:'row', marginHorizontal:12, marginBottom:10,
                   backgroundColor:Q.bg1, borderRadius:10, padding:4, borderWidth:1, borderColor:Q.plasma+'22' },
  tabBtn:        { flex:1, padding:8, borderRadius:8, alignItems:'center' },
  tabActive:     { backgroundColor:Q.plasma },
  tabText:       { fontSize:11, fontWeight:'700', color:Q.dim },
  tabTextActive: { color:Q.bright },
  card:          { marginHorizontal:12, marginBottom:12, borderRadius:16, padding:16,
                   borderWidth:1, borderColor:Q.plasma+'22' },
  cardTitle:     { fontSize:13, fontWeight:'800', color:Q.quark, marginBottom:12 },
  tierHeader:    { flexDirection:'row', alignItems:'center', gap:12, marginBottom:16 },
  tierHeaderIcon:{ fontSize:32 },
  tierHeaderName:{ fontSize:16, fontWeight:'900' },
  tierHeaderSub: { fontSize:10, color:Q.dim, marginTop:2 },
  tierHeaderApy: { marginLeft:'auto', fontSize:28, fontWeight:'900', textAlign:'center', lineHeight:32 },
  input:         { backgroundColor:Q.bg2, borderWidth:1, borderColor:Q.plasma+'44',
                   borderRadius:10, padding:12, color:Q.bright, fontSize:14, marginBottom:10 },
  pctRow:        { flexDirection:'row', gap:6, marginBottom:12 },
  pctBtn:        { flex:1, padding:7, borderRadius:8, borderWidth:1,
                   borderColor:Q.plasma+'33', alignItems:'center' },
  pctText:       { fontSize:10, color:Q.dim },
  rewardBox:     { backgroundColor:Q.bg2, borderRadius:10, padding:12, marginBottom:12 },
  rewardRow:     { flexDirection:'row', justifyContent:'space-between', paddingVertical:4 },
  rewardLabel:   { fontSize:12, color:Q.dim },
  rewardVal:     { fontSize:12, fontWeight:'700' },
  successBox:    { padding:16, borderRadius:12, borderWidth:1, backgroundColor:Q.lepton+'12' },
  stakeBtn:      { padding:14, borderRadius:12, alignItems:'center' },
  stakeBtnText:  { fontSize:14, fontWeight:'900', color:Q.bright },
  section:       { paddingHorizontal:12, marginBottom:32 },
  posCard:       { borderRadius:14, padding:16, marginBottom:12,
                   borderWidth:1, borderColor:Q.plasma+'22' },
  posHeader:     { flexDirection:'row', justifyContent:'space-between', marginBottom:12 },
  posName:       { fontSize:15, fontWeight:'900' },
  posApy:        { fontSize:18, fontWeight:'900' },
  posStats:      { flexDirection:'row', gap:8, marginBottom:12 },
  posStat:       { flex:1, backgroundColor:Q.bg2, borderRadius:8, padding:8, alignItems:'center' },
  posStatLabel:  { fontSize:9, color:Q.dim, marginBottom:2 },
  posStatVal:    { fontSize:11, fontWeight:'700' },
  progressBg:    { height:6, backgroundColor:Q.plasma+'20', borderRadius:3, overflow:'hidden', marginBottom:6 },
  progressFill:  { height:6, borderRadius:3 },
  progressLabel: { fontSize:9, color:Q.dim, marginBottom:10 },
  claimBtn:      { padding:10, borderRadius:10, borderWidth:1, alignItems:'center',
                   backgroundColor:Q.lepton+'15' },
  calcResult:    { backgroundColor:Q.bg2, borderRadius:12, padding:16, alignItems:'center', marginBottom:16 },
  calcBig:       { fontSize:32, fontWeight:'900' },
  calcLabel:     { fontSize:11, color:Q.dim, marginTop:4 },
  calcUsd:       { fontSize:13, color:Q.mid, marginTop:2 },
  calcRow:       { flexDirection:'row', justifyContent:'space-between', paddingVertical:6,
                   borderBottomWidth:1, borderBottomColor:Q.plasma+'11' },
  calcRowLabel:  { fontSize:12, color:Q.dim },
  calcRowVal:    { fontSize:11, fontWeight:'700' },
});
