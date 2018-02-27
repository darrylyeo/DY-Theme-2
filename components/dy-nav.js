class DYNav extends DYElement {
	static get templateHTML(){
		return `
			<div class="inner-wrapper">
				<h1 class="current-title"></h1>
				<div class="prev-next">
					<a rel="prev"></a>
					<div class="current-term"></div>
					<a rel="next"></a>
				</div>
			</div>
		`
	}

	connectedCallback(){
		const root = this.root

		DYNav.instance = this

		//window.on('pagerender', () => this.update())

		DY.data('navigation').then(navigation => this.data = navigation)
	}

	// <dy-terms>
	async connectTerms($termsContainer){
		await $termsContainer.initialize(WP.current.terms)
		
		$termsContainer.$terms.on('click', ({target: $term}) => {
			const termID = $termsContainer.map.get($term).term_id
			if(this.currentTerm === termID){
				this.currentTerm = undefined
				$term.active = false
			}else{
				this.currentTerm = termID
				for(const $term of $termsContainer.$terms) $term.active = false
				$term.active = true
			}
		})
		this.update()
	}

	async update(termChanged){
		const isSinglePost = WP.queryType === 'single' && WP.postType !== 'page'
		if(!isSinglePost) return

		const currentPost = WP.current

		const posts = (await DY.getObjectsByType(WP.postType))
			.filter(post => post.terms.includes(this.currentTerm))
		const i = posts.findIndex(post => post.id === WP.current.id)
		const l = posts.length

		if(l <= 1) return

		const previousPost = posts[(i + l - 1) % l]
		const nextPost = posts[(i + 1) % l]

		const term = await DY.getTermById(this.currentTerm)

		this.updateWithModel({
			'.current-title': currentPost.title.rendered,
			'[rel=prev]': previousPost ? previousPost.title.rendered : '',
			'[rel=prev][href]': previousPost ? previousPost.link : '',
			'[rel=next]': nextPost ? nextPost.title.rendered : '',
			'[rel=next][href]': nextPost ? nextPost.link : '',
		})

		this.$currentTermWrapper.empty()
			.append(DYTerms.make$Term(term))
	
		if(termChanged) notify(`You're navigating projects tagged ${this.$currentTermWrapper.innerHTML}. Enjoy!`, {
			id: 'navigation_term',
			//icon: '🔖'
			icon: '🏷'
		})
	}

	get currentCategory(){
		const {data} = this
		return data.category &&  WP.current.categories.includes(data.category)
			? data.category
			: WP.current.categories[0]
	}
	set currentCategory(categoryID){
		this.data.category = categoryID
		this.update()
	}

	get currentTerm(){
		const {data} = this
		return data.term && WP.current.terms.includes(data.term)
			? data.term
			: WP.current.terms[0]
	}
	set currentTerm(termID){
		this.data.term = termID
		this.update(true)
	}

	get $currentTermWrapper(){
		return this.find('.current-term')
	}
}
customElements.define('dy-nav', DYNav)