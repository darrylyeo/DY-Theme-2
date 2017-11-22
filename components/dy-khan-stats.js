class DYKhanStats extends DYElement {
	static get templateHTML(){
		return `
			<span class="votes"><span class="value"></span> Votes</span>
			<span class="spin-offs"><span class="value"></span> Spin-offs</span>
			<span class="lines"><span class="value"></span> Lines</span>
		`
	}
	
	static get observedAttributes() {
		return ['votes', 'spin-offs', 'lines']
	}

	attributeChangedCallback(attr, oldVal, newVal){
		const root = this.root

		this.updateWithModel({
			[`.${attr} .value`]: newVal
		})
	}
}
customElements.define('dy-khan-stats', DYKhanStats)