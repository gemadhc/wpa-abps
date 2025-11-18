import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type ReportContextType = {
  reportData: Record<string, any>;
  updateField: (fieldName: string, value: any) => void;
  setReportData: (newData: Record<string, any>) => void;
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) throw new Error("useReport must be used within a ReportProvider");
  return context;
};

type ProviderProps = {
  children: ReactNode;
  initialReport?: Record<string, any>;
};

export const ReportProvider = ({ children, initialReport = {} }: ProviderProps) => {
  const [reportData, setReportData] = useState<Record<string, any>>(initialReport);

  const updateField = (fieldName: string, value: any) => {
    setReportData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Optional: log changes for debugging
  useEffect(() => {
    console.log("Report context updated:", reportData);
  }, [reportData]);

  return (
    <ReportContext.Provider value={{ reportData, updateField, setReportData }}>
      {children}
    </ReportContext.Provider>
  );
};
