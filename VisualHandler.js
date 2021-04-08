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
var type = "SELECT";
var prefixes = [];
var selected = [];

window.onclick = function (event) {
    let popUp = document.getElementById("popUp");
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
    styleSheet.insertRule("#circleText { pointer-events: none; } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".selectedNode { stroke: white; fill: grey} ", styleSheet.cssRules.length);
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
    let name = "Edit";
    img.setAttribute("title", "" + name);
    let t = new Tool(img, name, tools.length);
    t.toDo = function (evt) {
        console.log("Edit tool");
    }
    tools.push(t);

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/circle.png";
    name = "Add node";
    img.setAttribute("title", "" + name);
    t = new Tool(img, name, tools.length);
    t.toDo = function () {
        document.getElementById("popUp").style.display = "block";
        document.getElementById("arrowDiv").style.display = "none";
        document.getElementById("nodeDiv").style.display = "block";
    }
    tools.push(t);

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/arrow.png";
    name = "Connect nodes";
    img.setAttribute("title", "" + name);
    t = new Tool(img, name, tools.length);
    t.toDo = function () {
    }
    tools.push(t);

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/tempParseButton.png";
    name = "Parse";
    img.setAttribute("title", "" + name);
    t = new Tool(img, name, tools.length);
    t.toDo = function () {
        updateTextualView();
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
    div.setAttribute("id", "popUp");

    let innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "formcontent");

    let close = document.createElement("span");
    close.setAttribute("class", "close");
    close.textContent = "×"
    close.onclick = function () {
        document.getElementById("popUp").style.display = "none";
    }

    innerDiv.appendChild(close);

    let nodePop = nodePopUp();
    innerDiv.appendChild(nodePop);

    let arrowPop = arrowPopUp();
    innerDiv.appendChild(arrowPop);

    div.appendChild(innerDiv);

    document.body.append(div);

}

function nodePopUp() {
    let formDiv = document.createElement("div");
    let input = document.createElement("input");
    let p = document.createElement("p");
    let title = document.createElement("p");
    let checkbox = document.createElement("input");
    let button = document.createElement("button");

    formDiv.setAttribute("id", "nodeDiv");
    input.setAttribute("type", "text");
    title.textContent = "Variable name:";
    p.textContent = "Bounded:";
    checkbox.setAttribute("type", "checkbox");
    button.textContent = "Submit";
    button.onclick = function () {
        document.getElementById("popUp").style.display = "none";
        nodeCreationUI(input.value, checkbox.checked);
        input.value = "";
        checkbox.checked = false;
    }

    formDiv.appendChild(title);
    formDiv.appendChild(input);
    formDiv.appendChild(document.createElement("br"));
    formDiv.appendChild(p);
    formDiv.appendChild(checkbox);
    formDiv.appendChild(document.createElement("br"));
    formDiv.appendChild(button);
    return formDiv;
}

function arrowPopUp() {
    let arrowDiv = document.createElement("div");
    let input = document.createElement("input");
    let p = document.createElement("p");
    let button = document.createElement("button");

    button.textContent = "Submit";
    button.onclick = function () {
        document.getElementById("popUp").style.display = "none";
        arrowCreationUI(nodeExists(new Node(selected[0].id,"","",""),nodes), nodeExists(new Node(selected[1].id,"","",""),nodes), input.value);
        deselectNodes();
        input.value = "";
    }


    arrowDiv.setAttribute("id", "arrowDiv");
    p.textContent = "Predicate: ";

    arrowDiv.appendChild(p);
    arrowDiv.appendChild(input);
    arrowDiv.appendChild(button);
    return arrowDiv;
}

function nodeCreationUI(text, isBounded) {

    let node = new Node(text, isBounded, posX, posY);

    if (text[0] != "?" && !text.includes(":")) {
        node.variableName = "?" + text;
    }

    if (nodeExists(node, nodes)) {
        alert("Variable already exists")
        return;
    }

    nodeCreation(node);
    nodes.push(node);

}

function nodeCreation(node) {

    //rewrite so node positions are random, not hitting other objects. or maybe follows some sort of tree structure?

    if (node.posX == 0 && node.posY == 0) {
        node.posX = Math.floor(Math.random() * width);
        node.posY = Math.floor(Math.random() * height);
    }

    let svg = node.drawNode();

    for (let i = 0; i < svg.length; i++) {
        let element = svg[i];
        svgElement.appendChild(element);
    }

}

function arrowCreationUI(nodeOne, nodeTwo, text) {
    let arrow = new Arrow(nodeOne, nodeTwo, text);
    if(arrowExists(arrow)){
        return;
    }
    arrowCreation(arrow);
    arrows.push(arrow);
}

function arrowCreation(arrow) {
    let svg = arrow.drawArrow();
    for (let i = 0; i < svg.length; i++) {
        let element = svg[i];
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
    deselectNodes();
}

export function appendParsedElements(parsedNodes, parsedArrows, ty, pref) {
    //REMINDER: doesnt check if already existing node has changed properties other than name
    prefixes = pref;
    type = ty;

    for (let i = 0; i < parsedNodes.length; i++) {
        let node = nodeExists(parsedNodes[i], nodes);
        if (node == null) {
            nodeCreation(parsedNodes[i]);
            nodes.push(parsedNodes[i]);
        } else {
            updateArrows(node, parsedArrows);
        }
    }

    let tempArray = [];

    for (let i = 0; i < nodes.length; i++) {
        if (nodeExists(nodes[i], parsedNodes) == null) {
            tempArray.push(nodes[i]);
            nodes.splice(i, 1);
            i--;
        }
    }

    for (let i = 0; i < tempArray.length; i++) {
        deleteNode(tempArray[i]);
    }

    for(let i = 0; i < arrows.length; i++){
        deleteArrow(arrows[i]);
    }
    arrows = [];

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

function deleteNode(node) {
    for (let i = 0; i < node.svg.length; i++) {
        svgElement.removeChild(node.svg[i]);
    }
}

function deleteArrow(arrow){
    for (let i = 0; i < arrow.svg.length; i++) {
        svgElement.removeChild(arrow.svg[i]);
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
        } else if (node.variableName == ar[i].nodeTwo.variableName) {
            ar[i].nodeTwo = node;
        }
    }

}

function updateTextualView() {
    parseToSPARQL(arrows, type, prefixes);
}

export function nodeClicked(circle) {
    if (currentTool == 1 || currentTool == 3) {
        return;
    }

    if (currentTool == 2) {
        if (selected.includes(circle)) {
            deselectNode(circle);
            return;
        }
        if (selected.length < 2) {
            circle.setAttribute("class", "selectedNode");
            circle.setAttribute("r", "6.5%")
            selected.push(circle);
        }
        if (selected.length == 2) {
            document.getElementById("popUp").style.display = "block";
            document.getElementById("nodeDiv").style.display = "none";
            document.getElementById("arrowDiv").style.display = "block";
        }
    }

}

function deselectNodes() {
    for (let i = 0; i < selected.length; i++) {
        deselectNode(selected[i]);
        i--;
    }
}

function deselectNode(circle) {
    circle.removeAttribute("class");
    circle.setAttribute("r", "6%")
    selected.splice(selected.indexOf(circle), 1);
}
