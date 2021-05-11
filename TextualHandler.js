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
    parseButton.textContent = "Run"
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
    try {
        var entry = PARSER.parse(text);
        console.log(entry)
        parseToVisual(entry)
        document.getElementById("errorConsole").value = "Parse success!!!"
        $('#parse').highlightTextarea('destroy')
        highlightWord(text, "?name")
        highlightWord(text, "?x")
        for(let i = 0; i < entry.unboundVariables.length; i++){
            $("#parse").highlightTextarea({
                words: [{color: "#FF0F00",  words: [].push(entry.unboundVariables[i].name)}]
            });
            console.log("test")
        }
    } catch (err) {
            var start
            var end
            console.log(err)
            if(err.location.start.offset + findWordLength(text, err.location.start.offset) >= text.length){
            start = text.length - 2
            end = text.length - 1
            }
            else if(err.found === "\n") {
                start = err.location.start.offset -1
                end = err.location.start.offset + findWordLength(text, err.location.start.offset) + 2
            } else
            {
                start = err.location.start.offset
                end = err.location.start.offset + findWordLength(text, err.location.start.offset)
                if(start === end){
                    end+=1
                }
            }

            document.getElementById("errorConsole").value = "Line " + err.location.start.line + "," + " column " + err.location.start.column + ": " + err
            $('#parse').highlightTextarea('destroy')
            $("#parse").highlightTextarea({
                color: "#FF0000",
            ranges: [[start, end]]
            });
    }
    document.getElementById("parse").focus()

}

function findWordLength(text, index){
    return text.substring(index).split(" ").join("\n").split("\n")[0].length
}

function highlightWord(text, word){
    var indexOflast = -1
    var ranges = []
    while((indexOflast = text.indexOf(word, indexOflast+1)) >= 0){
        var range = [indexOflast, indexOflast + findWordLength(text, indexOflast)]
        ranges.push(range)
    }
    $("#parse").highlightTextarea({
        ranges: {
            color:'#ADF0FF',
            ranges: ranges
        }
    });
}


