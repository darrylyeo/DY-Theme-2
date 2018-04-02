const DYNavigation = {
	location: Object.assign({}, location),

	navigatingTo: undefined,
	prerenderedURLs: [],

	$links: new Set(),
	
	navigateTo(url, pushNewState = false){
		if(!url) return false
		const {pathname, host, hash} = new URL(url)
		
		if(host === this.location.host){
			if(pathname === this.location.pathname){
				if(hash){
					// const {pageXOffset, pageYOffset} = window
					// window.on('scroll.once', () => window.scrollTo(pageXOffset, pageYOffset))

					// document.body.animateScrollY($(hash).offsetTop - $DYPage.$header.mainMenuStickyHeight - 30)
					
					return hash === '#'
				}else{
					return false
				}
			}else if(pathname.includes('/wp-admin')){
				return false
			}else{
				// continue
			}
		}else{
			return false
		}

		this.navigatingTo = url

		if(pushNewState) {
			history.pushState({
				url
			}, 'bloink', url)
		}

		this.location =  Object.assign({}, location)

		DYPage.onNavigation()
		/*fetch(url).then(data => data.text()).then(html => {
			if(this.navigatingTo !== url) return

			const $$document = document.createRange().createContextualFragment(html)

			// for(const selector of ['title']){
			// 	$(selector).replaceWith($$document.find(selector))
			// }
			// for(const $$meta of $$document.findAll('meta')){
			// 	const $meta = $(`meta[property="${$$meta.attr('property')}"]`) || $(`meta[name="${$$meta.attr('name')}"]`)
			// 	if($meta) $meta.replaceWith($$meta)
			// }

			// $$('#wpadminbar').replaceWith($$document.find('#wpadminbar'))
			
			DYPage.onNavigation()
		})*/

		return true
	},

	processLinks($links){
		for(const $link of this.$links) if(!document.body.contains($link)) this.$links.delete($link)
		for(const $link of $links) this.$links.add($link)

		$links.on({
			click: this.onLinkClick,
			mouseover: this.onLinkMouseOver
		})
	},

	onLinkClick(e){
		const {href, host} = e.currentTarget

		if(!href) return
		if(DYNavigation.location.href === href) return
		if(e.metaKey) return
		
		if(host !== DYNavigation.location.host){
			window.open(href, '_blank', 'noopener')
			e.preventDefault()
		}else if(DYNavigation.navigateTo(href, true)){
			e.preventDefault()
		}
	},

	onLinkMouseOver(e){
		const {href} = e.currentTarget

		if(href){
			DYNavigation.prerender(href)
		}
	},

	prerender(url){
		if(!this.prerenderedURLs.includes(url)){
			this.prerenderedURLs.push(url)

			$$$('link', {
				attr: {
					rel: 'prerender',
					href: url
				},
				$parent: document.head
			})
		}
	}
}

DYNavigation.processLinks($$('a'))

window.on({
	pagerender(){
		window.scrollTo(0, 0)
		for(const $link of DYNavigation.$links){
			$link.toggleClass($link.href === DYNavigation.location.href, 'current')
		}
	},
	popstate(e){
		DYNavigation.navigateTo(location.href)
	}
})