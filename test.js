import {printSPARQL} from "./TextualHandler.js";

export function overLoadTextualParser(){
    let text = ""
    let prefixText = ""
    for(let i = 0; i < 100; i++){
        prefixText += "PREFIX " + Math.random().toString(36).substr(2, 5) + ": " + "https://" + Math.random().toString(36).substr(2, 5) + "." + Math.random().toString(36).substr(2, 5) + "\n"
    }
    text += prefixText + "SELECT\nWHERE {\n"
    let tripleText = ""
    for(let i = 0; i < 100; i++){
        tripleText += "?test" + " " + Math.random().toString(36).substr(2, 5) + " ?" + Math.random().toString(36).substr(2, 5) + " .\n"
    }
    text += tripleText + "}"
    printSPARQL(text)
}

