// Geometry helpers for smooth, road-following marker animation.

export function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function haversineMeters(a, b) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Bearing in degrees (0 = north, 90 = east) from point a to point b.
export function bearingBetween(a, b) {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function lerpLatLng(a, b, t) {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}

export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Flattens a Google DirectionsResult into a dense array of {lat, lng} points
// following the actual road geometry (not just the coarse waypoint list).
export function flattenDirectionsPath(directionsResult) {
  const route = directionsResult?.routes?.[0];
  if (!route) return [];
  const pts = [];
  route.legs?.forEach((leg) => {
    leg.steps?.forEach((step) => {
      step.path?.forEach((latLng) => {
        pts.push({ lat: latLng.lat(), lng: latLng.lng() });
      });
    });
  });
  return pts;
}

// Straight-line fallback path between two points, used when the Directions
// API is unavailable (e.g. billing not enabled) — keeps movement simulation
// and live tracking functional without road-snapped geometry.
export function straightLinePath(a, b, steps = 80) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    pts.push(lerpLatLng(a, b, i / steps));
  }
  return pts;
}

// Finds the closest point on `path` to `point`. Returns null for an empty path.
export function nearestPointOnPath(path, point) {
  if (!path.length) return null;
  let bestIndex = 0;
  let bestDist = Infinity;
  for (let i = 0; i < path.length; i++) {
    const d = haversineMeters(path[i], point);
    if (d < bestDist) {
      bestDist = d;
      bestIndex = i;
    }
  }
  return { index: bestIndex, point: path[bestIndex], distanceMeters: bestDist };
}
