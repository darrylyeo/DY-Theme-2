const experimentFunctions = {
	'night-mode'(active){
		const nightModeReplace = {
			'#ffffff': '#272727',
			'#fff': '#272727',
			'white': '#272727',
			'255, 255, 255': '39,39,39',
			'255,255,255': '39,39,39',
			'250,250,250': '39,39,39',
			'245,245,245': '39,39,39',
			//'#fefefe': '#282828',
			'#fafafa': '#323232',
			//'#f9f9f9': '#333333',
			'#f6f6f6': '#363636',
			'246, 246, 246': '#363636',
			///'#f1f2f2': '#3a3a3a',
			//'#f2efef': '#3d3d3',
			//'#ebeaea': '#434343',
			'#e5e5e5': '#575757',
			//'#e0dede': '#5e5e5e',
			//'#dcdadb': '#616362',
			//'#d2d3d4': '#2D2C2B',
			//'210, 211, 212': '#2D2C2B',
			//'#d2d2d2': '#6a6a6a',
			'#747474': '#8C8989',
			//'background-color:#333': 'background-color:#E4E4E4',
			//'border-color:#333': 'border-color:#E4E4E4',
			'#333333': '#BFBFBF',
			'#333': '#BFBFBF',
			'50,50,50': '255, 255, 255',
			'21,21,21': '255, 255, 255',
			'#000000': '#ffffff',
			'#000': '#fff',
			'0, 0, 0': '255, 255, 255',
			'0,0,0': '255, 255, 255',
			'black;': 'white;',
		}
		Object.keys(nightModeReplace).forEach((key, i) => {
			nightModeReplace[key] += ` /** ${i} **/`
		})

		const reverseNightModeReplace = {}
		for(const k in nightModeReplace){
			reverseNightModeReplace[nightModeReplace[k]] = k
		}

		const replace = active ? nightModeReplace : reverseNightModeReplace

		// for(const $this of $$('header, main, style')){
		// 	$this.html($this.html().replaceAll(replace))
		// }
		for(const $style of $$('style')){
			$style.innerHTML = $style.innerHTML.replaceAll(replace)
		}
		
		document.body
			//.attr('style', (document.body.attr('style') || '').replaceAll(replace))
			.toggleClass(active, 'night-mode')
	},

	'pin-window'(active){
		let {screenX, screenY} = window
		interval(() => {
			if(screenX !== window.screenX || screenY !== window.screenY){
				$('body').css({
					'min-width': screen.width + 'px',
					'min-height': screen.height + 'px',
					transform: `translate(${-screenX}px, ${-screenY}px)`,
					transition: 'none'
				})

				screenX = window.screenX
				screenY = window.screenY
			}
		})
	},

	'edit-mode'(active){
		document.designMode = active ? 'on' : 'off'
	},

	'information-overload'(active){
		const notify = (message, options) => window.notify(message, Object.assign(options, {dismiss: 20}))
		if(active) document.on({
			click: e => notify(`Clicked <code>&lt;${e.path[0].tagName.toLowerCase()}></code> at ${e.x}, ${e.y}.`, {id: 'click'}),
			dblclick: e => notify(`Double-clicked <code>&lt;${e.path[0].tagName.toLowerCase()}></code> at ${e.x}, ${e.y}.`, {id: 'dblclick'}),
			contextmenu: e => notify(`Right-clicked <code>&lt;${e.path[0].tagName.toLowerCase()}></code> at ${e.x}, ${e.y}.`, {id: 'contextmenu'}),
			mousedown: e => notify(`Mouse pressed at ${e.x}, ${e.y}.`, {id: 'mousedown', icon: '🖱'}),
			mouseup: e => notify(`Mouse released at ${e.x}, ${e.y}.`, {id: 'mouseup', icon: '🖱'}),
			mousemove: throttle(e => notify(`Mouse moved to ${e.x}, ${e.y}.`, {id: 'mousemove', icon: 'move'}), 10),
			mouseenter: e => notify(`Mouse entered page at ${e.x}, ${e.y}.`, {id: 'mouseenter'}),
			mouseleave: e => notify(`Mouse exited page at ${e.x}, ${e.y}.`, {id: 'mouseleave', icon: '🚪 '}),
			touchstart: e => notify(`Touched down at ${e.targetTouches[0].pageX | 0}, ${e.targetTouches[0].pageY | 0}.`, {id: 'touchstart', icon: '👆'}),
			touchmove: e => notify(`Touch moved to ${e.targetTouches[0].pageX | 0}, ${e.targetTouches[0].pageY | 0}.`, {id: 'touchmove', icon: 'move'}),
			touchend: e => notify(`Touched up.`, {id: 'touchend', icon: '👆'}),
			keydown: e => notify(`Pressed <kbd>${e.key}</kbd> (${e.code}) key.`, {id: 'keydown', icon: '⌨'}),
			keyup: e => notify(`Released <kbd>${e.key}</kbd> (${e.code}) key.`, {id: 'keyup', icon: '⌨'}),
			//keydown: e => notify(`Pressed ${e.code}${e.key.length === 1 ? ` <code>${e.key}</code>` : ''}${e.code.startsWith('Key') ? '' : ` key`}.`, {id: 'keydown'}),
			//keyup: e => notify(`Released ${e.code}${e.key.length === 1 ? ` <code>${e.key}</code>` : ''}${e.code.startsWith('Key') ? '' : ` key`}.`, {id: 'keyup'}),
			resize: e => notify(`Page resized to ${window.innerWidth}x${window.innerHeight}.`, {id: 'resize'}),
			beforeunload: e => notify(`Leaving page.`, {id: 'beforeunload'}),
			visibilitychange: e => notify(`Page became ${document.visibilityState}.`, {id: 'beforeunload', icon: '👁'}),
			select: e => notify(`Text selected: <output>${window.getSelection()}</output>`, {id: 'select'}),
			cut: e => notify(`Text cut: <output>${window.getSelection()}</output>`, {id: 'cut', icon: '✂️'}),
			copy: e => notify(`Text copy: <output>${window.getSelection()}</output>`, {id: 'copy'}),
			paste: e => notify(`Text pasted: <output>${e.clipboardData.getData('text')}</output>`, {id: 'paste', icon: '📋'}),
			wheel: throttle(e => notify(`Mouse scrolled.`, {id: 'wheel'}), 200),
			beforeprint: e => notify(`Opened print dialog`, {id: 'print', icon: '🖨 '}),
			afterprint: e => notify(`Closed print dialog.`, {id: 'print', icon: '🖨 '}),
			orientationchange: e => notify(`Device is now in ${window.screen.orientation.type.split('-')[0]} orientation with an angle of ${window.screen.orientation.angle}.`, {id: 'orientationchange'}),
			deviceorientation: e => notify(`Device rotated to ${e.beta} ${e.gamma} ${e.alpha}.`, {id: 'deviceorientation'}),
			devicemotion: (e, a = e.acceleration || e.accelerationIncludingGravity) => notify(`Device accelerated by ${a.x} ${a.y} ${a.z}.`, {id: 'devicemotion'}),
			devicelight: e => notify(`Ambient light is ${e.value} Lux.`, {id: 'devicelight', icon: '💡'}),
		})
	},

	'battery-status'(active){
		if(active && 'getBattery' in navigator) navigator.getBattery().then(battery => {
			const notifyBatteryStatus = () => {
				const {level, charging, chargingTime, dischargingTime} = battery
				const time = charging ? chargingTime : dischargingTime
				const timeFromNow = moment().add(time, 's').fromNow()
		
				if(level < 1.00){
					notify(
						`Your battery level is at ${(level * 100).toFixed(1)}%${
							isFinite(time)
								? charging
									? ` and will be fully charged ${timeFromNow}`
									: ` and will be depleted ${timeFromNow}`
								: ''
						}.`,
						{
							id: 'battery',
							buttonText: 'Got it!',
							icon: '🔋'
						}
					)
				}else{
					notify(
						'Your battery is fully charged.',
						{
							id: 'battery',
							buttonText: 'Got it!',
							icon: '🔋'
						}
					)
				}
			}
		
			notifyBatteryStatus()
			battery.on('chargingchange chargingtimechange dischargingtimechange levelchange', notifyBatteryStatus)
		})
	}
}


