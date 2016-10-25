/**
 * Entity module.
 * @module Entity
 */
define('Entity', function(module) {
	'use strict';

	/** Class that represents an Entity (the "E" in the ECS design pattern). */
	class Entity {

		/**
		 * Create an Entity.
		 * @param  {function} compCallback - Function to call after a component is added/removed.
		 */
		constructor(compCallback) {
			this.compCallback = compCallback;
			this.components = {};
		}

		/**
		 * Check if the given component exists for this Entity.
		 * @param  {string} compName - Name of component.
		 * @returns {boolean}  true if the given component exists for this Entity.
		 */
		hasComponent(compName) {
			return this.components[compName] !== undefined;
		}

		/**
		 * Gets the component object for this Entity under the given name.
		 * @param  {string} compName - Name of component.
		 * @returns {Object|null}  Returns the component object under the given name.
		 */
		getComponent(compName) {
			return this.components[compName];
		}

		/**
		 * Adds a component object for this Entity under the given name.
		 * @param  {string} compName - Name of component.
		 * @param  {Object=} component - Plain-data Object.
		 */
		addComponent(compName, component) {
			if(!compName) { return; }

			if(typeof component === 'object' && component.constructor === Object) {
				this.components[compName] = component;
			} else {
				this.components[compName] = null;
			}

			if(this.compCallback) {
				this.compCallback(this);
			}
		}

		/**
		 * Removes a component object from this Entity under the given name (if it exists).
		 * @param  {string} compName - Name of component.
		 */
		removeComponent(compName) {
			delete this.components[compName];

			if(this.compCallback) {
				this.compCallback(this);
			}
		}
	}

	module.exports = Entity;
});
