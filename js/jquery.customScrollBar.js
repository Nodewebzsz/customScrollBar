/*

  jquery.customScrollBar by Gregor Adams aka. Pixelass.
  ©2013 by Pixelass

  a plugin to create a custom scrollbar that allows css styling

  This plugin handles the idea differently than other plugins. There is
  no use of the mousewheel (scrollwheel) plugin.

  it translates the native scroll and therefore aims to deliver an
  experience as close to the native behaviour as possible

  Licensed under the MIT license: http://opensource.org/licenses/MIT

  Options:
  theme:     any theme name
  -> events: scrollstarted
             scrollended
             thumbcclick
             ==>(call functions when event occurs)
  arrows:    boolean (show or hide the clickable arrows)
*/

(function ($) {
    $.fn.customScrollBar = function (options) {
        // set some default options
        $(this).each(function (){
            var defaults = {
                theme: 'custom-scroll-bar',
                arrows: true,
                scrollstarted: function(){
                    // the scroll has started
                },
                scrollended: function(){
                    // the scroll has ended
                },
                thumbclick: function(){
                    // the thumb was clicked
                }
            };
            // extend the options
            options = $.extend(defaults, options);

            // set the variables
            var thisElement = $(this);
            var $body = $('body');
            var $window = $(window);
            // for later use
            var clickY = 0;
            var $dragging = null;
            var scrollTriggerFunction;
            var deltaY;
            var clickYY;
            var scrolling;
            var showArrows = "";
            var scrollEnded;
            // wrap our element
            thisElement.wrap('<div class=\"scroll-wrapper\" >');
            thisElement.wrap('<div class=\"scroll-area\" >');
            // get new elements and dependant calculations
            var $scrollArea = thisElement.parent();
            var $scrollWrapper = $scrollArea.parent();
            var thisHeight = parseInt((thisElement.outerHeight()),10);
            var scrollAreaHeight = parseInt(($scrollArea.outerHeight()),10);
            var thisScroll = parseInt(($scrollArea.scrollTop()),10);


            // the factor will be used for calculating the relation between
            // our events and elements
            var factor = thisHeight / scrollAreaHeight;
            var scrollBarHeight = scrollAreaHeight / factor;
            if (options.arrows) {
                showArrows =  '<span class=\"scroll-trigger top\"/><span class=\"scroll-trigger bottom\"/>';
            }
            var newScrollBar = '<div class=\"scroll-track\">'
                + '<div class=\"scroll-bar\"/>'
                + showArrows
                + '</div> ';
            // add the scrollbar
            if (thisHeight > scrollAreaHeight){
                $scrollArea.parent().append(newScrollBar);
            }
            // get new elements and dependants
            var $scrollBar = $scrollWrapper.find('.scroll-bar');
            var $scrollTrack = $scrollWrapper.find('.scroll-track');
            var $scrollTriggerTop =  $scrollWrapper.find('.scroll-trigger.top');
            var $scrollTriggerBottom =  $scrollWrapper.find('.scroll-trigger.bottom');
            $scrollTrack.addClass(options.theme);
            var thisMargin = parseInt(($scrollBar.css('margin-top')),10) * 2;
            // make sure our scrollbar is visible
            if (scrollBarHeight < thisMargin * 2){
                scrollBarHeight = thisMargin * 2;
            }
            if (scrollBarHeight < 20){
                scrollBarHeight = 20;
            }
            var scrollHasEnded = function (){
                $scrollTrack.removeClass("scrolling");
                options.scrollended();
                scrolling = false;
            };
            // set the height of the scrollbar
            $scrollBar.css({
                height: scrollBarHeight - thisMargin
            });

            // lion scrollbars handling
            // on lion scrollbars flash up on page load
            // let's add and remove the class to make it visible for a
            // split second
            $scrollTrack.addClass("scrolling");
            setTimeout(function (){
                $scrollTrack.removeClass("scrolling");
            },600);

            // dirty hack to prevent webkits drag-scroll
            $scrollWrapper.on('scroll',function (){
                var $this = $(this);
                $this.scrollLeft(0);
            });
            // handling the native mouse scroll

            $scrollArea.on('scroll', function (){
                if (!scrolling) {
                    options.scrollstarted();
                }
                var $this = $(this);
                thisScroll = parseInt(($this.scrollTop()),10);
                clearTimeout(scrollEnded);
                scrollEnded = setTimeout(scrollHasEnded,200);
                $scrollTrack.addClass("scrolling");
                $scrollBar.css({
                    top: thisScroll / factor
                });
                scrolling = true;

            });
            thisElement.parent().parent().on('mousedown', '.scroll-track', function (e){
                var $this = $(this);
                var thisOffset =  parseInt(($this.offset().top),10);
                var trackOffset =  parseInt(($this.find('.scroll-bar').position().top),10);
                var trackPosition =  $this.find('.scroll-bar').position().top / scrollBarHeight;
                var correctOffset = e.pageY - thisOffset - trackOffset;
                $this.addClass('clicked');
                options.thumbclick();
                // prevent the cursor from changing to text-input
                e.preventDefault();
                // calculate the correct offset
                clickY = thisOffset + correctOffset;
                clickYY = thisOffset + thisMargin;
                if ($( e.target).hasClass('scroll-bar')) {
                    $dragging = $(e.target);
                }


            })
            // scroll to position if the track is clicked (but prevent
            // when triggers or the bar is clicked)
                .on('mousedown', '.scroll-track', function (e){
                    if (!$( e.target).hasClass('scroll-trigger') && !$( e.target).hasClass('scroll-bar')) {
                        deltaY = e.pageY - clickYY;
                        $scrollArea.stop(true,true).animate({scrollTop: deltaY * factor},1);
                    }
                });


            // scrolling via the triggers (up-down-arrows)
            // Top arrow
            $scrollTriggerTop.on('mousedown', function (){
                $scrollArea.stop(true,true).animate({scrollTop: "-=" + factor + "px"},factor);
                scrollTriggerFunction = setInterval(function (){
                    $scrollArea.stop(true,true).animate({scrollTop: "-=" + factor + "px"},factor);
                },1);
            });
            // Bottom arrow
            $scrollTriggerBottom.on('mousedown', function (){
                $scrollArea.stop(true,true).animate({scrollTop: "+=" + factor + "px"},factor);
                scrollTriggerFunction = setInterval(function (){
                    $scrollArea.stop(true,true).animate({scrollTop:  "+=" + factor + "px"},factor);
                },1);
            });

            // on mouseup or mouseleave we will kill all intervals and set
            // dragging to null to prevent leaking
            $body.on('mouseup mouseleave', function (){
                clearInterval(scrollTriggerFunction);
                $dragging = null;
                $scrollTrack.removeClass("clicked");
            })
            // on mosemove we will move our scrollbar if dragging is
            // active (after mousedown on scroll-track)
                .on('mousemove', function (e){
                    if ($dragging) {
                        deltaY = e.pageY - clickY ;
                        $scrollArea.stop(true,true).animate({scrollTop: deltaY * factor},factor);
                    }
                });
        });

    };
})(jQuery);
