//import { initiate as initiateVisualHandler, setTool} from './VisualHandler.js';
import {initiateTextualHandler} from "./TextualHandler.js";
//import { testMethod } from './VisualParser.js';
//window.setTool = setTool;

init();

function init(){
    initiateTextualHandler();
    //initiateVisualHandler();
}