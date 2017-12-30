
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
		this.attr('disabled', disabled ? '' : undefined)
	}
	get disabled(){
		return this.attr('disabled')
	}
}
customElements.define('dy-button', DYButton)