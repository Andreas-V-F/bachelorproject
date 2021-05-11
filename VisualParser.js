import { appendParsedElements } from './VisualHandler.js';
import Node from './Node.js';
import Arrow from './Arrow.js';
import { returnToText} from "./TextParser.js";
import SPARQL from './sparql.js';
import Triple from './Triple.js';

export function parseToVisual(spq) {

<<<<<<< Updated upstream
    let nArray = nodeArray(spq.triples, spq.unboundVariables);
    let aArray = arrowArray(nArray, spq.triples, spq.prefixes);

    appendParsedElements(nArray, aArray, spq.type, spq.prefixes);
=======
    var graph = {
        nodes: [
        ],
        links: [
        ]
    };

    let newGraph = fillGraph(graph, spq)

    appendParsedElements(newGraph, spq.type, spq.listOfPrefixes);
>>>>>>> Stashed changes
}

function arrowArray(nArray, triples) {
    let arrows = [];
    for (let i = 0; i < triples.length; i++) {
        arrows.push(new Arrow(getNode(nArray, triples[i].subject), getNode(nArray, triples[i].object), triples[i].predicate));
    }
    return arrows;
}

function nodeArray(triples, unboundVariables) {
    let nodes = [];
    for (let i = 0; i < triples.length; i++) {
        let isBounded = isBoundedVariable(triples[i].subject, unboundVariables);
        nodes.push(new Node(triples[i].subject, isBounded, 0, 0));
        isBounded = isBoundedVariable(triples[i].object, unboundVariables);
        nodes.push(new Node(triples[i].object, isBounded, 0, 0));
    }
    return nodes;
}

function isBoundedVariable(variable, unboundVariables) {
    if (unboundVariables.includes(variable)) {
        return false;
    }
    return true;
}

function getNode(nodeArray, variable) {
    for (let i = 0; i < nodeArray.length; i++) {
        if (nodeArray[i].variableName == variable) {
            return nodeArray[i];
        }
    }
}

export function parseToSPARQL(arrows, type, prefixes) {

    let triples = [];
    let boundVariables = [];

    for(let i = 0; i<arrows.length; i++){
        triples.push(new Triple(arrows[i].nodeOne.variableName, arrows[i].predicate, arrows[i].nodeTwo.variableName));
        if(arrows[i].nodeOne.isBounded){
            if(!boundVariables.includes(arrows[i].nodeOne.variableName)){
                boundVariables.push(arrows[i].nodeOne.variableName);
            }
        } 
        if(arrows[i].nodeTwo.isBounded){
            if(!boundVariables.includes(arrows[i].nodeTwo.variableName)){
                boundVariables.push(arrows[i].nodeTwo.variableName);
            }
        }
    }

    let spql = new SPARQL(triples, type, boundVariables, prefixes);
    returnToText(spql);
}