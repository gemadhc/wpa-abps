'use client'
import Parts from "../forms/Parts"
import FinalSystem from "../forms/FinalSystem"
import FinalDC from "../forms/FinalDC"
import FinalRP from "../forms/FinalRP"
import FinalXVB from "../forms/FinalXVB"
import FinalAG from "../forms/FinalAG"
import NumberPad from "./NumberPad"
import { useState, useEffect } from 'react';
import { ReportProvider, useReport } from "../contexts/ReportContext";

export default function Final(){
	const {formData} = useReport()
    // Render appropriate device form (device type exists in merged formData)
 	const deviceType = formData?.type;

	const renderDeviceForm = () => {
	    switch (deviceType) {
	      case "DC":
	      case "DCDA":
	      case "DCDAII":
	        return (
	        	<FinalDC />);
	      case "RP": 
	      case "RPDA":
	      case "RPDAII":
	      	return ( 
	      			<FinalRP /> 
	      			)
	      case "PVB":
	      case "SVB":
	      case "AVB":
	      	return ( 
	      			<FinalXVB />)
	      case "AG":
	      	return ( <FinalAG /> )
	      default:
	        return <>No device type</>;
	    }
	  };
	return(
		<div className =" grid grid-cols-10 gap-8 pb-50">
			{
				deviceType == "AG" ? 
					<div className = "h-200 col-span-10 p-5"><i> Nothing to show here</i> </div>
				: 
				<>
					<div className = "col-span-10">
						<Parts  />
					</div>
					<div className = "col-span-5">
						{renderDeviceForm()}
					</div>
					<div className = "col-span-5">
						<NumberPad />
					</div>
					<div className = "col-span-10">
						<FinalSystem  />
					</div>
				</>
			}
			
		</div>
	)
}