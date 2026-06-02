// ============================================================
//  QUANTUM EMMA — Android AI Oracle Chat v5.0
//  Meta Genius TR2 · 12-Agent · HQMLL · Predictions
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const Q = {
  void:'#000008', bg1:'#06001e', bg2:'#0a002e',
  plasma:'#7c3aed', neutrino:'#8b5cf6', quark:'#a78bfa', gluon:'#06b6d4',
  photon:'#00ffff', higgs:'#fbbf24', boson:'#f472b6', lepton:'#4ade80',
  muon:'#fb923c', tauon:'#f87171', bright:'#f0f4ff', mid:'#94a3b8', dim:'#475569',
};

const RESPONSES = [
  "⚛️ HQMLL Layer 7 analysis complete. QEMMA shows strong momentum divergence. Confidence: 94%. STRONG BUY recommendation confirmed.",
  "🧬 MetaCodex Phase 2 activation detected. All 12 agents synchronized. Recursive loop #4,421 complete. System evolution: +2.3%.",
  "📡 Pattern recognition across 847 data points: Wyckoff Phase C confirmed. Breakout probability: 89%. Target: $1.20 in 30 days.",
  "💎 Portfolio suggestion: Increase QEMMA allocation by 15%. Risk-adjusted Sharpe ratio improves 2.1 → 2.8. Quantum Tier APY: 60%.",
  "🔮 TR2 prediction: Next 24h range $0.58–$0.79. Volatility index 42. Liquidity depth: $2.8M. IDO date: July 15, 2026.",
  "⚡ Arbitrage detected: QEMMA spread 0.34% across 3 DEXes. Estimated profit: $284 on $50K. Execution window: 8 seconds.",
  "🛡 Risk assessment: Max drawdown -18%. VaR(95%): $420. Stop-loss: $0.52. Recommended position size: 3.2% portfolio.",
];

const QUICK_PROMPTS = [
  "Best QEMMA entry?", "Analyze market", "Staking recommendations",
  "Run arbitrage scan", "7-day prediction", "Optimize portfolio",
];

const AGENTS = [
  { name:'ALPHA-7',   load:94,  color:Q.plasma  },
  { name:'MU-10',     load:100, color:Q.lepton  },
  { name:'EPSILON-9', load:99,  color:Q.boson   },
  { name:'DELTA-1',   load:88,  color:Q.photon  },
];

type Msg = { id: number; role: 'user'|'ai'; text: string };

