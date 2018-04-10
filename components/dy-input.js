class DYInput extends DYElement {
	static get templateHTML(){
		return `
			<span contenteditable></span>
			<input class="input" type="hidden" tabindex="-1">
		`
	}

	constructor(){
		super()

		const initialValue = this.textContent || this.attr('value')

		this.root
		const {$editor, $input} = this

		for(const {name, value} of this.attributes){
			if(name === 'class' || name === 'id') continue
			if(name !== 'name') this.$editor.attr(name, value)
			this.$input.attr(name, value)
		}
		if(initialValue) this.value = initialValue

		try { $editor.contentEditable = 'plaintext-only' }catch(e){}

		$editor.on({
			paste: e => {
				e.preventDefault()
				// const text = this.clean(e.clipboardData.getData('Text'))
				const text = this.clean(e.clipboardData.getData('text/plain'))
				document.execCommand('insertHTML', false, text.replace(/</g, '&lt;').replace(/\n/g, '<br>'))
				// document.execCommand('inserttext', false, text)
			},

			// https://stackoverflow.com/questions/48517637/ie11-drop-plain-text-into-contenteditable-div
			drop: e => {
				e.preventDefault()
				const text = this.clean(e.dataTransfer.getData('Text'))

				const range = document.caretRangeFromPoint(e.clientX, e.clientY)
				range.deleteContents()
				const textNode = document.createTextNode(text)
				range.insertNode(textNode)
				range.selectNodeContents(textNode)
				range.collapse(false)
			
				const selection = window.getSelection()
				selection.removeAllRanges()
				selection.addRange(range)
			},

			copy: e => {
				if (e.clipboardData) {
					const text = window.getSelection().toString()
					e.clipboardData.setData('text/plain', text)
					e.preventDefault()
				}
			},

			input: e => {
				this.value = $editor.textContent
			},

			blur: e => {
				this.value = this.value.trim()
			}
		})

		$input.on({
			input: () => {
				this.value = $input.value
			},
			focus: () => {
				this.$editor.focus()
			}
		})
	}
	
	/*static get observedAttributes() {
		return ['type', 'name', 'value', 'required', 'placeholder', 'autocomplete', 'spellcheck']
	}

	attributeChangedCallback(attr, oldVal, newVal){
		if(attr === 'value'){
			this.value = newVal
		}else{
			this.$editor.attr(attr, newVal)
			this.$input.attr(attr, newVal)
		}
	}*/
	
	get $editor(){
		return this.find('[contenteditable]')
	}

	get $input(){
		return this.find('.input')
	}

	get value(){
		return this.$input.value
	}
	set value(value){
		value = this.clean(value)
		if(value !== this.$input.value) this.$input.value = value
		if(value !== this.$editor.textContent) this.$editor.textContent = value
	}

	clean(t){
		return t.replace(/\n/g, ' ')
	}

	addEventListener(){
		this.$editor.addEventListener(...arguments)
	}
}
customElements.define('dy-input', DYInput)


class DYTextArea extends DYInput {
	static get templateHTML(){
		return `
			<span contenteditable></span>
			<textarea class="input" tabindex="-1"></textarea>
		`
	}

	clean(t){
		return t
	}
}
customElements.define('dy-textarea', DYTextArea)