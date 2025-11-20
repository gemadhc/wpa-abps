// components/Initial.jsx
'use client';
import { useEffect } from 'react';
import InitialDC from '../forms/InitialDC';
import InitialRP from '../forms/InitialRP';
import InitialXVB from '../forms/InitialXVB';
import InitialAG from '../forms/InitialAG';
import Approved from '../forms/Approved';
import System from '../forms/System';
import Remarks from '../forms/Remarks';
import NumberPad from './NumberPad';
import { useNumberPad } from '../contexts/NumberPadContext';
import { useReport } from "../contexts/ReportContext"; 

export default function Initial() {
  const {formData} = useReport()
  // Render appropriate device form (device type exists in merged formData)
  const deviceType = formData?.type;

  const renderDeviceForm = () => {
    switch (deviceType) {
      case 'DC':
      case 'DCDA':
      case 'DCDAII':
        return (
          <InitialDC />
        );
      case 'RP':
      case 'RPDA':
      case 'RPDAII':
        return <InitialRP  />;
      case 'PVB':
      case 'SVB':
      case 'AVB':
        return <InitialXVB />;
      case 'AG':
        return <InitialAG />;
      default:
        return <>No device type</>;
    }
  };

  return (
    <div className="grid grid-cols-10 gap-8 pb-50">
      <div className="col-span-10">
        <Approved />
      </div>

      <div className="col-span-5">{renderDeviceForm()}</div>

      <div className="col-span-5">
        {/* The NumberPad component uses NumberPadContext; it will be visible and always-connected */}
        <NumberPad />
      </div>

      <div className="col-span-10">
        <System  />
      </div>

      <div className="col-span-10">
        <Remarks />
      </div>
    </div>
  );
}
