"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GraphInteractionContextType {
  selectedNodes: Set<any>;
  setSelectedNodes: (nodes: Set<any>) => void;
  selectedLinks: Set<any>;
  setSelectedLinks: (links: Set<any>) => void;
  isNodeModalOpen: boolean;
  setIsNodeModalOpen: (isOpen: boolean) => void;
  isLinkModalOpen: boolean;
  setIsLinkModalOpen: (isOpen: boolean) => void;
  isParameterModalOpen: boolean;
  setIsParameterModalOpen: (isOpen: boolean) => void;
  modalNode: any;
  setModalNode: (node: any) => void;
  modalLink: any;
  setModalLink: (link: any) => void;
}

const GraphInteractionContext = createContext<GraphInteractionContextType | undefined>(undefined);

export const GraphInteractionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [selectedLinks, setSelectedLinks] = useState(new Set());
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isParameterModalOpen, setIsParameterModalOpen] = useState(false);
  const [modalNode, setModalNode] = useState(null);
  const [modalLink, setModalLink] = useState(null);

  const value = {
    selectedNodes,
    setSelectedNodes,
    selectedLinks,
    setSelectedLinks,
    isNodeModalOpen,
    setIsNodeModalOpen,
    isLinkModalOpen,
    setIsLinkModalOpen,
    isParameterModalOpen,
    setIsParameterModalOpen,
    modalNode,
    setModalNode,
    modalLink,
    setModalLink,
  };

  return (
    <GraphInteractionContext.Provider value={value}>
      {children}
    </GraphInteractionContext.Provider>
  );
};

export const useGraphInteraction = () => {
  const context = useContext(GraphInteractionContext);
  if (context === undefined) {
    throw new Error('useGraphInteraction must be used within a GraphInteractionProvider');
  }
  return context;
};
