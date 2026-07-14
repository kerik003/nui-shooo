'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { loadProducts } from '../lib/supabase';
import { generateOrderNumber } from '../lib/data';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [favLists, setFavLists] = useState({ 'Избранное': [] });
  const [hydrated, setHydrated] = useState(false);
  const usedOrderNumbers = useRef(new Set());

  // загрузка товаров при первом рендере
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await loadProducts();
      if (!cancelled) {
        setProducts(list);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // восстановление корзины и избранного из localStorage (только в браузере)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nui_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) { console.warn('Не удалось загрузить сохранённую корзину:', e); }
    try {
      const savedFav = localStorage.getItem('nui_favLists');
      if (savedFav) setFavLists(JSON.parse(savedFav));
    } catch (e) { console.warn('Не удалось загрузить сохранённое избранное:', e); }
    setHydrated(true);
  }, []);

  // сохранение при изменениях (после гидратации, чтобы не перезаписать сохранённое пустыми данными)
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem('nui_cart', JSON.stringify(cart)); } catch (e) { console.warn('Не удалось сохранить корзину:', e); }
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem('nui_favLists', JSON.stringify(favLists)); } catch (e) { console.warn('Не удалось сохранить избранное:', e); }
  }, [favLists, hydrated]);

  // ---------- корзина ----------
  function addToCart(productId, colorIndex, sizeIndex, qty) {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.productId === productId && c.colorIndex === colorIndex && c.sizeIndex === sizeIndex);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { productId, colorIndex, sizeIndex, qty }];
    });
  }
  function removeFromCart(idx) {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }
  function clearCart() {
    setCart([]);
  }
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  // ---------- избранное ----------
  function isFavorited(productId) {
    return Object.values(favLists).some((list) => list.includes(productId));
  }
  function toggleProductInList(listName, productId) {
    setFavLists((prev) => {
      const list = prev[listName] || [];
      const idx = list.indexOf(productId);
      const nextList = idx > -1 ? list.filter((id) => id !== productId) : [...list, productId];
      return { ...prev, [listName]: nextList };
    });
  }
  function createFavList(name, productId) {
    if (!name) return;
    setFavLists((prev) => {
      const existing = prev[name] || [];
      const nextList = productId && !existing.includes(productId) ? [...existing, productId] : existing;
      return { ...prev, [name]: nextList };
    });
  }
  function removeFromList(listName, productId) {
    setFavLists((prev) => ({ ...prev, [listName]: (prev[listName] || []).filter((id) => id !== productId) }));
  }
  const favCount = Object.values(favLists).reduce((s, l) => s + l.length, 0);

  // ---------- заказы ----------
  function nextOrderNumber() {
    return generateOrderNumber(usedOrderNumbers.current);
  }

  function getProduct(id) {
    return products.find((p) => String(p.id) === String(id));
  }

  const value = {
    products, loading, getProduct,
    cart, addToCart, removeFromCart, clearCart, cartCount,
    favLists, isFavorited, toggleProductInList, createFavList, removeFromList, favCount,
    nextOrderNumber,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore должен использоваться внутри <StoreProvider>');
  return ctx;
}
