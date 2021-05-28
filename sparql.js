//TODO: TYPE (SELECT/CONSTRUCT)
//TODO: BOUND VARIABLE
//TODO: UNBOUND VARIABLE
//TODO: LITERAL PREDICATE
//TODO: PREFIXES


export default class SPARQL {
    triples = []
    type = ""
    boundVariables = []
    unboundVariables = []
    literals = []
    listOfPrefixes


    constructor(triples, type, boundVariables, prefixes) {
        this.setTriples(triples)
        this.type = type
        this.boundVariables = boundVariables
        this.listOfPrefixes = prefixes;
        this.setRest()
    }

    setRest() {
        for (let i = 0; i < this.triples.length; i++) {
            for (const [key, value] of Object.entries(this.triples[i])){
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

    setTriples(triples){

        for(let i = 0; i < triples.length; i++){
            if(this.triples.length === 0){
                this.triples.push(triples[i])
                continue
            }
            for(let j = 0; j < this.triples.length; j++){
                console.log((this.triples[j].subject === triples[i].subject && this.triples[j].object === triples[i].object))
                console.log((this.triples[j].subject === triples[i].object && this.triples[j].object === triples[i].subject))
                if(!(this.triples[j].subject === triples[i].subject && this.triples[j].object === triples[i].object)
                && !(this.triples[j].subject === triples[i].object && this.triples[j].object === triples[i].subject)){
                    this.triples.push(triples[i])
                    break
                }
            }

        }
    }

}

