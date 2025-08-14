"use client";
import React, { useEffect, useRef } from 'react';
import { useGraphData } from '../context/GraphDataContext';
import { useSidebar } from '../context/SidebarContext';
import { useGraphInteraction } from '../context/GraphInteractionContext';
import ForceGraph2D from 'react-force-graph-2d';
import { forceRadial } from 'd3-force';

const GraphView: React.FC = () => {
  const { graphData, setGraphData } = useGraphData();
  const {
    zoom,
    edgeCurvature,
    edgeWidth,
    nodeRadius,
    forceCollide,
    edgeLength,
    vertexAttraction,
    enableInteraction,
    edgeVisibility,
    vertexLabels,
    bgColor,
    nodesColor,
    edgesColor,
    setRadialLayoutFn,
  } = useSidebar();
  const {
    selectedNodes, setSelectedNodes,
    selectedLinks, setSelectedLinks,
    setIsNodeModalOpen, setModalNode,
    setIsLinkModalOpen, setModalLink
  } = useGraphInteraction();
  const fgRef = useRef();

  const handleNodeClick = (node, event) => {
    const newSelectedNodes = new Set(selectedNodes);
    if (event.ctrlKey || event.shiftKey || event.altKey) {
      newSelectedNodes.has(node) ? newSelectedNodes.delete(node) : newSelectedNodes.add(node);
    } else {
      const untoggle = newSelectedNodes.has(node) && newSelectedNodes.size === 1;
      newSelectedNodes.clear();
      !untoggle && newSelectedNodes.add(node);
    }
    setSelectedNodes(newSelectedNodes);
  };

  const handleLinkClick = (link, event) => {
    const newSelectedLinks = new Set(selectedLinks);
    if (event.ctrlKey || event.shiftKey || event.altKey) {
        newSelectedLinks.has(link) ? newSelectedLinks.delete(link) : newSelectedLinks.add(link);
    } else {
        const untoggle = newSelectedLinks.has(link) && newSelectedLinks.size === 1;
        newSelectedLinks.clear();
        !untoggle && newSelectedLinks.add(link);
    }
    setSelectedLinks(newSelectedLinks);
  };

  const handleNodeRightClick = (node) => {
    setModalNode(node);
    setIsNodeModalOpen(true);
  };

  const handleLinkRightClick = (link) => {
    setModalLink(link);
    setIsLinkModalOpen(true);
  };

  useEffect(() => {
    const radialLayout = (radius: number) => {
        if (fgRef.current && graphData) {
            const fg = fgRef.current;
            // @ts-ignore
            fg.d3Force('charge', null);
            // @ts-ignore
            fg.d3Force('radial', forceRadial(radius));
            // @ts-ignore
            setTimeout(() => {
                const { nodes, links } = graphData;
                nodes.forEach(node => {
                    node.fx = node.x;
                    node.fy = node.y;
                });
                setGraphData({ nodes, links });
                // @ts-ignore
                fg.d3Force('charge', null);
                // @ts-ignore
                fg.d3Force('radial', null);

            }, 3000);
        }
    };
    setRadialLayoutFn(() => radialLayout);
  }, [graphData, setGraphData, setRadialLayoutFn]);

  useEffect(() => {
    if (fgRef.current) {
      // @ts-ignore
      fgRef.current.zoom(zoom);
    }
  }, [zoom]);

  useEffect(() => {
    if (fgRef.current) {
      // @ts-ignore
      fgRef.current.d3Force('charge').strength(vertexAttraction);
      // @ts-ignore
      fgRef.current.d3Force('link').distance(edgeLength);
      // @ts-ignore
      fgRef.current.d3Force('collide').radius(forceCollide);
      // @ts-ignore
      fgRef.current.d3ReheatSimulation();
    }
  }, [vertexAttraction, edgeLength, forceCollide]);

  if (!graphData) {
    return <div>Loading graph data... or submit a graph on the home page.</div>;
  }

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      // Basic props
      nodeLabel="id"
      // Styling props
      backgroundColor={bgColor}
      nodeColor={() => nodesColor}
      linkColor={() => edgesColor}
      nodeVal={nodeRadius}
      linkWidth={edgeWidth}
      linkCurvature={edgeCurvature}
      // Interaction props
      onNodeClick={handleNodeClick}
      onLinkClick={handleLinkClick}
      onNodeRightClick={handleNodeRightClick}
      onLinkRightClick={handleLinkRightClick}
      enableNodeDrag={enableInteraction}
      enableZoomInteraction={enableInteraction}
      enablePanInteraction={enableInteraction}
      // Visibility props
      linkVisibility={edgeVisibility}
      nodeCanvasObject={(node, ctx, globalScale) => {
        if (vertexLabels) {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'white';
          ctx.fillText(label, node.x, node.y);
        }

        if (selectedNodes.has(node)) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius + 2, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
          ctx.fill();
        }
      }}
      nodeCanvasObjectMode={node => vertexLabels || selectedNodes.has(node) ? 'after' : undefined}
      linkCanvasObject={(link, ctx) => {
        if (selectedLinks.has(link)) {
          ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(link.source.x, link.source.y);
          ctx.lineTo(link.target.x, link.target.y);
          ctx.stroke();
        }
      }}
      linkCanvasObjectMode={() => 'after'}
    />
  );
};

export default GraphView;
