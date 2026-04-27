'use client';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from '../contexts/FormProvider';
import { ReportProvider, useReport } from "../contexts/ReportContext";
import Assembly from './Assembly';
import Initial from './Initial';
import Final from './Final';
import { NumberPadProvider } from '../contexts/NumberPadContext';
import { useRouter } from 'next/navigation';

import { ArrowBigLeft, SaveAll } from 'lucide-react';

//import { updateReport  } from "../actions/report"
//import { updateAssembly } from "../actions/assembly"



import { updateReport } from "../lib/reports_db"
import { updateAssembly } from "../lib/assemblies_db"
import { updateServiceAssembly, } from "../lib/services_db"
import { syncReports, syncAssemblies, syncServices } from "../lib/sync"

// ---------------------------------------------------
// Internal Body Component (uses form context only)
// ---------------------------------------------------
function ResultsBody({ closeMe, reloadServices, stopID }) {
  const [activeTab, setActiveTab] = useState('Device');
  const [saving, setSaving] = useState(false)
  const {formData} = useReport()
  const router = useRouter();
  
  const saveAll = () =>{
    return new Promise(async (resolve, reject) =>{
      console.log("These are the params: ", stopID)
      setSaving(true)
      formData.serviceType = formData.state
      await updateReport(formData)
      await updateAssembly(formData)
      await updateServiceAssembly(formData)
      //update service with stopID
      await syncReports(); 
      await syncAssemblies(); 
      setSaving(false)
      resolve()
    })
  }

  return (
    <div className="flex flex-col h-full overflow-y-clip">

       <div className="flex flex-row gap-10 sticky bottom-0 left-0 right-0 bg-white  shoadow-xl rounded-tl-lg rounded-tr-lg mb-5 ">
       <button
          disabled={saving}
          onClick={() => router.back()}
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 disabled:bg-gray-400 transition"
        >
          <ArrowBigLeft className="w-6 h-6" />
        </button>

        <button
          disabled={saving}
          onClick={() =>
            saveAll().then(() => {
              router.back()
            })
          }
          className="w-full flex items-center justify-center px-4 py-2 bg-green-700 text-white rounded-xl 
                     hover:bg-green-600 disabled:bg-gray-400 transition"
        >
          {saving ? (
            <span className="text-base font-medium">Saving...</span>
          ) : (
            <SaveAll className="w-6 h-6" />
          )}
        </button>
      </div>


      {/* Tabs */}
      <div className="flex flex-row gap-0 mb-3 pb-1 border-b border-gray-200">
        {['Device', 'Initial', 'Repairs'].map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`px-3 py-1 w-full text-sm font-bold transition ${
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
      <div className="flex-1 overflow-y-auto px-2 no-scrollbar bg-slate-100">
        {activeTab === 'Device' && <Assembly />}
        {activeTab === 'Initial' && <Initial />}
        {activeTab === 'Repairs' && <Final /> }
      </div>

      {/* Sticky Save Button */}
     
     
    
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
export default function Results({ report, device=null, closeMe, reloadServices, stopID }) {
  return (
    <ResultsWithContexts closeMe={closeMe}  reloadServices = {reloadServices} stopID = {stopID} />
  );
}