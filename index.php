<html lang="en-US">

<meta charset="UTF-8">
<base href="<?= WP_SITEURL ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="author" href="https://darryl-yeo.com/about">

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
					<div><a data-experiment="night-mode"><i icon="moon"></i>Night Mode</a></div>
					<div><a data-experiment="jelly"><i icon="move"></i>Jelly</a></div>
					<div><a data-experiment="spotlight"><i icon="flashlight"></i>Spotlight</a></div>
					<div><a data-experiment="tornado"><i icon="tornado"></i>Tornado</a></div>
					<div><a data-experiment="3d-parallax"><i icon="layers"></i>3D Parallax</a></div>
					<div><a data-experiment="ajax-navigation"><i icon="compass"></i>AJAX Navigation</a></div>
					<div><a data-experiment="pin-window"><i icon="pin"></i>Pin Window</a></div>
					<div><a data-experiment="edit-mode"><i icon="pencil"></i>Edit Mode</a></div>
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
		<p>Website Design and Content © 2014-2017 Darryl Yeo. All Rights Reserved.</p>
	</footer>
</dy-page>

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