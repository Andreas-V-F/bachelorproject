import {updateTextarea} from "./TextualHandler.js";

export function parseToSPARQL(text){
    return PARSER.parse(text)
}
export function returnToText(sparql) {

    let outputText = ""
    for (let i = 0; i < sparql.listOfPrefixes.length; i++) {
        outputText += "PREFIX " + sparql.listOfPrefixes[i][0].name + " " + "<" + sparql.listOfPrefixes[i][0].link + ">\n"
    }
    outputText += sparql.type
    for (let i = 0; i < sparql.boundVariables.length; i++) {
        outputText += " " + sparql.boundVariables[i]
    }
    outputText += "\nWHERE {\n"
    for (let i = 0; i < sparql.triples.length; i++) {
        outputText += "   " + sparql.triples[i].subject + " " + sparql.triples[i].predicate + " " + sparql.triples[i].object + " .\n"
    }
    outputText += "}"

    updateTextarea(outputText)
}


