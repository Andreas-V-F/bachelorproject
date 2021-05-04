Type = "SELECT" bv:boundvarible+ lbracket trip:triples+ rbracket { return trip.toString(); }

lbracket = space? lineBreak? "{"

boundvarible = space* questionMark l:word {return l}

triples = lineBreak? space? "\t"? questionMark word space word space questionMark word

rbracket = space? lineBreak? "}"

wordCount = w:(word space?)* {return w.length; }

word = letter+

letter = [a-zA-Z0-9:]

space = " "

lineBreak = "\n"

questionMark = "?"