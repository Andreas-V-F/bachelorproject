Type
  = prefixes:prefix* t:"SELECT" bv:boundvarible+ where lbracket trip:triples+ rbracket { return new SPARQL(trip, t, bv, prefixes); }

prefix = "PREFIX" space prefix:word space* "<"? link:link ">"? lineBreak {
var linkClean = link.replace(/,/g, "")
var prefixesClean = prefix.join().replace(/,/g, "")
var listOfPrefixes = {prefixes: []
}
listOfPrefixes.prefixes.push({name: prefixesClean, link: linkClean})
return listOfPrefixes}

where = lineBreak* "WHERE"

lbracket = space* lineBreak* space* "{"

boundvarible = space* questionMark l:word {return "?" +l.join().replace(/,/g, "")}

<<<<<<< Updated upstream
triples = lineBreak? space? "\t"? questionMark subject:word space predicate:word space questionMark object:word {return new Triple("?" + subject.join().replace(/,/g, ""), predicate.join().replace(/,/g, ""), "?" + object.join().replace(/,/g, ""))}
=======
triples = lineBreak* space* "\t"? questionMark subject:word space predicate:word space questionMark object:word (space ".")? lineBreak {return new Triple("?" + subject.join().replace(/,/g, ""), predicate.join().replace(/,/g, ""), "?" + object.join().replace(/,/g, ""))}
>>>>>>> Stashed changes

rbracket = space* lineBreak* "}"

word = letter+

letter = [a-zA-Z0-9:]

space = " "

lineBreak = "\n"

questionMark = "?"

link = start:("https://" / "http://") first:word dot:domain second:slash* {return start + first + dot + second}

domain = all:("." word+) {return all} 

slash = all:("/" (word+ "."?)*) / all:"/" {return all}