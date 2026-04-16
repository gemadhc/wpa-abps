'use client'

import StopBody from '@/components/StopBody';
import { getStops } from '@/lib/stop_db';
import { useState, useEffect } from 'react'
import Results from "@/components/Results"

import { requestAssembly, createAssembly } from "@/actions/assembly";
import { requestReport } from "@/actions/report";

import { getReport,  createItem as createReport } from "@/lib/reports_db"
import { getAssembly, createItem as createAssemblyItem } from "@/lib/assemblies_db"

import { ReportProvider } from "@/contexts/ReportContext";

export default  function ClientComponent({ reportID, deviceID }) {
	const [initialReport, setInitialReport] = useState(null); 	
	const [initialDevice, setInitialDevice] = useState(null); 

  const loadReport = async () => {
    let cached = await getReport(reportID)
    if(cached) return cached; 
    if (!navigator.onLine) {
        return
    }
    requestReport(reportID).then((report) =>{
        let obj = {...report}
        createReport( obj, reportID)
        return report
    }) 

  }

  const loadDevice = async () =>{
    let cached = await getAssembly( deviceID )
    if(cached) return cached; 
    if (!navigator.onLine) {
        return
    }
    requestAssembly(deviceID).then((device) =>{
        let obj = {...device}
        createAssemblyItem( obj, deviceID)
        return device
    }) 
  }

	const getter = async ()=>{

    Promise.all([
      loadReport(),
      loadDevice()
    ]).then(([report, device]) => {
      setInitialReport(report);
      setInitialDevice(device);
    })
  }

	useEffect(()=>{
		getter()
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
          <>Loading...</>
      }
  		
    </div>
  );
}