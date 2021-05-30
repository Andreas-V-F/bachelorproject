import {parse} from "./TextParser.js";

let height = "200px"
let width = "400px"
export function initiateTextualHandler(){
    let div = document.createElement("div")
    div.style.float = "left"
    div.style.marginLeft = "200px"
    div.style.marginTop = "100px"
    document.body.append(div)
    let parseText = document.createElement("textarea")
    parseText.setAttribute("id", "parse")
    parseText.textContent = "SELECT\nWHERE {\n}"
    parseText.style.resize = "none"
    parseText.style.height = height
    parseText.style.width = width
    parseText.onchange = function (){
        parse()
    }
    let parseButton = document.createElement("button")
    parseButton.textContent = "Parse"
    parseButton.onclick = function(){
        parse(document.getElementById("parse").value)
    }
    let errorConsole = document.createElement("textarea")
    errorConsole.setAttribute("id", "errorConsole")
    errorConsole.readOnly = true
    errorConsole.style.height = height
    errorConsole.style.width = width
    div.append(parseText)
    div.append(document.createElement("br"))
    div.append(parseButton)
    div.append(document.createElement("br"))
    div.append(errorConsole)
}

export function updateTextarea(updatedText){
    document.getElementById("parse").value = updatedText
}

export function printErrors(errors){
    document.getElementById("errorConsole").value = ""
    for(let i = 0; i < errors.length; i++){
        document.getElementById("errorConsole").value += (errors[i] + "\n")
    }

}