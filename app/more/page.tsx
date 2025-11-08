'use client'
import AddressSelection from "../../components/AddressSelection"
import {useState, useEffect} from 'react'

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
