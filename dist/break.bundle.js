(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Array.prototype.find - MIT License (c) 2013 Paul Miller <http://paulmillr.com>
// For all details and docs: https://github.com/paulmillr/array.prototype.find
// Fixes and tests supplied by Duncan Hall <http://duncanhall.net> 
(function(globals){
  if (Array.prototype.find) return;

  var find = function(predicate) {
    var list = Object(this);
    var length = list.length < 0 ? 0 : list.length >>> 0; // ES.ToUint32;
    if (length === 0) return undefined;
    if (typeof predicate !== 'function' || Object.prototype.toString.call(predicate) !== '[object Function]') {
      throw new TypeError('Array#find: predicate must be a function');
    }
    var thisArg = arguments[1];
    for (var i = 0, value; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) return value;
    }
    return undefined;
  };

  if (Object.defineProperty) {
    try {
      Object.defineProperty(Array.prototype, 'find', {
        value: find, configurable: true, enumerable: false, writable: true
      });
    } catch(e) {}
  }

  if (!Array.prototype.find) {
    Array.prototype.find = find;
  }
})(this);

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

require('array.prototype.find');

var mediaQueries = {
  between: function between(val1, val2) {
    return window.matchMedia('(min-width: ' + val1 + 'px) and\n                              (max-width: ' + (val2 - 1) + 'px)');
  },
  atLeast: function atLeast(val) {
    return window.matchMedia('(min-width: ' + val + 'px)');
  },
  atMost: function atMost(val) {
    return window.matchMedia('(max-width: ' + (val - 1) + 'px)');
  }
};

var query = function query(bp, nextBp) {
  return {
    is: typeof nextBp === 'number' ? mediaQueries.between(bp, nextBp) : mediaQueries.atLeast(bp),
    atLeast: mediaQueries.atLeast(bp),
    atMost: mediaQueries.atMost(nextBp || 9999)
  };
};

var Breakjs = function Breakjs(bpEntries) {
  var bps = [];

  var _loop = function (key) {
    var entry = { name: key, value: bpEntries[key] };

    if (bps.find(function (bp) {
      return bp.value === entry.value;
    })) {
      throw new Error('Breakpoint values must be unique.');
    }

    bps.push(entry);
  };

  for (var key in bpEntries) {
    _loop(key);
  }

  var breakpoints = bps.sort(function (a, b) {
    return a.value > b.value;
  }).map(function (bp, index) {
    if (typeof bp.name !== 'string') {
      throw new Error('Invalid breakpoint name -- should be a string.');
    }

    if (typeof bp.value !== 'number' || bp.value < 0 || bp.value >= 9999) {
      throw new Error('Invalid breakpoint value for ' + bp.name + ': ' + bp.value);
    }

    var breakpoint = { name: bp.name };

    // only query
    if (bps.length === 1) {
      breakpoint.query = query(0, null);
    }

    // last query
    else if (index === bps.length - 1) {
      breakpoint.query = query(bp.value, null);
    }

    // query inbetween
    else {
      breakpoint.query = query(bp.value, bps[index + 1].value);
    }

    return breakpoint;
  });

  function getBreakpoint(breakpointName) {
    var find = breakpoints.find(function (bp) {
      return bp.name === breakpointName;
    });

    if (!find) {
      throw new Error('invalid breakpoint name');
    }

    return find;
  }

  return {
    breakpoints: bps,

    /**
     * Check if the current window size is the given size
     * @param  {String} size
     * @return {Boolean}
     */
    is: function is(name) {
      return getBreakpoint(name).query.is.matches;
    },

    /**
     * Check if the current window size at least the given size
     * @param  {String} size
     * @return {Boolean}
     */
    atLeast: function atLeast(name) {
      return getBreakpoint(name).query.atLeast.matches;
    },

    /**
     * Check if the current window size at most the given size
     * @param  {String} size
     * @return {Boolean}
     */
    atMost: function atMost(name) {
      return getBreakpoint(name).query.atMost.matches;
    },

    current: function current() {
      return breakpoints.find(function (bp) {
        return bp.query.is.matches;
      });
    },

    addEventListener: function addEventListener(listener) {
      breakpoints.forEach(function (bp) {
        bp.query.is.addListener(function () {
          listener(bp.name);
        });
        bp.query.atLeast.addListener(function () {
          listener(bp.name);
        });
        bp.query.atMost.addListener(function () {
          listener(bp.name);
        });
      });
    }
  };
};

if (typeof window !== 'undefined') {
  window.Breakjs = Breakjs;
}

exports['default'] = Breakjs;
module.exports = exports['default'];

},{"array.prototype.find":1}]},{},[2]);
