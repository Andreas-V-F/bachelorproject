import Tool from './Tool.js';
import { parseToSPARQL } from './VisualParser.js';

var width = 1000;
var height = 900;
var simulation;
var styleSheet;
var svg;
var currentTool = 0;
var tools = [];
var selectedNodes = [];
var selectedLinks = [];

//intialize data
var graph = {
    nodes: [
        { name: "Alice", bound: true },
        { name: "Bob", bound: true },
        { name: "Chen", bound: false },
        { name: "Dawg", bound: true },
        { name: "Ethan", bound: true },
        { name: "George", bound: true },
        { name: "Frank", bound: false },
        { name: "Hanes", bound: true }
    ],
    links: [
        { source: "Alice", target: "Bob", value: "corsti" },
        { source: "Chen", target: "Bob", value: "corsti2" },
        { source: "Dawg", target: "Chen", value: "corsti3" },
        { source: "Hanes", target: "Frank", value: "corsti4" },
        { source: "Hanes", target: "George", value: "corsti5" },
        { source: "Dawg", target: "Ethan", value: "corsti6" }
    ]
};

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
    styleSheet.insertRule(".links line {stroke-opacity: 1;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".nodes circle {stroke: #fff;stroke-width: 1.5px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".nodes circle {stroke: #fff;stroke-width: 1.5px;}", styleSheet.cssRules.length);
    styleSheet.insertRule("text {-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".nodeText {pointer-events: none; fill: white}")
}

function initCanvas(div) {
    let toolbar = document.createElement("div");
    div.appendChild(toolbar);

    initTools(toolbar);

    //initilize svg or grab svg
    svg = d3.select(div).append("svg")
        .attr("height", height)
        .attr("width", width)
        .attr("viewBox", [0, 0, width, height])
        .attr("cursor", "crosshair")
        .on("click", clicked);

    draw();
}

function initTools(toolbar) {
    let img = document.createElement("img");
    img.src = "./resources/toolbarpics/mouse_pointer.png";
    let name = "Edit";
    img.setAttribute("title", "" + name);
    let t = new Tool(img, name, tools.length);
    tools.push(t);

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/circle.png";
    name = "Add node";
    img.setAttribute("title", "" + name);
    t = new Tool(img, name, tools.length);
    tools.push(t);

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/arrow.png";
    name = "Connect nodes";
    img.setAttribute("title", "" + name);
    t = new Tool(img, name, tools.length);
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

export function setTool(toolID) {
    tools[currentTool].img.removeAttribute("class")
    currentTool = toolID;
    tools[currentTool].img.setAttribute("class", "selectedImage")
    //deselectNodes();
    //deselectArrows();
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
        addNode(input.value, checkbox.checked);
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
        appendLink(selectedNodes[0], selectedNodes[1], input.value);
        input.value = "";
    }


    arrowDiv.setAttribute("id", "arrowDiv");
    p.textContent = "Predicate: ";

    arrowDiv.appendChild(p);
    arrowDiv.appendChild(input);
    arrowDiv.appendChild(button);
    return arrowDiv;
}

function draw() {
    svg.selectAll("*").remove();
    simulation = d3
        .forceSimulation(graph.nodes)
        .force(
            "link",
            d3
                .forceLink()
                .id(function (d) {
                    return d.name;
                }).distance(200)
                .links(graph.links)
        )
        .force("boundary", forceBoundary(0, 0, width, height))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide(90))
        .on("tick", ticked);

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("id", function (d) {
            return "linkID" + d.index;
        })
        .attr("stroke-width", function (d) {
            return 3;
        })
        .attr("stroke", "#999")
        .on("click", function (d) {
            lineClick(d);
        });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .on("click", function (d) {
            circleClick(d);
        })
        .attr("r", 25)
        .attr("id", function (d) {
            return "circleID" + d.index;
        })
        .attr("fill", function (d) {
            return "red";
        })
        .call(
            d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
        );

    var texts = svg.append("g")
        .attr("class", "nodeText")
        .selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text").text(d => d.name)
        .attr("text-anchor", "middle")

    var linkTexts = svg.append("g")
        .attr("class", "linkText")
        .selectAll(".link_label")
        .data(graph.links)
        .enter()
        .append("text")
        .on("click", function (d) {
            lineClick(d);
        })
        .style("text-anchor", "middle")
        .style("dominant-baseline", "central")
        .attr("class", "shadow")
        .text(function (d, i) {
            return d.value;
        });


    function ticked() {

        texts.attr("x", d => d.x);
        texts.attr("y", d => d.y);

        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });

        linkTexts.attr("x", function (d, i) {
            let p = (d.source.x + d.target.x) / 2
            return p;
        })
            .attr("y", function (d) {
                return (d.source.y + d.target.y) / 2
            })
    }

    for(let i = 0; i<graph.nodes.length; i++){
        if(graph.nodes[i].bound){
            svg.select("#circleID" + i).attr("fill", "blue");
        }
    }
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    console.log(graph);
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function clicked(event) {
    if (currentTool == 1) {
        document.getElementById("popUp").style.display = "block";
        document.getElementById("arrowDiv").style.display = "none";
        document.getElementById("nodeDiv").style.display = "block";
    }
}

