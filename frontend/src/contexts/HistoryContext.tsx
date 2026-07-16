import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { HistoryItem } from "../types/strategy";

const KEY = "hca_history_v1";

interface Ctx {
  items: HistoryItem[];
  add: (item: HistoryItem) => void;
  remove: (id: string) => void;
  rename: (id: string, title: string) => void;
  duplicate: (id: string) => void;
  clear: () => void;
}

const HistoryContext = createContext<Ctx | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (i: HistoryItem) => setItems((s) => [i, ...s]);
  const remove = (id: string) => setItems((s) => s.filter((x) => x.id !== id));
  const rename = (id: string, title: string) =>
    setItems((s) => s.map((x) => (x.id === id ? { ...x, title } : x)));
  const duplicate = (id: string) =>
    setItems((s) => {
      const it = s.find((x) => x.id === id);
      if (!it) return s;
      return [{ ...it, id: crypto.randomUUID(), title: it.title + " (Copy)", createdAt: Date.now() }, ...s];
    });
  const clear = () => setItems([]);

  return (
    <HistoryContext.Provider value={{ items, add, remove, rename, duplicate, clear }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("HistoryProvider missing");
  return ctx;
};