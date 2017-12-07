class DYTableOfContents extends DYElement {
	static get templateHTML(){
		return `
			<nav>
				<ol></ol>
			</nav>
		`
	}

	set $article($article){
		this._$article = $article

		const $targets = this.$targets = []
		const $targetTo$Link = this.$targetTo$Link = new Map()

		this.root
		
		// Check when a target crosses a horizontal line 40% down the viewport
		const observer = new IntersectionObserver(entries => {
			for(const entry of entries){
				const $target = entry.target
				if(entry.isIntersecting){
					const $link = $targetTo$Link.get($target)
					this.$currentLink = $link
				}
			}
		}, {
			threshold: 0,
			rootMargin: '-40% 0% -60% 0%' // intersect with a line at the 40% vertical, not the whole viewport
		})

		const $ol = this.find('ol')

		for(const $target of $article.findAll('section')){
			const anchor = $target.id
			const $h2 = $target.find('h2')
		
			const $li = $$$('li')
			$ol.append($li)

			const $link = $$$('a', {
				href: '#' + anchor,
				html: $h2 ? $h2.innerText : anchor
			})
			$li.append($link)

			$targetTo$Link.set($target, $link)
			observer.observe($target)
		}

		/*const $levels = {2: this.root.find('ol')}
		let currentLevel = 2
		let $currentLevel = $levels[currentLevel]
X($article.findAll('section > h2, h3, h4, h5, h6'))
		for(const $heading of $article.findAll('section > h2, h3, h4, h5, h6')){
			const level = +$heading.tagName[1]

			while(currentLevel < level){
				const $parentLevel = $levels[currentLevel]
				currentLevel++
				$currentLevel = $levels[currentLevel] = $$$('ol', {
					$parent: $parentLevel.children[$parentLevel.children.length - 1]
				})
				.append($currentLevel)
			}
			if(currentLevel > level){
				currentLevel = level
				$currentLevel = $levels[currentLevel]
			}

			const $target = $heading.id ? $heading : $heading.closest('section')
			const $link = $$$('a', {
				html: $heading.innerText,
				attr: {
					'href': '#' + $target.id
				}
			})
			$targetTo$Link.set($target, $link)
			$targets.push($target)

			$$$('li', {
				$parent: $currentLevel
			}).append($link)
		}*/
	}
	get $article(){
		return this._$article
	}

	get $links(){
		return this.root.findAll('a')
	}

	set $currentLink($link){
		if(this._$currentLink) this._$currentLink.removeClass('current')
		this._$currentLink = $link
		if($link) this._$currentLink.addClass('current')
	}
}
customElements.define('dy-table-of-contents', DYTableOfContents)