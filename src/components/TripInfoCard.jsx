import StatusStepper from "./StatusStepper";
import {
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ShareIcon,
  TruckIcon,
  WifiOffIcon,
} from "./Icons";
import { statusLabel } from "../utils/status";

function timeAgo(ts) {
  if (!ts) return null;
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 0 || Number.isNaN(diff)) return null;
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `${h} hr ago`;
}

export default function TripInfoCard({ order, lastFixTimestamp, connected, onShare }) {
  const driver = order.driver_info;
  const vehicle = order.vehicle;
  const pickup = order.pickup;
  const drop = order.drop;

  return (
    <div className="trip-card">
      <div className="trip-card-handle" />

      <div className="trip-card-top">
        <div>
          <p className="trip-card-eyebrow">Status</p>
          <h2 className="trip-card-status">{statusLabel(order.status)}</h2>
        </div>
        <button className="icon-btn" onClick={onShare} aria-label="Share tracking link">
          <ShareIcon size={18} />
        </button>
      </div>

      <StatusStepper status={order.status} />

      {!connected && (
        <div className="live-banner offline">
          <WifiOffIcon size={14} /> Reconnecting to live location…
        </div>
      )}
      {connected && lastFixTimestamp && (
        <div className="live-banner online">
          <ClockIcon size={14} /> Location updated {timeAgo(lastFixTimestamp)}
        </div>
      )}

      <div className="trip-section">
        <div className="driver-row">
          <div className="avatar">{(driver?.name || "D").charAt(0).toUpperCase()}</div>
          <div className="driver-meta">
            <p className="driver-name">{driver?.name || "Driver assigned"}</p>
            <p className="vehicle-line">
              <TruckIcon size={14} /> {vehicle?.name || "Vehicle"}
              {vehicle?.number ? ` • ${vehicle.number}` : ""}
            </p>
          </div>
          {driver?.phone && (
            <a className="icon-btn call-btn" href={`tel:${driver.phone}`} aria-label="Call driver">
              <PhoneIcon size={16} />
            </a>
          )}
        </div>
      </div>

      <div className="trip-section route-section">
        <div className="route-row">
          <span className="route-dot pickup" />
          <div>
            <p className="route-label">Pickup</p>
            <p className="route-address">{pickup?.address || "—"}</p>
          </div>
        </div>
        <div className="route-connector" />
        <div className="route-row">
          <span className="route-dot drop" />
          <div>
            <p className="route-label">Drop</p>
            <p className="route-address">{drop?.address || "—"}</p>
          </div>
        </div>
      </div>

      {order.total_distance && (
        <div className="trip-section distance-row">
          <MapPinIcon size={14} />
          <span>{order.total_distance} total distance</span>
        </div>
      )}
    </div>
  );
}
