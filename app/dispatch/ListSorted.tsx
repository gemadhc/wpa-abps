'use client';
import StopCard from "../../components/StopCard"

export default function StopsList({ stops, reloadList }) {
  // Helper to determine if a stop is timed
  const isTimedStop = (stop) => {
    if (!stop.startTime || !stop.endTime) return false;
    return !(stop.startTime === "08:00" && stop.endTime === "16:00");
  };

  // Sort logic:
  // 1. Timed + not completed → top
  // 2. Non-timed + not completed → middle
  // 3. Completed → bottom
  const sortedStops = [...stops].sort((a, b) => {
    const aTimed = isTimedStop(a);
    const bTimed = isTimedStop(b);
    const aCompleted = a.status === 'COMPLETED';
    const bCompleted = b.status === 'COMPLETED';

    // Completed stops go last
    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;

    // Among not completed, timed goes first
    if (aTimed && !bTimed) return -1;
    if (!aTimed && bTimed) return 1;

    // Keep order for same category
    return 0;
  });

  return (
    <div >
      {sortedStops.map((stop) => (
        <StopCard 
          key={stop.stopID} 
          stopID={stop.stopID} 
          item={stop} 
          reloadList = { reloadList }
        />
      ))}
    </div>
  );
}
