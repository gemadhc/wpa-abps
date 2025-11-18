'use client';
import { useEffect } from 'react';
import InitialDC from "../forms/InitialDC";
import InitialRP from "../forms/InitialRP";
import InitialXVB from "../forms/InitialXVB";
import InitialAG from "../forms/InitialAG";
import Approved from "../forms/Approved";
import System from "../forms/System";
import Remarks from "../forms/Remarks";
import NumberPad from "./NumberPad";

// Contexts
import { useReport } from "../contexts/ReportContext";
import { useNumberPad } from "../contexts/NumberPadContext";

export default function Initial({ device }) {
  const { reportData, setReportData } = useReport();
  const { activeField, setActiveField } = useNumberPad();

  const handleFieldChange = (name: string, value: string | number) => {
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const renderDeviceForm = () => {
    switch (device.type) {
      case "DC":
      case "DCDA":
      case "DCDAII":
        return (
          <InitialDC
            report={reportData}
            onTargetChange={(name) => setActiveField(name)}
            onReportChange={setReportData}
          />
        );
      case "RP":
      case "RPDA":
      case "RPDAII":
        return (
          <InitialRP
            report={reportData}
            onTargetChange={(name) => setActiveField(name)}
            onReportChange={setReportData}
          />
        );
      case "PVB":
      case "SVB":
      case "AVB":
        return (
          <InitialXVB
            report={reportData}
            onTargetChange={(name) => setActiveField(name)}
            onReportChange={setReportData}
          />
        );
      case "AG":
        return (
          <InitialAG
            report={reportData}
            onTargetChange={(name) => setActiveField(name)}
            onReportChange={setReportData}
          />
        );
      default:
        return <>No device type</>;
    }
  };

  return (
    <div className="grid grid-cols-10 gap-3 pb-50">
      <div className="col-span-10">
        <Approved
          report={reportData}
          onTargetChange={(name) => setActiveField(name)}
          onReportChange={setReportData}
        />
      </div>

      <div className="col-span-5">{renderDeviceForm()}</div>

      <div className="col-span-5">
        <NumberPad
          targetName={activeField}
          fieldValue={activeField ? reportData[activeField] : ""}
          onInputChange={handleFieldChange}
        />
      </div>

      <div className="col-span-10">
        <System
          report={reportData}
          onTargetChange={(name) => setActiveField(name)}
          onReportChange={setReportData}
        />
      </div>

      <div className="col-span-10">
        <Remarks
          report={reportData}
          onTargetChange={(name) => setActiveField(name)}
          onReportChange={setReportData}
        />
      </div>
    </div>
  );
}
