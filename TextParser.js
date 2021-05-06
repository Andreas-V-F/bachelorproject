import {updateTextarea} from "./TextualHandler.js";

export function returnToText(sparql) {
    let outputText = ""
    for (let i = 0; i < sparql.prefixes.length; i++) {
        outputText += "PREFIX " + sparql.prefixes[i][0] + " " + "<" + sparql.prefixes[i][1] + ">\n"
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


