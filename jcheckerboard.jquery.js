(function($) {
		/**
		*	Author : Hugo Casabella
		*	URL : hugo.casabella.fr/jcheckerboard
		*	mode : dev
		**/
		var defauts = {
			speed			: 800,
			init					: {top:1, left:1},
			width 				: 500,
			height			: 500,
			nbColumn 	: 3,
			nbLine 			: 3,
			navigation 	: false,    // selector
			arrow 			: false,	// horizontal, vertical
			fullsize 			: false		// bool
		};
		
		
		var boardLeft; // position left
		var boardTop; // position top
		

	$.fn.jcheckerboard = function(opts){  
	var options = $.extend(defauts, opts); 
		this.wrapInner("<div id='slide'></div>");
		var slider = $('#slide');
		/* resize */
		$(window).resize(function(){ resize(); });
		function resize(){
			if(options.fullsize){
				options.width = $(window).outerWidth();
				options.height = $(window).outerHeight();
			}
		}
		resize();

		if(options.init){
			slider.css({
				"top" : -options.init.top * options.height + options.height,
				"left" : -options.init.left * options.width + options.width
			});
		}
		
		
		boardposition(); // return position
		/* return position top and left */
		function boardposition(){ 
				p =  slider.position();
				boardLeft = p.left;
				boardTop = p.top;
		}
		
		if(options.navigation){
			navigation(boardTop, boardLeft);
		}

		
		/* css  */
		this.css({
			"width" : options.width,
			"height" : options.height		
		});
		
		slider.css({"width" : options.nbColumn * options.width});
		
		slider.find('*').css({
			"width" : options.width,
			"height" : options.height,
			"float" : "left",
			"position" : "relative",
			"display" : "block"
		});
		

		/** arrow  
		*	option : true, horizontal, vertical
		**/
		if(options.arrow){
			if(options.arrow == 'horizontal'){
			htmlArrow = '<div id="jcheckerboardArrow"> \
										<div class="arrow left" id="left"></div> \
										<div class="arrow right" id="right"></div>\
									</div>';			
			}
			else if(options.arrow == 'vertical'){
			htmlArrow = '<div id="jcheckerboardArrow"> \
										<div class="arrow up" id="up"></div>\
										<div class="arrow down" id="down"></div> \
									</div>';			
			}
			else{
			htmlArrow = '<div id="jcheckerboardArrow"> \
										<div class="arrow up" id="up"></div>\
										<div class="arrow down" id="down"></div> \
										<div class="arrow left" id="left"></div> \
										<div class="arrow right" id="right"></div>\
									</div>';			
			}
			this.after(htmlArrow);
			$('.arrow').bind('click', {type : 'arrow' }, coordonne); //on attache l'evenement
			
		}
		
		var arrow = {
			item : {
				arrowUp : $('#up'),
				arrowDown : $('#down'),
				arrowLeft : $('#left'),
				arrowRight : $('#right')
			},
			direction : {
				up : {top: options.height, left: 0},
				down : {top: -options.height, left: 0},
				left : {top: 0, left: options.width},
				right : {top: 0, left: -options.width}
			}
		};
		
		controlArrow(boardLeft, boardTop);
		
		/* navigation */
		if(options.navigation){
			options.navigation.find('a').bind('click', {type: 'navigation'}, coordonne);
		}
		
		function navigation(top, left){
			if(top != 0){
				top = -top / options.height  + 1;
			}
			else{
				top = 1
			}
			if(left != 0){
				left = -left / options.width  +1;
			}
			else{
				left = 1;
			}
			//console.log(top+','+left);
			options.navigation.find('a').removeClass('selected');
			rel = 'a[rel="'+top+','+left+'"]';
			options.navigation.find(rel).addClass('selected');
		};
		
		
		

		
		
		function controlArrow(left , top){ //Control arrow
			if(top == 0){
				arrow.item.arrowUp.hide();
			}
			else{
				arrow.item.arrowUp.show();
			}
			if(left == 0){
				arrow.item.arrowLeft.hide();
			}
			else{
				arrow.item.arrowLeft.show();
			}
			if(top == -(options.nbLine -1) * options.height){
				arrow.item.arrowDown.hide();
			}
			else{
				arrow.item.arrowDown.show();
			}	
			if(left == -(options.nbColumn - 1) * options.width){
				arrow.item.arrowRight.hide();
			}
			else{
				arrow.item.arrowRight.show();
			}
		}
		
		
		function coordonne(event){
			var top;
			var left;
			boardposition(); //detection position
			
			if(event.data.type == 'arrow'){
				var sens = $(this).attr('id');
				top = boardTop + arrow.direction[sens].top;
				left = boardLeft + arrow.direction[sens].left;
				
			}

			if(event.data.type == 'navigation'){
				var map = $(this).attr('rel').split(',');				
				if(map[1] > options.nbColumn){
					map[1] = options.nbColumn;
				}	
				if(map[0] > options.nbLine){
					map[0] = options.nbLine;
				}
				top =  - options.height * map[0] + options.height;		
				left =  - options.width * map[1] + options.width;
			}
			
			if(!slider.is(':animated')){ // stop animation
				if(options.navigation){
					navigation(top, left);
				}
				slider.animate({ 
						left:  left,
						top:  top
					}, options.speed, function(){
						controlArrow( left,  top); 
						
				});	
			}
			return false;
		}
		return this;
	}
	
})(jQuery);