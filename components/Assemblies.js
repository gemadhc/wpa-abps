'use client';
<<<<<<< Updated upstream
import { useState, useEffect } from 'react';
=======
import { useState, useEffect} from 'react';
>>>>>>> Stashed changes
import { requestReport } from "../actions/report";
import { requestAssembly, createAssembly} from "../actions/assembly";
import { Dialog } from '@headlessui/react';
import { CheckCircle2, FileText, X, PlusCircle } from 'lucide-react';
import Results from "./Results";
import { setAsReady, setAsNotReady } from "../actions/service";
import React from 'react'
import { ReportProvider } from "../contexts/ReportContext";

export default function Assemblies({ list = [], reloadServices, stopID, addressID}) {
  const [openReasonDialog, setOpenReasonDialog] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [selectedAssembly, setSelectedAssembly] = useState(null);
  const [reason, setReason] = useState('');
  const [report, setReport] = useState(null);
  const [device, setDevice] = useState(null);

<<<<<<< Updated upstream
  const handleToggleReady = (assembly, e) => {
    e.stopPropagation();
    if (assembly.ready) {
      setSelectedAssembly(assembly);
      setOpenReasonDialog(true);
    } else {
      setAsReady(assembly.serviceID).then(() => {
        reloadServices();
      });
    }
  };

  const handleRowClick = (assembly) => {
    setSelectedAssembly(assembly);
    console.log("assembly details: ", assembly)
    requestReport(assembly.testReportID).then((data1) => {
      requestAssembly(assembly.assemblyID).then((data2) => {
        console.log(`Data1 ${JSON.stringify(data1) } data2 ${ JSON.stringify(data2) }`)
        setReport(data1);
        setDevice(data2);
        setOpenResultsDialog(true);
      });
    });
  };

  const handleSubmitReason = () => {
=======
const [unableToLocate, setUnableToLocate] = useState(false)
const [ranOutOfTime, setRanOutOfTime] = useState(false)
const [removed, setRemoved] = useState(false)
const [applyToAll, setApplyToAll] = useState(false)


useEffect(()=>{
  let newreason = ''
  if(unableToLocate){
    newreason = `${newreason} Unable To Locate.` 
  }

  if(ranOutOfTime){
    newreason = `${newreason} Ran out of time.` 
  }

  if(removed){
    newreason = `${newreason} Removed.` 
  }
  setReason(newreason)

}, [unableToLocate, ranOutOfTime, removed])

const handleRowClick = (assembly) => {
setSelectedAssembly(assembly);
Promise.all([
requestReport(assembly.testReportID),
requestAssembly(assembly.assemblyID),
  ]).then(([report, device]) => {
    setInitialReport(report);
    setInitialDevice(device);
    setOpenResultsDialog(true);
});
};

const handleToggleReady = (assembly, e) => {
e.stopPropagation();
if (assembly.ready) {
setSelectedAssembly(assembly);
setOpenReasonDialog(true);
} else {
  setAsReady(assembly.serviceID).then(() => reloadServices());
}
};

const handleSubmitReason = async () => {
  if(applyToAll){
    let arr = []
    for(let i = 0; i < list.length; i++){
      arr.push( await setAsNotReady(list[i].serviceID, reason) )
    }
    Promise.all(arr).then((data, err) =>{
      reloadServices();
      setOpenReasonDialog(false);
      setReason('');
      setUnableToLocate(false)
      setRanOutOfTime(false)
      setRemoved(false)
      setApplyToAll(false)
    })
  }else{
>>>>>>> Stashed changes
    setAsNotReady(selectedAssembly.serviceID, reason).then(() => {
      reloadServices();
      setOpenReasonDialog(false);
      setReason('');
<<<<<<< Updated upstream
    });
  };

  // 🧩 Placeholder for adding new assembly
  const handleAddAssembly = (assembly) => {
    console.log("Add Assembly button clicked", addressID, stopID);
    createAssembly(addressID, stopID).then((data, err) =>{
      reloadServices()
    })
  };
=======
      setUnableToLocate(false)
      setRanOutOfTime(false)
      setRemoved(false)
      setApplyToAll(false)
    });
  }
};

