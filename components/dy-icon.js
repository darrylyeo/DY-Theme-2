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
		documentReady.then(() => {
		const root = this.root

		if(attr === 'icon'){
			const iconName = newVal
			//this.$icon.addClass(iconName)

			root.updateWithModel({
				//'.icon[class]': iconName,
				'.icon': `<use href="${WP.parentTheme}/assets/icons.svg#${iconName}"/>`
				//'.icon use[href]': `${WP.parentTheme}/assets/icons.svg#${iconName}`
			})
		}
		})
	}
	get $icon(){
		return this.root.find('.icon')
	}
}

customElements.define('dy-icon', DYIcon)