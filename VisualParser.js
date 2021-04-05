import { appendParsedElements } from './VisualHandler.js';
import Node from './Node.js';
import Arrow from './Arrow.js';
import { returnToText} from "./TextParser";
import SPARQL from './sparql.js';

export function parseToVisual(spq) {

    let nArray = nodeArray(spq.triples, spq.unboundVariables);
    let aArray = arrowArray(nArray, spq.triples);

    appendParsedElements(nArray, aArray);
}

function arrowArray(nArray, triples) {
    let arrows = [];
    for (let i = 0; i < triples.length; i++) {
        arrows.push(new Arrow(getNode(nArray, triples[i].subject), getNode(nArray, triples[i].object), getNode(nArray, triples[i].predicate)));
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

export function parseToSPARQL(nodes, arrows, type) {
    let triples = "";
    let boundVariables = "";
    let prefixes = "";
    let spql = new SPARQL(triples, type, boundVariables, prefixes);
    returnToText(spql);
}

/*export function testMethod() {
    let tripleArray = [new Triple("?x", "foaf:name", "?name"), new Triple("?x", "foaf:mbox", "?mbox")]
    let boundVariablesArray = ["?name", "?mbox"]
    let prefixesArray = [["foaf", "url"]]
    let typeText = "SELECT"
    let sparqltest2 = new SPARQL(tripleArray, typeText, boundVariablesArray, prefixesArray)
    parseToVisual(sparqltest2);
}*/