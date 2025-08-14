$(document).ready( function () {

  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });


  window.keysPressed = {};

  document.addEventListener('keydown', function(event){
    
    window.keysPressed[event.key] = true;
   
    
  });

  document.addEventListener('keyup', (event) => {

    if (window.keysPressed["Escape"] && window.keysPressed["v"]) {
      deselectAllNodes();
    }
    if (window.keysPressed["Escape"] && window.keysPressed["e"]) {
      deselectAllLinks();
    }
    if (window.keysPressed['Delete'] ) {
      deleteAllNodesAndEdges();
    }
    if (window.keysPressed['Escape'] && !window.keysPressed["v"] && !window.keysPressed["e"]) {
      deselectAll();
      
    }
    
    window.keysPressed={};
 });
  
  //used on the main page for the upload file field
  var dropFileForm = document.getElementById("dropFileForm");
  var fileLabelText = document.getElementById("fileLabelText");
  var uploadStatus = document.getElementById("uploadStatus");
  var fileInput = document.getElementById("fileInput");
  var droppedFiles;
  
  
});


function overrideDefault(event) {
  event.preventDefault();
  event.stopPropagation();
}

const saveFileToLocalStorage=(event)=>{
  event.preventDefault();  
  droppedFiles =event.dataTransfer?event.dataTransfer.files[0] : event.target.files[0];
  showFiles(droppedFiles)
  let formData = new FormData();
  formData.append("file",droppedFiles);
  FetchAndSaveToLocalStorage(formData)
  $("#fileInput").val("");
}
function addFiles(event) {
  event.preventDefault();  
  droppedFiles =event.dataTransfer?event.dataTransfer.files[0] : event.target.files[0];

  //var data = $('#dropFileForm').serializeArray().reduce(function(obj, item) {
  //  obj[item.name] = item.value;
  //  return obj;
  //}, {});
  //console.log(data)
  //console.log(droppedFiles)
  //console.log(typeof dropFileForm)
  //let formData = new FormData();
  //formData.set("firstName", "John");
  //formData.append("csrftokenn",data['csrftoken'])
  //console.log(formData.getAll())
  showFiles(droppedFiles)
  let formData = new FormData();
  formData.append("file",droppedFiles)
  renderNewFile(formData)
  //$("#fileInput")[0].files[0]= droppedFiles
  
  //$("#dropFileForm").submit();
  //$("#fileInput").val("");
}

function showFiles(files) {
  if (files.length > 1) {
    fileLabelText.innerText = files.length + " files selected";
  } else {
    fileLabelText.innerText = files.name;
  }
}


const deselectAll=()=>{
  window.selectedNodes.clear();
  window.selectedLinks.clear();
  window.Graph.nodeCanvasObjectMode(() => "after")
              .nodeCanvasObject((node, ctx, globalScale) =>window.nodePaint(node, ctx, globalScale))
              .linkCanvasObjectMode(() => "after")
              .linkCanvasObject((link, ctx,globalScale) => drawLink(link, ctx,globalScale))
}
const deselectAllNodes=()=>{
  window.selectedNodes.clear();
  window.Graph.nodeCanvasObjectMode(() => "after")
              .nodeCanvasObject((node, ctx, globalScale) =>window.nodePaint(node, ctx, globalScale))
}

const deselectAllLinks=()=>{
  window.selectedLinks.clear();
  window.Graph.linkCanvasObjectMode(() => "after")
              .linkCanvasObject((link, ctx,globalScale) => drawLink(link, ctx,globalScale))
}


