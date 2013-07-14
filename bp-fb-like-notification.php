<?php 
/* 
Plugin Name: FB like notification for buddypress
Plugin URI: http://www.emediaidentity.com/bp-fb-like-notification/
Description: This Buddypress plugin updates notification and browser window title while user is away
Version: 1.0
Revision Date: 14 07, 2013
Requires at least: Wordress 3.0, Buddypress 1.6.5 
Tested up to: Wordpress 3.5.2, Buddypress 1.7.3
License: GNU General Public License 2.0 (GPL) http://www.gnu.org/licenses/gpl.html
Author: ckchaudhary
Author URI: http://webdeveloperswall.com/
Network: true
*/

//do anything only if buddypress is active
add_action( 'bp_include', 'bfln_instantiate' );
function bfln_instantiate() { 
	new BP_FB_like_notification(); 
}

class BP_FB_like_notification {
	function __construct() {
		$load_plugin = false;
		if( is_user_logged_in() ){
			$load_plugin = true;
		}

		/* The plugin loads another javascript file(one more HTTP request), and causes multiple ajax requests to server.
		 * You can use the below filter to conditionaly load the plugin.
		 		E.g: load the plugin based on user roles!!
		 			 just return false, from your hooked function and the plugin wouldn't be loaded
	 	*/
		$load_plugin = apply_filters( 'bfln_load_plugin', $load_plugin );

		if( $load_plugin ){
			add_action( 'wp_enqueue_scripts',  array( $this, 'enqueue_scripts' ) );
			add_action( 'wp_ajax_bfln_get_notification',  array( $this, 'ajax_get_notifications' ) );	
		}
	}
	
	function enqueue_scripts(){
		wp_enqueue_script(
			"bfln_main",
			path_join( WP_PLUGIN_URL, basename( dirname( __FILE__ ) )."/bp-fb-like-notification_v4.js" ),
			array( 'jquery' )
		);
		
		/*the time interval : after each interval an ajax request to check for new notification is triggered
		default is 2 minutes : 2*60*1000: computers understand milliseconds only :) 
		if you want change 2 minutes to something else, use the filter*/
		$time = apply_filters( 'bfln_ajax_interval', 2*60*1000 );

		$arguments = array(
			"action"	=> "bfln_get_notification",
			"time"		=> $time,
			"doctitle"	=> "",
			"newdoctitle"	=> "",
			"newnotification"	=> 0 
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
