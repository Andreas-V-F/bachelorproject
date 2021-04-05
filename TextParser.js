let parsePrefixes = [[],[]]
let parseTriples = []
let parseType = ""
let parseBoundVariables = []
let parseUnboundVariables = []
let parseLiterals = []
/*
let indexOf = (arr, q) => arr.findIndex(item => q.toLowerCase() === item.toLowerCase());


function parse(){
    let s = document.getElementById("parse").value;
    let t = s.split(" ").join("\n").split("\n")
    t = arrayRemove(t, "")
    if(t[0].toLowerCase() === "prefix"){
        parseWithPrefix(t)
    }
    else {
        parseWithoutPrefix(t)
    }
}
export function ibsenxd() {
    console.log("gamer")
}
function parseWithPrefix(t)
{
    console.log(t)
    console.log((indexOf(t, "select")-1)/2)
    for(let i = 1; i < indexOf(t, "select"); i += 2){
        console.log(i)
        parsePrefixes[(i-1)/2][0] = t[i]
        parsePrefixes[(i-1)/2][1] = t[i+1].replace("<", "").replace(">", "")
    }
    parsePrefixes.forEach((element) => {
        element.forEach((data) => {
            console.log(data)
        })
    })
}

function parseWithoutPrefix(t){

}

function arrayRemove(arr, value){
    return arr.filter(function (ele){
        return ele !== value
    })
}
*/

export function returnToText(sparql){
    let outputText = ""
    for(let i = 0; i < sparql.prefixes.length; i++){
        outputText += "PREFIX " + sparql.prefixes[i][0] + " " + "<" + sparql.prefixes[i][1] + ">\n"
    }
    outputText += sparql.type
    for(let i = 0; i < sparql.boundVariables.length; i++){
        outputText += " " + sparql.boundVariables[i]
    }
    outputText += "\nWHERE {\n"
    for(let i = 0; i < sparql.triples.length; i++){
        outputText += sparql.triples[i].subject + " " + sparql.triples[i].predicate + " " + sparql.triples[i].object + "\n"
    }
    outputText += "}"

    document.write("parse").value = outputText
}
