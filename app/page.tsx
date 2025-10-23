'use client'

import Image from "next/image";
import DatePicker from "../components/DatePicker"
import {useState, useEffect} from 'react'
import { format } from "date-fns"
import StopCard from "../components/StopCard"

export default function Home() {
  const [date, setDate] = useState(new Date())
  const [list, setList] = useState([1,2,3,4,5,6,7])

  return (
    <div className="min-h-screen bg-white text-black">

      <DatePicker 
        value={format( new Date(date), "yyyy-MM-dd")}
        onSelected = {(e)=> setDate(e.target.value)}
        min="2020-01-01"
        max="2030-12-31"
        placeholder="Pick a date"
      />

      <div className = "">
        {
          list.map((stop, ind) =>{
            return(
              <StopCard 

              />
            )
          })
        }
      </div>
    </div>
  );
}
