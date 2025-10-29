'use client';
import { useState } from 'react';
import InitialDC from "../forms/InitialDC";
import InitialRP from "../forms/InitialRP";
import InitialXVB from "../forms/InitialXVB";
import InitialAG from "../forms/InitialAG";
import Approved from "../forms/Approved";
import System from "../forms/System";
import Remarks from "../forms/Remarks";
import NumberPad from "./NumberPad";

export default function Initial({ report, device }) {
  // Track the currently focused field
  const [targetField, setTargetField] = useState<string | null>(null);
  // Track values of fields for the number pad
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const handleFieldChange = (name: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  const renderDeviceForm = () => {
    switch (device.type) {
      case "DC":
      case "DCDA":
      case "DCDAII":
        return (
          <InitialDC
            report={report}
            onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
            onFieldChange={handleFieldChange} // called when NumberPad updates
            fieldValues={fieldValues} // pass current values
          />
        );
      case "RP":
      case "RPDA":
      case "RPDAII":
        return <InitialRP report={report} />;
      case "PVB":
      case "SVB":
      case "AVB":
        return <InitialXVB report={report} />;
      case "AG":
        return <InitialAG report={report} />;
      default:
        return <>No device type</>;
    }
  };

  return (
    <div className="grid grid-cols-10 gap-8 pb-50">
      <div className="col-span-10">
        <Approved report={report} />
      </div>

      <div className="col-span-5">{renderDeviceForm()}</div>

      <div className="col-span-5">
        {targetField ? (
          <NumberPad
            targetName={targetField}
            value={fieldValues[targetField] || ""}
            onChange={(val) => handleFieldChange(targetField, val)}
          />
        ) : (
          <> </>
        )}
      </div>

      <div className="col-span-10">
        <System report={report} />
      </div>

      <div className="col-span-10">
        <Remarks report={report} />
      </div>
    </div>
  );
}
