'use client'

import Image from "next/image";
import DatePicker from "../components/DatePicker"
import {useState, useEffect} from 'react'
import { format } from "date-fns"
import StopCard from "../components/StopCard"
import FormLayout from "../layouts/FormLayout"
import FinalXVB from "../forms/FinalXVB"

export default function Home() {
  const [date, setDate] = useState(new Date())
  const [list, setList] = useState([1,2,3,4,5,6,7])

  return (
    <div className="min-h-screen bg-white text-black p-10">
    	<StopCard />
    </div>
  );
}
