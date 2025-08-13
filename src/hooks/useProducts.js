import { useEffect, useState , useMemo} from "react";
import useSWR, { preload } from "swr";
import { getProductsPage } from "../api/productsApi";

const key = (page, pageSize) => ["/products", page, pageSize];

const fetcher = ([, page, pageSize]) => getProductsPage(page, pageSize);

export function useProducts(initialPage = 1, pageSize = 48) {
  const [page, setPage] = useState(initialPage);

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key(page, pageSize),
    fetcher,
    { keepPreviousData: true, revalidateOnFocus: true }
  );

  // Prefetch next page 
  useEffect(() => {
    if (data?.pagination?.hasNext) {
      const nextPage = page + 1;
      preload(key(nextPage, pageSize), fetcher);
    }
  }, [data?.pagination?.hasNext, page, pageSize]);

  const state = useMemo(() => {
    if (isLoading && !data) return { status: "loading", data: null, error: null };
    if (error) return { status: "error", data: null, error };
    if (data) return { status: "success", data, error: null };
    return { status: "idle", data: null, error: null };
  }, [isLoading, data, error]);

  const canNext = data?.pagination?.hasNext;
  const canPrev = data?.pagination?.hasPrev;

  return {
    page,
    pageSize,
    state,
    next: () => canNext && setPage((p) => p + 1),
    prev: () => canPrev && setPage((p) => Math.max(1, p - 1)),
    goto: (p) => setPage(Math.max(1, Math.floor(p))),
    canNext,
    canPrev,
    refresh: () => mutate(),
    isValidating,
  };
}