import Arrow from './Arrow.js';
import Tool from './Tool.js';
import Node from './Node.js';
import { parseToSPARQL } from './VisualParser.js';

var width = 1000;
var height = 900;
var styleSheet;
var svgElement;
var tools = [];
var nodes = [];
var arrows = [];
var posX;
var posY;
var currentTool = 0;
var popUp;
var type = "SELECT";
var prefixes = [[]];

window.onclick = function (event) {
    if (event.target == popUp) {
        popUp.style.display = "none";
    }
}

export function initiate() {

    styleRules();

    let div = document.createElement("div");
    document.body.append(div);

    initCanvas(div);

    createPopUp();

    onClick();

    setTool(currentTool);
}

function styleRules() {
    let styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    styleSheet = styleElement.sheet;
    styleSheet.insertRule("svg { background-color: #F3F0F0; display: block; margin: auto } ", styleSheet.cssRules.length);
    styleSheet.insertRule("img { border: 1px solid #ddd; border-radius: 4px; } ", styleSheet.cssRules.length);
    styleSheet.insertRule("div { text-align:center; -ms-user-select: none; -moz-user-select: none; -webkit-user-select: none; user-select: none } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".image { display: inline-block } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".form { display: none; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4) } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".formcontent { background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 20% } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".close { color: #aaaaaa; float: right; font-size: 28px; font-weight: bold;} ", styleSheet.cssRules.length);
    styleSheet.insertRule(".close:hover,.close:focus { color: #000; text-decoration: none; cursor: pointer} ", styleSheet.cssRules.length);
    styleSheet.insertRule(".selectedImage { border: 2px solid blue; } ", styleSheet.cssRules.length);
}

function initCanvas(div) {
    let toolbar = document.createElement("div");
    div.appendChild(toolbar);

    initTools(toolbar);

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", "" + height + "");
    svg.setAttribute("width", "" + width + "");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height + "");
    svg.setAttribute("id", "svgCanvas");
    div.appendChild(svg);
    svgElement = svg;
}

function initTools(toolbar) {
    let img = document.createElement("img");
    img.src = "./resources/toolbarpics/mouse_pointer.png";
    img.setAttribute("title", "Edit");
    let t = new Tool(img, tools.length);
    t.toDo = function (evt) {
        console.log("Edit tool");
    }
    tools.push(t);

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/circle.png";
    img.setAttribute("title", "Add node");
    t = new Tool(img, tools.length);
    t.toDo = function () {
        popUp.style.display = "block";
        document.getElementById("arrowDiv").style.display = "none";
        document.getElementById("nodeDiv").style.display = "block";
    }
    tools.push(t);

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/arrow.png";
    img.setAttribute("title", "Connect nodes");
    t = new Tool(img, tools.length);
    t.toDo = function () {



        //popUp.style.display = "block";
        //document.getElementById("nodeDiv").style.display = "none";
        //document.getElementById("arrowDiv").style.display = "block";
        //arrowCreationUI(nodes[0], nodes[1], "arrow!!!");
    }
    tools.push(t);

    for (let i = 0; i < tools.length; i++) {
        let image = tools[i].img;
        let div = document.createElement("div");
        div.setAttribute("class", "image");
        image.setAttribute("width", "50");
        image.setAttribute("height", "50");
        image.setAttribute("onclick", "setTool(" + i + ")");
        div.appendChild(image);
        toolbar.appendChild(div);
    }

}

function createPopUp() {
    let div = document.createElement("div");
    div.setAttribute("class", "form");

    let innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "formcontent");

    let close = document.createElement("span");
    close.setAttribute("class", "close");
    close.textContent = "×"
    close.onclick = function () {
        popUp.style.display = "none";
    }

    innerDiv.appendChild(close);
    
    let nodePop = nodePopUp();
    innerDiv.appendChild(nodePop);

    let arrowPop = arrowPopUp();
    innerDiv.appendChild(arrowPop);

    div.appendChild(innerDiv);

    document.body.append(div);

    popUp = div;

}

function nodePopUp(){
    let formDiv = document.createElement("div");
    let input = document.createElement("input");
    let p = document.createElement("p");
    let checkbox = document.createElement("input");
    let button = document.createElement("button");

    formDiv.setAttribute("id","nodeDiv");
    input.setAttribute("type", "text");
    input.setAttribute("value", "variable name");
    p.textContent = "Bounded: ";
    checkbox.setAttribute("type", "checkbox");
    button.textContent = "Submit";
    button.onclick = function () {
        popUp.style.display = "none";
        nodeCreationUI(input.value, checkbox.checked);
        input.value = "";
        checkbox.checked = false;
    }

    formDiv.appendChild(input);
    formDiv.appendChild(document.createElement("br"));
    formDiv.appendChild(p);
    formDiv.appendChild(checkbox);
    formDiv.appendChild(document.createElement("br"));
    formDiv.appendChild(button);
    return formDiv;
}

function arrowPopUp(){
    let arrowDiv = document.createElement("div");
    let input = document.createElement("input");
    let p = document.createElement("p");


    arrowDiv.setAttribute("id","arrowDiv");
    p.textContent = "Bounded: ";

    arrowDiv.appendChild(p);
    return arrowDiv;
}

