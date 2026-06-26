// Maps the raw order_details Firestore document (backend's storage schema)
// into the flat shape the tracking UI components expect. Kept separate from
// the REST API's own formatting so this stays in sync with what's actually
// stored, independent of any one controller's response shape.

function formatAddress(loc) {
  if (!loc) return null;
  return [loc.flat_name, loc.area, loc.city, loc.pincode].filter(Boolean).join(", ");
}

export function normalizeOrder(id, raw) {
  const pickup = raw.pickup_location || {};
  const drop = raw.drop_location || {};
  const driver = raw.driver_details || null;
  const vehicle = raw.vehicle_details || {};

  return {
    id,
    status: raw.status || "",
    orderId: raw.order_id || id,
    vehicle: {
      name: vehicle.vehicle_type || raw.vehicle_type || null,
      number: vehicle.vehicle_number || null,
    },
    driver_info:
      driver && (driver.first_name || driver.phone || driver.phone_number)
        ? {
            name: `${driver.first_name || ""} ${driver.last_name || ""}`.trim() || null,
            phone: driver.phone || driver.phone_number || null,
          }
        : null,
    pickup: {
      address: formatAddress(pickup),
      latitude: pickup.coordinate?.latitude || null,
      longitude: pickup.coordinate?.longitude || null,
    },
    drop: {
      address: formatAddress(drop),
      latitude: drop.coordinate?.latitude || null,
      longitude: drop.coordinate?.longitude || null,
    },
    total_distance: raw.distance ? `${raw.distance} km` : null,
  };
}
