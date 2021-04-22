import {checkErrors, updateTextarea} from "./TextualHandler.js";
import SPARQL from "./sparql.js";
import Triple from "./Triple.js";
import { parseToVisual } from "./VisualParser.js"

let indexOf = (arr, q) => arr.findIndex(item => q.toLowerCase() === item.toLowerCase());


export function parse() {
    let parsePrefixes = []
    let parseTriples = []
    let parseType = ""
    let parseBoundVariables = []
    let errors = []

    let s = document.getElementById("parse").value;
    let t = s.split(" ").join("\n").split("\n")
    t = arrayRemove(t, "")
    t = t.map(function (el) {
        return el.trim();
    });

    if (t[0].toLowerCase() === "prefix") {
        t = arrayRemove(t, "PREFIX")
        let indexOfSelect = indexOf(t, "select")
        if (indexOfSelect < 1){
            errors.push("Missing SELECT statement")
        }
        for (let i = 0; i < indexOfSelect/2; i++) {
            let prefix = t.shift().replace("<", "").replace(">", "")
            if(!(prefix.split(":")[0].length > 0)) {
                errors.push("Missing name of prefix #" + (i + 1))
            }
            if(!(prefix.split(":")[1] === "") ){
                errors.push("Text after colon in prefix #" + (i + 1))
            }
            let prefixLink = t.shift().replace("<", "").replace(">", "")
            if(!prefixLink.includes("http")){
                errors.push("Invalid link in prefix #" + (i+1))
            }
            let temp = [prefix, prefixLink]
            parsePrefixes.push(temp)
        }
    }
    parseType = t.shift().toUpperCase()
    let indexWhere = indexOf(t, "where")
    if(indexWhere < 1){
        errors.push("Missing WHERE statement")
    }
    for (let i = 0; i < indexWhere; i++) {
        let boundVariable = t.shift()
        if(!boundVariable.includes("?")){
            errors.push("Missing ? in bound variable #" + (i+1))
        }
        parseBoundVariables[i] = boundVariable
    }
    let indexOfLeftB = indexOf(t, "{")
    if(indexOfLeftB !== 1 ){
        errors.push("Unknown character in between WHERE and {")
    }
    t = t.slice(indexOfLeftB+1)
    t = arrayRemove(t, ".")
    let indexOfRightB = indexOf(t, "}")
    for (let i = 0; i < indexOfRightB; i += 3) {
        parseTriples[i / 3] = new Triple(t.shift(), t.shift(), t.shift())
    }
    console.log(parseTriples)
    if(errors.length === 0){
        parseToVisual(new SPARQL(parseTriples, parseType, parseBoundVariables, parsePrefixes))
    }
    checkErrors(errors)
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
        outputText += "   " + sparql.triples[i].subject + " " + sparql.triples[i].predicate + " " + sparql.triples[i].object + " .\n"
    }
    outputText += "}"

    updateTextarea(outputText)
}


