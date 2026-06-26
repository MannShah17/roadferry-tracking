import { useMemo, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

import { useMockOrder } from "../hooks/useMockOrder";
import { useMockLocation } from "../hooks/useMockLocation";
import { isTerminal } from "../utils/status";

import LoadingScreen from "../components/LoadingScreen";
import TerminalScreen from "../components/TerminalScreen";
import BrandHeader from "../components/BrandHeader";
import MapCanvas from "../components/MapCanvas";
import TripInfoCard from "../components/TripInfoCard";
import TestControlPanel from "../components/TestControlPanel";

const GOOGLE_MAPS_LIBRARIES = ["geometry"];

// Drives the exact same UI as the real /:orderId page but with a synthetic
// order + a simulated GPS feed — lets you preview every state (heading to
// pickup, at pickup, delivered, cancelled, etc.) without a live backend order.
export default function TestTrackingPage() {
  const { order, status, setStatus } = useMockOrder();
  const [playing, setPlaying] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const pickup = useMemo(
    () => ({ lat: order.pickup.latitude, lng: order.pickup.longitude }),
    [order.pickup],
  );
  const drop = useMemo(
    () => ({ lat: order.drop.latitude, lng: order.drop.longitude }),
    [order.drop],
  );

  const { fix, finished, reset } = useMockLocation(pickup, drop, {
    playing: playing && !isTerminal(status),
    isLoaded,
  });

  const controlPanel = (
    <TestControlPanel
      status={status}
      setStatus={setStatus}
      playing={playing}
      setPlaying={setPlaying}
      finished={finished}
      onReset={reset}
    />
  );

  if (isTerminal(status)) {
    return (
      <div className="test-page-wrap">
        <TerminalScreen order={order} />
        {controlPanel}
      </div>
    );
  }

  return (
    <div className="test-page-wrap">
      <div className="tracking-page">
        <div className="map-area">
          {isLoaded ? (
            <MapCanvas pickup={pickup} drop={drop} vehicleName={order.vehicle.name} fix={fix} />
          ) : (
            <LoadingScreen />
          )}
          <BrandHeader connected={playing} />
          {!fix && (
            <div className="waiting-banner">
              <span className="spinner-sm" />
              Waiting for live location…
            </div>
          )}
        </div>

        <TripInfoCard order={order} lastFixTimestamp={fix?.timestamp} connected={playing} onShare={() => {}} />
      </div>

      {controlPanel}
    </div>
  );
}
