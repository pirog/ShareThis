/**
 * @file
 * This file contains most of the code for the configuration page.
 */
// Create the drupal ShareThis object for clean code and namespacing:
var drupal_st = {
	// This is a selector function.
	select: function() {
		$(this).parent().children().removeClass("st_select");
		$(this).addClass("st_select");
	},
	// This is a selector Function for Services in the picker.
	selectLi: function () {
		$(".st_selectLi").toggleClass("st_selectLi");
		$(this).toggleClass("st_selectLi");
	},
	// These are handlerd for updating the widget pic class.
	multiW: function() {
		$(".st_widgetPic").addClass("st_multiW");
	},
	classicW: function() {
		$(".st_widgetPic").removeClass("st_multiW");
	},
	// These are the handlers for updating the button pic class (stbc = sharethisbuttonclass).
	smallChicklet: function () {
		drupal_st.removeButtonClasses();
		$("#stb_sprite").addClass("stbc");
	},
	largeChicklet: function () {
		drupal_st.removeButtonClasses();
		$("#stb_sprite").addClass("stbc_large");
	},
	hcount: function() {
		drupal_st.removeButtonClasses();
		$("#stb_sprite").addClass("stbc_hcount");
	},
	vcount: function() {
		drupal_st.removeButtonClasses();
		$("#stb_sprite").addClass("stbc_vcount");
	},
	button: function() {
		drupal_st.removeButtonClasses();
		$("#stb_sprite").addClass("stbc_button");
	},
	// This is a helper function for updating button pictures.
	removeButtonClasses: function() {
		var toRemove = $("#stb_sprite");
		toRemove.removeClass("stbc");
		toRemove.removeClass("stbc_large");
		toRemove.removeClass("stbc_hcount");
		toRemove.removeClass("stbc_vcount");
		toRemove.removeClass("stbc_button");
	},
	// We want a function to Setup the picker:
	setupPicker: function() {
		var test = false;
		// First, create the selected Services List.
		$(".st_formPickerLeft").append("<span class='st_formULHeader'>Selected Service</span><ul id='st_formULLeft' class='st_formULLeft'></ul>");
		
		//Then, create the Possible Services List.
		$(".st_formPickerRight").append("<span class='st_formULHeader'>Possible Services</span><ul id='st_formULRight' class='st_formULRight'></ul>");
		
		// Add the services that were found when sharethis.module loaded drupal_add_js(stcommon.js).  
		// This loads all the services that ShareThis officially supports.
		$.each(_all_services, function(key, value) {
			$(".st_formULRight").append("<li id='st_li_" + key + "' class='st_pickerLi'>" + value.title + "</li>");
		});
		// st_declaredServices has been placed in the code on the admin hook function of sharethis.module .
		// It contains the currently saved services.
		var serviceArray = st_declaredServices.split(",");
		$.each(serviceArray, function(sKey, sValue) {
			var name = sValue.split(":")[0];
			var li = $("#st_li_" + name);
			$(".st_formULLeft").append(li);
		});
		
		$(".st_formPicker").append($("<div class='st_clear'></div>"));
	},
	// Need functions for each arrow press (up, down, left, write):
	arrow: function() {
		var li = $(".st_selectLi");
		if (li.length == 1) {
			var isSelect = li.parent(".st_formULLeft").length == 1;
			var event = $(this).attr("id");
			switch (event) {
			case "st_up":
				if (isSelect) {
					var prev = li.prev();
					if (prev.length != 0) {
						prev.before(li);
					}
				}
				break;
			case "st_left":
				if (!isSelect) {
					$(".st_formULLeft").prepend(li);
				}
				break;
			case "st_right":
				if (isSelect) {
					$(".st_formULRight").prepend(li);
				}
				break;
			case "st_down":
				if (isSelect) {
					var next = li.next();
					if (next.length != 0) {
						next.after(li);
					}
				}
				break;
			}
		}
	},
	// Save all the fields into the DB.
	updateOptions: function() {
		$.post('/admin/config/sharethisDB/', {'widget':drupal_st.getWidget(), 'buttons':drupal_st.getButtons(), 'services':drupal_st.getServices()}, function(data) {
				$(".st_formMessage").html(data);
				$( 'html, body' ).animate( { scrollTop: 0 }, 0 );
			}); 
	},
	//Write helper functions for saving:
	getWidget: function () {
		return $(".st_widgetPic").hasClass("st_multiW") ? '5x': '4x';
	},
	getButtons: function () {
		var selectedButton = 'large';
		var buttonButtons = $(".st_wIm");
		buttonButtons.each(function () {
			if ($(this).hasClass("st_select")) {
				selectedButton = $(this).attr("id").substring(3);
			}
		});
		console.log(selectedButton);
		return selectedButton;
	},
	getServices: function () {
		var services = $(".st_formULLeft").children("li");
		var returnString = "";
		var first = true;
		services.each(function() {
			returnString += first ? "" : ",";
			returnString += $(this).attr("id").substring(6) + ":" + _all_services[$(this).attr("id").substring(6)].title;
			first = false;
		});
		return returnString;
	},
	// Function to add various events to our html form elements
	addEvents: function() {
		$(".st_formButton").click(drupal_st.select);
		$(".st_pickerLi").click(drupal_st.selectLi);
		$(".st_arrow").click(drupal_st.arrow);
		$("#st_multiW").click(drupal_st.multiW);
		$("#st_classicW").click(drupal_st.classicW);
		$(".st_formButtonSave").click(drupal_st.updateOptions);
		$("#stb").click(drupal_st.smallChicklet);
		$("#stb_large").click(drupal_st.largeChicklet);
		$("#stb_button").click(drupal_st.button);
		$("#stb_hcount").click(drupal_st.hcount);
		$("#stb_vcount").click(drupal_st.vcount);
	}
	
};

//We want to setup the picker
$(document).ready(drupal_st.setupPicker);
//After the page is loaded, we want to add events to dynamically created elements
$(document).ready(drupal_st.addEvents);


