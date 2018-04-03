
class DYKhanBadge extends DYElement {
	static get templateHTML(){
		return `
			<a class="link">
				<img class="thumbnail">
			</a>
			<div>
				<p><span class="title-prefix"></span> <a class="link"><span class="title"></span></a></p>
				<dy-khan-stats class="stats"></dy-khan-stats>
			</div>
		`
	}

	static get observedAttributes() {
		return ['data-id', 'title-prefix']
	}

	attributeChangedCallback(attr, oldVal, newVal){
		const root = this.root

		if(attr === 'data-id'){
			const id = this.dataset.id
			
			const project = KhanProject(id)
			getJSON(project.scratchpad).then(data => {
				root.updateWithModel({
					'.title': data.title,
					'.stats[votes]': data.sumVotesIncremented,
					'.stats[spin-offs]': data.spinoffCount,
					'.stats[lines]': data.revision.code.split('\n').length,
					'.thumbnail[src]': data.imageUrl,
					'.link[href]': data.url
				})
			})
		}else if(attr === 'title-prefix'){
			const titlePrefix = newVal
			root.updateWithModel({
				'.title-prefix': titlePrefix
			})
		}
	}
}
customElements.define('dy-khan-badge', DYKhanBadge)