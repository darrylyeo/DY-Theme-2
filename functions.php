<?php

/* PHP includes */
foreach([
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

	// Feature Disabling
	'disable-generator-meta',
	//'disable-jquery',
	'disable-wp-mediaelement',
	'disable-oembed',
	'remove-emojis'
] as $include){
	include_once "wp/$include.php";
}


add_action('wp_enqueue_scripts', function(){
	foreach([
		'first' => 'js/libraries/custom-elements.min.js',
		'js/libraries/web-animations.min.js',
		'js/framework/framework.js',
		'assets.js'
	] as $handle => $script){
		wp_enqueue_script($handle, get_theme_file_uri($script), null, null, true);
	}
	
	// Localize WP variables
	wp_localize_script( 'first', 'WP', [
		'siteURL' => WP_SITEURL,
		'themes' => get_theme_root_uri(),
		'parentTheme' => get_template_directory_uri(),
		'childTheme' => get_stylesheet_directory_uri(),
		'rest' => get_rest_url() . 'wp/v2', // untrailingslashit(get_rest_url()),
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