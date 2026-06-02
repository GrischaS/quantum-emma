// ============================================================
//  QUANTUM EMMA — Android Wallet & Portfolio v5.0
//  Live Holdings · P&L · Staking · Send/Receive
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect } from 'react';
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

const ASSETS = [
  { sym:'QEMMA', name:'Quantum Emma',  balance:50000,  price:0.6300, change:+2.47,  color:Q.neutrino },
  { sym:'ETH',   name:'Ethereum',       balance:3.24,   price:3241.5, change:+1.12,  color:Q.gluon   },
  { sym:'BTC',   name:'Bitcoin',         balance:0.082,  price:67820,  change:-0.34,  color:Q.higgs   },
  { sym:'USDT',  name:'Tether',          balance:4200,   price:1.00,   change:+0.01,  color:Q.lepton  },
];

const TX_HISTORY = [
  { type:'Swap',    desc:'ETH → QEMMA',    amt:'+15,820 QEMMA', usd:'$9,968', time:'2h ago',  color:Q.lepton,  icon:'⚡' },
  { type:'Stake',   desc:'QEMMA Quantum',  amt:'-25,000 QEMMA', usd:'$15,750',time:'1d ago',  color:Q.plasma, icon:'🔒' },
  { type:'Receive', desc:'Mining Reward',   amt:'+420 QEMMA',    usd:'$265',   time:'2d ago',  color:Q.lepton,  icon:'⛏' },
  { type:'Send',    desc:'→ 0x7f3a...',    amt:'-500 USDT',     usd:'$500',   time:'3d ago',  color:Q.tauon,   icon:'↗' },
  { type:'Buy',     desc:'ETH Purchase',   amt:'+1.5 ETH',      usd:'$4,862', time:'5d ago',  color:Q.gluon,   icon:'💎' },
];

