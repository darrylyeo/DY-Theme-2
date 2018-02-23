class DYProject extends DYElement {
	static get templateHTML(){
		return `
			<div class="positioning-wrapper">
				<div class="inner-wrapper">
					<div class="title-wrapper">
						<a class="link"><h2 class="title"></h2></a>
						<dy-button class="close" theme="plain">✖</dy-button>
					</div>
					<div class="card">
						<a class="featured-image link"><img></a>
						<div class="details">
							<blockquote class="excerpt"></blockquote>
							<!--<a class="link button read-more">Read More</a>-->
							<div class="dates">
								<dy-date class="project-date" format="full"></dy-date>
								<span class="modified-date-wrapper">Updated <dy-date class="modified-date"></dy-date></span>
							</div>
							<dy-terms></dy-terms>
						</div>
					</div>
				</div>
			</div>
		`
	}

	initialize(data){
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
				if(e.target === this){
					this.requestFocus(!this.focused)
				}
			}
		})
		root.find('.close').on({
			click: e => {
				this.requestFocus(false)
				e.stopPropagation()
			}
		})

		return this
	}

	requestFocus(focused = true){
		this.trigger(new CustomEvent(
			focused ? 'dy-project-focus' : 'dy-project-unfocus',
			{bubbles: true, composed: true}
		))
	}

	set hide(hide){
		this.toggleClass(hide, 'hide')
	}

	set focused(focused){
		this._focused = focused

		/*let animate
		const animatePromise = new Promise(resolve => animate = resolve)

		this.root.find('.inner-wrapper').animatePositionChange(animatePromise)
		//this.root.findAll('.card, img, .details').animateSizeChange(animatePromise)
		this.root.findAll('img, .details, .card').animateSizeChange(animatePromise)
		
		this.toggleClass(focused, 'focused')

		animate()*/

		const animation = new StateAnimation(() => {
			this.toggleClass(focused, 'focused')
		}, {
			duration: 2750,
			easing: 'ease-out'
		})

		/*this.find('.positioning-wrapper').animateState({
			position: true,
			size: true
		}, animation)

		this.find('.inner-wrapper').animateState({
			size: true
		}, animation)*/

		// this.find('.details').animateState({
		// 	size: true
		// }, animation)

		animation.run()
	}

	get focused(){
		return this._focused
	}
}
customElements.define('dy-project', DYProject)