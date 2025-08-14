"use client";
import React from 'react';
import Sidebar from '../components/Sidebar';
import GraphView3D from '../components/GraphView3D';
import Modals from '../components/Modals';
import { SidebarProvider } from '../context/SidebarContext';
import { GraphInteractionProvider } from '../context/GraphInteractionContext';

const GraphPage3D: React.FC = () => {
  return (
    <SidebarProvider>
      <GraphInteractionProvider>
        <div className="wrapper">
          <Sidebar />
          <div id="content" className="active">
            <GraphView3D />
          </div>
          <Modals />
        </div>
      </GraphInteractionProvider>
    </SidebarProvider>
  );
};

export default GraphPage3D;
