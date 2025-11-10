'use client'
import AddressSelection from "../../components/AddressSelection"
import {useState, useEffect} from 'react'
import {requestAddresses} from "../../actions/session.js"

export default function Home() {

  useEffect(()=>{
  	requestAddresses().then((data, err) =>{
  		console.log("data: ", data)
  	})

  }, [])
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
