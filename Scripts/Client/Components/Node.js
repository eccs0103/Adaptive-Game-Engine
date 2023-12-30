"use strict";

import { Display } from "../Modules/Executors.js";
import { } from "../Modules/Extensions.js";

const canvas = document.getElement(HTMLCanvasElement, `canvas#display`);
const context = canvas.getContext(`2d`) ?? (() => {
	throw new TypeError(`Context is missing`);
})();
const display = new Display(context);

//#region Modification types
/** @enum {String} */ const ModificationTypes = {
	/** @readonly */ add: `add`,
	/** @readonly */ remove: `remove`,
};
Object.freeze(ModificationTypes);
//#endregion
//#region Modification event
/**
 * @typedef VirtualModificationEventInit
 * @property {ModificationTypes} modification
 * @property {Node} node
 * 
 * @typedef {EventInit & VirtualModificationEventInit} ModificationEventInit
 */

class ModificationEvent extends Event {
	/**
	 * @param {String} type 
	 * @param {ModificationEventInit} dict 
	 */
	constructor(type, dict) {
		super(type, dict);
		this.#modification = dict.modification;
		this.#node = dict.node;
	}
	/** @type {ModificationTypes?} */ #modification = null;
	/** @readonly */ get modification() {
		return this.#modification ?? (() => {
			throw new ReferenceError(`Modification property is missing`);
		})();
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
	 * @param {EventTarget} owner 
	 */
	constructor(owner) {
		this.#owner = owner;
	}
	/** @type {EventTarget} */ #owner;
	/** @type {Set<T>} */ #Nodes = new Set();
	/**
	 * @param {T} item 
	 */
	add(item) {
		if (this.#owner.dispatchEvent(new ModificationEvent(`trymodify`, { modification: ModificationTypes.add, node: item, cancelable: true }))) {
			this.#Nodes.add(item);
			this.#owner.dispatchEvent(new ModificationEvent(`modify`, { modification: ModificationTypes.add, node: item }));
			item.dispatchEvent(new Event(`adopt`));
		}
	}
	/**
	 * @param {T} item 
	 */
	remove(item) {
		if (this.#owner.dispatchEvent(new ModificationEvent(`trymodify`, { modification: ModificationTypes.remove, node: item, cancelable: true }))) {
			this.#Nodes.delete(item);
			this.#owner.dispatchEvent(new ModificationEvent(`modify`, { modification: ModificationTypes.remove, node: item }));
			item.dispatchEvent(new Event(`abandon`));
		}
	}
	/**
	 * @param {T} item 
	 * @returns {Boolean}
	 */
	has(item) {
		return this.#Nodes.has(item);
	}
	clear() {
		for (const item of this.#Nodes) {
			this.remove(item);
		}
	}
	/**
	 * @returns {Generator<T>}
	 */
	*[Symbol.iterator]() {
		for (const item of this.#Nodes) {
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
	 * @param {String} name 
	 */
	constructor(name = ``) {
		super();
		this.name = name;
		this.addEventListener(`modify`, (event) => {
			if (event instanceof ModificationEvent) {
				const { modification, node } = event;
				if (modification === ModificationTypes.add) {
					node.#parent = this;
				}
			}
		});
		this.addEventListener(`modify`, (event) => {
			if (event instanceof ModificationEvent) {
				const { modification, node } = event;
				if (modification === ModificationTypes.remove) {
					node.#parent = null;
				}
			}
		});
		this.addEventListener(`adopt`, (event) => {
			const peak = this.peak;
			if (peak === progenitor || peak.#isConnected) {
				Node.#connect(this);
			}
		});
		this.addEventListener(`abandon`, (event) => {
			Node.#disconnect(this);
		});
	}
	/** @type {String} */ #name = ``;
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
	/** @type {Boolean} */ #isConnected = false;
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
	/** @type {Boolean} */ static #locked = true;
	/**
	 * @param {String} name 
	 */
	constructor(name = `Progenitor`) {
		super(name);
		if (Progenitor.#locked) throw new TypeError(`Illegal constructor`);

		display.addEventListener(`start`, (event) => {
			this.dispatchEvent(new Event(event.type, { bubbles: true }));
		});
		display.addEventListener(`update`, (event) => {
			this.dispatchEvent(new Event(event.type, { bubbles: true }));
		});
	}
}
//#endregion

const progenitor = Progenitor.instance;

export { canvas, context, display, ModificationTypes, ModificationEvent, Group, Node, progenitor };