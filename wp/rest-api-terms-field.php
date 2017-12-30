<?php

add_action('rest_api_init', function () {
	register_rest_field(['page', 'post'], 'terms', [
		'get_callback'    => function( $object, $field_name, $request ) {
			$taxonomies = get_taxonomies(
				[
					'public' => true,
					//'_builtin' => false
				],
				'names',
				'and'
			);

			$terms = wp_get_object_terms(
				$object[ 'id' ],
				$taxonomies
			);

			return array_map(function($term){
				return $term->term_id;
			}, $terms);

		},
		'update_callback' => null,
		'schema'          => null,
	]);
});