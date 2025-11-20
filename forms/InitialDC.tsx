'use client';
import { useReport } from "../contexts/ReportContext";
import InputWithLabel from "../components/InputWithLabel";

export default function InitialDC() {

  return (
    <div>
      <h3>Check #1</h3>
      <InputWithLabel
        labelName="RPA1_psid"
        labelGreater="Tight"
        labelLess="Leaked"
        breakpoint={1.0}
        dependents={[{ greaterThan: "RPA1_tight", lessThan: "RPA1_leaked" }]}
      />

      <h3>Check #2</h3>
      <InputWithLabel
        labelName="RPA2_psid"
        labelGreater="Tight"
        labelLess="Leaked"
        breakpoint={1.0}
        dependents={[{ greaterThan: "RPA2_tight", lessThan: "RPA2_leaked" }]}
      />
    </div>
  );
}
