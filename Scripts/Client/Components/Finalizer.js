"use strict";

import {
	display,
	progenitor,
} from "./Node.js";

progenitor.dispatchEvent(new Event(`adopt`));
display.launched = true;

export { };