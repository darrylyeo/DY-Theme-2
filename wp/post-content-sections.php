<?php
add_filter('the_content', function($content){
	$content = '<section id="top">'.preg_replace_callback('/<h2(.*?)>(.*?)<\/h2>/', function($matches){
		list(, $attrs, $title) = $matches;
		$id = sanitize_title($title);
		return "</section><section id={$id}><h2{$attrs}><a href=#{$id} class=anchor>{$title}</a></h2>";
	}, $content).'</section>';

	$content = preg_replace_callback('/<h3(.*?)>(.*?)<\/h3>/', function($matches){
		list(, $attrs, $title) = $matches;
		$id = sanitize_title($title);
		return "<h3 id={$id}{$attrs}><a href=#{$id} class=anchor>{$title}</a></h3>";
	}, $content);

	$content = str_replace('<section></section>', '', $content);
	
	return $content;
});