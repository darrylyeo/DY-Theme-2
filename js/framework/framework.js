const X = console.log

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const $$$ = function(name, options){
	const $el = document.createElement(name)
	if(options) $el.set(options)
	return $el
}

const delay = (fn, time = 0) => {
	return {
		function: fn,
		id: time ? setTimeout(fn, time) : requestAnimationFrame(fn),
		cancel(){
			(time ? clearTimeout : cancelAnimationFrame)(this.id)
		}
	}
}

const throttle = function(fn, time = 0){
	let timer
	let throttleNext = false

	function throttledFn(){
		if (!timer) {
			fn.apply(this, arguments)

			timer = delay(() => {
				if(throttleNext){
					fn.apply(this, arguments)
					throttleNext = false
				}
				timer = undefined
			}, time)
		}else{
			throttleNext = true
		}
	}

	throttledFn.cancel = () => {
		timer.cancel()
		timer = undefined
	}

	return throttledFn
}

const debounce = (fn, time = 0) => {
	let timer

	function debouncedFn() {
		if(!timer) {
			timer = delay(() => {
				fn.apply(this, arguments)
				timer = undefined
			}, time)
		}
	}

	debouncedFn.cancel = () => {
		timer.cancel()
		timer = undefined
	}

	return debouncedFn
}

const interval = (fn, time = 0, useRAF = false) => {
	if(time > 0){
		const stop = () => clearInterval(i)
		const i = setInterval(() => {
			if(useRAF){
				delay(() => fn(stop))
			}else{
				fn(stop)
			}
		}, time)
		return i
	}else{
		let isRunning = true
		const stop = () => isRunning = false
		const call = () => {
			fn(stop)
			if(isRunning) requestAnimationFrame(call)
		}
		call()
	}
}



Object.difference = function(o1, o2){
	const difference = {}
	for(const p in o1){
		if(o1[p] !== o2[p]){
			difference[p] = [ o1[p], o2[p] ]
		}
	}
	return difference
}


// http://stackoverflow.com/a/3561711
RegExp.escape = function(s) {
	return String(s).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}


/*
"abc".replaceAll("a", "1") // "1bc"
"abc".replaceAll(["a", "c"], "1") // "1b1"
"abc".replaceAll({"a": "1", "c": "3"}, "1") // "1b3"
*/
String.prototype.replaceAll = function(replace, replaceWith) {
	if (typeof replace === 'string') {
		return this.replace(new RegExp(RegExp.escape(replace), 'gi'), replaceWith)
	} else if (Array.isArray(replace)) {
		let s = this
		for (let replaceString of replace) {
			s = s.replaceAll(replaceString, replaceWith)
		}
		return s
	} else if (typeof replace === 'object') {
		let s = this
		for (let r in replace) {
			s = s.replaceAll(r, replace[r])
		}
		return s
	}
	return this
}


Array.prototype.mapSort = function(map, sort = (a, b) => a < b ? -1 : 1){
	let i = 0
	return this.sort((a, b) => sort(map.call(this, a, i, this), map.call(this, b, i++, this)))
}
Array.prototype.flatten = function(deep = false){
	const array = deep
		? this.map(x => Array.isArray(x) ? x.flatten() : x)
		: this
	return [].concat(...array)
}
Array.prototype.unique = function(){
	return [...new Set(this)]
}


Set.prototype.toggle = function(add, ...objects){
	if(typeof arguments[0] === 'boolean'){
		this[add ? 'add' : 'delete'](...objects)
	}else{
		for(const object of arguments){
			this[this.has(object) ? 'delete' : 'add'](object)
		}
	}
	return this
}


class TwoWayWeakMap extends WeakMap {
	set(key, value){
		super.set(key, value)
		super.set(value, key)
	}
}


Promise.resolver = () => {
	let resolver
	const animatePromise = new Promise(resolve => resolver = resolve)
	return resolver
}



