import { createContext, useContext, useState, ReactNode, useEffect } from "react";


type NumberPadContextType = {
  targetName: string | null;
  setActiveField: (name: string | null) => void;
  updateValue: (value: string) => void;
  fieldValues: Record<string, string>;
};

const NumberPadContext = createContext<NumberPadContextType | undefined>(undefined);

export const useNumberPad = () => {
  const context = useContext(NumberPadContext);
  if (!context) throw new Error("useNumberPad must be used within a NumberPadProvider");
  return context;
};

type ProviderProps = { children: ReactNode };

export const NumberPadProvider = ({ children }: ProviderProps) => {
  const [targetName, setActiveField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  useEffect(()=>{
    console.log("new target: ", targetName)
  }, [targetName])

  const updateValue = (value: string) => {
    if (!targetName) return;
    setFieldValues((prev) => ({ ...prev, [targetName]: value }));
  };

  return (
    <NumberPadContext.Provider value={{ targetName, setActiveField, updateValue, fieldValues }}>
      {children}
    </NumberPadContext.Provider>
  );
};
