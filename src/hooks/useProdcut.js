import { useEffect, useState } from "react";
import { getProductById } from "../api/productsApi";

export function useProduct(id) {
  const [state, setState] = useState({ status: "idle", data: null, error: null });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading", error: null }));

    Promise.resolve()
      .then(() => getProductById(id))
      .then((p) => {
        if (cancelled) return;
        if (p) setState({ status: "success", data: p, error: null });
        else setState({ status: "error", data: null, error: new Error("Not found") });
      })
      .catch((e) => {
        if (cancelled) return;
        setState({ status: "error", data: null, error: e });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state; // { status, data, error }
}