//add all event listeners for the sidebar and navbar after the graph is rendered
const addEventListeners=()=> {
  ///////////////////////EVENT LISTENERS//////////////////////////////////////////////


  //zoom event listener
  $('#zoomInput').on('input', () => {
    window.Graph.zoom(document.getElementById("zoomInput").value, 1000);
  });

  //vertex-labels
  $("#vertex-labels").on("click", () => {
    window.Graph.nodeCanvasObjectMode(() => "after")
                .nodeCanvasObject((node, ctx, globalScale) =>window.nodePaint(node, ctx, globalScale))
  })

  //link curvature event listener
  document.getElementById('linkCurveInput').addEventListener('input', () => {
    let value = document.getElementById('linkCurveInput').value;
    window.Graph.linkCurvature(parseFloat(value));
  });

  //link width event listener
  document.getElementById('edgeWidthInput').addEventListener('input', () => {
    let value = document.getElementById('edgeWidthInput').value;
    window.Graph.linkWidth(link => link.graphics.lineWidth = parseFloat(value));
  });

  //node radius
  document.getElementById('nodeRadiusInput').addEventListener('input', () => {
    let value = document.getElementById('nodeRadiusInput').value;
    window.Graph.nodeVal(node => node.graphics.lineWidth = value);
  });

  //graph interaction event listener
  document.getElementById('interaction').addEventListener('input', () => {
    let value = document.getElementById('interaction').checked;

    window.Graph.enablePointerInteraction(value);
  });

  //link visibility
  document.getElementById('edge-visibility').addEventListener('input', () => {
    let value = document.getElementById('edge-visibility').checked;
    window.Graph.linkVisibility(value);
  });
  //particles 
  //document.getElementById('particles').addEventListener('input', () => {
  //  let value = document.getElementById('particles').checked;
  //  value ? window.Graph.linkDirectionalParticles(1) : window.Graph.linkDirectionalParticles(0);
  //});

  //bg color event listener
  document.getElementById('bgcolor').addEventListener('input', () => {
    let value = document.getElementById('bgcolor').value;
    window.Graph.backgroundColor(value);
  });

  //force collide event listener
  document.getElementById('force-collideInput').addEventListener('input', () => {
    let value = document.getElementById('force-collideInput').value;
    window.Graph.d3Force('collide', d3.forceCollide(parseFloat(value)))
      .d3ReheatSimulation();
  });
  //node-attraction event listener
  document.getElementById('node-attractionInput').addEventListener('input', () => {
    let value = document.getElementById('node-attractionInput').value;
    window.Graph.d3Force('charge', d3.forceManyBody().strength(parseInt(value)))
      .d3ReheatSimulation();


  });

  //link-distance event listener
  document.getElementById('link-distanceInput').addEventListener('input', () => {
    let value = document.getElementById('link-distanceInput').value;
    let { nodes, links } = Graph.graphData();
    window.Graph.d3Force('link', d3.forceLink(links).distance(parseInt(value)).strength(2))
      .d3ReheatSimulation();

  });

  //nodes color event listener
  document.getElementById('nodes-color').addEventListener('input', () => {
    let value = document.getElementById('nodes-color').value;
    window.Graph.nodeColor(node => node.graphics.fill = value);
  });

  //edge color event listener
  document.getElementById('edges-color').addEventListener('input', () => {
    let value = document.getElementById('edges-color').value;
    window.Graph.linkColor(link => link.graphics.fill = value);
  });


  //Zoom to fit graph event listener
  document.getElementById('fit-graph').addEventListener('click', () => {
    window.Graph.zoomToFit(1000, 70, node => true);
  });

  document.getElementById("gml").addEventListener('click', () => {
    sendData('/api/graph/gml',"graph.gml");
  })
  document.getElementById("g6").addEventListener('click', () => {
    sendData('/api/graph/graph6',"graph.g6");
  })
  

  // aplly parameter button(from modal) event listener
  $("#applyParam").click(() => {
    let selectedCommand = $("#command").children("option:selected").val();
    let keys = []
    let values = []
    let parameters = {}
    //check if radial layout else send params to the server
    if (selectedCommand === "radialLayout") {

      $('#values input').each(
        function (index) {
          var input = $(this);
          values.push(input.val())
          //alert('Type: ' + input.attr('type') + 'Name: ' + input.attr('name') + 'Value: ' + input.val());
        });
      //values[0] will be the radius

      window.setRadialLayout(values[0])
    } else {
      //get all parameters for the command
      $('#keys div').each(
        function (index) {
          var div = $(this);
          keys.push(div.text())
          //alert('Type: ' + input.attr('type') + 'Name: ' + input.attr('name') + 'Value: ' + input.val());
        });

      $('#values input').each(
        function (index) {
          var input = $(this);
          values.push(input.val())
          //alert('Type: ' + input.attr('type') + 'Name: ' + input.attr('name') + 'Value: ' + input.val());
        });
      for (i in keys) {
        parameters[keys[i]] = values[i]
      }

      let selectedCommand = $("#command").children("option:selected").val();
      modify(selectedCommand, parameters);
    }
  });

  //command change event listener
  $("#command").change(() => {

    let selectedCommand = $("#command").children("option:selected").val();

    //modal reference
    let modal = $("#parameterModal");
    let key_container = $("#keys")
    let value_container = $("#values")

    //check if command is the radial layout....else send request to the server
    if (selectedCommand === "radialLayout") {
      modal.find('.modal-title').text("Parameters for command: " + selectedCommand).end()

      //delete parameters of previous command
      key_container.empty()
      value_container.empty()
      //append labels
      $('<span>').attr({
        class: 'col-form-label',
      }).text("Keys").appendTo(key_container);

      $('<div>').attr({
        class: 'col-form-label',
      }).text("Values").appendTo(value_container);

      //append key-values
      $('<div>').attr({
        class: 'col-form-label',
      }).text("radius").appendTo(key_container);

      $('<input>').attr({
        class: 'form-control',
        value: 50
      }).appendTo(value_container);

      modal.modal("show");

    } else {

      //get command parameters api
      let data = getCommandParameters(selectedCommand);

      data.then((output) => {
        //open modal and populate with the key value pairs
        modal.find('.modal-title').text("Parameters for command: " + selectedCommand).end()

        //delete parameters of previous command
        key_container.empty()
        value_container.empty()
        //append labels
        $('<span>').attr({
          class: 'col-form-label',
        }).text("Keys").appendTo(key_container);

        $('<div>').attr({
          class: 'col-form-label',
        }).text("Values").appendTo(value_container);

        output.map((item) => {

          //append key-values
          $('<div>').attr({
            class: 'col-form-label',

          }).text(item.key).appendTo(key_container);

          $('<input>').attr({
            class: 'form-control',
            value: item.value
          }).appendTo(value_container);

        })
        modal.modal("show");
      })

    }
  });


  //fixed nodes event listener
  document.getElementById('fixed-nodes').addEventListener('input', () => {
    let value = document.getElementById('fixed-nodes').checked;
    window.Graph.onNodeDragEnd(node => {
      if (value == true) {
        node.fx = node.x;
        node.fy = node.y;
      } else {
        delete node.fx;
        delete node.fy;
      }
    });
    
  });

  //fixed nodes event listener
  document.getElementById('fixed-nodes-all').addEventListener('input', () => {
    let value = document.getElementById('fixed-nodes-all').checked;
    let { nodes, links } = window.Graph.graphData()

    if (value == true) {
      nodes.forEach((node) => {
        node.fx = node.x;
        node.fy = node.y;
      })
    } else {
      nodes.forEach((node) => {
        delete node.fx;
        delete node.fy;
      })

    }
    Graph.graphData({ nodes: nodes, links: links })
    setTimeout(function(){window.Graph.zoomToFit(1000, 250, node => true) }, 200);
  });



}


