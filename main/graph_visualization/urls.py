from django.contrib import admin
from django.urls import path
from .views import *
from django.views.generic import TemplateView
urlpatterns = [
    path('', home, name="home"),
    path('graph/', graphPage, name="graph"),
    path('graph3d/', graphPage3D, name="graph3d"),
    path('graph/json-editor/', JsonEditor, name="editor"),
    path('about/', About, name="about"),
    path('manual/', Manual, name="manual"),
    path('about/license.txt', TemplateView.as_view(template_name='graph_visualization/license.txt',content_type='text/plain')),

    #API
    path('graph/api/gml/', exportGML, name="gmlApi"),
    path('graph/api/graph6/', exportG6, name="g6Api"),
    path('graph/api/graphml/', exportGraphML, name="graphml"),
    path('graph/api/gexf/', exportGexf, name="gexf"),
    path('graph/api/edgelist/', exportEdgelist, name="edgelist"),
    path('graph/api/adjacency/', exportAdjacencyList, name="adjacency"),
    path('graph/api/sparse6/', exportSparse6, name="sparse6"),
    path('graph/api/dot/', exportDot, name="dot"),
    path('graph/api/modify/', modifyAPI, name="modify"),
    path('graph/api/newGraph/', LoadNewContent, name="LoadNewContent"),
    path('graph/api/parameters/', getCommandParameter, name="params"),
    path('api/sample-graph/',getSampleGraph,name="sampleGraph"),
]