export default function ChatScreen() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, role: 'ai', text: '⚛️ Meta Genius TR2 online. All 12 agents synchronized. HQMLL v7 active. How can I optimize your trading today?' },
  ]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const [tab, setTab]       = useState<'chat'|'agents'|'predictions'>('chat');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, typing]);

  const send = (text?: string) => {
    const t = text || input.trim();
    if (!t) return;
    const userMsg: Msg = { id: Date.now(), role: 'user', text: t };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
      setMessages(m => [...m, { id: Date.now() + 1, role: 'ai', text: reply }]);
    }, 1400 + Math.random() * 600);
  };

  const predictions = [
    { asset:'QEMMA', dir:'UP',   target:'$0.79', conf:94, color:Q.lepton, tf:'24h'  },
    { asset:'QEMMA', dir:'UP',   target:'$1.20', conf:89, color:Q.lepton, tf:'7d'   },
    { asset:'ETH',   dir:'UP',   target:'$3,450',conf:72, color:Q.gluon,  tf:'24h'  },
    { asset:'BTC',   dir:'FLAT', target:'$68K',  conf:61, color:Q.higgs,  tf:'24h'  },
    { asset:'QEMMA', dir:'UP',   target:'$2.50', conf:78, color:Q.plasma, tf:'30d'  },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Q.void} />

      {/* HEADER */}
      <LinearGradient colors={[Q.bg1, Q.bg2]} style={s.header}>
        <View style={s.headerInner}>
          <View style={s.avatar}><Text style={s.avatarText}>Q</Text></View>
          <View>
            <Text style={s.headerTitle}>Quantum Emma</Text>
            <Text style={s.headerSub}>Meta Genius TR2 · HQMLL v7</Text>
          </View>
          <View style={s.onlineDot} />
        </View>
      </LinearGradient>

      {/* TABS */}
      <View style={s.tabRow}>
        {(['chat','agents','predictions'] as const).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}
            style={[s.tabBtn, tab === t && s.tabActive]}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>
              {t === 'chat' ? '💬 Chat' : t === 'agents' ? '🤖 Agents' : '🔮 Predict'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AGENTS TAB */}
      {tab === 'agents' && (
        <ScrollView style={s.scroll}>
          <View style={s.agentSection}>
            {AGENTS.map((a, i) => (
              <LinearGradient key={i} colors={[a.color + '18', a.color + '08']} style={s.agentCard}>
                <View style={s.agentTop}>
                  <View style={[s.agentDot, { backgroundColor: Q.lepton }]} />
                  <Text style={[s.agentName, { color: a.color }]}>{a.name}</Text>
                  <Text style={[s.agentLoad, { color: a.color }]}>{a.load}%</Text>
                </View>
                <View style={s.agentBarBg}>
                  <View style={[s.agentBarFill, { width: `${a.load}%` as any, backgroundColor: a.color }]} />
                </View>
              </LinearGradient>
            ))}
          </View>
        </ScrollView>
      )}

      {/* PREDICTIONS TAB */}
      {tab === 'predictions' && (
        <ScrollView style={s.scroll}>
          <View style={s.predSection}>
            {predictions.map((p, i) => (
              <LinearGradient key={i} colors={[p.color + '15', p.color + '06']} style={s.predCard}>
                <View style={s.predTop}>
                  <Text style={s.predAsset}>{p.asset}</Text>
                  <Text style={s.predTf}>{p.tf}</Text>
                  <Text style={[s.predDir, { color: p.color }]}>{p.dir === 'UP' ? '▲' : '→'} {p.target}</Text>
                  <Text style={[s.predConf, { color: p.color }]}>{p.conf}%</Text>
                </View>
                <View style={s.predBarBg}>
                  <View style={[s.predBarFill, { width: `${p.conf}%` as any, backgroundColor: p.color }]} />
                </View>
              </LinearGradient>
            ))}
          </View>
        </ScrollView>
      )}

      {/* CHAT TAB */}
      {tab === 'chat' && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Messages */}
          <ScrollView ref={scrollRef} style={s.scroll} contentContainerStyle={s.messages}>
            {messages.map(m => (
              <View key={m.id} style={[s.msgRow, m.role === 'user' && s.msgRowUser]}>
                {m.role === 'ai' && <View style={s.aiAvatar}><Text style={s.aiAvatarText}>Q</Text></View>}
                <View style={[s.bubble, m.role === 'user' ? s.bubbleUser : s.bubbleAi]}>
                  {m.role === 'ai' && <Text style={s.bubbleHeader}>QUANTUM EMMA · TR2</Text>}
                  <Text style={s.bubbleText}>{m.text}</Text>
                </View>
              </View>
            ))}
            {typing && (
              <View style={s.msgRow}>
                <View style={s.aiAvatar}><Text style={s.aiAvatarText}>Q</Text></View>
                <View style={s.bubbleAi}>
                  <Text style={s.bubbleHeader}>QUANTUM EMMA · TR2</Text>
                  <Text style={s.typingDots}>● ● ●</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick prompts */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={s.quickScroll} contentContainerStyle={s.quickContent}>
            {QUICK_PROMPTS.map((p, i) => (
              <TouchableOpacity key={i} onPress={() => send(p)} style={s.quickBtn}>
                <Text style={s.quickText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={s.inputRow}>
            <TextInput value={input} onChangeText={setInput}
              placeholder="Ask Meta Genius TR2..." placeholderTextColor={Q.dim}
              style={s.input} multiline onSubmitEditing={() => send()} />
            <TouchableOpacity onPress={() => send()} style={s.sendBtn}>
              <Text style={s.sendIcon}>⚡</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex:1, backgroundColor:Q.void },
  scroll:        { flex:1 },
  header:        { padding:14, borderBottomWidth:1, borderBottomColor:Q.plasma+'33' },
  headerInner:   { flexDirection:'row', alignItems:'center', gap:12 },
  avatar:        { width:40, height:40, borderRadius:20, backgroundColor:Q.plasma,
                   alignItems:'center', justifyContent:'center' },
  avatarText:    { color:Q.bright, fontWeight:'900', fontSize:18 },
  headerTitle:   { fontSize:15, fontWeight:'900', color:Q.bright },
  headerSub:     { fontSize:10, color:Q.dim },
  onlineDot:     { width:8, height:8, borderRadius:4, backgroundColor:Q.lepton, marginLeft:'auto' },
  tabRow:        { flexDirection:'row', margin:10, backgroundColor:Q.bg1,
                   borderRadius:10, padding:4, borderWidth:1, borderColor:Q.plasma+'22' },
  tabBtn:        { flex:1, padding:8, borderRadius:8, alignItems:'center' },
  tabActive:     { backgroundColor:Q.plasma },
  tabText:       { fontSize:11, fontWeight:'700', color:Q.dim },
  tabTextActive: { color:Q.bright },
  messages:      { padding:16, paddingBottom:8 },
  msgRow:        { flexDirection:'row', gap:8, marginBottom:14, alignItems:'flex-end' },
  msgRowUser:    { justifyContent:'flex-end' },
  aiAvatar:      { width:30, height:30, borderRadius:15, backgroundColor:Q.plasma,
                   alignItems:'center', justifyContent:'center', flexShrink:0 },
  aiAvatarText:  { color:Q.bright, fontWeight:'900', fontSize:14 },
  bubble:        { maxWidth:'78%', padding:12, borderRadius:16 },
  bubbleAi:      { backgroundColor:Q.bg2, borderWidth:1, borderColor:Q.plasma+'33',
                   borderBottomLeftRadius:4 },
  bubbleUser:    { backgroundColor:Q.plasma, borderBottomRightRadius:4 },
  bubbleHeader:  { fontSize:9, color:Q.quark, fontWeight:'700', marginBottom:4 },
  bubbleText:    { fontSize:13, color:Q.bright, lineHeight:20 },
  typingDots:    { fontSize:13, color:Q.dim },
  quickScroll:   { maxHeight:44, borderTopWidth:1, borderTopColor:Q.plasma+'22' },
  quickContent:  { paddingHorizontal:12, paddingVertical:8, gap:6, flexDirection:'row' },
  quickBtn:      { paddingHorizontal:12, paddingVertical:5, borderRadius:20,
                   borderWidth:1, borderColor:Q.plasma+'44', backgroundColor:Q.plasma+'18' },
  quickText:     { fontSize:11, color:Q.quark, fontWeight:'600' },
  inputRow:      { flexDirection:'row', padding:10, gap:8,
                   borderTopWidth:1, borderTopColor:Q.plasma+'22' },
  input:         { flex:1, backgroundColor:Q.bg2, borderWidth:1, borderColor:Q.plasma+'44',
                   borderRadius:12, padding:12, color:Q.bright, fontSize:13, maxHeight:100 },
  sendBtn:       { width:46, height:46, borderRadius:12, backgroundColor:Q.plasma,
                   alignItems:'center', justifyContent:'center' },
  sendIcon:      { fontSize:20 },
  agentSection:  { padding:12, gap:10 },
  agentCard:     { borderRadius:12, padding:14, borderWidth:1, borderColor:Q.plasma+'22' },
  agentTop:      { flexDirection:'row', alignItems:'center', gap:8, marginBottom:8 },
  agentDot:      { width:6, height:6, borderRadius:3 },
  agentName:     { fontSize:13, fontWeight:'800', flex:1 },
  agentLoad:     { fontSize:13, fontWeight:'800' },
  agentBarBg:    { height:5, backgroundColor:Q.plasma+'20', borderRadius:3, overflow:'hidden' },
  agentBarFill:  { height:5, borderRadius:3 },
  predSection:   { padding:12, gap:8 },
  predCard:      { borderRadius:12, padding:12, borderWidth:1, borderColor:Q.plasma+'22' },
  predTop:       { flexDirection:'row', alignItems:'center', gap:8, marginBottom:6 },
  predAsset:     { fontWeight:'800', color:Q.bright, fontSize:13, width:55 },
  predTf:        { fontSize:10, color:Q.dim, flex:1 },
  predDir:       { fontSize:12, fontWeight:'700' },
  predConf:      { fontSize:14, fontWeight:'900', width:35, textAlign:'right' },
  predBarBg:     { height:4, backgroundColor:Q.plasma+'20', borderRadius:2, overflow:'hidden' },
  predBarFill:   { height:4, borderRadius:2 },
});