const handleAddAssembly = () => {
  createAssembly(addressID, stopID).then(() => {
    reloadServices();
  });
};
>>>>>>> Stashed changes

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm p-3">
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
                <td className="py-2 px-2 flex items-center gap-2">
                  {assembly.serial_number || `Assembly ${ind + 1}`} <br />
                  {assembly.location}
                </td>
                <td className="py-2 px-2">
                  {assembly.serviceType || '—'} <br />
                  {assembly.state}
                </td>
                <td
                  className="py-2 px-2 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={assembly.ready ?? true}
                    onChange={(e) => handleToggleReady(assembly, e)}
                    className="w-5 h-5 accent-blue-600 cursor-pointer text-black"
                  />
                </td>
              </tr>
              {assembly.reason && (
                <tr>
                  <td colSpan={3} className="text-sm text-black px-4 py-1 italic">
                    Reason: {assembly.reason}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* ➕ Add Assembly Button */}
      <div className="flex justify-start mt-4">
        <button
          onClick={  handleAddAssembly}
          className="flex items-center gap-2 px-4 py-2 text-sm  border  shadow
            rounded-lg bg-gray-200 text-white hover:bg-gray-500 transition "
        >
          <PlusCircle className="w-4 h-4 text-slate-500" />
          
        </button>
      </div>

<<<<<<< Updated upstream
      {/* Reason Dialog */}
      <Dialog
        open={openReasonDialog}
        onClose={() => setOpenReasonDialog(false)}
        className="relative z-50"
=======
        <Dialog.Title className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          Mark as Not Ready
        </Dialog.Title>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason..."
          className="w-full border border-gray-300 rounded-lg mt-3 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
          rows={3}
        />
        <div>
          <input  
            checked = {unableToLocate}
            onChange = {(e) => setUnableToLocate(e.target.checked) }
            type= "checkbox"/>
          <label> Unable to locate </label>
        </div>
        <div>
          <input  
            checked = {ranOutOfTime}
            onChange = {(e) => setRanOutOfTime(e.target.checked) }
            type= "checkbox"/>
          <label> Ran out of time </label>
        </div>
        <div>
          <input  
            checked = {removed}
            onChange = { (e) => setRemoved(e.target.checked) }
            type= "checkbox"
          />
          <label> Removed </label>
        </div>

        <div>
          <input  
            type= "checkbox"
            checked = {applyToAll}
            onChange = { (e) => setApplyToAll(e.target.checked) }
          />
          <label> Apply to all</label>
        </div>


        <div className="flex justify-end gap-3 mt-4">
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

  {/* Results Dialog */}
  <Dialog
    open={openResultsDialog}
    onClose={() => setOpenResultsDialog(false)}
    className="relative z-50"
  >
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
      <Dialog.Panel
        className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl
          w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col text-black"
>>>>>>> Stashed changes
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <button
              onClick={() => setOpenReasonDialog(false)}
              className="absolute top-3 right-3 text-gray-800 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

<<<<<<< Updated upstream
            <Dialog.Title className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Mark as Not Ready
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 mt-2">
              Please provide a reason why this assembly is not ready.
            </Dialog.Description>
=======
        <Dialog.Title className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 p-4 pb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Test Report Results
        </Dialog.Title>
>>>>>>> Stashed changes

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
              className="w-full border border-gray-300 rounded-lg mt-3 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              rows={3}
            />

            <div className="flex justify-end gap-3 mt-4">
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

      {/* Results Dialog */}
    <Dialog
  open={openResultsDialog}
  onClose={() => setOpenResultsDialog(false)}
  className="relative z-50"
>
  {/* Overlay */}
  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

  {/* Center wrapper */}
  <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
    <Dialog.Panel
      className="
        relative bg-white
        rounded-xl sm:rounded-2xl 
        shadow-xl 
        w-full 
        max-w-sm sm:max-w-lg md:max-w-2xl 
        max-h-[90vh] 
        flex flex-col text-black
      "
    >
      {/* Close button */}
      <button
        onClick={() => setOpenResultsDialog(false)}
        className="absolute top-2 right-2 text-gray-900 hover:text-gray-900 shadow border rounded-2xl p-1"
      >
        <X className="w-6 h-6" />
      </button>

      <Dialog.Title className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 p-4 pb-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Assembly Results
      </Dialog.Title>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {report && device ? (
          <ReportProvider>
            <Results
              report={report}
              device={device}
              closeMe={() => setOpenResultsDialog(false)}
            />
          </ReportProvider>
        ) : (
          <>Loading Values ...</>
        )}
      </div>
    </Dialog.Panel>
  </div>
</Dialog>

    </div>
  );
}
