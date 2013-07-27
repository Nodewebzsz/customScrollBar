(function($, window) { // start closure

    'use strict';
    var defaults = {
        theme: 'lion',
        'arrows': true,
        'init': function(e, ui) {
            // initialized scrollbar
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
    var scrollbar = '<div class="scrollbar ' + defaults.theme + '">';

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
    var scrollWrapper = '<div class="scroll-wrapper customScrollBar"><div class="scroll-area"/></div>';

    var $dragging = null;
    var clickY = 0;
    var factor = 1;

    var methods = {
        'init': function(options) {
            if (options) {
                $['extend'](defaults, options);
            }
            var $this = $(this);
            $(this)['wrap'](scrollWrapper);

            $(this)['closest']('.customScrollBar')['append'](scrollbar);
            var $wrapper = $this.closest('.scroll-wrapper');
            var $area = $this.closest('.scroll-area');
            var wrapperHeight = $wrapper['height']();
            var thisHeight = ($this['outerHeight']() + parseInt(($this['css']('margin-top')), 10) + parseInt(($this['css']('margin-bottom')), 10));
            factor = (thisHeight - 50) / wrapperHeight;
            console.log($this['css']('margin-top'), factor)

            var $scrollbar = $wrapper['find']('.scrollbar');
            var $scrollbarTrack = $scrollbar['find']('.scrollbar-track');
            var $scrollbarThumb = $scrollbar['find']('.scrollbar-thumb');
            $area['on']('scroll', function() {
                var thisScroll = $(this)['scrollTop']();
                $scrollbarThumb['css']({
                    top: thisScroll / factor
                });
            });


        },
        'destroy': function() {
            var $rest = this['closest']('customScrollBar');
            this['insertAfter']($rest);
            $rest['remove']();
        }

    };

    $['fn']['customScrollBar'] = function(method) {
        var args = arguments;
        var $this = this;
        return this['each'](function() {

            if (methods[method]) {
                return methods[method].apply($this, Array.prototype.slice.call(args));
            } else if (typeof method === 'object' || !method) {
                return methods['init'].apply($this, Array.prototype.slice.call(args, 0));
            } else {
                $.error('Method ' + method + ' does not exist');
            }
        });
    };

    $(function() {
        $('.scrollme').customScrollBar();
    });

})(jQuery, window);
