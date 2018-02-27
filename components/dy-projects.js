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

	static async projects(){
		if(this._projects) return this._projects
		return this._projects = (await DY.getObjectsByType('project'))
			.mapSort(project => project.date)
			.reverse()
	}

	static async projectsByCategory(categoryID){
		return (await DYProjects.projects())
			.filter(project => project.terms.includes(+categoryID))
	}
	
	async connectedCallback(){
		const {root, $projectsWrapper} = this

		this.$filters.on('dy-filter-change', () => this.onFilterChange())

		
		// Event Listeners

		$projectsWrapper.on({
			'click'(e){
				if(e.target === this){
					this.$focusedProject = undefined
				}
			}
		})

		this.on({
			'dy-project-focus'(e){
				const $focusedProject = e.target
				//const $focusedProject = e.composedPath()[0]
				this.focusedProject = DYProjects.map.get($focusedProject)
				this.scrollInView()
			},
			'dy-project-unfocus'(){
				this.focusedProject = undefined
			},
			'dy-project-focus-previous'(){
				this.previousProject()
			},
			'dy-project-focus-next'(){
				this.nextProject()
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
		
		const categoryID = this.attr('category')
		this.projects = categoryID
			? await DYProjects.projectsByCategory(categoryID)
			: await DYProjects.projects()
	}

	set projects(projects){
		this._projects = projects

		this.$projectsWrapper.empty()
		for(const project of projects){
			if(!DYProjects.map.has(project)){
				const $project = new DYProject(project)
				DYProjects.map.set(project, $project)
			}
			DYProjects.map.get(project)
				.appendTo(this.$projectsWrapper)
				.focused = false
		}
		this.$filters.initialize(this.getAllTermIDs(projects))
	}
	get projects(){
		return this._projects
	}

	getAllTermIDs(projects){
		return projects.map(project => project.terms).flatten().unique()
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
				const $project = DYProjects.map.get(project)
				$project.hide = !filteredProjects.includes(project)
			}
		}, {
			duration: 500,
			easing: 'ease-in-out'
		})

		for(const project of this.projects){
			const $project = DYProjects.map.get(project)
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
			const $previousFocusedProject = DYProjects.map.get(this._focusedProject)
			$previousFocusedProject.focused = false
		}

		this._focusedProject = focusedProject

		const hasFocusedProject = focusedProject !== undefined
		this.toggleClass(hasFocusedProject, 'has-focused-project')
		if(hasFocusedProject){
			const $focusedProject = DYProjects.map.get(focusedProject)
			$focusedProject.focused = true

			const imageData = focusedProject.featuredImage
			if(imageData){
				blurImage(imageData.source_url)
					.then(img => document.documentElement.css('--page-background-image', img))
			}
		}
	}
	get focusedProject(){
		return this._focusedProject
	}

	previousProject(){
		const filteredProjects = this.getFilteredProjects()
		const i = filteredProjects.indexOf(this.focusedProject)
		this.focusedProject = filteredProjects[i - 1]
	}
	nextProject(){
		const filteredProjects = this.getFilteredProjects()
		const i = filteredProjects.indexOf(this.focusedProject)
		this.focusedProject = filteredProjects[i + 1]
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
DYProjects.map = new TwoWayWeakMap()
customElements.define('dy-projects', DYProjects)




class DYProjectFilters extends DYTerms {
	get $activeTerms(){
		return [...this.$terms]
			.filter($term => $term.active)
	}
	get activeTerms(){
		return this.$activeTerms
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
		$term.toggleable = true
		$term.on('click', function(){
			this.trigger(new CustomEvent('dy-filter-change', {bubbles: true, composed: true}))
		})
		return $term
	}
}
customElements.define('dy-project-filters', DYProjectFilters)