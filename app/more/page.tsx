'use client'
import AddressSelection from "../../components/AddressSelection"
import {useState, useEffect} from 'react'
import {requestAddresses} from "../../actions/session.js"

export default function Home() {
	const [list, setList] = useState([])

  useEffect(()=>{
  	console.log("requesting addresses: ")
  	requestAddresses().then((data, err) =>{
  		console.log("data: ", data, typeof(data))
  		setList(data)
  	})

  }, [])

  const reload = () =>{
    requestAddresses().then((data, err) =>{
      console.log("data: ", data, typeof(data))
      setList(data)
    })
  }
  return (
    <div className="min-h-screen px-5 py-2 bg-white text-black ">

    	<div className = " p-6 bg-white rounded-lg shadow-sm border border-gray-200"> 
    		<AddressSelection 
    			addresses = {list }
          reload = {reload}
    		/>
    	</div>

      <div className = "p-6 bg-white rounded-lg shadow-sm border border-gray-200"> 
        <h2 className="text-sm font-semibold text-gray-800"> Links</h2>
        <br/>
        <button 
          className = "text-blue-500 bg-white p-1 rounded focus:outline-2 focus:outline-offset-2 focus:outline-blue-200 active:bg-blue-100 ">
          See Documents
        </button>
      </div>
    </div>
  );
}
