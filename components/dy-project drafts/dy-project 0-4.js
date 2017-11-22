class DYProject extends DYElement {
	static get templateHTML(){
		return `
			<div class="positioning-wrapper">
				<div class="inner-wrapper">
					<div class="title-wrapper">
						<a class="link"><h2 class="title"></h2></a>
						<dy-button class="close">✖</dy-button>
					</div>
					<div class="card">
						<a class="featured-image" class="link"><img></a>
						<div class="details">
							<div class="details details-inner">
								<blockquote class="excerpt"></blockquote>
								<!--<a class="link button read-more">Read More</a>-->
								<div class="dates">
									<dy-date class="project-date"></dy-date>
									<span class="modified-date-wrapper">Updated <dy-date class="modified-date"></dy-date></span>
								</div>
								<dy-terms></dy-terms>
								<div class="terms"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	}

	set data(data){
		const root = this.root

		this._data = data
		
		root.updateWithModel({
			'.title': data.title.rendered,
			'.project-date[datetime]': data.meta.projectDate,
			'.modified-date[datetime]': data.date,
			'.link[href]': data.link,
			'.excerpt': data.excerpt.rendered
		})
		if(data.featuredImage){
			//this.css('backgroundImage', `url(${data.featuredImage.source_url})`)
			root.updateWithModel({
				'img[src]': data.featuredImage.source_url,
				'img[alt]': data.featuredImage.alt_text
			})
		}else{
			this.addClass('no-featured-image')
			root.updateWithModel({
				'img[alt]': data.title.rendered
			})
		}

		// Add terms
		/*const $terms = root.find('.terms')
		for(const taxonomyName in DY.data.taxonomies){
			if(taxonomyName === 'page-category') continue

			const terms = data[DY.mapTaxonomyName(taxonomyName)]
			if(!terms.length) continue
			for(const termID of terms){
				const term = DY.data.terms[termID]

				const $term = $$$('a').attr('rel', 'tag').appendTo($terms)
				$term.innerHTML = term.name
				this.addClass(`${taxonomyName}-${term.slug}`)
			}
		}*/

		root.find('dy-terms').initialize(data.terms)

		this.on({
			click(e){
				this.trigger(new CustomEvent('dy-project-focus', {bubbles: true, composed: true}))
			}
		})
		root.find('.close').on({
			//'click.stop': () => {
			'click': e => {
				this.trigger(new CustomEvent('dy-project-unfocus', {bubbles: true, composed: true}))
				e.stopPropagation()
			}
		})
	}

	get data(){
		return this._data
	}

	set hide(hide){
		this.toggleClass(hide, 'hide')
	}

	set focused(focused){
		this.root.find('.positioning-wrapper').animatePositionChange(() => {
			this.toggleClass(focused, 'focused')
		})
	}

	get $projects(){

	}
}
customElements.define('dy-project', DYProject)