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

var Query = function Query(bp, nextBp) {
  return {
    is: bp && nextBp ? mediaQueries.between(bp, nextBp) : mediaQueries.atLeast(bp),
    atLeast: mediaQueries.atLeast(bp),
    atMost: mediaQueries.atMost(nextBp || 9999)
  };
};

var Breakjs = function Breakjs(bpEntries) {
  var bps = [];
  for (var key in bpEntries) {
    bps.push({ name: key, value: bpEntries[key] });
  }

  var breakpoints = bps.map(function (bp, index) {
    var breakpoint = { name: bp.name };

    // only query
    if (bps.length === 1) {
      breakpoint.query = Query(0, null);
    }

    // last query
    else if (index === bps.length - 1) {
      breakpoint.query = Query(bp.value, null);
    }

    // query inbetween
    else {
      breakpoint.query = Query(bp.value, bps[index + 1].value);
    }

    return breakpoint;
  });

  function getBreakpoint(breakpointName) {
    var find = breakpoints.find(function (bp) {
      return bp.name.toLowerCase() === breakpointName.toLowerCase();
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