class DYExperiment {
	constructor(handle, callback){
		this.handle = handle
		if(callback){
			this.callback = callback
		}

		if(this.$toggle) this.$toggle.on('click', () => this.toggle())
		this.update()

		// Clear experiments with the "e" key
		document.on('keyup', e => {
			if(e.key === 'e'){
				this.toggle(false)
			}
		})
	}

	toggle(isActive = !this.isActive){
		this.isActive = isActive
	}

	update(){
		const isActive = this.isActive

		// $toggle's .active class
		if(this.$toggle) this.$toggle.toggleClass(isActive, 'active')

		// Global stylesheet
		DYStyle.toggle(isActive, this.stylesheet)

		// Callback
		if(this.callback){
			this.callback(isActive)
		}
	}

	static get $toggles(){
		return $('#experiments').findAll('a')
	}
	get $toggle(){
		return [...this.constructor.$toggles].find($toggle => $toggle.dataset.experiment === this.handle)
	}
	get $toggleIcon(){
		return this.$toggle && this.$toggle.find('[icon]')
	}

	get name(){
		return this.$toggle.text
	}
	get stylesheet(){
		return `${WP.childTheme}/experiments/${this.handle}.css`
	}
	get isActive(){
		return !!DYExperiment.data[this.handle]
	}
	set isActive(isActive){
		const wasActive = this.isActive

		DYExperiment.data[this.handle] = isActive

		if(wasActive !== isActive){
			notify(`${this.name} experiment ${isActive ? 'activated' : 'deactivated'}.`, {
				id: this.name,
				dismiss: isActive ? undefined : 5,
				icon: this.$toggleIcon && this.$toggleIcon.attr('icon')
			})
			if(isActive){
				notify('Press <kbd>e</kbd> at any time to disable all experiments.')
			}
			this.update()
		}
	}
}


DY.data('experiments').then(experiments => {
	DYExperiment.data = experiments

	for(const $toggle of DYExperiment.$toggles){
		const handle = $toggle.dataset.experiment
		$toggle.tabIndex = 0
		new DYExperiment(handle, experimentFunctions[handle])
	}
})