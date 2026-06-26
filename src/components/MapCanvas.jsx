import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, DirectionsRenderer, OverlayView, Polyline } from "@react-google-maps/api";
import RoadVehicleMarker from "./RoadVehicleMarker";
import { flattenDirectionsPath, straightLinePath } from "../utils/geo";
import { isTwoWheeler } from "../utils/vehicle";
import { MAP_OPTIONS } from "../utils/mapStyle";
import { NavigationIcon } from "./Icons";

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

const ROUTE_OPTIONS = {
  suppressMarkers: true,
  preserveViewport: true,
  polylineOptions: {
    strokeColor: "#1B2E4B",
    strokeOpacity: 0.85,
    strokeWeight: 4,
  },
};

// Used only when the Directions API call fails (e.g. billing not enabled) —
// still gives a visible route line, just not road-snapped.
const FALLBACK_LINE_OPTIONS = {
  strokeColor: "#1B2E4B",
  strokeOpacity: 0.6,
  strokeWeight: 3,
  icons: [
    {
      icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 },
      offset: "0",
      repeat: "14px",
    },
  ],
};

function EndpointPin({ kind }) {
  const color = kind === "pickup" ? "#10B981" : "#FF6B2B";
  return (
    <div className="endpoint-pin" style={{ background: color }}>
      <span />
    </div>
  );
}

function OverlayPin({ position, kind }) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={() => ({ x: -10, y: -10 })}
    >
      <EndpointPin kind={kind} />
    </OverlayView>
  );
}

export default function MapCanvas({ pickup, drop, vehicleName, fix }) {
  const mapRef = useRef(null);
  const [directions, setDirections] = useState(null);
  const [path, setPath] = useState([]);
  const [following, setFollowing] = useState(true);
  const boundsFitRef = useRef(false);
  // Computed once — all subsequent movement happens imperatively via panTo()
  // below. Binding `center` reactively to `fix` would fight that and jump
  // instead of glide.
  const [initialCenter] = useState(() => fix || pickup);

  const tryFitBounds = useCallback(() => {
    if (boundsFitRef.current || !mapRef.current || !window.google) return;
    if (!pickup || !drop) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pickup);
    bounds.extend(drop);
    if (fix) bounds.extend(fix);
    mapRef.current.fitBounds(bounds, 64);
    boundsFitRef.current = true;
  }, [pickup, drop, fix]);

  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      tryFitBounds();
    },
    [tryFitBounds],
  );

  // Fetch the actual road route once both endpoints are known.
  useEffect(() => {
    if (!pickup || !drop || !window.google) return;
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: pickup,
        destination: drop,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          setPath(flattenDirectionsPath(result));
        } else {
          // Directions API often needs billing enabled even when the Maps JS
          // API itself works fine — fall back to a straight line so the
          // vehicle still moves and the page doesn't get stuck waiting.
          console.warn("DirectionsService failed, using straight line:", status);
          setPath(straightLinePath(pickup, drop));
        }
      },
    );
  }, [pickup, drop]);

  // Initial bounds fit across pickup + drop (+ first fix once available) —
  // also re-checked here in case the map finishes loading after this effect
  // already ran once with mapRef still null.
  useEffect(() => {
    tryFitBounds();
  }, [tryFitBounds]);

  // Follow the vehicle while in "following" mode.
  useEffect(() => {
    if (following && fix && mapRef.current) {
      mapRef.current.panTo(fix);
    }
  }, [fix, following]);

  const recenter = () => {
    setFollowing(true);
    if (fix && mapRef.current) mapRef.current.panTo(fix);
  };

  return (
    <div className="map-canvas">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={initialCenter}
        zoom={14}
        onLoad={onMapLoad}
        onDragStart={() => setFollowing(false)}
        options={MAP_OPTIONS}
      >
        {directions && <DirectionsRenderer directions={directions} options={ROUTE_OPTIONS} />}
        {!directions && path.length > 0 && (
          <Polyline path={path} options={FALLBACK_LINE_OPTIONS} />
        )}

        {pickup && <OverlayPin position={pickup} kind="pickup" />}
        {drop && <OverlayPin position={drop} kind="drop" />}

        {fix && (
          <RoadVehicleMarker fix={fix} path={path} twoWheeler={isTwoWheeler(vehicleName)} />
        )}
      </GoogleMap>

      {!following && (
        <button className="recenter-btn" onClick={recenter} aria-label="Recenter on vehicle">
          <NavigationIcon size={16} />
        </button>
      )}
    </div>
  );
}
