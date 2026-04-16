'use client';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from '../contexts/FormProvider';
import { ReportProvider, useReport } from "../contexts/ReportContext";
import Assembly from './Assembly';
import Initial from './Initial';
import Final from './Final';
import { NumberPadProvider } from '../contexts/NumberPadContext';
//import { updateReport  } from "../actions/report"
//import { updateAssembly } from "../actions/assembly"



import { updateReport } from "../lib/reports_db"
import { updateAssembly } from "../lib/assemblies_db"
import { syncReports, syncAssemblies } from "../lib/sync"

// ---------------------------------------------------
// Internal Body Component (uses form context only)
// ---------------------------------------------------
function ResultsBody({ closeMe, reloadServices }) {
  const [activeTab, setActiveTab] = useState('Device');
  const [saving, setSaving] = useState(false)
  const {formData} = useReport()
  
  const saveAll = () =>{
    return new Promise(async (resolve, reject) =>{
      setSaving(true)
      await updateReport(formData)
      await updateAssembly(formData)
      await syncReports(); 
      await syncAssemblies(); 

      setSaving(false)
      resolve()
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex flex-row gap-0 mb-3 pb-1 border-b border-gray-200">
        {['Device', 'Initial', 'Repairs'].map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`px-3 py-2 w-full text-lg font-medium transition ${
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
      <div className="flex-1 overflow-y-auto px-10 no-scrollbar">
        {activeTab === 'Device' && <Assembly />}
        {activeTab === 'Initial' && <Initial />}
        {activeTab === 'Repairs' && <Final /> }
      </div>

      {/* Sticky Save Button */}
     
      <div className="flex flex-row sticky bottom-0 left-0 right-0 bg-green-800  shoadow-xl rounded-tl-lg rounded-tr-lg  mt-2 ">
        <button
          disabled = { saving }
          onClick={() =>
            saveAll().then(() => {
              closeMe?.();
              reloadServices()
            })
          }
          className="w-full px-4  pt-5 text-lg bg-green-700 text-white hover:bg-green-500  hover:bg-green-600 disabled:bg-gray-500 pb-5"
        >
          {
            saving? 
              <>Saving...</>
            : 
              <>Save</>
          }
        </button>
        <button
          disabled = { saving }
          onClick={() =>{
              closeMe?.();
            }
          }
          className="w-full px-4  pt-2 text-lg  bg-gray-500 text-white hover:bg-green-500 pb-5 hover:bg-green-600 disabled:bg-gray-500"
        >
          <>Close</>
          
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