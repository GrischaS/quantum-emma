// ============================================================
//  QUANTUM EMMA — Android Wallet Screen
//  Web3Modal · WalletConnect · MetaMask · Send/Receive/Swap
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ASSETS = [
  { sym:'QEMMA', name:'Quantum Emma',  icon:'🪙', bal:'24,500.0000', usd:'$15,435.00', color:'#8b5cf6', change:+8.42 },
  { sym:'ETH',   name:'Ethereum',      icon:'⟠',  bal:'5.2000',      usd:'$19,968.00', color:'#06b6d4', change:+1.87 },
  { sym:'USDT',  name:'Tether USD',    icon:'💵', bal:'8,450.00',    usd:'$8,450.00',  color:'#4ade80', change:0    },
  { sym:'USDC',  name:'USD Coin',      icon:'🔵', bal:'4,437.50',    usd:'$4,437.50',  color:'#60a5fa', change:0    },
  { sym:'BNB',   name:'BNB',           icon:'🟡', bal:'2.8400',      usd:'$1,737.00',  color:'#fbbf24', change:+0.91 },
];

export default function WalletScreen() {
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = useState<'assets'|'send'|'receive'|'swap'>('assets');
  const [sendTo, setSendTo] = useState('');
  const [sendAmt, setSendAmt] = useState('');
  const [swapFrom, setSwapFrom] = useState('ETH');
  const [swapAmt, setSwapAmt]   = useState('1');

  const address = '0x742d35Cc6634C0532925a3b8D4C9b6eA7e3f12Ab';
  const totalUSD = '$50,027.50';

  if (!connected) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient colors={['#020008','#0a0025','#020008']} style={styles.bg}>
          <View style={styles.connectHeader}>
            <Text style={styles.connectIcon}>🔗</Text>
            <Text style={styles.connectTitle}>CONNECT WALLET</Text>
            <Text style={styles.connectSub}>Connect to manage QEMMA assets</Text>
          </View>
          {[
            { name:'MetaMask',       icon:'🦊', color:'#fb923c', desc:'Browser Extension' },
            { name:'WalletConnect',  icon:'🔵', color:'#3b99fc', desc:'Mobile QR Code'    },
            { name:'Coinbase Wallet',icon:'🔵', color:'#0052ff', desc:'Coinbase Official' },
            { name:'Trust Wallet',   icon:'🛡', color:'#3375bb', desc:'Binance Wallet'    },
          ].map((w, i) => (
            <TouchableOpacity key={i} onPress={() => setConnected(true)}
              style={[styles.walletBtn, { borderColor: w.color+'44' }]}>
              <Text style={styles.walletIcon}>{w.icon}</Text>
              <View style={styles.walletInfo}>
                <Text style={[styles.walletName, { color: w.color }]}>{w.name}</Text>
                <Text style={styles.walletDesc}>{w.desc}</Text>
              </View>
              <Text style={styles.walletArrow}>→</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.legalText}>© 2026 Grigori Saks — Secure Connection</Text>
        </LinearGradient>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#020008','#0a0025','#020008']} style={styles.bg}>
        {/* Balance header */}
        <LinearGradient colors={['rgba(139,92,246,0.15)','rgba(6,182,212,0.08)']} style={styles.balHeader}>
          <View style={styles.connectedBadge}>
            <View style={styles.greenDot}/>
            <Text style={styles.connectedText}>Connected — MetaMask</Text>
          </View>
          <Text style={styles.totalBalance}>{totalUSD}</Text>
          <Text style={styles.totalLabel}>Total Portfolio</Text>
          <Text style={styles.addressText} numberOfLines={1}>{address}</Text>
          {/* Actions */}
          <View style={styles.actionRow}>
            {[
              {l:'SEND',    icon:'📤', onPress:()=>setTab('send')},
              {l:'RECEIVE', icon:'📥', onPress:()=>setTab('receive')},
              {l:'SWAP',    icon:'🔄', onPress:()=>setTab('swap')},
              {l:'DISCONNECT',icon:'🔌',onPress:()=>setConnected(false)},
            ].map((a, i) => (
              <TouchableOpacity key={i} onPress={a.onPress} style={styles.actionBtn}>
                <Text style={styles.actionIcon}>{a.icon}</Text>
                <Text style={styles.actionLabel}>{a.l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {(['assets','send','receive','swap'] as const).map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Assets */}
        {tab === 'assets' && (
          <View style={styles.section}>
            {ASSETS.map((a, i) => (
              <View key={i} style={styles.assetRow}>
                <Text style={styles.assetIcon}>{a.icon}</Text>
                <View style={styles.assetInfo}>
                  <Text style={[styles.assetSym, { color: a.color }]}>{a.sym}</Text>
                  <Text style={styles.assetName}>{a.name}</Text>
                </View>
                <View style={styles.assetRight}>
                  <Text style={styles.assetUSD}>{a.usd}</Text>
                  <Text style={styles.assetBal}>{a.bal}</Text>
                  <Text style={[styles.assetChange, { color: a.change > 0 ? '#4ade80' : a.change < 0 ? '#f87171' : '#475569' }]}>
                    {a.change > 0 ? '▲' : a.change < 0 ? '▼' : '='}{Math.abs(a.change)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Send */}
        {tab === 'send' && (
          <View style={styles.section}>
            <Text style={styles.formTitle}>📤 SEND QEMMA</Text>
            <TextInput value={sendTo} onChangeText={setSendTo}
              placeholder="Recipient address (0x...)"
              placeholderTextColor="#475569"
              style={styles.formInput}/>
            <TextInput value={sendAmt} onChangeText={setSendAmt}
              placeholder="Amount (QEMMA)"
              placeholderTextColor="#475569" keyboardType="numeric"
              style={styles.formInput}/>
            <View style={styles.feeBox}>
              <Text style={styles.feeLabel}>Estimated Gas</Text>
              <Text style={styles.feeValue}>~$1.20</Text>
            </View>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>📤 SEND TRANSACTION</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Receive */}
        {tab === 'receive' && (
          <View style={[styles.section, styles.receiveCenter]}>
            <Text style={styles.formTitle}>📥 RECEIVE QEMMA</Text>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrText}>QR</Text>
              <Text style={styles.qrSub}>Scan to receive</Text>
            </View>
            <Text style={styles.addressFull}>{address}</Text>
            <TouchableOpacity style={styles.copyBtn}>
              <Text style={styles.copyBtnText}>📋 COPY ADDRESS</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Swap */}
        {tab === 'swap' && (
          <View style={styles.section}>
            <Text style={styles.formTitle}>🔄 DEX SWAP</Text>
            <View style={styles.swapBox}>
              <Text style={styles.swapLabel}>FROM</Text>
              <Text style={styles.swapAmt}>{swapAmt} {swapFrom}</Text>
            </View>
            <Text style={styles.swapArrow}>⇅</Text>
            <View style={styles.swapBox}>
              <Text style={styles.swapLabel}>TO</Text>
              <Text style={[styles.swapAmt, { color: '#4ade80' }]}>
                {(parseFloat(swapAmt || '0') * 2381).toFixed(2)} QEMMA
              </Text>
            </View>
            <View style={styles.feeBox}>
              <Text style={styles.feeLabel}>Rate: 1 ETH = 2,381 QEMMA</Text>
              <Text style={styles.feeValue}>Fee: 0.3%</Text>
            </View>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#f472b6' }]}>
              <Text style={styles.primaryBtnText}>🔄 EXECUTE SWAP</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Web3Modal · WalletConnect · © 2026 Grigori Saks</Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flex:1, backgroundColor:'#020008' },
  bg:            { flex:1, minHeight:'100%' },
  connectHeader: { padding:32, paddingTop:60, alignItems:'center' },
  connectIcon:   { fontSize:52, marginBottom:12 },
  connectTitle:  { fontSize:22, fontWeight:'900', color:'#8b5cf6', letterSpacing:2 },
  connectSub:    { fontSize:12, color:'#475569', marginTop:6 },
  walletBtn:     { flexDirection:'row', alignItems:'center', padding:18, margin:8, marginHorizontal:16, borderRadius:14, backgroundColor:'rgba(0,0,0,0.4)', borderWidth:1 },
  walletIcon:    { fontSize:28, marginRight:14 },
  walletInfo:    { flex:1 },
  walletName:    { fontSize:15, fontWeight:'800' },
  walletDesc:    { fontSize:11, color:'#475569', marginTop:2 },
  walletArrow:   { fontSize:18, color:'#475569' },
  legalText:     { textAlign:'center', color:'#475569', fontSize:10, padding:24 },
  balHeader:     { padding:24, paddingTop:48 },
  connectedBadge:{ flexDirection:'row', alignItems:'center', gap:6, marginBottom:12 },
  greenDot:      { width:8, height:8, borderRadius:4, backgroundColor:'#4ade80' },
  connectedText: { fontSize:12, color:'#4ade80', fontWeight:'700' },
  totalBalance:  { fontSize:36, fontWeight:'900', color:'#fff', fontFamily:'monospace' },
  totalLabel:    { fontSize:11, color:'#475569', marginTop:2 },
  addressText:   { fontSize:10, color:'#475569', marginTop:8, fontFamily:'monospace' },
  actionRow:     { flexDirection:'row', marginTop:20, gap:8 },
  actionBtn:     { flex:1, alignItems:'center', padding:12, borderRadius:12, backgroundColor:'rgba(139,92,246,0.12)', borderWidth:1, borderColor:'rgba(139,92,246,0.25)' },
  actionIcon:    { fontSize:20 },
  actionLabel:   { fontSize:9, color:'#94a3b8', fontWeight:'700', marginTop:4, letterSpacing:1 },
  tabBar:        { flexDirection:'row', padding:8, gap:4 },
  tabBtn:        { flex:1, padding:8, borderRadius:20, backgroundColor:'rgba(139,92,246,0.07)', alignItems:'center' },
  tabBtnActive:  { backgroundColor:'rgba(139,92,246,0.25)' },
  tabText:       { fontSize:9, color:'#475569', fontWeight:'700', letterSpacing:1 },
  tabTextActive: { color:'#c4b5fd' },
  section:       { padding:16 },
  assetRow:      { flexDirection:'row', alignItems:'center', paddingVertical:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.04)' },
  assetIcon:     { fontSize:24, marginRight:12 },
  assetInfo:     { flex:1 },
  assetSym:      { fontSize:14, fontWeight:'800' },
  assetName:     { fontSize:10, color:'#475569', marginTop:2 },
  assetRight:    { alignItems:'flex-end' },
  assetUSD:      { fontSize:14, fontWeight:'700', color:'#e2e8f0' },
  assetBal:      { fontSize:10, color:'#94a3b8', marginTop:2 },
  assetChange:   { fontSize:11, fontWeight:'700', marginTop:2 },
  formTitle:     { fontSize:14, fontWeight:'800', color:'#c4b5fd', letterSpacing:1, marginBottom:14 },
  formInput:     { padding:12, borderRadius:10, backgroundColor:'rgba(0,0,0,0.5)', borderWidth:1, borderColor:'rgba(139,92,246,0.3)', color:'#fff', fontSize:14, marginBottom:10 },
  feeBox:        { flexDirection:'row', justifyContent:'space-between', padding:10, borderRadius:9, backgroundColor:'rgba(0,0,0,0.3)', marginBottom:14 },
  feeLabel:      { fontSize:11, color:'#475569' },
  feeValue:      { fontSize:11, color:'#94a3b8', fontWeight:'700' },
  primaryBtn:    { padding:15, borderRadius:12, backgroundColor:'#8b5cf6', alignItems:'center' },
  primaryBtnText:{ color:'#fff', fontSize:14, fontWeight:'900', letterSpacing:2 },
  receiveCenter: { alignItems:'center' },
  qrPlaceholder: { width:180, height:180, borderRadius:16, backgroundColor:'rgba(139,92,246,0.1)', borderWidth:2, borderColor:'rgba(139,92,246,0.3)', alignItems:'center', justifyContent:'center', margin:20 },
  qrText:        { fontSize:48, color:'#8b5cf6', fontWeight:'900' },
  qrSub:         { fontSize:11, color:'#475569', marginTop:4 },
  addressFull:   { fontSize:11, color:'#94a3b8', fontFamily:'monospace', textAlign:'center', marginBottom:16, paddingHorizontal:16 },
  copyBtn:       { padding:12, borderRadius:10, borderWidth:1, borderColor:'rgba(139,92,246,0.4)' },
  copyBtnText:   { color:'#8b5cf6', fontWeight:'800', fontSize:13 },
  swapBox:       { padding:14, borderRadius:12, backgroundColor:'rgba(0,0,0,0.4)', borderWidth:1, borderColor:'rgba(139,92,246,0.2)', marginBottom:6 },
  swapLabel:     { fontSize:9, color:'#475569', letterSpacing:1, marginBottom:6 },
  swapAmt:       { fontSize:22, fontWeight:'900', color:'#fff' },
  swapArrow:     { textAlign:'center', fontSize:20, color:'#475569', marginVertical:6 },
  footer:        { padding:20, alignItems:'center' },
  footerText:    { fontSize:10, color:'#475569' },
});