function nodeCreationUI(text, isBounded) {

    let svg = [];

    if (text[0] != "?" && !text.includes(":")) {
        text = "?" + text;
    }

    if(nodeExists(new Node(text, "", "", ""), nodes)){
        alert("Variable already exists")
        return;
    }

    let radius = 50;

    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute("cx", "" + posX + "");
    circle.setAttribute("cy", "" + posY + "");
    circle.setAttribute("r", "" + radius + "");
    circle.setAttribute("stroke", "green")
    circle.setAttribute("fill", "blue");
    svgElement.appendChild(circle);
    svg.push(circle);

    let name = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    name.setAttribute("x", "" + posX + "");
    name.setAttribute("y", "" + posY + "");
    name.setAttribute('fill', 'white');
    name.setAttribute("text-anchor", "middle");
    name.textContent = text;
    svgElement.appendChild(name);
    svg.push(name);

    let node = new Node(text, isBounded, posX, posY);
    nodes.push(node);

    node.svg = svg;

}

function nodeCreation(node) {

    //rewrite so node positions are random, not hitting other objects. or maybe follows some sort of tree structure?

    let svg = [];

    let radius = 50;
    node.posX = Math.floor(Math.random() * width);
    node.posY = Math.floor(Math.random() * height);

    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute("cx", "" + node.posX + "");
    circle.setAttribute("cy", "" + node.posY + "");
    circle.setAttribute("r", "" + radius + "");
    circle.setAttribute("stroke", "green")
    circle.setAttribute("fill", "blue");
    svgElement.appendChild(circle);
    svg.push(circle)

    let name = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    name.setAttribute("x", "" + node.posX + "");
    name.setAttribute("y", "" + node.posY + "");
    name.setAttribute('fill', 'white');
    name.setAttribute("text-anchor", "middle");
    name.textContent = node.variableName;
    svgElement.appendChild(name);
    svg.push(name);
    
    node.svg = svg;

}

function arrowCreationUI(nodeOne, nodeTwo, text) {
    let arrow = new Arrow(nodeOne, nodeTwo, text);
    for(let i = 0; i<arrow.drawArrow().length; i++){
        let element = arrow.drawArrow()[i];
        svgElement.appendChild(element);
    }
    arrows.push(arrow);
}

function arrowCreation(arrow) {
    for(let i = 0; i<arrow.drawArrow().length; i++){
        let element = arrow.drawArrow()[i];
        svgElement.appendChild(element);
    }
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
            tools[currentTool].toDo(event);
        }
    })
}

export function setTool(toolID) {
    tools[currentTool].img.removeAttribute("class")
    currentTool = toolID;
    tools[currentTool].img.setAttribute("class", "selectedImage")
}

export function appendParsedElements(parsedNodes, parsedArrows, ty, pref) {
    //REMINDER: doesnt check if already existing node has changed properties other than name
    prefixes = pref;
    type = ty;

    for (let i = 0; i < parsedNodes.length; i++) {
        let node = nodeExists(parsedNodes[i],nodes);
        if (node == null) {
            nodeCreation(parsedNodes[i]);
            nodes.push(parsedNodes[i]);
        } else {
            updateArrows(node, parsedArrows);
        }
    }

    let tempArray = [];

    for (let i = 0; i < nodes.length; i++) {
        if(nodeExists(nodes[i], parsedNodes) == null){
            tempArray.push(nodes[i]);
            nodes.splice(i,1);
            i--;
        }
    }

    for(let i = 0; i<tempArray.length; i++){
        deleteNode(tempArray[i]);
    }

    for (let i = 0; i < parsedArrows.length; i++) {
        if (!arrowExists(parsedArrows[i])) {
            arrowCreation(parsedArrows[i]);
            arrows.push(parsedArrows[i]);
        }
    }

}

function nodeExists(node, nodeArray) {
    for (let i = 0; i < nodeArray.length; i++) {
        if (node.variableName == nodeArray[i].variableName) {
            return nodeArray[i];
        }
    }
    return null;
}

function deleteNode(node){
    for(let i = 0; i<node.svg.length; i++){
        svgElement.removeChild(node.svg[i]);
    }
}

function arrowExists(arrow) {
    for (let i = 0; i < arrows.length; i++) {
        if (arrow.nodeOne.variableName != arrows[i].nodeOne.variableName) {
            continue;
        } else if (arrow.nodeTwo.variableName == arrows[i].nodeTwo.variableName) {
            return true;
        }
    }
    return false;
}

function updateArrows(node, ar) {
    for (let i = 0; i < ar.length; i++) {
        if (node.variableName == ar[i].nodeOne.variableName) {
            ar[i].nodeOne = node;
        } else if(node.variableName == ar[i].nodeTwo.variableName)
        {
            ar[i].nodeTwo = node;
        }
    }

}

function drawNodes(){
    for(let i = 0; i<nodes.length; i++){
        nodeCreation(nodes[i]);
    }
}

function drawArrows(){
    for(let i = 0; i<arrows.length; i++){
        arrowCreation(arrows[i]);
    }
}

function updateTextualView(){
    parseToSPARQL(arrows,type, prefixes);
}