function sendData(URL,name) {
  
  let data = removeUnwantedData()

  fetch(URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => response.json())
    .then((data) => {
      download(name, data.data);
    });
}

const getGraphData=(URL)=>{
  
  let data = removeUnwantedData()
  
  fetch(URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => response.json())
    .then((data) => {
      window.localStorage.removeItem('graphData');
      $("#shareInput").val(window.location.origin + "/graph/?g6="+data.data)
    });

}
const copyText=()=>{
  let copyText = document.getElementById("shareInput");
  copyText.select();
  ///copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
}
const file_changed= (event)=>{
  let files=event.target.files
  let f = files[0]
  

}

const FetchAndSaveToLocalStorage=(formData)=>{
  fetch('/api/graph/newGraph', {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: formData
  }).then(response => response.json())
    .then((data) => {
      data=data.data
      localStorage.setItem('graphData',data)
      //check if it needs to redirect to 3D or 2D view
      
      $("#2DFile").is(":checked")?(
      window.location.href= window.location.origin +"/graph/"
      ):(
      window.location.href = window.location.origin +"/graph3d/"  
      )
    });
}

const renderNewFile=(formData)=>{

  fetch('/api/graph/newGraph', {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: formData
  }).then(response => response.json())
    .then((data) => {
      data=JSON.parse(data.data)
      visualize(data)
      setTimeout(function(){window.Graph.zoomToFit(1000, 250, node => true) }, 200);
    });

}


function modify(cmd, parameters) {
  let data = removeUnwantedData();
  data.cmd = cmd;
  data.parameters = parameters
  fetch('/api/graph/modify', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => response.json())
    .then((data) => {
      visualize(data)
      setTimeout(function(){window.Graph.zoomToFit(1000, 250, node => true) }, 200);
    });
}




function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/vnd.gml;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);


}

const getCommandParameters = async (cmd) => {
  const formData = new FormData();
  formData.append('name', cmd);

  let data = await fetch('/api/graph/parameters', {
    method: 'POST',
    body: formData
  }).then(response => response.json())
    .then((data) => {
      return data
    });

  return data
}

const generateShareLink= ()=>{
  getGraphData('/api/graph/graph6')
}

const openKeyBindingsModal=()=>{
  $("#KeyBindingsModal").modal()
}

const getSampleGraphFromServer = async (name) =>{
  const formData = new FormData();
  formData.append('name', name);

  let data = await fetch('/api/sample-graph', {
    method: 'POST',
    body: formData
  }).then(response => response.json())
    .then((data) => {
      return data
    });

  return data

}



const loadSampleGraph =async (val) =>{
  let textArea =$("textarea[name='text']");
  textArea.val("");
  let data;
  switch(val) {
      case "1":
        //console.log("Cubic Girth5");
        textArea.val("IsP@PGXD_");
        break;
      case "2":
        //console.log("Snark");
        textArea.val("Q?hY@eOGG??B_??@g???T?a??@g");
        break;
      case "3":
          //console.log("Tree ");
          textArea.val("S?????????????_?K?A_?B?AA?GBA?A|?");
        break;
      default:
        data = await  getSampleGraphFromServer(val)
        textArea.val(data.data)
    }

}

const removeUnwantedData=()=>{
  let { nodes, links } = window.Graph.graphData();
  nodes.forEach(node=>{ 
    delete node.links
    delete node.neighbors
  })
  console.log(nodes)
    return {nodes, links}
}