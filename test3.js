var width = 1000;
var height = 900;
var simulation;

//initilize svg or grab svg
let svg = d3.select("body").append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("cursor", "crosshair")
    .on("click", clicked);

//intialize data
var graph = {
    nodes: [
        { name: "Alice" },
        { name: "Bob" },
        { name: "Chen" },
        { name: "Dawg" },
        { name: "Ethan" },
        { name: "George" },
        { name: "Frank" },
        { name: "Hanes" }
    ],
    links: [
        { source: "Alice", target: "Bob" },
        { source: "Chen", target: "Bob" },
        { source: "Dawg", target: "Chen" },
        { source: "Hanes", target: "Frank" },
        { source: "Hanes", target: "George" },
        { source: "Dawg", target: "Ethan" }
    ]
};

function draw() {
    svg.selectAll("*").remove();
    simulation = d3
        .forceSimulation(graph.nodes)
        .force(
            "link",
            d3
                .forceLink()
                .id(function (d) {
                    return d.name;
                }).distance(20)
                .links(graph.links)
        )
        .force("boundary", forceBoundary(0,0,width, height))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    var link = svg
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function (d) {
            return 3;
        });

    var node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", function (d) {
            return "red";
        })
        .call(
            d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
        );

    var texts = svg.append("g")
        .selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text").text(d => d.name)
        .attr("class", "noselect")

    function ticked() {

        texts.attr("x", d => d.x);
        texts.attr("y", d => d.y);

        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
    }
}

draw();



function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function clicked(event) {
    graph.nodes.push({ name: "cor" })
    console.log(graph)
    draw();
}