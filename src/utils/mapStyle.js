// Clean, low-noise light map theme (muted roads/labels, no clutter) so the
// route + vehicle marker stay the visual focus.
export const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f5f6f8" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f6f8" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visible: false }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e2e5ea" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#ffe3d3" }] },
  { featureType: "road.arterial", elementType: "labels", stylers: [{ visibility: "simplified" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#dceefb" }] },
];

export const MAP_OPTIONS = {
  styles: MAP_STYLE,
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  gestureHandling: "greedy",
};
