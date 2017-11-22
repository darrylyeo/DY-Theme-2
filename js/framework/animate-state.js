class StateAnimation {
	constructor(changeCallback, options = {}){
		Object.assign(this, {
			changeCallback,
			change: Promise.resolver(),
			animate: Promise.resolver(),
			options
		})
	}

	run(){
		this.changeCallback()
		this.change()
		this.animate()
		return this
	}
}

Object.assign(Element.prototype, {
	changePositionMode(toMode, {preserveSize = true, useTranslate = true} = {}){	
		const style = window.getComputedStyle(this)
		const fromMode = style.position
		
		if(fromMode === toMode) return
		
		const newStyle = { position: toMode }
		
		if(preserveSize){
			newStyle.width = this.offsetWidth + 'px'
			newStyle.height = this.offsetHeight + 'px'
		}
		
		const transform = style.transform
		if(transform !== 'none'){
			newStyle.transform = transform
			this.style.transform = 'none'
		}
		
		let x, y
		
		if(toMode === 'absolute'){
			x = this.offsetLeft
			y = this.offsetTop
		}else if(toMode === 'fixed'){
			const rect = this.getBoundingClientRect()
			x = rect.left
			y = rect.top
		}else if(toMode === 'relative'){
			x = this.offsetLeft
			y = this.offsetTop
			
			this.style.position = 'static'
			
			x -= this.offsetLeft
			y -= this.offsetTop
		}
	
		if(fromMode === 'fixed'){
			this.style.position = 'static'
			
			const parentRect = this.offsetParent.getBoundingClientRect()
			x -= parentRect.left
			y -= parentRect.top
		}
		
		if(toMode === 'static'){
			/*x = style.left === 'auto' ?
				`${x}px` :
				`calc(${x}px - ${style.left})`
			y = style.top === 'auto' ?
				`${y}px` :
				`calc(${y}px - ${style.top})`*/
			newStyle.transform = `translate(${x}px, ${y}px) ${transform === 'none' ? '' : transform}`
		}else{
			newStyle.left = x + 'px'
			newStyle.top = y + 'px'
		}
		
		//Object.assign(this.style, newStyle)
		return newStyle
	},

	getState(props){
		const {
			width = !!props.size,
			height = !!props.size,

			position = false,

			style = []
		} = props

		const state = {
			$element: this
		}
		
		if(width) state.width = this.width
		if(height) state.height = this.height
		
		if(position){
			state.position = {
				left: this.left,
				top: this.top
			}
			if(Array.isArray(style)) style.push('transform')
		}

		if(style === true || style.length){
			const computedStyle = window.getComputedStyle(this)

			if(Array.isArray(style)){
				state.style = {}
				for(const prop of style){
					state.style[prop] = computedStyle[prop]
				}
				
			}else{
				state.style = Object.assign({}, computedStyle)
			}
		}

		return state
	},

	async animateState(props, {change, animate, options = {}}){
		const state1 = this.getState(props)
		await change
		const state2 = this.getState(props)
		await animate

		if(!options.duration || !options.easing){
			const computedStyle = window.getComputedStyle(this)
			options.duration = options.duration || parseInt(computedStyle.transitionDuration) || 500
			options.easing = options.easing || computedStyle.transitionTimingFunction.split(', ')[0] || 'ease'
		}

		const animations = (this._stateAnimations = this._stateAnimations || [])
		for(const prop in state1){
			if(animations[prop]){
				animations[prop].cancel()
			}

			let keyframes

			switch(prop){
			case 'position':
				const dx = state1.position.left - state2.position.left
				const dy = state1.position.top - state2.position.top

				const transform1 = state1.style.transform

				keyframes = {
					transform: [
						`translate(${dx}px, ${dy}px) ${transform1 === 'none' ? '' : transform1}`,
						state2.style.transform
					]
				}
				delete state1.style.transform
				delete state2.style.transform
				break
			case 'width':
				keyframes = {
					width: [
						state1.width + 'px',
						state2.width + 'px'
					],
					gridTemplateColumns: ['auto', 'auto']
					// minWidth: ['initial', 'initial'],
					// maxWidth: ['initial', 'initial'],
				}
				break
			case 'height':
				keyframes = {
					height: [
						state1.height + 'px',
						state2.height + 'px'
					],
					// minHeight: ['initial', 'initial'],
					// maxHeight: ['initial', 'initial']
				}
				break
			case 'style':
				keyframes = Object.difference(state1.style, state2.style)
			default:
				continue
			}

			const animatingClass = `animating-${prop}`
			this.addClass(animatingClass)

			animations[prop] = this
				.animate(keyframes, options)
				.on('finish', () => this.removeClass(animatingClass), {once: true})
		}
	},
	
	/*animateStyleChange(callback, duration = 500){
		const beforeStyle = Object.assign({}, window.getComputedStyle(this))
	
		if(this._styleChangeAnimation) this._styleChangeAnimation.cancel()
	
		const then = () => {	
			const afterStyle = Object.assign({}, window.getComputedStyle(this))
	
			const styleDifference = {}
			for(const property in beforeStyle){
				if(beforeStyle[property] !== afterStyle[property]){
					styleDifference[property] = [
						beforeStyle[property],
						afterStyle[property]
					]
				}
			}
	
			this._styleChangeAnimation = this.animate(styleDifference, {
				duration: duration || parseInt(afterStyle.transitionDuration),
			})
		}
	
		if(callback instanceof Function){
			callback.call(this)
			then()
		}else if(callback instanceof Promise){
			callback.then(then)
		}
	
		return this
	},

	animatePositionChange(callback, duration = 500){
		const beforeLeft = this.left
		const beforeTop = this.top
		const beforeTransform = this.style.transform === 'none' ? '' : this.style.transform
	
		if(this._positionChangeAnimation) this._positionChangeAnimation.cancel()
	
		const then = () => {	
			const afterLeft = this.left
			const afterTop = this.top
	
			const computedStyle = window.getComputedStyle(this)
	
			this._positionChangeAnimation = this.animate({
				transform: [
					`translate(${beforeLeft - afterLeft}px, ${beforeTop - afterTop}px) ${beforeTransform}`,
					computedStyle.transform
				]
			}, {
				duration: duration || parseInt(computedStyle.transitionDuration),
				easing: computedStyle.transitionTimingFunction.split(', ')[0] || 'ease'
			})
		}
	
		if(callback instanceof Function){
			callback.call(this)
			delay(then)
		}else if(callback instanceof Promise){
			callback.then(then)
		}
	
		return this
	},

	animateSizeChange(callback, duration = 5000){
		const beforeWidth = this.width
		const beforeHeight = this.height
	
		if(this._sizeChangeAnimation) this._sizeChangeAnimation.cancel()
	
		const then = () => {	
			const afterWidth = this.width
			const afterHeight = this.height

			const computedStyle = window.getComputedStyle(this)
	
			this._sizeChangeAnimation = this.animate({
				width: [
					beforeWidth + 'px',
					afterWidth + 'px'
				],
				height: [
					beforeHeight + 'px',
					afterHeight + 'px'
				],
				// minWidth: ['initial', 'initial'],
				// minHeight: ['initial', 'initial'],
				// maxWidth: ['initial', 'initial'],
				// maxHeight: ['initial', 'initial']
			}, {
				duration: duration || parseInt(computedStyle.transitionDuration),
				easing: computedStyle.transitionTimingFunction.split(', ')[0] || 'ease'
			})
		}
	
		if(callback instanceof Function){
			callback.call(this)
			delay(then)
		}else if(callback instanceof Promise){
			callback.then(then)
		}
	
		return this
	}*/
})