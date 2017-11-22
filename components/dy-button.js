
class DYButton extends DYElement {
	connectedCallback(){
		this.tabIndex = 0

		this.on('keydown', e => {
			if(e.key === 'Enter'){
				this.trigger('click')
			}
		})
	}
}
customElements.define('dy-button', DYButton)