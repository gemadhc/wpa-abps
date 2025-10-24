'use client';
import { useState } from 'react';

type NumberPadProps = {
  targetElement: string; // selector for the input element this pad controls
};

export default function NumberPad({ targetElement }: NumberPadProps) {
  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '.', '0', 'CL',
  ];

  const grabValue = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = event.currentTarget;
    if ('vibrate' in navigator) navigator.vibrate(100);

    if (!targetElement) return;
    const myElement = document.querySelector<HTMLInputElement>(targetElement);
    if (!myElement) return;

    const val = target.id;

    if (val === 'CL') {
      myElement.value = '';
      return;
    }

    if (val === '.') {
      if (!myElement.value.includes('.')) {
        myElement.value = targetElement !== '#dmr'
          ? (myElement.value + '.').replace(/^0+/, '')
          : myElement.value + '.';
      }
      return;
    }

    // numbers 0-9
    if (myElement.value.includes('.')) {
      const periodIndex = myElement.value.indexOf('.');
      if (myElement.value.length - periodIndex <= 2) {
        myElement.value += val;
      }
    } else {
      myElement.value = targetElement !== '#dmr'
        ? (myElement.value + val).replace(/^0+/, '')
        : myElement.value + val;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-1 w-full p-0">
      {buttons.map((btn) => (
        <button
          key={btn}
          id={btn}
          onClick={grabValue}
          className={`p-3 text-lg font-semibold rounded-lg border bg-gray-100 hover:bg-gray-200 transition`}
        >
          {btn}
        </button>
      ))}
    </div>
  );
}
