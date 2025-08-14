"use client";
import React from 'react';
import { useSidebar } from '../context/SidebarContext';
import { useGraphInteraction } from '../context/GraphInteractionContext';

const Sidebar: React.FC = () => {
  const {
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
    selectedCommand, setSelectedCommand
  } = useSidebar();

  const { setIsParameterModalOpen } = useGraphInteraction();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch commands from the backend
  React.useEffect(() => {
    const fetchCommands = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/commands`);
        if (res.ok) {
          const data = await res.json();
          setCommands(data);
        } else {
          console.error('Failed to fetch commands');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCommands();
  }, [setCommands, backendUrl]);

  const handleParametersClick = () => {
    if (selectedCommand) {
      setIsParameterModalOpen(true);
    } else {
      alert('Please select a command first.');
    }
  };

  return (
    <nav id="sidebar">
      <div className="controls">
        <div className="force2">
          <div style={{ display: 'flex' }}>
            Zoom level <div className="ml-4" id="zoom">{zoom}</div>
          </div>
          <input id="zoomInput" type="range" min="0" max="100" step="1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          <br />
          <div style={{ display: 'flex' }}>
            edge curves <div className="ml-4" id="linkCurve">{edgeCurvature}</div>
          </div>
          <input id="linkCurveInput" type="range" min="0" max="1" value={edgeCurvature} step="0.1" onChange={(e) => setEdgeCurvature(Number(e.target.value))} />
          <div style={{ display: 'flex' }}>
            edge width <div className="ml-4" id="edgeWidth">{edgeWidth}</div>
          </div>
          <input id="edgeWidthInput" type="range" min="1" max="10" value={edgeWidth} step="1" onChange={(e) => setEdgeWidth(Number(e.target.value))} />
          <div style={{ display: 'flex' }}>
            vertex radius<div className="ml-4" id="nodeRadius">{nodeRadius}</div>
          </div>
          <input id="nodeRadiusInput" type="range" min="1" max="20" value={nodeRadius} step="1" onChange={(e) => setNodeRadius(Number(e.target.value))} />

          <div style={{ display: 'flex' }}>
            force collide<div className="ml-4" id="force-collide">{forceCollide}</div>
          </div>
          <input id="force-collideInput" type="range" min="0" max="200" value={forceCollide} step="1" onChange={(e) => setForceCollide(Number(e.target.value))} />
          <br />
          <div style={{ display: 'flex' }}>
            edge length<div className="ml-4" id="link-distance">{edgeLength}</div>
          </div>
          <input id="link-distanceInput" type="range" min="0" max="250" value={edgeLength} step="1" onChange={(e) => setEdgeLength(Number(e.target.value))} />
          <br />
          <div style={{ display: 'flex' }}>
            vertex attraction<div className="ml-4" id="node-attraction">{vertexAttraction}</div>
          </div>
          <input id="node-attractionInput" type="range" min="-250" max="250" value={vertexAttraction} step="1" onChange={(e) => setVertexAttraction(Number(e.target.value))} />
          <br />
        </div>

        <div className="force2">
          <div className="mt-4" style={{ color: 'aliceblue' }}>
            <span id="vertexNum">vertices:</span>
            <br />
            <span id="edgeNum">edges: </span>
          </div>
        </div>
        <div className="force2">
          <div>
            Enable Interaction
            <input className="fr" type="checkbox" id="interaction" name="interaction" checked={enableInteraction} onChange={(e) => setEnableInteraction(e.target.checked)} />
            <br />
            Edge visibility
            <input className="fr" type="checkbox" id="edge-visibility" name="edge-visibility" checked={edgeVisibility} onChange={(e) => setEdgeVisibility(e.target.checked)} />
            <br />
            Show vertex labels
            <input className="fr" type="checkbox" id="vertex-labels" name="vertex-labels" checked={vertexLabels} onChange={(e) => setVertexLabels(e.target.checked)} />
            <br />
            Fix on move
            <input className="fr" type="checkbox" id="fixed-nodes" name="fixed-nodes" checked={fixOnMove} onChange={(e) => setFixOnMove(e.target.checked)} />
            <br />
            Fix all vertices
            <input className="fr" type="checkbox" id="fixed-nodes-all" name="fixed-nodes-all" checked={fixAllVertices} onChange={(e) => setFixAllVertices(e.target.checked)} />
            <br />
            Color background
            <input style={{ float: 'right' }} type="color" id="bgcolor" name="bgcolor" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            <br />
            Color all vertices
            <input style={{ float: 'right' }} type="color" id="nodes-color" name="nodes-color" value={nodesColor} onChange={(e) => setNodesColor(e.target.value)} />
            <br />
            Color all edges
            <input style={{ float: 'right' }} type="color" id="edges-color" name="edges-color" value={edgesColor} onChange={(e) => setEdgesColor(e.target.value)} />
            <br />
          </div>
        </div>
        <div className="force">
          <center>
            {' '}
            Commands
            <select name="command" id="command" value={selectedCommand} onChange={(e) => setSelectedCommand(e.target.value)}>
              <option value="" disabled hidden></option>
              <option value="radialLayout">radial layout</option>
              {commands.map((cmd) => (
                <option key={cmd.id} value={cmd.name}>{cmd.name}</option>
              ))}
            </select>
          </center>
        </div>
        <div className="force">
          <button onClick={handleParametersClick} className="navBtn">
            Parameters
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
