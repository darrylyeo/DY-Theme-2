class DYSidebar extends DYElement {
	static get templateHTML(){
		return `
			<aside>
				<section>
					<dy-terms></dy-terms>
				</section>
				<section>
					<dy-table-of-contents></dy-table-of-contents>
				</section>
				<section>
					<dy-subscribe class="anchor-bottom"></dy-subscribe>
				</section>
			</aside>
		`
	}

	connectedCallback(){
		this.root

		DYNav.instance.connectTerms(this.$termsContainer)
	}

	get $termsContainer(){
		return this.find('dy-terms')
	}

	get $tableOfContents(){
		return this.root.find('dy-table-of-contents')
	}
}
customElements.define('dy-sidebar', DYSidebar)