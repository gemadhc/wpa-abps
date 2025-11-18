'use client';
import { useState, useEffect } from "react";
import { useReport } from "../contexts/ReportContext";
import { useNumberPad } from "../contexts/NumberPadContext";

export default function InputWithLabel({
  labelName = "RPA1_psid",
  labelGreater = "Tight",
  labelLess = "Leaked",
  breakpoint = 1.0,
  dependents = [
    { greaterThan: "RPA1_tight" },
    { lessThan: "RPA1_leaked" }
  ],
  initialValues = null,
  noKeyboard = false,
  getTargetName = null,
}) {
  const { reportData, setReportData } = useReport();
  const { activeField, setActiveField } = useNumberPad();

  // Normalize initial values
  const safeInitial = initialValues && typeof initialValues === "object"
    ? initialValues
    : reportData || {};

  const [val, setVal] = useState(() =>
    safeInitial[labelName] !== undefined
      ? parseFloat(safeInitial[labelName])
      : 0
  );

  // -----------------------------------------
  // Update dependents in reportData
  // -----------------------------------------
  const updateDependents = (newVal: number, base: any = {}) => {
    const updated = { ...reportData, [labelName]: newVal };

    dependents.forEach((dep) => {
      if (dep.greaterThan) updated[dep.greaterThan] = Number(newVal) >= breakpoint;
      if (dep.lessThan) updated[dep.lessThan] = Number(newVal) < breakpoint;
    });

    setReportData(updated);
    setVal(newVal);
  };

  // -----------------------------------------
  // Sync external changes
  // -----------------------------------------
  useEffect(() => {
    if (reportData && reportData[labelName] !== undefined) {
      const newVal = parseFloat(reportData[labelName]);
      setVal(newVal);
    }
  }, [reportData, labelName]);

  // -----------------------------------------
  // Handle number pad focus
  // -----------------------------------------
  const handleFocus = () => {
    if (noKeyboard) {
      setActiveField(labelName);
      if (getTargetName) getTargetName(labelName);
    }
  };

  const commonClass =
    val >= breakpoint
      ? "bg-green-200 text-green-900 border border-green-800"
      : "bg-gray-200 text-gray-900 border border-gray-800";

  return (
    <div className="flex flex-row">
      <div className="relative w-full">
        <input
          className="peer w-full border border-gray-300 rounded-md pt-5 pb-1 pl-2 pr-2 text-sm 
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
          name={labelName}
          value={val || ''}
          readOnly={noKeyboard}
          inputMode={noKeyboard ? "none" : "decimal"}
          placeholder=" "
          onFocus={handleFocus}
          onChange={(e) => {
            const newVal = parseFloat(e.target.value) || 0;
            updateDependents(newVal);
          }}
        />
        <label
          htmlFor={labelName}
          className="absolute left-2 top-1 text-gray-500 text-xs transition-all
            peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-800 
            peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs 
            peer-focus:text-blue-600"
        >
          PSID
        </label>
      </div>

      <div
        className={`w-20 flex items-center text-xs justify-center p-2 rounded-tr-lg rounded-br-lg ${commonClass}`}
      >
        {val >= breakpoint ? labelGreater : labelLess}
      </div>
    </div>
  );
}
