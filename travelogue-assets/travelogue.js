var placeTags = {};
var geocoder;
var map;
var placesToMap= 0;
var currentPlace = 1;
var doMasonry;
var firstLoad = true;

function createMap(mapID, placeToMap, zoomLevel) {
  	geocoder = new google.maps.Geocoder();
    //var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
        zoom: zoomLevel,
        disableDefaultUI: true,
        scrollwheel: false,
        //center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    //var mapElement = "map-" + mapID;
    map = new google.maps.Map(document.getElementById(mapID), myOptions);
    codeAddress(placeToMap, mapID);  
}

function mapPlaces() {
	//createMap
	//console.log(placeTags[0]);
	var mapID = placeTags[currentPlace].mapID;
	var placeToMap = placeTags[currentPlace].place;
	var zoomLevel = placeTags[currentPlace].zoom;
	createMap(mapID, placeToMap, zoomLevel);
}

function codeAddress(place, mapID) {
	var address = place;
	var postID = mapID.replace('map-','#');
	//console.log(postID);
   
   	geocoder.geocode( { 'address': address}, function(results, status) {
	if (status == google.maps.GeocoderStatus.OK) {
		//var marker = 'http://static.tumblr.com/qxrkgx6/TVJlz5m7c/pin.png';
		
		map.setCenter(results[0].geometry.location);
		var marker = new google.maps.Marker({
			map: map,
			position: results[0].geometry.location
			//icon: marker
		});
       
		var countryLabel;
		var adminLabel = "";
		var localityLabel = ""
		var r = results[0].address_components;
       
		for (var key in r) {
    	  if (r.hasOwnProperty(key)) {
    	  	if(r[key].types[0] === "administrative_area_level_2") {
    	  		adminLabel = r[key].long_name;
    	  	}
    	    if(r[key].types[0] === "country") {
    	    	countryLabel = r[key].long_name;
    	    }
    	    if(r[key].types[0] === "locality") {
    	    	localityLabel = r[key].long_name;
    	    }
    	  }
    	}
    	
    	var fullLabel;
    	var linkAddress = results[0].formatted_address;
    	
    	if(localityLabel != "") {
    		fullLabel = localityLabel + ", " + countryLabel;
    	} else if (adminLabel != "") {
    		fullLabel = adminLabel + ", " + countryLabel;
    	} else {
    		fullLabel = countryLabel;
    	}
    	
		$(postID).find('ul.meta-list').prepend('<li class="place"><a href="http://maps.google.com/?q=' + linkAddress +'" target="_blank"><span class="icon"></span>' + fullLabel + '</a></li>');
		$(postID).find('.mapContainer .mapMain').prepend('<a class="mapLink" href="http://maps.google.com/?q=' + linkAddress +'" target="_blank"><span></span></a>');
 
		currentPlace++;
       
		if(currentPlace <= placesToMap){
			mapPlaces();
		}
     } else {
		$(postID).find('.mapContainer').remove();
		currentPlace++;
		if(currentPlace <= placesToMap){
			mapPlaces();
		}
		//alert("Geocode was not successful for the following reason: " + status);  
     }
   });
 }

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}



$(function() {
	var themeCredit = '<span class="themeCredit"><a href="http://www.traveloguetheme.tumblr.com" target="_blank">Travelogue Theme</a> by <a href="http://www.girafficthemes.com" target="_blank">Giraffic</a></span>';
	$(".post.video").fitVids();
	$('footer .credit').append(themeCredit);
	$('.footerMain').masonry({
	   // options
	   itemSelector : '.widget',
	   gutterWidth: 20
	 });
	$('.post.chat ul.chat li div.label').each(function() {
		labelContent = $(this).html();
		newLabel = labelContent.replace(':','');
		$(this).html(newLabel);
	});
	
	$("<select />").appendTo(".nav");
	
	// Create default option "Go to..."
	$("<option />", {
	   "selected": "selected",
	   "value"   : "",
	   "text"    : "Go to..."
	}).appendTo("nav select");
	
	 var match = false;
	 var ifIndex = $('body').hasClass("index");
	
	// Populate dropdown with menu items
	$(".nav ul li a").each(function() {
		 var el = $(this);
		 var pathname = window.location.pathname;
		 	if(pathname === el.attr("href")) {		 	
		 		$(this).addClass("active");
		 		match = true;
		 		$("<option />", {
		 		    "value"   : el.attr("href"),
		 		    "text"    : el.text(),
		 		    "selected" : "selected"
		 		}).appendTo(".nav select");
		 	} else {
		 		$(this).removeClass("active");
		 		$("<option />", {
		 		    "value"   : el.attr("href"),
		 		    "text"    : el.text()
		 		}).appendTo(".nav select");
		 	}
	});
	
	if(match) {
		$("<option />", {
			   "value"   : "",
			   "text"    : "Go to..."
			}).prependTo(".nav select");
	
	} else { 	
	 	$("<option />", {
	 		   "selected": "selected",
	 		   "value"   : "",
	 		   "text"    : "Go to..."
	 		}).prependTo(".nav select"); 	
	}
	
	$(".nav select").change(function() {			
	  window.location = $(this).find("option:selected").val();
	});
	
	$('a.highRes').fancybox({ 
		type: "image",
		titleShow: false,
		padding: 0,
		margin: 25,
		overlayColor: $("body").css("background-color"),
		overlayOpacity: 0.75,
		hideOnContentClick: true
	});
	
	$('a.highRes').hover(function() {
		$(this).find(".zoomBtn").toggleClass("hover");
	});
	
	$('.post').each(function() {
		var noOfTags = $(this).find('li.tags a').length;
		
		if(noOfTags <= 0) {
			return true;
		}
			
		var placeToMap = false;	
		var mapID;
		var tagPlace;
		var zoomLevel = 4;
		
		var tagsCounted = 0;
		$(this).find('li.tags a').each(function(i,item) {
			var tagString = $(this).html();
			if (tagString.indexOf("place:") >= 0){
				placeToMap = true;
				placesToMap++;
			
				mapID = "map-" + $(this).parents('.post').attr('id');
				tagPlace = tagString.replace('place: ','');
				$(this).parents('.post').find('.mapContainer').removeClass("inactive");
				$(this).remove();
				tagsCounted++;
			}
			
			if (tagString.indexOf("zoom:") >= 0) {
				var zoomValue = tagString.replace('zoom: ','');
				var isZoomNumber = isNumber(zoomValue);
					if(isZoomNumber) {
						zoomLevel = parseInt(zoomValue);					
					}				
				$(this).remove();				
				tagsCounted++;			
			}	
		});
		
		if(tagsCounted === noOfTags){
			$(this).find('li.tags').remove();
		}
		
		if(placeToMap) {
			placeTags[placesToMap] = {"mapID" : mapID, "place": tagPlace, "zoom": zoomLevel};
		}
	});

	if(placesToMap > 0) {
		mapPlaces();
	}
	
	var resizeTimer;
	$(window).resize(function() {
	    clearTimeout(resizeTimer);
	    resizeTimer = setTimeout(browserResize, 100);
	});
	
	browserResize();
});