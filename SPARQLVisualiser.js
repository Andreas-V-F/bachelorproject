import { initiate as initiateVisualHandler, setTool } from './VisualHandler.js';
import { initiateTextualHandler } from "./TextualHandler.js";
import { initiate as scriptDependencies } from "./addScriptsDependencies.js";
window.setTool = setTool;


init();

function init() {
    scriptDependencies();
    initiateTextualHandler();
    initiateVisualHandler();
}