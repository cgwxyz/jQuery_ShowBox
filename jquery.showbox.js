/*
@name: jQuery ShowBox Plugins
@author:cgwxyz (cgwxyz@gmail.com)
*/
;(function($) {

//declare the plugin's version ; use to check the plugin exists
$.ShowBox = $.ShowBox || {version:'0.1.0'};

//[--Plugin Define
var ShowBox = function(node,opts) {

    var me=this,$me=$(this);
    var $mine=$(node); //get the plugin's Operation jQuery DOM Element

    //Public Methods
    $.extend(me, {
        show: function() {         
			__show__();
        },
        hide: function() {
			__hide__();
        },
        options: function() {
            //return the preset options to users code
            //let users can be change options by later code
            return opts;
        }
    });

    //Private Variables ( Module Level )
    var m_var1, m_var2, m_var3;

    //init the plugin
    function __init__(){
		__initwrapper__();		
		if (opts.autoShow) __show__();
    }
    __init__();

    //Private Functions
    function __show__(){
		$mine.css({width:opts.w-25, height:opts.h-90}).fadeIn();
		_resize_container_image_box( opts.w , opts.h );
		$('#lightbox-container-box').append($mine);
		opts.onShow(me,opts);
    }

    function __hide__(){
		$mine.hide();
		opts.preHide(me,opts);
		$('body').append($mine);
		$('#jquery-overlay').remove();
		$('#jquery-lightbox').remove();
		$('embed, object, select').css({ 'visibility' : 'visible' });
		opts.onHide(me,opts);
    }
	
	function __initwrapper__(){
		$('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-titlebar"><div id="lightbox-title"></div><div id="lightbox-close"><img src="./res_close.gif" id="top-close-bt"></div></div><div id="lightbox-container-box"></div><div id="lightbox-bottom-close"><input type="button" id="bottom-close-bt" value="关闭窗口"></div></div></div>');
		$('#lightbox-title').html(opts.boxtitle);
		var arrPageSizes = ___getPageSize();
		
		// Style overlay and show it
		$('#jquery-overlay').css({
			backgroundColor:	opts.overlayBgColor,
			opacity:				opts.overlayOpacity,
			width:				arrPageSizes[0],
			height:				arrPageSizes[1]
		}).fadeIn();
		
		// Get page scroll
		var arrPageScroll = ___getPageScroll();
		// Calculate top and left offset for the jquery-lightbox div object and show it
		$('#jquery-lightbox').css({
			top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
			left:	arrPageScroll[0]
		}).show();

		// If window was resized, calculate the new overlay dimensions
		$(window).resize(function() {
			// Get page sizes
			var arrPageSizes = ___getPageSize();
			// Style overlay and show it
			$('#jquery-overlay').css({
				width:		arrPageSizes[0],
				height:		arrPageSizes[1]
			});
			// Get page scroll
			var arrPageScroll = ___getPageScroll();
			// Calculate top and left offset for the jquery-lightbox div object and show it
			$('#jquery-lightbox').css({
				top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
				left:	arrPageScroll[0]
			});
		});
		
		$('#bottom-close-bt').click(function(){
			__hide__();
		});
		
		$('#top-close-bt').click(function(){
			__hide__();
		});
		
		if(opts.hideBorder){
			$('#lightbox-container-titlebar').hide();
			$('#lightbox-bottom-close').hide();
			$('#lightbox-container-image-box').css({
				border:'0px',
				backgroundColor:	opts.boxBgColor
			});
		}
	}
	
	function _resize_container_image_box(intImageWidth,intImageHeight) {		
		// Get current width and height
		var intCurrentWidth = $('#lightbox-container-image-box').width();
		var intCurrentHeight = $('#lightbox-container-image-box').height();
		// Get the width and height of the selected image plus the padding
		var intWidth = (intImageWidth + (opts.containerBorderSize * 2)); // Plus the image磗 width and the left and right padding value
		var intHeight = (intImageHeight + (opts.containerBorderSize * 2)); // Plus the image磗 height and the left and right padding value
		// Diferences
		var intDiffW = intCurrentWidth - intWidth;
		var intDiffH = intCurrentHeight - intHeight;
		// Perfomance the effect
		if(opts.hideBorder){
			$('#lightbox-container-image-box').animate({ width: intWidth, height: intHeight-80 },opts.containerResizeSpeed,function() { });
			$('#lightbox-container-box').css({width: intImageWidth,height: intImageHeight});
		}else{
			$('#lightbox-container-image-box').animate({ width: intWidth, height: intHeight },opts.containerResizeSpeed,function() { });
			$('#lightbox-container-box').css({width: intImageWidth-10,height: intImageHeight-90});
		}
	}
	
	function ___getPageSize() {
			var xScroll, yScroll;
			if (window.innerHeight && window.scrollMaxY) {	
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
			var windowWidth, windowHeight;
			if (self.innerHeight) {	// all except Explorer
				if(document.documentElement.clientWidth){
					windowWidth = document.documentElement.clientWidth; 
				} else {
					windowWidth = self.innerWidth;
				}
				windowHeight = self.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else if (document.body) { // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}	
			// for small pages with total height less then height of the viewport
			if(yScroll < windowHeight){
				pageHeight = windowHeight;
			} else { 
				pageHeight = yScroll;
			}
			// for small pages with total width less then width of the viewport
			if(xScroll < windowWidth){	
				pageWidth = xScroll;		
			} else {
				pageWidth = windowWidth;
			}
			arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
			return arrayPageSize;
		}
	/**
	 / THIRD FUNCTION
	 * getPageScroll() by quirksmode.com
	 *
	 * @return Array Return an array with x,y page scroll values.
	 */
	function ___getPageScroll() {
		var xScroll, yScroll;
		if (self.pageYOffset) {
			yScroll = self.pageYOffset;
			xScroll = self.pageXOffset;
		} else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
			yScroll = document.documentElement.scrollTop;
			xScroll = document.documentElement.scrollLeft;
		} else if (document.body) {// all other Explorers
			yScroll = document.body.scrollTop;
			xScroll = document.body.scrollLeft;	
		}
		arrayPageScroll = new Array(xScroll,yScroll);
		return arrayPageScroll;
	}
};//--]Plugin Define

//jQuery Plugin Implementation
$.fn.ShowBox = function(conf) {

    //return existing instance // let users can use the Public Methods
    //Usage: var obj = $('#id').ShowBox({ <options> }).data("ShowBox");
    var el = '';
	el = this.eq(typeof conf == 'number' ? conf : 0).data("ShowBox");
	if(typeof el == 'object'){el = undefined;}
	//$('#box').append('<p>el is'+el+',type is'+typeof el+'</p>');
	if (el) { return el; }

    //setup default options
    var opts = {
        autoShow:true,
	w:400,
	h:300,
	boxtitle:'title',
        onShow:function(e,o){},
        onHide:function(e,o){},
        preHide:function(e,o){},
        api:true,
	hideBorder:false,
	overlayBgColor: 		'#000',		// (string) Background color to overlay; inform a hexadecimal value like: #RRGGBB. Where RR, GG, and BB are the hexadecimal values for the red, green, and blue values of the color.
	overlayOpacity:		0.8,
	boxBgColor: 		'#EFEFEF',
	containerBorderSize:	0,
	containerResizeSpeed:	100
    };

    //if no users options then use the default options
    $.extend(opts, conf);

    // install the plugin for each items in jQuery
    this.each(function() {
        el = new ShowBox(this, opts);
        $(this).data("ShowBox", el);
    });

    //api=true let users can immediate use the Public Methods
    return opts.api ? el: this;

};


})(jQuery);//--]jQuery Plugin Container