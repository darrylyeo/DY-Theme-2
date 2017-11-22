const MIN_COMMENT_LENGTH = 20
const MAX_COMMENT_LENGTH = 1000

class DYComments extends DYElement {
	static get templateHTML(){
		return `
			<h2><span class="comment-count">Loading</span> <span class="reactions">Reactions</span></h2>
			<!--<div id="reaction">
				<h3>Choose One or More Reactions: </h3>
				<ul>
					<li>Don't like it. Like it. Love it!</li>
					<li>Wow. Mind-blowing! HELP, I need a neurosurgeon!!</li>
					<li>Boring. Helpful.</li>
					<li>Learned something new.</li>
					<li>I have a question...</li>
					<li>I have some feedback...</li>
				</ul>
			</div>-->
			<dy-comment-reply></dy-comment-reply>
		`
	}

	connectedCallback(){
		const root = this.root
		getJSON(`${WP.API}/comments?post=${WP.current.id}&per_page=100`).then(comments => {
			root.updateWithModel({
				'h2': `${comments.length} Reaction${comments.length === 1 ? '' : 's'}`
			})

			const $comments = {}
			for(const comment of comments){
				const $comment = $$$('dy-comment').appendTo(this)
				$comment.data = comment
				$comments[comment.id] = $comment
			}
			for(const comment of comments){
				if(comment.parent){
					$comments[comment.parent].$replies.append($comments[comment.id])
				}
			}
		})
	}
}
customElements.define('dy-comments', DYComments)



class DYComment extends DYElement {
	static get templateHTML(){
		return `
			<img id="avatar">
			<blockquote class="comment">
				<header>
					<cite>
						<a id="author" rel="nofollow"></a>
					</cite>
					<a class="link"><dy-date id="comment-date"></dy-date></a>
					<dy-buttons>
						<dy-button id="reply-button" theme="plain">Reply</dy-button>
						<dy-button id="edit-button" theme="plain">Edit</dy-button>
					</dy-button>
				</header>
				<div id="content"></div>
			</blockquote>
			<div id="replies">

			</div>
		`
	}

	set data(data){
		const root = this.root
		
		this.dataset.id = data.id

		root.updateWithModel({
			'#content': data.content.rendered,
			'#comment-date[datetime]': data.date,
			'.link[href]': data.link,
			'#author': data.author_name,
			'#author[href]': data.author_url || undefined,
			'#avatar[src]': data.author_avatar_urls[96]
		})

		root.find('#reply-button').on('click', () => {
			this.$replies.prependChild(DYCommentReply.$reply)
		})

		DY.getUser.then(user => {
			this.toggleClass(data.author === user.id, 'by-me')
		})
	}

	get $replies(){
		const root = this.root
		return root.find('#replies')
	}
}
customElements.define('dy-comment', DYComment)



class DYCommentReply extends DYComment {
	static get templateHTML(){
		return `
			<img id="avatar">
			<form class="comment" action="">
				<div>
					<p><a id="sign-in">Sign in with a social account</a> to skip entering credentials: </p>
				</div>
				<hr>
				<header>
					<cite>
						<!--<input type="text" id="author" placeholder="Your Name (Real names only, please!)" name="author_name" required>-->
						<dy-input id="author" placeholder="Your Name (Real names only, please!)" name="author_name" required></dy-input>
					</cite>
					<input type="email" placeholder="your_email@example.com" name="author_email" required>
				</header>
				<textarea id="content" name="content" placeholder="Your reaction..." required></textarea>
				<footer>
					<p><span class="character-count"></span> Characters</p>
					<button type="submit">Post Reaction</button>
				</footer>
				<hr>
				<div id="meta">
					<div>
						<h3>Guidelines</h3>
						<ul>
							<li>Please use your real name.</li>
							<li>Comments will be manually approved.</li>
							<li>Keep it clean and respectful!</li>
						</ul>
					</div>
					<div>
						<h3>Formatting</h3>
						<p>Express yourself **boldly**, with *emphasis* or with \`code\`.</p>
						<p>Here is a [link](https://darryl-yeo.com).</p>
						<p>\`\`\`Code blocks work here, too!\`\`\`</p>
					</div>
				</div>
			</form>
		`
	}

	connectedCallback(){
		const root = this.root
		
		const $parent = this.getRootNode().host

		this.formData = {
			'post': $('dy-comments').dataset.id,
			'parent': $parent instanceof DYComment ? $parent.dataset.id : 0,
			'author_user_agent': navigator.userAgent,
			'author_ip': '???',
		}

		const _this = this

		root.find('form').on('submit', function(e){
			e.preventDefault()
			const formData = new FormData(this)
			for(const key in _this.formData){
				formData.set(key, _this.formData[key])
			}
			X(_this.formData, formData, formData.entries())
			for(const entry of formData.entries()){
				X(entry)
			}
			X(formData.getAll('*'))
			//const xhr = new XMLHttpRequest()
			//xhr.send(new FormData(this))

			e.preventDefault()
		})

		const $submit = root.find('[type=submit]')
		const $textarea = root.find('textarea')

		const update = () => {
			const text = $textarea.value.trim()

			if(text.length >= MIN_COMMENT_LENGTH){
				$submit.disabled = false
				$submit.text(`Post reaction`)
			}else{
				$submit.disabled = true
				$submit.text(`${MIN_COMMENT_LENGTH - text.length} characters to go`)
			}
		}

		$textarea.on('input', update)
	}
}
customElements.define('dy-comment-reply', DYCommentReply)

DYCommentReply.$reply = new DYCommentReply