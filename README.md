# customScrollBar

This plugin aims to create a lightweight custom scrollbar.

## Oh no!!! Another scrollbar plugin?

"Why did you...?" *is what you're thinking?*

Let me explain:

I've seen quite a few plugins that try to replicate the scrolling and
the scrollbars, yet I haven't found one that is really lightweight,
offers triggers (up-down-arrows) and does NOT use the
"mousewheel"-plugin.

Most implementations do not translate the native scrolling but rather
use the mousewheel events.

In my opinion this is a bad thing so I created this simple plugin
that simply "hides" the original scrollbar and adds a second one to
replace it. This way the scrollable div will still scroll natively but
pass some actions to the new scrollbar.

Interactions on the scrollbar itself will be translated to the
scrollable div.

The scrollbar itself only listens to the scroll event.

## Options
* theme: any theme name (string)
* events:
    * created
    * scrollstarted
    * scrollended
    * thumbclick
    * destroyed
    * ==>
        * call functions when event occurs
        * access event or ui

## Methods
* destroy
* init

## Events
* create
* scrollstart
* scrollend
* destroy

### You can listen to these events:

    $('.my-selector').on('create', function(){
        // element has been created
    });
    $('.my-selector').on('srollend', function(){
        // scrolling has stopped
    });


### Usage:
    $('.my-selector').customScrollBar();

    $('.my-selector').customScrollBar('destroy');

    $('.my-selector').customScrollBar({
      theme: 'my-custom-theme',
    created: function(e, ui){
            // ...do something
        },
      scrollstarted: function(e, ui){
            // ...do something
        },
        scrollended: function(e, ui){
            // ...do something
        },
        thumbclicked: function(e, ui){
            // ...do something
        }
  });


## Examples:

http://pixelass.github.io/customScrollBar/

## Alpha
### Version 2

This is the 2nd version please look vor the v1.x branch if you are looking for the old version.
This version has a lot cleaner code and can be minified with the goolge-closure-compiler with ADVANCED_OPTIMIZATIONS.

### The elements used for the scrollbars are copied from the '-webkit-' scrollbars
**(this allows us to do some very detailed styling):**

* scrollbar
* scrollbar-button
* scrollbar-track
* scrollbar-track-piece
* scrollbar-thumb

## What to expect

* Vertical scrollbar
* Horizontal scrollbar
* multiple instances on one page
* interactive scrollbar
* full control of the styling via CSS
* events for created, scrollstart, scrollend, thumbclick, destroyed
* optional arrows (click-triggers)
* destroy method

## ToDo

* add more methods and events
* write a documetation
* allow nested scrollbars
