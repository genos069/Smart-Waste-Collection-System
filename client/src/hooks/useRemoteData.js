import { useCallback, useEffect, useRef, useState } from "react";

// Refresh after mutations and poll without discarding the last successful response.
export default function useRemoteData(loader, pollInterval = 0) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const active = useRef(false);
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    const requestId = ++sequence.current;
    try {
      const result = await loader();
      if (active.current && requestId === sequence.current) {
        setData(result);
        setError("");
        setUpdatedAt(new Date());
      }
      return result;
    } catch (err) {
      if (active.current && requestId === sequence.current) setError(err.message || "Unable to load data.");
      return null;
    } finally {
      if (active.current && requestId === sequence.current) setLoading(false);
    }
  }, [loader]);
  const invalidate = useCallback(() => { sequence.current += 1; }, []);
  useEffect(() => {
    active.current = true;
    void refresh();
    const timer = pollInterval ? setInterval(refresh, pollInterval) : null;
    return () => { active.current = false; invalidate(); if (timer) clearInterval(timer); };
  }, [refresh, pollInterval, invalidate]);
  return { data, loading, error, updatedAt, refresh };
}
