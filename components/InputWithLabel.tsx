"use client";
import { useState, useEffect } from "react";
import { useNumberPad } from "../contexts/NumberPadContext";
import { useReport } from "../contexts/ReportContext"

export default function InputWithLabel({
  labelName = "RPA1_psid",
  labelGreater = "Tight",
  labelLess = "Leaked",
  breakpoint = 1.0,
  dependents = [],
  initialValues = null,
  noKeyboard = false,
  getTargetName = null,
  onUpdate = (updated) => console.log("updated", updated),
}) {
  // 🔹 NUMBERPAD CONTEXT
  const { targetName, setTarget, fieldValue } = useNumberPad();
  const {formData, updateField} = useReport(); 

  // 🔹 Primary numeric value
  const [val, setVal] = useState('');
  useEffect(()=>{
    if(formData){
      setVal(formData[labelName])
    }
  }, [formData])

  // ---------------------------------------------------------
  // 🔹 CENTRAL logic for setting the number & dependent fields
  // ---------------------------------------------------------
  const applyDependents = (incoming: number | "") => {
    let newVal = incoming === "" ? "" : Number(incoming);
    if (newVal !== "" && isNaN(newVal)) newVal = 0;
    setVal(newVal);
    updateField(labelName, newVal);
    dependents.map( (dep) =>{
      updateField(dep.greaterThan, newVal >= breakpoint)
      updateField(dep.lessThan, newVal < breakpoint )
    })
  };

  // ---------------------------------------------------------
  // 🔹 When NumberPad updates this active field
  // ---------------------------------------------------------
  useEffect(() => {
    if (targetName !== labelName) return;
    const newVal =
      fieldValue === "" || fieldValue === null
        ? ""
        : parseFloat(fieldValue);

    applyDependents(newVal);
  }, [fieldValue, targetName]);

  // ---------------------------------------------------------
  // 🔹 When user manually types (if keyboard allowed)
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const raw = e.target.value.trim();
    const numberVal = raw === "" ? "" : parseFloat(raw);
    applyDependents(numberVal);
  };

  // ---------------------------------------------------------
  // 🔹 Focus → Let NumberPad know what to write to
  // ---------------------------------------------------------
  const handleFocus = () => {
    setTarget(labelName);
    if (getTargetName) getTargetName(labelName);
  };

  // ---------------------------------------------------------
  // 🔹 Inform parent of updates
  // ---------------------------------------------------------
  useEffect(() => {
    onUpdate(formData);
  }, [formData]);

  // ---------------------------------------------------------
  // 🔹 Tight / Leak UI Badge
  // ---------------------------------------------------------
  const tight = val !== "" && Number(val) >= breakpoint;

  const commonClass = tight
    ? "bg-green-200 text-green-900 border border-green-800"
    : "bg-gray-200 text-gray-900 border border-gray-800";

  return (
    <div className="flex flex-row">
      <div className="relative w-full">
        <input
          className="peer w-full border border-gray-300 rounded-md pt-5 pb-1 pl-2 pr-2 text-sm 
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
          id={labelName}
          name={labelName}
          value={val}
          readOnly={true}
          inputMode={noKeyboard ? "none" : "decimal"}
          placeholder=" "
          onFocus={handleFocus}
          onChange={handleChange}
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
        {tight ? labelGreater : labelLess}
      </div>
    </div>
  );
}
