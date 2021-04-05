function parse(){
    let s = document.getElementById("parse").value;
    let t = s.split(" ").join("\n").split("\n")
    for(var i = 0; i < t.length; i++){
        if(t[i] == ""){
            t.pop(i)
        }
    }
    if(t[0].toLowerCase() == "prefix"){
        parseWithPrefix(t)
    }
    else {
        parseWithoutPrefix(t)
    }
}

function parseWithPrefix(var t)
{
    console.log(t)
}