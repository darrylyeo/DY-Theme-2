<?php

/* PHP includes */
foreach([
	// Helper functions
	'framework',

	// Essentials
	'theme',
	'custom-post-types',
	'post-meta',
	
	// Templating
	'post-content-sections',
	'default-content',
	
	// WP Rest API
	'rest-api-terms',
	'rest-api-terms-field',
	'rest-api-featured-images',
	'rest-api-yoast-seo',

	// Feature Disabling - Front End
	'disable-meta',
	//'disable-jquery',
	'disable-wp-mediaelement',
	'disable-oembed',
	'disable-emojis',

	// Feature Disabling - Back End
	'disable-wordpress-events-and-news'
] as $include){
	include_once "wp/$include.php";
}


add_action('wp_enqueue_scripts', function(){
	foreach([
		'first' => 'assets.js',
		'assets-load.js'
	] as $handle => $script){
		wp_enqueue_script($handle, get_theme_file_uri($script), null, null, true);
	}
	
	// Localize WP variables
	wp_localize_script( 'first', 'WP', [
		'siteURL' => WP_SITEURL,
		'themes' => get_theme_root_uri(),
		'parentTheme' => get_template_directory_uri(),
		'childTheme' => get_stylesheet_directory_uri(),
		'rest' => get_rest_url() . 'wp/v2',
		'restNonce' => wp_create_nonce( 'wp_rest' )
	]);
});


/*
<script src="<?= get_theme_file_uri('js/libraries/custom-elements.min.js') ?>"></script>
<script src="<?= get_theme_file_uri('js/libraries/web-animations.min.js') ?>"></script>
<script src="<?= get_theme_file_uri('js/framework/framework.js') ?>"></script>
<script src="<?= get_theme_file_uri('assets.js') ?>"></script>
<script>
const WP = <?= json_encode([
	'siteURL' => WP_SITEURL,
	'themes' => get_theme_root_uri(),
	'parentTheme' => get_template_directory_uri(),
	'childTheme' => get_stylesheet_directory_uri(),
	'rest' => untrailingslashit(get_rest_url()),
	'restNonce' => wp_create_nonce( 'wp_rest' )
]) ?>
</script>
*/