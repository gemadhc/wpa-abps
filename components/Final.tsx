import Parts from "../forms/Parts"
import FinalSystem from "../forms/FinalSystem"
import FinalDC from "../forms/FinalDC"
import FinalRP from "../forms/FinalRP"
import FinalXVB from "../forms/FinalXVB"
import NumberPad from "./NumberPad"

export default function Final({report, device}){
	const renderDeviceForm = () => {
	    switch (device.type) {
	      case "DC":
	      case "DCDA":
	      case "DCDAII":
	        return <FinalDC report={report} />;
	      case "RP": 
	      case "RPDA":
	      case "RPDAII":
	      	return <FinalRP report ={report} />
	      case "PVB":
	      case "SVB":
	      case "AVB":
	      	return <FinalXVB report = {report} />
	      case "AG":
	      	return <FinalAG report = {report} />
	      default:
	        return <>No device type</>;
	    }
	  };
	return(
		<div className =" grid grid-cols-10 gap-8 pb-50">
			<div className = "col-span-10">
				<Parts  report = {report} />
			</div>
			<div className = "col-span-5">
				{renderDeviceForm()}
			</div>
			<div className = "col-span-5">
				<NumberPad />
			</div>
			<div className = "col-span-10">
				<FinalSystem  report = {report} />
			</div>
		</div>
	)
}