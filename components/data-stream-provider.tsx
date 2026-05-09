"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type DataStreamContextType = {
  dataStream: any[] | undefined;
  setDataStream: (updater: (prev: any[] | undefined) => any[]) => void;
};

const DataStreamContext = createContext<DataStreamContextType | undefined>(
  undefined,
);

export function DataStreamProvider({ children }: { children: ReactNode }) {
  const [dataStream, setDataStream] = useState<any[] | undefined>(undefined);

  return (
    <DataStreamContext.Provider value={{ dataStream, setDataStream }}>
      {children}
    </DataStreamContext.Provider>
  );
}

export function useDataStream() {
  const context = useContext(DataStreamContext);
  if (context === undefined) {
    throw new Error("useDataStream must be used within a DataStreamProvider");
  }
  return context;
}
