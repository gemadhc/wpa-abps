'use client';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';


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
import { createItem as createAssemblyItem, getAssembly as cacheAssembly } from "../lib/assemblies_db";
import { getLineItems, addLineItems } from "../lib/lineitem_db";
import { createItem as createReport, getReport as cacheReport } from "../lib/reports_db";

export default function StopBody({ item, stopID, reloadList }) {
  const [activeTab, setActiveTab] = useState('Details');
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

  // ---------------- INIT LOAD ----------------

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

    if (item?.status?.toUpperCase() === "COMPLETED") {
      setCompleted(true);
    }
  }, []);

  // ---------------- COMPLETE STOP ----------------

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
    {
      name: 'Details',
      content: <Details item={item} />,
    },
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
    <div className="max-w-3xl mx-auto text-black">
      {/* Header */}
      <div className="mb-4 grid grid-cols-10 p-5">
        <div className="col-span-7">
          <h1 className="text-xl font-bold">{item.location_name}</h1>
          <p className="text-sm text-gray-500">
            {item.street} <br/> {item.city}, {item.state}, {item.zipcode}
          </p>
        </div>
         <button
            onClick={() => setOpenConfirmDialog(true)}
            disabled={completed}
            className=" col-span-3 shadow-xl
              bg-green-800 text-white border border-green-500
               py-4 px-4 rounded disabled:bg-white
                disabled:cursor-not-allowed disabled:text-green-700 disbled:font-bold"
          >
            {completed ? <div className="flex flex-col justify-center"> 
                <div>Done</div> 
                <CheckCircle2 />
                </div> : 'Complete Stop'}
          </button>
      </div>

      {/* Tabs */}
      <div className="flex mt-5 mb-3 bg-green-100">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-3 py-2 w-full ${
              activeTab === tab.name
                ? 'bg-pink-100 text-slate-900 border border-pink-500'
                : 'bg-gray-100'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-4 rounded shadow min-h-screen">
        {tabs.find((t) => t.name === activeTab)?.content}
      </div>

      {/* Complete Button */}
     

      {/* Dialog */}
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