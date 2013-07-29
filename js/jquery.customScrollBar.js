;
(function($, window) { // start closure


    'use strict'; // use strict mode
    var defaults = {
        'theme': 'custom-scroll-bar',
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
    // get the width of the scrollbars
    var scrollbarWidth = function() {
        var parent;
        var child;
        var width;
        if (width === undefined) {
            parent = $('<div style="width:50px;height:50px;overflow:auto;position:absolute;top:-100px;left:-100px"><div/></div>')['appendTo']('body');
            child = parent['children']();
            width = child['innerWidth']() - child['height'](99)['innerWidth']();
            parent['remove']();
        }
        return width;
    };
    //define some methods

    var methods = {
        'init': function(options) {
            if (options) { // extend the defaults with the options
                $['extend'](defaults, options);
            }
            var $this = $(this);
            if ($this['hasClass']('customScrollBar_processed')) {
                return false;
            }
            $this['addClass']('original-content'); // add a class to the element


            // class collections
            var scrollClasses = "scrolling scrolling-horizontally scrolling-vertically";
            var clickClasses = "clicked clicked-horizontally clicked-vertically";


            // markup
            var scrollbarHelpers = '<div class="scrollbar-corner"/>';
            scrollbarHelpers += '<div class="scrollbar-resizer"/>';
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
                return scrollbar;
            };
            var scrollWrapper = '<div class="scroll-wrapper customScrollBar ' + defaults['theme'] + '"/>';
            var scrollArea = '<div class="scroll-area"/>';

            // prepare the content
            $this['wrap'](scrollWrapper);
            $this['wrap'](scrollArea);

            // cache the elements
            var $wrapper = $this['closest']('.scroll-wrapper');
            var $area = $this['closest']('.scroll-area');


            // compare the dimensions
            // this will tell us if we need a scrollbar
            var thisHeight = $this['outerHeight'](true);
            var thisWidth = $this['outerWidth'](true);
            var wrapperHeight = $wrapper['height']();
            var wrapperWidth = $wrapper['width']();
            $area['css']({
                'height': wrapperHeight
            });
            // append scrollbars
            if (thisHeight > wrapperHeight) {
                $wrapper['append'](newScrollbar("vertical"));
                $wrapper['addClass']('scrollbar-vertical');
                $area['css']({
                    'paddingRight': scrollbarWidth()
                });
            }
            if (thisWidth > wrapperWidth) {
                $wrapper['append'](newScrollbar("horizontal"));
                $wrapper['addClass']('scrollbar-horizontal');
                $area['css']({
                    'paddingBottom': scrollbarWidth()
                });
            }
            // if both scrollbars are appended we will also add the helper elements
            if (thisWidth > wrapperWidth && thisHeight > wrapperHeight) {
                $wrapper['append'](scrollbarHelpers);
            }

            // refresh our content values
            thisHeight = $this['outerHeight'](true);
            thisWidth = $this['outerWidth'](true);

            // variables for mouse tracking
            var clickY = 0;
            var clickX = 0;
            var $dragging = null;
            var scrollTriggerFunction;
            var deltaY;
            var deltaX;

            // variables for the scrolling
            var scrolling;
            var scrollEnded;
            var scrollHasEnded = function(e, el) {
                $(el)['removeClass'](scrollClasses);
                $this['trigger']('scrollend');
                defaults['scrollended'](e, el);
                scrolling = false;
            };
            // create one function to handle triggered scrolling
            var doScroll = function(e, el, direction) {
                // set the basics (vertical scrolling)
                var factor = scaleFactorY;
                var modifier = '-=';
                var intervalDur = 1;
                if (direction === 'bottom' || direction === 'right') {
                    modifier = '+='; // modifier needs to be changed for right or bottom
                }
                var options = {
                    'scrollTop': modifier + factor + 'px'
                };
                if (direction === 'left' || direction === 'right') {
                    factor = scaleFactorX; // get the correct factor for horizontal
                    options = {
                        'scrollLeft': modifier + factor + 'px'
                    }; // change the option
                }
                intervalDur = (factor >= 2 ? factor / 2 : intervalDur) // get some nice interval but never below 1
                scrollTriggerFunction = setInterval(function() {
                    // perform the scrolling action relative to the content
                    // (bigger factor = faster scroll)
                    $(el)['stop'](true, true)['animate'](options, factor);
                }, intervalDur);

            };

            var $scrollbar = $wrapper['find']('.scrollbar.vertical');
            var $scrollbarTrack = $scrollbar['find']('.scrollbar-track');
            var trackHeight = $scrollbarTrack['outerHeight']();
            var $scrollbarTrackPieceStart = $scrollbarTrack['find']('.scrollbar-track-piece.start');
            var $scrollbarTrackPieceEnd = $scrollbarTrack['find']('.scrollbar-track-piece.end');
            var $scrollbarThumb = $scrollbar['find']('.scrollbar-thumb');
            var scaleFactorY = thisHeight / wrapperHeight;
            var scrollThumbHeight = trackHeight / scaleFactorY;
            scrollThumbHeight = (scrollThumbHeight < 20 ? 20 : scrollThumbHeight);
            var scrollFactorY = wrapperHeight / scrollThumbHeight;

            var $scrollbarHorizontal = $wrapper['find']('.scrollbar.horizontal');
            var $scrollbarTrackHorizontal = $scrollbarHorizontal['find']('.scrollbar-track');
            var trackWidth = $scrollbarTrackHorizontal['outerWidth']();
            var $scrollbarTrackPieceStartHorizontal = $scrollbarTrackHorizontal['find']('.scrollbar-track-piece.start');
            var $scrollbarTrackPieceEndHorizontal = $scrollbarTrackHorizontal['find']('.scrollbar-track-piece.end');
            var $scrollbarThumbHorizontal = $scrollbarHorizontal['find']('.scrollbar-thumb');
            var scaleFactorX = thisWidth / wrapperWidth;
            var scrollThumbWidth = trackWidth / scaleFactorX;
            scrollThumbWidth = (scrollThumbWidth < 20 ? 20 : scrollThumbWidth);
            var scrollFactorX = wrapperWidth / scrollThumbWidth;

            // find the triggers
            var $scrollTriggerBottom = $scrollbar['find']('.scrollbar-button.increment');
            var $scrollTriggerTop = $scrollbar['find']('.scrollbar-button.decrement');
            var $scrollTriggerRight = $scrollbarHorizontal['find']('.scrollbar-button.increment');
            var $scrollTriggerLeft = $scrollbarHorizontal['find']('.scrollbar-button.decrement');
            var $scrollTrackPiece = $scrollbarTrack['find']('.scrollbar-track-piece');
            var $scrollTrackPieceHorizontal = $scrollbarTrackHorizontal['find']('.scrollbar-track-piece');


            var thisScrollX = $area['scrollLeft']();
            var thisScroll = $area['scrollTop']();

            var setThumbSize = function(axis) {
                var $thumb = $scrollbarThumb;
                var height = scrollThumbHeight;
                var width = '';
                if (axis === 'horizontal') {
                    $thumb = $scrollbarThumbHorizontal;
                    height = '';
                    width = scrollThumbWidth;
                }
                var options = {
                    'height': height,
                    'width': width
                }
                $thumb['css'](options);
            };
            var horizontalScroll = function(element) {
                thisScrollX = $(element)['scrollLeft']();
                var newLeft = thisScrollX / scrollFactorX;
                $wrapper['addClass']('scrolling-horizontally');
                $scrollbarThumbHorizontal['css']({
                    'left': newLeft
                });
                $scrollbarTrackPieceStartHorizontal['css']({
                    'width': (newLeft + scrollThumbWidth / 2)
                });
                $scrollbarTrackPieceEndHorizontal['css']({
                    'width': trackWidth - scrollThumbWidth / 2 - newLeft
                });
            };
            var verticalScroll = function(element) {
                thisScroll = $(element)['scrollTop']();
                var newTop = thisScroll / scrollFactorY;
                $wrapper['addClass']('scrolling-vertically');
                $scrollbarThumb['css']({
                    'top': newTop
                });

                $scrollbarTrackPieceStart['css']({
                    'height': (newTop + scrollThumbHeight / 2)
                });
                $scrollbarTrackPieceEnd['css']({
                    'height': trackHeight - scrollThumbHeight / 2 - newTop
                });

            };
            var scrollToPoint = function(e, axis) {
                var delta = e.pageY - $(e.target)['closest']('.scrollbar-track')['offset']()['top'];
                var factor = scaleFactorY
                var scrollPos = 'scrollTop';
                if (axis === "horizontal") {
                    delta = e.pageX - $(e.target)['closest']('.scrollbar-track')['offset']()['left'];
                    factor = scaleFactorX;
                    scrollPos = 'scrollLeft';
                }
                $area[scrollPos](delta * factor);
            };
            // perform actions on init()
            horizontalScroll($area);
            verticalScroll($area);
            setThumbSize('vertical');
            setThumbSize('horizontal');
            $wrapper['removeClass'](scrollClasses);
            // end actions on init()

            $area['on']('scroll', function(e) {
                var currentThisScrollX = $area['scrollLeft']();
                var currentThisScroll = $area['scrollTop']();

                if (currentThisScroll != thisScroll) {
                    verticalScroll(this);
                }
                if (currentThisScrollX != thisScrollX) {
                    horizontalScroll(this);
                }
                if (!scrolling) {
                    $this['trigger']('scrollstart');
                    defaults['scrollstarted'](this, $wrapper);
                }
                clearTimeout(scrollEnded);
                scrollEnded = setTimeout(function() {
                    scrollHasEnded(e, $wrapper)
                }, 200);
                $wrapper['addClass']('scrolling');
                scrolling = true;
            });



            $scrollbarThumb['on']('mousedown', function(e) {
                var $target = $(e.target);
                var trackOffset = $target['position']()['top'];
                // prevent the cursor from changing to text-input
                e.preventDefault();
                // calculate the correct offset
                clickY = e.pageY - trackOffset;
                if ($target['hasClass']('scrollbar-thumb')) {
                    $dragging = $target;
                }
                $wrapper['addClass']('clicked clicked-vertically');
                defaults['thumbclick'](this, $wrapper);
                $this['trigger']('thumbclick');

            });
            $scrollbarThumbHorizontal['on']('mousedown', function(e) {
                var $target = $(e.target);
                var trackOffset = $target['position']()['left'];
                // prevent the cursor from changing to text-input
                e.preventDefault();
                // calculate the correct offset
                clickX = e.pageX - trackOffset;
                if ($target['hasClass']('scrollbar-thumb')) {
                    $dragging = $target;
                }
                $wrapper['addClass']('clicked clicked-horizontally');
                defaults['thumbclick'](this, $wrapper);
                $this['trigger']('thumbclick');

            });
            $('body')['on']('mousemove', function(e) {

                if ($dragging) {
                    if ($dragging['closest']('.scrollbar')['hasClass']('horizontal')) {
                        deltaX = e.pageX - clickX;
                        $area['scrollLeft'](deltaX * scrollFactorX)
                    }
                    if ($dragging['closest']('.scrollbar')['hasClass']('vertical')) {
                        deltaY = e.pageY - clickY;
                        $area['scrollTop'](deltaY * scrollFactorY)
                    }
                }
            })['on']('mouseup mouseleave blur', function() {
                clearInterval(scrollTriggerFunction);
                $dragging = null;
                $wrapper['removeClass'](clickClasses);
            });
            $scrollTriggerBottom['on']('mousedown', function(e) {
                doScroll(e, $area, 'bottom');
            });
            $scrollTriggerTop['on']('mousedown', function(e) {
                doScroll(e, $area, 'top');
            });
            $scrollTriggerRight['on']('mousedown', function(e) {
                doScroll(e, $area, 'right');
            });
            $scrollTriggerLeft['on']('mousedown', function(e) {
                doScroll(e, $area, 'left');
            });
            $scrollTrackPiece['on']('mousedown', function(e) {
                scrollToPoint(e, 'vertical');
            });
            $scrollTrackPieceHorizontal['on']('mousedown', function(e) {
                scrollToPoint(e, 'horizontal');
            });
            defaults['created'](this, $wrapper);
            $this['trigger']('create');
            $this['addClass']('customScrollBar_processed');
        },
        'destroy': function() {
            var $this = $(this);
            if ($this['hasClass']('customScrollBar_processed')) {
                var $rest = $this['closest']('.customScrollBar');
                $rest['find']('.scroll-area')['off']('scroll');
                $this['removeClass']('original-content customScrollBar_processed')['insertAfter']($rest);
                $rest['remove']();
                defaults['destroyed'](this, $rest);
                $this['trigger']('destroy');
            } else {
                return false;
            }
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
