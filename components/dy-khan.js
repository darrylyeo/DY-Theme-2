const KhanProject = function(id){
	return {
		url: `https://www.khanacademy.org/computer-programming/p/${id}`,
		embedded: `https://www.khanacademy.org/computer-programming/p/${id}/embedded?editor=no`,
		scratchpad: `https://www.khanacademy.org/api/labs/scratchpads/${id}`
	}
}

class DYKhan extends DYElement {
	static get templateHTML(){
		return `
			<div>
				<i icon="KhanAcademy"></i>
				<a class="link"><h3 id="title"></h3></a>
				<dy-khan-stats id="stats"></dy-khan-stats>
			</div>
			<div id="project">
				<iframe></iframe>
				<img id="thumbnail">
				<span class="play">►Play</span>
			</div>
			<dy-buttons class="show-if-not-playing">
				<dy-button theme="accented heavy 3D" class="play">Play</dy-button>
			</dy-buttons>
			<dy-buttons class="show-if-playing">
				<dy-button theme="accented heavy 3D" class="restart">Restart</dy-button>
				<dy-button theme="accented heavy 3D" class="stop">Stop</dy-button>
			</dy-buttons>
			<dy-khan-badge id="fork" title-prefix="Based On:"></dy-khan-badge>
		`
	}

	static get observedAttributes() {
		return ['data-id', 'thumbnail']
	}

	attributeChangedCallback(attr, oldVal, newVal){
		const root = this.root
		
		if(attr === 'data-id'){
			const id = this.dataset.id
			const project = KhanProject(id)

			getJSON(project.scratchpad).then(data => {
				this.addClass('load')
				root.updateWithModel({
					'#title': data.title,
					'#stats[votes]': data.sumVotesIncremented,
					'#stats[spin-offs]': data.spinoffCount,
					'#stats[lines]': data.revision.code.split('\n').length,
					'#thumbnail[src]': this.thumbnail || data.imageUrl,
					'#project[style]': {
						'width': data.width + 'px',
						'min-height': data.height + 'px',
					},
					'#fork[data-id]': data.originScratchpadId,
					'.link[href]': data.url
				})

				this.toggleClass(!!data.originScratchpadId, 'is-fork')
			})
			
			const $project = root.find('#project')
			root.findAll('.play, .restart').on('click', () => {
				$project.addClass('playing')
				//$project.find('iframe').src = project.embedded
				$project.find('iframe').attr('src', project.embedded)
			})
			root.find('.stop').on('click', function(){
				$project.removeClass('playing')
				$project.find('iframe').attr('src', '')
			})
		}else if(attr === 'thumbnail'){
			this.thumbnail = newVal
			X(this.thumbnail)
			root.updateWithModel({
				'#thumbnail[src]': this.thumbnail
			})
		}
	}
}
customElements.define('dy-khan', DYKhan)