<?php

function buffer($callback){
	ob_start();
	$callback();
	$result = ob_get_contents();
	ob_end_clean();
	return $result;
}

// Extreme version of query_posts that can't be reset by wp_reset_query
function extreme_get_posts($queryArgs/*, $callback = null*/){
	global $wp_the_query, $wp_query, $old_wp_the_query;
	$old_wp_the_query = $wp_the_query;
	$wp_the_query = $wp_query = new WP_Query($queryArgs);

	/*if($callback){
		$callback($wp_query);
		extreme_wp_reset_query();
	}*/
	return $wp_query;
}
function extreme_wp_reset_query(){
	global $wp_the_query, $old_wp_the_query;
	$wp_the_query = $old_wp_the_query;
	wp_reset_query();
}

function extreme_remove_all_actions(){
	global $wp_filter, $old_wp_filter;
	$old_wp_filter = $wp_filter;
	$wp_filter = [];
}
function extreme_restore_all_actions(){
	global $wp_filter, $old_wp_filter;
	$wp_filter = $old_wp_filter;
}


function kebabToCamel($str){
	return str_replace('-', '', lcfirst(ucwords($str, '-')));
}