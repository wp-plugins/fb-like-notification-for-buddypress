=== FB like notification for buddypress ===
Contributors: ckchaudhary 
Donate link:http://emediaidentity.com
Tags: buddypress, notification, auto refresh notification
Requires at least: 1.6
Tested up to: 1.6.5
Stable tag: 0.1

This Buddypress plugin updates notification and browser window title while user is away

== Description ==

The plugin repeatedly checks for new notifications for the loggedin user and if any new notification is found, it does 3 things:

1) **Updates the browser window title**( e.g: \'members|mydomain.com\' becomes \'(2) members|mydomain.com\' ) and blinks/switches repeatedly between the old and new title

2) **Updates the notification menu:**

 - adds new notification(if any) items to the list

 - updates the existing ones(if any). E.g: from \'You have 1 new message\' to \'You have 2 new messages\'

 

**Note: **The second (updating notification menu) has been developed according to the markup of default buddybar/wp-admin bar, so if your theme doesn\'t have one, or have a custom notification list, it wont work, althoug the broswer title will update just fine.

The plugin is still in testing mode, and i wouldn\'t suggest you use it on an \'actual\' website straight away.

Please report bugs and suggestions.

 

== Installation ==

Extract the zip file and just drop the contents in the wp-content/plugins/ directory of your WordPress installation and then activate the Plugin from Plugins page.