/*
* BP FB like notification - buddypress plugin
* This Buddypress plugin updates notification and browser window title while user is away
*/
var jq = jQuery.noConflict();

function bfln_check_notifications(){
	if (BFLN_.doingajax || BFLN_.iscurrent_tab_active){
		t = setTimeout(bfln_check_notifications, BFLN_.time);
		return false;
	}

	var data = {
		action: BFLN_.action,
		nonce: BFLN_.nonce
	};

	BFLN_.doingajax = true;

	jq.ajax({
		type: "POST",
		url: ajaxurl,
		data: data,
		success: function (response) {
			bfln_after_get_new_notification(response);
			BFLN_.doingajax = false; //reset it so that next ajax request can process
			if( BFLN_.debug )
				console.log( "ajax request completed, aborting" );
		}
	});
	t = setTimeout(bfln_check_notifications, BFLN_.time);
}

function bfln_after_get_new_notification(response) {
	//for some reason, unknown to poor me, a '0' is added at the end of json string. Lets remove it
	var pos = response.lastIndexOf("}");
	if(pos!= -1){
		var response = response.substring(0, pos+1);
	}
	
	var result = jq.parseJSON(response);

	// check if any new notification has come
	if (result.count > 0) {
		//yes!! lets update everything
		bfln_notification_html(result.notifications);
	}
}

/* updates the html for the notification area(admin bar), updates document title and notification count.
 * @param json array of objects of all notification for the user
 * @return void 
*/
function bfln_notification_html(json_data) {
	if( typeof( json_data ) == "undefined" || json_data=="" ){
		return false;
	}
	
	/*
	 * 1) check for new notification ids and match them with old notifications ids
	 * 2) if any new found, simply genrate the html for it and append
	 * 3) if old, match the text and if new, replace the old one with new one
	*/
	var bfln_n_n_count = 0;//count of new notifications
	
	for( i = 0; i < json_data.length; i++ ){
		var notf_id = json_data[i].id;
		if( typeof( notf_id )!="undefined" && notf_id!=null ){
			var found = false;
			var textChanged = false;
			
			for( j=0; j<BFLN_.cached_notf_ids.length; j++){
				if(BFLN_.debug)
					console.log('matching new : ' + notf_id + ' and old : '+ BFLN_.cached_notf_ids[j][0]);
				if( notf_id==BFLN_.cached_notf_ids[j][0] ){
					//this notification id was already found in previous requests
					//lets check if the text is changed. e.g: previous 'you have 1 message', current 'you have 2 messages'
					if( json_data[i].content != BFLN_.cached_notf_ids[j][1] ){
						if(BFLN_.debug)
							console.log('old id ' + notf_id + ' but updated text');
						//text different, its a new one
						textChanged = true;
						BFLN_.cached_notf_ids[j][1] = json_data[i].content;
						jq( "#" + BFLN_.sm_ulid + " > li#wp-admin-bar-notification-"+notf_id+" > a" ).html( json_data[i].content );
						textChangedAt = j;
						break;
					}
					else{
						found = true;
						break;
					}
				}
			}
			if( textChanged==true ){
				bfln_n_n_count++;
			}
			else{
				//if its new add to the found list and increment the new count
				if( !found ){ 
					BFLN_.cached_notf_ids.push( new Array( notf_id, json_data[i].content ) );
					var bfln_n_html = "<li id='wp-admin-bar-notification-" + json_data[i].id + "' class=''>";
					bfln_n_html += "<a class='ab-item' href='"+json_data[i].href+"'>"+json_data[i].content+"</a>";
					bfln_n_html += "</li>";
					jq( "#" + BFLN_.top_parent + " #" + BFLN_.sm_ulid ).append( bfln_n_html );
					bfln_n_n_count++;
				}
			}
		}
	}

	//lets update the browser window title
	//and displayed-count-of-total-notification
	if( bfln_n_n_count > 0 ){
		var bfln_n_n_updated_count = (BFLN_.newnotification * 1) + (bfln_n_n_count * 1);//just to make sure it 'adds' rather than 'appending'
		BFLN_.newdoctitle = "("+bfln_n_n_updated_count+") "+BFLN_.doctitle;
		BFLN_.newnotification = bfln_n_n_updated_count;
		
		BFLN_.stop_blinking = false;
		bfln_blink_browser_title();//start dancing
		
		//ab-pending-notifications is the id of the span which displays notificatio count in admin bar
		jq("#ab-pending-notifications").html(bfln_n_n_updated_count);
		if (jq("#ab-pending-notifications").hasClass('no-alert')) { //initially there were no notifications
			//remove old class(es) and assign new class(es)
			jq("#ab-pending-notifications").removeClass("no-alert").removeClass("count").addClass("pending-count").addClass("alert");
		}
		
		//remove the item which says 'no notifiations'
		jq("#wp-admin-bar-no-notifications").remove();
	}
	//phew! it was lengthy
}

function bfln_blink_browser_title(){
	if( !BFLN_.stop_blinking ){
		if( document.title==BFLN_.doctitle && BFLN_.newdoctitle!="" ){
			document.title=BFLN_.newdoctitle;
		}
		else{
			document.title=BFLN_.doctitle;
		}
	}
	setTimeout( bfln_blink_browser_title, 120 );//will change every 2 seconds
}

jq(function () {
	/*setup some variables*/
	BFLN_.debug = false;
	BFLN_.stop_blinking = true;
	BFLN_.doingajax = false;
	BFLN_.iscurrent_tab_active = true;
	BFLN_.cached_notf_ids = new Array();
	
	/*-----------------------------
	START - populate the existing notification ids
	-----------------------------*/
	//the html check and update is according to the markup of default buddypress bar
	//li#wp-admin-bar-bp-notifications is the starting point
	BFLN_.top_parent = "wp-admin-bar-bp-notifications";//notification top menu li's id
	BFLN_.sm_ulid = "wp-admin-bar-bp-notifications-default";//the notifications sub menu ul's id
	
	jq( "#" + BFLN_.top_parent + " #" + BFLN_.sm_ulid + " > li" ).each(function () {
		var liid = jq(this).attr("id");
		if( typeof(liid)=="undefined" || liid==null )
			return;
		
		var id_parts = liid.split("-");
		var notif_id = id_parts[id_parts.length - 1];
		
		if( typeof(notif_id)=="undefined" || notif_id==null || isNaN(notif_id) )/*grrrr.... sick of these condition checks*/
			return;
		
		BFLN_.cached_notf_ids.push( new Array( notif_id, jq(this).find(">a").html() ) ); 
	});
	/*-----------------------------
	END - populate the existing notification ids
	-----------------------------*/
	
	/*save the original document title*/
	if (BFLN_.doctitle == "") {
		BFLN_.doctitle = document.title;
	}
	
	window.onfocus = function () {
		BFLN_.iscurrent_tab_active = true;
		//console.log("browser gained focus");
		BFLN_.stop_blinking = true;
	};
	window.onblur = function () {
		BFLN_.iscurrent_tab_active = false;
		//console.log("browser lost focus");
	};
	
	t = setTimeout(bfln_check_notifications, BFLN_.time);
	
});