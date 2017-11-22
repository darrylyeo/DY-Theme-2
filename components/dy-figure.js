class DYFigure extends DYElement {
	static get templateHTML(){
		return `
			<figure class="zoomable">
				<img>
				<figcaption></figcaption>
			</figure>
			<figure class="shadow">
				<img>
				<figcaption></figcaption>
			</figure>
		`
	}

	static get observedAttributes(){
		return ['src']
	}

	set data(data){
		if(!data) return
		
		const title = (
			typeof data.title === 'object' ?
				data.title.rendered :
				data.title || data.caption.rendered || data.alt_text
		)//.decodeHTMLEntities()

		this.attr('title', title)
		
		this.root.updateWithModel({
			'img[src]': data.source_url,
			'img[alt]': data.alt_text,
			'figcaption': data.caption.rendered || data.alt_text
		})

		this.on('click', () => {
			if(!this.isZoomed){
				X(this.$zoomableFigure.changePositionMode('absolute', {preserveSize: true}),
				{
					position: 'absolute',
					left: window.scrollX,
					top: window.scrollY,
					width: window.innerWidth,
					height: window.innerHeight
				})
				this.$zoomableFigure.animate([
					this.$zoomableFigure.changePositionMode('absolute', {preserveSize: true}),
					{
						position: 'absolute',
						left: window.scrollX,
						top: window.scrollY,
						width: window.innerWidth,
						height: window.innerHeight
					}
				])
			}

			/*const animation = new StateAnimation(() => {
				if(!this.isZoomed){
					this.$zoomableFigure.css({
						left: window.scrollX,
						top: window.scrollY,
						width: window.innerWidth,
						height: window.innerHeight
					})
				}else{
					this.$zoomableFigure.css({
						position: '',
						left: '',
						top: '',
						width: '',
						height: ''
					})
				}
				this.isZoomed = !this.isZoomed
			}, {
				duration: 1300,
				easing: 'ease-in-out'
			})

			this.$zoomableImg.animateState({
				position: true,
				size: true
			}, animation)
			
			this.$zoomableFigure.animateState({
				position: true,
				size: true
			}, animation)
	
			animation.run()*/
		})
	}

	attributeChangedCallback(attr, oldVal, newVal){
		const root = this.root

		if(attr === 'src'){
			const src = newVal
			getJSON(`${WP.API}/media?search=${src}`)
				.then(data => this.data = data[0])
		}
	}

	get $zoomableFigure(){
		return this.find('figure.zoomable')
	}
	get $zoomableImg(){
		return this.find('figure.zoomable img')
	}

	get isZoomed(){
		return this.hasClass('zoomed')
	}
	set isZoomed(zoomed){
		this.toggleClass(zoomed, 'zoomed')
	}
}
customElements.define('dy-figure', DYFigure)