export default function BrandHeader({ connected }) {
  return (
    <div className="brand-header">
      <img src="/logo_roadferry.png" alt="RoadFerry" className="brand-logo" />
      <div className="brand-pill">
        <span className={`brand-dot ${connected ? "live" : ""}`} />
        Live Tracking
      </div>
    </div>
  );
}