export default function WalletScreen() {
  const [tick, setTick] = useState(0);
  const [tab, setTab]   = useState<'portfolio'|'send'|'receive'|'history'>('portfolio');
  const [sendTo, setSendTo]   = useState('');
  const [sendAmt, setSendAmt] = useState('');
  const [sent, setSent]       = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => { const id = setInterval(() => setTick(t => t+1), 1000); return () => clearInterval(id); }, []);

  const prices = ASSETS.map(a => ({
    ...a,
    price: a.sym === 'USDT' ? 1 : a.price * (1 + Math.sin(tick * 0.05 + ASSETS.indexOf(a)) * 0.003),
  }));
  const totalValue = prices.reduce((s, a) => s + a.balance * a.price, 0);
  const totalPnl   = prices.reduce((s, a) => s + a.balance * a.price * a.change / 100, 0);

  const connect = () => {
    setConnecting(true);
    setTimeout(() => { setConnecting(false); setWalletConnected(true); }, 1800);
  };
  const handleSend = () => {
    setSent(true); setSendTo(''); setSendAmt('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Q.void} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.header}>
          <Text style={s.headerTitle}>💼 Portfolio v5.0</Text>
          <Text style={s.totalVal}>${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
          <Text style={[s.pnl, { color: totalPnl >= 0 ? Q.lepton : Q.tauon }]}>
            {totalPnl >= 0 ? '▲' : '▼'} ${Math.abs(totalPnl).toFixed(2)} today
          </Text>
          {walletConnected ? (
            <View style={s.connectedBadge}>
              <View style={s.connectedDot} />
              <Text style={s.connectedText}>0x7f3a...k9Qm</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={connect} style={s.connectBtn}>
              <Text style={s.connectText}>{connecting ? '⏳ Connecting...' : '🔗 Connect Wallet'}</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* TABS */}
        <View style={s.tabRow}>
          {(['portfolio','send','receive','history'] as const).map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)}
              style={[s.tabBtn, tab === t && s.tabActive]}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>
                {t === 'portfolio' ? '💼' : t === 'send' ? '📤' : t === 'receive' ? '📥' : '📋'}
                {' '}{t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PORTFOLIO */}
        {tab === 'portfolio' && (
          <View style={s.section}>
            {prices.map((a, i) => {
              const value = a.balance * a.price;
              const isUp  = a.change >= 0;
              return (
                <LinearGradient key={i} colors={[a.color + '12', a.color + '06']} style={s.assetCard}>
                  <View style={[s.assetDot, { backgroundColor: a.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.assetSym}>{a.sym}</Text>
                    <Text style={s.assetName}>{a.name}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.assetVal}>${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                    <Text style={[s.assetChg, { color: isUp ? Q.lepton : Q.tauon }]}>
                      {isUp ? '+' : ''}{a.change.toFixed(2)}% · {a.balance.toLocaleString()} {a.sym}
                    </Text>
                  </View>
                </LinearGradient>
              );
            })}
          </View>
        )}

        {/* SEND */}
        {tab === 'send' && (
          <LinearGradient colors={[Q.bg1, Q.bg2]} style={[s.card, { marginBottom: 32 }]}>
            <Text style={s.cardTitle}>📤 Send Tokens</Text>
            <TextInput placeholder="Recipient Address (0x...)" placeholderTextColor={Q.dim}
              value={sendTo} onChangeText={setSendTo} style={s.input} />
            <TextInput placeholder="Amount" placeholderTextColor={Q.dim} keyboardType="numeric"
              value={sendAmt} onChangeText={setSendAmt} style={s.input} />
            <View style={s.tokenRow}>
              {['QEMMA','ETH','USDT'].map(t => (
                <TouchableOpacity key={t} style={s.tokenBtn}>
                  <Text style={{ color: Q.quark, fontSize: 11, fontWeight: '700' }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {sendTo && sendAmt ? (
              <View style={s.txInfo}>
                <Text style={s.txInfoText}>Network fee: ~$2.40 ETH</Text>
                <Text style={s.txInfoText}>Total: {sendAmt} + fee</Text>
              </View>
            ) : null}
            <TouchableOpacity onPress={handleSend}
              style={[s.actionBtn, { backgroundColor: sent ? Q.lepton : Q.plasma, opacity: sendTo && sendAmt ? 1 : 0.4 }]}>
              <Text style={s.actionBtnText}>{sent ? '✅ Sent!' : '📤 Confirm Send'}</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* RECEIVE */}
        {tab === 'receive' && (
          <LinearGradient colors={[Q.bg1, Q.bg2]} style={[s.card, { alignItems: 'center', marginBottom: 32 }]}>
            <Text style={s.cardTitle}>📥 Receive QEMMA</Text>
            {/* QR Placeholder */}
            <View style={s.qrBox}>
              <Text style={{ fontSize: 60 }}>⬛</Text>
              <Text style={{ color: Q.dim, fontSize: 10, marginTop: 8 }}>QR Code</Text>
            </View>
            <View style={s.addrBox}>
              <Text style={s.addrText} numberOfLines={1} ellipsizeMode="middle">
                0x7f3a9bC4...k9QmX1234
              </Text>
            </View>
            <Text style={{ color: Q.dim, fontSize: 11, marginTop: 8, textAlign:'center' }}>
              Only send QEMMA and ERC-20 tokens{'\n'}to this address
            </Text>
          </LinearGradient>
        )}

        {/* HISTORY */}
        {tab === 'history' && (
          <View style={[s.section, { marginBottom: 32 }]}>
            <Text style={s.sectionTitle}>📋 Transaction History</Text>
            {TX_HISTORY.map((tx, i) => (
              <LinearGradient key={i} colors={[tx.color + '10', tx.color + '04']} style={s.txCard}>
                <Text style={s.txIcon}>{tx.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.txType}>{tx.type}</Text>
                  <Text style={s.txDesc}>{tx.desc}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[s.txAmt, { color: tx.color }]}>{tx.amt}</Text>
                  <Text style={s.txTime}>{tx.usd} · {tx.time}</Text>
                </View>
              </LinearGradient>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex:1, backgroundColor:Q.void },
  scroll:        { flex:1 },
  header:        { padding:20, alignItems:'center', borderRadius:16, margin:12,
                   borderWidth:1, borderColor:Q.plasma+'33' },
  headerTitle:   { fontSize:13, fontWeight:'800', color:Q.quark, marginBottom:8 },
  totalVal:      { fontSize:32, fontWeight:'900', color:Q.bright },
  pnl:           { fontSize:14, fontWeight:'700', marginBottom:12 },
  connectedBadge:{ flexDirection:'row', alignItems:'center', gap:6,
                   backgroundColor:Q.lepton+'18', borderRadius:20, paddingHorizontal:12, paddingVertical:6 },
  connectedDot:  { width:6, height:6, borderRadius:3, backgroundColor:Q.lepton },
  connectedText: { color:Q.lepton, fontSize:11, fontFamily:'monospace' },
  connectBtn:    { backgroundColor:Q.plasma, borderRadius:12, paddingHorizontal:20, paddingVertical:10 },
  connectText:   { color:Q.bright, fontWeight:'800', fontSize:13 },
  tabRow:        { flexDirection:'row', marginHorizontal:12, marginBottom:10,
                   backgroundColor:Q.bg1, borderRadius:10, padding:4,
                   borderWidth:1, borderColor:Q.plasma+'22' },
  tabBtn:        { flex:1, padding:7, borderRadius:8, alignItems:'center' },
  tabActive:     { backgroundColor:Q.plasma },
  tabText:       { fontSize:10, fontWeight:'700', color:Q.dim },
  tabTextActive: { color:Q.bright },
  section:       { paddingHorizontal:12 },
  sectionTitle:  { fontSize:13, fontWeight:'800', color:Q.quark, marginBottom:10 },
  assetCard:     { flexDirection:'row', alignItems:'center', borderRadius:12, padding:14,
                   marginBottom:8, borderWidth:1, borderColor:Q.plasma+'22', gap:10 },
  assetDot:      { width:36, height:36, borderRadius:18 },
  assetSym:      { fontSize:14, fontWeight:'800', color:Q.bright },
  assetName:     { fontSize:10, color:Q.dim },
  assetVal:      { fontSize:14, fontWeight:'800', color:Q.bright },
  assetChg:      { fontSize:10, marginTop:2 },
  card:          { marginHorizontal:12, borderRadius:16, padding:16,
                   borderWidth:1, borderColor:Q.plasma+'22' },
  cardTitle:     { fontSize:13, fontWeight:'800', color:Q.quark, marginBottom:12 },
  input:         { backgroundColor:Q.bg2, borderWidth:1, borderColor:Q.plasma+'44',
                   borderRadius:10, padding:12, color:Q.bright, fontSize:13,
                   marginBottom:10 },
  tokenRow:      { flexDirection:'row', gap:8, marginBottom:12 },
  tokenBtn:      { flex:1, padding:8, borderRadius:8, borderWidth:1,
                   borderColor:Q.quark+'44', backgroundColor:Q.plasma+'15', alignItems:'center' },
  txInfo:        { backgroundColor:Q.bg2, borderRadius:8, padding:10, marginBottom:12 },
  txInfoText:    { fontSize:10, color:Q.dim },
  actionBtn:     { padding:14, borderRadius:12, alignItems:'center' },
  actionBtnText: { fontSize:14, fontWeight:'900', color:Q.bright },
  qrBox:         { width:120, height:120, backgroundColor:Q.bg2, borderRadius:12,
                   borderWidth:1, borderColor:Q.plasma+'44', alignItems:'center',
                   justifyContent:'center', marginVertical:16 },
  addrBox:       { backgroundColor:Q.bg2, borderRadius:10, padding:12,
                   borderWidth:1, borderColor:Q.plasma+'44', width:'100%' },
  addrText:      { color:Q.mid, fontSize:12, fontFamily:'monospace', textAlign:'center' },
  txCard:        { flexDirection:'row', alignItems:'center', borderRadius:12, padding:12,
                   marginBottom:8, borderWidth:1, borderColor:Q.plasma+'22', gap:10 },
  txIcon:        { fontSize:22, width:32, textAlign:'center' },
  txType:        { fontSize:12, fontWeight:'700', color:Q.bright },
  txDesc:        { fontSize:10, color:Q.dim, marginTop:2 },
  txAmt:         { fontSize:12, fontWeight:'700' },
  txTime:        { fontSize:10, color:Q.dim, marginTop:2 },
});
