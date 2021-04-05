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
        //should return AN ARROW not just the path. Probably returns and array of SVGs
        //OR REMOVE THIS METHOD AND INCLUDE IT IN VISUALHANDLER!!!
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d","M " + this.nodeOne.posX + " " + this.nodeOne.posY + " L " + this.nodeTwo.posX + " " + this.nodeTwo.posY);
        path.setAttribute("stroke","black");
        path.setAttribute("stroke-width","3");
        return path;
    }

    get nodeNames(){
        let nodeNames = [];
        nodeNames.push(this.nodeOne.variableName);
        nodeNames.push(this.nodeTwo.variableName);
    }

}