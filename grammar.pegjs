Type
  = t:"SELECT" bv:boundvarible+ where lbracket trip:triples+ rbracket { return new SPARQL(trip, t, bv, null); }

where = "\n"? "WHERE"

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