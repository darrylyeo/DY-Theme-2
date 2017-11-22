class DYDate extends DYElement {
	static get templateHTML(){
		return `
			<time></time>
		`
	}
	
	static get observedAttributes() {
		return ['datetime', 'format']
	}

	attributeChangedCallback(attr, oldVal, newVal){
		const root = this.root

		const date = this.attr('datetime')
		if(!date) return

		let formattedDate
		switch(this.attr('format')){
			case 'short': default:
				formattedDate = moment(date).format('M/D/YY')
				break
			case 'full':
				formattedDate = moment(date).format('MMMM Do, YYYY')
				break
		}

		root.find('time')
			.html(formattedDate)
			.attr('datetime', date)
	}
}
customElements.define('dy-date', DYDate)