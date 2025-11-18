'use client';
import FormLayout from "../layouts/FormLayout";
import InputWithLabel from "../layouts/InputWithLabel";

// Contexts
import { useReport } from "../contexts/ReportContext";
import { useNumberPad } from "../contexts/NumberPadContext";

export default function InitialDC() {
  const { reportData, setReportData } = useReport();
  const { setActiveField } = useNumberPad();

  // Define checkbox fields for Check #1
  const fields_1 = [
    { name: 'RPA_typeII', label: 'Type II', type: "checkbox", full: true },
  ];

  return (
    <div>
      {/* Check #1 Form Layout */}
      <FormLayout
        fields={fields_1}
        title="Check #1"
        hasTitle={true}
        initialValues={reportData}
        onUpdate={(updated) => setReportData(updated)}
      />

      {/* Check #1 PSID with dependent tight/leaked */}
      <InputWithLabel
        labelName="RPA1_psid"
        labelGreater="Tight"
        labelLess="Leaked"
        breakpoint={1.0}
        initialValues={reportData}
        dependents={[
          { greaterThan: "RPA1_tight" },
          { lessThan: "RPA1_leaked" }
        ]}
        noKeyboard={true}
        getTargetName={() => setActiveField("RPA1_psid")}
        onUpdate={(updated) => setReportData(updated)}
      />

      <h3 className="mt-4 mb-2 font-semibold">Check #2</h3>

      {/* Check #2 PSID with correct dependents */}
      <InputWithLabel
        labelName="RPA2_psid"
        labelGreater="Tight"
        labelLess="Leaked"
        breakpoint={1.0}
        initialValues={reportData}
        dependents={[
          { greaterThan: "RPA2_tight" },
          { lessThan: "RPA2_leaked" }
        ]}
        noKeyboard={true}
        getTargetName={() => setActiveField("RPA2_psid")}
        onUpdate={(updated) => setReportData(updated)}
      />
    </div>
  );
}
