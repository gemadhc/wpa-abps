'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import Details from './Details';
import Assemblies from './Assemblies';
import Invoice from './Invoice';
import { requestServices, completeStop} from "../actions/stop";
import { requestBilling, requestInvoice, requestItems } from "../actions/invoice";

import { requestReport } from "../actions/report";
import { requestAssembly, createAssembly } from "../actions/assembly";
import WaterLoader from "../components/WaterLoader"



import { syncStops } from "../lib/sync"
import { getStops, createStop, updateStop} from "../lib/stop_db"
import { getBilling, createItem} from "../lib/billing_db"
import { createItem as createInvoice, getInvoice } from "../lib/invoice_db"
import { createItem as createService, getServices} from "../lib/services_db"
import { createItem as createAssemblyItem, getAssembly as cacheAssembly} from "../lib/assemblies_db"
import { getLineItems, addLineItems, removeLineItem,  createLineItem} from "../lib/lineitem_db"
import {createItem as createReport, getReport as cacheReport, cleanReports} from "../lib/reports_db" 


export default function StopCard({ stopID, item, reloadList}) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('Details');
  const [completed, setCompleted] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [isSpecificTime, setIsSpecificTime] = useState(false);
  const [myBilling, setMyBilling] = useState(null);
  const [myInvoice, setMyInvoice] = useState(null);
  const [myLines, setMyLines] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false) 
  const [loadingItems, setLoadingItems] = useState( false )
  const [completing, setCompleting] = useState(false)

  useEffect(()=>{
  }, [myInvoice])

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  useEffect(() => {
    if (item) {
      if (item.startTime === "08:00" && item.endTime === "16:00") {
        setIsTimed(false);
      } else {
        setIsTimed(true);
        setIsSpecificTime(item.startTime === item.endTime);
      }

      if(item.status.toUpperCase() === "COMPLETED"){
        setCompleted(true)
      }
    }
  }, [item]);

  const tabs = [
    { name: 'Details', content: 
      <Details 
        item={item} 
      /> },
    { name: 'Assemblies', content: 
      <Assemblies 
        list={services}  
        reloadServices = { 
            () => {
              setLoading(true)
              loadServices(); 
              setLoading(false)
            }
          } 
        stopID = {stopID} 
        addressID = {item.addressID}
      /> 
    },
    { name: 'Invoice', content: 
      <Invoice 
        items={myLines} 
        billing={myBilling} 
        invoice={myInvoice} 
        loadingItems = {loadingItems }
        reloadItems = { 
          async () => {
            loadItems(); 
          }
        }
        reload = { 
          async () => {
            setLoading(true)
            await Promise.all( [ loadInvoice() ]) 
            setLoading(false)
          }
        }
        address = { item }
      /> 
    },
  ];

  const handleCompleteStop = () => setOpenConfirmDialog(true);

  const handleConfirmCompletion = () => {
    if (!confirmed) {
      return;
    }
    setCompleting(true)
    
    updateStop(item).then(async (data, err) =>{
      await syncStops()
      await reloadList()
      setCompleted(true);
      setOpenConfirmDialog(false);
      setCompleting(false)
    })    
  };

  const loadBilling = async () =>{
    let cached = await getBilling(item.invoiceID)
    setMyBilling(cached)
    if (!navigator.onLine) {
        return
    }
    //request from network
    requestBilling(item.invoiceID).then( async (dt)=> {
      dt.invoiceID = item.invoiceID; 
      setMyBilling(dt)
      createItem(dt)
    });
    
    return; 
  }

  const loadInvoice = async() => {
    let cached = await getInvoice(item.invoiceID)
    setMyInvoice(cached)
    if (!navigator.onLine) {
        return
    }
    requestInvoice(item.invoiceID).then((data) =>{
        setMyInvoice(data)
        createInvoice( data )
    });
    return; 
  }

  const loadServices = async() => {
    setLoading(true)
    let cached = await getServices(item.stopID)
    setServices(cached?.list || [] )
    if (!navigator.onLine) {
        return
    }
    requestServices(item.stopID).then((data) =>{
      setServices(data); 
      createService(data, item.stopID); 
      setLoading(false)
    });
    return; 
  }


  const loadItems = async() => {
    setLoadingItems(true)
    let cached = await getLineItems(item.invoiceID)
    setMyLines(cached?.list || [])
    if (!navigator.onLine) {
        return
    }

    requestItems(item.invoiceID).then((data) =>{
      setMyLines(data); 
      addLineItems(data, item.invoiceID); 
    });

    setLoadingItems(false)
    return; 

  }


  const loadReport = async(serviceItem) => {
    let cached = await cacheReport(serviceItem.testReportID)
    if (!navigator.onLine) {
        return
    }
    requestReport(serviceItem.testReportID).then((report) =>{
        let obj = {...report}
        createReport( obj, serviceItem.testReportID )
    }) 
  }

  const loadAssemblies = async(serviceItem) => {
    let cached = await cacheAssembly(serviceItem.assemblyID )
    if (!navigator.onLine) {
        return
    }
    requestAssembly(serviceItem.assemblyID).then((assembly) =>{
      let obj = {...assembly}
      createAssemblyItem( obj, serviceItem.assemblyID )
    }) 
  } 

  //-------------------- load reports and assemblies in the background aka cache reports on load 
  useEffect(()=>{
    services.map( (serv) => loadReport(serv) )
    services.map( (serv) => loadAssemblies(serv) )
  }, [services])


  useEffect( () => {
    if (expanded) {
      loadBilling(); 
      loadInvoice(); 
      loadServices(); 
      loadItems(); 
    }

  }, [expanded]);

  const headerBg =
    item.status === 'COMPLETED'
      ? 'bg-green-100 border-green-300'
      : 'bg-gray-50 border-gray-200';

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden no-scrollbar transition-all hover:shadow-lg max-w-xl mx-auto">
      {/* Header */}
      <div className={`flex flex-row sm:flex-row justify-between items-start sm:items-center p-3 ${headerBg} border-b gap-2 `}>
        <div className="flex-1">
          <div className="text-sm text-gray-600 font-medium mb-1">
            {isTimed ? (
              <span className="text-red-500 font-bold">
                {isSpecificTime ? (
                  <>{formatTime(item.startTime)} • </>
                ) : (
                  <>
                    {formatTime(item.startTime)} - {formatTime(item.endTime)} •{' '}
                  </>
                )}
              </span>
            ) : null}
            {item.status} • {item.isRouted ? <> ROUTED </> : <> NOT ROUTED</>}
          </div>
          <div className="text-base font-semibold text-gray-800">
            {item.location_name}
          </div>
          <div className="text-sm text-gray-500">
            {item?.street.toLowerCase() || ''} <br/>
            {item?.city.toLowerCase() || '' }  {item?.state || '' } {item?.zipcode.toLowerCase() || '' }
          </div>
          <div className="text-sm text-gray-600 mt-2 italic">
            {(item.comment || "").length > 90
              ? `${item.comment.slice(0, 90)}…`
            : item.comment}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Scheduled by:{' '}
            <span className="font-medium text-gray-700">{item.tester_name}</span>
          </div>
        </div>

        {/* Header Buttons */}
        <div className="flex gap-2 flex-wrap sm:flex-col sm:items-end">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-800 transition p-2 rounded-lg"
            aria-label="Toggle details"
          >
            {expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          </button>
        </div>
      </div>

      {/* Accordion / Tabs */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-150 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-0 bg-slate-80 border border-gray-300 rounded shadow flex flex-col gap-4 ">
          {/* Tabs */}
          <div className="flex gap-0 mb-3 pb-0 bg-green-100">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-3 py-2 w-full text-sm font-medium transition ${
                  activeTab === tab.name
                    ? 'bg-slate-300 text-sky-700 '
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="text-gray-700 text-sm max-w-full  max-h-80 overflow-scroll no-scrollbar pb-10 px-5">
            {
              loading ? 
                <div className = "pt-15 "> 
                  <p className = "text-slate-500 font-bold text-center "> Loading Stop... </p>
                  <WaterLoader />
                </div>
              : 
                <>
                  {tabs.find((tab) => tab.name === activeTab)?.content}
                </>
            }
             
            
          </div>

          {/* Complete Stop Button */}
           <button
            onClick={handleCompleteStop}
            disabled={completed}
            className={`px-3 py-2 w-full transition  border border-green-500 ${
              completed
                ? 'bg-green-100 text-green-700 border-t-3 border-b-3 cursor-not-allowed'
                : 'bg-green-800 text-white hover:bg-green-900'
            }
            `}
          >
            {completed ? 'Completed'  : 'Complete Stop'}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                Confirm Stop Completion
              </Dialog.Title>
              <button
                onClick={() => setOpenConfirmDialog(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex items-start gap-2 mb-4">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
                className="mt-1 w-4 h-4 accent-blue-600"
              />
              <label className="text-gray-700 text-sm">
                I reviewed the invoice and it reflects the services performed.
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenConfirmDialog(false)}
                className="px-4 py-2 text-sm text-gray-800 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={ handleConfirmCompletion }
                disabled = { !confirmed }
                className="px-4 py-2 text-sm bg-slate-600 text-white hover:bg-slate-700 rounded-lg
                 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {
                  completing ?
                    <> Completing ... </>
                  : 
                    <> Complete Stop </>
                }
                
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
