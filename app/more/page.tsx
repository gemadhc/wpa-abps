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
    <div className="min-h-screen bg-white text-black ">

    	<div className = " h-100 bg-white"> 
    		<AddressSelection 
    			addresses = {list }
          reload = {reload}
    		/>
    	</div>
    </div>
  );
}
