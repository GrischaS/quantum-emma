// ============================================================
//  QUANTUM EMMA — Live Price Feed Hook
//  Sources: Binance WS + CoinGecko fallback
//  Supports: BTC/ETH/QEMMA and any pair
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";

export interface PriceTick {
  symbol:    string;
  price:     number;
  change24h: number;
  high24h:   number;
  low24h:    number;
  volume24h: number;
  timestamp: number;
}

type FeedStatus = "connecting" | "live" | "fallback" | "error" | "idle";

const BINANCE_WS = "wss://stream.binance.com:9443/stream?streams=";
const COINGECKO_IDS: Record<string, string> = {
  BTCUSDT:  "bitcoin",
  ETHUSDT:  "ethereum",
  BNBUSDT:  "binancecoin",
  SOLUSDT:  "solana",
  QEMMAUSDT:"quantum-emma", // listed once on CoinGecko
};

export function useLivePriceFeed(symbols: string[] = ["BTCUSDT", "ETHUSDT"]) {
  const [ticks,  setTicks]  = useState<Record<string, PriceTick>>({});
  const [status, setStatus] = useState<FeedStatus>("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retries  = useRef(0);

  // ── CoinGecko HTTP fallback ───────────────────────────────
  const fetchCoinGecko = useCallback(async () => {
    const ids = symbols.map(s => COINGECKO_IDS[s] || s.toLowerCase().replace("usdt","")).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_24h_high=true&include_24h_low=true`;
    try {
      const res  = await fetch(url);
      const data = await res.json();
      const now  = Date.now();
      setTicks(prev => {
        const next = { ...prev };
        symbols.forEach(sym => {
          const id  = COINGECKO_IDS[sym] || sym.toLowerCase().replace("usdt","");
          const row = data[id];
          if (row) {
            next[sym] = {
              symbol:    sym,
              price:     row.usd            ?? 0,
              change24h: row.usd_24h_change ?? 0,
              high24h:   row.usd_24h_high   ?? 0,
              low24h:    row.usd_24h_low     ?? 0,
              volume24h: row.usd_24h_vol     ?? 0,
              timestamp: now,
            };
          }
        });
        return next;
      });
      setStatus("fallback");
    } catch {
      setStatus("error");
    }
  }, [symbols]);

  // ── Binance WebSocket ─────────────────────────────────────
  const connectWS = useCallback(() => {
    const streams = symbols
      .filter(s => !s.includes("QEMMA")) // QEMMA not on Binance yet
      .map(s => `${s.toLowerCase()}@ticker`)
      .join("/");

    if (!streams) { fetchCoinGecko(); return; }

    setStatus("connecting");
    const ws = new WebSocket(BINANCE_WS + streams);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("live");
      retries.current = 0;
    };

    ws.onmessage = (e) => {
      try {
        const msg  = JSON.parse(e.data);
        const data = msg.data || msg;
        const sym  = (data.s as string)?.toUpperCase();
        if (!sym) return;
        setTicks(prev => ({
          ...prev,
          [sym]: {
            symbol:    sym,
            price:     parseFloat(data.c) || 0,
            change24h: parseFloat(data.P) || 0,
            high24h:   parseFloat(data.h) || 0,
            low24h:    parseFloat(data.l) || 0,
            volume24h: parseFloat(data.v) || 0,
            timestamp: Date.now(),
          },
        }));
      } catch {}
    };

    ws.onerror = () => setStatus("error");

    ws.onclose = () => {
      if (retries.current < 5) {
        retries.current++;
        const delay = Math.min(1000 * 2 ** retries.current, 30000);
        retryRef.current = setTimeout(connectWS, delay);
      } else {
        fetchCoinGecko();
      }
    };
  }, [symbols, fetchCoinGecko]);

  useEffect(() => {
    connectWS();
    return () => {
      wsRef.current?.close();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [connectWS]);

  const getPrice  = (sym: string) => ticks[sym]?.price     ?? null;
  const getChange = (sym: string) => ticks[sym]?.change24h ?? null;
  const isLive    = status === "live" || status === "fallback";

  return { ticks, status, isLive, getPrice, getChange };
}