{

function keyValueSignature(arguments){
	if(arguments.length >= 2){
		const [key, value] = arguments
		return {[key]: value}
	}else if(arguments.length === 1 && arguments[0] instanceof Object){
		return arguments[0]
	}
}

Object.assign(Node.prototype, {
	prependChild($child){
		this.insertAdjacentElement('afterbegin', $child)
		return this
	},

	append($child){
		if(arguments[0] instanceof NodeList){
			for(const $child of arguments[0]){
				this.appendChild($child)
			}
		}else{
			this.appendChild($child)
		}
		return this
	},

	prependTo($parent){
		$parent.prependChild(this)
		return this
	},

	appendTo($parent){
		$parent.append(this)
		return this
	},

	empty(){
		while (this.firstChild) {
			this.removeChild(this.firstChild)
		}
		return this
	},

	clone(deep = true){
		return this.cloneNode(deep)
	}
})

Object.defineProperties(Element.prototype, Object.getOwnPropertyDescriptors({
	//set({id, class: classNames, html, text, attr, css, on, $parent, ...props} = {}){
	set(options){
		const {id, class: classNames, html, text, attr, css, on, $parent} = options
		const properties = ['id', 'class', 'html', 'text', 'attr', 'css', 'on', '$parent']

		if(text) this.text(text)
		if(html) this.html(html)
		if(attr) this.attr(attr)
		if(css) this.css(css)
		if(on) this.on(on)
		if(classNames) this.addClass(...classNames)
		if($parent) this.appendTo($parent)

		for(const [p, v] of Object.entries(options)){
			if(!properties.includes(p)) this[p] = v
		}
		//Object.assign(this, props)

		return this
	},

	hasClass(c){
		return this.classList.contains(c)
	},

	addClass(...classes){
		for(const className of classes){
			this.classList.add(className)
		}
		return this
	},

	removeClass(...classes){
		for(const className of classes){
			this.classList.remove(className)
		}
		return this
	},
	
	toggleClass(addClass, ...classes){
		if(typeof arguments[0] === 'boolean'){
			for(const className of classes){
				this.classList[addClass ? 'add' : 'remove'](className)
			}
		}else{
			for(const className of arguments){
				this.classList.toggle(className)
			}
		}
		return this
	},

	attr(attr){
		const attrs = keyValueSignature(arguments)
		if(!attrs) return this.getAttribute(attr)

		for(attr in attrs){
			const value = attrs[attr]
			if(value === null || typeof value === 'undefined'){
				this.removeAttribute(attr)
			}else if(attr === 'style' && typeof value === 'object'){
				this.css(value)
			}else{
				this.setAttribute(attr, value)
			}
		}
		return this
	},
	
	toggleAttr(add, ...attrs){
		if(typeof arguments[0] === 'boolean'){
			for(const attr of attrs){
				this.attr(attr, add ? '' : undefined)
			}
		}else{
			for(const attr of attrs){
				this.attr(attr, this.hasAttribute(attr) ? '' : undefined)
			}
		}
		return this
	},

	css(prop){
		const props = keyValueSignature(arguments)
		if(!props){
			if(prop.includes('-')){
				return this.style.getPropertyValue(prop)
			}else{
				return this.style[prop]
			}
		}
	
		for(prop in props){
			const value = props[prop]
			if(prop.includes('-')){
				this.style.setProperty(prop, value)
			}else{
				this.style[prop] = value
			}
		}
		return this
	},

	html(html){
		this.innerHTML = html
		return this
	},

	text(text){
		this.innerText = text
		return this
	},
	
	get clientRight(){
		return this.clientLeft + this.clientWidth
	},
	
	get clientBottom(){
		return this.clientTop + this.clientHeight
	},
	
	get rect(){
		return this.getBoundingClientRect()
	},
	
	get left(){
		return this.rect.left
	},
	
	get right(){
		return this.rect.right
	},
	
	get top(){
		return this.rect.top
	},
	
	get bottom(){
		return this.rect.bottom
	},
	
	get width(){
		return this._width || this.rect.width
	},
	set width(width){
		this._width = width
	},
	
	get height(){
		return this._height || this.rect.height
	},
	set height(height){
		return this._height = height
	},
	
	get centerX(){
		return this.left + this.width/2
	},
	
	get centerY(){
		return this.top + this.height/2
	},
	
	get offsetCenterX(){
		return this.offsetLeft + this.offsetWidth/2
	},
	
	get offsetCenterY(){
		return this.offsetTop + this.offsetHeight/2
	},
	
	get computedStyle(){
		return window.getComputedStyle(this)
	},

	animateScrollY(y = 0, speedFactor = 0.2){
		y = Math.ceil(y)
	
		interval(stop => {
			const dy = Math.max(
				Math.abs(y - this.scrollTop) * speedFactor,
				Math.min( Math.abs(this.scrollTop - y), 1.5 )
			) * Math.sign(y - this.scrollTop)
			
			this.scrollTop = this.scrollTop + dy
			
			if(Math.abs(this.scrollTop - y) <= dy){
				this.scrollTop = y
				stop()
			}
		})
	
		return interval
	},

	triggerKeyframeAnimation(...classes){
		this.removeClass(...classes)
		this.width
		this.addClass(...classes)
		return this
	},
}))

for(const Class of [Document, Element, DocumentFragment]){
	Object.assign(Class.prototype, {
		find: Class.prototype.querySelector,
		findAll: Class.prototype.querySelectorAll,

		updateWithModel(model){
			for(const handle in model){
				const value = model[handle]
				let attributeMatch
				if(handle.includes('[') && (attributeMatch = handle.match(/(.+?)\[([^=\]]+?)]$/))){
					const [, selector, attrName] = attributeMatch
					for(const $element of this.findAll(selector)){
						if(attrName === 'style' && typeof value === 'object'){
							$element.css(value)
						}else{
							$element.attr(attrName, value)
						}
					}
				}else{
					this.findAll(handle).html(value)
				}
			}
			return this
		}
	})
}

Object.assign(EventTarget.prototype, {
	on(){
		const eventListeners = keyValueSignature(arguments)
		for(const eventName in eventListeners){
			const callback = eventListeners[eventName]
			this.addEventListener(eventName, callback, eventName === 'scroll' ? {passive: true} : undefined)
		}
	},
	
	trigger(event, options){
		if(typeof event === 'string'){
			event = new Event(event, options)
		}
		this.dispatchEvent(event)
		return this
	}
})

for(const Class of [NodeList, HTMLCollection]){
	Class.prototype.filter = function(){
		if(typeof arguments[0] === 'function'){
			const callback = arguments[0]
			return [...this].filter(callback)
		}else if(typeof arguments[0] === 'string'){
			const selector = arguments[0]
			return [...this].filter($element => $element.matches(selector))
		}
	}
	
	for(const method in Element.prototype){
		if(!(method in Class.prototype)){
			Class.prototype[method] = function(){
				let returnValue
				let isChaining = true
				for(const $element of this){
					const value = typeof $element[method] === 'function' ? $element[method](...arguments) : $element[method]
					if(value !== $element) isChaining = false
					returnValue = returnValue || value
				}
				return isChaining ? this : returnValue
			}
		}
	}
}

}