class DYButtons extends DYElement {
	connectedCallback(){
		this.on({
			'dy-button-click': e => {
				const $targetButton = e.target

				const mode = this.attr('mode')
				if(mode === 'select'){
					for(const $button of this.$buttons){
						$button.active = $button === $targetButton
					}
					this.trigger('dy-buttons-select', {bubbles: true})
				}
			}
		})
	}

	get $buttons(){
		return this.findAll('dy-button')
	}

	get $active(){
		return [...this.$buttons].filter($b => $b.active)
	}
}
customElements.define('dy-buttons', DYButtons)


class DYButton extends DYElement {
	constructor(){
		super()

		this.on({
			keydown: e => {
				if(e.key === 'Enter'){
					this.trigger('click')
				}
			},
			click: e => {
				if(this.toggleable) this.active = !this.active
				this.trigger('dy-button-click', {bubbles: true})
			}
		})
	}

	connectedCallback(){
		if(this.parentNode.matches('a')) this.parentNode.tabIndex = -1
		this.tabIndex = 0
	}

	set disabled(disabled){
		this.toggleAttr(disabled, 'disabled')
		this.tabIndex = disabled ? -1 : 0
	}
	get disabled(){
		return this.hasAttribute('disabled')
	}

	set toggleable(toggleable){
		this.toggleAttr(toggleable, 'toggleable')
	}
	get toggleable(){
		return this.hasAttribute('toggleable')
	}

	set active(active){
		this.toggleAttr(active, 'active')
	}
	get active(){
		return this.hasAttribute('active')
	}
}
customElements.define('dy-button', DYButton)