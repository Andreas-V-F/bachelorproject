class tool{

    img;
    id;

    constructor(img, id){
        this.img = img;
        this.id = id;
    }

    get img(){
        return this.img;
    }

    toDo(){
        console.log("not overwritten");
    }
}