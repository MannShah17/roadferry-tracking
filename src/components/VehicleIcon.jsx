// Top-down vehicle glyphs for the live marker. Drawn pointing "north" (up) at
// rotation 0 so a CSS rotate(bearingDeg) lines it up with true direction of travel.

export function VehicleIcon({ twoWheeler, size = 30, color = "#FF6B2B" }) {
  if (twoWheeler) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2c-1.1 0-2 .9-2 2 0 .74.4 1.38 1 1.72V8H9.5L8 11H6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3c0-.35-.06-.69-.17-1H9l1.5-3h3l1.5 3h-.83c-.11.31-.17.65-.17 1 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3h-1.5L13 8h-.5V5.72c.6-.34 1-.98 1-1.72 0-1.1-.9-2-2-2Z"
          fill={color}
        />
        <circle cx="6" cy="14" r="1.6" fill="white" />
        <circle cx="18" cy="14" r="1.6" fill="white" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="7" y="2" width="10" height="13" rx="2" fill={color} />
      <rect x="8.3" y="4" width="7.4" height="5.5" rx="1" fill="white" fillOpacity="0.35" />
      <path d="M9 15h6l2.2 4.2c.3.6-.1 1.3-.8 1.3H7.6c-.7 0-1.1-.7-.8-1.3L9 15Z" fill={color} />
      <circle cx="8.5" cy="20" r="1.6" fill="#1B2E4B" />
      <circle cx="15.5" cy="20" r="1.6" fill="#1B2E4B" />
    </svg>
  );
}
