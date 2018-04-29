<html lang="en-US">

<meta charset="UTF-8">
<base href="<?= WP_SITEURL ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="author" href="https://darryl-yeo.com/about">

<link rel="apple-touch-icon" sizes="180x180" href="/media/icon/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/media/icon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/media/icon/favicon-16x16.png">
<link rel="manifest" href="/media/icon/site.webmanifest">
<link rel="mask-icon" href="/media/icon/safari-pinned-tab.svg" color="#67b7e1">
<link rel="shortcut icon" href="/media/icon/favicon.ico">
<meta name="msapplication-TileColor" content="#67b7e1">
<meta name="msapplication-config" content="/media/icon/browserconfig.xml">
<meta name="theme-color" content="#67b7e1">

<!-- head -->
<?= wp_head() ?>
<!-- /head -->

<dy-style></dy-style>

<dy-page>
	<header>
		<nav id="screen-reader-nav">
			<div><a href="#content">Skip to main content</a></div>
		</nav>
		<nav id="secondary-nav">
			<div><a href="./about">About Me</a></div>
			<div><a href="./about-this-site">About This Site</a></div>
			<div><a href="./contact">Contact</a></div>
			<div class="has-sub-menu">
				<a tabindex="0">Social Profiles</a>
				<div>
					<div><a href="https://www.facebook.com/darrylyeoblog"><i icon="Facebook"></i>Facebook</a></div>
					<div><a href="https://twitter.com/ddarrylyeo"><i icon="Twitter"></i>Twitter</a></div>
					<div><a href="https://plus.google.com/+DarrylYeo"><i icon="Google+"></i>Google+</a></div>
					<div><a href="https://www.pinterest.com/darrylyeo/"><i icon="Pinterest"></i>Pinterest</a></div>
					<div><a href="https://www.linkedin.com/in/darrylyeo"><i icon="LinkedIn"></i>LinkedIn</a></div>
					<div><a href="https://soundcloud.com/darrylyeo"><i icon="SoundCloud"></i>SoundCloud</a></div>
					<div><a href="https://github.com/darrylyeo"><i icon="GitHub"></i>GitHub</a></div>
					<div><a href="https://www.khanacademy.org/profile/darrylyeo/projects"><i icon="KhanAcademy"></i>Khan Academy</a></div>
					<div><a href="https://codepen.io/darrylyeo"><i icon="CodePen"></i>CodePen</a></div>
					<div><a href="https://www.codingame.com/profile/be5e16d40e8760f2bf5dfcaadac87f6c2729851"><i icon="CodinGame"></i>CodinGame</a></div>
					<div><a href="https://musescore.com/darrylyeo"><i icon="MuseScore"></i>MuseScore</a></div>
				</div>
			</div>
			<div class="has-sub-menu">
				<a tabindex="0">Experiments</a>
				<div id="experiments">
					<div><a data-experiment="night-mode" title="Colors will be optimized for dark environments."><i icon="moon"></i>Night Mode</a></div>
					<div><a data-experiment="jelly" title="Anything the mouse touches will shift around."><i icon="move"></i>Jelly</a></div>
					<div><a data-experiment="spotlight" title="Anything the mouse touches will cast a backdrop shadow."><i icon="flashlight"></i>Spotlight</a></div>
					<div><a data-experiment="tornado" title="All page elements will spin upside down (effect is compounded for nested elements)."><i icon="tornado"></i>Tornado</a></div>
					<div><a data-experiment="3d-parallax" title="All page elements will pop into 3D."><i icon="layers"></i>3D Parallax</a></div>
					<!-- <div><a data-experiment="ajax-navigation" title="Navigate the website without refreshing the page."><i icon="compass"></i>AJAX Navigation</a></div> -->
					<div><a data-experiment="pin-window" title="The page will size to fit your entire screen, regardless of your window size or position."><i icon="pin"></i>Pin Window</a></div>
					<div><a data-experiment="edit-mode" title="All text on the page will become editable."><i icon="✍"></i>Edit Mode</a></div>
					<div><a data-experiment="information-overload" title="You will be notified of every interaction you have with the webpage."><i icon="ℹ"></i>Information Overload</a></div>
					<div><a data-experiment="resize-everything" title="All page elements will become resizeable."><i icon="resize"></i>Resize Everything</a></div>
					<div><a data-experiment="battery-status" title="You will be notified of your battery charge/discharge status."><i icon="🔋"></i>Battery Status</a></div>
				</div>
			</div>
		</nav>
		<nav id="main-nav">
			<a id="logo" href="./">
				<!-- <img src="../logo/Darryl-Yeo-Logo.svg">
				<svg viewBox="0 0 260 95">
					<use href="logo/Darryl-Yeo-Logo.svg#logo"></use>
				</svg>  -->
				<span class="darryl">D<span class="arryl">arryl</span></span><span class="yeo"> Y<span class="eo">eo</span></span>
			</a>
			<div><a class="code" href="./code">Code</a><dy-icon icon="code"></dy-icon></div>
			<div><a class="art" href="./art">Art</a><dy-icon icon="art"></dy-icon></div>
			<div><a class="music" href="./music">Music</a><dy-icon icon="music"></dy-icon></div>
			<div><a class="blog" href="./blog">Blog</a></div>
			<div><a class="learn" href="./learn">Learn</a></div>
			<dy-nav></dy-nav>
		</nav>
	</header>
	<main id="content">
		
	</main>
	<footer>
		<p>Website Design and Content © 2014-2018 Darryl Yeo. All Rights Reserved.</p>
	</footer>
</dy-page>

<dy-notifications></dy-notifications>

<script type='application/ld+json'> 
{
	"@context": "http://www.schema.org",
	"@type": "Person",
	"name": "Darryl Yeo",
	"url": "https://darryl-yeo.com",
	"sameAs" : [
		"https://www.facebook.com/darrylyeoblog",
		"https://twitter.com/ddarrylyeo",
		"https://plus.google.com/+DarrylYeo",
		"https://www.pinterest.com/darrylyeo/",
		"https://www.linkedin.com/in/darrylyeo",
		"https://soundcloud.com/darrylyeo",
		"https://github.com/darrylyeo",
		"https://www.khanacademy.org/profile/darrylyeo/projects",
		"https://codepen.io/darrylyeo",
		"https://www.codingame.com/profile/be5e16d40e8760f2bf5dfcaadac87f6c2729851",
		"https://musescore.com/darrylyeo"
	],
	"description": "Darryl Yeo is a web developer, graphic designer, and music composer who loves to inspire others."
}
</script>
<script type='application/ld+json'> 
{
	"@context": "http://www.schema.org",
	"@type": "WebSite",
	"name": "Darryl Yeo – Glad to inspire.",
	"alternateName": "Darryl Yeo",
	"url": "https://darryl-yeo.com",
	"description": "The personal website and blog of Darryl Yeo - web developer, graphic designer, and music composer."
}
</script>

<!-- footer -->
<?= wp_footer() ?>
<!-- /footer -->