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
			const href = `${WP.parentTheme}/icons/icons.svg#${iconName}`
			this.$icon.innerHTML = `<use href="${href}" xlink:href="${href}"/>`
		}
	}
	get $icon(){
		return this.root.find('.icon')
	}
}

customElements.define('dy-icon', DYIcon)