const $header = $('header')

{
	let isSticky = false
	const updateHeader = () => {
		$header
			.toggleClass(isSticky, 'sticky')
			.toggleClass(isSticky && WP.queryType === 'single', 'show-post-nav')
	}

	const observer = new IntersectionObserver(entries => {
		for(const entry of entries){
			isSticky = entry.isIntersecting
			updateHeader()
		}
	}, {
		threshold: 0,
		rootMargin: '75% 0% -175% 0%' // <body> top reaches 75vh above viewport
	})
	observer.observe($('body'))
	
	$header.addClass('sticky-open')
}


window.on({
	async pagerender(){
		if(WP.current.terms){
			const termURLs = (await Promise.all(WP.current.terms.map(
				termID => DY.getTermById(termID)
			))).map(term => term.link)
			for(const $link of $header.findAll('a')){
				if(termURLs.includes($link.href)){
					$link.addClass('current')
				}
			}
		}
	}
})