class DYNav extends DYElement {
	static get templateHTML(){
		return `
			<div class="inner-wrapper">
				<h1 class="current-title"></h1>
				<div class="prev-next">
					<a rel="prev" class="prev"></a>
					<div class="current-term"></div>
					<a rel="next" class="next"></a>
				</div>
			</div>
		`
	}

	connectedCallback(){
		const root = this.root

		DYNav.instance = this

		//window.on('pagerender', () => this.update())
	}

	// <dy-terms>
	async connectTerms($termsContainer){
		await $termsContainer.initialize(WP.current.terms)
		
		$termsContainer.$terms.on('click', ({target: $term}) => {
			const id = $termsContainer.map.get($term).term_id
			if(this.currentTerm === id){
				this.currentTerm = undefined
				$term.removeClass('active')
			}else{
				this.currentTerm = id
				$termsContainer.$terms.removeClass('active')
				$term.addClass('active')
			}
		})
		this.update()
	}

	async update(){
		const isSinglePost = WP.queryType === 'single' && WP.postType !== 'page'
		if(!isSinglePost) return

		const currentPost = WP.current

		const posts = (await DY.getObjectsByType(WP.postType))
			.filter(post => post.terms.includes(this.currentTerm))
		const i = posts.indexOf(WP.current)
		const l = posts.length

		if(l <= 1) return

		const previousPost = posts[(i + l - 1) % l]
		const nextPost = posts[(i + 1) % l]

		const term = await DY.getTermById(this.currentTerm)

		this.updateWithModel({
			'.current-title': currentPost.title.rendered,
			'.prev': previousPost ? previousPost.title.rendered : '',
			'.prev[href]': previousPost ? previousPost.link : '',
			'.next': nextPost ? nextPost.title.rendered : '',
			'.next[href]': nextPost ? nextPost.link : '',
		})

		this.$currentTerm.empty()
			.append(
				DYTerms.make$Term(term)
			)
		//this.$currentTerm.initialize([this.currentTerm])
	}

	get currentCategory(){
		if(!this.data.category || !WP.current.categories.includes(this.data.category)){
			this.data.category = WP.current.categories[0]
		}
		return this.data.category
	}
	set currentCategory(categoryID){
		this.data.category = categoryID
		this.update()
	}

	get currentTerm(){
		if(!this.data.term || !WP.current.terms.includes(this.data.term)){
			this.data.term = this.currentCategory || WP.current.terms[0]
		}
		return this.data.term
	}
	set currentTerm(termID){
		this.data.term = termID
		this.update()

		notify(`You're navigating projects tagged ${this.$currentTerm.innerHTML}. Enjoy!`, {
			id: 'navigation_term',
			icon: '🏷'
		})
	}

	get data(){
		return DY.data.navigation || (DY.data.navigation = {})
	}

	get $currentTerm(){
		return this.find('.current-term')
	}
}
customElements.define('dy-nav', DYNav)