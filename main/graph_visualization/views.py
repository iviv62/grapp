#Djnago stuff
from .models import *
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.core.serializers import serialize
import time

#helper functions
from .utils import traverse,convertGraph

#run binaries
import subprocess
from subprocess import PIPE, run
#networkx converters
from networkx.readwrite import json_graph
from networkx.readwrite import parse_gml,from_graph6_bytes,to_graph6_bytes
from networkx.exception import NetworkXException
import networkx as nx
#json module
import json
#path building
from pathlib import Path
import os



def graphPage(request):
   
    if request.method == 'POST':
        #get data from the form which is on home page
        
        if ("file" in request.FILES):
            try:
                data = request.FILES['file'].read().decode("utf-8")
               
            except:
                return render(request,"graph_visualization/error.html")


        else:
            data=request.POST.get("text")
        #some networkx converters dont handle strings(gexf,edge list,) so we need to create a temp file from
        #which we can read
        with open('temp.txt', 'w') as f:
            f.write(data)

        renderingOption=request.POST.get("radio")
        context=dict()
        graphData=convertGraph(data)
        context['data']=graphData
        context["commands"]= Command.objects.all()
        

        #render 2d or 3d page
        if graphData == "error":
            return render(request,"graph_visualization/error.html",context)
        elif renderingOption == "2D":
            return render(request,"graph_visualization/graph.html",context) 
        else:
            return render(request,"graph_visualization/graph3d.html",context)
    elif request.method== "GET" :
        context=dict()
        g6Str=request.GET.get("g6")
        
        graphData=convertGraph(g6Str)
        
        context['data']=graphData
        context["commands"]= Command.objects.all()
        return render(request,"graph_visualization/graph.html",context)

def graphPage3D(request):

    context={}
    return render(request,"graph_visualization/graph3d.html",context)


def home(request):
    context=dict()
    context["home"]=1
    return render(request, 'graph_visualization/home.html',context)

def About(request):
    context=dict()
    context["home"]=1
    return render(request, 'graph_visualization/about.html',context)

def Manual(request):
    context=dict()
    context["home"]=1
    return render(request, 'graph_visualization/manual.html',context)
    
def JsonEditor(request):
    return render(request, 'graph_visualization/jsonEditor.html',)


def LoadNewContent(request):
    if request.method == 'POST':
        if ("file" in request.FILES):
            try:
                data = request.FILES['file'].read().decode("utf-8")
            except:
                return render(request,"graph_visualization/error.html")
        with open('temp.txt', 'w') as f:
            f.write(data)
        

        print("loadcont")
        graphData=convertGraph(data)
        

    return JsonResponse({"data":graphData})

def exportGML(request):
   if request.method == 'POST':
        json_data = json.loads(request.body)
        nodes = json_data["nodes"]
        links = json_data["links"]


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

        return JsonResponse({"data":response})

