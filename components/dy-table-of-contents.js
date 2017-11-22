class DYTableOfContents extends DYElement {
	static get templateHTML(){
		return `
			<nav>
				<ol>

				</ol>
			</nav>
		`
	}

	connectedCallback(){
		window.on('scroll.throttle.passive', () => {
			const {$article, $targets, $targetTo$Link} = this
			if($article){
				const $target = [...$targets].reverse().find(
					$target => $target.top <= $DYPage.$header.mainMenuStickyHeight + 40
				)
				if($target !== this.$currentTarget){
					this.$links.removeClass('current')
					if($target !== undefined) $targetTo$Link.get($target).addClass('current')
				}
				this.$currentTarget = $target
			}
		})
	}

	set $article($article){
		this._$article = $article
		const $targets = this.$targets = []
		const $targetTo$Link = this.$targetTo$Link = new Map()

		const root = this.root

		const $levels = {2: this.root.find('ol')}
		let currentLevel = 2
		let $currentLevel = $levels[currentLevel]

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
		}
	}
	get $article(){
		return this._$article
	}

	get $links(){
		return this.root.findAll('a')
	}
}
customElements.define('dy-table-of-contents', DYTableOfContents)