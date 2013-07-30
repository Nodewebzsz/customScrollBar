;
(function($, window, document) { // start closure


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

    var map = function(array, mapFunction) {
        var newArray = new Array(array.length);
        for (var i = 0; i < array.length; i++) {
            newArray[i] = mapFunction(array[i]);
        }

        return newArray;
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
            var $body = $(document.body);
            var $node = $(this);


            if ($node['hasClass']('customScrollBar_processed')) {
                return false;
            }
            $node['addClass']('original-content'); // add a class to the element

            // define variables
            var $dragging = null;
            var scrollTriggerFunction;
            var scrolling;
            var scrollEnded;

            // class collections
            var scrollClasses = "scrolling scrolling-horizontally scrolling-vertically";
            var clickClasses = "clicked clicked-horizontally clicked-vertically";


            // markup
            var scrollbarHelpers = '<div class="scrollbar-corner"/>';
            scrollbarHelpers += '<div class="scrollbar-resizer"/>';
            var newScrollbar = function(axis) {
                var scrollbar = '<div class="scrollbar ';
                scrollbar += axis;
                scrollbar += '"><div class="scrollbar-button start increment"/><div class="scrollbar-button start decrement"/><div class="scrollbar-track"><div class="scrollbar-track-piece start"/><div class="scrollbar-thumb"/><div class="scrollbar-track-piece end"/></div><div class="scrollbar-button end increment"/><div class="scrollbar-button end decrement"/></div>';
                return scrollbar;
            };
            // the wrapper
            var scrollWrapper = '<div class="scroll-wrapper customScrollBar ' + defaults['theme'] + '"><div class="scroll-area"/></div>';

            // prepare the content
            $node['wrap'](scrollWrapper);

            // get the elements
            var $wrapper = $node['closest']('.scroll-wrapper');
            var $area = $node['closest']('.scroll-area');

            // get the dimensions
            var nodeDimensions = {
                h: $node['outerHeight'](),
                w: $node['outerWidth']()
            };
            var wrapperDimensions = {
                h: $wrapper['height'](),
                w: $wrapper['width']()
            };
            var areaScroll = {
                x: $area['scrollLeft'](),
                y: $area['scrollTop']()
            };

            // gather all our info in one object
            var data = {
                x: {
                    wrapperSize: wrapperDimensions.w,
                    contentSize: nodeDimensions.w,
                    scrollDir: 'horizontal',
                    getScroll: function() {
                        var scrollPos = $area['scrollLeft']();
                        return scrollPos;
                    },
                    scrollOpts: function(v) {
                        var opts = {
                            'scrollLeft': v
                        };
                        return opts
                    }
                },
                y: {
                    wrapperSize: wrapperDimensions.h,
                    contentSize: nodeDimensions.h,
                    scrollDir: 'vertical',
                    getScroll: function() {
                        var scrollPos = $area['scrollTop']();
                        return scrollPos;
                    },
                    scrollOpts: function(v) {
                        var opts = {
                            'scrollTop': v
                        };
                        return opts;
                    }
                }
            };

            // create scrollbars when necessary
            $([data.x, data.y])['map'](function(index, value) {
                if (value.contentSize > value.wrapperSize) {
                    $wrapper['append'](newScrollbar(value.scrollDir));
                    $wrapper['addClass']('scrollbar-' + value.scrollDir);
                    var opts = {
                        'paddingBottom': scrollbarWidth()
                    }
                    if (index === 0) {
                        opts = {
                            'paddingRight': scrollbarWidth()
                        }
                    }
                    $area['css'](opts);
                }
            });
            // and add the helpers if both scrollbars are appended
            if (data.x.contentSize > data.x.wrapperSize && data.y.contentSize > data.y.wrapperSize) {
                $wrapper['append'](scrollbarHelpers);
            }
            // extend our data
            $([data.x, data.y])['map'](function(index, value) {
                // set the values for each direction
                value.clickPos = 0;
                value.delta = 0;
                value.scrollbar = $wrapper['find']('.scrollbar.' + value.scrollDir);
                value.scrollbarTrack = value.scrollbar['find']('.scrollbar-track');
                value.trackSize = (index === 0 ? value.scrollbarTrack['outerWidth']() : value.scrollbarTrack['outerHeight']())
                value.scrollTrackPiece = value.scrollbarTrack['find']('.scrollbar-track-piece');
                value.scrollbarTrackPieceStart = value.scrollTrackPiece['filter']('.start');
                value.scrollbarTrackPieceEnd = value.scrollTrackPiece['filter']('.end');
                value.scrollbarThumb = value.scrollbarTrack['find']('.scrollbar-thumb');
                value.scaleFactor = value.contentSize / value.wrapperSize;
                value.scrollThumbSize = value.trackSize / value.scaleFactor;
                value.scrollThumbSize = (value.scrollThumbSize < 20 ? 20 : value.scrollThumbSize);
                value.scrollFactor = value.wrapperSize / value.scrollThumbSize;
                value.scrollTrigger = value.scrollbar['find']('.scrollbar-button');
                value.scrollTriggerInc = value.scrollTrigger['filter']('.increment');
                value.scrollTriggerDec = value.scrollTrigger['filter']('.decrement');
                // scrolling per triggers (buttons)
                value.triggerScroll = function(dir) {
                    // set the basics (vertical scrolling)
                    var intervalDur = 1;
                    var modifier = '-=';
                    modifier = (dir === 'inc' ? '+=' : modifier);
                    // get some nice interval but never below 1
                    intervalDur = (value.scaleFactor >= 2 ? value.scaleFactor / 2 : intervalDur);
                    var opts = value.scrollOpts(modifier + value.scaleFactor + 'px')
                    scrollTriggerFunction = setInterval(function() {
                        // perform the scrolling action relative to the content
                        // (bigger factor = faster scroll)
                        $area['stop'](true, true)['animate'](opts, value.scaleFactor);
                    }, intervalDur);
                };
                // call this value when a scroll is performed (we are using a flag to throttle these calls)
                value.performScroll = function() {
                    var newPos = value.getScroll() / value.scrollFactor;
                    var newPieceStart = (newPos + value.scrollThumbSize / 2);
                    var newPieceEnd = value.trackSize - value.scrollThumbSize / 2 - newPos;
                    $wrapper['addClass']('scrolling-' + value.scrollDir + 'ly');
                    var thumbOpts = {
                        'top': newPos
                    }
                    var pieceStartOpts = {
                        'height': newPieceStart
                    }
                    var pieceEndOpts = {
                        'height': newPieceEnd
                    }
                    if (index === 0) {
                        thumbOpts = {
                            'left': newPos
                        }
                        pieceStartOpts = {
                            'width': newPieceStart
                        }
                        pieceEndOpts = {
                            'width': newPieceEnd
                        }
                    }
                    value.scrollbarThumb['css'](thumbOpts);
                    value.scrollbarTrackPieceStart['css'](pieceStartOpts);
                    value.scrollbarTrackPieceEnd['css'](pieceEndOpts);
                }
                // set the correct dimension for our thumb
                var setThumbDimensions = function() {
                    var height = value.scrollThumbSize;
                    var width = '';
                    if (index === 0) {
                        height = '';
                        width = value.scrollThumbSize;
                    }
                    var dimensions = {
                        'height': height,
                        'width': width
                    }
                    value.scrollbarThumb['css'](dimensions);
                };
                setThumbDimensions();
                // trigger scroll by dragging the thumb
                value.scrollbarThumb['on']('mousedown', function(e) {
                    if (e.which != 1 || e.button != 0) {
                        return false;
                    }
                    var $target = $(e.target);
                    var trackOffset = $target['position']()['top'];
                    if (index === 0) {
                        trackOffset = $target['position']()['left'];
                    }
                    var pageP = e.pageY;
                    pageP = (index === 0 ? e.pageX : pageP)
                    // prevent the cursor from changing to text-input
                    e.preventDefault();
                    // calculate the correct offset
                    value.clickPos = pageP - trackOffset;
                    if ($target['hasClass']('scrollbar-thumb')) {
                        $dragging = $target;
                    }
                    $wrapper['addClass']('clicked clicked-' + value.scrollDir + 'ly');
                    defaults['thumbclick'](this, $wrapper);
                    $node['trigger']('thumbclick');

                });
                // trigger scroll by clicking  the buttons
                value.scrollTriggerInc['on']('mousedown', function(e) {
                    if (e.which != 1 || e.button != 0) {
                        return false;
                    }
                    value.triggerScroll('inc');
                });
                value.scrollTriggerDec['on']('mousedown', function(e) {
                    if (e.which != 1 || e.button != 0) {
                        return false;
                    }
                    value.triggerScroll('dec');
                });
                // trigger scroll by clicking the track-pieces
                value.scrollTrackPiece['on']('mousedown', function(e) {
                    if (e.which != 1 || e.button != 0) {
                        return false;
                    }
                    var delta = e.pageY - value.scrollbarTrack['offset']()['top'];
                    if (index === 0) {
                        delta = e.pageX - value.scrollbarTrack['offset']()['left'];
                        $area['scrollLeft'](delta * value.scaleFactor);

                    } else {
                        $area['scrollTop'](delta * value.scaleFactor);
                    }
                });

            });

            // call when the scoll has ended (throttled by a flag)
            var scrollHasEnded = function(e, el) {
                $(el)['removeClass'](scrollClasses);
                $node['trigger']('scrollend');
                defaults['scrollended'](e, el);
                scrolling = false;
            };

            // define the actions when the area is being scrolled
            $area['on']('scroll', function(e) {
                var currentAreaScroll = {
                    x: $area['scrollLeft'](),
                    y: $area['scrollTop']()
                }
                // scrolling vertically?
                if (currentAreaScroll.y != areaScroll.y) {
                    data.y.performScroll();
                }
                // scrolling horizontally?
                if (currentAreaScroll.x != areaScroll.x) {
                    data.x.performScroll();
                }
                // if we this is the first scrollevent we can send the scrollstart events
                // will only get called once until the next scrollend
                if (!scrolling) {
                    $node['trigger']('scrollstart');
                    defaults['scrollstarted'](this, $wrapper);
                }
                // we are currently scrolling
                scrolling = true;
                $wrapper['addClass']('scrolling');
                // we don't want to end our scroll yet
                clearTimeout(scrollEnded);
                // but it will end if we don't scroll for 200ms
                scrollEnded = setTimeout(function() {
                    scrollHasEnded(e, $wrapper)
                }, 200);

            });

            // events on the body (will perform as long as flags are active)
            $body['on']('mousemove', function(e) {
                if ($dragging) {
                    if ($dragging['closest']('.scrollbar')['hasClass']('horizontal')) {
                        data.x.delta = e.pageX - data.x.clickPos;
                        $area['scrollLeft'](data.x.delta * data.x.scrollFactor)
                    }
                    if ($dragging['closest']('.scrollbar')['hasClass']('vertical')) {
                        data.y.delta = e.pageY - data.y.clickPos;
                        $area['scrollTop'](data.y.delta * data.y.scrollFactor)
                    }
                }
            })['on']('mouseup mouseleave blur', function() {
                clearInterval(scrollTriggerFunction);
                $dragging = null;
                $wrapper['removeClass'](clickClasses);
            });


            // prepare our element for interaction
            $area['css']({
                'height': wrapperDimensions.h
            });
            data.y.performScroll();
            data.x.performScroll();
            $wrapper['removeClass'](scrollClasses);
            defaults['created'](this, $wrapper);
            $node['trigger']('create');
            $node['addClass']('customScrollBar_processed');
        },
        'destroy': function() {
            var $node = $(this);
            if ($node['hasClass']('customScrollBar_processed')) {
                var $rest = $node['closest']('.customScrollBar');
                $rest['find']('.scroll-area')['off']('scroll');
                $node['removeClass']('original-content customScrollBar_processed')['insertAfter']($rest);
                $rest['remove']();
                defaults['destroyed'](this, $rest);
                $node['trigger']('destroy');
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
})(jQuery, window, document);
