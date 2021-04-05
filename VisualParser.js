function parse(SPARQL) {

    let nArray = nodeArray(SPARQL.triples, SPARQL.unboundVariables);
    let aArray = arrowArray(nArray, SPARQL.triples);

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

function getNode(nodeArray, variable){
    for (let i = 0; i < nodeArray.length; i++) {
        if(nodeArray[i].variableName == variable){
            return nodeArray[i];
        }
    }
}

/*var bool = false;

window.onclick = function (event) {
    if (bool == false) {
        let tripleArray = [new Triple("?x", "foaf:name", "?name"), new Triple("?x", "foaf:mbox", "?mbox")]
        let boundVariablesArray = ["?name", "?mbox"]
        let prefixesArray = [["foaf", "url"]]
        let typeText = "SELECT"
        let sparqltest2 = new SPARQL(tripleArray, typeText, boundVariablesArray, prefixesArray)
        parse(sparqltest2);
        bool = true;
    }

}*/