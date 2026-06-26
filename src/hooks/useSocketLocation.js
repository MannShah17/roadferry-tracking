import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.roadferry.in";

// Joins the order's socket room and streams live driver GPS fixes.
// Disabled (no connection at all) once the order is no longer live-trackable —
// keeps completed/cancelled trips from holding open sockets.
export function useSocketLocation(orderId, enabled) {
  const [fix, setFix] = useState(null); // { lat, lng, timestamp }
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!orderId || !enabled) return;

    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("joinOrderRoom", orderId);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("locationUpdate", (data) => {
      // Current backend payload: { order_id, coordinates: { latitude, longitude }, timestamp }
      const lat = data?.coordinates?.latitude ?? data?.latitude;
      const lng = data?.coordinates?.longitude ?? data?.longitude;
      if (lat == null || lng == null) return;
      setFix({ lat: Number(lat), lng: Number(lng), timestamp: data.timestamp || Date.now() });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [orderId, enabled]);

  return { fix, connected };
}
