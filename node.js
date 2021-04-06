export default class Node{

    variableName;
    isBounded;
    posX;
    posY;
    svg = [];
    //color;
    //id;

    constructor(variableName, isBounded, posX, posY){
        this.variableName = variableName;
        this.isBounded = isBounded;
        this.posX = posX;
        this.posY = posY;
    }

    

}