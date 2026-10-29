import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: number;
  categorySlug: string;
  name: string;
  price: number;
  img: string;
  qty: number;
  variant?: string;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: number, variant?: string) => void;
  setQty: (id: number, qty: number, variant?: string) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const key = (id: number, variant?: string) => `${id}__${variant ?? ""}`;

  const add = (item: Omit<CartItem, "qty">) => {
    setItems(prev => {
      const k = key(item.id, item.variant);
      const existing = prev.find(i => key(i.id, i.variant) === k);
      if (existing) return prev.map(i => key(i.id, i.variant) === k ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const remove = (id: number, variant?: string) => {
    setItems(prev => prev.filter(i => key(i.id, i.variant) !== key(id, variant)));
  };

  const setQty = (id: number, qty: number, variant?: string) => {
    if (qty < 1) { remove(id, variant); return; }
    setItems(prev => prev.map(i => key(i.id, i.variant) === key(id, variant) ? { ...i, qty } : i));
  };

  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
