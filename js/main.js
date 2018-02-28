// Break out of iframe
if(this.top.location.href !== this.location.href) this.top.location = this.location


// Greet user
DY.getUser.then(user => {
	const username =
		user ? user.first_name || user.nickname || user.name || user.username :
		document.referrer === 'https://www.khanacademy.org' ? 'fellow Khan Academy user' :
		undefined

	DY.data('lastSession').then(lastSession => {
		if(lastSession.date && 'moment' in window){
			const now = moment()
			const lastVisit = moment(lastSession.date)
			const beenAnHour = now.diff(lastVisit, 'hours') >= 1
			const beenFiveDays = now.diff(lastVisit, 'days') >= 5
	
			if(beenAnHour){
				const greeting = beenFiveDays ? 'Long time no see' : 'Welcome back'
				notify(
					`${greeting}${username ? ', ' + username : ''}! You last visited this site ${lastVisit.fromNow()}.`,
					{
						icon: '👋',
						buttonText: 'Hello!'
					}
				)
			}
		}else{
			notify(`Welcome to my online portfolio${username ? ', ' + username : ''}!`, {
				icon: '👋',
				buttonText: 'Cool!'
			})
		}
	})
})


// Notify online status
if('onLine' in navigator){
	const notifyOnlineStatus = () => {
		if(navigator.onLine){
			notify('...You\'re back online!', {id: 'onLine', dismiss: 5, buttonText: 'Hooray! 🎉'})
		}else{
			notify('Whoops! You\'ve lost internet connection.', {id: 'onLine', buttonText: 'Aw, man!'})
		}
	}
	if(!navigator.onLine) notifyOnlineStatus()
	window.on('online offline', notifyOnlineStatus)
}


if(window.opener) X(`Opened from ${window.opener}`)
if(document.referrer) X(`Referred from ${document.referrer}`)