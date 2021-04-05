export default class Tool{

    img;
    id;

    constructor(img, id){
        this.img = img;
        this.id = id;
    }

    toDo(){
        console.log("not overwritten");
    }
}