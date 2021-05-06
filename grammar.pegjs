Type
  = prefixes:prefix* lineBreak? t:"SELECT" bv:boundvarible+ where lbracket trip:triples+ rbracket { return new SPARQL(trip, t, bv, prefixes); }

prefix = lineBreak? "PREFIX" space prefix:word space "<"? link:link ">"? {
var linkClean = link.replace(/,/g, "")
var prefixesClean = prefix.join().replace(/,/g, "")
var prefixes = []
var temp = [prefixesClean, linkClean]
prefixes.push(temp)
return prefixes} 

where = lineBreak? "WHERE"

lbracket = space? lineBreak? "{"

boundvarible = space* questionMark l:word {return "?" +l.join().replace(/,/g, "")}

triples = lineBreak? space? "\t"? questionMark subject:word space predicate:word space questionMark object:word {return new Triple("?" + subject.join().replace(/,/g, ""), predicate.join().replace(/,/g, ""), "?" + object.join().replace(/,/g, ""))}

rbracket = space? lineBreak? "}"

wordCount = w:(word space?)* {return w.length; }

word = letter+

letter = [a-zA-Z0-9:]

space = " "

lineBreak = "\n"

questionMark = "?"

link = start:"https://" first:word dot:domain second:slash* {return start + first + dot + second}

domain = all:("." word+) {return all} 

slash = all:("/" (word+ "."?)*) / all:"/" {return all}