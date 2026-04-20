'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useSession } from "../../helpers/session";
import DatePicker from "../../components/DatePicker"
import Bins from "../../components/Bins"
import ListSorted from "./ListSorted"
import WaterLoader from "../../components/WaterLoader"
import { requestDispatch, requestBins } from "../../actions/dispatch"


import { createStop } from "../../lib/stop_db"
import {DateProvider, useDate} from "@/contexts/DateContext"
import { deleteAllStops } from "@/lib/stop_db"
import {monitorMemory } from "@/lib/db"

/*requestors*/
import { requestServices } from "@/actions/stop";
import { requestBilling, requestInvoice, requestItems } from "@/actions/invoice";
import { requestReport } from "@/actions/report";
import { requestAssembly } from "@/actions/assembly";


/*Loaders*/
import { getBilling, createItem, deleteAllBilling } from "@/lib/billing_db";
import { createItem as createInvoice, getInvoice, deleteAllInvoices } from "@/lib/invoice_db";
import { createItem as createService, getServices, getAllServices, deleteAllServices } from "@/lib/services_db";
import { createItem as createAssemblyItem, getAssembly, deleteAllAssemblies } from "@/lib/assemblies_db";
import { getLineItems, addLineItems, deleteAllLineItems } from "@/lib/lineitem_db";
import { createItem as createReport, getReport, deleteAllReports } from "@/lib/reports_db";

export default function Home() {
  const pacificTimeZone = 'America/Los_Angeles'
  const [list, setList] = useState([])
  const [services, setServices] = useState([])
  const [bins, setBins] = useState([])
  const [completed, setCompleted] = useState(0)
  const [loading, setLoading] = useState(false)
  const { date, setDate, resetToToday } = useDate();
  const [servicesLoaded, setServicesLoaded] = useState(false)

  // Initialize with Pacific time date
  const initialPacificDate = toZonedTime(new Date(), pacificTimeZone)
  const [myDate, setMyDate] = useState( date )
  const {session} = useSession()

const loadBilling = async (invoiceID) => {
  const cached = await getBilling(invoiceID);
  if (cached) return cached;

  if (!navigator.onLine) return;

  const dt = await requestBilling(invoiceID);
  dt.invoiceID = invoiceID;
  createItem(dt);

  return dt;
};

const loadInvoice = async (invoiceID) => {
  const cached = await getInvoice(invoiceID);
  if (cached) return cached;

  if (!navigator.onLine) return;

  const data = await requestInvoice(invoiceID);
  createInvoice(data);

  return data;
};

const loadServices = async (stopID) => {
  const cached = await getAllServices(stopID);
  if (cached) return cached;
  if (!navigator.onLine) return;
  const data = await requestServices(stopID);
  createService(data, stopID);
  return data;
};

const loadItems = async (invoiceID) => {
  const cached = await getLineItems(invoiceID);
  if (cached) return cached;
  if (!navigator.onLine) return;
  const data = await requestItems(invoiceID);
  addLineItems(data, invoiceID);
  return data;
};

const loadReport = async (reportID) => {
  const cached = await getReport(reportID);
  if (cached) return cached;
  if (!navigator.onLine) return;
  const report = await requestReport(reportID);
  const obj = { ...report };
  createReport(obj, reportID);
  return report;
};

const loadDevice = async (assemblyID) => {
  const cached = await getAssembly(assemblyID);
  if (cached) return cached;
  if (!navigator.onLine) return;
  const device = await requestAssembly(assemblyID);
  const obj = { ...device };
  createAssemblyItem(obj, assemblyID);
  return device;
};

  const clearAll = async () =>{
    return new Promise(async (resolve, rejec) =>{
      try{
        await deleteAllBilling(); 
        await deleteAllServices(); 
        await deleteAllAssemblies(); 
        await deleteAllInvoices(); 
        await deleteAllLineItems(); 
        await deleteAllReports(); 
        await deleteAllStops(); 
        resolve()
      }catch(err){
        resolve()
      }
    })
  }

  // Function to  stops and bins for a given date
  const handleDateChange = async (isoDate: string) => {
    if(isoDate != myDate){
      console.log("clearing out all the data")
      await clearAll(); 
    }
    const dateToUse = isoDate || myDate
    setDate(dateToUse)
    setMyDate(dateToUse)
    setLoading(true)
    const stopsData = await requestDispatch(dateToUse)
    setList(stopsData)
    const binsData = await requestBins(dateToUse)
    setBins(binsData)
    setLoading(false);
  }

  const loadSecondLayer = async()=>{
    let serv_list = await getAllServices(); 
    serv_list.map((item) =>{
      item.list.map((item2) =>{
        loadDevice(item2.assemblyID); 
        loadReport(item2.testReportID);  
      })
    })
  }


useEffect(() => {
  const run = async () => {
    const promises = list.flatMap((item) => [
      loadBilling(item.invoiceID),
      loadInvoice(item.invoiceID),
      loadItems(item.invoiceID),
      loadServices(item.stopID),
    ]);

    await Promise.all(promises);

    loadSecondLayer();
  };

  if (list?.length) {
    run();
  }
}, [list]);

  useEffect(()=>{
      list.map( (item) => createStop(item) )
      let total_completed = list.reduce(
          (count, item) => count + (item.status === "COMPLETED" ? 1 : 0),
          0
      );
      setCompleted(total_completed);
    }, [list])

  // Load current day's stops on initial render
  useEffect(() => {
    handleDateChange(myDate)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <DateProvider>
        {/* HEADER SECTION */}
        <div className="flex flex-row justify-between py-2 px-10 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 gap-10">
          <DatePicker 
            value={myDate} 
            onSelected={handleDateChange} />

          <div className={`w-15 px-2 pt-2 
            font-semibold text-center ${completed == list.length ? 'text-green-800  border border-green-800': 'text-red-800  border border-red-800'}  
            rounded-lg`}>
            {completed}/{list.length}
          </div>
        </div>

        {/* BINS COMPONENT */}
        <div className="border-b border-gray-200">
          <Bins list={bins} />
        </div>

        {/* LIST SECTION */}
        <div className="flex-1 max-h-200 overflow-y-scroll p-0 space-y-0 bg-white pb-500">
        	{
        		loading ? 
        			<div className = "pt-15"> 
        				<p className = "text-slate-500 font-bold text-center "> Loading Stops </p>
        				<WaterLoader />
        			</div>
        		: 
        		<>
        			{
  		          list.length ?
  		            <ListSorted  
  		              stops={list}
  		              reloadList={() => handleDateChange(myDate)}
  		            />
  		          :
  		            <div className = "p-10 rounded-xl shadow">
  		              <p className = "text-slate-500 font-bold text-center ">No Stops To Show </p>
  		            </div>
  		        }
        		</>
        	}
        </div>
      </DateProvider>
    </div>

  )
}
