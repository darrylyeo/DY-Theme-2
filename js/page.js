window.on({
	load(){
		//document.documentElement.addClass('load')
		delay(() => document.documentElement.addClass('load'), 1000)
	}
})

let pageData = bind({}, document, {
	title(title){
		return title
	}
})

// fetch('content/1.json').then(data => data.json()).then(data => {
// 	console.log(data)
// 	Object.assign(pageData, data)
// })


const DYPage = {
	async onNavigation(){
		const data = await this.route()

		document.title = data.title.rendered + ' – Darryl Yeo'

		$('main').html(this.render())

		const $article = $('main').find('article')
		const $sidebar = $('main').find('dy-sidebar')
		if($article && $sidebar){
			$sidebar.$tableOfContents.$article = $article
		}

		window.trigger(new CustomEvent('pagerender'))
	},

	async route(){
		const currentURL = window.location.origin + window.location.pathname
		const siteURL = WP.siteURL

		WP.current = await DY.getObjectForURL(currentURL.replace('/darrylyeo2/', '/darrylyeo/'))
		WP.queryType = ''
		WP.postType = ''

		if(WP.current === undefined){
			WP.queryType = '404'
		}

		else if(currentURL.replace(/\/$/, '') === siteURL.replace(/\/$/, '')){
			WP.queryType = 'front-page'
			//WP.queryType = 'archive'
			//WP.postType = 'project'
		}

		else if(WP.current.objectType === 'term'){
			WP.queryType = 'term-archive'
		}
		
		// Temporary
		else if(WP.current.slug === 'blog'){
			WP.queryType = 'archive'
			WP.postType = 'post'
		}

		else if(['post', 'page', 'project'].includes(WP.current.objectType)){
			WP.queryType = 'single'
			WP.postType = WP.current.objectType
		}

		WP.route = WP.queryType + (WP.postType ? ' ' + WP.postType : '')

		return WP.current
	},

	render(){
		const data = WP.current
		const route = WP.route

		const templates = {
			//'archive project': () => `
			'front-page': () => `
				<dy-projects class="alternate-layout"></dy-projects>
			`,
			'term-archive': () => `
				<dy-projects class="alternate-layout" category=${data.term_id}></dy-projects>
			`,
			'archive post': () => `
				<dy-blog></dy-blog>
			`,
			'single project': () => `
				<dy-project-header></dy-project-header>
				<article>
					${data.meta.kaId ? `
						<dy-khan data-id="${data.meta.kaId}" thumbnail="${data.featuredImage.source_url}"></dy-khan>
					` : ''}
					${data.content.rendered}
					<hr>
					${data.comment_status === 'open' ? `<dy-comments></dy-comments>` : ''}
				</article>
				<dy-sidebar></dy-sidebar>
			`,
			'single post': () => `
				<dy-project-header></dy-project-header>
				<article>
					<!--
					<h1>${data.title.rendered}</h1>
					${data.featuredImage ? `
						<img src="${data.featuredImage.source_url}">
					` : ''}
					-->
					${data.content.rendered}
					<hr>
					${data.comment_status === 'open' ? `<dy-comments></dy-comments>` : ''}
				</article>
				<dy-sidebar></dy-sidebar>
			`,
			'single page': () => `
				<article>
					<h1>${data.title.rendered}</h1>
					${data.content.rendered}
				</article>
			`,
			'404': () => `
				<article>
					<h2>404. :(</h2>
				</article>
			`,
			'error': () => `
				<article>
					<section>
						<h2>Whoops!</h2>
						<p>There was an error loading this content.</p>
						<pre><code>No such route: ${route}</code></pre>
					</section>
				</article>
			`
		}
		
		return templates[route in templates ? route : notify(route) || 'error']()
	}
}

DYPage.onNavigation()