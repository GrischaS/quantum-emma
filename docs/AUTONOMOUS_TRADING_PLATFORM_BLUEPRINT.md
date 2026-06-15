# ⚛️ Autonomous AI Trading Platform — Complete Technical Blueprint
# © 2026 Grigori Saks — Quantum Emma Enterprise
# Version: 1.0.0 | Classification: CONFIDENTIAL — Patent Pending

---

## TEIL 1 — GESAMTARCHITEKTUR

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                               │
│  Web App (React/Next.js)  │  Mobile App (React Native/Expo)    │
│  PWA + Desktop Electron   │  iOS + Android                     │
└────────────────┬────────────────────────────────────┬──────────┘
                 │ HTTPS/WSS                           │
┌────────────────▼────────────────────────────────────▼──────────┐
│               API GATEWAY (BFF — Backend for Frontend)         │
│   Rate Limiting · Auth · TLS Termination · WebSocket Proxy     │
└──┬──────────┬──────────┬──────────┬──────────┬──────────┬──────┘
   │          │          │          │          │          │
┌──▼──┐  ┌───▼──┐  ┌────▼──┐  ┌───▼──┐  ┌───▼──┐  ┌────▼──┐
│Auth │  │Market│  │Order  │  │Wallet│  │Porto │  │  AI   │
│KYC  │  │Data  │  │Mgmt   │  │Fiat  │  │folio │  │Engine │
│AML  │  │WS    │  │OMS    │  │Crypto│  │Risk  │  │Oracle │
└──┬──┘  └───┬──┘  └────┬──┘  └───┬──┘  └───┬──┘  └────┬──┘
   │          │          │          │          │          │
┌──▼──────────▼──────────▼──────────▼──────────▼──────────▼──────┐
│                    MESSAGE BUS (Kafka / NATS)                   │
│  Topics: market.ticks · orders.events · wallet.events          │
│          ai.signals · risk.alerts · compliance.events          │
└──┬──────────┬──────────┬──────────┬──────────┬──────────┬──────┘
   │          │          │          │          │          │
┌──▼──┐  ┌───▼────┐  ┌───▼────┐  ┌──▼──┐  ┌───▼────┐  ┌──▼────┐
│OLTP │  │TimeSer.│  │Ledger  │  │S3/  │  │Redis   │  │Vault  │
│PG   │  │Clickh. │  │Events  │  │Data │  │Cache   │  │Secrets│
│Users│  │Candles │  │Double- │  │Lake │  │Session │  │Keys   │
│Order│  │Ticks   │  │Entry   │  │Parq.│  │Locks   │  │HSM    │
└─────┘  └────────┘  └────────┘  └─────┘  └────────┘  └───────┘
```

---

## TEIL 2 — LIVE MARKTDATEN ARCHITEKTUR (WebSocket Enterprise)

### 2.1 Externe Datenquellen

```yaml
CRYPTO_FEEDS:
  primary:
    - provider: Binance WebSocket
      url: wss://stream.binance.com:9443/ws
      channels: [aggTrade, bookTicker, kline_1m, depth20]
      latency: <10ms
    - provider: Kraken WebSocket
      url: wss://ws.kraken.com
      channels: [ticker, book, ohlc, trade]
    - provider: Coinbase Advanced Trade
      url: wss://advanced-trade-ws.coinbase.com
      channels: [market_trades, ticker, level2]
    - provider: CoinGecko Enterprise
      url: wss://api.coingecko.com/api/v3/ws
      channels: [ticker, kline, depth]
      plan: Enterprise (SLA 99.9%)

  metadata:
    - CoinGecko REST: logos, categories, market_cap, descriptions
    - CryptoLogos API: https://img.logo.dev/crypto/{symbol}
    - CoinMarketCap: ranking, supply, fully_diluted_valuation

EQUITY_FEEDS:
  - provider: Polygon.io
    streams: [Trades, Quotes, Aggregates, ForexQuotes]
    coverage: US Stocks, FX, Options, Futures
  - provider: EODHD
    streams: [EOD, Intraday, Realtime via WebSocket]
    coverage: Global (70+ exchanges)
  - provider: Alpaca Market Data
    streams: [Bars, Trades, Quotes, Crypto]
    coverage: US + Crypto

BLOCKCHAIN_FEEDS:
  - Alchemy WebSocket (ETH, Polygon, Base)
  - Infura (ETH Mainnet/Testnet)
  - Solana RPC WebSocket
  - Bitcoin Node (ZMQ Publisher)
```

### 2.2 Market Data Ingestion Service

```typescript
// services/market-data/ingestion.ts

interface TickEvent {
  symbol:     string;      // "BTC-USDT"
  exchange:   string;      // "binance"
  price:      string;      // "67420.50"
  bid:        string;
  ask:        string;
  volume24h:  string;
  ts:         number;      // Unix ms
  type:       "tick" | "trade" | "book_update";
}

