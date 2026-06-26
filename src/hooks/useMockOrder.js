import { useState } from "react";

// Ahmedabad -> Vadodara: a real ~110km road route, long enough to see the
// vehicle actually glide instead of teleporting in two ticks.
const PICKUP = {
  address: "Maninagar, Ahmedabad, Gujarat 380008",
  latitude: 23.0225,
  longitude: 72.5714,
};
const DROP = {
  address: "Sayajigunj, Vadodara, Gujarat 390005",
  latitude: 22.3072,
  longitude: 73.1812,
};

export function useMockOrder() {
  const [status, setStatus] = useState("on_way_to_pickup");

  const order = {
    id: "TEST-ORDER",
    status,
    orderId: "RF-TEST001",
    vehicle: { name: "Tata Ace", number: "GJ01AB1234" },
    driver_info: { name: "Ramesh Patel", phone: "9999999999" },
    pickup: PICKUP,
    drop: DROP,
    total_distance: "112 km",
  };

  return { order, status, setStatus };
}
