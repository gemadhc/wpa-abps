'use client';
import { createContext, useContext, useState, useEffect } from "react";

// 👉 helper to format Date -> "yyyy-MM-dd"
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// 👉 helper to normalize input (string | Date)
const normalizeDate = (value: string | Date) => {
  if (value instanceof Date) return formatDate(value);
  return value; // assume already yyyy-MM-dd
};

// 👉 context shape
type DateContextType = {
  date: string; // always "yyyy-MM-dd"
  setDate: (value: string | Date) => void;
  resetToToday: () => void;
};

// 👉 create context
const DateContext = createContext<DateContextType | undefined>(undefined);

// 👉 provider
export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const [date, setDateState] = useState<string>(() => formatDate(new Date()));

  const setDate = (value: string | Date) => {
    setDateState(normalizeDate(value));
  };

  const resetToToday = () => {
    setDateState(formatDate(new Date()));
  };

  return (
    <DateContext.Provider value={{ date, setDate, resetToToday }}>
      {children}
    </DateContext.Provider>
  );
};

// 👉 hook
export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};