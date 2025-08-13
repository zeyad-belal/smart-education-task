import { useEffect, useMemo, useRef, useState } from 'react';
import { getProductsPage, prefetchProductsPage } from '../api/productsApi';

export function useProducts(initialPage = 1, pageSize = 48) {
  const [page, setPage] = useState(initialPage);
  const [state, setState] = useState({ status: 'idle', data: null, error: null });
  const abortRef = useRef(null);

  const canNext = state.data?.pagination.hasNext;
  const canPrev = state.data?.pagination.hasPrev;
  

  const load = useMemo(() => {
    return async (p) => {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setState((s) => ({ ...s, status: 'loading' }));

      try {
        const res = await getProductsPage(p, pageSize, { signal: ctrl.signal });
        setState({ status: 'success', data: res, error: null });
        if (res.pagination.hasNext) prefetchProductsPage(p + 1, pageSize); // prefetch next page
      } catch (e) {
        if (e?.name === 'AbortError') return;
        setState({ status: 'error', data: null, error: e });
      }
      
    };
  }, [pageSize]);

  useEffect(() => {
    load(page);
    return () => abortRef.current?.abort();
  }, [page, load]);

  return {
    page,
    pageSize,
    state,         // { status: 'idle'|'loading'|'success'|'error', data?, error? }
    next: () => canNext && setPage((p) => p + 1),
    prev: () => canPrev && setPage((p) => Math.max(1, p - 1)),
    goto: (p) => setPage(Math.max(1, Math.floor(p))),
    canNext,
    canPrev,
  };
}