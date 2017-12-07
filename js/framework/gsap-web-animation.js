// WIP; use GSAP to "polyfill" Web Animations

Element.prototype.animate = function(keyframes, options = {}){
	let from, to
	if(Array.isArray(keyframes)){
		[from, to] = keyframes
	}else{
		from = {}
		to = {}
		for(const property in keyframes){
			from[property] = keyframes[property][0]
			to[property] = keyframes[property][1]
		}
	}

	const {duration, easing} = options
	TweenLite.fromTo(this, duration / 1000, from, Object.assign(to, {
		ease: easing,
		onComplete: () => this.trigger('finish')
	}))

	return this
}