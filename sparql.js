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
        this.triples = triples
        this.type = type
        this.setBoundVariables(boundVariables)
        this.listOfPrefixes = prefixes;
        this.setRest()
        console.log(this)
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
        if (!this.variableExists(this.boundVariables, value) && !this.variableExists(this.unboundVariables, value)  && key !== "predicate") {
            this.unboundVariables.push({name: value, colour: Math.floor(Math.random()*16777215).toString(16)})
        }
    }

    setLiterals(value) {
        if (value.includes("\"") && !this.literals.includes(value)) {
            this.literals.push(value)
        }
    }

    setBoundVariables(boundVariables){
        for(let i = 0; i < boundVariables.length; i++)
        {
            this.boundVariables.push({name: boundVariables[i], colour: Math.floor(Math.random()*16777215).toString(16)})
        }
    }

    variableExists(arr, name){
        for(let i = 0; i < arr.length; i++){
            if(arr[i].name === name){
                return true
            }
        }
        return false
    }


}
