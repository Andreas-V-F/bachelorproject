import {nodeClicked} from "./VisualHandler.js";

export default class Node {

    variableName;
    isBounded;
    posX;
    posY;
    svg = [];
    //color;
    //id;

    constructor(variableName, isBounded, posX, posY) {
        this.variableName = variableName;
        this.isBounded = isBounded;
        this.posX = posX;
        this.posY = posY;
    }

    drawNode() {

        let radius = "6%";

        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute("id","" + this.variableName);
        circle.setAttribute("cx", "" + this.posX + "");
        circle.setAttribute("cy", "" + this.posY + "");
        circle.setAttribute("r", "" + radius + "");
        circle.setAttribute("stroke", "green")
        circle.setAttribute("fill", "blue");
        circle.onclick = function (){
            nodeClicked(circle);
        }
        this.svg.push(circle)

        let name = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        name.setAttribute("id","circleText");
        name.setAttribute("x", "" + this.posX + "");
        name.setAttribute("y", "" + this.posY + "");
        name.setAttribute('fill', 'white');
        name.setAttribute("text-anchor", "middle");
        name.textContent = this.variableName;
        this.svg.push(name);

        return this.svg;
    }



}