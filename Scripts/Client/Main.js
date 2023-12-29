"use strict";

import {
	Node,
	display,
	progenitor,
} from "./Components/Node.js";
import { } from "./Structure.js";

void async function () {
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
}();