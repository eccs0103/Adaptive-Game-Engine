"use strict";

import { Display } from "../Modules/Executors.js";
import { } from "../Modules/Extensions.js";

const canvas = document.getElement(HTMLCanvasElement, `canvas#display`);
const context = canvas.getContext(`2d`) ?? (() => {
	throw new TypeError(`Context is missing`);
})();
const display = new Display(context);

display.addEventListener(`resize`, (event) => {
	const transform = context.getTransform();
	transform.e = canvas.width / 2;
	transform.f = canvas.height / 2;
	transform.d *= -1;
	context.setTransform(transform);
});
display.dispatchEvent(new UIEvent(`resize`));

//#region Modification event
/**
 * @typedef VirtualModificationEventInit
 * @property {Node} node
 * 
 * @typedef {EventInit & VirtualModificationEventInit} ModificationEventInit
 */

class ModificationEvent extends Event {
	/**
	 * @param {string} type 
	 * @param {ModificationEventInit} dict 
	 */
	constructor(type, dict) {
		super(type, dict);
		this.#node = dict.node;
	}
	/** @type {Node?} */ #node = null;
	/** @readonly */ get node() {
		return this.#node ?? (() => {
			throw new ReferenceError(`Modification property is missing`);
		})();
	}
}
//#endregion
//#region Group
/**
 * @template {Node} T
 */
class Group {
	/**
	 * @param {Node} owner 
	 * @param {T[]} items 
	 */
	constructor(owner, ...items) {
		this.#owner = owner;
		for (const item of items) {
			this.add(item);
		}
	}
	/** @type {Node} */ #owner;
	/** @type {Set<T>} */ #nodes = new Set();
	/**
	 * @param {T} item 
	 */
	add(item) {
		const parent = this.#owner, child = item;
		if (!parent.dispatchEvent(new ModificationEvent(`tryadoptchild`, { node: child, cancelable: true }))) return;
		if (!child.dispatchEvent(new ModificationEvent(`tryadopt`, { node: parent, cancelable: true }))) return;
		this.#nodes.add(item);
		parent.dispatchEvent(new ModificationEvent(`adoptchild`, { node: child }));
		child.dispatchEvent(new ModificationEvent(`adopt`, { node: parent }));
	}
	/**
	 * @param {T} item 
	 */
	remove(item) {
		const parent = this.#owner, child = item;
		if (!parent.dispatchEvent(new ModificationEvent(`tryabandonchild`, { node: child, cancelable: true }))) return;
		if (!child.dispatchEvent(new ModificationEvent(`tryabandon`, { node: parent, cancelable: true }))) return;
		this.#nodes.delete(item);
		parent.dispatchEvent(new ModificationEvent(`abandonchild`, { node: child }));
		child.dispatchEvent(new ModificationEvent(`abandon`, { node: parent }));
	}
	/**
	 * @param {T} item 
	 * @returns {boolean}
	 */
	has(item) {
		return this.#nodes.has(item);
	}
	clear() {
		for (const item of this.#nodes) {
			this.remove(item);
		}
	}
	get size() {
		return this.#nodes.size;
	}
	/**
	 * @returns {Generator<T>}
	 */
	*[Symbol.iterator]() {
		for (const item of this.#nodes) {
			yield item;
		}
		return;
	}
}
//#endregion
//#region Node
class Node extends EventTarget {
	/**
	 * @param {Node} target 
	 */
	static #connect(target) {
		target.#isConnected = true;
		target.dispatchEvent(new Event(`connect`));
		for (const child of target.children) {
			Node.#connect(child);
		}
	}
	/**
	 * @param {Node} target 
	 */
	static #disconnect(target) {
		target.#isConnected = false;
		for (const child of target.children) {
			Node.#disconnect(child);
		}
		target.dispatchEvent(new Event(`disconnect`));
	}
	/**
	 * @param {Node} target 
	 */
	static #isProgenitor(target) {
		return Reflect.getPrototypeOf(target) === Progenitor.prototype;
	}
	/**
	 * @param {string} name 
	 */
	constructor(name = ``) {
		super();
		this.name = name;

		this.addEventListener(`adoptchild`, (event) => {
			if (event instanceof ModificationEvent) {
				event.node.#parent = this;
			}
		});
		this.addEventListener(`abandonchild`, (event) => {
			if (event instanceof ModificationEvent) {
				event.node.#parent = null;
			}
		});

		this.addEventListener(`adopt`, (event) => {
			const peak = this.peak;
			if (Node.#isProgenitor(peak) || peak.#isConnected) {
				Node.#connect(this);
			}
		});
		this.addEventListener(`abandon`, (event) => {
			Node.#disconnect(this);
		});
	}
	/** @type {string} */ #name = ``;
	get name() {
		return this.#name;
	}
	set name(value) {
		this.#name = value;
	}
	/** @type {Node?} */ #parent = null;
	/** @readonly */ get parent() {
		return this.#parent ?? (() => {
			throw new ReferenceError(`Parent of '${this.name}' is null`);
		})();
	}
	/** @type {Group<Node>} */ #children = new Group(this);
	/** @readonly */ get children() {
		return this.#children;
	}
	/** @readonly */ get peak() {
		for (let current = (/** @type {Node} */ (this)); true;) {
			try {
				current = current.parent;
			} catch (error) {
				return current;
			}
		}
	}
	/** @type {boolean} */ #isConnected = Node.#isProgenitor(this);
	/** @readonly */ get isConnected() {
		return this.#isConnected;
	}
}
//#endregion
//#region Progenitor
class Progenitor extends Node {
	/** @type {Progenitor?} */ static #instance = null;
	/** @readonly */ static get instance() {
		return Progenitor.#instance ?? (() => {
			Progenitor.#locked = false;
			Progenitor.#instance = new Progenitor();
			Progenitor.#locked = true;
			return Progenitor.#instance;
		})();
	}
	/** @type {boolean} */ static #locked = true;
	/**
	 * @param {string} name 
	 */
	constructor(name = `Progenitor`) {
		super(name);
		if (Progenitor.#locked) throw new TypeError(`Illegal constructor`);

		this.addEventListener(`tryadopt`, (event) => {
			event.preventDefault();
			throw new EvalError(`Progenitor can't be adopted by any node`);
		});

		display.addEventListener(`start`, (event) => {
			this.dispatchEvent(new Event(event.type, { bubbles: true }));
		});
		display.addEventListener(`update`, (event) => {
			this.dispatchEvent(new Event(event.type, { bubbles: true }));
		});
	}
	/**
	 * @param {Event} event 
	 * @returns {boolean}
	 */
	dispatchEvent(event) {
		/** @type {Node[]} */ const stack = [this];
		while (stack.length > 0) {
			let node = stack.pop() ?? (() => {
				throw new EvalError(`Invalid stack evalution`);
			})();
			if (node === this) {
				if (!super.dispatchEvent(event)) return false;
			} else {
				if (!node.dispatchEvent(event)) return false;
			}
			if (event.bubbles) {
				for (const child of node.children) {
					stack.push(child);
				}
			}
		}
		return true;
	}
}
//#endregion

const progenitor = Progenitor.instance;

export { canvas, context, display, ModificationEvent, Group, Node, progenitor };