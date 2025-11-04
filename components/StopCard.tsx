'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import Details from './Details';
import Assemblies from './Assemblies';
import Invoice from './Invoice';
import { requestServices, completeStop} from "../actions/stop";
import { requestBilling, requestInvoice, requestItems } from "../actions/invoice";

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

  useEffect(()=>{
    console.log(myInvoice)
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
    }
  }, [item]);

  const tabs = [
    { name: 'Details', content: 
      <Details item={item} /> },
    { name: 'Assemblies', content: 
      <Assemblies 
        list={services}  
        reloadServices = { ()=> requestServices(item.stopID).then(setServices) } 
        stopID = {stopID} 
        addressID = {item.addressID}
      /> 
    },
    { name: 'Invoice', content: 
      <Invoice 
        items={myLines} 
        billing={myBilling} 
        invoice={myInvoice} 
        reload = { 
          () => {
            requestInvoice(item.invoiceID).then(setMyInvoice);
            requestItems(item.invoiceID).then(setMyLines)
          }}
        address = { item }
      /> 
    },
  ];

  const handleCompleteStop = () => setOpenConfirmDialog(true);

  const handleConfirmCompletion = () => {
    if (!confirmed) {
     
      return;
    }
    completeStop(item.stopID).then((data, err) =>{
      reloadList()
      setCompleted(true);
      setOpenConfirmDialog(false);
    })
    
  };

  useEffect(() => {
    if (expanded) {
      requestBilling(item.invoiceID).then(setMyBilling);
      requestInvoice(item.invoiceID).then(setMyInvoice);
      requestItems(item.invoiceID).then(setMyLines);
      requestServices(item.stopID).then(setServices);
    }

  }, [expanded]);

  const headerBg =
    item.status === 'COMPLETED'
      ? 'bg-green-100 border-green-300'
      : 'bg-gray-50 border-gray-200';

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg max-w-xl mx-auto">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 ${headerBg} border-b gap-2`}>
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
            {item.status} • ROUTED
          </div>
          <div className="text-base font-semibold text-gray-800">
            {item.location_name}
          </div>
          <div className="text-sm text-gray-500">
            {item.street}, {item.city}, {item.state} {item.zipcode}
          </div>
          <div className="text-sm text-gray-600 mt-2 italic">{item.comment}</div>
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
          expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-4 bg-white flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-3 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.name
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="text-gray-700 text-sm">
             {tabs.find((tab) => tab.name === activeTab)?.content}
          </div>

          {/* Complete Stop Button */}
          <button
            onClick={handleCompleteStop}
            disabled={completed}
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 text-sm rounded-lg transition ${
              completed
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } mt-4`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {completed ? 'Completed' : 'Complete Stop'}
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
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCompletion}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              >
                Complete Stop
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
