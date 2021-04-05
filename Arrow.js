class Arrow{

    nodeOne;
    nodeTwo;
    text;
    //id;

    constructor(nodeOne, nodeTwo, text){
        this.nodeOne = nodeOne;
        this.nodeTwo = nodeTwo;
        this.text = text;
    }

    drawArrow(){
        //should return an array of SVGs instead of just path
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d","M " + this.nodeOne.posX + " " + this.nodeOne.posY + " L " + this.nodeTwo.posX + " " + this.nodeTwo.posY);
        path.setAttribute("stroke","black");
        path.setAttribute("stroke-width","3");
        return path;
    }
}