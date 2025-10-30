'use client'
import Parts from "../forms/Parts"
import FinalSystem from "../forms/FinalSystem"
import FinalDC from "../forms/FinalDC"
import FinalRP from "../forms/FinalRP"
import FinalXVB from "../forms/FinalXVB"
import NumberPad from "./NumberPad"
import { useState, useEffect } from 'react';

export default function Final({report, device, onReportChange}){
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
	        	<FinalDC 
	        		report={fieldValues} 
	        		onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
            		onReportChange = { (updated) => onReportChange(updated) }
	        />);
	      case "RP": 
	      case "RPDA":
	      case "RPDAII":
	      	return ( 
	      			<FinalRP 
	      				report ={fieldValues}
	      				onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
            			onReportChange = { (updated) => onReportChange(updated) }
	      			/> 
	      			)
	      case "PVB":
	      case "SVB":
	      case "AVB":
	      	return ( 
	      			<FinalXVB 
	      				report = {fieldValues}
	      				onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
            			onReportChange = { (updated) => onReportChange(updated) }
	      			/>)
	      case "AG":
	      	return ( <FinalAG
	      				report = {fieldValues} 
	      				onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
            			onReportChange = { (updated) => onReportChange(updated) }
	      			/> )
	      default:
	        return <>No device type</>;
	    }
	  };
	return(
		<div className =" grid grid-cols-10 gap-8 pb-50">
			<div className = "col-span-10">
				<Parts  
					report = {fieldValues} 
					onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
            		onReportChange = { (updated) => onReportChange(updated) }
				/>
			</div>
			<div className = "col-span-5">
				{renderDeviceForm()}
			</div>
			<div className = "col-span-5">
				<NumberPad 
					targetName={targetField}
            		fieldValue={report[targetField] || ""}
            		onInputChange = { handleFieldChange }
				/>
			</div>
			<div className = "col-span-10">
				<FinalSystem  
					report = {fieldValues}
					onTargetChange={(name) => setTargetField(name)} // called on focus of a number pad field
            		onReportChange = { (updated) => onReportChange(updated) }
				/>
			</div>
		</div>
	)
}