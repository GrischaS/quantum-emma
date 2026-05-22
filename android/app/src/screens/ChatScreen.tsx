// ============================================================
//  QUANTUM EMMA — Android Oracle Chat Screen v4.0
//  Emma AI · 12 Agents · Real-time responses
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Q = {
  void:'#000008', bg1:'#06001e',
  plasma:'#7c3aed', neutrino:'#8b5cf6', gluon:'#06b6d4',
  higgs:'#fbbf24', lepton:'#4ade80', muon:'#fb923c',
  boson:'#f472b6', bright:'#f0f4ff', mid:'#94a3b8', dim:'#475569',
};

const AGENTS = [
  { id: 'emma',   name: 'Emma Oracle', icon: '👁',  color: Q.neutrino, badge: 'ORACLE', acc: '99.1%' },
  { id: 'eta',    name: 'ETA-P',       icon: '🎯',  color: Q.gluon,   badge: 'ANALYST',acc: '93.5%' },
  { id: 'meta',   name: 'META-TR2',    icon: '👑',  color: Q.higgs,   badge: 'MASTER', acc: '99.0%' },
  { id: 'delta',  name: 'Delta-H',     icon: '💚',  color: Q.lepton,  badge: 'HEALER', acc: '98.0%' },
  { id: 'alpha',  name: 'Alpha-Q',     icon: '⚛️',  color: Q.neutrino, badge: 'MINER',  acc: '90.5%' },
  { id: 'lambda', name: 'Lambda-O',    icon: '🎼',  color: '#fcd34d', badge: 'ORCH',   acc: '97.0%' },
];

const RESPONSES: Record<string, string[]> = {
  emma: [
    "META-TR2 Analysis: Bullish Divergenz BTC/USDT 4H. RSI 54.2. Einstieg optimal. Target: +23% in 14 Tagen. Confidence: 73.2%.",
    "QEMMA Phase Analysis: Supply 15.2M/100M — GENESIS 76%. METAMORPH I bei 20M. Historisch: +180% Price Action bei Phase-Transition.",
    "Deep Research: 847 Quellen. DeFi TVL +12% QoQ. QEMMA first-mover BESTÄTIGT. 18 Monate vor Konkurrenz. IP-Moat: STARK.",
    "Krealogoik Event #287: 'Proof-of-Intelligence Consensus'. Originalität: 94%. Viabilität: 89%. Patent eingereicht.",
  ],
  eta: [
    "ETA-P Deep Scan (72h): BTC $72,400–$73,100 (78.4%). Bullish Engulfing 4H. Volume ↑.",
    "QEMMA Signal: CUP & HANDLE Daily Chart. Breakout Target: $0.84. Stop: $0.56. R/R: 1:3.2. STRONG BUY.",
    "Multi-Asset Prognose (30d): +18.4% Portfolio. Höchstes Alpha: QEMMA +34%, SOL +28%.",
  ],
  meta: [
    "META-TR2 Loop #48,202 complete. Effizienz: 98.3%. Krealogoik #287 generiert. 12 Agenten synchron.",
    "HQMLL Epoch 1,248: Loss 0.002→0.0019. +0.5% Verbesserung. Self-Improvement: +3.2%/Zyklus.",
  ],
  delta: [
    "System: NOMINAL. Alle 12 Agenten synchronisiert. 0 kritische Fehler. Smart Contract Integrität: 100%.",
    "Security Scan: 0 Critical, 0 High. ReentrancyGuard: aktiv. Multisig: konfiguriert. Audit: A+.",
  ],
  alpha: [
    "Hash-Rate: 847,291 H/s. Pool ALPHA optimal. Nächster Block: ~12 Sek. Difficulty: 847.2T.",
    "Quantum Hash Batch #14,821. Entropy: MAXIMAL. Superpositions-RNG aktiv. False Positive: 0.003%.",
  ],
  lambda: [
    "847 Tasks verteilt. 12 Agenten aktiv. Load Balance: optimal. LAMBDA-O Effizienz: 97.0%.",
    "Orchestration Report: META-TR2 führt 48% kritische Tasks. ETA-P 23%. ALPHA-Q 18%. Parallelität: MAX.",
  ],
};

const QUICK_PROMPTS = ['📊 Marktanalyse', '🔮 Prognose QEMMA', '⛏ Mining Status', '💎 Staking APY', '🧠 HQMLL Report', '💡 Krealogoik'];

