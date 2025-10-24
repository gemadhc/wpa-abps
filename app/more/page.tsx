'use client'

import Image from "next/image";
import DatePicker from "../components/DatePicker"
import AddressSelection from "../../components/AddressSelection"
import {useState, useEffect} from 'react'
import { format } from "date-fns"
import StopCard from "../components/StopCard"
import FormLayout from "../layouts/FormLayout"
import FinalXVB from "../forms/FinalXVB"

export default function Home() {

  return (
    <div className="min-h-screen bg-white text-black ">
    	<div className = "h-100 bg-gray-100"> 

    	</div>
    	<div className = " h-100 bg-gray-200"> 
    		<AddressSelection />
    	</div>
    </div>
  );
}
