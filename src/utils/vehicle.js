export function isTwoWheeler(vehicleName) {
  const n = (vehicleName || "").toLowerCase();
  return n.includes("bike") || n.includes("scooter") || n.includes("two wheeler");
}
