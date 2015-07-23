import find from 'array-find';


let mediaQueries = {
  between(val1, val2) {
    return window.matchMedia(`(min-width: ${val1}px) and
                              (max-width: ${val2 - 1}px)`);
  },
  atLeast(val) {
    return window.matchMedia(`(min-width: ${val}px)`);
  },
  atMost(val) {
    return window.matchMedia(`(max-width: ${val - 1}px)`);
  }
};

let query = function(bp, nextBp) {
  return {
    is: typeof nextBp === 'number'
          ? mediaQueries.between(bp, nextBp)
          : mediaQueries.atLeast(bp),
    atLeast: mediaQueries.atLeast(bp),
    atMost: mediaQueries.atMost(nextBp || 9999)
  };
};

let Breakjs = function(bpEntries) {
  let bps = [];
  for (let key in bpEntries) {
    let entry = {name: key, value: bpEntries[key]};

    if (find(bps, bp => bp.value === entry.value)) {
      throw new Error('Breakpoint values must be unique.');
    }

    bps.push(entry);
  }

  let breakpoints = bps
    .sort((a, b) => { return a.value > b.value; })
    .map((bp, index) => {
      if (typeof bp.name !== 'string') {
        throw new Error('Invalid breakpoint name -- should be a string.');
      }

      if (typeof bp.value !== 'number' || bp.value < 0 || bp.value >= 9999) {
        throw new Error(`Invalid breakpoint value for ${bp.name}: ${bp.value}`);
      }

      let breakpoint = {name: bp.name};

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
    let findObj = find(breakpoints, bp => bp.name === breakpointName);

    if (!findObj) {
      throw new Error('invalid breakpoint name');
    }

    return findObj;
  }

  return {
    breakpoints: bps,

    /**
     * Check if the current window size is the given size
     * @param  {String} size
     * @return {Boolean}
     */
    is(name) {
      return getBreakpoint(name).query.is.matches;
    },

    /**
     * Check if the current window size at least the given size
     * @param  {String} size
     * @return {Boolean}
     */
    atLeast(name) {
      return getBreakpoint(name).query.atLeast.matches;
    },

    /**
     * Check if the current window size at most the given size
     * @param  {String} size
     * @return {Boolean}
     */
    atMost(name) {
      return getBreakpoint(name).query.atMost.matches;
    },

    current() {
      return find(breakpoints, bp => bp.query.is.matches);
    },

    addChangeListener(listener) {
      breakpoints.forEach((bp) => {
        bp.query.is.addListener(() => { listener(bp.name); });
      });
    },

    removeChangeListener(listener) {
      breakpoints.forEach((bp) => {
        bp.query.is.removeListener(() => { listener(bp.name); });
      });
    }
  };
};

if (typeof window !== 'undefined') {
  window.Breakjs = Breakjs;
}

export default Breakjs;
