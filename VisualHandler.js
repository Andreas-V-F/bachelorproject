class VisualHandler {

    width;
    height;
    styleSheet;
    svgElement;
    nodes = [];
    posX;
    posY;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.initiate();
    }

    initiate() {
        this.styleRules();
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("height", "" + this.height + "");
        svg.setAttribute("width", "" + this.width + "");
        svg.setAttribute("viewBox", "0 0 " + this.width + "" + this.width + "");
        document.body.append(svg);
        this.svgElement = svg;
        this.onRightClick();
    }

    styleRules() {
        var styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        this.styleSheet = styleElement.sheet;
        this.styleSheet.insertRule("svg { background-color: #F3F0F0; display: block; margin: auto } ", this.styleSheet.cssRules.length);
    }

    nodeCreation() {
        var size = 25;
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute("cx", ""+ this.posX +"");
        circle.setAttribute("cy", ""+ this.posY +"");
        circle.setAttribute("r",  ""+ size +"");
        circle.setAttribute("stroke", "green")
        circle.setAttribute("fill", "blue");
        this.svgElement.appendChild(circle);
    }

    onRightClick(){
        this.svgElement.addEventListener('mousedown', (event) => {
            if(event.button == 2){
                let point = this.svgElement.createSVGPoint();
                point.x = event.clientX; 
                point.y = event.clientY; 
                point = point.matrixTransform(this.svgElement.getScreenCTM().inverse());
                this.posX = point.x;
                this.posY = point.y;
                console.log("Point x = " + this.posX + ", Point y = " + this.posY);
                this.nodeCreation();
            }
        })
    }


}