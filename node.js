class Node{

    variableName;
    isBounded;
    posX;
    posY;
    //color;
    //id;

    constructor(variableName, isBounded, posX, posY){
        this.variableName = variableName;
        this.isBounded = isBounded;
        this.posX = posX;
        this.posY = posY;
    }

    get posX(){
        return this.posX;
    }

    get posY(){
        return this.posY;
    }

    get variableName(){
        return this.variableName;
    }

    get isBounded(){
        return this.isBounded;
    }


}