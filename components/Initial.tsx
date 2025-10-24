import InitialDC from "../forms/InitialDC"
import Approved from "../forms/Approved"
import System from "../forms/System"
import Remarks from "../forms/Remarks"
import NumberPad from "./NumberPad"

export default function Initial(){
	return(
		<div className =" grid grid-cols-10 gap-8 pb-50">
			<div className = "col-span-10">
				<Approved />
			</div>
			<div className = "col-span-5">
				<InitialDC />
			</div>
			<div className = "col-span-5">
				<NumberPad />
			</div>
			<div className = "col-span-10">
				<System />
			</div>
			<div className = "col-span-10">
				<Remarks />
			</div>
		</div>
	)
}