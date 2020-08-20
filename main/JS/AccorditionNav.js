$(document).ready(function(){
	// accordition must be in window, so its callable from form init in sf
	window.accordition = {}; 
	
	// preparation of accordition items
	accordition.prepare = function(){
		var $accordition = $('.smx-accordition');
		var $panels = $accordition.find('.smx-accordition-panel');
	
		// save submenus height into data attribute
		$panels.each(function(){
			var $menuPanel = $(this).find('.dd');
			$(this).attr('data-height', $menuPanel.outerHeight() + 50);
			$(this).css('height', '44px');
			$menuPanel.hide();
		});
		
	
		// selected panel doesnt exists	
		if(!$('.rolled').length){
			$('.smx-accordition-panel:first').addClass('rolled');
		}

		// show last opened submenu
		accordition.showAccorditionContent($('.rolled .dt a'));
	}


	// submenu toggler
	accordition.showAccorditionContent = function(el){
		var $accordition = $('.smx-accordition');     
	    var $box = el.closest('.smx-accordition-panel');
	    
	    if(!$box.hasClass('expanded')){
		
		// prevent scrollbar on smaller screens when animating
		$accordition.css('overflow', 'hidden');
	
	      $('.expanded').find('.dd').fadeOut();
	      $('.expanded').removeClass('expanded').animate({height: '44px'}, 200);
	      $box.find('.dd').fadeIn();
	      $box.animate({height: $box.attr('data-height') + 'px'}, 300);
	      $box.addClass('expanded');
	      
	      $accordition.css('overflow', 'initial');
	    }
	}

	// handler
	$('body').on('click', '.smx-accordition .dt a', function() {
	  accordition.showAccorditionContent($(this));
	});
});
	