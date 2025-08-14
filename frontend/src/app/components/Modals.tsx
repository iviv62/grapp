"use client";
import React, { useEffect, useState } from 'react';
import { useGraphInteraction } from '../context/GraphInteractionContext';
import { useGraphData } from '../context/GraphDataContext';
import { useSidebar } from '../context/SidebarContext';

const Modals: React.FC = () => {
  const {
    isNodeModalOpen, setIsNodeModalOpen, modalNode,
    isLinkModalOpen, setIsLinkModalOpen, modalLink,
    isParameterModalOpen, setIsParameterModalOpen
  } = useGraphInteraction();
  const { graphData, setGraphData } = useGraphData();
  const { selectedCommand, radialLayout } = useSidebar();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeColor, setNodeColor] = useState('');
  const [nodeSize, setNodeSize] = useState(1);
  const [nodeInfo, setNodeInfo] = useState('');

  const [linkLabel, setLinkLabel] = useState('');
  const [linkColor, setLinkColor] = useState('');
  const [linkWidth, setLinkWidth] = useState(1);
  const [linkType, setLinkType] = useState('Solid');

  const [parameters, setParameters] = useState<any[]>([]);
  const [paramValues, setParamValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (modalNode) {
      setNodeLabel(modalNode.label || modalNode.id);
      setNodeColor(modalNode.color || '#000000');
      setNodeSize(modalNode.val || 1);
      setNodeInfo(modalNode.info || '');
    }
  }, [modalNode]);

  useEffect(() => {
    if (modalLink) {
        setLinkLabel(modalLink.label || '');
        setLinkColor(modalLink.color || '#000000');
        setLinkWidth(modalLink.width || 1);
        setLinkType(modalLink.stipple || 'Solid');
    }
  }, [modalLink]);

  useEffect(() => {
    const fetchParameters = async () => {
      if (isParameterModalOpen && selectedCommand) {
        if (selectedCommand === 'radialLayout') {
            setParameters([{ key: 'radius', value: '50' }]);
            setParamValues({ radius: '50' });
            return;
        }
        const formData = new FormData();
        formData.append('name', selectedCommand);
        try {
          const res = await fetch(`${backendUrl}/api/graph/parameters`, {
            method: 'POST',
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            setParameters(data);
            const initialValues: { [key: string]: string } = {};
            data.forEach((p: any) => {
              initialValues[p.key] = p.value;
            });
            setParamValues(initialValues);
          } else {
            console.error('Failed to fetch parameters');
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchParameters();
  }, [isParameterModalOpen, selectedCommand, backendUrl]);

  const handleParamValueChange = (key: string, value: string) => {
    setParamValues(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyParameters = async () => {
    if (selectedCommand === 'radialLayout') {
        const radius = Number(paramValues.radius) || 50;
        radialLayout(radius);
        setIsParameterModalOpen(false);
        return;
    }

    if (!graphData || !selectedCommand) return;

    const requestData = {
      ...graphData,
      cmd: selectedCommand,
      parameters: paramValues,
    };

    try {
      const res = await fetch(`${backendUrl}/api/graph/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (res.ok) {
        const data = await res.json();
        setGraphData(data);
        setIsParameterModalOpen(false);
      } else {
        console.error('Failed to apply command');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveNode = () => {
    if (!graphData || !modalNode) return;
    const newNodes = graphData.nodes.map(n => {
      if (n.id === modalNode.id) {
        return { ...n, label: nodeLabel, color: nodeColor, val: nodeSize, info: nodeInfo };
      }
      return n;
    });
    setGraphData({ ...graphData, nodes: newNodes });
    setIsNodeModalOpen(false);
  };

  const handleDeleteNode = () => {
    if (!graphData || !modalNode) return;
    const newNodes = graphData.nodes.filter(n => n.id !== modalNode.id);
    const newLinks = graphData.links.filter(l => l.source.id !== modalNode.id && l.target.id !== modalNode.id);
    setGraphData({ nodes: newNodes, links: newLinks });
    setIsNodeModalOpen(false);
  };

  const handleSaveLink = () => {
    if (!graphData || !modalLink) return;
    const newLinks = graphData.links.map(l => {
      if (l.source.id === modalLink.source.id && l.target.id === modalLink.target.id) {
        return { ...l, label: linkLabel, color: linkColor, width: linkWidth, stipple: linkType };
      }
      return l;
    });
    setGraphData({ ...graphData, links: newLinks });
    setIsLinkModalOpen(false);
  };

  const handleDeleteLink = () => {
    if (!graphData || !modalLink) return;
    const newLinks = graphData.links.filter(l => !(l.source.id === modalLink.source.id && l.target.id === modalLink.target.id));
    setGraphData({ ...graphData, links: newLinks });
    setIsLinkModalOpen(false);
  };

  return (
    <div>
      {isNodeModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Node: {modalNode?.id}</h5>
                <button type="button" className="btn-close" onClick={() => setIsNodeModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="modal-label" className="col-form-label">Label:</label>
                    <input type="text" className="form-control" id="modal-label" value={nodeLabel} onChange={e => setNodeLabel(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-color" className="col-form-label">Color:</label>
                    <input type="color" className="form-control modal-color" id="modal-color" value={nodeColor} onChange={e => setNodeColor(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-size" className="col-form-label">Size:</label>
                    <input type="number" className="form-control" id="modal-size" value={nodeSize} onChange={e => setNodeSize(Number(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vertex-info" className="col-form-label">Info:</label>
                    <textarea className="form-control" id="vertex-info" value={nodeInfo} onChange={e => setNodeInfo(e.target.value)}></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNodeModalOpen(false)}>Close</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteNode}>Delete</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveNode}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLinkModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Link: {modalLink?.source.id} - {modalLink?.target.id}</h5>
                <button type="button" className="btn-close" onClick={() => setIsLinkModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="modal-link-label" className="col-form-label">Label:</label>
                    <input type="text" className="form-control" id="modal-link-label" value={linkLabel} onChange={e => setLinkLabel(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-link-color" className="col-form-label">Color:</label>
                    <input type="color" className="form-control" id="modal-link-color" value={linkColor} onChange={e => setLinkColor(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-link-width" className="col-form-label">Width:</label>
                    <input type="number" className="form-control" id="modal-link-width" value={linkWidth} onChange={e => setLinkWidth(Number(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-link-type" className="col-form-label">Line Type:</label>
                    <select className="form-control" id="modal-link-type" value={linkType} onChange={e => setLinkType(e.target.value)}>
                      <option>Solid</option>
                      <option>Dashed</option>
                      <option>Dashdot</option>
                      <option>Dashdotdot</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsLinkModalOpen(false)}>Close</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteLink}>Delete</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveLink}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isParameterModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Command Parameters</h5>
                <button type="button" className="btn-close" onClick={() => setIsParameterModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                {parameters.map(param => (
                  <div className="form-group" key={param.key}>
                    <label className="col-form-label">{param.key}:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={paramValues[param.key] || ''}
                      onChange={e => handleParamValueChange(param.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsParameterModalOpen(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleApplyParameters}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modals;
