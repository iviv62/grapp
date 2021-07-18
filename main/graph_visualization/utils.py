from networkx.readwrite import json_graph,jit_graph
import numpy as np
import pandas as pd
import networkx as nx
from networkx.readwrite import parse_gml,from_graph6_bytes
from networkx.exception import NetworkXException
import json
import csv
import pydot
from json import JSONDecodeError

def validate_alignment(alignment_filename):
    f = open(alignment_filename) # avoid using key word `file`

    f.readline()  # pass the head line

    contents = csv.reader(f)
    for row in contents:
        if len(row) == 0:
            return False
        row = map(int, row)  # cast read_start and read_end to integer
        if row[0] > row[1]:
            return False
    return True

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

from io import StringIO
from html.parser import HTMLParser
#HTML strip tags class
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

def convertGraph(data):
    try:
        #read GraphML
        G=nx.readwrite.graphml.parse_graphml(data)
        data1 = json_graph.node_link_data(G)
        s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"}) 
        return s2
    except :
        pass
    try:
        #read gml
        G=parse_gml(data,label="id" ,destringizer=None)
        data1 = json_graph.node_link_data(G)
        s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"})  
        return s2
    except NetworkXException as e:
        if "is duplicated" in str(e):
          word="node"
          idx=data.index(word)
          print("duplicate")
          new=data[:idx] + "multigraph 1\n" + data[idx:]
          G=parse_gml(new,label="id" ,destringizer=None)
          data1 = json_graph.node_link_data(G)
          s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"})  
          return s2
        if "cannot tokenize" in str(e):
          try:
            new= strip_tags(data)
            print(new[:1000])
            print("tokenize")
            G=parse_gml(new,label="id" ,destringizer=None)
            data1 = json_graph.node_link_data(G)
            s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"})  
            return s2
          except:
            pass
    except:
      pass
     

    try:
      #read from graph6
        G =from_graph6_bytes(data.encode())
        data1 = json_graph.node_link_data(G)
        s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"})
        return s2
    except :
        print("g6 error")
    try:
      #read from dot
        graph =pydot.graph_from_dot_data(data)
        print(graph)
        G = nx.nx_pydot.from_pydot(graph[0])
        data1 = json_graph.node_link_data(G)
        print(data1)
        s2 = json.dumps(data1)
        return s2
    except :
        print("dot error")
    try:
      #read from sparse6
        G =nx.readwrite.sparse6.from_sparse6_bytes(data.encode())
        data1 = json_graph.node_link_data(G)
        s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"})
        return s2
    except :
        print("sparse6 error")
    

    try:
      #read from gexf
        G =nx.readwrite.gexf.read_gexf("temp.txt")
        data1 = json_graph.node_link_data(G)
        s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"})
        return s2
    except:
        print("GEXF error")
    try:
      #read from LEDA
        f= open("temp.txt", "rb")
        Lines = f.readlines()
        tempList =[]
        for line in Lines:
          tempList.append(line.decode().rstrip("\r\n"))
        G =nx.readwrite.leda.parse_leda(tempList)
        f.close()
        data1 = json_graph.node_link_data(G)
        s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"})
        return s2
    except:
        print("Leda")
  
    
    try:
      #read from Edge list and TSV 
        fh = open("temp.txt", "rb")
        Lines = fh.readlines()
        # example ["1 2", "2 3", "3 4"]
        tempList =[]
        
        for line in Lines:
          if(not line.decode().rstrip("\r\n").startswith("%")):
            tempList.append(line.decode().rstrip("\r\n"))
    
        
        
        G =nx.readwrite.edgelist.parse_edgelist(tempList ,nodetype=int)
        fh.close()
        data1 = json_graph.node_link_data(G)
        if(len(data1["nodes"])==0):
          raise Exception("Edge list")
        s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"})
        return s2
    except:
        print("edge list")
    try:
        #read from CSV
        #split data and chceck for validity
        Data = open('temp.txt', "r")
        next(Data, None)  # skip the first line in the input file
        Graphtype = nx.Graph()

        G = nx.parse_edgelist(Data, delimiter=',', create_using=Graphtype, nodetype=str, )
        Data.close()
        data1 = json_graph.node_link_data(G)
        s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"})
        return s2
    except:
        print("csv")   

    try:
        #read from json String
        js_graph = json.loads(data)
        print(type(js_graph))
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
        data1 = json_graph.node_link_data(G)
        s2 = json.dumps(data1, default={"link": "edges", "source": "from", "target": "to"})
       
        return s2
    except :
        print("error")
    return "error"           