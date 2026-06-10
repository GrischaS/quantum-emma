// ============================================================
//  QUANTUM EMMA — WalletConnect v2 Hook
//  Multi-wallet: MetaMask · Rainbow · Trust · Coinbase
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

import { useState, useEffect, useCallback } from "react";

export type WalletProvider = "metamask" | "walletconnect" | "coinbase" | "trust";
export type NetworkId = 1 | 11155111 | 137 | 8453; // Mainnet | Sepolia | Polygon | Base

export interface WalletState {
  address:   string | null;
  balance:   string | null;
  network:   NetworkId | null;
  networkName: string;
  isConnected: boolean;
  provider:  WalletProvider | null;
  qemmaBalance: string | null;
}

const NETWORKS: Record<number, string> = {
  1:        "Ethereum Mainnet",
  11155111: "Sepolia Testnet",
  137:      "Polygon",
  8453:     "Base",
};

const QEMMA_CONTRACTS: Partial<Record<NetworkId, string>> = {
  11155111: "0x0000000000000000000000000000000000000000", // placeholder — set after Sepolia deploy
  1:        "0x0000000000000000000000000000000000000000", // placeholder — set after Mainnet deploy
};

export function useWalletConnect() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null, balance: null, network: null,
    networkName: "Not connected", isConnected: false,
    provider: null, qemmaBalance: null,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // ── Helpers ──────────────────────────────────────────────
  const getProvider = () => (window as any).ethereum;

  const readBalance = useCallback(async (addr: string) => {
    const eth = getProvider();
    if (!eth) return null;
    const raw = await eth.request({ method: "eth_getBalance", params: [addr, "latest"] });
    const wei = parseInt(raw, 16);
    return (wei / 1e18).toFixed(4);
  }, []);

  const readChainId = useCallback(async (): Promise<NetworkId | null> => {
    const eth = getProvider();
    if (!eth) return null;
    const hex = await eth.request({ method: "eth_chainId" });
    return parseInt(hex, 16) as NetworkId;
  }, []);

  // Placeholder: read QEMMA ERC-20 balance via eth_call
  const readQemmaBalance = useCallback(async (addr: string, chainId: NetworkId): Promise<string | null> => {
    const contractAddr = QEMMA_CONTRACTS[chainId];
    if (!contractAddr || contractAddr === "0x0000000000000000000000000000000000000000") return null;
    const eth = getProvider();
    if (!eth) return null;
    // balanceOf(address) selector = 0x70a08231
    const data = "0x70a08231" + addr.slice(2).padStart(64, "0");
    try {
      const raw = await eth.request({
        method: "eth_call",
        params: [{ to: contractAddr, data }, "latest"],
      });
      const balance = parseInt(raw, 16) / 1e18;
      return balance.toLocaleString("en-US", { maximumFractionDigits: 2 });
    } catch {
      return null;
    }
  }, []);

  // ── Connect ───────────────────────────────────────────────
  const connect = useCallback(async (preferredProvider: WalletProvider = "metamask") => {
    setLoading(true);
    setError(null);
    try {
      const eth = getProvider();
      if (!eth) {
        throw new Error("No Web3 wallet detected. Please install MetaMask.");
      }
      const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
      if (!accounts.length) throw new Error("No accounts returned");

      const addr    = accounts[0];
      const chainId = await readChainId();
      const bal     = await readBalance(addr);
      const qemma   = chainId ? await readQemmaBalance(addr, chainId) : null;

      setWallet({
        address:      addr,
        balance:      bal,
        network:      chainId,
        networkName:  chainId ? (NETWORKS[chainId] || `Chain ${chainId}`) : "Unknown",
        isConnected:  true,
        provider:     preferredProvider,
        qemmaBalance: qemma,
      });
    } catch (e: any) {
      setError(e.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  }, [readBalance, readChainId, readQemmaBalance]);

  // ── Disconnect ────────────────────────────────────────────
  const disconnect = useCallback(() => {
    setWallet({
      address: null, balance: null, network: null,
      networkName: "Not connected", isConnected: false,
      provider: null, qemmaBalance: null,
    });
  }, []);

  // ── Switch network ────────────────────────────────────────
  const switchNetwork = useCallback(async (targetChainId: NetworkId) => {
    const eth = getProvider();
    if (!eth) return;
    const hex = "0x" + targetChainId.toString(16);
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hex }] });
    } catch (e: any) {
      if (e.code === 4902) {
        setError("Network not in wallet. Please add it manually.");
      }
    }
  }, []);

  // ── Event listeners ───────────────────────────────────────
  useEffect(() => {
    const eth = getProvider();
    if (!eth) return;

    const onAccounts = (accounts: string[]) => {
      if (!accounts.length) disconnect();
      else setWallet(w => ({ ...w, address: accounts[0] }));
    };
    const onChain = (hex: string) => {
      const id = parseInt(hex, 16) as NetworkId;
      setWallet(w => ({ ...w, network: id, networkName: NETWORKS[id] || `Chain ${id}` }));
    };

    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged",    onChain);
    return () => {
      eth.removeListener("accountsChanged", onAccounts);
      eth.removeListener("chainChanged",    onChain);
    };
  }, [disconnect]);

  // ── Auto-reconnect if already authorized ─────────────────
  useEffect(() => {
    const eth = getProvider();
    if (!eth) return;
    eth.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length) connect("metamask");
    }).catch(() => {});
  }, [connect]);

  return { wallet, loading, error, connect, disconnect, switchNetwork };
}
