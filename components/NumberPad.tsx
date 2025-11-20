'use client';

import { useEffect, useRef } from 'react';
import { useNumberPad } from "../contexts/NumberPadContext";

export default function NumberPad() {
  const {
    targetName,
    fieldValue,
    updateValue,
    // closePad,   // no longer needed if always visible
    isOpen,        // no longer used
  } = useNumberPad();

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Bind number pad to target input whenever targetName updates
  useEffect(() => {
    if (!targetName) return;
    inputRef.current = document.querySelector(`[name="${targetName}"]`);
  }, [targetName]);

  const buttons = [
    '1','2','3',
    '4','5','6',
    '7','8','9',
    '0', '.', 'CL'
  ];

  const handleClick = (btn: string) => {
    if (navigator.vibrate) navigator.vibrate(40);
    console.log("handling click: ", btn, targetName)
    if (!targetName) return;

    let newValue = String(fieldValue || '');

    if (btn === 'CL') {
      newValue = '';
    } else if (btn === '.') {
      if (!newValue.includes('.')) newValue += '.';
    } else {
      if (newValue.includes('.')) {
        const periodIndex = newValue.indexOf('.');
        if (newValue.length - periodIndex <= 2) newValue += btn;
      } else {
        newValue += btn;
      }
    }
    console.log("This is the new value: ", newValue)
    updateValue(newValue);

    // Keep focus on the field
    /*setTimeout(() => {
      inputRef.current?.focus();
    }
    , 0);*/
  };

  return (
    <div >
      <div className="grid grid-cols-3 gap-1 w-full">

        {buttons.map((btn) => (
          <button
            key={btn}
            type="button"
            onClick={() => handleClick(btn)}
            className="p-2 text-xl font-semibold rounded border border-sky-700 bg-slate-100 hover:bg-slate-200 transition active:scale-95"
          >
            {btn}
          </button>
        ))}

      </div>
    </div>
  );
}
