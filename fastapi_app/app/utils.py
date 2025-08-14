from html.parser import HTMLParser
from io import StringIO
import networkx as nx
from networkx.readwrite import json_graph
from networkx.readwrite import parse_gml,from_graph6_bytes
from networkx.exception import NetworkXException
import json
import pydot
import os

# HTML strip tags class
class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.text = StringIO()
    def handle_data(self, d):
        self.text.write(d)
    def get_data(self):
        return self.text.getvalue()

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

#write gml file
def traverse(node):
 result=""
 unwanted_params_nodes=["vx","vy","__indexColor","__controlPoints","__photons"]
 for key,value in node.items() :
     if key not in unwanted_params_nodes:
        if key=="source" or key=="target":
          result+="\t"+key+" "+ str(node[key]["id"])+"\n"
        elif isinstance(value,dict):
          result+="\t"+key+" [\n\t"
          result+=traverse(value)#call the function recursively
          result+="\t]\n"
        elif key=="source" or key=="target":
          result+="\t"+key+" "+ str(node[key]["id"])+"\n"
        elif isinstance(value,str):
          result+="\t"+str(key)+ ' "'+value+'"\n'
        elif isinstance(value,list):
          for x in value:
            result+=str(key)+"[  "
            result+="\n"+traverse(x)#call the function recursively
            result+=" \t]\n"
        else:
          result+="\t"+str(key)+" "+str(value)+"\n"
 return result


def parse_graphml(data):
    try:
        G=nx.readwrite.graphml.parse_graphml(data)
        return G
    except:
        return None

def parse_gml(data):
    try:
        G=parse_gml(data,label="id" ,destringizer=None)
        return G
    except NetworkXException as e:
        if "is duplicated" in str(e):
          word="node"
          idx=data.index(word)
          new=data[:idx] + "multigraph 1\n" + data[idx:]
          G=parse_gml(new,label="id" ,destringizer=None)
          return G
        if "cannot tokenize" in str(e):
          try:
            new= strip_tags(data)
            G=parse_gml(new,label="id" ,destringizer=None)
            return G
          except:
            return None
    except:
        return None

def parse_graph6(data):
    try:
        G =from_graph6_bytes(data.encode())
        return G
    except:
        return None

def parse_dot(data):
    try:
        graph =pydot.graph_from_dot_data(data)
        if not graph:
            return None
        G = nx.nx_pydot.from_pydot(graph[0])
        return G
    except:
        return None

def parse_sparse6(data):
    try:
        G =nx.readwrite.sparse6.from_sparse6_bytes(data.encode())
        return G
    except:
        return None

def parse_gexf(data):
    # gexf parser in networkx reads from a file path, so we need to write to a temp file
    try:
        with open("temp.gexf", "w") as f:
            f.write(data)
        G =nx.readwrite.gexf.read_gexf("temp.gexf")
        os.remove("temp.gexf")
        return G
    except:
        if os.path.exists("temp.gexf"):
            os.remove("temp.gexf")
        return None

def parse_leda(data):
    # leda parser in networkx reads from a list of strings
    try:
        lines = data.splitlines()
        G =nx.readwrite.leda.parse_leda(lines)
        return G
    except:
        return None

def parse_edgelist(data):
    try:
        lines = data.splitlines()
        # filter out lines starting with %
        lines = [line for line in lines if not line.startswith('%')]
        G =nx.readwrite.edgelist.parse_edgelist(lines ,nodetype=int)
        if not G.nodes():
            return None
        return G
    except:
        return None

def parse_csv(data):
    try:
        lines = data.splitlines()
        # skip header
        if lines:
            lines = lines[1:]
        Graphtype = nx.Graph()
        G = nx.parse_edgelist(lines, delimiter=',', create_using=Graphtype, nodetype=str)
        return G
    except:
        return None

def parse_json(data):
    try:
        js_graph = json.loads(data)
        if "nodes" not in js_graph or "links" not in js_graph:
            return None

        nodes = js_graph["nodes"]
        links = js_graph["links"]

        response="graph [\n"

        for node in nodes:
            response+="node [\n"
            response+=traverse(node)
            response+="]\n"

        for link in links:
            response+="edge [\n"
            response+=traverse(link)
            response+="]\n"

        #end of graph
        response+="]"
        G=parse_gml(response,label="id" ,destringizer=None)
        return G
    except :
        return None


parsers = [
    parse_graphml,
    parse_gml,
    parse_json,
    parse_graph6,
    parse_dot,
    parse_sparse6,
    parse_gexf,
    parse_edgelist,
    parse_csv,
    parse_leda, # leda is very broad, so it should be one of the last
]

def convertGraph(data: str):
    for parser in parsers:
        G = parser(data)
        if G:
            graph_data = json_graph.node_link_data(G)
            return json.dumps(graph_data)

    return "error"
