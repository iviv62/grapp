"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GraphData {
  nodes: any[];
  links: any[];
}

interface GraphDataContextType {
  graphData: GraphData | null;
  setGraphData: (data: GraphData | null) => void;
}

const GraphDataContext = createContext<GraphDataContextType | undefined>(undefined);

export const GraphDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  return (
    <GraphDataContext.Provider value={{ graphData, setGraphData }}>
      {children}
    </GraphDataContext.Provider>
  );
};

export const useGraphData = () => {
  const context = useContext(GraphDataContext);
  if (context === undefined) {
    throw new Error('useGraphData must be used within a GraphDataProvider');
  }
  return context;
};
