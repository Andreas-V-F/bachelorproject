import Tool from './Tool.js';
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
var selectedNodes = [];
var selectedArrows = [];

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

    initEventListeners();

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
    styleSheet.insertRule("#nodeText { pointer-events: none; } ", styleSheet.cssRules.length);
    styleSheet.insertRule("#arrowText { pointer-events: none; } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".selectedNode{ stroke: red; fill: grey} ", styleSheet.cssRules.length);
    styleSheet.insertRule(".selectedArrow{ stroke: red;} ", styleSheet.cssRules.length);
}

function initCanvas(div) {
    let toolbar = document.createElement("div");
    div.appendChild(toolbar);

    initTools(toolbar);


    let svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("cursor", "crosshair")

    svgElement = svg;
}

function initTools(toolbar) {
    let img = document.createElement("img");
    img.src = "./resources/toolbarpics/mouse_pointer.png";
    let name = "Edit";
    img.setAttribute("title", "" + name);
    let t = new Tool(img, name, tools.length);
    t.toDo = function (event) {
        let element = document.elementFromPoint(event.clientX, event.clientY);
        let str = element.id.split(":");
        if (event.button == 0) {
            if (element.id.includes("node")) {
                let node = getNodeByID(str[1]);
                if (selectedNodes.includes(node)) {
                    deselectNode(node);
                    return;
                }
                selectNode(str[1]);
                return;
            }
            if (element.id.includes("arrow")) {
                let arrow = getArrowByID(str[1]);
                if (selectedArrows.includes(arrow)) {
                    deselectArrow(arrow);
                    return;
                }
                selectArrow(str[1]);
            }
        }
    }
    tools.push(t);

    /*
    img = document.createElement("img");
    img.src = "./resources/toolbarpics/move.png";
    name = "Move node";
    img.setAttribute("title", "" + name);
    t = new Tool(img, name, tools.length);
    t.toDo = function (event) {
        console.log("move tool");
    }
    tools.push(t);*/

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/circle.png";
    name = "Add node";
    img.setAttribute("title", "" + name);
    t = new Tool(img, name, tools.length);
    t.toDo = function (event) {
        if (event.button == 0) {
            document.getElementById("popUp").style.display = "block";
            document.getElementById("arrowDiv").style.display = "none";
            document.getElementById("nodeDiv").style.display = "block";
        }
    }
    tools.push(t);

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/arrow.png";
    name = "Connect nodes";
    img.setAttribute("title", "" + name);
    t = new Tool(img, name, tools.length);
    t.toDo = function (event) {
        if (event.button == 0) {
            let element = document.elementFromPoint(event.clientX, event.clientY);
            if (!element.id.includes("node")) {
                return;
            }

            let str = element.id.split(":");
            let node = getNodeByID(str[1]);
            if (selectedNodes.includes(node)) {
                deselectNode(node);
                return;
            }

            if (selectedNodes.length < 2) {
                selectNode(str[1]);
            }

            if (selectedNodes.length == 2) {
                document.getElementById("popUp").style.display = "block";
                document.getElementById("nodeDiv").style.display = "none";
                document.getElementById("arrowDiv").style.display = "block";
            }

        }

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
        arrowCreationUI(selectedNodes[0], selectedNodes[1], input.value);
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

    if (text == "") {
        alert("Input a variablename");
        return;
    }

    let node = new Node(text, isBounded, posX, posY);

    if (text[0] != "?" && !text.includes(":")) {
        node.variableName = "?" + text;
    }

    if (nodeExists(node, nodes)) {
        alert("Variable already exists");
        return;
    }

    nodeCreation(node);
    nodes.push(node);

}

function nodeCreation(node) {

    deleteNode(node);

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
    if (arrowExists(arrow)) {
        return;
    }
    arrowCreation(arrow);
    arrows.push(arrow);
    deselectNodes();
    springLayout();
    updateTextualView();
}

function arrowCreation(arrow) {
    deleteArrow(arrow);
    let svg = arrow.drawArrow();
    for (let i = 0; i < svg.length; i++) {
        let element = svg[i];
        svgElement.appendChild(element);
    }
}

function initEventListeners() {
    svgElement.addEventListener('mousedown', (event) => {
        let point = svgElement.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        point = point.matrixTransform(svgElement.getScreenCTM().inverse());
        posX = point.x;
        posY = point.y;
        tools[currentTool].toDo(event);
    })

    document.addEventListener('keydown', (event) => {
        if (event.key == 'Delete') {
            for (let i = 0; i < selectedNodes.length; i++) {
                for (let x = 0; x < nodes.length; x++) {
                    if (selectedNodes[i].id == nodes[x].id) {
                        let arrowArray = getArrowsFromNode(nodes[x]);
                        for (let y = 0; y < arrowArray.length; y++) {
                            deleteArrow(arrowArray[y])
                            arrows.splice(arrows.indexOf(arrowArray[y]), 1)
                        }
                        deleteNode(nodes[x]);
                        nodes.splice(x, 1);
                        break;
                    }
                }
            }
            for (let i = 0; i < selectedArrows.length; i++) {
                for (let x = 0; x < arrows.length; x++) {
                    if (selectedArrows[i].id == arrows[x].id) {
                        deleteArrow(arrows[x]);
                        arrows.splice(x, 1);
                        break;
                    }
                }
            }
            selectedNodes = [];
            selectedArrows = [];
            updateTextualView();
            springLayout();
        }
    })

}

export function setTool(toolID) {
    tools[currentTool].img.removeAttribute("class")
    currentTool = toolID;
    tools[currentTool].img.setAttribute("class", "selectedImage")
    deselectNodes();
    deselectArrows();
}

export function appendParsedElements(parsedNodes, parsedArrows, ty, pref) {
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

    for (let i = 0; i < arrows.length; i++) {
        deleteArrow(arrows[i]);
    }
    arrows = [];

    for (let i = 0; i < parsedArrows.length; i++) {
        if (!arrowExists(parsedArrows[i])) {
            arrowCreation(parsedArrows[i]);
            arrows.push(parsedArrows[i]);
        }
    }

    springLayout();

}

function nodeExists(node, nodeArray) {
    for (let i = 0; i < nodeArray.length; i++) {
        if (node.variableName == nodeArray[i].variableName && node.isBounded == nodeArray[i].isBounded) {
            return nodeArray[i];
        }
    }
    return null;
}

function getArrowsFromNode(node) {
    let arrowArray = [];

    for (let i = 0; i < arrows.length; i++) {
        if (arrows[i].nodeOne.variableName == node.variableName || arrows[i].nodeTwo.variableName == node.variableName) {
            arrowArray.push(arrows[i])
        }
    }

    return arrowArray;
}

function deleteNode(node) {
    for (let i = 0; i < node.svg.length; i++) {
        svgElement.removeChild(node.svg[i]);
    }
}

function deleteArrow(arrow) {
    for (let i = 0; i < arrow.svg.length; i++) {
        svgElement.removeChild(arrow.svg[i]);
    }
}

function arrowExists(arrow) {
    for (let i = 0; i < arrows.length; i++) {
        if (arrow.nodeOne.variableName == arrows[i].nodeOne.variableName && arrow.nodeTwo.variableName == arrows[i].nodeTwo.variableName) {
            return true;
        }
        if (arrow.nodeOne.variableName == arrows[i].nodeTwo.variableName && arrow.nodeTwo.variableName == arrows[i].nodeOne.variableName) {
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

function selectNode(id) {
    let node = getNodeByID(id);
    let circle = svgElement.getElementById("nodeCircle:" + id);
    circle.setAttribute("class", "selectedNode");
    circle.setAttribute("r", "6.5%");
    selectedNodes.push(node);
}


function deselectNodes() {
    for (let i = 0; i < selectedNodes.length; i++) {
        deselectNode(selectedNodes[i]);
        i--;
    }
}

function deselectNode(node) {
    let circle = svgElement.getElementById("nodeCircle:" + node.id);
    circle.removeAttribute("class");
    circle.setAttribute("r", "6%")
    selectedNodes.splice(selectedNodes.indexOf(node), 1);
}

function selectArrow(id) {
    let arrow = getArrowByID(id);
    let path = svgElement.getElementById("arrowPath:" + id);
    path.setAttribute("class", "selectedArrow");
    path.setAttribute("stroke-width", "4")
    selectedArrows.push(arrow);
}


function deselectArrows() {
    for (let i = 0; i < selectedArrows.length; i++) {
        deselectArrow(selectedArrows[i]);
        i--;
    }
}

function deselectArrow(arrow) {
    let path = svgElement.getElementById("arrowPath:" + arrow.id);
    path.removeAttribute("class");
    path.setAttribute("stroke-width", "3");
    selectedArrows.splice(selectedArrows.indexOf(arrow), 1);
}

function getNodeByID(id) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id == id) {
            return nodes[i];
        }
    }
}

function getArrowByID(id) {
    for (let i = 0; i < arrows.length; i++) {
        if (arrows[i].id == id) {
            return arrows[i];
        }
    }
}

async function springLayout() {
    let delta = 0.1;
    let nodesWithArrows = [];
    for (let i = 0; i < nodes.length; i++) {
        if (getArrowsFromNode(nodes[i]).length > 0) {
            nodesWithArrows.push(nodes[i]);
        }
    }
    let globalForce = 1000;
    while (globalForce < -1 || globalForce > 1) {
        let tempGlobalForce = 0;
        for (let i = 0; i < nodesWithArrows.length; i++) {
            let forceX = 0;
            let forceY = 0;
            for (let j = 0; j < nodesWithArrows.length; j++) {
                if (nodesWithArrows[i].variableName == nodesWithArrows[j].variableName) {
                    continue;
                }

                let f = force(nodesWithArrows[i], nodesWithArrows[j])
                forceX += f[0];
                forceY += f[1];
            }
            tempGlobalForce = Math.abs(forceX) + Math.abs(forceY);
            nodesWithArrows[i].posX += delta * forceX;
            nodesWithArrows[i].posY += delta * forceY;
        }
        for (let i = 0; i < arrows.length; i++) {

            nodeCreation(arrows[i].nodeOne);
            nodeCreation(arrows[i].nodeTwo);
            arrowCreation(arrows[i]);
            await sleep(16);
        }
        globalForce = tempGlobalForce;
    }
}

function force(nodeOne, nodeTwo) {
    let c0 = 1;
    let c1 = 1;
    let l = 250;

    let distance = Math.abs(Math.sqrt(Math.pow(nodeOne.posX - nodeTwo.posX, 2) + Math.pow(nodeOne.posY - nodeTwo.posY, 2)));

    let differenceVectorX = nodeOne.posX - nodeTwo.posX;
    let differenceVectorY = nodeOne.posY - nodeTwo.posY;

    let unitVectorX = differenceVectorX / distance;
    let unitVectorY = differenceVectorY / distance;

    let forceZeroX = c0 * unitVectorX / Math.pow(distance, 2);
    let forceZeroY = c0 * unitVectorY / Math.pow(distance, 2);

    let forceOneX = 0;
    let forceOneY = 0;

    if (arrowExists(new Arrow(nodeOne, nodeTwo, ""))) {
        forceOneX = -c1 * (distance - l) * unitVectorX;
        forceOneY = -c1 * (distance - l) * unitVectorY;
    }

    let forceX = forceZeroX + forceOneX;
    let forceY = forceZeroY + forceOneY;

    return [forceX, forceY];
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}