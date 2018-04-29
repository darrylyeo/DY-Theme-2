<?php
// Remove some formatting filters for post content, post excerpt, comment content
remove_filter('the_content', 'wptexturize');
// remove_filter('the_content', 'wpautop');

remove_filter('the_excerpt', 'wptexturize');
// remove_filter('the_excerpt', 'wpautop');

// remove_filter('comment_text', 'wptexturize');
// remove_filter('comment_text', 'wpautop');


// Allow HTML in category descriptions and user descriptions
// https://wordpress.org/plugins/allow-html-in-category-descriptions/

foreach(['pre_term_description', 'pre_link_description', 'pre_link_notes', 'pre_user_description'] as $filter){
	remove_filter($filter, 'wp_filter_kses');
}
foreach(['term_description', 'link_description', 'link_notes', 'user_description'] as $filter){
	remove_filter($filter, 'wp_kses_data');
}