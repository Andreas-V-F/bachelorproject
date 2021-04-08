export default class Tool{

    img;
    name;
    id;

    constructor(img, name, id){
        this.img = img;
        this.name = name;
        this.id = id;
    }

    toDo(){
        console.log("not overwritten");
    }
}