import { useEffect, useState } from "react";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { normalizeOrder } from "../utils/normalizeOrder";

// Live-subscribes to order_details/{orderId} so status changes (e.g. "completed")
// reflect instantly without the visitor needing to refresh the share link.
export function useOrderTracking(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const db = getFirestore();
    const ref = doc(db, "order_details", orderId);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setLoading(false);
        if (!snap.exists()) {
          setNotFound(true);
          setOrder(null);
          return;
        }
        setNotFound(false);
        setOrder(normalizeOrder(snap.id, snap.data()));
      },
      (err) => {
        console.error("useOrderTracking snapshot error:", err);
        setLoading(false);
        setNotFound(true);
      },
    );

    return unsubscribe;
  }, [orderId]);

  return { order, loading, notFound };
}
