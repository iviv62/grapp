"use client";
import React, { useEffect, useRef } from 'react';
import { useGraphData } from '../context/GraphDataContext';
import ForceGraph3D from 'react-force-graph-3d';

const GraphView3D: React.FC = () => {
  const { graphData } = useGraphData();
  const fgRef = useRef();

  if (!graphData) {
    return <div>Loading graph data... or submit a graph on the home page.</div>;
  }

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={graphData}
      nodeLabel="id"
      nodeAutoColorBy="group"
      linkDirectionalParticles={1}
    />
  );
};

export default GraphView3D;
