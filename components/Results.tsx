'use client';
import { useState, useEffect } from "react";
import { updateReport } from "../actions/report";
import { updateAssembly } from "../actions/assembly";
import Assembly from "./Assembly";
import Initial from "./Initial";
import Final from "./Final";
import { useReport } from "../contexts/ReportContext";
import { ReportProvider } from "../contexts/ReportContext";
import { NumberPadProvider } from "../contexts/NumberPadContext";

export default function Results({ report, device, closeMe }) {
  const { reportData, setReportData } = useReport();
  const [activeTab, setActiveTab] = useState("Assembly");
  const [updatedDevice, setUpdatedDevice] = useState(device);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize context data if empty
  useEffect(() => {
    if (!reportData || Object.keys(reportData).length === 0) {
      setReportData(report);
    }
  }, [report]);

  // Track changes
  useEffect(() => {
    const reportChanged =
      JSON.stringify(reportData) !== JSON.stringify(report);
    const deviceChanged =
      JSON.stringify(updatedDevice) !== JSON.stringify(device);
    setHasChanges(reportChanged || deviceChanged);
  }, [reportData, report, updatedDevice, device]);

  const castBooleans = (obj) => {
    const result = { ...obj };
    Object.keys(result).forEach((key) => {
      if (result[key] === 0 || result[key] === 1) {
        result[key] = Boolean(result[key]);
      }
    });
    return result;
  };

  return (
  
    <div className="flex flex-col h-full">

      {/* Tabs */}
      <div className="flex flex-wrap gap-0 mb-3 pb-1 border-b border-gray-200">
        {["Assembly", "Initial", "Final"].map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`px-3 py-2 text-sm font-medium transition ${
              activeTab === tabName
                ? "bg-slate-300 text-slate-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tabName}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <NumberPadProvider>
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === "Assembly" && (
          <Assembly
            device={device}
            onAssemblyChange={(updated) => setUpdatedDevice(updated)}
          />
        )}
        {activeTab === "Initial" && (
          <Initial
            report={reportData}
            device={updatedDevice}
            onReportChange={(updated) => setReportData(updated)}
          />
        )}
        {activeTab === "Final" && (
          <Final
            report={reportData}
            device={updatedDevice}
            onReportChange={(updated) => setReportData(updated)}
          />
        )}
      </div>
      </NumberPadProvider>

      {/* Sticky Save button */}
      {hasChanges && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t pt-3 pb-4 mt-2">
          <button
            onClick={() => {
              const merged = {
                ...castBooleans(reportData),
              };
              merged.id = report.id;
              merged.assemblyID = updatedDevice.id;

              updateReport(merged).then(() => {
                updateAssembly(updatedDevice).then(() => {
                  closeMe();
                });
              });
            }}
            className="w-full px-4 py-3 text-sm rounded-lg bg-green-800 text-white hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
