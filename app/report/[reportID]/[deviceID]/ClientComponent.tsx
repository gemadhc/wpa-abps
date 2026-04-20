'use client'

import StopBody from '@/components/StopBody';
import { getStops } from '@/lib/stop_db';
import { useState, useEffect } from 'react'
import Results from "@/components/Results"
import WaterLoader from "@/components/WaterLoader"

import { requestAssembly, createAssembly } from "@/actions/assembly";
import { requestReport } from "@/actions/report";

import { getReport,  createItem as createReport } from "@/lib/reports_db"
import { getAssembly, createItem as createAssemblyItem } from "@/lib/assemblies_db"

import { ReportProvider } from "@/contexts/ReportContext";

export default  function ClientComponent({ reportID, deviceID }) {
	const [initialReport, setInitialReport] = useState(null); 	
	const [initialDevice, setInitialDevice] = useState(null); 

  const loadReport = async () => {

    const cached = await getReport(reportID);
    if (cached) {
      return cached;
    }
    if (!navigator.onLine) return null;
    const report = await requestReport(reportID);
    createReport({ ...report }, reportID);
    return report;
  };

  const loadDevice = async () => {

    const cached = await getAssembly(deviceID);
    if (cached) return cached;
    if (!navigator.onLine) return null;
    const device = await requestAssembly(deviceID);
    createAssemblyItem({ ...device }, deviceID);
    return device;
    
  };

	const getter = async ()=>{
    Promise.all([
      loadReport(),
      loadDevice()
    ]).then( ( [report, device] ) => {
      setInitialReport(report);
      setInitialDevice(device);
    })
  }

	useEffect(()=>{
    if( reportID && deviceID ){
      getter()
    }
    
	}, [])

  return (
  	<div className = "text-black h-screen py-5 px-5">	
      {
        initialReport && initialDevice ? 
          <ReportProvider initialReport={initialReport} initialDevice={initialDevice}>
            <Results 
              closeMe={() => setOpenResultsDialog(false)}
              reloadServices={() => reloadServices()}
              saving = { (bool) => setSaving(bool)}
            />
          </ReportProvider>
        : 
          <div className="pt-50 text-center">
            <h2>Loading Report</h2>
            <WaterLoader />
          </div>
      }
  		
    </div>
  );
}