import { useEffect, useRef, useState } from "react";
import { OverlayView } from "@react-google-maps/api";
import {
  bearingBetween,
  easeInOutQuad,
  lerpLatLng,
  nearestPointOnPath,
} from "../utils/geo";
import { VehicleIcon } from "./VehicleIcon";

const TWEEN_MS = 2500;
const SNAP_THRESHOLD_M = 80;

const pixelOffset = (w, h) => ({ x: -(w / 2), y: -(h / 2) });

// Glides the vehicle marker from its last rendered position to a new GPS fix.
// When the fix sits close to the route polyline, it travels *along the road
// geometry* between the two points rather than cutting a straight line.
export default function RoadVehicleMarker({ fix, path, twoWheeler }) {
  const [renderPos, setRenderPos] = useState(fix || null);
  const [bearing, setBearing] = useState(0);
  const frameRef = useRef(null);
  const lastFixRef = useRef(fix || null);
  const lastPathIndexRef = useRef(0);

  useEffect(() => {
    if (!fix) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const prevFix = lastFixRef.current || fix;

    let subPath = [prevFix, fix];
    let nextIndex = lastPathIndexRef.current;

    if (path && path.length > 1) {
      const nearest = nearestPointOnPath(path, fix);
      if (nearest && nearest.distanceMeters < SNAP_THRESHOLD_M) {
        const fromIdx = lastPathIndexRef.current;
        const toIdx = nearest.index;
        if (toIdx > fromIdx) {
          subPath = path.slice(fromIdx, toIdx + 1);
          nextIndex = toIdx;
        } else if (toIdx < fromIdx) {
          // Backward snap (GPS noise / path re-resolved) — just glide direct.
          subPath = [prevFix, fix];
          nextIndex = toIdx;
        }
      }
    }
    if (subPath.length < 2) subPath = [prevFix, fix];

    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / TWEEN_MS, 1);
      const eased = easeInOutQuad(t);
      const idxFloat = eased * (subPath.length - 1);
      const i0 = Math.floor(idxFloat);
      const i1 = Math.min(i0 + 1, subPath.length - 1);
      const frac = idxFloat - i0;
      const pos = lerpLatLng(subPath[i0], subPath[i1], frac);
      setRenderPos(pos);
      if (subPath[i1] && (subPath[i1].lat !== subPath[i0].lat || subPath[i1].lng !== subPath[i0].lng)) {
        setBearing(bearingBetween(subPath[i0], subPath[i1]));
      }
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        lastFixRef.current = fix;
        lastPathIndexRef.current = nextIndex;
      }
    }

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fix]);

  if (!renderPos) return null;

  return (
    <OverlayView
      position={renderPos}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={pixelOffset}
    >
      <div className="vehicle-marker" style={{ transform: `rotate(${bearing}deg)` }}>
        <span className="vehicle-pulse" />
        <span className="vehicle-icon-wrap">
          <VehicleIcon twoWheeler={twoWheeler} />
        </span>
      </div>
    </OverlayView>
  );
}
