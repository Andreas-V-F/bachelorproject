var width = 1000;
var height = 900;
var styleSheet;
var svgElement;
var nodes = [];
var tools = [];
var posX;
var posY;
var currentTool = 0;

window.addEventListener('load', (event) => {
    initiate();
});

function initiate() {
    styleRules();

    let div = document.createElement("div");
    document.body.append(div);

    initCanvas(div);

    onClick();
}

function styleRules() {
    let styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    styleSheet = styleElement.sheet;
    styleSheet.insertRule("svg { background-color: #F3F0F0; display: block; margin: auto } ", styleSheet.cssRules.length);
    styleSheet.insertRule("img { border: 1px solid #ddd; border-radius: 4px; -ms-user-select: none; -moz-user-select: none; -webkit-user-select: none; user-select: none;} ", styleSheet.cssRules.length);
    styleSheet.insertRule("div { text-align:center } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".image { display: inline-block } ", styleSheet.cssRules.length);
}

function initCanvas(div) {
    let toolbar = document.createElement("div");
    div.appendChild(toolbar);

    initTools(toolbar);

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", "" + height + "");
    svg.setAttribute("width", "" + width + "");
    svg.setAttribute("viewBox", "0 0 " + width + "" + width + "");
    div.appendChild(svg);
    svgElement = svg;
}

function initTools(toolbar) {
    let img = document.createElement("img");
    img.src = "./resources/toolbarpics/mouse_pointer.png";
    img.setAttribute("title", "Edit");
    let t = new tool(img, tools.length);
    t.toDo = function(){
        console.log("idiot");
    }
    tools.push(t);

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/circle.png";
    img.setAttribute("title", "Add node");
    t = new tool(img, tools.length);
    t.toDo = function(){
        console.log("fuck af");
    }
    tools.push(t);

    for(let i = 0; i<tools.length; i++){
        let image = tools[i].img;
        let div = document.createElement("div");
        div.setAttribute("class", "image");
        image.setAttribute("width", "50");
        image.setAttribute("height", "50");
        image.setAttribute("onclick", "setTool("+i+")");
        div.appendChild(image);
        toolbar.appendChild(div);
    }

}

function nodeCreation(text) {
    let size = 50;

    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute("cx", "" + posX + "");
    circle.setAttribute("cy", "" + posY + "");
    circle.setAttribute("r", "" + size + "");
    circle.setAttribute("stroke", "green")
    circle.setAttribute("fill", "blue");
    svgElement.appendChild(circle);

    var name = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    name.setAttribute("x", "" + posX + "");
    name.setAttribute("y", "" + posY + "");
    name.setAttribute('fill', 'white');
    name.setAttribute("text-anchor", "middle");
    name.textContent = text;
    svgElement.appendChild(name);

}

function onClick() {
    svgElement.addEventListener('mousedown', (event) => {
        if (event.button == 0) {
            let point = svgElement.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            point = point.matrixTransform(svgElement.getScreenCTM().inverse());
            posX = point.x;
            posY = point.y;
            tools[currentTool].toDo();
        }
    })
}

function setTool(toolID) {
    currentTool = toolID;
}