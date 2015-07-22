# BreakJS

> Responsive breakpoints for Javascript


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
var BreakJS = require('breakjs');
```
Browser:
```html
<script src="path/to/break.bundle.min.js"></script>
```
__2. Construct your BreakJS layout object as follows:__
```js
var layout = BreakJS({
  // choose any breakpoints you want
  mobile: 0,
  phablet: 768,
  tablet: 992,
  desktop: 1200
});
```
__3. Use the BreakJS methods to examine the layout:__
```js
// window width: 800px
layout.is('mobile'); // false
layout.is('phablet'); // true
layout.atLeast('mobile'); // true
layout.atMost('phablet'); // true
layout.atLeast('tablet'); // false
```

## How does it work?

BreakJS makes it a breeze to control your layout with Javascript. It provides
you a declarative way to define breakpoints and is simply an abstraction on
top of the `matchMedia` browser API.

Under the hood, BreakJS constructs media queries according to the given
breakpoints. In the usage example above, window width from zero to 767px
equates to mobile layout, 768px to 991px equates phablet layout, and so on.
The last given breakpoint will have an upper limit of 9999 pixels.

Note that if your first breakpoint is not zero, the layout methods might
not work intuitively.


## Browser Compatibility

Out of the box, BreakJS supports Chrome 9+, Firefox 6+, IE 10+, Opera 12.1+ and
Safari 5.1+.

With [matchMedia polyfill](https://github.com/paulirish/matchMedia.js/) BreakJS
will work on almost any browser, including IE 6 and newer.


## API

#### `is(breakpoint)`

#### `atLeast(breakpoint)`

#### `atMost(breakpoint)`


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
