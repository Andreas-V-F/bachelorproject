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
    prefixes = []


    constructor(triples, type, boundVariables) {
        this.triples = triples
        this.type = type
        this.boundVariables = boundVariables
        this.setRest()
    }

    setRest() {
        for (let i = 0; i < this.triples.length; i++) {
            for (const [key, value] of Object.entries(triples[i])){
                this.setUnboundVariables(key, value)
                this.setLiterals(value)
                this.setPrefixes(value)
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

    setPrefixes(value) {
        if (value.includes(":") && !this.prefixes.includes(value.split(":")[0] + ":")) {
            this.prefixes.push(value.split(":")[0] + ":")
        }

    }

}

let triples = [new Triple("?x", "foaf:name", "?name"), new Triple("?x", "foaf:mbox", "?mbox")]
let boundVariables = ["?name", "?mbox"]
let type = "SELECT"
let sparqltest = new SPARQL(triples, type, boundVariables)

