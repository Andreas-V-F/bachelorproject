import {parse} from "./TextParser.js";

export function initiateTextualHandler(){
    let div = document.createElement("div")
    document.body.append(div)
    let parseText = document.createElement("textarea")
    parseText.setAttribute("id", "parse")
    let parseButton = document.createElement("button")
    parseButton.onclick = function(){
        parse()
    }
    div.append(parseText)
    div.append(parseButton)
}
export function updateTextarea(updatedText){
    document.getElementById("parse").textContent = updatedText
}