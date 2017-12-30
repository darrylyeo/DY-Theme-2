class DYProjects extends DYElement {
	static get templateHTML(){
		return `
			<dy-project-filters></dy-project-filters>
			<div class="projects-wrapper">
				<div class="projects">
					
				</div>
			</div>
		`
	}

	connectedCallback(){
		const {root, $projectsWrapper} = this


		// Create <dy-project>s

		this.map = new TwoWayWeakMap()

		DY.getObjectsByType('project').then(projects => {
			projects = projects.mapSort(project => project.date).reverse()

			const filterCategoryID = +this.attr('category')
			if(filterCategoryID){
				projects = projects.filter(project =>
					project.terms.includes(filterCategoryID)
				)
			}

			this.projects = projects

			for(const project of projects){
				const $project = $$$('dy-project')
					.appendTo($projectsWrapper)
					.initialize(project)
				this.map.set($project, project)
			}

			this.$filters.initialize(this.getAllTermIDs(projects))
			this.$filters.on('dy-filter-change', () => this.onFilterChange())
		})
		
		
		// Event Listeners

		$projectsWrapper.on({
			'click': function(e){
				if(e.target === this){
					this.$focusedProject = undefined
				}
			}
		})

		this.on({
			['dy-project-focus'](e){
				const $focusedProject = e.target
				//const $focusedProject = e.composedPath()[0]
				this.focusedProject = this.map.get($focusedProject)
				this.scrollInView()
			},
			['dy-project-unfocus'](){
				this.focusedProject = undefined
			}
		})

		document.on({
			keydown: e => {
				if(this.focusedProject){
					switch(e.key){
						case 'ArrowLeft':
							this.previousProject()
							e.preventDefault()
							break
						case 'ArrowRight':
							this.nextProject()
							e.preventDefault()
							break
						case 'Escape':
							this.focusedProject = undefined
							break
					}
				}
			}
		})
	}

	getAllTermIDs(projects){
		return projects.map(project => project.terms).flatten()
	}
	
	getFilteredProjects(){
		const activeTermIDs = this.$filters.activeTerms.map(term => term.term_id)

		if(activeTermIDs.length){
			return this.projects.filter(project =>
				activeTermIDs.every(termID => project.terms.includes(termID))
			)
		}else{
			return this.projects
		}
	}

	onFilterChange(){
		// Hide projects that don't match the filter, and animate differences in position
		const filteredProjects = this.getFilteredProjects()

		// Animate
		const animation = new StateAnimation(() => {
			for(const project of this.projects){
				const $project = this.map.get(project)
				$project.hide = !filteredProjects.includes(project)
			}
		}, {
			duration: 500,
			easing: 'ease-in-out'
		})

		for(const project of this.projects){
			const $project = this.map.get(project)
			$project.animateState({
				position: true
			}, animation)
		}

		animation.run()

		// Get a list of all term IDs associated with the filtered project, and pass it back to <dy-project-filters>
		this.$filters.includeTerms(this.getAllTermIDs(filteredProjects))
	}

	set focusedProject(focusedProject = undefined){
		if(this._focusedProject){
			const $previousFocusedProject = this.map.get(this._focusedProject)
			$previousFocusedProject.focused = false
		}

		this._focusedProject = focusedProject

		this.toggleClass(focusedProject !== undefined, 'has-focused-project')

		if(focusedProject){
			const $focusedProject = this.map.get(focusedProject)
			$focusedProject.focused = true

			const imageData = focusedProject.featuredImage

			if(imageData){
				blurImage(imageData.source_url)
					.then(img => document.body.css('--page-background', img))
			}
		}
	}
	get focusedProject(){
		return this._focusedProject
	}

	previousProject(){
		const filteredProjects = this.getFilteredProjects()
		const i = filteredProjects.indexOf(this.focusedProject)
		this.focusedProject = filteredProjects[i + 1]
	}
	nextProject(){
		const filteredProjects = this.getFilteredProjects()
		const i = filteredProjects.indexOf(this.focusedProject)
		this.focusedProject = filteredProjects[i - 1]
	}

	get $projectsWrapper(){
		return this.find('.projects')
	}

	get $projects(){
		return this.findAll('dy-project')
	}

	get $filters(){
		return this.find('dy-project-filters')
	}

	scrollInView(){
		//document.body.animateScrollY($('#secondary-nav').clientHeight)
	}
}
customElements.define('dy-projects', DYProjects)




class DYProjectFilters extends DYTerms {
	initialize(termIDs){
		super.initialize()

		if(termIDs){
			this.includeTerms(termIDs)
		}
	}

	get activeTerms(){
		return this.$terms.filter('.active')
			.map($term => this.map.get($term))
	}

	includeTerms(termIDs){
		for(const $term of this.$terms){
			const term = this.map.get($term)
			$term.disabled = !termIDs.includes(term.term_id)
		}
	}

	make$Term(){
		const $term = super.make$Term(...arguments)
		$term.on('click', function(){
			this.toggleClass('active')
			this.trigger(new CustomEvent('dy-filter-change', {bubbles: true, composed: true}))
		})
		return $term
	}
}
customElements.define('dy-project-filters', DYProjectFilters)