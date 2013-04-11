<?php 
/* 
Plugin Name: FB like notification for buddypress
Plugin URI: http://emediaidentity.com/bp-fb-like-notification/
Description: This Buddypress plugin updates notification and browser window title while user is away
Version: 0.1
Revision Date: 08 02, 2013
Requires at least: WP 3.4.1, BuddyPress 1.6
Tested up to: WP 3.2.1, BuddyPress 1.6
License: GNU General Public License 2.0 (GPL) http://www.gnu.org/licenses/gpl.html
Author: ckchaudhary
Author URI: http://webdeveloperswall.com/
Network: true
*/

//do anything only if buddypress is active
add_action( 'bp_include', function() { new BP_FB_like_notification(); } );

class BP_FB_like_notification {
	function __construct() {
		add_action( 'wp_enqueue_scripts',  array( $this, 'enqueue_scripts' ) );
		add_action( 'wp_ajax_bfln_get_notification',  array( $this, 'ajax_get_notifications' ) );
	}
	
	function enqueue_scripts(){
		wp_enqueue_script(
			"bfln_main",
			path_join( WP_PLUGIN_URL, basename( dirname( __FILE__ ) )."/bp-fb-like-notification_v4.js" ),
			array( 'jquery' )
		);
		
		/*the time interval : after each interval an ajax request to check for new notification is triggered
		default is 2 minutes : 2*60*1000: computers understand milliseconds only :) 
		if you want change 2 minutes to something else, replace 2 with something else in the line below*/
		$time = 2*60*1000;

		$arguments = array(
			"action"	=> "bfln_get_notification",
			"time"		=> $time,
			"doctitle"	=> "", /*so that javascript can access it without running into null pointer exceptions*/
			"newdoctitle"	=> "", /*so that javascript can access it without running into null pointer exceptions*/
			"newnotification"	=> 0 /*so that javascript can access it without running into null pointer exceptions*/
		);

		wp_localize_script( "bfln_main", "BFLN_", $arguments );
	}

	
	function ajax_get_notifications(){
		$retVal = array(
			"count"	=> 0,
			"notifications"	=> ""
		);
		
		if ( !is_user_logged_in() ){
			echo json_encode($retVal);
			exit();
		}
			
		$user_id = bp_loggedin_user_id();
		$notifictions = bp_core_get_notifications_for_user( $user_id , 'object');
		if( $notifictions && !empty( $notifictions ) ){
			$retVal["count"] = count($notifictions);
			$retVal["notifications"] = $notifictions;
		}
		echo json_encode($retVal);
		exit();
	}
}
?>
