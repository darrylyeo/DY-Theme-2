class DYSidebar extends DYElement {
	static get templateHTML(){
		return `
			<aside>
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
	}

	get $tableOfContents(){
		return this.root.find('dy-table-of-contents')
	}
}
customElements.define('dy-sidebar', DYSidebar)