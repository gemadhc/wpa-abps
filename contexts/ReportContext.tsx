'use client';
import { createContext, useContext, useState, useEffect } from "react";

export type ReportContextType = {
  formData: Record<string, any>;
  updateField: (name: string, value: any) => void;
  loadReport: (report: any, device: any) => void;
};

export const ReportContext = createContext<ReportContextType | null>(null);

export function useReport() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReport must be inside ReportProvider");
  return ctx;
}

export function ReportProvider({ initialReport, initialDevice, children}: { children: React.ReactNode }) {
  useEffect(()=>{
    initialReport.reportID = initialReport.id;
    initialDevice.assemblyID = initialDevice.id; 
    console.log("Set these values: ", initialDevice.assemblyID, initialReport.reportID)
    loadReport(initialReport, initialDevice)
  }, [])

  const [formData, setFormData] = useState<Record<string, any>>({});

  const loadReport = (report: any, device: any) => {
    setFormData({
      ...report,
      ...device,
    });
  };

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ReportContext.Provider value={{ formData, updateField, loadReport }}>
      {children}
    </ReportContext.Provider>
  );
}
