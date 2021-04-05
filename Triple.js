class Triple {
    subject = ""
    predicate = ""
    object = ""

    constructor(subject, predicate, object) {
        this.subject = subject
        this.predicate = predicate
        this.object = object
    }
    toString(){
        return "Subject: " + this.subject + ", predicate: " + this.predicate + " and object: " + this.object
    }

    get subject(){
        this.subject;
    }

    get predicate(){
        this.predicate;
    }
    
    get object(){
        this.object;
    }
}