interface CandleBar {
  symbol:    string;
  exchange:  string;
  interval:  "1s"|"1m"|"5m"|"15m"|"1h"|"4h"|"1d";
  open:      string;
  high:      string;
  low:       string;
  close:     string;
  volume:    string;
  ts:        number;
  closed:    boolean;
}

interface OrderBookUpdate {
  symbol:  string;
  bids:    Array<[string, string]>;  // [price, qty]
  asks:    Array<[string, string]>;
  ts:      number;
}

// WebSocket Connection Manager
class MarketDataGateway {
  private connections: Map<string, WebSocket> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map();

  async subscribe(provider: string, symbols: string[], channels: string[]) {
    // 1. Verbindung aufbauen oder wiederverwenden
    // 2. Subscribe-Message senden
    // 3. Events normalisieren → internes Schema
    // 4. Auf Kafka-Topic "market.ticks" publishen
    // 5. Reconnect-Logik mit exponential backoff
  }

  private normalize(raw: any, provider: string): TickEvent {
    // Provider-spezifische Felder → internes Schema übersetzen
  }
}
```

### 2.3 Time-Series Storage (ClickHouse Schema)

```sql
-- Tick Storage
CREATE TABLE market_ticks (
    symbol      LowCardinality(String),
    exchange    LowCardinality(String),
    price       Decimal(20, 8),
    bid         Decimal(20, 8),
    ask         Decimal(20, 8),
    volume      Decimal(30, 8),
    ts          DateTime64(3, 'UTC')
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(ts)
ORDER BY (symbol, exchange, ts)
TTL ts + INTERVAL 90 DAY;

-- OHLCV Candles (aggregiert)
CREATE TABLE market_candles (
    symbol    LowCardinality(String),
    interval  LowCardinality(String),
    open      Decimal(20, 8),
    high      Decimal(20, 8),
    low       Decimal(20, 8),
    close     Decimal(20, 8),
    volume    Decimal(30, 8),
    ts        DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(ts)
ORDER BY (symbol, interval, ts);

-- Order Book Snapshots
CREATE TABLE orderbook_snapshots (
    symbol     LowCardinality(String),
    side       Enum8('bid'=1, 'ask'=2),
    price      Decimal(20, 8),
    quantity   Decimal(30, 8),
    level      UInt8,
    ts         DateTime64(3, 'UTC')
) ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(ts)
ORDER BY (symbol, side, level, ts)
TTL ts + INTERVAL 7 DAY;
```

---

## TEIL 3 — ORDER MANAGEMENT SYSTEM (OMS)

### 3.1 Vollständige REST API Spec

```yaml
openapi: 3.1.0
info:
  title: Quantum Emma Trading API
  version: "1.0"

paths:
  /v1/orders:
    post:
      summary: Order platzieren
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderRequest'
      responses:
        "201":
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'

  /v1/orders/{orderId}:
    get:
      summary: Order Status abrufen
    delete:
      summary: Order stornieren

  /v1/positions:
    get:
      summary: Alle offenen Positionen

  /v1/portfolio/summary:
    get:
      summary: Portfolio Gesamtübersicht

components:
  schemas:
    OrderRequest:
      type: object
      required: [symbol, side, type, quantity]
      properties:
        clientOrderId:  { type: string }
        symbol:         { type: string, example: "BTC-USDT" }
        side:           { type: string, enum: [BUY, SELL] }
        type:           { type: string, enum: [MARKET, LIMIT, STOP, STOP_LIMIT, OCO, TRAILING_STOP] }
        quantity:       { type: string, example: "0.05" }
        price:          { type: string, description: "Nur bei LIMIT/STOP_LIMIT" }
        stopPrice:      { type: string }
        timeInForce:    { type: string, enum: [GTC, IOC, FOK, GTD] }
        trailAmount:    { type: string }
        leverage:       { type: integer, default: 1 }
        postOnly:       { type: boolean, default: false }
        reduceOnly:     { type: boolean, default: false }
        source:         { type: string, enum: [MANUAL, AI_STRATEGY, AUTO_REBALANCE] }
        strategyId:     { type: string }

    Order:
      allOf:
        - $ref: '#/components/schemas/OrderRequest'
        - type: object
          properties:
            orderId:            { type: string }
            status:             { type: string, enum: [NEW, PENDING, PARTIALLY_FILLED, FILLED, CANCELLED, REJECTED, EXPIRED] }
            filledQuantity:     { type: string }
            remainingQuantity:  { type: string }
            avgFillPrice:       { type: string }
            fees:               { type: string }
            feeCurrency:        { type: string }
            broker:             { type: string, example: "alpaca" }
            externalOrderId:    { type: string }
            createdAt:          { type: string, format: date-time }
            updatedAt:          { type: string, format: date-time }
            fills:
              type: array
              items:
                $ref: '#/components/schemas/Fill'

    Fill:
      properties:
        fillId:    { type: string }
        price:     { type: string }
        quantity:  { type: string }
        fee:       { type: string }
        ts:        { type: string, format: date-time }

    Position:
      properties:
        symbol:          { type: string }
        assetType:       { type: string, enum: [CRYPTO, EQUITY, ETF, FX, DERIVATIVE] }
        quantity:        { type: string }
        side:            { type: string, enum: [LONG, SHORT] }
        avgEntryPrice:   { type: string }
        markPrice:       { type: string }
        liquidationPrice:{ type: string }
        unrealizedPnl:   { type: string }
        realizedPnl:     { type: string }
        leverage:        { type: integer }
        marginUsed:      { type: string }
        updatedAt:       { type: string, format: date-time }
```

### 3.2 Broker Adapter Interface

```typescript
// Jeder Broker implementiert dieses Interface
interface BrokerAdapter {
  name: string;  // "alpaca" | "interactivebrokers" | "kraken" | "binance"

  placeOrder(order: OrderRequest): Promise<Order>;
  cancelOrder(orderId: string): Promise<void>;
  modifyOrder(orderId: string, params: Partial<OrderRequest>): Promise<Order>;
  getOrder(orderId: string): Promise<Order>;
  getOpenOrders(symbol?: string): Promise<Order[]>;
  getPositions(): Promise<Position[]>;
  getBalance(): Promise<Balance[]>;
  subscribeOrderUpdates(cb: (event: OrderEvent) => void): void;
}

// Broker-Konfiguration
const BROKERS: Record<string, BrokerConfig> = {
  alpaca: {
    adapter:  AlpacaAdapter,
    assets:   ["US_STOCKS", "CRYPTO"],
    sandbox:  "https://paper-api.alpaca.markets",
    live:     "https://api.alpaca.markets",
    wsUrl:    "wss://stream.data.alpaca.markets",
    auth:     "API_KEY_SECRET",
  },
  kraken: {
    adapter:  KrakenAdapter,
    assets:   ["CRYPTO", "FX"],
    restUrl:  "https://api.kraken.com/0",
    wsUrl:    "wss://ws.kraken.com",
    auth:     "API_KEY_SECRET",
  },
  interactivebrokers: {
    adapter:  IBAdapter,
    assets:   ["GLOBAL_STOCKS", "ETF", "OPTIONS", "FUTURES", "FX"],
    protocol: "TWS_API",  // IB TWS / Gateway
    auth:     "IB_GATEWAY",
  },
};
```

---

## TEIL 4 — WALLET & FIAT INTEGRATION

### 4.1 Crypto Wallet Service

```typescript
// Vollständiges Datenmodell

interface WalletAsset {
  asset:           string;      // "BTC"
  name:            string;      // "Bitcoin"
  chain:           string;      // "BTC" | "ETH" | "SOL" | "BNB"
  contractAddress: string|null; // ERC-20 etc.
  logoUrl:         string;      // "https://img.logo.dev/crypto/btc"
  decimals:        number;
  category:        "L1"|"L2"|"STABLECOIN"|"DEFI"|"NFT"|"MEME";
  coingeckoId:     string;
  depositEnabled:  boolean;
  withdrawEnabled: boolean;
  withdrawFee:     string;
  withdrawMin:     string;
  withdrawMax:     string;
  confirmations:   number;      // Anzahl bestätigungen für Deposit
  networks:        Network[];   // Mehrere Netzwerke pro Coin
}

interface DepositAddress {
  userId:    string;
  asset:     string;
  chain:     string;
  address:   string;
  tag:       string|null;  // Für XRP, XLM, etc.
  createdAt: string;
  expiresAt: string|null;
}

interface WithdrawalRequest {
  asset:       string;
  chain:       string;
  amount:      string;
  address:     string;
  tag:         string|null;
  travelRule:  TravelRuleData;  // FATF/AMLR Pflicht
  notes:       string;
}

interface TravelRuleData {
  beneficiaryName:     string;
  beneficiaryVASP:     string|null;  // Name der Ziel-Börse falls bekannt
  beneficiaryAddress:  string;       // Wohnadresse
  originatorName:      string;       // = User Name (aus KYC)
}

// Withdrawal Status Flow:
// INITIATED → PENDING_KYC → PENDING_REVIEW → APPROVED → BROADCASTING → CONFIRMING → COMPLETED
//                                          → REJECTED
```

### 4.2 Blockchain Listener (On-Chain Events)

```typescript
// Für ETH/ERC-20 (Alchemy WebSocket)
const alchemyWs = new WebSocket("wss://eth-mainnet.g.alchemy.com/v2/{API_KEY}");

alchemyWs.send(JSON.stringify({
  jsonrpc: "2.0",
  method:  "eth_subscribe",
  params:  ["logs", {
    address: "0xYOUR_CONTRACT_OR_WALLET",
    topics:  []
  }],
  id: 1,
}));

// Event → interne Buchung
async function processDeposit(txHash: string, asset: string, amount: string, toAddress: string) {
  // 1. Adresse auflösen → UserId (aus deposit_addresses Tabelle)
  // 2. Warten auf N Confirmations
  // 3. FIAT-Ledger Buchung: DEBIT Bank-Sammelkonto, CREDIT User-Wallet
  // 4. Notification an User senden
  // 5. KYC/AML Screening auf Deposit-Adresse (Chainalysis etc.)
  // 6. Kafka-Event: "wallet.deposit.confirmed"
}
```

### 4.3 Fiat Integration (PSD2 / SEPA)

```typescript
// Open-Banking Provider: Token, Plaid, Tink, GoCardless

interface BankAccount {
  iban:          string;
  bic:           string;
  bankName:      string;
  accountHolder: string;
  currency:      string;  // "EUR"
  verified:      boolean; // Micro-Deposit verifiziert
}

interface FiatDeposit {
  method:    "SEPA"|"SEPA_INSTANT"|"SWIFT";
  amount:    string;
  currency:  "EUR"|"USD"|"GBP";
  reference: string;  // Einmaliger Verwendungszweck für Zuordnung
  bankDetails: {
    iban: string;
    bic:  string;
    name: string;  // "Quantum Emma GmbH"
  };
}

interface FiatWithdrawal {
  amount:      string;
  currency:    "EUR";
  targetIban:  string;  // IBAN des Nutzers (aus Onboarding)
  targetBic:   string;
  reference:   string;
  method:      "SEPA"|"SEPA_INSTANT";
}

// PSD2 Consent Flow:
// 1. User verbindet Bank via Open-Banking (OAuth2 + eIDAS)
// 2. Consent-Token speichern (AISP: Kontodaten lesen)
// 3. Einzahlungen: User überweist manuell mit Referenz-Code
// 4. Webhook von Bank/Zahlungsdienstleister: Eingang bestätigt
// 5. Interne Buchung: CREDIT User-Konto
```

---

## TEIL 5 — KYC / AML SYSTEM

```typescript
// KYC Onboarding Flow

enum KYCStatus {
  NOT_STARTED  = "NOT_STARTED",
  IN_PROGRESS  = "IN_PROGRESS",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED     = "APPROVED",
  REJECTED     = "REJECTED",
  REQUIRES_UPDATE = "REQUIRES_UPDATE",
}

interface KYCProfile {
  userId:            string;
  status:            KYCStatus;
  tier:              1|2|3;  // T1: basis, T2: erweitert, T3: institutionell
  personalData: {
    firstName:       string;
    lastName:        string;
    dob:             string;
    nationality:     string;
    address:         Address;
    taxId:           string;   // Steuer-ID
    pepStatus:       boolean;  // Politically Exposed Person
    sanctionsHit:    boolean;
  };
  documents: {
    idType:          "PASSPORT"|"ID_CARD"|"DRIVERS_LICENSE";
    idNumber:        string;
    idExpiry:        string;
    frontImageUri:   string;
    backImageUri:    string;
    selfieUri:       string;
    livenessCheck:   boolean;
  };
  riskScore:         number;   // 0–100
  riskLevel:        "LOW"|"MEDIUM"|"HIGH"|"VERY_HIGH";
  tradingLimits: {
    dailyDepositMax:    string;
    dailyWithdrawMax:   string;
    monthlyTradeMax:    string;
  };
  createdAt:         string;
  reviewedAt:        string;
  reviewedBy:        string;
}

// Externe KYC Provider:
// - Onfido (ID + Liveness)
// - Sumsub (Multi-Level KYC)
// - Jumio (Enterprise)
// - ComplyAdvantage (AML Screening, PEP/Sanctions)
// - Chainalysis (Krypto-Transaktionsmonitoring)

// AML Transaction Monitoring Rules (Beispiele):
const AML_RULES = [
  { id: "R001", name: "Large Crypto Withdrawal",    threshold: 10000, currency: "EUR", action: "ALERT" },
  { id: "R002", name: "Rapid Buy-Withdraw Pattern", timeWindow: "24h", trades: 5,     action: "ENHANCED_DD" },
  { id: "R003", name: "High-Risk Jurisdiction",     countries: ["...", "..."],         action: "BLOCK" },
  { id: "R004", name: "Sanctions Address",          source: "OFAC_SDN",               action: "BLOCK_AND_REPORT" },
];
```

---

## TEIL 6 — AI TRADING ORCHESTRATOR (Meta Genius TR2)

### 6.1 Gesamt-Architektur der AI Engine

```
┌─────────────────────────────────────────────────────────────┐
│                  AI ORCHESTRATOR (Layer 3)                   │
│   Capital Allocation · Strategy On/Off · Regime Detection    │
│   Compliance Guard · Kill Switch · Portfolio Optimizer       │
└──────────────────────┬──────────────────────────────────────┘
                       │ governs
┌──────────────────────▼──────────────────────────────────────┐
│              META REASONING ENGINE (Layer 2)                 │
│   TR2 Recursive Loop · Sharpe Evaluator · Risk Adjuster     │
│   Confidence Scorer · Strategy Combiner · Memory Store      │
└───┬────────┬────────┬────────┬────────┬────────┬────────────┘
    │        │        │        │        │        │
┌───▼──┐ ┌──▼───┐ ┌──▼──┐ ┌──▼───┐ ┌──▼───┐ ┌──▼──────┐
│Alpha │ │Neural│ │Sigma│ │Oracle│ │Chain │ │Krealo-  │
│Quant │ │Drift │ │Wave │ │Prime │ │Pulse │ │goik+TR2 │
│Trend │ │Sentim│ │Volat│ │Macro │ │OnChn │ │Recursive│
│RL    │ │NLP   │ │GARCH│ │GPT-4 │ │Whale │ │Memory   │
└──────┘ └──────┘ └─────┘ └──────┘ └──────┘ └─────────┘
    │        │        │        │        │        │
┌───▼────────▼────────▼────────▼────────▼────────▼────────────┐
│              FEATURE STREAM (Real-Time)                      │
│  Price · Volume · Order Flow · Sentiment · On-Chain Metrics  │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 TR2 Recursive Thinking Loop

```python
# meta_genius_tr2.py — Recursive Meta-Reasoning System

import asyncio
from dataclasses import dataclass
from typing import List, Dict, Optional
from enum import Enum

class SignalAction(Enum):
    BUY   = "BUY"
    SELL  = "SELL"
    HOLD  = "HOLD"
    SCALE_IN  = "SCALE_IN"
    SCALE_OUT = "SCALE_OUT"

@dataclass
class AgentSignal:
    agent_id:    str
    symbol:      str
    action:      SignalAction
    confidence:  float      # 0.0 – 1.0
    size_pct:    float      # % des verfügbaren Kapitals
    reasoning:   str
    features:    Dict
    timestamp:   float

@dataclass
class MetaDecision:
    symbol:       str
    final_action: SignalAction
    final_size:   float
    consensus:    float
    agents_voted: int
    risk_approved:bool
    reasoning:    str

class TR2RecursiveEngine:
    """
    Hierarchical Quantum Meta-Logic Learning Loop (HQMLL)
    Recursive TR2 Architecture — Self-Improving Decision Engine
    """

    def __init__(self, agents: list, risk_engine, memory_store, max_loops: int = 7):
        self.agents       = agents
        self.risk_engine  = risk_engine
        self.memory       = memory_store
        self.max_loops    = max_loops
        self.loop_count   = 0

    async def process(self, market_state: Dict) -> MetaDecision:
        """
        TR2 Main Loop — Recursive Meta-Reasoning
        Layer 1: Signal Collection
        Layer 2: Meta-Evaluation + Refinement (recursive)
        Layer 3: Risk/Compliance Gate
        """

        # LOOP INIT
        signals: List[AgentSignal] = []
        refined_signals = []
        self.loop_count = 0

        # ── LAYER 1: Alle Agenten parallel abfragen ──────────────────
        signals = await asyncio.gather(*[
            agent.generate_signal(market_state)
            for agent in self.agents
        ])

        # ── LAYER 2: TR2 Recursive Refinement ────────────────────────
        while self.loop_count < self.max_loops:
            self.loop_count += 1

            # Meta-Evaluation: Signale gegeneinander abwägen
            consensus    = self._compute_consensus(signals)
            disagreement = self._measure_disagreement(signals)

            # Schleife vorzeitig beenden wenn Konsens hoch genug
            if consensus.confidence > 0.85 and disagreement < 0.15:
                break

            # Signale mit niedriger Konfidenz zurückschicken zur Überarbeitung
            low_conf = [s for s in signals if s.confidence < 0.5]
            if low_conf:
                refined = await asyncio.gather(*[
                    self._refine_signal(s, consensus, market_state)
                    for s in low_conf
                ])
                # Ersetze low-conf Signale durch verfeinerte
                signal_map = {s.agent_id: s for s in refined}
                signals = [signal_map.get(s.agent_id, s) for s in signals]

            # Memory-Update: Was hat in der Vergangenheit funktioniert?
            await self.memory.update(signals, consensus, market_state)

        # ── LAYER 3: Risk + Compliance Gate ──────────────────────────
        final_consensus = self._compute_consensus(signals)
        risk_approved, adjusted_size = await self.risk_engine.validate(
            action    = final_consensus.action,
            symbol    = market_state["symbol"],
            size_pct  = final_consensus.size_pct,
        )

        return MetaDecision(
            symbol        = market_state["symbol"],
            final_action  = final_consensus.action if risk_approved else SignalAction.HOLD,
            final_size    = adjusted_size,
            consensus     = final_consensus.confidence,
            agents_voted  = len(signals),
            risk_approved = risk_approved,
            reasoning     = f"TR2 Loop #{self.loop_count}: {final_consensus.reason}",
        )

    def _compute_consensus(self, signals: List[AgentSignal]) -> object:
        # Gewichteter Vote nach Confidence + Historical Accuracy
        from collections import defaultdict
        votes = defaultdict(float)
        for s in signals:
            # Gewichtung: Konfidenz * historische Trefferrate des Agenten
            weight = s.confidence * self.memory.get_agent_accuracy(s.agent_id)
            votes[s.action] += weight

        winner = max(votes, key=votes.get)
        total  = sum(votes.values())
        return type('C', (), {
            'action':     winner,
            'confidence': votes[winner] / total if total else 0,
            'size_pct':   sum(s.size_pct for s in signals if s.action == winner) / max(1, len([s for s in signals if s.action == winner])),
            'reason':     f"{winner.value} @ {votes[winner]/total:.1%} weighted consensus"
        })()

    async def _refine_signal(self, signal: AgentSignal, consensus, market_state: Dict) -> AgentSignal:
        # Agenten mit Kontext über Konsens nochmal befragen → bessere Einschätzung
        agent = next(a for a in self.agents if a.id == signal.agent_id)
        return await agent.generate_signal(market_state, context={
            "current_consensus": consensus.action.value,
            "consensus_confidence": consensus.confidence,
            "loop": self.loop_count,
        })
```

### 6.3 AI Signal API

```typescript
// REST Endpunkte für AI Engine

// POST /v1/ai/strategies
interface CreateStrategyRequest {
  name:        string;
  assets:      string[];     // ["BTC-USDT", "ETH-USDT"]
  timeframes:  string[];     // ["1m", "5m", "1h"]
  capitalPct:  number;       // % des Portfolios für diese Strategie
  maxDrawdown: number;       // Stop bei x% Drawdown
  agents:      string[];     // Welche Agenten aktiv
  riskLevel:   "LOW"|"MEDIUM"|"HIGH";
  mode:        "PAPER"|"LIVE";
}

// GET /v1/ai/signals (WebSocket Stream)
interface AISignal {
  id:         string;
  strategyId: string;
  symbol:     string;
  action:     "BUY"|"SELL"|"HOLD"|"SCALE_IN"|"SCALE_OUT";
  sizePct:    number;
  confidence: number;    // 0.0 – 1.0
  agents:     number;    // Wie viele Agenten votereten
  loops:      number;    // TR2 Rekursions-Tiefe
  reasoning:  string;    // Erklärung auf Deutsch/Englisch
  riskScore:  number;
  autoExecute:boolean;   // Automatisch Order platzieren?
  ts:         string;
}

// WebSocket Event
// ws: wss://api.quantum-emma.app/v1/ai/stream
{
  "type":   "AI_SIGNAL",
  "signal": { ...AISignal },
  "order":  { ...Order }    // Wenn autoExecute = true: gleichzeitig die Order
}
```

---

## TEIL 7 — PORTFOLIO & AUTO-WALLET

```typescript
// GET /v1/portfolio/assets (Auto-Wallet Liste)
interface WalletAssetView {
  asset:        string;      // "BTC"
  name:         string;      // "Bitcoin"
  logoUrl:      string;      // Original Coin Logo
  chain:        string;      // "Bitcoin"
  category:     string;      // "L1"
  balance:      string;      // "0.1042"
  balanceFiat:  string;      // "7,020.00" EUR
  price:        string;      // "67,400"
  change24h:    string;      // "+2.41%"
  pnl:          string;      // "+1,240.00"
  pnlPct:       string;      // "+21.5%"
  staked:       string;      // Falls gestakt
  inOrders:     string;      // In offenen Orders reserviert
  available:    string;      // Verfügbar für Trading/Withdraw
  addresses: {
    deposit:    string;
    network:    string;
  }[];
  // AI-Metadaten
  aiSignal:     "BUY"|"SELL"|"HOLD";
  aiConfidence: number;
  lastUpdated:  string;
}

// Auto-Rebalancing
interface RebalanceProposal {
  currentAllocation: AllocationSlice[];
  targetAllocation:  AllocationSlice[];
  trades: {
    symbol:  string;
    side:    "BUY"|"SELL";
    amount:  string;
    reason:  string;
  }[];
  expectedRisk:         number;
  expectedSharpe:       number;
  estimatedFees:        string;
  aiConfidence:         number;
}
```

---

## TEIL 8 — TECHNOLOGIE-STACK

```yaml
BACKEND:
  api_gateway:    Kong / Traefik / AWS API Gateway
  services:       Node.js/TypeScript (NestJS) + Python (FastAPI)
  ai_engine:      Python (PyTorch, HuggingFace, LangChain)
  message_bus:    Apache Kafka (Confluent Cloud) oder NATS JetStream
  grpc:           Protobuf (inter-service)

DATABASES:
  oltp:           PostgreSQL 16 (Supabase oder RDS)
  timeseries:     ClickHouse (Marktdaten) / TimescaleDB
  cache:          Redis (Sessions, Orderbook-Cache)
  search:         Elasticsearch (Log-Suche, AML-Queries)
  data_lake:      S3 / MinIO + Apache Parquet

INFRASTRUCTURE:
  container:      Docker + Kubernetes (EKS / GKE)
  ci_cd:          GitHub Actions (→ dein bestehendes Setup)
  secrets:        HashiCorp Vault / AWS Secrets Manager
  key_management: AWS KMS / HSM für Wallet Keys
  monitoring:     Prometheus + Grafana + Datadog
  logging:        Loki / CloudWatch

FRONTEND:
  web:            React 18 + Next.js 14 (App Router)
  mobile:         React Native + Expo (iOS + Android)
  desktop:        Electron (→ dein bestehendes Setup)
  charts:         TradingView Lightweight Charts + Recharts
  state:          Zustand / Redux Toolkit + React Query
  websocket:      Socket.io Client / native WebSocket

AI/ML:
  framework:      PyTorch + JAX
  nlp:            OpenAI GPT-4o / Anthropic Claude
  rl:             Stable-Baselines3 / RLlib
  backtesting:    Backtrader / Zipline / QuantConnect Lean
  feature_store:  Feast / Tecton
  mlops:          MLflow + DVC + Airflow

COMPLIANCE_APIS:
  kyc:            Sumsub / Onfido
  aml:            ComplyAdvantage / Chainalysis
  psd2:           Tink / Token.io / GoCardless
  travel_rule:    Notabene / TravelRule Universal

MARKET_DATA_APIS:
  crypto:         Binance · Kraken · CoinGecko Enterprise · Coinbase
  equities:       Alpaca · Polygon.io · EODHD
  blockchain:     Alchemy · Infura · Solana RPC

BROKER_APIS:
  crypto_exec:    Binance · Kraken · Coinbase Advanced Trade
  equities_exec:  Alpaca · Interactive Brokers · Tradier
```

---

## TEIL 9 — DEPLOYMENT & CI/CD

```yaml
# GitHub Actions CI/CD (Erweiterung deines bestehenden Setups)

Pipeline Stages:
  1. Lint + Type Check (ESLint, Mypy, Prettier)
  2. Unit Tests (Jest, Pytest, vitest)
  3. Integration Tests (gegen Sandbox-APIs)
  4. Security Scan (Snyk, OWASP ZAP, Semgrep)
  5. Docker Build + Push (ECR / GHCR)
  6. Kubernetes Deploy (Helm Charts)
  7. Smoke Tests (Post-Deploy)
  8. Release Notes (→ dein bestehendes release-notes.yml)

Environments:
  sandbox:    Paper Trading, Testnet Krypto, Mock-Broker
  staging:    Live-Marktdaten, echter Broker Sandbox
  production: Echtes Geld, vollständige Compliance

Domain & Hosting:
  web:        Vercel / AWS CloudFront + S3 (CDN)
  api:        AWS EKS / GKE Kubernetes
  domain:     quantum-emma.app (+ subdomains: api. ws. app.)
  ssl:        Let's Encrypt / AWS ACM (Auto-Renewal)
  dns:        Cloudflare (DDoS-Schutz + WAF)
```

---

## TEIL 10 — REGULATORIK (EU / Deutschland)

```
LIZENZ-ANFORDERUNGEN (je nach Umfang):

Phase 1 (eigene Nutzung + Whitelabel):
  → Keine Lizenz nötig wenn du nur eigenes Kapital verwaltest
  → BaFin Registrierung als Fintech-Startup prüfen

Phase 2 (externe Nutzer + Kundengelder):
  → BaFin: Wertpapierinstitutserlaubnis (WpIG) für Aktien/ETFs
  → BaFin/EU: CASP-Registrierung unter MiCA für Krypto-Services
  → AML-Officer benennen (ab bestimmten Volumina Pflicht)

Phase 3 (vollständige Börse):
  → MiFID II Zulassung als Geregelter Markt / MTF
  → Mehrjähriger Prozess, 5-50+ Mio EUR Kapital
  → Empfehlung: Weißlabeln einer lizenzierten Plattform

TECHNISCHE COMPLIANCE-PFLICHTEN (MiFID II Art. 17):
  ✅ Algo-Trading: Kill Switches, Pre-Trade-Risikokontrollen
  ✅ Alle Orders + Trades 5 Jahre aufbewahren (RTS 22)
  ✅ Echtzeit-Risikosysteme für automatische Strategien
  ✅ Testumgebung vor Live-Deployment jeder AI-Strategie
  ✅ Jährliche Überprüfung aller Algo-Strategien
  ✅ Best Execution: Orders an günstigsten Markt routen

DATENSCHUTZ:
  ✅ DSGVO: Datenspeicherung in EU/EWR
  ✅ Recht auf Löschung (außer bei regulatorischen Aufbewahrungspflichten)
  ✅ Privacy by Design (Verschlüsselung, Datensparsamkeit)
```

---

## TEIL 11 — PHASENPLAN (Realistisch)

```
PHASE 0 (Monat 1-2): FUNDAMENT
  ✅ GitHub Repository (privat) — bereits vorhanden
  ✅ CI/CD Pipeline — bereits vorhanden
  → Market Data Service (Binance + CoinGecko WebSocket)
  → ClickHouse Zeitreihen-DB aufsetzen
  → Paper Trading Engine (kein echtes Geld)
  → AI Signal Engine v1 (12 Agenten Basis)

PHASE 1 (Monat 3-4): LIVE MARKTDATEN + BASIC TRADING
  → OMS mit Alpaca Sandbox
  → Portfolio Service + Echtzeit-PnL
  → Web-App v1 mit Live-Charts (TradingView)
  → Basic KYC (nur für dich / Beta-Nutzer)
  → Mobile App v1 (Wallet + Charts)

PHASE 2 (Monat 5-7): WALLET + FIAT + EXCHANGE
  → Custodial Krypto Wallet (Alchemy + eigen)
  → Kraken/Binance echte Orders
  → Fiat via SEPA (Stripe / GoCardless)
  → Volles KYC/AML System (Sumsub)
  → Auto-Trading v1 (mit Kill Switch)

PHASE 3 (Monat 8-12): ENTERPRISE + SKALIERUNG
  → Multi-Broker Routing
  → Aktien/ETFs (Alpaca live)
  → Enterprise Marktdaten (Polygon + EODHD)
  → TR2 Meta-Deep-Thinking vollständig
  → iOS + Android App Store Launch
  → Regulatorik-Beratung für BaFin/MiCA

PHASE 4 (Jahr 2+): LIZENZ + BÖRSE
  → BaFin / CASP Lizenz beantragen
  → Eigene Matching Engine (optional)
  → Institutionelle Kunden
  → CEX/DEX eigene Liquidität
```

---

## TEIL 12 — SICHERHEIT

```yaml
CRITICAL_SECURITY_MEASURES:
  wallet_keys:
    - HSM (Hardware Security Module) für Private Keys
    - Multi-Signature für große Withdrawals (2-of-3 Multisig)
    - Cold Storage: 90%+ der Kundengelder offline
    - Hot Wallet: max 10% für tägliche Liquidität

  api_security:
    - OAuth2/OIDC (Keycloak / Auth0)
    - mTLS für interne Service-Kommunikation
    - API Keys mit HMAC-SHA256 Signatur (wie Binance)
    - Rate Limiting: 1200 req/min per Key
    - IP Whitelisting für Trading-Bots

  infrastructure:
    - Cloudflare WAF + DDoS Protection
    - VPC mit privaten Subnets (kein direkter Internet-Zugang)
    - Secrets in HashiCorp Vault (nie in Git)
    - Audit Logs für ALLE Datenbankzugriffe
    - Anomaly Detection (ungewöhnliche Order-Muster)

  ai_safety:
    - Kill Switch: sofortige Deaktivierung aller AI-Strategien
    - Max Position Limits: absolut, niemals überschreitbar
    - Circuit Breaker: AI stoppt bei >5% Tagesverlust
    - Backtesting-Pflicht vor Live-Deployment
    - Alle AI-Entscheidungen geloggt + erklärbar
```

---

*⚛️ Quantum Emma Enterprise — Autonomous AI Trading Platform*
*© 2026 Grigori Saks — All Rights Reserved — Patent Pending*
*Classification: CONFIDENTIAL*
