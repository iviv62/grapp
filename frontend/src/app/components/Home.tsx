"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useGraphData } from '../context/GraphDataContext';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const [text, setText] = useState('');
  const [radio, setRadio] = useState('2D');
  const [file, setFile] = useState<File | null>(null);
  const [sample, setSample] = useState('');
  const { setGraphData } = useGraphData();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', text);

    try {
      const res = await fetch(`${backendUrl}/api/graph/from-text`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setGraphData(data);
        if (radio === '2D') {
            router.push('/graph');
        } else {
            router.push('/graph3d');
        }
      } else {
        console.error('Failed to fetch graph data from text');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      // Immediately submit after file selection
      handleFileSubmit(e.target.files[0]);
    }
  };

  const handleFileSubmit = async (selectedFile: File) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${backendUrl}/api/graph/newGraph`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setGraphData(data);
        if (radio === '2D') {
            router.push('/graph');
        } else {
            router.push('/graph3d');
        }
      } else {
        console.error('Failed to fetch graph data from file');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSampleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sampleName = e.target.value;
    setSample(sampleName);
    if (!sampleName) return;

    const formData = new FormData();
    formData.append('name', sampleName);

    try {
        const res = await fetch(`${backendUrl}/api/sample-graph`, {
            method: 'POST',
            body: formData
        });
        if(res.ok) {
            const data = await res.json();
            setText(data.data);
        } else {
            console.error("Failed to fetch sample graph");
        }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <Image src="/images/grapp-logo.png" alt="logo" width={500} height={150} />

        <div className="col-md-12">
          <div id="typeForm" className="tabcontent" style={{ display: 'block', marginTop: '30px' }}>
            <form onSubmit={handleTextSubmit}>
              <div className="form-group blue-border-focus mt-5">
                <textarea
                  className="form-control"
                  name="text"
                  style={{ fontSize: '90%' }}
                  rows={11}
                  spellCheck={false}
                  maxLength={10000000}
                  placeholder="Paste a graph in the graph6, GML, GraphML, Leda, Edge List, GEXF,CSV,TSV,DOT or Sparse6 format..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
              </div>

              <div className="row">
                <legend className="col-form-label col-sm-2 pt-0">Rendering Options</legend>

                <div className="col-md-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="radio"
                      id="gridRadios1"
                      value="2D"
                      checked={radio === '2D'}
                      onChange={(e) => setRadio(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="gridRadios1">
                      2D
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="radio"
                      id="gridRadios2"
                      value="3D"
                      checked={radio === '3D'}
                      onChange={(e) => setRadio(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="gridRadios2">
                      3D
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input-group mb-3">
                    <select className="form-select" id="selectSample" value={sample} onChange={handleSampleChange}>
                      <option value="" disabled>Select Sample Graph...</option>
                      <option value="mao">mao.gml</option>
                      <option value="mao2">mao2.gml</option>
                      <option value="radial">radial layout</option>
                      <option value="doublewheelvariant">doublewheelvariant.gml</option>
                      <option value="1">Cubic Girth5</option>
                      <option value="2">Snark</option>
                      <option value="3">Tree</option>
                      <option value="ramsey">Minimal Ramsey(3,9)-graph</option>
                      <option value="cubic">Cubic vertex-transitive</option>
                      <option value="hanoi">Hanoi Exchange Graph 5 Discs</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <button id="submit" type="submit" className="btn btn-primary">
                    submit
                  </button>
                </div>
              </div>
            </form>
          </div>

          <hr className="mb-2" />

          <div id="uploadForm" className="tabcontent" style={{ display: 'block', marginTop: '30px' }}>
            <form>
              <div className="radio">
                <h3>Rendering Options</h3>
                <div className="row d-flex justify-content-center">
                  <div className="col-md-2 mt-2">
                    <label>
                      <input id="2DFile" name="radio" type="radio" value="2D" checked={radio === '2D'} onChange={(e) => setRadio(e.target.value)} />
                      2D
                    </label>
                  </div>
                  <div className="col-md-2 mt-2">
                    <label>
                      <input id="3DFile" name="radio" type="radio" value="3D" checked={radio === '3D'} onChange={(e) => setRadio(e.target.value)} />
                      3D
                    </label>
                  </div>
                </div>
              </div>

              <input
                className="mt-4"
                type="file"
                name="file"
                id="fileInput"
                accept=".gml,.g6,.graphml,.s6,.lgr,.gexf,.tsv,.csv,.gv,.dot,.txt"
                onChange={handleFileChange}
              />

              <label htmlFor="fileInput" id="fileLabel">
                <i className="fa fa-download fa-5x"></i>
                <br />
                <span id="fileLabelText">Choose a file or drag it here</span>
                <br />
                <span id="uploadStatus"></span>
              </label>
            </form>
          </div>

          <div className="row">
            <div className="col-md-12 text-center">
              Developed by: I. Ivanov & Jens M. Schmidt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
