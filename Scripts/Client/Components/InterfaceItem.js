"use strict";

import { Point2D } from "../Modules/Measures.js";
import { Entity } from "./Entity.js";
import { ModificationEvent, canvas, display, progenitor } from "./Node.js";

//#region Interface item
class InterfaceItem extends Entity {
	/**
	 * @param {string} name 
	 */
	constructor(name = ``) {
		super(name);
	}
	/** @type {Point2D} */ #anchor = Point2D.ZERO;
	get anchor() {
		return Object.freeze(this.#anchor["*"](Point2D.CONSTANT_TWO));
	}
	set anchor(value) {
		if (-1 > this.#anchor.x || this.#anchor.x > 1) throw new RangeError(`Anchor ${this.anchor} is out of range [(-1, -1) - (1, 1)]`);
		if (-1 > this.#anchor.y || this.#anchor.y > 1) throw new RangeError(`Anchor ${this.anchor} is out of range [(-1, -1) - (1, 1)]`);
		const result = value["/"](Point2D.CONSTANT_TWO);
		this.#anchor = result;
	}
	get globalPosition() {
		let result = super.globalPosition.clone();
		try {
			if (this.parent instanceof Entity) {
				result = result["+"](this.parent.size["*"](this.#anchor));
				result = result["-"](this.size["*"](this.#anchor));
			}
		} finally {
			return Object.freeze(result);
		}
	}
	set globalPosition(value) {
		let result = value;
		try {
			if (this.parent instanceof Entity) {
				result = result["-"](this.parent.size["*"](this.#anchor));
				result = result["+"](this.size["*"](this.#anchor));
			}
		} finally {
			super.globalPosition = result;
		}
	}
}
//#endregion
//#region User interface
class UserInterface extends InterfaceItem {
	constructor(name = `User interface`) {
		super(name);
		super.size = new Point2D(canvas.width, canvas.height);
		display.addEventListener(`resize`, (event) => {
			super.size = new Point2D(canvas.width, canvas.height);
		});
		this.addEventListener(`tryadopt`, (event) => {
			if (event instanceof ModificationEvent) {
				if (event.node !== progenitor) {
					event.preventDefault();
					throw new EvalError(`User interface can be adopted only by Progenitor`);
				}
			}
		});
	}
	get position() {
		return super.position;
	}
	set position(value) {
		throw new TypeError(`Cannot set property position of #<UserInterface> which has only a getter`);
	}
	get globalPosition() {
		return super.globalPosition;
	}
	set globalPosition(value) {
		throw new TypeError(`Cannot set property globalPosition of #<UserInterface> which has only a getter`);
	}
	get size() {
		return super.size;
	}
	set size(value) {
		throw new TypeError(`Cannot set property globalPosition of #<UserInterface> which has only a getter`);
	}
	get anchor() {
		return super.anchor;
	}
	set anchor(value) {
		throw new TypeError(`Cannot set property globalPosition of #<UserInterface> which has only a getter`);
	}
}
//#endregion

const userInterface = new UserInterface();
progenitor.children.add(userInterface);

export { InterfaceItem, UserInterface, userInterface };