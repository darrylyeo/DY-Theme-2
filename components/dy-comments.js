const MIN_COMMENT_LENGTH = 20
const MAX_COMMENT_LENGTH = 1000

class DYComments extends DYElement {
	static get templateHTML(){
		return `
			<h2><span class="comment-count">Loading</span> <span class="reactions">Reactions</span></h2>
			<!--<div class="reaction">
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
		getJSON(`${WP.rest}/comments?post=${WP.current.id}&per_page=100`).then(comments => {
			root.updateWithModel({
				'h2': `${comments.length} Reaction${comments.length === 1 ? '' : 's'}`
			})

			const $comments = {}
			for(const comment of comments){
				const $comment = new DYComment(comment).appendTo(this)
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
			<img class="avatar">
			<blockquote class="comment">
				<header>
					<cite>
					</cite>
					<a class="link"><dy-date class="comment-date"></dy-date></a>
					<dy-buttons>
						<dy-button class="reply-button" theme="plain small">Reply</dy-button>
						<dy-button class="edit-button" theme="plain small">Edit</dy-button>
					</dy-button>
				</header>
				<div class="content"></div>
			</blockquote>
			<div class="replies">

			</div>
		`
	}

	constructor(data){
		super()

		const root = this.root
		
		this.commentID = data.id

		root.updateWithModel({
			'.content': data.content.rendered,
			'.comment-date[datetime]': data.date,
			'.link[href]': data.link,
			'.author': data.author_name,
			'.author[href]': data.author_url || undefined,
			'.avatar[src]': data.author_avatar_urls[96]
		})

		root.find('.reply-button').on('click', () => {
			this.$replies.prependChild(DYCommentReply.$reply)
		})

		DY.getUser.then(user => {
			if(user){
				this.toggleClass(data.author === user.id, 'by-me')
			}
		})
	}

	get $replies(){
		const root = this.root
		return root.find('.replies')
	}
}
customElements.define('dy-comment', DYComment)



class DYCommentReply extends DYComment {
	static get templateHTML(){
		return `
			<img class="avatar">
			<form class="comment" action="">
				<div>
					<p><a class="sign-in">Sign in with a social account</a> to skip entering credentials: </p>
				</div>
				<hr>
				<header>
					<cite>
						<dy-input class="author" placeholder="Your Name (Real names only, please!)" name="author_name" required></dy-input>
					</cite>
					<input type="email" placeholder="your_email@example.com" name="author_email" required>
				</header>
				<footer>
					<button type="submit">Post Reaction</button>
				</footer>
				<hr>
				<div class="meta">
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
		
		const $parent = this.closest('dy-comment')

		const additionalFormData = {
			'author': 0,
			'post': WP.current.id,
			'parent': $parent ? $parent.commentID : 0,
			'author_user_agent': navigator.userAgent,
			//'author_ip': '???',
		}

		DY.getUser.then(user => {
			if(user){
				Object.assign(additionalFormData, {
					'author': user.id,
					'author_url': user.url
				})
				this.find('[name=author_name]').value = user.nickname || user.name || user.username
				this.find('[name=author_email]').value = user.email
			}
		})

		if(this._inited) return
		this._inited = true

		root.find('form').on('submit', e => {
			e.preventDefault()

			const formData = new FormData(e.target)
			for(const key in additionalFormData){
				formData.set(key, additionalFormData[key])
			}

			e.preventDefault()

			fetch(`${WP.rest}/comments`, {
				method: 'POST',
				body: formData,
				credentials: 'same-origin',
				headers: {
					'X-WP-Nonce': WP.restNonce
				}
			})
			.then(async response => {
				const data = await response.json()
				X(response, data)
				if(response.status === 201){
					notify('Posted comment. Thanks for participating!', {icon: '💬'})
					this.replaceWith(new DYComment(data))
				}else if(response.status === 409){
					// response.code: comment_duplicate
					notify(data.message, {id: data.code, icon: '💬'})
				}
			})
			.catch(e => {
				console.error(e.json())
			})
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