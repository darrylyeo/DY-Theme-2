const defaultStyles = [
	// './wp-content/themes/DY/assets/css.css',
	// './wp-content/themes/DY/assets/copyright.css'
]

class DYStyle extends HTMLElement/*HTMLStyleElement*/ {
	connectedCallback(){
		DYStyle.instances.add(this)
		this.html(this.constructor.contents)
	}

	static add(...styles){
		this.styles.add(...styles)
		this.updateAll()
	}
	static remove(...styles){
		this.styles.delete(...styles)
		this.updateAll()
	}
	static toggle(add, ...styles){
		this.styles.toggle(...arguments)
		this.updateAll()
	}

	static updateAll(){
		const contents = this.contents
		for(const $dyStyle of this.instances){
			$dyStyle.html(contents)
		}
	}

	static get contents(){
		return `<style>${ [...this.styles].map(url => `@import'${url}';`).join('') } </style>`
	}
}
DYStyle.styles = new Set(defaultStyles)
DYStyle.instances = new Set()

customElements.define('dy-style', DYStyle)