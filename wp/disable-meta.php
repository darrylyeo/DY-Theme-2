<?php
// https://orbitingweb.com/blog/remove-unnecessary-tags-wp-head/

// Removes EditURI/RSD (Really Simple Discovery) link.
remove_action('wp_head', 'rsd_link');

// Removes wlwmanifest (Windows Live Writer) link.
remove_action('wp_head', 'wlwmanifest_link');

// Removes generator meta.
remove_action('wp_head', 'wp_generator');

// Removes shortlink.
remove_action('wp_head', 'wp_shortlink_wp_head');

// Removes feed links.
// remove_action('wp_head', 'feed_links', 2 );

// Removes comments feed.
// remove_action('wp_head', 'feed_links_extra', 3 );

// Removes prev and next article links
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head');