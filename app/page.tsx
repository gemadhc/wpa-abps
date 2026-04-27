'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import StopList from "./offline/page.tsx"
import StopComponent from "@/offlineComponents/stop.tsx"
import ReportComponent from "@/offlineComponents/report.tsx"
import { useView } from '@/contexts/ViewContext';

export default function Home() {
	const { view, setView } = useView();

	useEffect(() => {
	  const saved = localStorage.getItem('viewState');
	  if (saved) setView(JSON.parse(saved));
	}, []);

	useEffect(() => {
	  localStorage.setItem('viewState', JSON.stringify(view));
	}, [view]);

  const navigateToStop = (id) => {
    setView({ type: 'stop', stopID: id });
  };

  const navigateToReport = (reportID, deviceID) => {
    setView({ type: 'report', reportID, deviceID });
  };

  return (
    <div>
      {view.type === 'stop' && (
        <StopComponent 
          stopID={view.stopID} 
          onSelectStop = {navigateToStop}
          navigateToReport={ navigateToReport }
          navigateToList={ () => setView({type: 'list'} ) }
        />
      )}

      {view.type === 'report' && (
        <ReportComponent
          reportID={view.reportID}
          deviceID={view.deviceID}
          onSelectStop = { navigateToStop }
        />
      )}

      {view.type === 'list' && (
        <StopList 
          onSelectStop={(id) =>
            setView({ type: 'stop', stopID: id })
          }
          onSelectReport={(rID, dID) =>
            setView({ type: 'report', reportID: rID, deviceID: dID })
          }
        />
      )}
    </div>
  );
}
