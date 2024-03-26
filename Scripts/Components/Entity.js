"use strict";

import { Group, Node, PointerEvent } from "./Node.js";
import { Point2D } from "../Modules/Measures.js";

const { atan2, PI } = Math;

//#region Entity
/**
 * @typedef VirtualEntityEventMap
 * @property {PointerEvent} click
 * @property {PointerEvent} drag
 * 
 * @typedef {import("./Node.js").NodeEventMap & VirtualEntityEventMap} EntityEventMap
 */

/** 
 * Enumeration representing different sectors in the area.
 * @enum {number}
 */
const AreaSectors = {
	/** @readonly */ top: 0,
	/** @readonly */ right: 1,
	/** @readonly */ bottom: 2,
	/** @readonly */ left: 3,
};
Object.freeze(AreaSectors);

/**
 * Represents a generic entity node with event capabilities.
 */
class Entity extends Node {
	/**
	 * Creates a new instance of the Entity class.
	 * @param {string} name The name of the entity.
	 */
	constructor(name = `Entity`) {
		super(name);
		this.addEventListener(`tryadoptchild`, (event) => {
			if (!(event.node instanceof Entity)) {
				event.preventDefault();
				throw new TypeError(`Entity's children also must be inherited from Entity`);
			}
		});
	}
	/**
	 * @template {keyof EntityEventMap} K
	 * @param {K} type 
	 * @param {(this: Entity, ev: EntityEventMap[K]) => any} listener 
	 * @param {boolean | AddEventListenerOptions} options
	 * @returns {void}
	 */
	addEventListener(type, listener, options = false) {
		// @ts-ignore
		return super.addEventListener(type, listener, options);
	}
	/**
	 * @template {keyof EntityEventMap} K
	 * @param {K} type 
	 * @param {(this: Entity, ev: EntityEventMap[K]) => any} listener 
	 * @param {boolean | EventListenerOptions} options
	 * @returns {void}
	 */
	removeEventListener(type, listener, options = false) {
		// @ts-ignore
		return super.addEventListener(type, listener, options);
	}
	/** @type {Group<Entity>} */
	#children = new Group(this);
	/**
	 * Gets the children of the entity.
	 * @readonly
	 */
	get children() {
		return this.#children;
	}
	/** @type {Point2D} */
	#position = Point2D.ZERO;
	/**
	 * Gets the position of the entity.
	 */
	get position() {
		return Object.freeze(this.#position);
	}
	/**
	 * Sets the position of the entity.
	 */
	set position(value) {
		let result = value.clone();
		this.#position = result;
	}
	/**
	 * Gets the global position of the entity.
	 */
	get globalPosition() {
		let result = this.#position;
		try {
			if (this.parent instanceof Entity) {
				result = result["+"](this.parent.globalPosition);
			}
		} catch { }
		return Object.freeze(result);
	}
	/**
	 * Sets the global position of the entity.
	 */
	set globalPosition(value) {
		let result = value.clone();
		try {
			if (this.parent instanceof Entity) {
				value = result["-"](this.parent.globalPosition);
			}
		} catch { }
		this.#position = result;
	}
	/**
	 * Checks if a point is within the mesh of the entity.
	 * @abstract
	 * @param {Readonly<Point2D>} point The point to check.
	 * @returns {boolean} Whether the point is within the mesh.
	 * @throws {ReferenceError} If function not implemented.
	 */
	isMesh(point) {
		const position = this.globalPosition;
		const size = this.size;
		return (
			position.x - size.x / 2 <= point.x &&
			point.x < position.x + size.x / 2 &&
			position.y - size.y / 2 <= point.y &&
			point.y < position.y + size.y / 2
		);
	}
	/** @type {Point2D} */
	#size = Point2D.ZERO;
	/**
	 * Gets the size of the entity.
	 */
	get size() {
		return Object.freeze(this.#size);
	}
	/**
	 * Sets the size of the entity.
	 */
	set size(value) {
		let result = value.clone();
		this.#size = result;
	}
	/**
	 * Gets the sector of the area in which another entity is located.
	 * @param {Entity} other The other entity.
	 * @returns {AreaSectors} The sector of the area.
	 */
	getAreaSector(other) {
		const alpha = atan2(this.size.x / 2, this.size.y / 2);

		const pointOtherPosition = other.globalPosition["-"](this.globalPosition);
		let angle = atan2(pointOtherPosition.x, pointOtherPosition.y);
		angle += alpha;
		if (angle < 0) angle += 2 * PI;

		const sectors = [2 * alpha, PI - 2 * alpha, 2 * alpha, PI - 2 * alpha];
		for (let begin = 0, index = 0; index < sectors.length; index++) {
			const sector = sectors[index];
			const end = begin + sector;
			if (begin <= angle && angle < end) {
				return (/** @type {AreaSectors} */ (index));
			}
			begin = end;
		}
		throw new RangeError(`Angle ${angle} out of range [0 - 2π).`);
	}
}
//#endregion

export { AreaSectors, Entity };