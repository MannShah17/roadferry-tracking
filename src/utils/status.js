// Maps the backend's (somewhat inconsistently cased) order status strings to a
// clean step index + label for the UI. Backend source of truth is order_details.status.

export const STEPS = [
  { match: ["bidding", "bidwon"], label: "Order Placed" },
  { match: ["assigned"], label: "Driver Assigned" },
  { match: ["on_way_to_pickup", "on-way", "on-loading"], label: "Heading to Pickup" },
  { match: ["arrived_at_pickup", "at pickup location"], label: "At Pickup" },
  { match: ["on_way_to_drop"], label: "Heading to Drop" },
  { match: ["arrived_at_drop", "at destination location"], label: "Arrived at Drop" },
  { match: ["completed"], label: "Delivered" },
];

const TERMINAL = ["completed", "cancelled", "rejected"];

export function normalize(status) {
  return (status || "").toLowerCase().trim();
}

export function getStepIndex(status) {
  const norm = normalize(status);
  for (let i = 0; i < STEPS.length; i++) {
    if (STEPS[i].match.includes(norm)) return i;
  }
  return TERMINAL.includes(norm) ? STEPS.length - 1 : 0;
}

export function isTerminal(status) {
  return TERMINAL.includes(normalize(status));
}

export function isCompleted(status) {
  return normalize(status) === "completed";
}

export function isCancelled(status) {
  return ["cancelled", "rejected"].includes(normalize(status));
}

// Whether the order is in a state where live GPS tracking is meaningful.
export function isLiveTrackable(status) {
  const norm = normalize(status);
  return !TERMINAL.includes(norm) && norm !== "bidding" && norm !== "bidwon";
}

export function statusLabel(status) {
  const norm = normalize(status);
  const step = STEPS.find((s) => s.match.includes(norm));
  return step?.label || status || "—";
}
