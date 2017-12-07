class DYBlog extends DYElement {
	connectedCallback(){
		DY.getObjectsByType('post').then(posts => {
			for(const post of posts.mapSort(post => post.date).reverse()){
				const $post = $$$('dy-post')
				$post.appendTo(this)
				$post.data = post
			}
		})
	}
}
customElements.define('dy-blog', DYBlog)

class DYPost extends DYElement {
	static get templateHTML(){
		return `
			<div class="background"></div>
			<div class="featured-image-wrapper">
				<a class="link"><img class="featured-image"></a>
			</div>
			<div class="outer-wrapper">
				<div class="inner-wrapper">
					<dy-date class="modified-date" format="full"></dy-date>
					<a class="link"><h2 class="title"></h2></a>
					<blockquote class="excerpt"></blockquote>
					<p><a class="link"><dy-button theme="accented heavy 3D">Read More</dy-button></a></p>
				</div>
			</div>
		`
	}
	
	set data(data){
		const root = this.root
		root.updateWithModel({
			'.title': data.title.rendered,
			'.modified-date[datetime]': data.date,
			'.link[href]': data.link,
			'.excerpt': data.excerpt.rendered
		})
		if(data.featuredImage){
			root.updateWithModel({
				'img[src]': data.featuredImage.source_url,
				'img[alt]': data.featuredImage.alt_text
			})

			blurImage(data.featuredImage.source_url)
				.then(img => this.$background.style.backgroundImage = img)
		}else{
			this.addClass('no-featured-image')
		}
	}

	get $background(){
		return this.find('.background')
	}
}
customElements.define('dy-post', DYPost)