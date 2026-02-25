"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { BrowserProvider, JsonRpcSigner, Contract, formatUnits, parseUnits } from "ethers";
import {
  BOOKING_TOKEN_ADDRESS,
  BOOKING_SYSTEM_ADDRESS,
  BOOKING_TOKEN_ABI,
  BOOKING_SYSTEM_ABI,
  SEPOLIA_CHAIN_ID,
} from "@/lib/contracts";

export interface Service {
  id: number;
  name: string;
  price: bigint;
  active: boolean;
}

export interface Booking {
  id: number;
  user: string;
  serviceId: bigint;
  amountPaid: bigint;
  cancelled: boolean;
  timestamp: bigint;
}

interface Web3ContextType {
  account: string | null;
  tokenBalance: string;
  tokenSymbol: string;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
  isPaused: boolean;
  isOwner: boolean;
  services: Service[];
  myBookings: Booking[];
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToSepolia: () => Promise<void>;
  refreshData: () => Promise<void>;
  bookService: (serviceId: number) => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<void>;
  addService: (name: string, price: string) => Promise<void>;
  updateService: (id: number, newPrice: string, active: boolean) => Promise<void>;
  pauseSystem: () => Promise<void>;
  unpauseSystem: () => Promise<void>;
  txStatus: { loading: boolean; message: string; type: "idle" | "pending" | "success" | "error" };
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [tokenBalance, setTokenBalance] = useState("0");
  const [tokenSymbol, setTokenSymbol] = useState("BKT");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [txStatus, setTxStatus] = useState<Web3ContextType["txStatus"]>({
    loading: false,
    message: "",
    type: "idle",
  });

  const setTx = (loading: boolean, message: string, type: Web3ContextType["txStatus"]["type"]) => {
    setTxStatus({ loading, message, type });
    if (type === "success" || type === "error") {
      setTimeout(() => setTxStatus({ loading: false, message: "", type: "idle" }), 5000);
    }
  };

  const getContracts = useCallback(
    (s: JsonRpcSigner) => {
      const tokenContract = new Contract(BOOKING_TOKEN_ADDRESS, BOOKING_TOKEN_ABI, s);
      const bookingContract = new Contract(BOOKING_SYSTEM_ADDRESS, BOOKING_SYSTEM_ABI, s);
      return { tokenContract, bookingContract };
    },
    []
  );

