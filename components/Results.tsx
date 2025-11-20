'use client';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from '../contexts/FormProvider';
import { ReportProvider, useReport } from "../contexts/ReportContext";
import Assembly from './Assembly';
import Initial from './Initial';
import Final from './Final';
import { NumberPadProvider } from '../contexts/NumberPadContext';
import { updateReport,  } from "../actions/report"
import { updateAssembly } from "../actions/assembly"

// ---------------------------------------------------
// Internal Body Component (uses form context only)
// ---------------------------------------------------
function ResultsBody({ closeMe, reloadServices }) {
  const [activeTab, setActiveTab] = useState('Assembly');
  const {formData} = useReport()
  const saveAll = () =>{
    return new Promise(async (resolve, reject) =>{
      console.log("Saving: ", formData)
      await updateReport(formData)
      await updateAssembly(formData)
      resolve()
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex flex-wrap gap-0 mb-3 pb-1 border-b border-gray-200">
        {['Assembly', 'Initial', 'Final'].map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`px-3 py-2 text-sm font-medium transition ${
              activeTab === tabName
                ? 'bg-slate-300 text-slate-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tabName}
          </button>
        ))}
      </div>

      {/* Scrollable tab content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === 'Assembly' && <Assembly />}
        {activeTab === 'Initial' && <Initial />}
        {activeTab === 'Final' && <Final /> }
      </div>

      {/* Sticky Save Button */}
     
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t pt-3 pb-4 mt-2">
        <button
          onClick={() =>
            saveAll().then(() => {
              closeMe?.();
              reloadServices()
            })
          }
          className="w-full px-4 py-3 text-sm rounded-lg bg-green-800 text-white hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    
    </div>
  );
}

// ---------------------------------------------------
// Wrapper that pulls report/device from the context
// ---------------------------------------------------
function ResultsWithContexts({ closeMe, reloadServices}) {
  return (
   
    <NumberPadProvider>
      <ResultsBody closeMe={closeMe} reloadServices = {reloadServices}/>
    </NumberPadProvider>
   
  );
}

// ---------------------------------------------------
// Main Export: Only ReportProvider receives props
// ---------------------------------------------------
export default function Results({ report, device, closeMe, reloadServices }) {
  return (
    <ResultsWithContexts closeMe={closeMe}  reloadServices = {reloadServices} />
  );
}
