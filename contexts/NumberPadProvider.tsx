'use client';

import { useState } from "react";
import { NumberPadContext } from "./NumberPadContext";

export default function NumberPadProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetName, setTargetName] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState("");

  const openPad = (name: string, value: string) => {
    setTargetName(name);
    setFieldValue(value || "");
    setIsOpen(true);
  };

  const closePad = () => {
    setIsOpen(false);
    setTargetName(null);
    setFieldValue("");
  };

  const updateValue = (value: string) => {
    setFieldValue(value);
  };

  return (
    <NumberPadContext.Provider
      value={{
        isOpen,
        targetName,
        fieldValue,
        openPad,
        closePad,
        updateValue,
      }}
    >
      {children}
    </NumberPadContext.Provider>
  );
}