class DYNotifications extends DYElement {
	constructor(){
		super()
		DYNotifications.instance = this
	}

	notify(message, {dismiss, type = 'info', buttonText, id, icon} = {}){
		// Check if a notification already has this message.
		let $notification = [...this.$notifications].find($n =>
			(id && $n.dataset.id == id) || $n.content == message // && $this.childNodes.length === 0
		)
		
		if($notification){
			if(id && $notification.content != message){
				$notification.setContent(message)
			}
			$notification.remind(dismiss)
		}else{
			$notification = new DYNotification()
				.setContent(message)
				.attr({
					type,
					'data-id': id
				})
				.dismiss(dismiss)
				.appendTo(this)
		}

		if(buttonText) $notification.buttonText = buttonText
		if(icon) $notification.icon = icon

		return $notification
	}

	get $notifications(){
		return this.findAll('dy-notification')
	}
}
customElements.define('dy-notifications', DYNotifications)



class DYNotification extends DYElement {
	static get templateHTML(){
		return `
			<i class="icon"></i>
			<div class="inner-wrapper">
				<dy-button theme="accented heavy 3D small">OK</dy-button>
				<div class="content"></div>
			</div>
		`
	}

	constructor(){
		super()
		const root = this.root
	}
	
	connectedCallback(){
		this.$button.on('click', () => this.dismiss())
	}

	set content(content){
		this.$content.innerHTML = content
	}
	get content(){
		return this.$content.innerHTML
	}
	setContent(content){
		this.content = content
		return this
	}

	remind(dismiss){
		this
			.removeClass('hide')
			.triggerKeyframeAnimation('remind')
			.dismiss(dismiss || this.duration)
		return this
	}

	// .dismiss(duration)
	// .dismiss(promise)
	dismiss(){
		if(arguments.length){
			if(arguments[0] instanceof Promise){
				const promise = arguments[0]
				promise.then(() => {
					this.dismiss()
				})
			}else if(typeof arguments[0] === 'number'){
				this.duration = arguments[0]
				clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					this.dismiss()
				}, this.duration * 1000)
			}
		}else{
			this
				.addClass('hide')
				.removeClass('remind')
		}
		return this
	}

	get $button(){
		return this.root.find('dy-button')
	}
	set buttonText(text){
		if(text){
			this.$button.html(text)
		}
		return this
	}

	get $icon(){
		return this.root.find('.icon')
	}
	set icon(icon){
		this.$icon.attr('icon', icon)
		return this
	}

	get $content(){
		return this.find('.content')
	}
}
customElements.define('dy-notification', DYNotification)