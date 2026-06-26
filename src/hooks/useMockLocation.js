import { useEffect, useRef, useState } from "react";
import { flattenDirectionsPath, straightLinePath } from "../utils/geo";

// Simulates a driver moving from pickup to drop along the real road route,
// emitting one fix every `intervalMs` — identical shape to useSocketLocation's
// fix, so MapCanvas/RoadVehicleMarker need no test-mode special-casing.
const STEPS_ACROSS_ROUTE = 80;

export function useMockLocation(pickup, drop, { playing, intervalMs = 2000, isLoaded } = {}) {
  const [fix, setFix] = useState(null);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(null);
  const pathRef = useRef([]);
  const indexRef = useRef(0);

  useEffect(() => {
    // window.google can exist before maps.DirectionsService is actually attached —
    // wait for useJsApiLoader's isLoaded, same gating MapCanvas relies on.
    if (!pickup || !drop || !isLoaded || !window.google?.maps?.DirectionsService) return;
    const service = new window.google.maps.DirectionsService();
    service.route(
      { origin: pickup, destination: drop, travelMode: window.google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === "OK") {
          pathRef.current = flattenDirectionsPath(result);
        } else {
          // Directions API often needs billing enabled even when the Maps
          // JS API itself works — fall back to a straight line so the
          // simulator (and the real map) keep working regardless.
          console.warn("Mock route DirectionsService failed, using straight line:", status);
          setError(status);
          pathRef.current = straightLinePath(pickup, drop);
        }
        indexRef.current = 0;
        setFinished(false);
        setFix({ ...pathRef.current[0], timestamp: Date.now() });
      },
    );
  }, [pickup, drop, isLoaded]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const path = pathRef.current;
      if (!path.length) return;
      const step = Math.max(1, Math.floor(path.length / STEPS_ACROSS_ROUTE));
      indexRef.current = Math.min(indexRef.current + step, path.length - 1);
      setFix({ ...path[indexRef.current], timestamp: Date.now() });
      if (indexRef.current >= path.length - 1) {
        setFinished(true);
        clearInterval(id);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [playing, intervalMs]);

  const reset = () => {
    indexRef.current = 0;
    setFinished(false);
    if (pathRef.current.length) setFix({ ...pathRef.current[0], timestamp: Date.now() });
  };

  return { fix, finished, error, reset };
}
