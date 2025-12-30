import { createContext } from "react";
import type { StellarWalletContextValue } from "../types";

export const StellarWalletContext =
  createContext<StellarWalletContextValue | null>(null);
