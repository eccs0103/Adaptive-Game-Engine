"use strict";

import { } from "./Modules/Storage.js";
import { } from "./Modules/Extensions.js";
import { Node, context, display } from "./Components/Node.js";
import { } from "./Components/Entity.js";
import { } from "./Components/InterfaceItem.js";
import { CollisionEvent, Corporeal } from "./Components/Corporeal.js";
import { Renderer } from "./Components/Utilities.js";
import { Point2D } from "./Modules/Measures.js";

//#region Metadata
//#endregion

const { PI } = Math;

context.strokeStyle = Renderer.colorHighlight.toString(true);
context.fillStyle = Renderer.colorHighlight.toString(true);

//#region Pointer
class Pointer extends Node {
	/**
	 * @param {Readonly<Point2D>} begin 
	 */
	constructor(begin) {
		super(`Pointer`);
		this.begin = begin;
		this.end = begin;
		this.addEventListener(`render`, () => {
			context.beginPath();
			context.moveTo(this.begin.x, this.begin.y);
			const lineWidth = context.lineWidth;
			context.lineWidth = 2;
			context.lineTo(this.end.x, this.end.y);
			context.lineWidth = lineWidth;
			context.closePath();
			context.stroke();
		});
	}
	/** @type {Point2D} */ #begin = Point2D.ZERO;
	get begin() {
		return Object.freeze(this.#begin);
	}
	set begin(value) {
		let result = value.clone();
		this.#begin = result;
	}
	/** @type {Point2D} */ #end = Point2D.ZERO;
	get end() {
		return Object.freeze(this.#end);
	}
	set end(value) {
		let result = value.clone();
		this.#end = result;
	}
}
//#endregion
//#region  Ball
class Ball extends Corporeal {
	constructor() {
		super(`Ball`);
		this.addEventListener(`connect`, () => {
			this.dispatchEvent(new Event(`rebuild`));
		});
		display.addEventListener(`resize`, () => {
			this.dispatchEvent(new Event(`rebuild`));
		});
		this.addEventListener(`render`, () => {
			context.beginPath();
			context.ellipse(this.globalPosition.x, this.globalPosition.y, this.size.x / 2, this.size.y / 2, 0, 0, 2 * PI);
			context.closePath();
			context.fill();
		});
		this.addEventListener(`collisionbegin`, (event) => {
			if (event instanceof CollisionEvent) {
				console.log(event.other);
			}
		});
	}
	/**
	 * @param {Point2D} point 
	 * @returns {boolean}
	 */
	isInner(point) {
		const result = (point.x / (this.size.x / 2)) ** 2 + (point.y / (this.size.y / 2)) ** 2 <= 1;
		if (result) {
			
		}
		return result;
	}
}
//#endregion

export { Pointer, Ball };