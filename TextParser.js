import { updateTextarea } from "./TextualHandler.js";
import SPARQL from "./sparql.js";
import Triple from "./Triple.js";
import { parseToVisual } from "./VisualParser.js"

let indexOf = (arr, q) => arr.findIndex(item => q.toLowerCase() === item.toLowerCase());


export function parse() {

    let parsePrefixes = [[]]
    let parseTriples = []
    let parseType = ""
    let parseBoundVariables = []
    let s = document.getElementById("parse").value;
    let t = s.split(" ").join("\n").split("\n")
    t = arrayRemove(t, "")
    t = t.map(function (el) {
        return el.trim();
    });
    if (t[0].toLowerCase() === "prefix") {
        t = arrayRemove(t, "PREFIX")
        for (let i = 0; i < indexOf(t, "select"); i++) {
            parsePrefixes[i][0] = t.shift()
            parsePrefixes[i][1] = t.shift().replace("<", "").replace(">", "")
        }
    }
    parseType = t.shift().toUpperCase()
    let indexWhere = indexOf(t, "where")
    for (let i = 0; i < indexWhere; i++) {
        parseBoundVariables[i] = t.shift()
    }
    t = t.slice(2)
    t = arrayRemove(t, ".")
    let indexOfRightB = indexOf(t, "}")
    for (let i = 0; i < indexOfRightB; i += 3) {
        parseTriples[i / 3] = new Triple(t.shift(), t.shift(), t.shift())
    }
    parseToVisual(new SPARQL(parseTriples, parseType, parseBoundVariables, parsePrefixes))

}

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele.toLowerCase() !== value.toLowerCase()
    })
}

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
        outputText += "   " + sparql.triples[i].subject + " " + sparql.triples[i].predicate + " " + sparql.triples[i].object + ".\n"
    }
    outputText += "}"

    updateTextarea(outputText)
}
