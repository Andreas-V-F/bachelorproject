//TODO: TYPE (SELECT/CONSTRUCT)
//TODO: BOUND VARIABLE
//TODO: UNBOUND VARIABLE
//TODO: LITERAL PREDICATE
//TODO: PREFIXES


class SPARQL {
    triples = []
    type = ""
    boundVariables = []
    unboundVariables = []
    literals = []
    prefixes = [[],[]]


    constructor(triples, type, boundVariables, prefixes) {
        this.triples = triples
        this.type = type
        this.boundVariables = boundVariables
        this.prefixes = prefixes
        this.setRest()
    }

    setRest() {
        for (let i = 0; i < this.triples.length; i++) {
            for (const [key, value] of Object.entries(triples[i])){
                this.setUnboundVariables(key, value)
                this.setLiterals(value)
            }

        }
    }

    setUnboundVariables(key, value) {
        if (!this.boundVariables.includes(value) && !this.unboundVariables.includes(value) && key !== "predicate") {
            this.unboundVariables.push(value)
        }
    }

    setLiterals(value) {
        if (value.includes("\"") && !this.literals.includes(value)) {
            this.literals.push(value)
        }
    }

    get triples(){
        return this.triples;
    }

    get type(){
        return this.type;
    }

    get boundVariables(){
        return this.boundVariables;
    }

    get unboundVariables(){
        return this.unboundVariables;
    }

    get literals(){
        return this.literals;
    }

    get prefixes(){
        return this.prefixes;
    }

}

let triples = [new Triple("?x", "foaf:name", "?name"), new Triple("?x", "foaf:mbox", "?mbox")]
let boundVariables = ["?name", "?mbox"]
let prefixes = [["foaf","url"]]
//console.log(prefixes[0][0])
//console.log(prefixes[0][1])
let type = "SELECT"
let sparqltest = new SPARQL(triples, type, boundVariables)