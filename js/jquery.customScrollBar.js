;
(function($, window) { // start closure

    'use strict';
    var defaults = {
        theme: 'custom-scroll-bar',
        'created': function(e, ui) {
            // initialized scrollbar
        },
        'destroyed': function(e, ui) {
            // destroyed scrollbar
        },
        'scrollstarted': function(e, ui) {
            // the scroll has started
        },
        'scrollended': function(e, ui) {
            // the scroll has ended
        },
        'thumbclick': function(e, ui) {
            // the thumb was clicked
        }
    };

    $.scrollbarWidth = function() {
        var parent;
        var child;
        var width;

        if (width === undefined) {
            parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>')['appendTo']('body');
            child = parent['children']();
            width = child['innerWidth']() - child['height'](99)['innerWidth']();
            parent['remove']();
        }

        return width;
    };
    var methods = {
        'init': function(options) {
            if (options) {
                $['extend'](defaults, options);
            }
            var $this = $(this);
            $this['addClass']('original-content');
            var clickY = 0;
            var clickX = 0;
            var $dragging = null;
            var scrollTriggerFunction;
            var deltaY;
            var deltaX;
            var scrolling;
            var scrollEnded;
            var scrollClasses = "scrolling scrolling-horizontally scrolling-vertically";
            var clickClasses = "clicked clicked-horizontally clicked-vertically";
            var newScrollbar = function(axis) {
                var scrollbar = '<div class="scrollbar ' + axis + '">';

                scrollbar += '<div class="scrollbar-button start increment"/>';
                scrollbar += '<div class="scrollbar-button start decrement"/>';

                scrollbar += '<div class="scrollbar-track">';
                scrollbar += '<div class="scrollbar-track-piece start"/>';
                scrollbar += '<div class="scrollbar-thumb"/>';
                scrollbar += '<div class="scrollbar-track-piece end"/>';
                scrollbar += '</div>';

                scrollbar += '<div class="scrollbar-button end increment"/>';
                scrollbar += '<div class="scrollbar-button end decrement"/>';

                scrollbar += '</div>';
                return scrollbar
            }
            var scrollHasEnded = function(e, el) {
                $(el)['removeClass'](scrollClasses);
                defaults['scrollended'](e, el);
                scrolling = false;
            };
            var scrollWrapper = '<div class="scroll-wrapper customScrollBar ' + defaults['theme'] + '"/>';
            var scrollArea = '<div class="scroll-area"/>';

            $this['wrap'](scrollWrapper);
            $this['wrap'](scrollArea);
            var $wrapper = $this['closest']('.scroll-wrapper');
            var $area = $this['closest']('.scroll-area');
            var thisHeight = $this['outerHeight'](true);
            var thisWidth = $this['outerWidth'](true);
            var wrapperHeight = $wrapper['height']();
            var wrapperWidth = $wrapper['width']();

            if (thisHeight > wrapperHeight) {
                $wrapper['append'](newScrollbar("vertical"));
                $wrapper['addClass']('scrollbar-vertical')
                $area['css']({
                    'paddingRight': $.scrollbarWidth()
                });
            }
            if (thisWidth > wrapperWidth) {
                $wrapper['append'](newScrollbar("horizontal"));
                $wrapper['addClass']('scrollbar-horizontal')
                $area['css']({
                    'paddingBottom': $.scrollbarWidth()
                });
            }
            thisHeight = $this['outerHeight'](true);
            thisWidth = $this['outerWidth'](true);




            var $scrollbar = $wrapper['find']('.scrollbar.vertical');
            var $scrollbarTrack = $scrollbar['find']('.scrollbar-track');
            var trackHeight = $scrollbarTrack['outerHeight']();
            var $scrollbarTrackPieceStart = $scrollbarTrack['find']('.scrollbar-track-piece.start');
            var $scrollbarTrackPieceEnd = $scrollbarTrack['find']('.scrollbar-track-piece.end');
            var $scrollbarThumb = $scrollbar['find']('.scrollbar-thumb');
            var scaleFactorY = thisHeight / wrapperHeight;
            var scrollThumbHeight = trackHeight / scaleFactorY;
            scrollThumbHeight = (scrollThumbHeight < 30 ? 30 : scrollThumbHeight)
            var scrollFactorY = wrapperHeight / scrollThumbHeight;

            var $scrollbarHorizontal = $wrapper['find']('.scrollbar.horizontal');
            var $scrollbarTrackHorizontal = $scrollbarHorizontal['find']('.scrollbar-track');
            var trackWidth = $scrollbarTrackHorizontal['outerWidth']();
            var $scrollbarTrackPieceStartHorizontal = $scrollbarTrackHorizontal['find']('.scrollbar-track-piece.start');
            var $scrollbarTrackPieceEndHorizontal = $scrollbarTrackHorizontal['find']('.scrollbar-track-piece.end');
            var $scrollbarThumbHorizontal = $scrollbarHorizontal['find']('.scrollbar-thumb');
            var scaleFactorX = thisWidth / wrapperWidth;
            var scrollThumbWidth = trackWidth / scaleFactorX;
            scrollThumbWidth = (scrollThumbWidth < 30 ? 30 : scrollThumbWidth);
            var scrollFactorX = wrapperWidth / scrollThumbWidth;


            var thisScrollX = $area['scrollLeft']();
            var thisScroll = $area['scrollTop']();


            var horizontalScroll = function(element) {
                thisScrollX = $(element)['scrollLeft']();
                var newLeft = thisScrollX / scrollFactorX;
                $wrapper['addClass']('scrolling-horizontally');

                $scrollbarThumbHorizontal['css']({
                    left: newLeft
                });

                $scrollbarTrackPieceStartHorizontal['css']({
                    width: (newLeft + scrollThumbWidth / 2)
                });
                $scrollbarTrackPieceEndHorizontal['css']({
                    width: trackWidth - scrollThumbWidth / 2 - newLeft
                });
            };
            var verticalScroll = function(element) {
                thisScroll = $(element)['scrollTop']();
                var newTop = thisScroll / scrollFactorY;
                $wrapper['addClass']('scrolling-vertically');
                $scrollbarThumb['css']({
                    top: newTop
                });

                $scrollbarTrackPieceStart['css']({
                    height: (newTop + scrollThumbHeight / 2)
                });
                $scrollbarTrackPieceEnd['css']({
                    height: trackHeight - scrollThumbHeight / 2 - newTop
                });

            };
            $area['on']('scroll', function(e) {
                var currentThisScrollX = $area['scrollLeft']();
                var currentThisScroll = $area['scrollTop']();

                if (currentThisScroll != thisScroll) verticalScroll(this);
                if (currentThisScrollX != thisScrollX) horizontalScroll(this);


                if (!scrolling) {
                    defaults['scrollstarted'](this, $wrapper);
                }
                var $this = $(this);
                clearTimeout(scrollEnded);
                scrollEnded = setTimeout(function() {
                    scrollHasEnded(e, $wrapper)
                }, 200);
                $wrapper['addClass']('scrolling');
                scrolling = true;
            });

            horizontalScroll($area);
            verticalScroll($area);
            horizontalScroll($area);

            $scrollbarThumb['css']({
                height: scrollThumbHeight
            });
            $scrollbarThumbHorizontal['css']({
                width: scrollThumbWidth
            });

            defaults['created'](this, $wrapper);
            $wrapper['removeClass'](scrollClasses);
            $scrollbarThumb['on']('mousedown', function(e) {
                var $target = $(e.target);
                var thisOffset = $scrollbar['position']()['top'];
                var trackOffset = parseInt(($target['position']()['top']), 10);
                var correctOffset = e.pageY - thisOffset - trackOffset;
                defaults['thumbclick'](this, $wrapper);
                // prevent the cursor from changing to text-input
                e.preventDefault();
                // calculate the correct offset
                clickY = thisOffset + correctOffset;
                $dragging = $target;
                $wrapper['addClass']('clicked clicked-vertically');

            });
            $scrollbarThumbHorizontal['on']('mousedown', function(e) {
                var $target = $(e.target);
                var thisOffset = $scrollbarHorizontal['position']()['left'];
                var trackOffset = parseInt(($target['position']()['left']), 10);
                var correctOffset = e.pageX - thisOffset - trackOffset;
                defaults['thumbclick'](this, $wrapper);
                // prevent the cursor from changing to text-input
                e.preventDefault();
                // calculate the correct offset
                clickX = thisOffset + correctOffset;
                $dragging = $target;
                $wrapper['addClass']('clicked clicked-horizontally');

            });
            $('body')['on']('mousemove', function(e) {

                if ($dragging) {
                    if ($dragging['closest']('.scrollbar')['hasClass']('horizontal')) {
                        deltaX = e.pageX - clickX;
                        $area['scrollLeft'](deltaX * scaleFactorX)
                    }
                    if ($dragging['closest']('.scrollbar')['hasClass']('vertical')) {
                        deltaY = e.pageY - clickY;
                        $area['scrollTop'](deltaY * scaleFactorY)
                    }

                }
            })['on']('mouseup mouseleave blur', function() {
                clearInterval(scrollTriggerFunction);
                $dragging = null;
                $wrapper['removeClass'](clickClasses);

            })

        },
        'destroy': function() {
            var $rest = $(this)['closest']('.customScrollBar');
            $rest['find']('.scroll-area')['off']('scroll')
            $(this)['removeClass']('original-content')['insertAfter']($rest);
            $rest['remove']();
            defaults['destroyed'](this, $rest);

        }

    };

    $['fn']['customScrollBar'] = function(method) {
        var args = arguments;
        return this['each'](function() {

            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(args));
            } else if (typeof method === 'object' || !method) {
                return methods['init'].apply(this, Array.prototype.slice.call(args, 0));
            } else {
                $.error('Method ' + method + ' does not exist');
            }
        });
    };



})(jQuery, window);
