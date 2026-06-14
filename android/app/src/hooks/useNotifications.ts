// ============================================================
//  QUANTUM EMMA — Notifications Engine
//  Push · In-App · Price Alerts · Trade Events · System
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";

export type NotifType    = "price_alert" | "trade" | "staking" | "governance" | "system" | "ai_signal";
export type NotifLevel   = "info" | "success" | "warning" | "error";
export type NotifStatus  = "unread" | "read" | "dismissed";

export interface Notification {
  id:        string;
  type:      NotifType;
  level:     NotifLevel;
  title:     string;
  message:   string;
  status:    NotifStatus;
  timestamp: number;
  meta?:     Record<string, any>;
  action?:   { label: string; url: string };
}

export interface PriceAlert {
  id:        string;
  symbol:    string;
  condition: "above" | "below";
  threshold: number;
  active:    boolean;
}

const NOTIF_ICONS: Record<NotifType, string> = {
  price_alert: "💰",
  trade:       "⚡",
  staking:     "🏦",
  governance:  "🗳",
  system:      "⚙️",
  ai_signal:   "⚛️",
};

const LEVEL_COLORS: Record<NotifLevel, string> = {
  info:    "#00ffff",
  success: "#00ff80",
  warning: "#ffaa00",
  error:   "#ff4444",
};

// In-memory store (replace with persistent backend in production)
let _store: Notification[] = [
  {
    id:        "init-1",
    type:      "system",
    level:     "success",
    title:     "Quantum Emma v5.4 aktiv",
    message:   "Alle 12 Agenten online · HQMLL Layer 7 bereit",
    status:    "unread",
    timestamp: Date.now() - 120000,
  },
  {
    id:        "init-2",
    type:      "staking",
    level:     "info",
    title:     "Staking Reward bereit",
    message:   "24.7 QEMMA Reward verfügbar zum Claimen",
    status:    "unread",
    timestamp: Date.now() - 300000,
    action:    { label: "Claim", url: "/staking" },
  },
  {
    id:        "init-3",
    type:      "ai_signal",
    level:     "success",
    title:     "AI Signal: QEMMA KAUFEN",
    message:   "Meta Genius TR2: 89% Konfidenz · 12/12 Agenten aktiv",
    status:    "unread",
    timestamp: Date.now() - 600000,
    action:    { label: "Anzeigen", url: "/agents" },
  },
];

let _alerts: PriceAlert[] = [];
let _subscribers: Array<() => void> = [];

function notify(sub: () => void) { _subscribers.push(sub); }
function unnotify(sub: () => void) { _subscribers = _subscribers.filter(s => s !== sub); }
function broadcast() { _subscribers.forEach(s => s()); }

function createNotif(
  type:    NotifType,
  level:   NotifLevel,
  title:   string,
  message: string,
  meta?:   Record<string, any>,
  action?: { label: string; url: string }
): Notification {
  const n: Notification = {
    id:        `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type, level, title, message, meta, action,
    status:    "unread",
    timestamp: Date.now(),
  };
  _store = [n, ..._store.slice(0, 99)]; // max 100 notifications
  broadcast();
  // Browser push notification (if permitted)
  if ("Notification" in window && window.Notification.permission === "granted") {
    new window.Notification(`${NOTIF_ICONS[type]} ${title}`, { body: message, icon: "/favicon.ico" });
  }
  return n;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([..._store]);
  const [alerts,        setAlerts]        = useState<PriceAlert[]>([..._alerts]);
  const [permission,    setPermission]    = useState<NotificationPermission | "unsupported">("default");
  const priceCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync with global store
  useEffect(() => {
    const sync = () => setNotifications([..._store]);
    notify(sync);
    return () => unnotify(sync);
  }, []);

  // Check push notification permission
  useEffect(() => {
    if (!("Notification" in window)) { setPermission("unsupported"); return; }
    setPermission(window.Notification.permission);
  }, []);

  // Price alert checker (runs every 10s against mock prices)
  useEffect(() => {
    const MOCK: Record<string, number> = { QEMMA: 0.63, ETH: 3820, BTC: 67400 };
    priceCheckRef.current = setInterval(() => {
      _alerts.filter(a => a.active).forEach(alert => {
        const current = MOCK[alert.symbol] || 0;
        const triggered =
          (alert.condition === "above" && current > alert.threshold) ||
          (alert.condition === "below" && current < alert.threshold);
        if (triggered) {
          createNotif(
            "price_alert", "warning",
            `${alert.symbol} ${alert.condition === "above" ? "über" : "unter"} $${alert.threshold}`,
            `Aktueller Preis: $${current.toLocaleString()}`,
            { symbol: alert.symbol, price: current, threshold: alert.threshold }
          );
          // Disable after trigger to avoid spam
          _alerts = _alerts.map(a => a.id === alert.id ? { ...a, active: false } : a);
          setAlerts([..._alerts]);
        }
      });
    }, 10000);
    return () => { if (priceCheckRef.current) clearInterval(priceCheckRef.current); };
  }, []);

  // ── Actions ──────────────────────────────────────────────
  const markRead = useCallback((id: string) => {
    _store = _store.map(n => n.id === id ? { ...n, status: "read" } : n);
    broadcast();
  }, []);

  const markAllRead = useCallback(() => {
    _store = _store.map(n => ({ ...n, status: "read" as NotifStatus }));
    broadcast();
  }, []);

  const dismiss = useCallback((id: string) => {
    _store = _store.filter(n => n.id !== id);
    broadcast();
  }, []);

  const clearAll = useCallback(() => {
    _store = [];
    broadcast();
  }, []);

  const requestPushPermission = useCallback(async () => {
    if (!("Notification" in window)) return "unsupported";
    const result = await window.Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      createNotif("system", "success", "Push Notifications aktiv",
        "Du erhältst jetzt Preis-Alerts und AI-Signal-Benachrichtigungen.");
    }
    return result;
  }, []);

  const addPriceAlert = useCallback((symbol: string, condition: "above" | "below", threshold: number) => {
    const alert: PriceAlert = {
      id:        `alert-${Date.now()}`,
      symbol, condition, threshold, active: true,
    };
    _alerts = [alert, ..._alerts];
    setAlerts([..._alerts]);
    createNotif("system", "info", "Preis-Alert gesetzt",
      `${symbol} ${condition === "above" ? "über" : "unter"} $${threshold}`);
    return alert;
  }, []);

  const removePriceAlert = useCallback((id: string) => {
    _alerts = _alerts.filter(a => a.id !== id);
    setAlerts([..._alerts]);
  }, []);

  // ── Shortcuts for creating notifications ─────────────────
  const notify_  = { createNotif, NOTIF_ICONS, LEVEL_COLORS };

  const unreadCount = notifications.filter(n => n.status === "unread").length;
  const hasUnread   = unreadCount > 0;

  return {
    notifications,
    alerts,
    unreadCount,
    hasUnread,
    permission,
    markRead,
    markAllRead,
    dismiss,
    clearAll,
    requestPushPermission,
    addPriceAlert,
    removePriceAlert,
    NOTIF_ICONS,
    LEVEL_COLORS,
  };
}
