
class DYButton extends DYElement {
	connectedCallback(){
		this.tabIndex = 0

		this.on('keydown', e => {
			if(e.key === 'Enter'){
				this.trigger('click')
			}
		})
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