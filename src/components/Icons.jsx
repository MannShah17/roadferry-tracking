// Minimal inline SVG icon set — no extra icon-library dependency needed.

const base = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export function PackageIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="M3.3 7 12 12l8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

export function UserCheckIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="m16 11 2 2 4-4" />
    </svg>
  );
}

export function TruckIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M14 18V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1" />
      <path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-1" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export function MapPinIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function XCircleIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

export function PhoneIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function ShareIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51 15.42 17.49M15.41 6.51 8.59 10.49" />
    </svg>
  );
}

export function ClockIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export function NavigationIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <path d="m3 11 19-9-9 19-2-8z" />
    </svg>
  );
}

export function WifiOffIcon({ size = 18, ...p }) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M2 2 22 22M8.5 16.5a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 5-2.55M19 12.9a10 10 0 0 0-2.22-1.61M10.7 5.07A16 16 0 0 1 22.6 9M1.4 9a15.9 15.9 0 0 1 4.1-2.93" />
      <path d="M12 20h.01" />
    </svg>
  );
}
