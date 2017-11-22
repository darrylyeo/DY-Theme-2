class DYSubscribe extends DYElement {
	static get templateHTML(){
		return `
			<h3>Subscribe For Email Updates!</h3>
			<form>
				<input type="email" placeholder="Your Email Address">
				<input type="text" placeholder="Your Name">
				<input type="submit" label="Sign Me Up!">
			</form>
		`
	}

	connectedCallback(){
		this.root
	}
}
customElements.define('dy-subscribe', DYSubscribe)