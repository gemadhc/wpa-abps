'use client';
import FormLayout from "../layouts/FormLayout";
import { useState, useEffect } from "react";

export default function InitialDC({ report, onTargetChange, onReportChange}) {
  // Define fields, linking number pad fields
  const fields_1 = [
    { name: 'RPA_typeII', label: 'Type II', type: "checkbox", full: true },
    { name: 'RPA1_tight', label: 'Tight', type: "checkbox" },
    { name: 'RPA1_leaked', label: 'Leaked', type: "checkbox" },
    { 
      name: 'RPA1_psid', 
      label: 'PSID', 
      type: "text", 
      noKeyboard: true, 
      getTargetName: (name: string) => onTargetChange && onTargetChange(name)
    }
  ];

  const fields_2 = [
    { name: 'RPA2_tight', label: 'Tight', type: "checkbox" },
    { name: 'RPA2_leaked', label: 'Leaked', type: "checkbox" },
    { 
      name: 'RPA2_psid', 
      label: 'PSID', 
      type: "text", 
      noKeyboard: true, 
      getTargetName: (name: string) => onTargetChange && onTargetChange(name)
    }
  ];

  return (
    <div>
      <FormLayout
        fields={fields_1}
        title="Check #1"
        hasTitle={true}
        initialValues={report}
        onUpdate = {(updated)=>onReportChange(updated)}
      />
      <br />
      <FormLayout
        fields={fields_2}
        title="Check #2"
        hasTitle={true}
        initialValues={report}
      />
    </div>
  );
}
