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
    * created
    * scrollstarted
    * scrollended
    * thumbclick
    * destroyed
    * ==>
        * call functions when event occurs
        * access event or ui

#### Methods
* "destroy"
* "init"


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
##### Version 2

This is the 2nd version please look vor the v1.x branch if you are looking for the old version


#### What can you expect

* Vertical scrollbar
* multiple instances on one page
* interactive scrollbar
* full control of the styling via CSS
* events for init, scrollstart, scrollend, thumbclick
* optional arrows (click-triggers)
* destroy method

#### ToDo

* Allow horizontal scrollbars
* add methods
* add more events
* refactor for cleaner code
* write a documetation
* export themes to separate stylesheets
