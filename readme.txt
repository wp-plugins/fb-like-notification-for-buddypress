=== FB like notification for buddypress ===
Contributors: ckchaudhary 
Donate link:http://emediaidentity.com
Tags: buddypress, buddypress notification, auto refresh notification
Requires at least: WordPress 3.0, BuddyPress 1.6.5 
Tested up to: WordPress 4.1, BuddyPress 4.2
Stable tag: 1.1

This Buddypress plugin updates notifications list and browser window title while user is away

== Description ==

The plugin repeatedly checks for new notifications for the loggedin user and if any new notification is found, it does 2 things:

1) **Updates the browser window title**( e.g: 'members|mydomain.com' becomes '(2) members|mydomain.com' ) and blinks/switches repeatedly between the old and new title

2) **Updates the notification menu:**

 - adds new notification(if any) items to the list

 - updates the existing ones(if any). E.g: from 'You have 1 new message' to 'You have 2 new messages'

 

**Note: **The second (updating notification menu) has been developed according to the markup of default buddybar/wp-admin bar, so if your theme doesn't have one, or have a custom notification list, it wont work.

 

== Installation ==

Extract the zip file and just drop the contents in the wp-content/plugins/ directory of your WordPress installation and then activate the Plugin from Plugins page.

== Changelog ==
= 1.1 =
* Added nonce check in ajax request.
* Enqueued minified version of script.

= 1.0 =
* Minor Bug Fixes and improvements.
* A stable release

= 0.1 =
* Initial beta release.