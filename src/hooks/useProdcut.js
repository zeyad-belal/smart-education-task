// hooks/useProduct.js
import useSWR from "swr";
import { getProductById } from "../api/productsApi";

export function useProduct(id, { initialData } = {}) {
  const key = id ? ["/product", id] : null;

  const { data, error, isLoading } = useSWR(
    key,
    // wrap sync getter so SWR sees a Promise
    () => Promise.resolve(getProductById(id)),
    {
      fallbackData: initialData || undefined, // instant paint if provided
      revalidateOnFocus: true,
    }
  );

  if (!id) return { status: "idle", data: null, error: null };
  if (isLoading && !data) return { status: "loading", data: null, error: null };
  if (error) return { status: "error", data: null, error };
  if (data) return { status: "success", data, error: null };
  return { status: "idle", data: null, error: null };
}