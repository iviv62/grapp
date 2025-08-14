"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SidebarState {
  zoom: number;
  setZoom: (zoom: number) => void;
  edgeCurvature: number;
  setEdgeCurvature: (curvature: number) => void;
  edgeWidth: number;
  setEdgeWidth: (width: number) => void;
  nodeRadius: number;
  setNodeRadius: (radius: number) => void;
  forceCollide: number;
  setForceCollide: (force: number) => void;
  edgeLength: number;
  setEdgeLength: (length: number) => void;
  vertexAttraction: number;
  setVertexAttraction: (attraction: number) => void;
  enableInteraction: boolean;
  setEnableInteraction: (enabled: boolean) => void;
  edgeVisibility: boolean;
  setEdgeVisibility: (visible: boolean) => void;
  vertexLabels: boolean;
  setVertexLabels: (visible: boolean) => void;
  fixOnMove: boolean;
  setFixOnMove: (fixed: boolean) => void;
  fixAllVertices: boolean;
  setFixAllVertices: (fixed: boolean) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  nodesColor: string;
  setNodesColor: (color: string) => void;
  edgesColor: string;
  setEdgesColor: (color: string) => void;
  commands: any[];
  setCommands: (commands: any[]) => void;
  selectedCommand: string;
  setSelectedCommand: (command: string) => void;
  radialLayout: (radius: number) => void;
  setRadialLayoutFn: (fn: (radius: number) => void) => void;
}

const SidebarContext = createContext<SidebarState | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [zoom, setZoom] = useState(2);
  const [edgeCurvature, setEdgeCurvature] = useState(0);
  const [edgeWidth, setEdgeWidth] = useState(1);
  const [nodeRadius, setNodeRadius] = useState(1);
  const [forceCollide, setForceCollide] = useState(0);
  const [edgeLength, setEdgeLength] = useState(1);
  const [vertexAttraction, setVertexAttraction] = useState(1);
  const [enableInteraction, setEnableInteraction] = useState(true);
  const [edgeVisibility, setEdgeVisibility] = useState(true);
  const [vertexLabels, setVertexLabels] = useState(true);
  const [fixOnMove, setFixOnMove] = useState(false);
  const [fixAllVertices, setFixAllVertices] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [nodesColor, setNodesColor] = useState('#000000');
  const [edgesColor, setEdgesColor] = useState('#ffffff');
  const [commands, setCommands] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState('');
  const [radialLayoutFn, setRadialLayoutFn] = useState<(radius: number) => void>(() => () => {});

  const radialLayout = (radius: number) => {
    radialLayoutFn(radius);
  };


  const value = {
    zoom, setZoom,
    edgeCurvature, setEdgeCurvature,
    edgeWidth, setEdgeWidth,
    nodeRadius, setNodeRadius,
    forceCollide, setForceCollide,
    edgeLength, setEdgeLength,
    vertexAttraction, setVertexAttraction,
    enableInteraction, setEnableInteraction,
    edgeVisibility, setEdgeVisibility,
    vertexLabels, setVertexLabels,
    fixOnMove, setFixOnMove,
    fixAllVertices, setFixAllVertices,
    bgColor, setBgColor,
    nodesColor, setNodesColor,
    edgesColor, setEdgesColor,
    commands, setCommands,
    selectedCommand, setSelectedCommand,
    radialLayout,
    setRadialLayoutFn,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
