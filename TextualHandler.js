import {parse} from "./TextParser.js";

export function initiateTextualHandler(){
    let div = document.createElement("div")
    document.body.append(div)
    let parseText = document.createElement("textarea")
    parseText.setAttribute("id", "parse")
    parseText.textContent = "SELECT\nWHERE {\n}"
    parseText.style.resize = "none"
    parseText.style.height = "200px"
    parseText.style.width = "400px"
    parseText.onchange = function (){
        parse()
    }
    let parseButton = document.createElement("button")
    parseButton.textContent = "Parse"
    parseButton.onclick = function(){
        parse()
    }
    div.append(parseText)
    div.append(parseButton)
}
export function updateTextarea(updatedText){
    document.getElementById("parse").value = updatedText
}