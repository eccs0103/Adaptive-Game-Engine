"use strict";

import { engine, progenitor } from "./Node.js";
import { Renderer } from "./Utilities.js";

progenitor.addEventListener(`update`, (event) => {
	Renderer.clear();
	progenitor.dispatchEvent(new Event(`render`, { bubbles: true }));
});
engine.launched = true;

export { };