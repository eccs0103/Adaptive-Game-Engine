"use strict";

import { Point2D } from "../Modules/Measures.js";
import { progenitor, display } from "./Node.js";
import { Entity } from "./Entity.js";

/** @type {Corporeal[]} */ const corporeals = [];

//#region Collision event
/**
 * @typedef VirtualCollisionEvent
 * @property {Corporeal} other
 * 
 * @typedef {EventInit & VirtualCollisionEvent} CollisionEventInit
 */

class CollisionEvent extends Event {
	/**
	 * @param {string} type 
	 * @param {CollisionEventInit} dict 
	 */
	constructor(type, dict) {
		super(type, dict);
		this.#other = dict.other;
	}
	/** @type {Corporeal?} */ #other = null;
	/** @readonly */ get other() {
		return this.#other ?? (() => {
			throw new ReferenceError(`Other property is missing`);
		})();
	}
}
//#endregion
//#region Corporeal
class Corporeal extends Entity {
	static {
		progenitor.addEventListener(`update`, (event) => {
			for (let index = 0; index < corporeals.length; index++) {
				const target = corporeals[index];
				for (let index2 = index + 1; index2 < corporeals.length; index2++) {
					const other = corporeals[index2];

					const isCollisionBefore = target.#collisions.has(other);
					const isCollisionNow = Corporeal.getCollision(target, other);

					if (isCollisionNow.length > 0) {
						if (!isCollisionBefore) {
							target.#collisions.add(other);
							target.dispatchEvent(new CollisionEvent(`collisionbegin`, { other: other }));
							other.dispatchEvent(new CollisionEvent(`collisionbegin`, { other: target }));
						}
						target.dispatchEvent(new CollisionEvent(`collision`, { other: other }));
						other.dispatchEvent(new CollisionEvent(`collision`, { other: target }));
					} else if (isCollisionBefore) {
						target.#collisions.delete(other);
						target.dispatchEvent(new CollisionEvent(`collisionend`, { other: other }));
						other.dispatchEvent(new CollisionEvent(`collisionend`, { other: target }));
					}
				}
			}
		});
	}
	/**
	 * @param {Corporeal} corporeal 
	 * @returns {[Point2D, Point2D]}
	 */
	static #getOutline(corporeal) {
		return [
			corporeal.globalPosition["-"](corporeal.size["/"](Point2D.CONSTANT_TWO)),
			corporeal.globalPosition["+"](corporeal.size["/"](Point2D.CONSTANT_TWO)),
		];
	}
	/**
	 * @param {Corporeal} first 
	 * @param {Corporeal} second 
	 * @returns {Point2D[]}
	 */
	static getCollision(first, second) {
		/** @type {Point2D[]} */ const points = [];
		const [begin1, end1] = Corporeal.#getOutline(first);
		const [begin2, end2] = Corporeal.#getOutline(second);
		if (begin1.x <= end2.x && begin2.x <= end1.x && begin1.y <= end2.y && begin2.y <= end1.y) {
			const begin = new Point2D(Math.max(begin1.x, begin2.x), Math.max(begin1.y, begin2.y));
			const end = new Point2D(Math.min(end1.x, end2.x), Math.min(end1.y, end2.y));
			for (let y = begin.y; y <= end.y; y++) {
				for (let x = begin.x; x <= end.x; x++) {
					const point = new Point2D(x, y);
					if (first.isInner(point["-"](first.globalPosition)) && second.isInner(point["-"](second.globalPosition))) {
						points.push(point);
					}
				}
			}
		}
		return points;
	}
	/**
	 * @param {string} name 
	 */
	constructor(name = ``) {
		super(name);

		this.addEventListener(`connect`, (event) => {
			corporeals.push(this);
		});

		this.addEventListener(`disconnect`, (event) => {
			const index = corporeals.indexOf(this);
			if (index > 0) {
				corporeals.splice(index, 1);
			}
		});

		this.addEventListener(`update`, (event) => {
			this.velocity = this.velocity["+"](this.acceleration);
			this.position = this.position["+"](this.#velocity["*"](Point2D.repeat(display.delta)));
		});
	}
	/**
	 * @param {Point2D} point 
	 * @returns {boolean}
	 */
	isInner(point) {
		throw new ReferenceError(`Not implemented function`);
	}
	/** @type {Set<Corporeal>} */ #collisions = new Set();
	/** @type {Set<Point2D>} */ #forces = new Set();
	/** @readonly */ get forces() {
		return this.#forces;
	}
	/** @type {number} */ #mass = 1;
	get mass() {
		return this.#mass;
	}
	set mass(value) {
		if (value > 0) {
			this.#mass = value;
		} else throw new RangeError(`Mass ${value} is out of range (0 - +∞)`);
	}
	/** @readonly */ get acceleration() {
		let equivalent = Point2D.ZERO;
		for (const force of this.forces) {
			equivalent = equivalent["+"](force);
		}
		return equivalent["/"](Point2D.repeat(this.mass));
	}
	/** @type {Point2D} */ #velocity = Point2D.ZERO;
	get velocity() {
		return this.#velocity;
	}
	set velocity(value) {
		this.#velocity = value;
	}
}
//#endregion

export { CollisionEvent, Corporeal };