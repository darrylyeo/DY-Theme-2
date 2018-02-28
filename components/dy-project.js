class DYProject extends DYElement {
	static get templateHTML(){
		return `
			<div class="positioning-wrapper">
				<div class="inner-wrapper">
					<div class="title-wrapper">
						<a class="link"><h2 class="title"></h2></a>
						<dy-buttons>
							<dy-button class="previous" theme="plain" title="Previous Project (⬅)"><i icon="⬅"></i></dy-button>
							<dy-button class="next" theme="plain" title="Next Project (➡)"><i icon="➡"></i></dy-button>
							<dy-button class="close" theme="plain" title="Close (Esc)"><i icon="✖"></i></dy-button>
						</dy-buttons>
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

	constructor(data){
		super()

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

		root.find('dy-terms').initialize(data.terms)

		this.on({
			click(e){
				if(e.target === this){
					this.requestFocus(!this.focused)
				}
			}
		})
		root.find('.previous').on({
			click: e => {
				this.trigger(new CustomEvent(
					'dy-project-focus-previous',
					{bubbles: true, composed: true}
				))
				e.stopPropagation()
			}
		})
		root.find('.next').on({
			click: e => {
				this.trigger(new CustomEvent(
					'dy-project-focus-next',
					{bubbles: true, composed: true}
				))
				e.stopPropagation()
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

		this.toggleClass(focused, 'focused')
		/*const animation = new StateAnimation(() => {
			this.toggleClass(focused, 'focused')
		}, {
			duration: 2750,
			easing: 'ease-out'
		})

		this.find('.positioning-wrapper').animateState({
			position: true,
			size: true
		}, animation)

		this.find('.inner-wrapper').animateState({
			size: true
		}, animation)

		// this.find('.details').animateState({
		// 	size: true
		// }, animation)

		animation.run()*/
	}

	get focused(){
		return this._focused
	}
}
customElements.define('dy-project', DYProject)