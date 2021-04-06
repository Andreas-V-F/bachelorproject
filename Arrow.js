export default class Arrow {

    nodeOne;
    nodeTwo;
    predicate;
    //id;

    constructor(nodeOne, nodeTwo, predicate) {
        this.nodeOne = nodeOne;
        this.nodeTwo = nodeTwo;
        this.predicate = predicate;
    }

    drawArrow() {

        let svg = [];

        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d", "M " + this.nodeOne.posX + " " + this.nodeOne.posY + " L " + this.nodeTwo.posX + " " + this.nodeTwo.posY);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "3");
        svg.push(path);

        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute("x", "" + (this.nodeOne.posX+this.nodeTwo.posX)/2 + "");
        text.setAttribute("y", "" + (this.nodeOne.posY+this.nodeTwo.posY)/2 + "");
        text.setAttribute('fill', 'red');
        text.setAttribute("text-anchor", "middle");
        text.textContent = this.predicate;
        svg.push(text);

        return svg;
    }
}