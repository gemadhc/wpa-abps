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
import { createItem as createAssemblyItem } from "../lib/assemblies_db";
import { getLineItems, addLineItems } from "../lib/lineitem_db";
import { createItem as createReport } from "../lib/reports_db";

export default function StopBody({ item, stopID, reloadList }) {
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

  // ---------------- LOADERS ----------------
  const loadBilling = async () => {
    let cached = await getBilling(item.invoiceID);
    setMyBilling(cached);

    requestBilling(item.invoiceID).then((dt) => {
      dt.invoiceID = item.invoiceID;
      setMyBilling(dt);
      createItem(dt);
    });
  };

  const loadInvoice = async () => {
    let cached = await getInvoice(item.invoiceID);
    setMyInvoice(cached);

    requestInvoice(item.invoiceID).then((data) => {
      setMyInvoice(data);
      createInvoice(data);
    });
  };

  const loadServices = async () => {
    let cached = await getServices(item.stopID);
    setServices(cached?.list || []);

    requestServices(item.stopID).then((data) => {
      setServices(data);
      createService(data, item.stopID);
    });
  };

  const loadItems = async () => {
    setLoadingItems(true);

    let cached = await getLineItems(item.invoiceID);
    setMyLines(cached?.list || []);

    requestItems(item.invoiceID).then((data) => {
      setMyLines(data);
      addLineItems(data, item.invoiceID);
    });

    setLoadingItems(false);
  };

  // ---------------- BACKGROUND CACHE ----------------
  useEffect(() => {
    services.forEach((serv) => {
      requestReport(serv.testReportID).then((report) => {
        createReport({ ...report }, serv.testReportID);
      });

      requestAssembly(serv.assemblyID).then((assembly) => {
        createAssemblyItem({ ...assembly }, serv.assemblyID);
      });
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

    setCompleted(true);
    setOpenConfirmDialog(false);
    setCompleting(false);
  };

  const tabs = [
    { name: 'Details', content: <Details item={item} /> },
    {
      name: 'Assemblies',
      content: (
        <Assemblies
          list={services}
          reloadServices={loadServices}
          stopID={stopID}
          addressID={item?.addressID || null}
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
          address={item}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="pt-20 text-center">
        <p className="text-gray-500 font-bold">Loading Stop...</p>
        <WaterLoader />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col max-w-3xl mx-auto bg-slate-50 text-black">

      {/* ✅ COMPLETED BANNER */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          completed ? "min-h-16 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-green-700 text-white flex items-center justify-center gap-2 py-2 shadow">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">Stop Completed</span>
        </div>
      </div>

      {/* 🔒 STICKY HEADER */}
      <div className="sticky top- z-20 bg-white border-b px-4 py-3 flex items-start justify-between">

        {/* ADDRESS */}
        <div>
          <h1 className="text-lg font-bold leading-tight">
            {item.location_name}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {item.street}<br />
            {item.city}, {item.state} {item.zipcode}
          </p>
        </div>

        {/* COMPLETE BUTTON */}
        {!completed && (
          <button
            onClick={() => setOpenConfirmDialog(true)}
            className="shrink-0 bg-green-700 text-white px-3 py-2 rounded-lg text-sm shadow active:scale-95 transition"
          >
            Complete
          </button>
        )}
      </div>

      {/* 🔒 STICKY TABS */}
      <div className="sticky top-[72px] z-10 bg-slate-100 flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 py-2 text-sm transition ${
              activeTab === tab.name
                ? "bg-white font-semibold border-b-2 border-green-600"
                : "text-gray-600"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 📜 SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto bg-white p-3 pb-500">
        {tabs.find((t) => t.name === activeTab)?.content}
      </div>

      {/* CONFIRM DIALOG */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

            <div className="flex justify-between mb-3">
              <Dialog.Title className="font-semibold">
                Confirm Completion
              </Dialog.Title>
              <button onClick={() => setOpenConfirmDialog(false)}>
                <X className="w-5 h-5 text-gray-500" />
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
                className="px-3 py-2 text-sm bg-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmCompletion}
                disabled={!confirmed}
                className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg disabled:bg-gray-300"
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