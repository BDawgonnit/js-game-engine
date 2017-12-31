/**
 * ExampleEntityFactory module.
 * @module ExampleEntityFactory
 */

import EntityFactory from './ecs-framework/entityFactory.mjs'

const SpriteComponent = (function() {
	const _x = Symbol('_x')
	const _y = Symbol('_y')
	const _width = Symbol('_width')
	const _height = Symbol('_height')
	class SpriteComponent {
		constructor(x, y, width, height, frame, layer) {
			this.x = x
			this.y = y
			this.width = width
			this.height = height
			this.frame = frame
			this.layer = layer
			this.flipped = false
		}
		get x() {
			return this[_x]
		}
		set x(val) {
			this[_x] = val
			this.midPointX = val + this.halfWidth
		}

		get y() {
			return this[_y]
		}
		set y(val) {
			this[_y] = val
			this.midPointY = val + this.halfHeight
		}

		get width() {
			return this[_width]
		}
		set width(val) {
			this[_width] = val
			this.halfWidth = val / 2
			this.midPointX = this.x + this.halfWidth
		}

		get height() {
			return this[_height]
		}
		set height(val) {
			this[_height] = val
			this.halfHeight = val / 2
			this.midPointY = this.y + this.halfHeight
		}
	}

	return SpriteComponent
})()

const SpritePhysicsComponent = (function() {
	const _entity = Symbol('_x')
	const _spriteComp = Symbol('_x')
	class SpritePhysicsComponent {
		constructor(entity) {
			this[_entity] = entity
			this.accX = 0
			this.accY = 0
			this.spdX = 0
			this.spdY = 0
		}
		get [_spriteComp]() { return this[_entity].getComponent('sprite') }
		get x() { return this[_spriteComp].x }
		set x(val) { this[_spriteComp].x = val }
		get y() { return this[_spriteComp].y }
		set y(val) { this[_spriteComp].y = val }
		get width() { return this[_spriteComp].width }
		set width(val) { this[_spriteComp].width = val }
		get height() { return this[_spriteComp].height }
		set height(val) { this[_spriteComp].height = val }
		get midPointX() { return this[_spriteComp].midPointX }
		set midPointX(val) { this[_spriteComp].midPointX = val }
		get midPointY() { return this[_spriteComp].midPointY }
		set midPointY(val) { this[_spriteComp].midPointY = val }
		get halfWidth() { return this[_spriteComp].halfWidth }
		set halfWidth(val) { this[_spriteComp].halfWidth = val }
		get halfHeight() { return this[_spriteComp].halfHeight }
		set halfHeight(val) { this[_spriteComp].halfHeight = val }
	}

	return SpritePhysicsComponent
})()

const SpriteSoundComponent = (function() {
	const _entity = Symbol('_entity')
	const _spriteComp = Symbol('_spriteComp')
	const _x = Symbol('_x')
	const _y = Symbol('_y')
	const _followSprite = Symbol('_followSprite')
	const gainNodeMap = new WeakMap()

	class SpriteSoundComponent {
		constructor(src, entity) {
			this[_entity] = entity
			this.src = src
			this.play = false
			this.volume = 1
			this[_followSprite] = true
		}
		get [_spriteComp]() { return this[_entity].getComponent('sprite') }
		get followSprite() { return this[_followSprite] }
		set followSprite(val) {
			if(this[_followSprite] && !val) {
				this.x = this[_spriteComp].midPointX
				this.y = this[_spriteComp].midPointY
			}
			this[_followSprite] = val
		}
		get x() { return this.followSprite ? this[_spriteComp].midPointX : this[_x] }
		set x(val) { this[_x] = val }
		get y() { return this.followSprite ? this[_spriteComp].midPointY : this[_y] }
		set y(val) { this[_y] = val }
		set gainNode(val) {
			gainNodeMap.set(this, val)
		}
		get gainNode() {
			return gainNodeMap.get(this)
		}
	}

	return SpriteSoundComponent
})()

const StateComponent = (function() {
	const _state = Symbol('_symbol')
	class StateComponent {
		constructor(initialState) {
			this[_state] = null
			this.lastState = null
			this.lastUpdate = null
			this.grounded = false
			this.groundHit = false
			this.state = initialState
		}
		get state() {
			return this[_state]
		}
		set state(val) {
			this.lastState = this[_state]
			this[_state] = val
			this.lastUpdate = window.performance.now()
		}
	}

	return StateComponent
})()

/** Class representing a particular implementation of an EntityFactory. Not intended to be part of final game engine.
 * @extends EntityFactory
 */
export default class ExampleEntityFactory extends EntityFactory {

	/**
	 * Create an Entity instance of the given type.
	 * @param {string} entityType - Type of entity (key used to determine which constructor function to use to build entity).
	 * @param {Object} data - Plain object that represents an entity's components.
	 * @param {function} compCallback - Function to call after a component is added/removed or other changes are made that need to be observed.
	 * @returns {Entity}  A single Entity instance.
	 */
	create(entityType, data, compCallback) {
		let entity = super.create(entityType, data, compCallback)
		switch(entityType) {
			case 'Camera':
				entity.addComponent('camera', {
					x: data.x,
					y: data.y,
					width: data.width,
					height: data.height,
					mapX: data.mapX,
					mapY: data.mapY,
					mapWidth: data.mapWidth,
					mapHeight: data.mapHeight,
					get mapHalfWidth() { return this.mapWidth / 2 },
					get mapHalfHeight() { return this.mapHeight / 2 },
					get mapCenterX() { return this.mapX + this.mapHalfWidth },
					get mapCenterY() { return this.mapY + this.mapHalfHeight },
					following: data.following
				})
				break
			case 'Collision':
				entity.addComponent('staticPhysicsBody', {
					x: data.x,
					y: data.y,
					width: data.width,
					height: data.height,
					halfWidth: data.width / 2,
					halfHeight: data.height / 2,
					midPointX: data.x + (data.width / 2),
					midPointY: data.y + (data.height / 2)
				})
				break
			case 'PlayerSpawner':
				entity.addComponent('spawner', {
					entityType: 'Player',
					x: data.x,
					y: data.y,
					name: data.name
				})
				break
			case 'EntitySpawner':
				entity.addComponent('spawner', {
					entityType: 'Monster',
					x: data.x,
					y: data.y,
					name: data.name
				})
				break
			case 'Player':
			case 'Monster':
				entity.addComponent('spawned', {
					spawnerSource: data.spawnerSource
				})
				entity.addComponent('being', {
					type: entityType
				})
				entity.addComponent('state', new StateComponent('idle'))
				entity.addComponent('sprite', new SpriteComponent(
					data.x,
					data.y,
					data.width,
					data.height,
					(entityType === 'Player' ? 1 : 0),
					(entityType === 'Player' ? 'Player' : 'Platforms')
				))
				entity.addComponent('physicsBody', new SpritePhysicsComponent(entity))
				entity.addComponent('sound', new SpriteSoundComponent(null, entity))
		}
		return entity
	}
}