  const refreshData = useCallback(async () => {
    if (!signer || !account) return;
    try {
      const { tokenContract, bookingContract } = getContracts(signer);

      const [bal, sym, paused, owner, serviceCount, bookingCount] = await Promise.all([
        tokenContract.balanceOf(account),
        tokenContract.symbol(),
        bookingContract.paused(),
        bookingContract.owner(),
        bookingContract.serviceCount(),
        bookingContract.bookingCount(),
      ]);

      setTokenBalance(formatUnits(bal, 18));
      setTokenSymbol(sym);
      setIsPaused(paused);
      setIsOwner(owner.toLowerCase() === account.toLowerCase());

      // Fetch services (contract IDs are 1-based: first service = ID 1)
      const svcList: Service[] = [];
      for (let i = 1; i <= Number(serviceCount); i++) {
        const svc = await bookingContract.getService(i);
        svcList.push({ id: i, name: svc.name, price: svc.price, active: svc.active });
      }
      setServices(svcList);

      // Fetch all bookings with auto index detection + per-item error handling
      const bookingList: Booking[] = [];
      const totalBookings = Number(bookingCount);
      console.log("[BookChain] bookingCount:", totalBookings, "account:", account);

      // Detect if contract uses 0-based or 1-based booking IDs
      let bookingStart = 1;
      try {
        const test = await bookingContract.getBooking(0);
        if (test.user && test.user !== "0x0000000000000000000000000000000000000000") {
          bookingStart = 0; // 0-based
        }
      } catch {
        bookingStart = 1; // 0 reverted, so 1-based
      }

      const bookingEnd = bookingStart === 0 ? totalBookings - 1 : totalBookings;
      console.log("[BookChain] booking range:", bookingStart, "to", bookingEnd);

      for (let i = bookingStart; i <= bookingEnd; i++) {
        try {
          const b = await bookingContract.getBooking(i);
          console.log("[BookChain] booking #" + i + ":", b.user, String(b.serviceId), b.cancelled);
          if (
            b.user &&
            b.user !== "0x0000000000000000000000000000000000000000" &&
            b.user.toLowerCase() === account.toLowerCase()
          ) {
            bookingList.push({
              id: i,
              user: b.user,
              serviceId: b.serviceId,
              amountPaid: b.amountPaid,
              cancelled: b.cancelled,
              timestamp: b.timestamp,
            });
          }
        } catch (err) {
          console.warn("[BookChain] getBooking(" + i + ") failed:", err);
        }
      }

      console.log("[BookChain] my bookings found:", bookingList.length);
      setMyBookings(bookingList);
    } catch (e) {
      console.error("refreshData error", e);
    }
  }, [signer, account, getContracts]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this dApp.");
      return;
    }
    setIsConnecting(true);
    try {
      const p = new BrowserProvider(window.ethereum);
      await p.send("eth_requestAccounts", []);
      const s = await p.getSigner();
      const addr = await s.getAddress();
      const network = await p.getNetwork();

      setProvider(p);
      setSigner(s);
      setAccount(addr);
      setIsCorrectNetwork(Number(network.chainId) === SEPOLIA_CHAIN_ID);
    } catch (e) {
      console.error(e);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setTokenBalance("0");
    setServices([]);
    setMyBookings([]);
    setIsOwner(false);
  }, []);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });
    } catch (e: unknown) {
      const err = e as { code?: number };
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0xaa36a7",
            chainName: "Sepolia Testnet",
            rpcUrls: ["https://rpc.sepolia.org"],
            nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          }],
        });
      }
    }
  }, []);

  const bookService = useCallback(async (serviceId: number) => {
    if (!signer) return;
    setTx(true, "Approving tokens...", "pending");
    try {
      const { tokenContract, bookingContract } = getContracts(signer);
      const svc = await bookingContract.getService(serviceId);
      const price: bigint = svc.price;

      const approveTx = await tokenContract.approve(BOOKING_SYSTEM_ADDRESS, price);
      await approveTx.wait();

      setTx(true, "Booking service...", "pending");
      const bookTx = await bookingContract.book(serviceId);
      await bookTx.wait();

      setTx(false, "Booking confirmed! 🎉", "success");
      await refreshData();
    } catch (e: unknown) {
      const err = e as { reason?: string; message?: string };
      setTx(false, err.reason || err.message || "Transaction failed", "error");
    }
  }, [signer, getContracts, refreshData]);

  const cancelBooking = useCallback(async (bookingId: number) => {
    if (!signer) return;
    setTx(true, "Cancelling booking...", "pending");
    try {
      const { bookingContract } = getContracts(signer);
      const tx = await bookingContract.cancel(bookingId);
      await tx.wait();
      setTx(false, "Booking cancelled. Refund sent! ✓", "success");
      await refreshData();
    } catch (e: unknown) {
      const err = e as { reason?: string; message?: string };
      setTx(false, err.reason || err.message || "Transaction failed", "error");
    }
  }, [signer, getContracts, refreshData]);

  const addService = useCallback(async (name: string, price: string) => {
    if (!signer) return;
    setTx(true, "Adding service...", "pending");
    try {
      const { bookingContract } = getContracts(signer);
      const tx = await bookingContract.addService(name, parseUnits(price, 18));
      await tx.wait();
      setTx(false, "Service added! ✓", "success");
      await refreshData();
    } catch (e: unknown) {
      const err = e as { reason?: string; message?: string };
      setTx(false, err.reason || err.message || "Transaction failed", "error");
    }
  }, [signer, getContracts, refreshData]);

  const updateService = useCallback(async (id: number, newPrice: string, active: boolean) => {
    if (!signer) return;
    setTx(true, "Updating service...", "pending");
    try {
      const { bookingContract } = getContracts(signer);
      const tx = await bookingContract.updateService(id, parseUnits(newPrice, 18), active);
      await tx.wait();
      setTx(false, "Service updated! ✓", "success");
      await refreshData();
    } catch (e: unknown) {
      const err = e as { reason?: string; message?: string };
      setTx(false, err.reason || err.message || "Transaction failed", "error");
    }
  }, [signer, getContracts, refreshData]);

  const pauseSystem = useCallback(async () => {
    if (!signer) return;
    setTx(true, "Pausing system...", "pending");
    try {
      const { bookingContract } = getContracts(signer);
      const tx = await bookingContract.pause();
      await tx.wait();
      setTx(false, "System paused ✓", "success");
      await refreshData();
    } catch (e: unknown) {
      const err = e as { reason?: string; message?: string };
      setTx(false, err.reason || err.message || "Transaction failed", "error");
    }
  }, [signer, getContracts, refreshData]);

  const unpauseSystem = useCallback(async () => {
    if (!signer) return;
    setTx(true, "Unpausing system...", "pending");
    try {
      const { bookingContract } = getContracts(signer);
      const tx = await bookingContract.unpause();
      await tx.wait();
      setTx(false, "System unpaused ✓", "success");
      await refreshData();
    } catch (e: unknown) {
      const err = e as { reason?: string; message?: string };
      setTx(false, err.reason || err.message || "Transaction failed", "error");
    }
  }, [signer, getContracts, refreshData]);

  // Auto-refresh when signer/account changes
  useEffect(() => {
    if (signer && account) refreshData();
  }, [signer, account, refreshData]);

  // Listen to account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) disconnect();
      else setAccount(accounts[0]);
    };
    const handleChainChanged = () => window.location.reload();
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect]);

  return (
    <Web3Context.Provider
      value={{
        account, tokenBalance, tokenSymbol, isConnecting, isCorrectNetwork,
        isPaused, isOwner, services, myBookings, connect, disconnect,
        switchToSepolia, refreshData, bookService, cancelBooking,
        addService, updateService, pauseSystem, unpauseSystem, txStatus,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used inside Web3Provider");
  return ctx;
}