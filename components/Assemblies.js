'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { X, PlusCircle } from 'lucide-react';

import Results from "./Results";
import WaterLoader from "../components/WaterLoader";

import { ReportProvider } from "../contexts/ReportContext";

import { addAssembly } from "../lib/assemblies_db";
import { syncServices, syncAssemblies, syncReports } from "../lib/sync";
import { serviceNotReady } from "../lib/services_db";

export default function Assemblies({
  list = [],
  reloadServices,
  stopID,
  addressID,
  navigateToReport
}) {

  const [openReasonDialog, setOpenReasonDialog] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);

  const [selectedAssembly, setSelectedAssembly] = useState(null);

  const [reason, setReason] = useState('');

  const [initialReport, setInitialReport] = useState(null);
  const [initialDevice, setInitialDevice] = useState(null);

  const [loadAssembly, setLoadAssembly] = useState(false);

  const [isOnline, setIsOnline] = useState(true);

  const [saving, setSaving] = useState(false);

  const [localList, setLocalList] = useState([]);

  const [unableToLocate, setUnableToLocate] = useState(false);
  const [ranOutOfTime, setRanOutOfTime] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);

  const router = useRouter();

  /* =========================
      SYNC PROPS -> LOCAL STATE
  ========================= */

  useEffect(() => {
    setLocalList(list);
  }, [list]);

  /* =========================
      ONLINE STATUS
  ========================= */

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  /* =========================
      INITIAL LOAD
  ========================= */

  useEffect(() => {
    reloadServices();
  }, []);

  /* =========================
      SORTED LIST
  ========================= */

  const sortedList = useMemo(() => {
    return [...localList].sort((a, b) => {
      if (a.state === 'COMPLETED' && b.state !== 'COMPLETED') return 1;
      if (a.state !== 'COMPLETED' && b.state === 'COMPLETED') return -1;
      return 0;
    });
  }, [localList]);

  /* =========================
      NAVIGATION
  ========================= */

  const handleRowClick = (assembly) => {
    console.log("opening report... ",  assembly.testReportID, assembly.assemblyID, stopID)
    navigateToReport(
      assembly.testReportID,
      assembly.assemblyID, 
      stopID
    );
  };

  /* =========================
      READY TOGGLE
  ========================= */

  const handleToggleReady = async (assembly) => {

    if (assembly.ready) {
      setSelectedAssembly(assembly);
      setOpenReasonDialog(true);
    } else {
      /* optimistic update */
      setLocalList(prev =>
        prev.map(item =>
          item.serviceID === assembly.serviceID
            ? {
                ...item,
                ready: true,
                reason: ''
              }
            : item
        )
      );

      await serviceNotReady(
        stopID,
        assembly.serviceID,
        '',
        true
      );

      await syncServices();
      await syncReports();
      await syncAssemblies();

      reloadServices();
    }
  };

  /* =========================
      REASON STRING
  ========================= */

  useEffect(() => {
    let newReason = '';
    if (unableToLocate) newReason += ' Unable To Locate.';
    if (ranOutOfTime) newReason += ' Ran out of time.';
    if (removed) newReason += ' Removed.';

    setReason(newReason.trim());

  }, [unableToLocate, ranOutOfTime, removed]);

  /* =========================
      SUBMIT NOT READY
  ========================= */

  const handleSubmitReason = async () => {

    /* OPTIMISTIC UI UPDATE */

    if (applyToAll) {

      setLocalList(prev =>
        prev.map(item => ({
          ...item,
          ready: false,
          reason
        }))
      );

    } else {

      setLocalList(prev =>
        prev.map(item =>
          item.serviceID === selectedAssembly.serviceID
            ? {
                ...item,
                ready: false,
                reason
              }
            : item
        )
      );
    }

    /* CLOSE DIALOG IMMEDIATELY */

    setOpenReasonDialog(false);

    /* RESET FORM */

    setUnableToLocate(false);
    setRanOutOfTime(false);
    setRemoved(false);
    setApplyToAll(false);

    /* API + SYNC */

    if (applyToAll) {

      await Promise.all(
        localList.map(item =>
          serviceNotReady(
            stopID,
            item.serviceID,
            reason,
            false
          )
        )
      );

    } else {

      await serviceNotReady(
        stopID,
        selectedAssembly.serviceID,
        reason,
        false
      );
    }

    await syncReports();
    await syncAssemblies();
    await syncServices();

    reloadServices();

    setReason('');
  };

  /* =========================
      ADD ASSEMBLY
  ========================= */

  const handleAddAssembly = async () => {

    await addAssembly(addressID, stopID);

    await syncServices();
    await syncAssemblies();

    reloadServices();
  };

  /* =========================
      PASS FAIL
  ========================= */

  function passFailString(pass = false, fail = false) {

    if (pass) return 'Pass';

    if (fail) return 'Fail';

    return '';
  }

  return (
    <div className="space-y-3 p-0 w-full no-scrollbar">

      {/* ASSEMBLY CARDS */}

      {sortedList.map((assembly, ind) => (

        <div
          key={ind}
          onClick={() => handleRowClick(assembly)}
          className={`
            ${
              assembly.state === 'COMPLETED'
                ? 'bg-green-50 border border-green-500'
                : 'bg-white border border-slate-100'
            }
            rounded-xl shadow-sm p-4 transition
          `}
        >

          {/* HEADER */}

          <div className="flex justify-between items-start">

            <div>
              <p className="font-semibold text-gray-900">
                SN# {assembly?.serial_number || `Assembly ${ind + 1}`}
              </p>

              <p className="text-sm text-gray-500">
                {assembly?.location?.toLowerCase() || ''}
              </p>
            </div>

            {/* READY CHECKBOX */}

            <div className="flex flex-col">

              <input
                type="checkbox"
                checked={assembly.ready ?? true}
                onChange={() => handleToggleReady(assembly)}
                onClick={(e) => e.stopPropagation()}
                className="
                  w-6 h-6 rounded-md border-gray-300
                  text-green-600 focus:ring-green-500
                  ml-2 accent-pink-500
                "
              />

              <label className="italic text-slate-800">
                Ready
              </label>

            </div>

          </div>

          {/* SERVICE INFO */}

          <div className="text-sm text-gray-500">

            <p>
              {assembly.serviceType?.toUpperCase() || '—'}
            </p>

            <p>
              {assembly?.state}{' '}
              {
                passFailString(
                  Boolean(assembly?.initialTest_pass),
                  Boolean(assembly?.initialTest_fail)
                )
              }
            </p>

          </div>

          {/* REASON */}

          {assembly.reason && (
            <div className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mt-2">
              {assembly.reason}
            </div>
          )}

        </div>
      ))}

      {/* ADD ASSEMBLY */}

      {
        isOnline && (
          <button
            onClick={handleAddAssembly}
            className="
              w-full flex items-center justify-center gap-2
              p-3 rounded-xl bg-gray-300 text-gray-800
              font-medium active:bg-amber-700
              transition disabled:bg-gray-100
              disabled:cursor-not-allowed
            "
          >
            <PlusCircle className="w-5 h-5" />

            Add Assembly
          </button>
        )
      }

      {/* REASON DIALOG */}

      <Dialog
        open={openReasonDialog}
        onClose={() => setOpenReasonDialog(false)}
        className="relative z-50"
      >

        <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center p-4">

          <Dialog.Panel className="bg-white rounded-2xl px-5 pb-10 w-full max-w-sm text-black">

            <div className="flex flex-row justify-between py-3 mb-5">

              <Dialog.Title className="font-semibold text-lg">
                Mark as Not Ready
              </Dialog.Title>

              <button onClick={() => setOpenReasonDialog(false)}>
                <X className="w-5 h-5 text-slate-800 border rounded" />
              </button>

            </div>

            {/* TEXTAREA */}

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm mb-3"
            />

            {/* CHECKBOXES */}

            <div className="space-y-2 text-sm flex flex-col">

              <label>
                <input
                  type="checkbox"
                  checked={unableToLocate}
                  onChange={(e) =>
                    setUnableToLocate(e.target.checked)
                  }
                />
                {' '}
                Unable to locate
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={ranOutOfTime}
                  onChange={(e) =>
                    setRanOutOfTime(e.target.checked)
                  }
                />
                {' '}
                Ran out of time
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={removed}
                  onChange={(e) =>
                    setRemoved(e.target.checked)
                  }
                />
                {' '}
                Removed
              </label>

            </div>

            {/* APPLY TO ALL */}

            <div className="mt-3 border-t pt-2">

              <label className="text-sm">

                <input
                  type="checkbox"
                  checked={applyToAll}
                  onChange={(e) =>
                    setApplyToAll(e.target.checked)
                  }
                />
                {' '}
                Apply to all

              </label>

            </div>

            {/* SUBMIT */}

            <button
              onClick={handleSubmitReason}
              className="mt-4 w-full bg-slate-600 text-white p-2 rounded-lg disabled:bg-gray-200 disabled:text-gray-500"
              disabled = { reason == '' }
            >
              Submit
            </button>

          </Dialog.Panel>

        </div>

      </Dialog>

      {/* RESULTS DIALOG */}

      <Dialog
        open={openResultsDialog}
        onClose={() => setOpenResultsDialog(false)}
        className="relative z-50"
      >

        <div className="fixed inset-0 flex items-center justify-center p-0">

          <Dialog.Panel className="bg-white w-full h-full flex flex-col text-black">

            {
              loadAssembly ? (

                <div className="pt-15">

                  <p className="text-slate-500 font-bold text-center">
                    Loading Results
                  </p>

                  <WaterLoader />

                </div>

              ) : (

                <div className="flex-1 bg-teal-500 w-full">

                  {
                    initialReport && initialDevice ? (

                      <ReportProvider
                        initialReport={initialReport}
                        initialDevice={initialDevice}
                      >

                        <Results
                          closeMe={() =>
                            setOpenResultsDialog(false)
                          }
                          reloadServices={() => reloadServices()}
                          saving={(bool) => setSaving(bool)}
                          stopID={stopID}
                        />

                      </ReportProvider>

                    ) : (

                      <div className="pt-20 text-center">

                        <p className="text-gray-500 font-bold">
                          Loading Results...
                        </p>

                        <WaterLoader />

                      </div>
                    )
                  }

                </div>
              )
            }

          </Dialog.Panel>

        </div>

      </Dialog>

    </div>
  );
}