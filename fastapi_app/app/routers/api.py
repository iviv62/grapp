from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import networkx as nx
from networkx.readwrite import parse_gml, to_graph6_bytes
import json
import subprocess
from pathlib import Path

from .. import schemas, crud, utils
from ..database import SessionLocal
from typing import List

router = APIRouter(prefix="/api")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def gml_to_graph(gml_string: str):
    try:
        # The original code had some logic to handle GML errors.
        # I'm calling the refactored parse_gml function from utils.
        G = utils.parse_gml(gml_string)
        if G is None:
            raise ValueError("Failed to parse GML")
        return G
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid GML data: {e}")


def json_to_gml(graph_data: schemas.GraphData):
    response="graph [\n"

    for node in graph_data.nodes:
        # Pydantic models need to be converted to dicts before passing to traverse
        response+="node [\n"
        response+=utils.traverse(node.dict(by_alias=True))
        response+="]\n"

    for link in graph_data.links:
        response+="edge [\n"
        response+=utils.traverse(link.dict(by_alias=True))
        response+="]\n"

    #end of graph
    response+="]"
    return response

@router.post("/graph/gml")
async def export_gml(graph_data: schemas.GraphData):
    gml_string = json_to_gml(graph_data)
    return {"data": gml_string}

@router.post("/graph/graph6")
async def export_g6(graph_data: schemas.GraphData):
    gml_string = json_to_gml(graph_data)
    G = gml_to_graph(gml_string)
    g6_bytes = to_graph6_bytes(G)
    g6_string = g6_bytes.decode().replace(">>graph6<<","").strip()
    return {"data": g6_string}

@router.post("/graph/graphml")
async def export_graphml(graph_data: schemas.GraphData):
    gml_string = json_to_gml(graph_data)
    G = gml_to_graph(gml_string)
    # The graphml export in the original code had some complex logic to handle attributes.
    # I will replicate it here.
    attrs = set()
    for node in G.nodes:
        for attrib in G.nodes[node]:
            if type(G.nodes[node][attrib]) == dict:
                for key in G.nodes[node][attrib].keys():
                    attrs.add(key)
    for attr in attrs:
        if isinstance(attr, int):
            var =int()
        elif isinstance(attr,str):
            var = str()
        nx.set_node_attributes(G, var, attr)

    for node in G.nodes:
        for attrib in G.nodes[node]:
            if type(G.nodes[node][attrib]) == dict:
                d=G.nodes[node][attrib]
                for key, value in d.items():
                    G.nodes[node][key]=value
                # It is important to remove the original dict attribute
                G.nodes[node][attrib]=""

    for edge in G.edges:
        for attrib in G.edges[edge]:
                if type(G.edges[edge][attrib]) == dict:
                G.edges[edge][attrib]=""

    graphml_string = "\n".join(nx.generate_graphml(G))
    return {"data": graphml_string}

@router.post("/graph/gexf")
async def export_gexf(graph_data: schemas.GraphData):
    gml_string = json_to_gml(graph_data)
    G = gml_to_graph(gml_string)
    gexf_string = "\n".join(nx.generate_gexf(G))
    return {"data": gexf_string}

@router.post("/graph/edgelist")
async def export_edgelist(graph_data: schemas.GraphData):
    gml_string = json_to_gml(graph_data)
    G = gml_to_graph(gml_string)
    edgelist_string = "\n".join(nx.generate_edgelist(G, data=False))
    return {"data": edgelist_string}

@router.post("/graph/adjacency")
async def export_adjacency(graph_data: schemas.GraphData):
    gml_string = json_to_gml(graph_data)
    G = gml_to_graph(gml_string)
    adj_string = "\n".join(nx.generate_adjlist(G))
    return {"data": adj_string}

@router.post("/graph/sparse6")
async def export_sparse6(graph_data: schemas.GraphData):
    gml_string = json_to_gml(graph_data)
    G = gml_to_graph(gml_string)
    s6_string = nx.to_sparse6_bytes(G).decode()
    return {"data": s6_string}

@router.post("/graph/dot")
async def export_dot(graph_data: schemas.GraphData):
    gml_string = json_to_gml(graph_data)
    G = gml_to_graph(gml_string)
    dot_string = nx.nx_pydot.to_pydot(G).to_string()
    return {"data": dot_string}

@router.post("/graph/newGraph")
async def load_new_content(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        data = contents.decode("utf-8")
        graphData = utils.convertGraph(data)
        if graphData == "error":
            raise HTTPException(status_code=400, detail="Invalid graph format")
        return json.loads(graphData)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/graph/from-text")
async def from_text(text: str = Form(...)):
    try:
        graphData = utils.convertGraph(text)
        if graphData == "error":
            raise HTTPException(status_code=400, detail="Invalid graph format")
        return json.loads(graphData)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ModifyAPIRequest(schemas.GraphData):
    cmd: str
    parameters: dict

@router.post("/graph/modify")
async def modify_api(request_data: ModifyAPIRequest, db: Session = Depends(get_db)):
    gml_string = json_to_gml(request_data)

    command = crud.get_command_by_name(db, name=request_data.cmd)
    if not command:
        raise HTTPException(status_code=404, detail="Command not found")

    cmd_string = command.terminal_command
    for key, value in request_data.parameters.items():
        if key:
            cmd_string += f" -{key}"
        if value:
            cmd_string += f" {value}"

    # The original code used temp files. Let's try to use stdin/stdout
    try:
        process = subprocess.run(
            cmd_string,
            input=gml_string,
            capture_output=True,
            text=True,
            shell=True, # The original used shell=True, so we do too. This can be a security risk.
            check=True
        )
        output_gml = process.stdout
        graph_data = utils.convertGraph(output_gml)
        if graph_data == "error":
            raise HTTPException(status_code=400, detail="Invalid graph format in command output")
        return json.loads(graph_data)

    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Error executing command: {e.stderr}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/graph/parameters")
async def get_command_parameters(name: str = Form(...), db: Session = Depends(get_db)):
    command = crud.get_command_by_name(db, name=name)
    if not command:
        raise HTTPException(status_code=404, detail="Command not found")

    params = crud.get_command_parameters(db, command_id=command.id)
    return [schemas.CommandParameter.from_orm(p) for p in params]

@router.post("/sample-graph")
async def get_sample_graph(name: str = Form(...)):
    file_path = Path(__file__).parent.parent.parent / "sample_graphs" / f"{name}.txt"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Sample graph not found")

    with open(file_path, "r") as f:
        graph_string = f.read()

    return {"data": graph_string}

@router.get("/commands", response_model=List[schemas.Command])
def get_all_commands(db: Session = Depends(get_db)):
    return crud.get_commands(db)
