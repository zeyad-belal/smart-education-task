import  { useEffect, useMemo, useReducer } from 'react';
import { CartCtx } from './CartContext';

const LS_KEY = 'cart.v1';

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, qty = 1 } = action;
      const id = product.id;
      const existing = state.items[id];
      const newQty = (existing?.qty ?? 0) + qty;
      return { items: { ...state.items, [id]: { product, qty: newQty } } };
    }
    case 'REMOVE': {
      const { [action.productId]: _, ...rest } = state.items;
      return { items: rest };
    }
    case 'SET_QTY': {
      const { productId, qty } = action;
      if (qty <= 0) {
        const { [productId]: _, ...rest } = state.items;
        return { items: rest };
      }
      const item = state.items[productId];
      if (!item) return state;
      return { items: { ...state.items, [productId]: { ...item, qty } } };
    }
    case 'CLEAR':
      return { items: {} };
    default:
      return state;
  }
}

export default function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: {} }, () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || { items: {} }; } catch { return { items: {} }; }
  });
  useEffect(() => localStorage.setItem(LS_KEY, JSON.stringify(state)), [state]);

  const count = useMemo(() => Object.values(state.items).reduce((a, it) => a + it.qty, 0), [state.items]);
  const total = useMemo(() => Object.values(state.items).reduce((a, it) => a + it.qty * it.product.price, 0), [state.items]);

  const value = useMemo(() => ({
    state,
    add: (product, qty = 1) => dispatch({ type: 'ADD', product, qty }),
    remove: (id) => dispatch({ type: 'REMOVE', productId: id }),
    setQty: (id, qty) => dispatch({ type: 'SET_QTY', productId: id, qty }),
    clear: () => dispatch({ type: 'CLEAR' }),
    count,
    total,
  }), [state, count, total]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}