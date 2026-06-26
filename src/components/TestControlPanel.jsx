const STATUS_OPTIONS = [
  { value: "assigned", label: "Assigned" },
  { value: "on_way_to_pickup", label: "Heading to Pickup" },
  { value: "arrived_at_pickup", label: "At Pickup" },
  { value: "on_way_to_drop", label: "Heading to Drop" },
  { value: "arrived_at_drop", label: "Arrived at Drop" },
  { value: "completed", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function TestControlPanel({ status, setStatus, playing, setPlaying, finished, onReset }) {
  return (
    <div className="test-panel">
      <span className="test-panel-tag">TEST MODE</span>

      <select
        className="test-panel-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button className="test-panel-btn" onClick={() => setPlaying((p) => !p)}>
        {playing ? "Pause" : "Play"}
      </button>
      <button className="test-panel-btn" onClick={onReset}>
        Reset
      </button>
      {finished && <span className="test-panel-tag finished">Reached drop</span>}
    </div>
  );
}
