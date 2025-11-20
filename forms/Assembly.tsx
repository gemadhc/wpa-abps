'use client';
import FormLayout from "../layouts/FormLayout";
import { useReport } from "../contexts/ReportContext";
import {useEffect} from 'react'

export default function Assembly() {
  const fields = [
    { name: 'serial_number', label: 'Serial Number', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'make', label: 'Make', type: 'text' },
    { name: 'model', label: 'Model', type: 'text' },
    {
      name: 'size',
      label: 'Size',
      type: 'select',
      options: [
        { value: "3/8", label: '3/8"' },
        { value: "1/2", label: '1/2"' },
        { value: "3/4", label: '3/4"' },
        { value: "1", label: '1"' },
        { value: "1 1/4", label: '1 1/4"' },
        { value: "1 1/2", label: '1 1/2"' },
        { value: "2", label: '2"' },
        { value: "2 1/2", label: '2 1/2"' },
        { value: "3", label: '3"' },
        { value: "4", label: '4"' },
        { value: "6", label: '6"' },
        { value: "8", label: '8"' },
        { value: "10", label: '10"' },
        { value: "12", label: '12"' },
      ]
    },
    {
      name: 'state',
      label: 'Status',
      type: 'select',
      options: [
        { value: "EXISTING", label: "Existing" },
        { value: "REMOVED", label: "Removed" },
        { value: "NEW", label: "New" },
        { value: "REPLACED", label: "Replaced" }
      ]
    },
    {
      name: 'type',
      label: "Type",
      type: 'select',
      options: [
        { value: "DC", label: "DC" },
        { value: "DCDA", label: "DCDA" },
        { value: "DCDAII", label: "DCDA-II" },
        { value: "RP", label: "RP" },
        { value: "RPDA", label: "RPDA" },
        { value: "RPDAII", label: "RPDA-II" },
        { value: "PVB", label: "PVB" },
        { value: "SVB", label: "SVB" },
        { value: "AVB", label: "AVB" },
        { value: "AG", label: "AG" }
      ]
    },
    { name: 'hazard_type', label: 'Hazard', type: 'text' },
    { name: 'track_number', label: 'Tracking Number', type: 'text' },
    { name: 'locked_alarm', label: 'Locked Alarm', type: 'checkbox' },
  ];

  // Return FormLayout with device values from context
  return (
    <FormLayout
      fields={fields}
      title="Assembly"
      hasTitle={true}
      totalRows={1}
    />
  );
}
