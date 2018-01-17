<?php
// Adapted from https://wordpress.org/plugins/disable-events-and-news-dashboard-widget/

/**
 * Disable WordPress Events and News widget from the dashboard.
 *
 * @since 1.0
 */
function dweandw_remove() {
	remove_meta_box( 'dashboard_primary', get_current_screen(), 'side' );
}
add_action( 'wp_network_dashboard_setup', 'dweandw_remove', 20 );
add_action( 'wp_user_dashboard_setup',    'dweandw_remove', 20 );
add_action( 'wp_dashboard_setup',         'dweandw_remove', 20 );