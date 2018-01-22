class DYInput extends DYElement {
	static get templateHTML(){
		return `
			<span contenteditable></span>
			<span class="placeholder"></span>
			<input tabindex="-1">
		`
	}
	
	static get observedAttributes() {
		return ['value', 'required', 'placeholder']
	}

	attributeChangedCallback(attr, oldVal, newVal){
		if(attr === 'placeholder'){
			this.$placeholder.innerText = newVal
		}
		this.$input.attr(attr, newVal)
	}

	connectedCallback(){
		const {$editor} = this

		$editor.on({
			['drop paste copy focus blur'](e){
				const text = this.innerText.replace(/\n/g, '')
				const html = this.innerHTML.replace(/<br>/g, '')
				
				if (text !== html) {
					this.innerText = this.innerText
				}
				X(text, html)
			},
			
			copy(e){
				if (e.clipboardData) {
					const text = window.getSelection().toString()
					e.preventDefault()
					e.clipboardData.setData('text/plain', text)
				}
			},

			input: e => {
				this.$input.value = $editor.innerText
			}
		})
	}
	
	get $editor(){
		return this.root.find('[contenteditable]')
	}

	get $placeholder(){
		return this.root.find('.placeholder')
	}

	get $input(){
		return this.root.find('input')
	}

	get value(){
		return this.$editor.innerText
	}
}
customElements.define('dy-input', DYInput)