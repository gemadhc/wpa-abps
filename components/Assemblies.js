'use client';
import { useState, useEffect, useMemo } from 'react';
import { requestReport } from "../actions/report";
import { useRouter } from 'next/navigation';
import { requestAssembly, createAssembly } from "../actions/assembly";
import { Dialog } from '@headlessui/react';
import { CheckCircle2, FileText, X, PlusCircle } from 'lucide-react';
import Results from "./Results";
import { setAsReady, setAsNotReady } from "../actions/service";
import WaterLoader from "../components/WaterLoader"
import React from 'react';
import { ReportProvider } from "../contexts/ReportContext";

import { getReport, createItem as createReport } from "../lib/reports_db"
import { getAssembly, createItem as createAssemblyItem } from "../lib/assemblies_db"

export default function Assemblies({ list = [], reloadServices, stopID, addressID }) {

  const [openReasonDialog, setOpenReasonDialog] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [selectedAssembly, setSelectedAssembly] = useState(null);
  const [reason, setReason] = useState('');
  const [initialReport, setInitialReport] = useState(null);
  const [initialDevice, setInitialDevice] = useState(null);
  const [loadAssembly, setLoadAssembly] = useState(false);
  const [saving, setSaving] = useState(true)
  const router = useRouter();

  // ✅ SORT LIST: non-COMPLETED first, COMPLETED last
  const sortedList = useMemo(() => {
    return [...list].sort((a, b) => {
      if (a.state === 'COMPLETED' && b.state !== 'COMPLETED') return 1;
      if (a.state !== 'COMPLETED' && b.state === 'COMPLETED') return -1;
      return 0;
    });
  }, [list]);


  const handleRowClick = (assembly) => {
    router.push(`/report/${assembly.testReportID}/${assembly.assemblyID}`);
  };

  const handleToggleReady = (assembly) => {
    if (assembly.ready) {
      setSelectedAssembly(assembly);
      setOpenReasonDialog(true);
    } else {
      setAsReady(assembly.serviceID).then(() => reloadServices());
    }
  };

  const [unableToLocate, setUnableToLocate] = useState(false);
  const [ranOutOfTime, setRanOutOfTime] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);

  const handleSubmitReason = async () => {
    if (applyToAll) {
      await Promise.all(
        list.map(item => setAsNotReady(item.serviceID, reason))
      );
    } else {
      await setAsNotReady(selectedAssembly.serviceID, reason);
    }

    reloadServices();
    setOpenReasonDialog(false);
    setReason('');
    setUnableToLocate(false);
    setRanOutOfTime(false);
    setRemoved(false);
    setApplyToAll(false);
  };

  useEffect(() => {
    let newreason = '';
    if (unableToLocate) newreason += ' Unable To Locate.';
    if (ranOutOfTime) newreason += ' Ran out of time.';
    if (removed) newreason += ' Removed.';
    setReason(newreason);
  }, [unableToLocate, ranOutOfTime, removed]);

  const handleAddAssembly = () => {
    createAssembly(addressID, stopID).then(() => {
      reloadServices();
    });
  };

  return (
    <div className="space-y-3 p-0 no-scrollbar">

      {/* CARDS */}
      {sortedList.map((assembly, ind) => (
        <div
          key={ind}
          onClick={() => handleRowClick(assembly)}
          className={`${assembly.state == 'COMPLETED'
              ? 'bg-green-50 border border-green-500'
              : 'bg-slate-50 border border-slate-100'
            } rounded-xl shadow-sm p-4 transition`}
        >

          {/* HEADER */}
          <div className="flex justify-between items-start ">
            <div>
              <p className="font-semibold text-gray-900 ">
                SN# {assembly.serial_number || `Assembly ${ind + 1}`}
              </p>
              <p className="text-sm text-gray-500">
                {assembly?.location?.toLowerCase() || ''}
              </p>
            </div>

            {/* READY BUTTON */}
            <div className="flex flex-col">
              <input
                type="checkbox"
                checked={assembly.ready ?? true}
                onChange={() => handleToggleReady(assembly)}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 rounded-md border-gray-300 text-green-600 focus:ring-green-500 ml-2"
              />
              <label className="italic"> Ready </label>
            </div>
          </div>

          {/* SERVICE INFO */}
          <div className="text-sm text-gray-500">
            <p>{assembly.serviceType?.toUpperCase() || '—'}</p>
            <p className="text-gray-500">{assembly.state}</p>
          </div>

          {/* REASON */}
          {assembly.reason && (
            <div className="bg-red-50 text-red-700 text-sm p-2 rounded-lg">
              {assembly.reason}
            </div>
          )}

        </div>
      ))}

      {/* ADD BUTTON */}
      <button
        onClick={handleAddAssembly}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-300 text-gray-800 font-medium active:bg-blue-700 transition"
      >
        <PlusCircle className="w-5 h-5" />
        Add Assembly
      </button>

      {/* REASON DIALOG */}
      <Dialog open={openReasonDialog} onClose={() => setOpenReasonDialog(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl p-5 w-full max-w-sm text-black">

            <Dialog.Title className="font-semibold text-lg mb-3">
              Mark as Not Ready
            </Dialog.Title>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm mb-3"
            />

            <div className="space-y-2 text-sm flex flex-col">
              <label><input type="checkbox" checked={unableToLocate} onChange={e => setUnableToLocate(e.target.checked)} /> Unable to locate</label>
              <label><input type="checkbox" checked={ranOutOfTime} onChange={e => setRanOutOfTime(e.target.checked)} /> Ran out of time</label>
              <label><input type="checkbox" checked={removed} onChange={e => setRemoved(e.target.checked)} /> Removed</label>
            </div>

            <div className="mt-3 border-t pt-2">
              <label className="text-sm">
                <input type="checkbox" checked={applyToAll} onChange={e => setApplyToAll(e.target.checked)} /> Apply to all
              </label>
            </div>

            <button
              onClick={handleSubmitReason}
              className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg"
            >
              Submit
            </button>

          </Dialog.Panel>
        </div>
      </Dialog>

      {/* RESULTS DIALOG */}
      <Dialog open={openResultsDialog} onClose={() => setOpenResultsDialog(false)} className="relative z-50 ">
        <div className="fixed inset-0 flex items-center justify-center p-0 ">

          <Dialog.Panel className="bg-white w-full h-full flex flex-col text-black">
            {
              loadAssembly ?
                <div className="pt-15">
                  <p className="text-slate-500 font-bold text-center"> Loading Results </p>
                  <WaterLoader />
                </div>
                :
                <div className="flex-1 overflow-y-auto ">
                  {initialReport && initialDevice ? (
                    <ReportProvider initialReport={initialReport} initialDevice={initialDevice}>
                      <Results
                        closeMe={() => setOpenResultsDialog(false)}
                        reloadServices={() => reloadServices()}
                        saving={(bool) => setSaving(bool)}
                      />
                    </ReportProvider>
                  ) : (
                    <div className="pt-20 text-center">
                      <p className="text-gray-500 font-bold">Loading Results...</p>
                      <WaterLoader />
                    </div>
                  )}
                </div>
            }
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}