"use client";
import React from 'react';
import Sidebar from '../components/Sidebar';
import GraphView from '../components/GraphView';
import Modals from '../components/Modals';
import { SidebarProvider } from '../context/SidebarContext';
import { GraphInteractionProvider } from '../context/GraphInteractionContext';

const GraphPage: React.FC = () => {
  return (
    <SidebarProvider>
      <GraphInteractionProvider>
        <div className="wrapper">
          <Sidebar />
          <div id="content" className="active">
            <GraphView />
          </div>
          <Modals />
        </div>
      </GraphInteractionProvider>
    </SidebarProvider>
  );
};

export default GraphPage;
