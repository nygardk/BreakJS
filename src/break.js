import 'array.prototype.find';


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

let Query = function(bp, nextBp) {
  return {
    is: bp && nextBp
          ? mediaQueries.between(bp, nextBp)
          : mediaQueries.atLeast(bp),
    atLeast: mediaQueries.atLeast(bp),
    atMost: mediaQueries.atMost(nextBp || 9999)
  };
};

let Breakjs = function(bpEntries) {
  let bps = [];
  for (let key in bpEntries) {
    bps.push({name: key, value: bpEntries[key]});
  }

  let breakpoints = bps.map((bp, index) => {
    let breakpoint = {name: bp.name};

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
    let find = breakpoints.find(
      bp => bp.name.toLowerCase() === breakpointName.toLowerCase()
    );

    if (!find) {
      throw new Error('invalid breakpoint name');
    }

    return find;
  }

  return {
    breakpoints: bpEntries,

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
      return breakpoints.find(bp => bp.query.is.matches);
    },

    addEventListener(listener) {
      breakpoints.forEach((bp) => {
        bp.query.is.addListener(() => { listener(bp.name); });
        bp.query.atLeast.addListener(() => { listener(bp.name); });
        bp.query.atMost.addListener(() => { listener(bp.name); });
      });
    }
  };
};

if (typeof window !== 'undefined') {
  window.Breakjs = Breakjs;
}

export default Breakjs;
