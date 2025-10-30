'use client';
import { useState, useEffect } from 'react';
import InitialDC from "../forms/InitialDC";
import InitialRP from "../forms/InitialRP";
import InitialXVB from "../forms/InitialXVB";
import InitialAG from "../forms/InitialAG";
import Approved from "../forms/Approved";
import System from "../forms/System";
import Remarks from "../forms/Remarks";
import NumberPad from "./NumberPad";

export default function Initial({ report, device, onReportChange }) {
  // Track the currently focused field
  const [targetField, setTargetField] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState('')
  const [fieldValues, setFieldValues] = useState(null)

  const handleFieldChange = (name, newval)=>{
    console.log("Event: ", name, newval)
    report[name] = newval; 
    let newFields = {...report}
    setFieldValues(newFields)
  }

  useEffect(()=>{
    if(report){
      setFieldValues(report)
    }
  }, [report])


  const renderDeviceForm = () => {
    switch (device.type) {
      case "DC":
      case "DCDA":
      case "DCDAII":
        return (
          <InitialDC
            report={fieldValues}
            onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
            onReportChange = { (updated) => onReportChange(updated) }
          />
        );
      case "RP":
      case "RPDA":
      case "RPDAII":
        return (
          <InitialRP 
            report={fieldValues}
            onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
            onReportChange = { (updated) => onReportChange(updated) }
          />);

      case "PVB":
      case "SVB":
      case "AVB":
        return( 
        <InitialXVB 
          report={fieldValues}
          onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
          onReportChange = { (updated) => onReportChange(updated) }
         />);
      case "AG":
        return( 
        <InitialAG 
          report={fieldValues}
          onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
          onReportChange = { (updated) => onReportChange(updated) }
        />);
      default:
        return <>No device type</>;
    }
  };

  return (
    <div className="grid grid-cols-10 gap-8 pb-50">
      <div className="col-span-10">
        <Approved  
          report={fieldValues}
          onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
          onReportChange = { (updated) => onReportChange(updated) }
        />
      </div>
      <div className="col-span-5">{renderDeviceForm()}</div>
      <div className="col-span-5">
          <NumberPad
            targetName={targetField}
            fieldValue={report[targetField] || ""}
            onInputChange = { handleFieldChange }
          />
        
      </div>

      <div className="col-span-10">
        <System  
          report={fieldValues}
          onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
          onReportChange = { (updated) => onReportChange(updated) }
        />
      </div>

      <div className="col-span-10">
        <Remarks 
          report={fieldValues}
          onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
          onReportChange = { (updated) => onReportChange(updated) }
        />
      </div>
    </div>
  );
}
