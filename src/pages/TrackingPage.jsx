import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api";
import Snackbar from "@mui/material/Snackbar";

import { useOrderTracking } from "../hooks/useOrderTracking";
import { useSocketLocation } from "../hooks/useSocketLocation";
import { isLiveTrackable, isTerminal } from "../utils/status";

import LoadingScreen from "../components/LoadingScreen";
import NotFoundScreen from "../components/NotFoundScreen";
import TerminalScreen from "../components/TerminalScreen";
import BrandHeader from "../components/BrandHeader";
import MapCanvas from "../components/MapCanvas";
import TripInfoCard from "../components/TripInfoCard";

const GOOGLE_MAPS_LIBRARIES = ["geometry"];

export default function TrackingPage() {
  const { orderId } = useParams();
  const { order, loading, notFound } = useOrderTracking(orderId);
  const live = order ? isLiveTrackable(order.status) : false;
  const { fix: socketFix, connected } = useSocketLocation(orderId, live);
  const [toastOpen, setToastOpen] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // The backend doesn't persist live coordinates (Firestore writes were
  // dropped for scale), so the marker only appears once the first socket
  // fix streams in — pickup/drop pins + route render immediately either way.
  const fix = socketFix;

  const pickup = useMemo(() => {
    const p = order?.pickup;
    if (!p?.latitude || !p?.longitude) return null;
    return { lat: p.latitude, lng: p.longitude };
  }, [order]);

  const drop = useMemo(() => {
    const d = order?.drop;
    if (!d?.latitude || !d?.longitude) return null;
    return { lat: d.latitude, lng: d.longitude };
  }, [order]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Track my RoadFerry shipment", url });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setToastOpen(true);
    } catch {
      // no-op — clipboard unavailable
    }
  };

  if (loading) return <LoadingScreen />;
  if (notFound || !order) return <NotFoundScreen />;
  if (isTerminal(order.status)) return <TerminalScreen order={order} />;

  return (
    <div className="tracking-page">
      <div className="map-area">
        {isLoaded && pickup && drop ? (
          <MapCanvas pickup={pickup} drop={drop} vehicleName={order.vehicle?.name} fix={fix} />
        ) : (
          <LoadingScreen />
        )}
        <BrandHeader connected={connected} />
        {!fix && (
          <div className="waiting-banner">
            <span className="spinner-sm" />
            Waiting for live location…
          </div>
        )}
      </div>

      <TripInfoCard
        order={order}
        lastFixTimestamp={fix?.timestamp}
        connected={connected}
        onShare={handleShare}
      />

      <Snackbar
        open={toastOpen}
        autoHideDuration={2200}
        onClose={() => setToastOpen(false)}
        message="Tracking link copied"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}
