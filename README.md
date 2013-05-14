# customScrollBar

This plugin aims to create a lightweight custom scrollbar.

### Oh no!!! Another scrollbar plugin?

"How can you...?" *is what you're thinking?*

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

#### Options

* theme: // any theme name
* events: scrollEnded and/or clicked (return as array)
* arrows: boolean (show or hide the clickable arrows)


#### Usage
    $('.my-selector').customScrollBar();

    $('.my-selector').customScrollBar({
       theme: 'lion-scroll-bar',
       events: ['scrollEnded', 'clicked'],
       arrows: false
     });

#### Alpha

This was developed for one perticular purpose but also solves some
issues I had in past projects.

There are probably some issues and bugs and I'll be happy to fix them
if you find any


#### What can you expect

* Vertical scrollbar
* multiple instances on one page
* interactive scrollbar
* full control of the styling via CSS
* optional events on scrollEnded or clicked
* optional arrows (click-triggers)

#### ToDo

* Allow horizontal scrollbars
* Fix scrollBarOffset if the factor is greater than 6 (or so)
* add some options
* get more ideas
* refactor for cleaner code
* write a documetation and provide more examples
