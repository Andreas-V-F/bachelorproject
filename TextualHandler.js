import "./grammar.js"
import {parseToVisual} from "./VisualParser.js";



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
    parseText.spellcheck = false
    parseText.onchange = function (){
        parse()
    }
    let parseButton = document.createElement("button")
    parseButton.textContent = "Parse"
    parseButton.onclick = function(){
        parse()
    }
    let errorConsole = document.createElement("textarea")
    errorConsole.setAttribute("id", "errorConsole")
    errorConsole.readOnly = true
    errorConsole.style.height = height
    errorConsole.style.width = width
    errorConsole.style.resize = "none"
    div.append(parseText)
    div.append(document.createElement("br"))
    div.append(parseButton)
    div.append(document.createElement("br"))
    div.append(errorConsole)


}
export function updateTextarea(updatedText){
    document.getElementById("parse").value = updatedText
}

export function checkErrors(errors){
    document.getElementById("errorConsole").value = ""
    for(let i = 0; i < errors.length; i++){
        document.getElementById("errorConsole").value += (errors[i] + "\n")
    }
}

function parse()
{
    var text =  document.getElementById("parse").value
    var ss = document.styleSheets[0]
    try {
        var entry = PARSER.parse(text);
        console.log(entry)
        parseToVisual(entry)
        document.getElementById("errorConsole").value = "Parse success!!!"
        if ("insertRule" in ss) {
            if(ss.rules.length > 0){
                ss.deleteRule(0)
            }
            ss.insertRule('::selection { background: dodgerblue; color: white }', 0);
        }
    } catch (err) {
            console.log(err)
            document.getElementById("errorConsole").value = "Line " + err.location.start.line + "," + " column " + err.location.start.column + ": " + err
            var textarea = document.getElementById("parse")
            if ("insertRule" in ss) {
                if(ss.rules.length > 0){
                    ss.deleteRule(0)
                }
            ss.insertRule('::selection { background: red; color: black}', 0);
            }
            textarea.focus();
            textarea.setSelectionRange(err.location.start.offset, err.location.end.offset);
        }
}