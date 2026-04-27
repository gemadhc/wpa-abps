'use client';

import { createContext, useContext, useState } from 'react';

const ViewContext = createContext(null);

export const ViewProvider = ({ children }) => {
  const [view, setView] = useState({ type: 'list' });

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => useContext(ViewContext);