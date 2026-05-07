'use client'

import Confetti from 'react-confetti'
import { useState } from 'react'

export default function Celebration() {
  const [show, setShow] = useState(true)

  return (
    <div>
      <button onClick={() => setShow(true)}>Complete Task</button>
      {show && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      {show && <h2 className="text-3xl font-bold text-green-500">Way to go!</h2>}
    </div>
  )
}