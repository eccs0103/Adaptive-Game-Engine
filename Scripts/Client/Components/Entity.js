"use strict";

import { Group, ModificationEvent, Node } from "./Node.js";
import { Point2D } from "../Modules/Measures.js";

//#region Entity
class Entity extends Node {
	/**
	 * @param {String} name 
	 */
	constructor(name = ``) {
		super(name);
		this.addEventListener(`tryadoptchild`, (event) => {
			if (event instanceof ModificationEvent) {
				if (!(event.node instanceof Entity)) {
					event.preventDefault();
					throw new TypeError(`Entity's children also must be inherited from Entity`);
				}
			}
		});
	}
	/** @type {Group<Entity>} */ #children = new Group(this);
	/** @readonly */ get children() {
		return this.#children;
	}
	/** @type {Point2D} */ #position = Point2D.ZERO;
	get position() {
		let result = this.#position;
		try {
			if (this.parent instanceof Entity) {
				result = result["+"](this.parent.position);
			}
		} catch { }
		return result;
	}
	set position(value) {
		try {
			if (this.parent instanceof Entity) {
				value = value["-"](this.parent.position);
			}
		} catch { }
		this.#position = value;
	}
	/** @type {Point2D} */ #size = Point2D.ZERO;
	get size() {
		return this.#size;
	}
	set size(value) {
		this.#size = value;
	}
}
//#endregion

export { Entity };