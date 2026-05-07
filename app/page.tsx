'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import StopList from "./offline/page.tsx"
import StopComponent from "@/offlineComponents/stop.tsx"
import ReportComponent from "@/offlineComponents/report.tsx"
import { useView } from '@/contexts/ViewContext';

export default function Home() {
  const { view, setView } = useView();

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('viewState');

    if (saved) {
      setView(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('viewState', JSON.stringify(view));
  }, [view]);

  const navigateToStop = (id: string | number) => {
    setView({
      type: 'stop',
      stopID: id
    });
  };

  const navigateToReport = (
    reportID: string | number,
    deviceID: string | number
  ) => {
    setView({
      type: 'report',
      reportID,
      deviceID
    });
  };

  // -----------------------------------
  // Swipe Handling
  // -----------------------------------
  const handleTouchStart = (e: React.TouchEvent) => {

    // Disable all swipe navigation in report view
    if (view.type === 'report') {
      return;
    }

    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {

    // Disable all swipe navigation in report view
    if (view.type === 'report') {
      return;
    }

    touchEndX.current = e.changedTouches[0].screenX;

    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance = touchEndX.current - touchStartX.current;

    const SWIPE_THRESHOLD = 75;

    // RIGHT SWIPE ONLY (Back Navigation)
    // finger moves left -> right
    if (distance > SWIPE_THRESHOLD) {

      // STOP -> LIST
      if (view.type === 'stop') {
        setView({ type: 'list' });
      }
    }

    // LEFT SWIPE DISABLED
    // intentionally no action

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full"
    >
      {view.type === 'stop' && (
        <StopComponent
          stopID={view.stopID}
          onSelectStop={navigateToStop}
          navigateToReport={navigateToReport}
          navigateToList={() => setView({ type: 'list' })}
        />
      )}

      {view.type === 'report' && (
        <ReportComponent
          reportID={view.reportID}
          deviceID={view.deviceID}
          onSelectStop={navigateToStop}
        />
      )}

      {view.type === 'list' && (
        <StopList
          onSelectStop={(id) =>
            setView({
              type: 'stop',
              stopID: id
            })
          }
          onSelectReport={(rID, dID) =>
            setView({
              type: 'report',
              reportID: rID,
              deviceID: dID
            })
          }
        />
      )}
    </div>
  );
}