"use strict";

import { progenitor } from "./Components/Node.js";
import { } from "./Structure.js";

try {
	progenitor.addEventListener(`start`, (event) => {
		// Engine start callback
	});
	progenitor.addEventListener(`update`, (event) => {
		// Frame update callback
	});
} catch (error) {
	await window.prevent(document.analysis(error));
}
