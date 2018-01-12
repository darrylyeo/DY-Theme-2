class DYTerms extends DYElement {
	static get templateHTML(){
		return `
			<dl class="terms"></dl>
		`
	}

	async initialize(termIDs = [], excludeTerms = ['uncategorized'], excludeTaxonomies = ['page-category', 'category']){
		const root = this.root

		const $termsWrapper = this.$termsWrapper.empty()

		this.map = new TwoWayWeakMap()
		
		const [terms, taxonomies] = await Promise.all([
			DY.getObjectsByType('term'),
			DY.getTaxonomies()
		])

		this.terms = terms
			.filter(term =>
				(termIDs.length === 0 || termIDs.includes(term.term_id)) &&
				!excludeTerms.includes(term.slug) &&
				!excludeTaxonomies.includes(term.taxonomy)
			)
			.sort((term1, term2) => term2.count - term1.count)

		for(const taxonomy of taxonomies){
			if(excludeTaxonomies.includes(taxonomy.slug)) continue

			const terms = this.terms.filter(term => term.taxonomy === taxonomy.slug)
			if(!terms.length) continue

			const $taxonomy = $$$('div')
				.attr({
					'data-taxonomy': taxonomy.slug
				})
			$taxonomy.append(
				$$$('dt').html(taxonomy.name).attr({
					'title': taxonomy.description,
				})
			)
			$termsWrapper.append($taxonomy)
			
			for(const term of terms){
				this.make$Term(term)
					.appendTo($taxonomy)
			}
		}
	}

	get $termsWrapper(){
		return this.root.find('.terms')
	}

	get $terms(){
		return this.root.findAll('[rel=tag]')
	}

	make$Term(term){
		const $term = $$$('dy-button')
			.attr('theme', 'plain small')
			.attr('animated', '')
			//.attr('tabindex', '0') // Focusable
			.attr('rel', 'tag')
			.attr('title', term.description)
			.html(term.name)
		
		this.map.set($term, term)

		return $term
	}
}
customElements.define('dy-terms', DYTerms)