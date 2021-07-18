

//link Curve
var linkSlider = document.getElementById("linkCurveInput");
var curve = document.getElementById("linkCurve");

curve.innerHTML = linkSlider.value; // Display the default slider value

linkSlider.oninput = function() {
    curve.innerHTML = this.value;
}
//link width
var edgeWidthSlider = document.getElementById("edgeWidthInput");
var width = document.getElementById("edgeWidth");

width.innerHTML=edgeWidthSlider.value

edgeWidthSlider.oninput = function() {
    width.innerHTML = this.value;
}
//node radius
var nodeRadiusSlider = document.getElementById("nodeRadiusInput");
var radius = document.getElementById("nodeRadius");

radius.innerHTML=nodeRadiusSlider.value
nodeRadiusSlider.oninput = function() {
    radius.innerHTML = this.value;
}

//force collide
var forceCollideSlider = document.getElementById("force-collideInput");
var collide = document.getElementById("force-collide");

collide.innerHTML=forceCollideSlider.value
forceCollideSlider.oninput = function() {
    collide.innerHTML = this.value;
}

//link-distance
var linkDistanceSlider = document.getElementById("link-distanceInput");
var linkDistance = document.getElementById("link-distance");

linkDistance.innerHTML=linkDistanceSlider.value
linkDistanceSlider.oninput = function() {
    linkDistance.innerHTML = this.value;
}

//node-attraction
var nodeAttractionSlider = document.getElementById("node-attractionInput");
var nodeAttraction = document.getElementById("node-attraction");

nodeAttraction.innerHTML=nodeAttractionSlider.value
nodeAttractionSlider.oninput = function() {
    nodeAttraction.innerHTML = this.value;
}





const putImage = () =>{
    let canvasColor=document.getElementById("bgcolor").value;
    let canvas = document.querySelector('#graph canvas');
    let context = canvas.getContext("2d");
    
    context.save();
    context.globalAlpha=1;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.filter = "none";
    // fill transparent pixels with bgColor
   context.globalCompositeOperation = "destination-over";
   context.fillStyle = canvasColor;
   context.fillRect(0, 0, context.canvas.width, context.canvas.height);

   // cleanup
   context.restore();
   let dataURL = canvas.toDataURL('image/jpg',1.0);
    
    var a = document.createElement("a"); //Create <a>
    a.href = dataURL; //Image Base64 Goes here
    a.download = "Graph.jpg"; //File name Here
    a.click(); //Downloaded file
}
//prepare data for jsonEditor window
const SaveData = () =>{
    let data = window.Graph.graphData();
    data.links.forEach((link)=>{
        link.source=link.source.id;
        link.target=link.target.id;
        delete link.__indexColor;
        delete link.__controlPoints
        })
    data.nodes.forEach((node)=>{
        delete node.__indexColor;
        delete node.vx;
        delete node.vy;
    });
    
    localStorage.setItem('graphData', JSON.stringify(removeUnwantedData()));
    window.location = window.location.origin+"/graph/json-editor/"
}


