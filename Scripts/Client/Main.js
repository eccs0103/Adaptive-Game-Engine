"use strict";

import { canvas, display, progenitor } from "./Components/Node.js";
import { Point2D } from "./Modules/Measures.js";
import { Ball, Pointer } from "./Structure.js";

try {
	canvas.addEventListener(`mousedown`, (event) => {
		if (event.button !== 0) return;
		const pointer = new Pointer(new Point2D(event.clientX - canvas.width / 2, event.clientY - canvas.height / 2));
		progenitor.children.add(pointer);
		const pathController = new AbortController();
		window.addEventListener(`mousemove`, (event2) => {
			pointer.end = new Point2D(event2.clientX - canvas.width / 2, event2.clientY - canvas.height / 2);
		}, { signal: pathController.signal });
		window.addEventListener(`mouseup`, (event2) => {
			if (event2.button !== 0) return;
			progenitor.children.remove(pointer);
			const end = new Point2D(event2.clientX - canvas.width / 2, event2.clientY - canvas.height / 2);
			const ball = new Ball();
			ball.addEventListener(`rebuild`, (event) => {
				ball.size = new Point2D(canvas.width / 16, canvas.height / 16);
				ball.position = end;
			});
			progenitor.children.add(ball);
			const push = end["-"](pointer.begin);
			let frames = 0;
			const pushController = new AbortController();
			display.addEventListener(`update`, (event3) => {
				if (frames < 3) {
					frames++;
				} else {
					ball.forces.delete(push);
					pushController.abort();
				}
			}, { signal: pushController.signal });
			ball.forces.add(push);
			pathController.abort();
		}, { once: true });
	});
} catch (error) {
	await window.prevent(document.analysis(error));
}