function addNode(inputName, inputBound) {
    graph.nodes.push({ name: inputName, bound: inputBound })
    console.log(graph);
    draw();
}

export function appendParsedElements() {

}

function circleClick(node) {
    if (currentTool == 0) {
        edit(node)
    }
    if (currentTool == 2) {
        addLink(node)
    }
}

function lineClick(link) {
    if (currentTool == 0) {
        if (selectedLinks.includes(link)) {
            deselectLink(link);
            return;
        }
        selectLink(link);
    }
}

function edit(node) {
    if (selectedNodes.includes(node)) {
        deselectNode(node);
        return;
    }
    selectNode(node);
}

function addLink(node) {
    if (selectedNodes.includes(node)) {
        deselectNode(node)
        return;
    }

    if (selectedNodes.length < 2) {
        selectNode(node);
    }

    if (selectedNodes.length == 2) {
        document.getElementById("popUp").style.display = "block";
        document.getElementById("nodeDiv").style.display = "none";
        document.getElementById("arrowDiv").style.display = "block";
    }
}

function appendLink(node1, node2, value) {
    graph.links.push({ source: node1.name, target: node2.name, value })
    deselectNodes();
    draw();
}

function selectNode(node) {
    svg.select("#circleID" + node.index).attr("fill", "black");
    selectedNodes.push(node);
}

function deselectNode(node) {
    svg.select("#circleID" + node.index).attr("fill", "red");
    selectedNodes.splice(selectedNodes.indexOf(node), 1);
}

function deselectNodes() {
    for (let i = 0; i < selectedNodes.length; i++) {
        deselectNode(selectedNodes[i]);
        i--;
    }
}

function removeNode(node) {
    graph.nodes.splice(graph.nodes.indexOf(node), 1);
    removeLinkFromNode(node);
}

function selectLink(link) {
    svg.select("#linkID" + link.index).attr("stroke", "black").attr("stroke-width","6");
    selectedLinks.push(link);
}

function deselectLink(link) {
    svg.select("#linkID" + link.index).attr("stroke", "#999").attr("stroke-width","3");
    selectedLinks.splice(selectedLinks.indexOf(link), 1);
}

function removeLink(link) {
    graph.links.splice(graph.links.indexOf(link), 1);
}

function removeLinkFromNode(node) {

    for (let i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source == node || graph.links[i].target == node) {
            graph.links.splice(i, 1);
            i--;
        }
    }
}

function initEventListeners() {
    document.addEventListener('keydown', (event) => {
        if (event.key == 'Delete') {
            for (let i = 0; i < selectedNodes.length; i++) {
                removeNode(selectedNodes[i]);
            }
            for (let i = 0; i < selectedLinks.length; i++) {
                removeLink(selectedLinks[i]);
            }
            selectedNodes = [];
            selectedLinks = [];
            draw();
        }
    })
}