$('.post').each(function() {
	var placeToMap = false;	
	var postID;
	var coordinates;
	var zoomLevel = 4;	
	// var mapRelatedTags = 0;
	
	$(this).find('a.tags').each( function(i,item) {
		var tagString = $(this).html();
		if (tagString.indexOf("place: ") >= 0){
			placeToMap = true;
			postID = $(this).parents('.post').attr('id');
			coordinates = tagString.replace('place: ','').split(" ");
			// $(this).remove();
			// mapRelatedTags++;
		}
		
		if (tagString.indexOf("zoom: ") >= 0) {
			var zoomValue = tagString.replace('zoom: ','');
			var isZoomNumber = isNumber(zoomValue);
			if(isZoomNumber) {
				zoomLevel = parseInt(zoomValue);					
			}				
			// $(this).remove();				
			// mapRelatedTags++;			
		}	
	} );
	
	// if the place & zoom tags are all the tags, remove the whole list
	/* if(mapRelatedTags === noOfTags){
		$(this).find('li.tags').remove();
	} */
	
	if(placeToMap) {
		// TODO: get post date in case we are using the date markers
		geojson.push({ "geometry": { "type": "Point", "coordinates": coordinates } });
		markers[postID] = {
			"geojsonIndex": geojson.length, 
			"coordinates": [84.334, 28.607], 
			"zoom": zoomLevel, 
			"date": "Not Implemented Yet" 
		};
	}
});