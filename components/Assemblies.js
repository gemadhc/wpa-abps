'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

import { requestReport } from "../actions/report";
import { requestAssembly, createAssembly } from "../actions/assembly";
import { setAsReady, setAsNotReady } from "../actions/service";

import { PlusCircle, CheckCircle2, FileText, X } from 'lucide-react';

import Results from "./Results";
import { ReportProvider } from "../contexts/ReportContext";

export default function Assemblies({ list = [], reloadServices, stopID, addressID }) {
  // Dialogs
  const [openReasonDialog, setOpenReasonDialog] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);

  // Selected assembly for editing
  const [selectedAssembly, setSelectedAssembly] = useState(null);

  // Reason dialog values
  const [reason, setReason] = useState("");
  const [unableToLocate, setUnableToLocate] = useState(false);
  const [ranOutOfTime, setRanOutOfTime] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);

  // Report + device for Results dialog
  const [initialReport, setInitialReport] = useState(null);
  const [initialDevice, setInitialDevice] = useState(null);

  // Build reason automatically from checkboxes
  useEffect(() => {
    let r = "";
    if (unableToLocate) r += "Unable to Locate. ";
    if (ranOutOfTime) r += "Ran out of time. ";
    if (removed) r += "Removed. ";
    setReason(r.trim());
  }, [unableToLocate, ranOutOfTime, removed]);

  // --- HANDLERS -------------------------------------------------------------

  const handleRowClick = (assembly) => {
    setSelectedAssembly(assembly);

    Promise.all([
      requestReport(assembly.testReportID),
      requestAssembly(assembly.assemblyID)
    ]).then(([report, device]) => {
      setInitialReport(report);
      setInitialDevice(device);
      setOpenResultsDialog(true);
    });
  };

  const handleToggleReady = (assembly, e) => {
    e.stopPropagation();
    setSelectedAssembly(assembly);

    if (assembly.ready) {
      setOpenReasonDialog(true);
    } else {
      setAsReady(assembly.serviceID).then(() => reloadServices());
    }
  };

  const handleSubmitReason = async () => {
    if (applyToAll) {
      await Promise.all(
        list.map((asm) => setAsNotReady(asm.serviceID, reason))
      );
    } else {
      await setAsNotReady(selectedAssembly.serviceID, reason);
    }

    reloadServices();
    setOpenReasonDialog(false);

    // Reset dialog inputs
    setReason("");
    setUnableToLocate(false);
    setRanOutOfTime(false);
    setRemoved(false);
    setApplyToAll(false);
  };

  const handleAddAssembly = () => {
    createAssembly(addressID, stopID).then(() => reloadServices());
  };

  // --- RENDER ---------------------------------------------------------------

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm p-3">

      {/* TABLE */}
      <table className="min-w-full text-sm text-gray-700">
        <thead>
          <tr className="text-left border-b text-gray-500 uppercase text-xs">
            <th className="py-2 px-2">Assembly</th>
            <th className="py-2 px-2">Service</th>
            <th className="py-2 px-2 text-center">Ready</th>
          </tr>
        </thead>

        <tbody>
          {list.map((assembly, ind) => (
            <React.Fragment key={ind}>
              <tr
                onClick={() => handleRowClick(assembly)}
                className="border-b last:border-none hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="py-2 px-2">
                  <div className="font-medium">
                    {assembly.serial_number || `Assembly ${ind + 1}`}
                  </div>
                  <div className="text-xs text-gray-500">{assembly.location}</div>
                </td>

                <td className="py-2 px-2">
                  {assembly.serviceType || '—'}
                  <br />
                  <span className="text-xs">{assembly.state}</span>
                </td>

                <td
                  className="py-2 px-2 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={assembly.ready ?? true}
                    onChange={(e) => handleToggleReady(assembly, e)}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </td>
              </tr>

              {assembly.reason && (
                <tr>
                  <td colSpan={3} className="p-2 text-xs italic text-black">
                    Reason: {assembly.reason}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* ADD ASSEMBLY BUTTON */}
      <div className="mt-4">
        <button
          onClick={handleAddAssembly}
          className="flex items-center gap-2 px-4 py-2 text-sm border shadow rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          <PlusCircle className="w-4 h-4 text-gray-700" />
          Add Assembly
        </button>
      </div>

      {/* -------------------------------------------------------------------
          REASON DIALOG
      ------------------------------------------------------------------- */}
      <Dialog open={openReasonDialog} onClose={() => setOpenReasonDialog(false)}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full text-black">

            <button
              onClick={() => setOpenReasonDialog(false)}
              className="absolute top-3 right-3 text-gray-800 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <Dialog.Title className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Mark as Not Ready
            </Dialog.Title>

            <div className="mt-3 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={unableToLocate}
                  onChange={(e) => setUnableToLocate(e.target.checked)}
                />
                Unable to locate
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ranOutOfTime}
                  onChange={(e) => setRanOutOfTime(e.target.checked)}
                />
                Ran out of time
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={removed}
                  onChange={(e) => setRemoved(e.target.checked)}
                />
                Removed
              </label>

              <label className="flex items-center gap-2 pt-2 border-t">
                <input
                  type="checkbox"
                  checked={applyToAll}
                  onChange={(e) => setApplyToAll(e.target.checked)}
                />
                Apply to ALL assemblies
              </label>
            </div>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Additional notes..."
              className="w-full mt-4 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmitReason}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit
              </button>
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>

      {/* -------------------------------------------------------------------
          RESULTS DIALOG
      ------------------------------------------------------------------- */}
      <Dialog open={openResultsDialog} onClose={() => setOpenResultsDialog(false)}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-3">
          <Dialog.Panel
            className="relative bg-white rounded-2xl shadow-xl
            w-full max-w-sm sm:max-w-lg md:max-w-2xl
            max-h-[90vh] flex flex-col text-black"
          >
            {/* Close */}
            <button
              onClick={() => setOpenResultsDialog(false)}
              className="absolute top-2 right-2 text-gray-800 hover:text-gray-600 border rounded-full p-1 shadow"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <Dialog.Title className="text-lg font-semibold p-4 pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Assembly Results
            </Dialog.Title>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {initialReport && initialDevice ? (
                <ReportProvider initialReport={initialReport} initialDevice={initialDevice}>
                  <Results
                    closeMe={() => setOpenResultsDialog(false)}
                    reloadServices={reloadServices}
                  />
                </ReportProvider>
              ) : (
                <>Loading…</>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
