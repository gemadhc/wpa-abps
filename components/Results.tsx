import { useState, useEffect } from "react";
import { updateReport } from "../actions/report";
import { updateAssembly } from "../actions/assembly";
import Assembly from "./Assembly";
import Initial from "./Initial";
import Final from "./Final";

export default function Results({ report, device, closeMe }) {
  const [activeTab, setActiveTab] = useState("Assembly");
  const [updates, setUpdates] = useState(report);
  const [updatedDevice, setUpdatedDevice] = useState(device);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes in report or assembly
  useEffect(() => {
    const reportChanged = JSON.stringify(updates) !== JSON.stringify(report);
    const deviceChanged = JSON.stringify(updatedDevice) !== JSON.stringify(device);
    setHasChanges(reportChanged || deviceChanged);
  }, [updates, report, updatedDevice, device]);

  useEffect(() => {
    console.log("Updated Device: ", updatedDevice);
  }, [updatedDevice]);

  // Helper: cast numeric 0/1 to boolean
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
    <div>
      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-0 mb-3 pb-1 border-b border-gray-200 ">
        {["Assembly", "Initial", "Final"].map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`px-3 py-2  text-sm font-medium transition ${
              activeTab === tabName
                ? "bg-slate-300 text-slate-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tabName}
          </button>
        ))}
      </div>

      {/* Keep all tabs mounted, hide inactive ones */}
      <div className="text-gray-700 text-sm max-h-150 overflow-y-scroll p-0 relative">
        <div className={activeTab === "Assembly" ? "block" : "hidden"}>
          <Assembly
            device={device}
            onAssemblyChange={(updated) => setUpdatedDevice(updated)}
          />
        </div>
        <div className={activeTab === "Initial" ? "block" : "hidden"}>
          <Initial
            report={report}
            device={updatedDevice}
            onReportChange={(updated) => setUpdates(updated)}
          />
        </div>
        <div className={activeTab === "Final" ? "block" : "hidden"}>
          <Final
            report={report}
            device={updatedDevice}
            onReportChange={(updated) => setUpdates(updated)}
          />
        </div>
      </div>

      {/* Show Save button only if changes exist */}
      {hasChanges && (
        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              const merged = {
                ...castBooleans(updates),
              };
              console.log("This is the id: ", report, updatedDevice)
              merged.id = report.id;
              merged.assemblyID = updatedDevice.id; 
              updateReport(merged).then(() => {
                updateAssembly(updatedDevice).then(() => {
                  closeMe();
                });
              });
            }}
            className="px-4 py-2 text-sm rounded-lg bg-green-800 text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
