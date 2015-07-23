# BreakJS

> Responsive breakpoints in Javascript made simple. Designed for React.

Ever confused when writing media queries for multiple breakpoints and trying
to render different layouts for different screen sizes? You'll probably end
up with with complex, nested SASS/LESS/Stylus classes for each element. At
some point you'll realise that achieving the desired outcome is not possible
with the DOM you are rendering, and you need to add complexity via hidden
elements. Eventually, it is better to control your layout purely with
Javascript and use CSS just for styling. If you happen to use React.js or
similar, BreakJS will work very well. [See example with React](#ReactExample).

## Install

```shell
npm install breakjs --save
```
or
```shell
bower install breakjs -S
```

## Usage

__1. Include BreakJS__

Node:
```js
var Breakjs = require('breakjs');
```
or browser:
```html
<script src="path/to/break.bundle.min.js"></script>
```
__2. Construct your BreakJS layout object as follows:__
```js
var layout = Breakjs({
  // choose any breakpoints you want
  mobile: 0,
  phablet: 550,
  tablet: 768,
  desktop: 1200
});
```
__3. Use the BreakJS methods to examine the layout and add event listeners:__
```js
// window width: 600px
layout.is('mobile'); // false
layout.is('phablet'); // true
layout.atLeast('mobile'); // true
layout.atMost('phablet'); // true
layout.atLeast('tablet'); // false

layout.addChangeListener(function(layout) {
  console.log(layout); // prints current breakpoint name when layout is changed
});
```

## How does it work?

BreakJS makes it a breeze to control your layout with Javascript. It provides
you a declarative way to define breakpoints and is simply an abstraction on
top of the `matchMedia` browser API.

Under the hood, BreakJS constructs media queries according to the given
breakpoints. In the usage example above, window width from zero to 549px
equates mobile layout, 550px to 767px equates phablet layout, and so on.
The highest given breakpoint will have an upper limit of 9999 pixels.

Note that if your first breakpoint is not zero, the layout methods might
not work intuitively.


## Browser Compatibility

Out of the box, BreakJS supports Chrome 9+, Firefox 6+, IE 10+, Opera 12.1+ and
Safari 5.1+.

With [matchMedia polyfill](https://github.com/paulirish/matchMedia.js/) BreakJS
will work on almost any browser, including IE 6 and newer.


## API

#### `current()`

Returns the breakpoint name that matches the current layout.

#### `is(<String> breakpoint)`

Check if the current layout matches the given breakpoint.

#### `atLeast(<String> breakpoint)`

Check if the current layout matches the given breakpoint or any wider
breakpoint.

#### `atMost(<String> breakpoint)`

Check if the current layout matches the given breakpoint or any narrower
breakpoint.

#### `addChangeListener(<Function> callback)`

Executes the callback function when a change in the layout is detected.

#### `removeChangeListener(<Function> callback)`

Removes the change listener.

<a name="ReactExample"></a>
## Example with React

Intended use with React:
```
var layout = Breakjs({
  mobile: 0,
  phablet: 550,
  tablet: 768,
  desktop: 992
});

var myApp = React.createClass({
  getInitialState: function() {
    return {layout: layout.current()};
  },
  componentWillMount: function() {
    layout.addChangeListener(this.onLayoutChange);
  },
  componentWillUnmount: function() {
    layout.removeChangeListener(this.onLayoutChange);
  },
  onLayoutChange: function(layout) {
    this.setState({layout: layout});
  },
  render: function() {
    if (this.state.layout === 'mobile') {
      return (<MobileApp />);
    } else if (this.state.layout === 'phablet') {
      return (<PhabletApp />);
    } else if (this.state.layout === 'tablet') {
      return (<TabletApp />);
    } else {
      return (<DesktopApp />);
    }
  }
});
```

## Why is BreakJS needed?

If you build modern single page applications, you will most likely want to
display different layouts for mobile, tablet and desktop devices.
Conventionally, responsiveness has been accomplished by CSS media queries.
Media queries, however, do not allow you to change the layout, i.e., the order
of the DOM elements. Sometimes this is fine, but if you make kick-ass
applications, you probably want to create completely different layouts for
mobile and desktop.

## License

MIT
