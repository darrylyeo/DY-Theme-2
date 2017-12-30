<?php
// Adds Yoast SEO fields to page and post metadata to WP REST API responses

add_action('rest_api_init', function(){
	include_once WP_PLUGIN_DIR . '/wordpress-seo/wp-seo.php';
	
	$getYoastMeta = function($object, $field_name, $request) {
		extreme_get_posts([
			name => $object['slug']
		]);
		// foreach(['wp_head', 'wpseo_head', 'wpseo_json_ld', 'wpseo_opengraph', 'wpseo_twitter'] as $actionName) remove_all_actions($actionName);
		extreme_remove_all_actions(); {

			WPSEO_Frontend::$instance = null;
			$wpseo_frontend = WPSEO_Frontend::get_instance();

			wpseo_frontend_head_init();
			global $wpseo_og;
			$opengraph_images = new WPSEO_OpenGraph_Image( $wpseo_og->options );
		
			$wpseo_head = buffer(function(){
				do_action('wp_head');
			});

			$data = [
				head => preg_replace('/<!--(.|\s)*?-->/', '', $wpseo_head),
				title => $wpseo_frontend->title(''),
				canonical => $wpseo_frontend->canonical(false),
				metadesc => $wpseo_frontend->metadesc(false),
				opengraph => [
					title => $wpseo_og->og_title(false),
					description => $wpseo_og->description(false),
					image => [
						urls => $opengraph_images->get_images(),
						dimensions => $opengraph_images->get_dimensions()
					]
				]
			];
			
			/*foreach(WPSEO_Meta::$meta_fields as $category => $meta_fields){
				foreach($meta_fields as $key => $options){
					$data[kebabToCamel($key)] = WPSEO_Meta::get_value($key, $id); // get_post_meta($id, "_yoast_wpseo_$key", true);
				}
			}*/
		}
		extreme_restore_all_actions();
		extreme_wp_reset_query();

		return $data;
	};

	$postTypes = get_post_types([
		'public' => true
	]);
	foreach($postTypes as $type) {
		register_rest_field(
			$type,
			'yoastMeta',
			[
				'get_callback'    => $getYoastMeta,
				'update_callback' => null,
				'schema'          => null,
			]
		);
	}
});