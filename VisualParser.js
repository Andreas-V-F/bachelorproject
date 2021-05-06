import { appendParsedElements } from './VisualHandler.js';
import { returnToText } from "./TextParser.js";
import SPARQL from './sparql.js';
import Triple from './Triple.js';

export function parseToVisual(spq) {

    console.log(spq);

    var graph = {
        nodes: [
        ],
        links: [
        ]
    };

    let newGraph = fillGraph(graph, spq)

    appendParsedElements(newGraph, spq.type, spq.prefixes);
}

function fillGraph(graph, spq) {

    for (let i = 0; i < spq.boundVariables.length; i++) {
        graph.nodes.push({ name: spq.boundVariables[i], bound: true })
    }

    for (let i = 0; i < spq.unboundVariables.length; i++) {
        graph.nodes.push({ name: spq.unboundVariables[i], bound: false })
    }

    for (let i = 0; i < spq.triples.length; i++) {
        graph.links.push({ source: spq.triples[i].subject, target: spq.triples[i].object, value: spq.triples[i].predicate })
    }

    return graph;
}

export function parseToSPARQL(links, type, prefixes) {

    let triples = [];
    let boundVariables = [];

    for (let i = 0; i < links.length; i++) {
        triples.push(new Triple(links[i].source.name, links[i].value, links[i].target.name));
        if (links[i].source.bound) {
            if (!boundVariables.includes(links[i].source.name)) {
                boundVariables.push(links[i].source.name);
            }
        }
        if (links[i].target.bound) {
            if (!boundVariables.includes(links[i].target.name)) {
                boundVariables.push(links[i].target.name);
            }
        }
    }

    let spql = new SPARQL(triples, type, boundVariables, prefixes);
    returnToText(spql);
}