def exportG6(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        nodes = json_data["nodes"]
        links = json_data["links"]

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
        G=parse_gml(response,label="id",destringizer=None)
        response=to_graph6_bytes(G)
        response=response.decode().replace(">>graph6<<","").strip()

        return JsonResponse({"data":response})

def exportGraphML(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        nodes = json_data["nodes"]
        links = json_data["links"]

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
        G=parse_gml(response,label="id",destringizer=None)
       
        
        attrs = set()
        #get attributes in nested structures
        for node in G.nodes:
            for attrib in G.nodes[node]:
                if type(G.nodes[node][attrib]) == dict:
                    for key in G.nodes[node][attrib].keys():
                        attrs.add(key)
                    #G.nodes[node][attrib]=""
        print(attrs)
        for attr in attrs:
            if isinstance(attr, int):
                var =int()
            elif isinstance(attr,str):
                var = str()
            nx.set_node_attributes(G, var, attr)

        for node in G.nodes:
            for attrib in G.nodes[node]:
                if type(G.nodes[node][attrib]) == dict:
                    #graphics dict
                    print(G.nodes[node][attrib])
                    d=G.nodes[node][attrib]
                    for key, value in d.items():
                        print(G.nodes[node][attrib])
                        G.nodes[node][key]=value
                        G.nodes[node][attrib]=""

    
        print(G)
        for edge in G.edges:
            for attrib in G.edges[edge]:
                 if type(G.edges[edge][attrib]) == dict:
                    G.edges[edge][attrib]=""
                    
              
        
        response=""
        linefeed = chr(10)
        s = linefeed.join(nx.generate_graphml(G))  
        for line in nx.generate_graphml(G):  
            response+=line+"\n"

        return JsonResponse({"data":response})
    
def exportGexf(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        nodes = json_data["nodes"]
        links = json_data["links"]

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
        G=parse_gml(response,label="id",destringizer=None)
        response=""
        for line in nx.generate_gexf(G):
            response+=line+"\n"
        return JsonResponse({"data":response})

def exportEdgelist(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        nodes = json_data["nodes"]
        links = json_data["links"]

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
        G=parse_gml(response,label="id",destringizer=None)
        response=""
        for line in nx.generate_edgelist(G, data=False):
            response+="\n"+line
        return JsonResponse({"data":response.strip("\n")})

def exportAdjacencyList(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        nodes = json_data["nodes"]
        links = json_data["links"]

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
        G=parse_gml(response,label="id",destringizer=None)
        response=""
        for line in nx.generate_adjlist(G):
            response+=line+"\n"
        return JsonResponse({"data":response})

def exportSparse6(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        nodes = json_data["nodes"]
        links = json_data["links"]

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
        G=parse_gml(response,label="id",destringizer=None)
        response=nx.to_sparse6_bytes(G).decode()
        
        return JsonResponse({"data":response})

def exportDot(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        nodes = json_data["nodes"]
        links = json_data["links"]

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
        G=parse_gml(response,label="id",destringizer=None)
        response=nx.nx_pydot.to_pydot(G).to_string()
        #output_graphviz_svg = response.create_svg()
        #print(output_graphviz_svg)
        return JsonResponse({"data":response})

#binary file view
def modifyAPI(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        nodes = json_data["nodes"]
        links = json_data["links"]
        cmd   = json_data["cmd"]
        parameters =json_data["parameters"]
        print(parameters)
        
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

        #search for the specific binary name in the DB
        binary = Command.objects.get(name=cmd)  
        #save the actual terminal command in a variable
        cmd=binary.terminal_command
        #add the params if they exist
        for key,value in parameters.items():
            if (key!=""):
                cmd+=" -"+key
            if(value!=""):
                cmd+=" "+value
        print(cmd)
        #start timer to see how long it takes to run the binary
        start_time = time.time()
        with open('testfile.gml', 'w') as f:
            f.write(response)

        popen = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,shell=True)
        output,error =popen.communicate()
        print(error)
        print("--- %s seconds ---" % (time.time() - start_time))
       
        with open("testfile-out.graphml", 'r') as f:
            gml=f.read()
            gml.replace('Creator "ogdf::GraphIO::writeGML"',"")

        output=convertGraph(gml)
      
    return HttpResponse(output)


def getCommandParameter(request):
    if request.method == 'POST':
        name = json.loads(request.body)


        #search for the specific binary name in the DB
        binary = Command.objects.get(name=name)  
       
        #get parameters from DB as an object
        parameters= CommandParameter.objects.filter(command=binary.id)
        data = list(parameters.values())
        

        #jsonString = json.dumps(data)
    
        return JsonResponse(data,safe=False)
    
def getSampleGraph(request):
    if request.method == 'POST':
        name = json.loads(request.body)
        with open("sample_graphs/"+ name +".txt", 'r') as f:
            graphString=f.read()
    return JsonResponse({"data":graphString})

