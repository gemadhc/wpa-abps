'use client';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { CheckCircle2, Wrench, FileText } from 'lucide-react';
import Results from "./Results"

export default function Assemblies({ list = [] }) {
  const [openReasonDialog, setOpenReasonDialog] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [selectedAssembly, setSelectedAssembly] = useState(null);
  const [reason, setReason] = useState('');

  const handleToggleReady = (assembly, e) => {
    e.stopPropagation(); // prevent triggering row click
    if (assembly.ready) {
      // Marking false → show reason dialog
      setSelectedAssembly(assembly);
      setOpenReasonDialog(true);
    } else {
      assembly.ready = true;
    }
  };

  const handleRowClick = (assembly) => {
    setSelectedAssembly(assembly);
    setOpenResultsDialog(true);
  };

  const handleSubmitReason = () => {
    console.log('Reason for', selectedAssembly?.name, ':', reason);
    setOpenReasonDialog(false);
    setReason('');
  };

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
            <tr
              key={ind}
              onClick={() => handleRowClick(assembly)}
              className="border-b last:border-none hover:bg-gray-50 cursor-pointer transition"
            >
              <td className="py-2 px-2 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-500" />
                {assembly.name || `Assembly ${ind + 1}`}
              </td>
              <td className="py-2 px-2">{assembly.service || '—'}</td>
              <td
                className="py-2 px-2 text-center"
                onClick={(e) => e.stopPropagation()} // prevent opening dialog
              >
                <input
                  type="checkbox"
                  checked={assembly.ready ?? true}
                  onChange={(e) => handleToggleReady(assembly, e)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reason Dialog */}
      <Dialog
        open={openReasonDialog}
        onClose={() => setOpenReasonDialog(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Mark as Not Ready
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 mt-2">
              Please provide a reason why this assembly is not ready.
            </Dialog.Description>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
              className="w-full border border-gray-300 rounded-lg mt-3 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpenReasonDialog(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
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
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Assembly Results
            </Dialog.Title>

            <div className="mt-4 text-center text-gray-700 font-medium h-150">
              <Results />
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setOpenResultsDialog(false)}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
