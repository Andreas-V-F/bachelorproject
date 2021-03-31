var width = 1000;
var height = 900;
var styleSheet;
var svgElement;
var nodes = [];
var tools = [];
var posX;
var posY;
var currentTool = 0;
var popUp;

window.addEventListener('load', (event) => {
    initiate();
});

window.onclick = function (event) {
    if (event.target == popUp) {
        popUp.style.display = "none";
    }
}

function initiate() {
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
    styleSheet.insertRule("img { border: 1px solid #ddd; border-radius: 4px; -ms-user-select: none; -moz-user-select: none; -webkit-user-select: none; user-select: none} ", styleSheet.cssRules.length);
    styleSheet.insertRule("div { text-align:center } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".image { display: inline-block } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".svgtext { -ms-user-select: none; -moz-user-select: none; -webkit-user-select: none; user-select: none } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".form { display: none; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4) } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".formcontent { background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 20% } ", styleSheet.cssRules.length);
    styleSheet.insertRule(".close { color: #aaaaaa; float: right; font-size: 28px; font-weight: bold; -ms-user-select: none; -moz-user-select: none; -webkit-user-select: none; user-select: none} ", styleSheet.cssRules.length);
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
    svg.setAttribute("viewBox", "0 0 " + width + "" + width + "");
    div.appendChild(svg);
    svgElement = svg;
}

function initTools(toolbar) {
    let img = document.createElement("img");
    img.src = "./resources/toolbarpics/mouse_pointer.png";
    img.setAttribute("title", "Edit");
    let t = new tool(img, tools.length);
    t.toDo = function () {
        console.log("idiot");
    }
    tools.push(t);

    img = document.createElement("img");
    img.src = "./resources/toolbarpics/circle.png";
    img.setAttribute("title", "Add node");
    t = new tool(img, tools.length);
    t.toDo = function () {
        popUp.style.display = "block";
        if (text != null) {
            if (text[0] != "?") {
                text = "?" + text;
            }
            nodeCreation(text);
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

    let innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "formcontent");

    let close = document.createElement("span");
    close.setAttribute("class", "close");
    close.textContent = "×"
    close.onclick = function () {
        popUp.style.display = "none";
    }

    let p = document.createElement("p");
    p.textContent = "duh bruh!";

    innerDiv.appendChild(close);
    innerDiv.appendChild(p);
    div.appendChild(innerDiv);
    document.body.append(div);

    popUp = div;

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
    name.setAttribute("class", "svgtext");
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
    tools[currentTool].img.removeAttribute("class")
    currentTool = toolID;
    tools[currentTool].img.setAttribute("class", "selectedImage")
}