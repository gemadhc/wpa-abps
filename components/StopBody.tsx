'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, CheckCircle2 } from 'lucide-react';

import Details from './Details';
import Assemblies from './Assemblies';
import Invoice from './Invoice';
import WaterLoader from './WaterLoader';

import { requestServices } from "../actions/stop";
import { requestBilling, requestInvoice, requestItems } from "../actions/invoice";
import { requestReport } from "../actions/report";
import { requestAssembly } from "../actions/assembly";

import { syncStops } from "../lib/sync";
import { updateStop } from "../lib/stop_db";

import { getBilling, createItem } from "../lib/billing_db";
import { createItem as createInvoice, getInvoice } from "../lib/invoice_db";
import { createItem as createService, getServices } from "../lib/services_db";
import { createItem as createAssemblyItem, getAssembly } from "../lib/assemblies_db";
import { getLineItems, addLineItems } from "../lib/lineitem_db";
import { createItem as createReport, getReport } from "../lib/reports_db";

import Confetti from "react-confetti";

export default function StopBody({ item, stopID, reloadList, navigateToReport}) {
  const [activeTab, setActiveTab] = useState('Assemblies');
  const [completed, setCompleted] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [myBilling, setMyBilling] = useState(null);
  const [myInvoice, setMyInvoice] = useState(null);
  const [myLines, setMyLines] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500); // Stop after ~2.5s
  };

  // ---------------- LOADERS ----------------
  const loadBilling = async () => {
    let cached = await getBilling(item.invoiceID);
    setMyBilling(cached);
    if (cached) return cached;
    if (!navigator.onLine) return;
    let bill = await requestBilling(item.invoiceID)
    bill.invoiceID =  item.invoiceID
    setMyBilling(bill);
    createItem(bill);
    return bill; 
  };

 const loadInvoice = async () => {
  const cached = await getInvoice(item.invoiceID);
  setMyInvoice(cached);

  if (cached) return cached;
  if (!navigator.onLine) return;

  const data = await requestInvoice(item.invoiceID);
  setMyInvoice(data);
  createInvoice(data);

  return data;
};

const loadServices = async () => {
  const cached = await getServices(item.stopID);
  setServices(cached?.list || []);
  if (cached) return cached;
  if (!navigator.onLine) return;
  const data = await requestServices(item.stopID);
  setServices(data);
  createService(data, item.stopID);
  return data;

};

const loadItems = async () => {
  setLoadingItems(true);
  const cached = await getLineItems(item.invoiceID);
  setMyLines(cached?.list || []);
  if (cached) {
    setLoadingItems(false);
    return cached;
  }
  if (!navigator.onLine) {
    setLoadingItems(false);
    return;
  }
  const data = await requestItems(item.invoiceID);
  setMyLines(data);
  addLineItems(data, item.invoiceID);
  setLoadingItems(false);
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

  // ---------------- BACKGROUND CACHE ----------------
  useEffect(() => {
    services.forEach((serv) => {
      loadReport(serv.testReportID); 
      loadDevice(serv.assemblyID);
    });
  }, [services]);

  // ---------------- INIT ----------------
  useEffect(() => {
    async function init() {
      await Promise.all([
        loadBilling(),
        loadInvoice(),
        loadServices(),
        loadItems(),
      ]);
      setLoading(false);
    }

    init();

    if (item?.status?.toUpperCase() == "COMPLETED") {
      setCompleted(true);
    }
  }, []);

  // ---------------- COMPLETE ----------------
  const handleConfirmCompletion = async () => {
    if (!confirmed) return;

    setCompleting(true);

    await updateStop(item);
    await syncStops();
    await reloadList?.();
    triggerConfetti()

    setCompleted(true);
    setOpenConfirmDialog(false);
    setCompleting(false);
  };

  const tabs = [
    { name: 'Details', 

      content: <Details item={item} /> 
    },
    {
      name: 'Assemblies',
      content: (
        <Assemblies
          list={services}
          reloadServices={loadServices}
          stopID={stopID}
          addressID={item?.addressID || null}
          navigateToReport = { navigateToReport }
        />
      ),
    },
    {
      name: 'Invoice',
      content: (
        <Invoice
          items={myLines}
          billing={myBilling}
          invoice={myInvoice}
          loadingItems={loadingItems}
          reloadItems={loadItems}
          reload= { loadInvoice }
          address={item}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="pt-20 text-center bg-white min-h-screen">
        <p className="text-gray-500 font-bold">Loading Stop...</p>
        <WaterLoader />
      </div>
    );
  }

  return (
    <div id ="stop-content" className="h-screen overflow-y-clip flex flex-col w-full mx-auto bg-slate-800 text-slate-100">
      {showConfetti && (
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none">
          <Confetti
            width={window.innerWidth * 0.8}     // narrower spread
            height={window.innerHeight * 0.8}    // slightly shorter area
            recycle={false}
            numberOfPieces={400}
            gravity={0.25}
          />
        </div>
      )}

      {/* ✅ COMPLETED BANNER */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          completed ? "min-h-16 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-green-800 text-green-100 flex items-center justify-center gap-2 py-2 shadow">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">Stop Completed</span>
        </div>
      </div>

      {/* 🔒 STICKY HEADER */}
      <div className="sticky top- z-20 bg-transparent border-b px-4 py-3 flex items-start justify-between">

        {/* ADDRESS */}
        <div>
          <h1 className="text-lg font-bold leading-tight">
            {item.location_name}
          </h1>
          <p className="text-xs text-slate-200 mt-1">
            {item.street}<br />
            {item.city}, {item.state} {item.zipcode}
          </p>
        </div>

        {/* COMPLETE BUTTON */}
        {!completed && (
          <button
            onClick={() => setOpenConfirmDialog(true)}
            className="shrink-0 bg-green-700 text-white px-5 py-7 rounded-lg text-sm shadow active:scale-95 transition"
          >
            Complete
          </button>
        )}
      </div>

      {/* 🔒 STICKY TABS */}
      <div className="sticky top-[72px] z-10 bg-slate-500 text-slate-100 flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1  text-slate-800 py-2 text-sm transition ${
              activeTab === tab.name
                ? "bg-slate-200 font-bold"
                : " bg-white"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 📜 SCROLLABLE CONTENT */}
      <div id ="tab-content"className="flex-1 overflow-y-auto bg-slate-100 p-3 px-10 pb-500">
        {tabs.find((t) => t.name === activeTab)?.content}
      </div>

      {/* CONFIRM DIALOG */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        className="relative z-50">
        
        <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center p-4 text-black">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

            <div className="flex justify-between mb-3">
              <Dialog.Title className="font-semibold">
                Confirm Completion
              </Dialog.Title>
              <button onClick={() => setOpenConfirmDialog(false)}>
                <X className="w-5 h-5 text-slate-800" />
              </button>
            </div>

            <label className="flex items-start gap-2 text-sm mb-4">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
                className="mt-1"
              />
              I confirm the invoice is correct.
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenConfirmDialog(false)}
                className="px-3 py-2 text-sm bg-slate-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmCompletion}
                disabled={!confirmed}
                className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:text-gray-900"
              >
                {completing ? "Completing..." : "Complete"}
              </button>
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>


    </div>
  );
}