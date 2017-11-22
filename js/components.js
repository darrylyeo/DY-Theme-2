class DYElement extends HTMLElement {
	get root(){
		//if(this.shadowRoot) return this.shadowRoot

		//this.html(this.constructor.templateHTML)
		//return this.attachShadow({mode: 'open'})


		if(this._initialized) return this

		this.html(this.constructor.templateHTML)
		DYNavigation.processLinks(this.findAll('a'))

		this._initialized = true
		return this
	}
}