'use client';

import { useEffect, useState } from "react";
import StopCard from "../../components/StopCard";
import { routeStops } from "../../helpers/googlemaps.js";

export default function StopsList({ stops, reloadList }) {
  const [sortedStops, setSortedStops] = useState([]);

  // Helper: determine if a stop has a specific time window
  const isTimedStop = (stop) => {
    if (!stop.startTime || !stop.endTime) return false;
    return !(stop.startTime === "08:00" && stop.endTime === "16:00");
  };

  useEffect(() => {
    const sortAndRouteStops = async () => {
      try {
        // Split stops into 3 categories
        const timedStops = stops
          .filter((s) => isTimedStop(s) && s.status !== "COMPLETED")
          .map((s) => ({ ...s, isRouted: false }));

        const nonTimedStops = stops
          .filter((s) => !isTimedStop(s) && s.status !== "COMPLETED")
          .map((s) => ({ ...s, isRouted: false }));

        const completedStops = stops
          .filter((s) => s.status === "COMPLETED")
          .map((s) => ({ ...s, isRouted: false }));

        // Route only non-timed stops
        const routedNonTimedStops = await routeStops(nonTimedStops);

        // Mark routed stops
        const routedStopsWithFlag = routedNonTimedStops.map((s) => ({
          ...s,
          isRouted: true,
        }));

        // Combine all
        setSortedStops([
          ...timedStops,
          ...routedStopsWithFlag,
          ...completedStops,
        ]);
      } catch (err) {
        console.error("Error routing stops:", err);
        // Fallback: set all stops with default flag
        setSortedStops(stops.map((s) => ({ ...s, isRouted: false })));
      }
    };

    if (stops?.length) sortAndRouteStops();
  }, [stops]);

  return (
    <div>
      {sortedStops.map((stop) => (
        <StopCard
          key={stop.stopID}
          stopID={stop.stopID}
          item={stop}
          reloadList={reloadList}
        />
      ))}
    </div>
  );
}
