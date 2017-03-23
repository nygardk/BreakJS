function find(array, cb) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (cb(array[i])) {
      return array[i];
    }
  }
}

const mediaQueries = {
  between(val1, val2) {
    return window.matchMedia(`screen and (min-width: ${val1}px) and ` +
                             `(max-width: ${val2 - 1}px)`);
  },
  atLeast(val) {
    return window.matchMedia(`screen and (min-width: ${val}px)`);
  },
  atMost(val) {
    return window.matchMedia(`screen and (max-width: ${val - 1}px)`);
  }
};

const query = function(bp, nextBp) {
  return {
    is: typeof nextBp === 'number'
          ? mediaQueries.between(bp, nextBp)
          : mediaQueries.atLeast(bp),
    lessThan: mediaQueries.atMost(bp),
    atLeast: mediaQueries.atLeast(bp),
    atMost: mediaQueries.atMost(nextBp || Number.MAX_VALUE)
  };
};

const Breakjs = function(bpEntries) {
  if (!bpEntries) {
    throw new Error('No breakpoints were defined!');
  }

  const bps = [];
  for (const key in bpEntries) {
    const entry = {name: key, value: bpEntries[key]};

    if (find(bps, bp => bp.value === entry.value)) {
      throw new Error('Breakpoint values must be unique.');
    }

    bps.push(entry);
  }

  const breakpoints = bps
    .sort((a, b) => { return a.value > b.value; })
    .map((bp, index) => {
      if (typeof bp.name !== 'string') {
        throw new Error('Invalid breakpoint name -- should be a string.');
      }

      if (typeof bp.value !== 'number' || bp.value < 0) {
        throw new Error(`Invalid breakpoint value for ${bp.name}: ${bp.value}`);
      }

      const breakpoint = {name: bp.name};

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
    const findObj = find(breakpoints, bp => bp.name === breakpointName);

    if (!findObj) {
      throw new Error('invalid breakpoint name');
    }

    return findObj;
  }

  const changeListeners = [];

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
     * Check if the current window size is at least the given size
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

    /**
     * Check if the current window size is less than the given size
     * @param  {String} size
     * @return {Boolean}
     */
    lessThan(name) {
      return getBreakpoint(name).query.lessThan.matches;
    },

    current() {
      const findObj = find(breakpoints, bp => bp.query.is.matches);

      if (findObj) {
        return findObj.name;
      }
    },

    addChangeListener(listener) {
      breakpoints.forEach(bp => {
        const changeListener = () => {
          var current = this.current();
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

    removeChangeListener(listener) {
      breakpoints.forEach(bp => {
        const findObj = find(changeListeners, cl => cl.original === listener);

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

export default Breakjs;
