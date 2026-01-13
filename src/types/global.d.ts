// Global type declarations for the Quantaureum frontend

// Ethereum provider interface for Web3 wallet integration
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
  selectedAddress?: string;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
}

// Particles.js configuration - using Record for flexibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParticlesConfig = Record<string, any>;

// Solana provider interface for Phantom wallet
interface SolanaProvider {
  isPhantom?: boolean;
  connect?: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect?: () => Promise<void>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    solana?: SolanaProvider;
    particlesJS?: (elementId: string, config: ParticlesConfig) => void;
  }
}

export {};
