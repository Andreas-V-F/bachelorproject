class VisualHandler {

    width;
    height;
    styleSheet;
    svgElement;

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
    }

    styleRules() {
        var styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        this.styleSheet = styleElement.sheet;
        this.styleSheet.insertRule("svg { background-color: #F3F0F0; display: block; margin: auto } ", this.styleSheet.cssRules.length);
    }

}