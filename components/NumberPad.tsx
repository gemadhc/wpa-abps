'use client';
import { useEffect, useRef, useContext } from 'react';
import { NumberPadProvider } from '../contexts/NumberPadContext';
import useNumberPad  from "../contexts/NumberPadContext"

export default function NumberPad() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (targetName) {
      inputRef.current = document.querySelector(`[name="${targetName}"]`);
    }
  }, [targetName]);

  const buttons = [
    '1','2','3',
    '4','5','6',
    '7','8','9',
    '0', '.', 'CL'
  ];

  const handleClick = (btn: string) => {
    if (!targetName || !setFieldValue) return;

    if (navigator.vibrate) navigator.vibrate(40); // Mobile vibration

    let newValue = String(fieldValue || '');

    if (btn === 'CL') newValue = '';
    else if (btn === '.') {
      if (!newValue.includes('.')) newValue += '.';
    } else {
      if (newValue.includes('.')) {
        const periodIndex = newValue.indexOf('.');
        if (newValue.length - periodIndex <= 2) newValue += btn;
      } else {
        newValue += btn;
      }
    }

    console.log("Number Pad updating: ", targetName, newValue);
    updateValue(newValue)

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="grid grid-cols-3 gap-0 w-full p-0">
      {buttons.map((btn) => (
        <button
          key={btn}
          type="button"
          onClick={() => handleClick(btn)}
          className="p-3 text-lg font-semibold rounded border border-sky-700 bg-slate-100 hover:bg-slate-200 transition active:scale-95"
        >
          {btn}
        </button>
      ))}
    </div>
  );
}
