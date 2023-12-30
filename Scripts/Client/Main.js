"use strict";

import { Node, canvas, context, display, progenitor } from "./Components/Node.js";
import { } from "./Structure.js";

try {
	progenitor.addEventListener(`start`, (event) => {
		// Program start callback
	});
	progenitor.addEventListener(`update`, (event) => {
		// Frame update callback
	});
} catch (error) {
	await window.prevent(document.analysis(error));
}
