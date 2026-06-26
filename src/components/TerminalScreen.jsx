import { CheckCircleIcon, MapPinIcon, TruckIcon, XCircleIcon } from "./Icons";
import { isCancelled } from "../utils/status";

// Shown once an order is completed or cancelled — replaces the live map per
// design: tracking only matters while the trip is in motion.
export default function TerminalScreen({ order }) {
  const cancelled = isCancelled(order.status);

  return (
    <div className="terminal-screen">
      <div className={`terminal-badge ${cancelled ? "cancelled" : "completed"}`}>
        {cancelled ? <XCircleIcon size={40} /> : <CheckCircleIcon size={40} />}
      </div>
      <h1 className="terminal-title">
        {cancelled ? "This order was cancelled" : "Delivered successfully"}
      </h1>
      <p className="terminal-subtitle">
        {cancelled
          ? "Live tracking is no longer available for this order."
          : "Thanks for shipping with RoadFerry. Live tracking has ended for this trip."}
      </p>

      <div className="terminal-summary">
        <div className="terminal-row">
          <TruckIcon size={16} />
          <span>
            {order.vehicle?.name || "Vehicle"}
            {order.vehicle?.number ? ` • ${order.vehicle.number}` : ""}
          </span>
        </div>
        <div className="terminal-route">
          <div className="route-row">
            <span className="route-dot pickup" />
            <p className="route-address">{order.pickup?.address || "—"}</p>
          </div>
          <div className="route-connector" />
          <div className="route-row">
            <span className="route-dot drop" />
            <p className="route-address">{order.drop?.address || "—"}</p>
          </div>
        </div>
        {order.total_distance && (
          <div className="terminal-row">
            <MapPinIcon size={16} />
            <span>{order.total_distance} travelled</span>
          </div>
        )}
      </div>

      <p className="terminal-footer">RoadFerry — Logistics Partner Platform</p>
    </div>
  );
}
