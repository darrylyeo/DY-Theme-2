const $header = $('header')

{
const observer = new IntersectionObserver(([{isIntersecting}]) => {
	$header.toggleClass(!isIntersecting, 'sticky')
}, {
	threshold: 0
})
observer.observe($('#secondary-nav'))
}