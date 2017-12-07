class DYIcon extends DYElement {
	static get templateHTML(){
		return `
			<svg class="icon">
				<use />
			</svg>
		`
	}

	static get observedAttributes() {
		return ['icon']
	}

	attributeChangedCallback(attr, oldVal, newVal){
		if(attr === 'icon'){
			const iconName = newVal
			this.$icon.innerHTML = `<use href="${WP.parentTheme}/icons/icons.svg#${iconName}"/>`
		}
	}
	get $icon(){
		return this.root.find('.icon')
	}
}

customElements.define('dy-icon', DYIcon)