"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_DATA, SESSION_KEY, STORAGE_KEY } from "./default-data";
import { clone, deepMerge } from "./helpers";
import type { SiteData } from "./types";

function readStorage(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULT_DATA);
    return deepMerge(clone(DEFAULT_DATA), JSON.parse(raw));
  } catch (e) {
    console.error("loadData failed, using defaults", e);
    return clone(DEFAULT_DATA);
  }
}

interface StoreValue {
  /** Published data (defaults until hydrated from localStorage). */
  data: SiteData;
  hydrated: boolean;
  /** Persist a full data object. */
  save: (next: SiteData) => void;
  /** Functional update + persist. */
  update: (fn: (draft: SiteData) => void) => void;
  reset: () => void;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setData(readStorage());
    setIsAdmin(sessionStorage.getItem(SESSION_KEY) === "1");
    setHydrated(true);

    // keep tabs in sync (e.g. admin panel open in another tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setData(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: SiteData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setData(clone(next));
  }, []);

  const update = useCallback((fn: (draft: SiteData) => void) => {
    const draft = readStorage();
    fn(draft);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setData(draft);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(clone(DEFAULT_DATA));
  }, []);

  const login = useCallback((username: string, password: string) => {
    const current = readStorage();
    if (username === current.admin.username && password === current.admin.password) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
  }, []);

  return (
    <StoreContext.Provider value={{ data, hydrated, save, update, reset, isAdmin, login, logout }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useSiteData must be used inside <SiteDataProvider>");
  return ctx;
}
