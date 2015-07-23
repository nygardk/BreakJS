'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _arrayFind = require('array-find');

var _arrayFind2 = _interopRequireDefault(_arrayFind);

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
  if (!bpEntries) {
    throw new Error('No breakpoints were defined!');
  }

  var bps = [];

  var _loop = function (key) {
    var entry = { name: key, value: bpEntries[key] };

    if ((0, _arrayFind2['default'])(bps, function (bp) {
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
    var findObj = (0, _arrayFind2['default'])(breakpoints, function (bp) {
      return bp.name === breakpointName;
    });

    if (!findObj) {
      throw new Error('invalid breakpoint name');
    }

    return findObj;
  }

  var changeListeners = [];

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
      var findObj = (0, _arrayFind2['default'])(breakpoints, function (bp) {
        return bp.query.is.matches;
      });

      if (findObj) {
        return findObj.name;
      }
    },

    addChangeListener: function addChangeListener(listener) {
      var _this = this;

      breakpoints.forEach(function (bp) {
        var changeListener = function changeListener() {
          var current = _this.current();
          if (current === bp.name) {
            listener(current);
          }
        };

        changeListeners.push({
          original: listener,
          created: changeListener
        });

        bp.query.is.addListener(changeListener);
      });
    },

    removeChangeListener: function removeChangeListener(listener) {
      breakpoints.forEach(function (bp) {
        var findObj = (0, _arrayFind2['default'])(changeListeners, function (cl) {
          return cl.original === listener;
        });

        if (findObj) {
          bp.query.is.removeListener(findObj.created);
          changeListeners.splice(changeListeners.indexOf(findObj), 1);
        }
      });
    }
  };
};

if (typeof window !== 'undefined') {
  window.Breakjs = Breakjs;
}

exports['default'] = Breakjs;
module.exports = exports['default'];