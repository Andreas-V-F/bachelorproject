import "./grammar.js"
import {parseToVisual} from "./VisualParser.js";



let height = "200px"
let width = "400px"
var stylesheetChanged = false
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

function parse()
{
    var text =  document.getElementById("parse").value
    var stylesheet = document.styleSheets[0]
    try {
        var entry = PARSER.parse(text);
        console.log(entry)
        parseToVisual(entry)
        document.getElementById("errorConsole").value = "Parse success!!!"
        console.log(stylesheet.rules)
        if ("insertRule" in stylesheet) {
            if(stylesheetChanged){
                stylesheet.deleteRule(stylesheet.rules.length-1)
            }
            stylesheetChanged = true
            stylesheet.insertRule('::selection { background: dodgerblue; color: white }', stylesheet.rules.length);
        }
    } catch (err) {
            console.log(err)
            document.getElementById("errorConsole").value = "Line " + err.location.start.line + "," + " column " + err.location.start.column + ": " + err
            var textarea = document.getElementById("parse")
            if ("insertRule" in stylesheet) {
                if(stylesheetChanged){
                    stylesheet.deleteRule(stylesheet.rules.length-1)
                }
                stylesheetChanged = true
            stylesheet.insertRule('::selection { background: red; color: black}', stylesheet.rules.length);
            }
            textarea.focus();
            textarea.setSelectionRange(err.location.start.offset, err.location.end.offset);
        }

}