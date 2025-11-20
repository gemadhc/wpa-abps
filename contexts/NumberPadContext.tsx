'use client';
import { createContext, useContext, useState, useEffect } from "react";

export type NumberPadContextType = {
  targetName: string | null;
  fieldValue: string;
  setTarget: (name: string, value: string) => void;
  updateValue: (value: string) => void;
};

export const NumberPadContext = createContext<NumberPadContextType>({
  targetName: null,
  fieldValue: "",
  setTarget: () => {},
  updateValue: () => {},
});

export function useNumberPad() {
  return useContext(NumberPadContext);
}

export function NumberPadProvider({ children }: { children: React.ReactNode }) {
  const [targetName, setTargetName] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState("");

  useEffect(()=>{
    console.log("This is the target name: ", targetName, fieldValue)
  }, [targetName])

  const setTarget = (name: string, value: string) => {
    console.log("name and value in context: ", name, value)
    setTargetName(name);
    setFieldValue(value || "");
  };

  const updateValue = (value: string) => {
    console.log("Got this value from number pad: ", value)
    setFieldValue(value);
  };

  return (
    <NumberPadContext.Provider
      value={{
        targetName,
        fieldValue,
        setTarget,
        updateValue,
      }}
    >
      {children}
    </NumberPadContext.Provider>
  );
}
