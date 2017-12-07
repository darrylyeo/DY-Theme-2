const $header = $('header')

{
	const observer = new IntersectionObserver(([entry]) => {
		$header.toggleClass(!entry.isIntersecting, 'sticky')
	}, {
		threshold: 0
	})
	observer.observe($('#secondary-nav'))
}