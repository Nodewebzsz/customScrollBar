# customScrollBar

This plugin aims to create a lightweight custom scrollbar.

### Oh no!!! Another scrollbar plugin?

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

#### Options

* theme: any theme name (string)
* events:
    * init
    * scrollstarted
    * scrollended
    * thumbclick
    * ==>
        * call functions when event occurs
        * access event or ui
* arrows: boolean (show or hide the clickable arrows)

#### Methods
* "destroy"


#### Usage
		$('.my-selector').customScrollBar();
        $('.my-selector').customScrollBar('destroy');

		$('.my-selector').customScrollBar({
			 theme: 'my custom theme',
			 init: function(e, ui){
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
                           },
			 arrows: false
		 });


#### Examples:

http://pixelass.github.io/customScrollBar/

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
* events for init, scrollstart, scrollend, thumbclick
* optional arrows (click-triggers)

#### ToDo

* Allow horizontal scrollbars
* add methods
* add more events
* refactor for cleaner code
* write a documetation
* export themes to separate stylesheets