interface Message {
  role: 'user' | 'agent';
  content: string;
  time: string;
  conf?: number;
}

export default function ChatScreen() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [allConvs, setAllConvs] = useState<Record<string, Message[]>>({
    emma: [{ role: 'agent', content: 'Quantum Emma Oracle online. META-TR2 aktiv. Alle 12 Agenten synchronisiert. Wie kann ich helfen, Grigori?', time: '09:00' }],
    eta:  [{ role: 'agent', content: 'ETA-P Predictive Analyzer online. 93.5% historische Genauigkeit. Bereit für Marktprognosen.', time: '09:00' }],
    meta: [{ role: 'agent', content: 'META-TR2 Core Conductor online. Epoch 1,247 aktiv. Alle 12 Agenten orchestriert.', time: '09:00' }],
    delta:[{ role: 'agent', content: 'DELTA-H Healing System online. Alle Systeme nominal. 0 kritische Fehler.', time: '09:00' }],
    alpha:[{ role: 'agent', content: 'ALPHA-Q online. Hash-Rate: 847,291 H/s. Pool ALPHA optimal.', time: '09:00' }],
    lambda:[{ role: 'agent', content: 'LAMBDA-O Orchestrator online. 847 Tasks verteilt. Bereit.', time: '09:00' }],
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const msgs = allConvs[selectedAgent.id] || [];

  const send = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const now = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    setAllConvs(prev => ({
      ...prev,
      [selectedAgent.id]: [...(prev[selectedAgent.id] || []), { role: 'user', content: msg, time: now }],
    }));
    setTyping(true);

    setTimeout(() => {
      const pool = RESPONSES[selectedAgent.id] || RESPONSES.emma;
      const response = pool[Math.floor(Math.random() * pool.length)];
      const conf = Math.round(62 + Math.random() * 35);
      setAllConvs(prev => ({
        ...prev,
        [selectedAgent.id]: [...(prev[selectedAgent.id] || []), { role: 'agent', content: response, time: now, conf }],
      }));
      setTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200 + Math.random() * 900);
  };

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
  }, [selectedAgent.id]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={['#020008', '#0a001e']} style={{ flex: 1 }}>

        {/* Agent Selector */}
        <View style={styles.agentHeader}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {AGENTS.map((a) => (
              <TouchableOpacity key={a.id} onPress={() => setSelectedAgent(a)}
                style={[styles.agentChip, {
                  borderColor: a.color + (selectedAgent.id === a.id ? '88' : '33'),
                  backgroundColor: selectedAgent.id === a.id ? a.color + '22' : a.color + '0a',
                }]}>
                <Text style={styles.agentIcon}>{a.icon}</Text>
                <View>
                  <Text style={[styles.agentName, { color: a.color }]}>{a.name}</Text>
                  <Text style={styles.agentBadge}>{a.badge} · {a.acc}</Text>
                </View>
                {selectedAgent.id === a.id && <View style={[styles.activeDot, { backgroundColor: a.color }]}/>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Agent Info Bar */}
        <View style={[styles.infoBar, { borderColor: selectedAgent.color + '33', backgroundColor: selectedAgent.color + '08' }]}>
          <Text style={styles.infoIcon}>{selectedAgent.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoName, { color: selectedAgent.color }]}>{selectedAgent.name}</Text>
            <Text style={styles.infoRole}>Accuracy: {selectedAgent.acc} · ● ONLINE</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView ref={scrollRef} style={styles.messages} showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 14, gap: 10 }}>
          {msgs.map((m, i) => (
            <View key={i} style={m.role === 'user' ? styles.userMsgWrap : styles.agentMsgWrap}>
              {m.role === 'agent' && (
                <View style={[styles.agentAvatar, { borderColor: selectedAgent.color + '55', backgroundColor: selectedAgent.color + '18' }]}>
                  <Text style={{ fontSize: 16 }}>{selectedAgent.icon}</Text>
                </View>
              )}
              <View style={{ maxWidth: '82%' }}>
                <View style={m.role === 'user' ? styles.userBubble : [styles.agentBubble, { borderColor: selectedAgent.color + '33', backgroundColor: selectedAgent.color + '10' }]}>
                  <Text style={styles.msgText}>{m.content}</Text>
                </View>
                {m.role === 'agent' && m.conf && (
                  <View style={styles.confRow}>
                    <Text style={styles.confLbl}>Confidence:</Text>
                    <View style={styles.confBarBg}>
                      <View style={[styles.confBarFill, { width: `${m.conf}%`, backgroundColor: selectedAgent.color }]}/>
                    </View>
                    <Text style={[styles.confVal, { color: selectedAgent.color }]}>{m.conf}%</Text>
                  </View>
                )}
                <Text style={styles.msgTime}>{m.time} · {m.role === 'user' ? 'You' : selectedAgent.name}</Text>
              </View>
            </View>
          ))}
          {typing && (
            <View style={styles.agentMsgWrap}>
              <View style={[styles.agentAvatar, { borderColor: selectedAgent.color + '55', backgroundColor: selectedAgent.color + '18' }]}>
                <Text style={{ fontSize: 16 }}>{selectedAgent.icon}</Text>
              </View>
              <View style={[styles.typingBubble, { borderColor: selectedAgent.color + '28', backgroundColor: selectedAgent.color + '0a' }]}>
                {[0, 1, 2].map(j => <View key={j} style={[styles.typingDot, { backgroundColor: selectedAgent.color, opacity: 0.3 + j * 0.25 }]}/>)}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick prompts */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
          {QUICK_PROMPTS.map((p, i) => (
            <TouchableOpacity key={i} onPress={() => send(p)}
              style={styles.quickChip}>
              <Text style={styles.quickText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput value={input} onChangeText={setInput}
            placeholder={`Message ${selectedAgent.name}...`}
            placeholderTextColor={Q.dim}
            style={[styles.input, { borderColor: Q.plasma + '44' }]}
            onSubmitEditing={() => send()}
            returnKeyType="send"/>
          <TouchableOpacity onPress={() => send()} style={[styles.sendBtn, { backgroundColor: input.trim() && !typing ? Q.plasma : Q.dim + '44' }]}>
            <Text style={styles.sendText}>↑</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>⚛️ Meta Genius TR2 · HQMLL · Krealogoik · © 2026 Grigori Saks</Text>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#000008' },
  agentHeader:    { paddingHorizontal: 14, paddingTop: 52, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(124,58,237,0.2)' },
  agentChip:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 8, padding: 10, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, position: 'relative' },
  agentIcon:      { fontSize: 20 },
  agentName:      { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  agentBadge:     { fontSize: 8, color: '#475569', marginTop: 2 },
  activeDot:      { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 4 },
  infoBar:        { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, paddingHorizontal: 14, borderBottomWidth: 1 },
  infoIcon:       { fontSize: 20 },
  infoName:       { fontSize: 13, fontWeight: '900' },
  infoRole:       { fontSize: 9, color: '#94a3b8', marginTop: 2 },
  messages:       { flex: 1 },
  userMsgWrap:    { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  agentMsgWrap:   { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 8 },
  agentAvatar:    { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  userBubble:     { padding: 12, borderRadius: 16, borderBottomRightRadius: 4, backgroundColor: 'rgba(124,58,237,0.45)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.55)' },
  agentBubble:    { padding: 12, borderRadius: 16, borderBottomLeftRadius: 4, borderWidth: 1 },
  msgText:        { fontSize: 13, color: '#f0f4ff', lineHeight: 20 },
  msgTime:        { fontSize: 9, color: '#475569', marginTop: 4 },
  confRow:        { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  confLbl:        { fontSize: 9, color: '#475569' },
  confBarBg:      { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' },
  confBarFill:    { height: 3, borderRadius: 2 },
  confVal:        { fontSize: 9, fontWeight: '700' },
  typingBubble:   { flexDirection: 'row', gap: 5, padding: 12, borderRadius: 16, borderBottomLeftRadius: 4, borderWidth: 1, alignItems: 'center' },
  typingDot:      { width: 7, height: 7, borderRadius: 4 },
  quickScroll:    { paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(124,58,237,0.15)' },
  quickChip:      { marginRight: 8, padding: 7, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'rgba(124,58,237,0.1)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.25)' },
  quickText:      { fontSize: 10, fontWeight: '600', color: '#94a3b8' },
  inputRow:       { flexDirection: 'row', gap: 10, padding: 14, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(124,58,237,0.2)' },
  input:          { flex: 1, padding: 12, borderRadius: 22, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.5)', color: '#f0f4ff', fontSize: 13 },
  sendBtn:        { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendText:       { fontSize: 20, color: '#fff', fontWeight: '900' },
  footer:         { paddingHorizontal: 14, paddingBottom: 14, alignItems: 'center' },
  footerText:     { fontSize: 8, color: '#475569', textAlign: 'center' },
});
