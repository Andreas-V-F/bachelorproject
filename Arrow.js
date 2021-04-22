export default class Arrow {

    nodeOne;
    nodeTwo;
    predicate;
    svg = [];
    id;

    constructor(nodeOne, nodeTwo, predicate) {
        this.nodeOne = nodeOne;
        this.nodeTwo = nodeTwo;
        this.predicate = predicate;
        this.id = Date.now;
    }

    drawArrow() {
        this.svg = [];

        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d", "M " + this.nodeOne.posX + " " + this.nodeOne.posY + " L " + this.nodeTwo.posX + " " + this.nodeTwo.posY);
        path.setAttribute("id","arrowPath:"+this.id)
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "3");
        this.svg.push(path);

        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute("id","arrowText:"+this.id);
        text.setAttribute("x", "" + (this.nodeOne.posX+this.nodeTwo.posX)/2 + "");
        text.setAttribute("y", "" + (this.nodeOne.posY+this.nodeTwo.posY)/2 + "");
        text.setAttribute('fill', 'red');
        text.setAttribute("text-anchor", "middle");
        text.textContent = this.predicate;
        this.svg.push(text);

        return this.svg;
    }
}