const $header = $('header')

{
	let isSticky = false
	function updateHeader(){
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
