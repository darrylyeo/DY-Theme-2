class DYProjectHeader extends DYElement {
	static get templateHTML(){
		return `
			<div class="background"></div>
			<div class="details">
				<h1 class="title"></h1>
				<div class="dates">
					<dy-date class="project-date" format="full"></dy-date>
					<span class="modified-date-wrapper">Updated <dy-date class="modified-date"></dy-date></span>
				</div>
			</div>
			<blockquote class="excerpt"></blockquote>
			<div class="actions"></div>
			<div class="featured-image-wrapper">
				<dy-figure class="featured-image"></dy-figure>
			</div>
			<!--<div class="terms">
				<dy-terms></dy-terms>
			</div>-->
		`
	}

	connectedCallback(){
		const root = this.root
		
		const data = WP.current

		root.updateWithModel({
			'.title': data.title && data.title.rendered,
			'.project-date[datetime]': data.meta.projectDate,
			'.modified-date[datetime]': data.date,
			'.link[href]': data.link,
			'.excerpt': data.excerpt.rendered
		})

		const {projectPlayUrl, kaId: khanID} = data.meta
		
		this.$actions.innerHTML = [
			projectPlayUrl && `<a class="play" href="${projectPlayUrl === 'PLAY' ? `https://play.darryl-yeo.com${location.pathname}` : projectPlayUrl}"><dy-button theme="accented heavy 3D">Play</dy-button></a>`,
			khanID && `<a class="khan" href="https://www.khanacademy.org/computer-programming/p/${khanID}"><dy-button theme="plain heavy 3D"><i icon="KhanAcademy"></i>View On Khan Academy</dy-button></a>`
		].filter(_ => _).join('')

		//root.find('.title').fitText('7.5em')

		this.toggleClass(data.meta.projectHeaderDarkMode === 'true', 'dark')

		const imageData = data.featuredImage
		this.$featuredImage.data = imageData

		if(imageData){
			blurImage(imageData.source_url)
				.then(img => this.$background.style.backgroundImage = img)
		}

		// Initialize terms
		// const $termsContainer = this.$termsContainer
		// $termsContainer.initialize(data.terms)
	}

	get $background(){
		return this.find('.background')
	}
	
	get $featuredImage(){
		return this.find('.featured-image')
	}

	get $actions(){
		return this.find('.actions')
	}

	// get $termsContainer(){
	// 	return this.find('dy-terms')
	// }
}

customElements.define('dy-project-header', DYProjectHeader)