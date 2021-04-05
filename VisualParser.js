function parse(SPARQL) {
    appendParsedElements(nodeArray(SPARQL.triples, SPARQL.unboundVariables), arrowArray(triples));
}

function arrowArray(triples) {
    let arrows = [];
    for (let i = 0; i < triples.length; i++) {
        arrows.push(new Arrow(triple[i].subject, triple[i].object, triple[i].predicate));
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

function testMethod(){
    console.log("zzz");
}