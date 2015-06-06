(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.srcsetParser = factory();
  }
}(this, function () {


  /**
   * Parser function
   */
  function _parse (str) {
    var parsedSources = new Array();
    var unitSimbols = {
      w: 'width',
      h: 'height',
      x: 'density'
    };
    var sources = str.split(',');
    for (var i = 0; i < sources.length; i++) {
      sources[i] = sources[i].trim().split(' ');
      var current = {
        url: sources[i][0],
      };
      // if the source hs a postFix
      if (sources[i].length == 2) {
        try {
          current.postFix = {
            str: sources[i][1],
            value: parseInt(sources[i][1]),
            unitSimbol: sources[i][1].replace(parseInt(sources[i][1]), '')
          };
          // adding the name of unit of undefined if it's not an standard unit
          current.postFix.unitName = unitSimbols[current.postFix.unitSimbol];
        } catch (e) {
          throw new Error('Invalid srcset parser descriptor');
        }
      }
      parsedSources.push(current);
    };
    return parsedSources;
  }

  /**
   * setter function
   */
  function _set (element, sourceList) {
    element.setAttribute('srcset', _getStrFromList(sourceList));
  }

  function _getStrFromList (sourceList) {
    // return the value if it's string
    if (typeof sourceList == 'string') {
      return sourceList;
    }
    // intergrating attrs
    var postFix = '';
    var srcsrtAttr = '';
    for (var i = 0; i < sourceList.length; i++) {
      if (sourceList[i].postFix != undefined) {
        try {
          // setting postFix.str as unit or it isn't present setting postFix.value + postFix.unitSimbol
          if (sourceList[i].postFix.str != undefined && sourceList[i].postFix.str.length != '') {
            postFix = sourceList[i].postFix.str;
          } else if (sourceList[i].postFix.value != undefined && sourceList[i].postFix.unitSimbol != undefined) {
            postFix = sourceList[i].postFix.value.toString() + sourceList[i].postFix.unitSimbol;
          }
        } catch (e) {
            throw new Error('Invalid srcset parser arguments');
        }
      }
      srcsrtAttr += [sourceList[i].url, postFix].join(' ');
      if (i < sourceList.length - 1) {
        srcsrtAttr += ', ';
      }
    };

    return srcsrtAttr;
  }
  /**
   * To display an error
   */
  function _error (msg) {
    throw new Error(msg);
  };

  function srcsetParser () {
  }

  srcsetParser.prototype = {
    parse: function (sourceList) {
      return _parse.call(this, sourceList);
    },
    set: function (element, sourceList) {
      _set.call(this, element, sourceList);
    },
    getStrFromList: function (str) {
      return _getStrFromList.call(this, str)
    }
  }

  return srcsetParser;
}))