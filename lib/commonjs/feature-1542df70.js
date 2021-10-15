define(['exports', 'http', 'https', 'url', 'stream', 'assert', 'zlib'], (function (exports, require$$1, require$$2, require$$0, require$$3, require$$4, require$$8) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
    var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
    var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
    var require$$3__default = /*#__PURE__*/_interopDefaultLegacy(require$$3);
    var require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);
    var require$$8__default = /*#__PURE__*/_interopDefaultLegacy(require$$8);

    const config = {
        BASE_URL: 'https://api.mapbox.com',
        TELEMETRY_URL: 'https://events.mapbox.com',
        SOURCE_URL: 'mapbox://mapbox-ads.bq09b9qc',
        LAYER_SOURCE_ID: 'promoted-pins-8s73mu',
        ACCESS_TOKEN: '',
        MOBILE_MAX_WIDTH: 768,
        DEBUG: false,
    };

    class Event {
        type;
        data;
        constructor(type, data = {}) {
            this.type = type;
            this.data = data;
        }
    }

    var axios$2 = {exports: {}};

    var bind$2 = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    var bind$1 = bind$2;

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return toString.call(val) === '[object Array]';
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer(val) {
      return toString.call(val) === '[object ArrayBuffer]';
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(val) {
      return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }

    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (toString.call(val) !== '[object Object]') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate(val) {
      return toString.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
      return toString.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
      return toString.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind$1(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    var utils$e = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM
    };

    var utils$d = utils$e;

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL$3 = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils$d.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils$d.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils$d.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils$d.forEach(val, function parseValue(v) {
            if (utils$d.isDate(v)) {
              v = v.toISOString();
            } else if (utils$d.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    var utils$c = utils$e;

    function InterceptorManager$1() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager$1.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager$1.prototype.forEach = function forEach(fn) {
      utils$c.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager$1;

    var utils$b = utils$e;

    var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
      utils$b.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    var enhanceError$3 = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }

      error.request = request;
      error.response = response;
      error.isAxiosError = true;

      error.toJSON = function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      };
      return error;
    };

    var enhanceError$2 = enhanceError$3;

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    var createError$3 = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError$2(error, config, code, request, response);
    };

    var createError$2 = createError$3;

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle$2 = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError$2(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };

    var utils$a = utils$e;

    var cookies$1 = (
      utils$a.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils$a.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils$a.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils$a.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL$1 = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    var isAbsoluteURL = isAbsoluteURL$1;
    var combineURLs = combineURLs$1;

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath$2 = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    var utils$9 = utils$e;

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders$1 = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils$9.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils$9.trim(line.substr(0, i)).toLowerCase();
        val = utils$9.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var utils$8 = utils$e;

    var isURLSameOrigin$1 = (
      utils$8.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils$8.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function Cancel$4(message) {
      this.message = message;
    }

    Cancel$4.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel$4.prototype.__CANCEL__ = true;

    var Cancel_1 = Cancel$4;

    var utils$7 = utils$e;
    var settle$1 = settle$2;
    var cookies = cookies$1;
    var buildURL$2 = buildURL$3;
    var buildFullPath$1 = buildFullPath$2;
    var parseHeaders = parseHeaders$1;
    var isURLSameOrigin = isURLSameOrigin$1;
    var createError$1 = createError$3;
    var defaults$5 = defaults_1;
    var Cancel$3 = Cancel_1;

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils$7.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath$1(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL$2(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle$1(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(createError$1('Request aborted', config, 'ECONNABORTED', request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(createError$1('Network Error', config, null, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          var transitional = config.transitional || defaults$5.transitional;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError$1(
            timeoutErrorMessage,
            config,
            transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils$7.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils$7.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils$7.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || (cancel && cancel.type) ? new Cancel$3('canceled') : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        if (!requestData) {
          requestData = null;
        }

        // Send the request
        request.send(requestData);
      });
    };

    var followRedirects = {exports: {}};

    var debug$1;

    var debug_1 = function () {
      if (!debug$1) {
        try {
          /* eslint global-require: off */
          debug$1 = require("debug")("follow-redirects");
        }
        catch (error) { /* */ }
        if (typeof debug$1 !== "function") {
          debug$1 = function () { /* */ };
        }
      }
      debug$1.apply(null, arguments);
    };

    var url$1 = require$$0__default["default"];
    var URL = url$1.URL;
    var http$1 = require$$1__default["default"];
    var https$1 = require$$2__default["default"];
    var Writable = require$$3__default["default"].Writable;
    var assert = require$$4__default["default"];
    var debug = debug_1;

    // Create handlers that pass events from native requests
    var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
    var eventHandlers = Object.create(null);
    events.forEach(function (event) {
      eventHandlers[event] = function (arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
      };
    });

    // Error types with codes
    var RedirectionError = createErrorType(
      "ERR_FR_REDIRECTION_FAILURE",
      ""
    );
    var TooManyRedirectsError = createErrorType(
      "ERR_FR_TOO_MANY_REDIRECTS",
      "Maximum number of redirects exceeded"
    );
    var MaxBodyLengthExceededError = createErrorType(
      "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
      "Request body larger than maxBodyLength limit"
    );
    var WriteAfterEndError = createErrorType(
      "ERR_STREAM_WRITE_AFTER_END",
      "write after end"
    );

    // An HTTP(S) request that can be redirected
    function RedirectableRequest(options, responseCallback) {
      // Initialize the request
      Writable.call(this);
      this._sanitizeOptions(options);
      this._options = options;
      this._ended = false;
      this._ending = false;
      this._redirectCount = 0;
      this._redirects = [];
      this._requestBodyLength = 0;
      this._requestBodyBuffers = [];

      // Attach a callback if passed
      if (responseCallback) {
        this.on("response", responseCallback);
      }

      // React to responses of native requests
      var self = this;
      this._onNativeResponse = function (response) {
        self._processResponse(response);
      };

      // Perform the first request
      this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);

    RedirectableRequest.prototype.abort = function () {
      abortRequest(this._currentRequest);
      this.emit("abort");
    };

    // Writes buffered data to the current native request
    RedirectableRequest.prototype.write = function (data, encoding, callback) {
      // Writing is not allowed if end has been called
      if (this._ending) {
        throw new WriteAfterEndError();
      }

      // Validate input and shift parameters if necessary
      if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
      }
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = null;
      }

      // Ignore empty buffers, since writing them doesn't invoke the callback
      // https://github.com/nodejs/node/issues/22066
      if (data.length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      // Only write when we don't exceed the maximum body length
      if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({ data: data, encoding: encoding });
        this._currentRequest.write(data, encoding, callback);
      }
      // Error when we exceed the maximum body length
      else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
      }
    };

    // Ends the current native request
    RedirectableRequest.prototype.end = function (data, encoding, callback) {
      // Shift parameters if necessary
      if (typeof data === "function") {
        callback = data;
        data = encoding = null;
      }
      else if (typeof encoding === "function") {
        callback = encoding;
        encoding = null;
      }

      // Write data if needed and end
      if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
      }
      else {
        var self = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function () {
          self._ended = true;
          currentRequest.end(null, null, callback);
        });
        this._ending = true;
      }
    };

    // Sets a header value on the current native request
    RedirectableRequest.prototype.setHeader = function (name, value) {
      this._options.headers[name] = value;
      this._currentRequest.setHeader(name, value);
    };

    // Clears a header value on the current native request
    RedirectableRequest.prototype.removeHeader = function (name) {
      delete this._options.headers[name];
      this._currentRequest.removeHeader(name);
    };

    // Global timeout for all underlying requests
    RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
      var self = this;

      // Destroys the socket on timeout
      function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
      }

      // Sets up a timer to trigger a timeout event
      function startTimer(socket) {
        if (self._timeout) {
          clearTimeout(self._timeout);
        }
        self._timeout = setTimeout(function () {
          self.emit("timeout");
          clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
      }

      // Stops a timeout from triggering
      function clearTimer() {
        if (self._timeout) {
          clearTimeout(self._timeout);
          self._timeout = null;
        }
        if (callback) {
          self.removeListener("timeout", callback);
        }
        if (!self.socket) {
          self._currentRequest.removeListener("socket", startTimer);
        }
      }

      // Attach callback if passed
      if (callback) {
        this.on("timeout", callback);
      }

      // Start the timer if or when the socket is opened
      if (this.socket) {
        startTimer(this.socket);
      }
      else {
        this._currentRequest.once("socket", startTimer);
      }

      // Clean up on events
      this.on("socket", destroyOnTimeout);
      this.once("response", clearTimer);
      this.once("error", clearTimer);

      return this;
    };

    // Proxy all other public ClientRequest methods
    [
      "flushHeaders", "getHeader",
      "setNoDelay", "setSocketKeepAlive",
    ].forEach(function (method) {
      RedirectableRequest.prototype[method] = function (a, b) {
        return this._currentRequest[method](a, b);
      };
    });

    // Proxy all public ClientRequest properties
    ["aborted", "connection", "socket"].forEach(function (property) {
      Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function () { return this._currentRequest[property]; },
      });
    });

    RedirectableRequest.prototype._sanitizeOptions = function (options) {
      // Ensure headers are always present
      if (!options.headers) {
        options.headers = {};
      }

      // Since http.request treats host as an alias of hostname,
      // but the url module interprets host as hostname plus port,
      // eliminate the host property to avoid confusion.
      if (options.host) {
        // Use hostname if set, because it has precedence
        if (!options.hostname) {
          options.hostname = options.host;
        }
        delete options.host;
      }

      // Complete the URL object when necessary
      if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
          options.pathname = options.path;
        }
        else {
          options.pathname = options.path.substring(0, searchPos);
          options.search = options.path.substring(searchPos);
        }
      }
    };


    // Executes the next native request (initial or redirect)
    RedirectableRequest.prototype._performRequest = function () {
      // Load the native protocol
      var protocol = this._options.protocol;
      var nativeProtocol = this._options.nativeProtocols[protocol];
      if (!nativeProtocol) {
        this.emit("error", new TypeError("Unsupported protocol " + protocol));
        return;
      }

      // If specified, use the agent corresponding to the protocol
      // (HTTP and HTTPS use different types of agents)
      if (this._options.agents) {
        var scheme = protocol.substr(0, protocol.length - 1);
        this._options.agent = this._options.agents[scheme];
      }

      // Create the native request
      var request = this._currentRequest =
            nativeProtocol.request(this._options, this._onNativeResponse);
      this._currentUrl = url$1.format(this._options);

      // Set up event handlers
      request._redirectable = this;
      for (var e = 0; e < events.length; e++) {
        request.on(events[e], eventHandlers[events[e]]);
      }

      // End a redirected request
      // (The first request must be ended explicitly with RedirectableRequest#end)
      if (this._isRedirect) {
        // Write the request entity and end.
        var i = 0;
        var self = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
          // Only write if this request has not been redirected yet
          /* istanbul ignore else */
          if (request === self._currentRequest) {
            // Report any write errors
            /* istanbul ignore if */
            if (error) {
              self.emit("error", error);
            }
            // Write the next buffer if there are still left
            else if (i < buffers.length) {
              var buffer = buffers[i++];
              /* istanbul ignore else */
              if (!request.finished) {
                request.write(buffer.data, buffer.encoding, writeNext);
              }
            }
            // End the request if `end` has been called on us
            else if (self._ended) {
              request.end();
            }
          }
        }());
      }
    };

    // Processes a response from the current native request
    RedirectableRequest.prototype._processResponse = function (response) {
      // Store the redirected response
      var statusCode = response.statusCode;
      if (this._options.trackRedirects) {
        this._redirects.push({
          url: this._currentUrl,
          headers: response.headers,
          statusCode: statusCode,
        });
      }

      // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
      // that further action needs to be taken by the user agent in order to
      // fulfill the request. If a Location header field is provided,
      // the user agent MAY automatically redirect its request to the URI
      // referenced by the Location field value,
      // even if the specific status code is not understood.
      var location = response.headers.location;
      if (location && this._options.followRedirects !== false &&
          statusCode >= 300 && statusCode < 400) {
        // Abort the current request
        abortRequest(this._currentRequest);
        // Discard the remainder of the response to avoid waiting for data
        response.destroy();

        // RFC7231§6.4: A client SHOULD detect and intervene
        // in cyclical redirections (i.e., "infinite" redirection loops).
        if (++this._redirectCount > this._options.maxRedirects) {
          this.emit("error", new TooManyRedirectsError());
          return;
        }

        // RFC7231§6.4: Automatic redirection needs to done with
        // care for methods not known to be safe, […]
        // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
        // the request method from POST to GET for the subsequent request.
        if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
            // RFC7231§6.4.4: The 303 (See Other) status code indicates that
            // the server is redirecting the user agent to a different resource […]
            // A user agent can perform a retrieval request targeting that URI
            // (a GET or HEAD request if using HTTP) […]
            (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
          this._options.method = "GET";
          // Drop a possible entity and headers related to it
          this._requestBodyBuffers = [];
          removeMatchingHeaders(/^content-/i, this._options.headers);
        }

        // Drop the Host header, as the redirect might lead to a different host
        var previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers) ||
          url$1.parse(this._currentUrl).hostname;

        // Create the redirected request
        var redirectUrl = url$1.resolve(this._currentUrl, location);
        debug("redirecting to", redirectUrl);
        this._isRedirect = true;
        var redirectUrlParts = url$1.parse(redirectUrl);
        Object.assign(this._options, redirectUrlParts);

        // Drop the Authorization header if redirecting to another host
        if (redirectUrlParts.hostname !== previousHostName) {
          removeMatchingHeaders(/^authorization$/i, this._options.headers);
        }

        // Evaluate the beforeRedirect callback
        if (typeof this._options.beforeRedirect === "function") {
          var responseDetails = { headers: response.headers };
          try {
            this._options.beforeRedirect.call(null, this._options, responseDetails);
          }
          catch (err) {
            this.emit("error", err);
            return;
          }
          this._sanitizeOptions(this._options);
        }

        // Perform the redirected request
        try {
          this._performRequest();
        }
        catch (cause) {
          var error = new RedirectionError("Redirected request failed: " + cause.message);
          error.cause = cause;
          this.emit("error", error);
        }
      }
      else {
        // The response is not a redirect; return it as-is
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);

        // Clean up
        this._requestBodyBuffers = [];
      }
    };

    // Wraps the key/value object of protocols with redirect functionality
    function wrap(protocols) {
      // Default settings
      var exports = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024,
      };

      // Wrap each protocol
      var nativeProtocols = {};
      Object.keys(protocols).forEach(function (scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

        // Executes a request, following redirects
        function request(input, options, callback) {
          // Parse parameters
          if (typeof input === "string") {
            var urlStr = input;
            try {
              input = urlToOptions(new URL(urlStr));
            }
            catch (err) {
              /* istanbul ignore next */
              input = url$1.parse(urlStr);
            }
          }
          else if (URL && (input instanceof URL)) {
            input = urlToOptions(input);
          }
          else {
            callback = options;
            options = input;
            input = { protocol: protocol };
          }
          if (typeof options === "function") {
            callback = options;
            options = null;
          }

          // Set defaults
          options = Object.assign({
            maxRedirects: exports.maxRedirects,
            maxBodyLength: exports.maxBodyLength,
          }, input, options);
          options.nativeProtocols = nativeProtocols;

          assert.equal(options.protocol, protocol, "protocol mismatch");
          debug("options", options);
          return new RedirectableRequest(options, callback);
        }

        // Executes a GET request, following redirects
        function get(input, options, callback) {
          var wrappedRequest = wrappedProtocol.request(input, options, callback);
          wrappedRequest.end();
          return wrappedRequest;
        }

        // Expose the properties on the wrapped protocol
        Object.defineProperties(wrappedProtocol, {
          request: { value: request, configurable: true, enumerable: true, writable: true },
          get: { value: get, configurable: true, enumerable: true, writable: true },
        });
      });
      return exports;
    }

    /* istanbul ignore next */
    function noop() { /* empty */ }

    // from https://github.com/nodejs/node/blob/master/lib/internal/url.js
    function urlToOptions(urlObject) {
      var options = {
        protocol: urlObject.protocol,
        hostname: urlObject.hostname.startsWith("[") ?
          /* istanbul ignore next */
          urlObject.hostname.slice(1, -1) :
          urlObject.hostname,
        hash: urlObject.hash,
        search: urlObject.search,
        pathname: urlObject.pathname,
        path: urlObject.pathname + urlObject.search,
        href: urlObject.href,
      };
      if (urlObject.port !== "") {
        options.port = Number(urlObject.port);
      }
      return options;
    }

    function removeMatchingHeaders(regex, headers) {
      var lastValue;
      for (var header in headers) {
        if (regex.test(header)) {
          lastValue = headers[header];
          delete headers[header];
        }
      }
      return lastValue;
    }

    function createErrorType(code, defaultMessage) {
      function CustomError(message) {
        Error.captureStackTrace(this, this.constructor);
        this.message = message || defaultMessage;
      }
      CustomError.prototype = new Error();
      CustomError.prototype.constructor = CustomError;
      CustomError.prototype.name = "Error [" + code + "]";
      CustomError.prototype.code = code;
      return CustomError;
    }

    function abortRequest(request) {
      for (var e = 0; e < events.length; e++) {
        request.removeListener(events[e], eventHandlers[events[e]]);
      }
      request.on("error", noop);
      request.abort();
    }

    // Exports
    followRedirects.exports = wrap({ http: http$1, https: https$1 });
    followRedirects.exports.wrap = wrap;

    var data = {
      "version": "0.23.0"
    };

    var utils$6 = utils$e;
    var settle = settle$2;
    var buildFullPath = buildFullPath$2;
    var buildURL$1 = buildURL$3;
    var http = require$$1__default["default"];
    var https = require$$2__default["default"];
    var httpFollow = followRedirects.exports.http;
    var httpsFollow = followRedirects.exports.https;
    var url = require$$0__default["default"];
    var zlib = require$$8__default["default"];
    var VERSION$1 = data.version;
    var createError = createError$3;
    var enhanceError$1 = enhanceError$3;
    var defaults$4 = defaults_1;
    var Cancel$2 = Cancel_1;

    var isHttps = /https:?/;

    /**
     *
     * @param {http.ClientRequestArgs} options
     * @param {AxiosProxyConfig} proxy
     * @param {string} location
     */
    function setProxy(options, proxy, location) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.port = proxy.port;
      options.path = location;

      // Basic proxy authorization
      if (proxy.auth) {
        var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }

      // If a proxy is used, any redirects must also pass through the proxy
      options.beforeRedirect = function beforeRedirect(redirection) {
        redirection.headers.host = redirection.host;
        setProxy(redirection, proxy, redirection.href);
      };
    }

    /*eslint consistent-return:0*/
    var http_1 = function httpAdapter(config) {
      return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }
        var resolve = function resolve(value) {
          done();
          resolvePromise(value);
        };
        var reject = function reject(value) {
          done();
          rejectPromise(value);
        };
        var data = config.data;
        var headers = config.headers;
        var headerNames = {};

        Object.keys(headers).forEach(function storeLowerName(name) {
          headerNames[name.toLowerCase()] = name;
        });

        // Set User-Agent (required by some servers)
        // See https://github.com/axios/axios/issues/69
        if ('user-agent' in headerNames) {
          // User-Agent is specified; handle case where no UA header is desired
          if (!headers[headerNames['user-agent']]) {
            delete headers[headerNames['user-agent']];
          }
          // Otherwise, use specified value
        } else {
          // Only set header if it hasn't been set in config
          headers['User-Agent'] = 'axios/' + VERSION$1;
        }

        if (data && !utils$6.isStream(data)) {
          if (Buffer.isBuffer(data)) ; else if (utils$6.isArrayBuffer(data)) {
            data = Buffer.from(new Uint8Array(data));
          } else if (utils$6.isString(data)) {
            data = Buffer.from(data, 'utf-8');
          } else {
            return reject(createError(
              'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
              config
            ));
          }

          // Add Content-Length header if data exists
          if (!headerNames['content-length']) {
            headers['Content-Length'] = data.length;
          }
        }

        // HTTP basic authentication
        var auth = undefined;
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password || '';
          auth = username + ':' + password;
        }

        // Parse url
        var fullPath = buildFullPath(config.baseURL, config.url);
        var parsed = url.parse(fullPath);
        var protocol = parsed.protocol || 'http:';

        if (!auth && parsed.auth) {
          var urlAuth = parsed.auth.split(':');
          var urlUsername = urlAuth[0] || '';
          var urlPassword = urlAuth[1] || '';
          auth = urlUsername + ':' + urlPassword;
        }

        if (auth && headerNames.authorization) {
          delete headers[headerNames.authorization];
        }

        var isHttpsRequest = isHttps.test(protocol);
        var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

        var options = {
          path: buildURL$1(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
          method: config.method.toUpperCase(),
          headers: headers,
          agent: agent,
          agents: { http: config.httpAgent, https: config.httpsAgent },
          auth: auth
        };

        if (config.socketPath) {
          options.socketPath = config.socketPath;
        } else {
          options.hostname = parsed.hostname;
          options.port = parsed.port;
        }

        var proxy = config.proxy;
        if (!proxy && proxy !== false) {
          var proxyEnv = protocol.slice(0, -1) + '_proxy';
          var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
          if (proxyUrl) {
            var parsedProxyUrl = url.parse(proxyUrl);
            var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
            var shouldProxy = true;

            if (noProxyEnv) {
              var noProxy = noProxyEnv.split(',').map(function trim(s) {
                return s.trim();
              });

              shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
                if (!proxyElement) {
                  return false;
                }
                if (proxyElement === '*') {
                  return true;
                }
                if (proxyElement[0] === '.' &&
                    parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
                  return true;
                }

                return parsed.hostname === proxyElement;
              });
            }

            if (shouldProxy) {
              proxy = {
                host: parsedProxyUrl.hostname,
                port: parsedProxyUrl.port,
                protocol: parsedProxyUrl.protocol
              };

              if (parsedProxyUrl.auth) {
                var proxyUrlAuth = parsedProxyUrl.auth.split(':');
                proxy.auth = {
                  username: proxyUrlAuth[0],
                  password: proxyUrlAuth[1]
                };
              }
            }
          }
        }

        if (proxy) {
          options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
          setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
        }

        var transport;
        var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
        if (config.transport) {
          transport = config.transport;
        } else if (config.maxRedirects === 0) {
          transport = isHttpsProxy ? https : http;
        } else {
          if (config.maxRedirects) {
            options.maxRedirects = config.maxRedirects;
          }
          transport = isHttpsProxy ? httpsFollow : httpFollow;
        }

        if (config.maxBodyLength > -1) {
          options.maxBodyLength = config.maxBodyLength;
        }

        if (config.insecureHTTPParser) {
          options.insecureHTTPParser = config.insecureHTTPParser;
        }

        // Create the request
        var req = transport.request(options, function handleResponse(res) {
          if (req.aborted) return;

          // uncompress the response body transparently if required
          var stream = res;

          // return the last request in case of redirects
          var lastRequest = res.req || req;


          // if no content, is HEAD request or decompress disabled we should not decompress
          if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
            switch (res.headers['content-encoding']) {
            /*eslint default-case:0*/
            case 'gzip':
            case 'compress':
            case 'deflate':
            // add the unzipper to the body stream processing pipeline
              stream = stream.pipe(zlib.createUnzip());

              // remove the content-encoding in order to not confuse downstream operations
              delete res.headers['content-encoding'];
              break;
            }
          }

          var response = {
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            config: config,
            request: lastRequest
          };

          if (config.responseType === 'stream') {
            response.data = stream;
            settle(resolve, reject, response);
          } else {
            var responseBuffer = [];
            var totalResponseBytes = 0;
            stream.on('data', function handleStreamData(chunk) {
              responseBuffer.push(chunk);
              totalResponseBytes += chunk.length;

              // make sure the content length is not over the maxContentLength if specified
              if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
                stream.destroy();
                reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
                  config, null, lastRequest));
              }
            });

            stream.on('error', function handleStreamError(err) {
              if (req.aborted) return;
              reject(enhanceError$1(err, config, null, lastRequest));
            });

            stream.on('end', function handleStreamEnd() {
              var responseData = Buffer.concat(responseBuffer);
              if (config.responseType !== 'arraybuffer') {
                responseData = responseData.toString(config.responseEncoding);
                if (!config.responseEncoding || config.responseEncoding === 'utf8') {
                  responseData = utils$6.stripBOM(responseData);
                }
              }

              response.data = responseData;
              settle(resolve, reject, response);
            });
          }
        });

        // Handle errors
        req.on('error', function handleRequestError(err) {
          if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
          reject(enhanceError$1(err, config, null, req));
        });

        // Handle request timeout
        if (config.timeout) {
          // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
          var timeout = parseInt(config.timeout, 10);

          if (isNaN(timeout)) {
            reject(createError(
              'error trying to parse `config.timeout` to int',
              config,
              'ERR_PARSE_TIMEOUT',
              req
            ));

            return;
          }

          // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
          // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
          // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
          // And then these socket which be hang up will devoring CPU little by little.
          // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
          req.setTimeout(timeout, function handleRequestTimeout() {
            req.abort();
            var transitional = config.transitional || defaults$4.transitional;
            reject(createError(
              'timeout of ' + timeout + 'ms exceeded',
              config,
              transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
              req
            ));
          });
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = function(cancel) {
            if (req.aborted) return;

            req.abort();
            reject(!cancel || (cancel && cancel.type) ? new Cancel$2('canceled') : cancel);
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }


        // Send the request
        if (utils$6.isStream(data)) {
          data.on('error', function handleStreamError(err) {
            reject(enhanceError$1(err, config, null, req));
          }).pipe(req);
        } else {
          req.end(data);
        }
      });
    };

    var utils$5 = utils$e;
    var normalizeHeaderName = normalizeHeaderName$1;
    var enhanceError = enhanceError$3;

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils$5.isUndefined(headers) && utils$5.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = http_1;
      }
      return adapter;
    }

    function stringifySafely(rawValue, parser, encoder) {
      if (utils$5.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils$5.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    var defaults$3 = {

      transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
      },

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils$5.isFormData(data) ||
          utils$5.isArrayBuffer(data) ||
          utils$5.isBuffer(data) ||
          utils$5.isStream(data) ||
          utils$5.isFile(data) ||
          utils$5.isBlob(data)
        ) {
          return data;
        }
        if (utils$5.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils$5.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils$5.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
          setContentTypeIfUnset(headers, 'application/json');
          return stringifySafely(data);
        }
        return data;
      }],

      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults$3.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || (forcedJSONParsing && utils$5.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw enhanceError(e, this, 'E_JSON_PARSE');
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils$5.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults$3.headers[method] = {};
    });

    utils$5.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults$3.headers[method] = utils$5.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults$3;

    var utils$4 = utils$e;
    var defaults$2 = defaults_1;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData$1 = function transformData(data, headers, fns) {
      var context = this || defaults$2;
      /*eslint no-param-reassign:0*/
      utils$4.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });

      return data;
    };

    var isCancel$1 = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    var utils$3 = utils$e;
    var transformData = transformData$1;
    var isCancel = isCancel$1;
    var defaults$1 = defaults_1;
    var Cancel$1 = Cancel_1;

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new Cancel$1('canceled');
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest$1 = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils$3.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils$3.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults$1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    var utils$2 = utils$e;

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig$2 = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      function getMergedValue(target, source) {
        if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
          return utils$2.merge(target, source);
        } else if (utils$2.isPlainObject(source)) {
          return utils$2.merge({}, source);
        } else if (utils$2.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(prop) {
        if (!utils$2.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils$2.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(prop) {
        if (!utils$2.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(prop) {
        if (!utils$2.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        } else if (!utils$2.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      var mergeMap = {
        'url': valueFromConfig2,
        'method': valueFromConfig2,
        'data': valueFromConfig2,
        'baseURL': defaultToConfig2,
        'transformRequest': defaultToConfig2,
        'transformResponse': defaultToConfig2,
        'paramsSerializer': defaultToConfig2,
        'timeout': defaultToConfig2,
        'timeoutMessage': defaultToConfig2,
        'withCredentials': defaultToConfig2,
        'adapter': defaultToConfig2,
        'responseType': defaultToConfig2,
        'xsrfCookieName': defaultToConfig2,
        'xsrfHeaderName': defaultToConfig2,
        'onUploadProgress': defaultToConfig2,
        'onDownloadProgress': defaultToConfig2,
        'decompress': defaultToConfig2,
        'maxContentLength': defaultToConfig2,
        'maxBodyLength': defaultToConfig2,
        'transport': defaultToConfig2,
        'httpAgent': defaultToConfig2,
        'httpsAgent': defaultToConfig2,
        'cancelToken': defaultToConfig2,
        'socketPath': defaultToConfig2,
        'responseEncoding': defaultToConfig2,
        'validateStatus': mergeDirectKeys
      };

      utils$2.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        (utils$2.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    };

    var VERSION = data.version;

    var validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    var deprecatedWarnings = {};

    /**
     * Transitional option validator
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return function(value, opt, opts) {
        if (validator === false) {
          throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new TypeError('option ' + opt + ' must be ' + result);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw Error('Unknown option ' + opt);
        }
      }
    }

    var validator$1 = {
      assertOptions: assertOptions,
      validators: validators$1
    };

    var utils$1 = utils$e;
    var buildURL = buildURL$3;
    var InterceptorManager = InterceptorManager_1;
    var dispatchRequest = dispatchRequest$1;
    var mergeConfig$1 = mergeConfig$2;
    var validator = validator$1;

    var validators = validator.validators;
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios$1(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios$1.prototype.request = function request(config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }

      config = mergeConfig$1(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      var transitional = config.transitional;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }

      // filter out skipped interceptors
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      var promise;

      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];

        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);

        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      }


      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }

      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }

      return promise;
    };

    Axios$1.prototype.getUri = function getUri(config) {
      config = mergeConfig$1(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };

    // Provide aliases for supported request methods
    utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios$1.prototype[method] = function(url, config) {
        return this.request(mergeConfig$1(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/
      Axios$1.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig$1(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });

    var Axios_1 = Axios$1;

    var Cancel = Cancel_1;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;

      // eslint-disable-next-line func-names
      this.promise.then(function(cancel) {
        if (!token._listeners) return;

        var i;
        var l = token._listeners.length;

        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = function(onfulfilled) {
        var _resolve;
        // eslint-disable-next-line func-names
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new Cancel(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Subscribe to the cancel signal
     */

    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };

    /**
     * Unsubscribe from the cancel signal
     */

    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return (typeof payload === 'object') && (payload.isAxiosError === true);
    };

    var utils = utils$e;
    var bind = bind$2;
    var Axios = Axios_1;
    var mergeConfig = mergeConfig$2;
    var defaults = defaults_1;

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios(defaultConfig);
      var instance = bind(Axios.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios;

    // Expose Cancel & CancelToken
    axios$1.Cancel = Cancel_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel$1;
    axios$1.VERSION = data.version;

    // Expose all/spread
    axios$1.all = function all(promises) {
      return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    axios$2.exports = axios$1;

    // Allow use of default import syntax in TypeScript
    axios$2.exports.default = axios$1;

    var axios = axios$2.exports;

    const axiosInstance = (options = {}) => {
        const { baseURL, isBlob } = options;
        return axios.create({
            baseURL: baseURL || config.BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 1000 * 30,
            responseType: isBlob ? 'blob' : 'json',
        });
    };

    function requiredArgs(required, args) {
      if (args.length < required) {
        throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
      }
    }

    /**
     * @name toDate
     * @category Common Helpers
     * @summary Convert the given argument to an instance of Date.
     *
     * @description
     * Convert the given argument to an instance of Date.
     *
     * If the argument is an instance of Date, the function returns its clone.
     *
     * If the argument is a number, it is treated as a timestamp.
     *
     * If the argument is none of the above, the function returns Invalid Date.
     *
     * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
     *
     * @param {Date|Number} argument - the value to convert
     * @returns {Date} the parsed date in the local time zone
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // Clone the date:
     * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
     * //=> Tue Feb 11 2014 11:30:30
     *
     * @example
     * // Convert the timestamp to date:
     * const result = toDate(1392098430000)
     * //=> Tue Feb 11 2014 11:30:30
     */

    function toDate(argument) {
      requiredArgs(1, arguments);
      var argStr = Object.prototype.toString.call(argument); // Clone the date

      if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
        // Prevent the date to lose the milliseconds when passed to new Date() in IE10
        return new Date(argument.getTime());
      } else if (typeof argument === 'number' || argStr === '[object Number]') {
        return new Date(argument);
      } else {
        if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
          // eslint-disable-next-line no-console
          console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"); // eslint-disable-next-line no-console

          console.warn(new Error().stack);
        }

        return new Date(NaN);
      }
    }

    /**
     * @name differenceInMilliseconds
     * @category Millisecond Helpers
     * @summary Get the number of milliseconds between the given dates.
     *
     * @description
     * Get the number of milliseconds between the given dates.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} dateLeft - the later date
     * @param {Date|Number} dateRight - the earlier date
     * @returns {Number} the number of milliseconds
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // How many milliseconds are between
     * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
     * const result = differenceInMilliseconds(
     *   new Date(2014, 6, 2, 12, 30, 21, 700),
     *   new Date(2014, 6, 2, 12, 30, 20, 600)
     * )
     * //=> 1100
     */

    function differenceInMilliseconds(dateLeft, dateRight) {
      requiredArgs(2, arguments);
      return toDate(dateLeft).getTime() - toDate(dateRight).getTime();
    }

    var roundingMap = {
      ceil: Math.ceil,
      round: Math.round,
      floor: Math.floor,
      trunc: function (value) {
        return value < 0 ? Math.ceil(value) : Math.floor(value);
      } // Math.trunc is not supported by IE

    };
    var defaultRoundingMethod = 'trunc';
    function getRoundingMethod(method) {
      return method ? roundingMap[method] : roundingMap[defaultRoundingMethod];
    }

    /**
     * @name differenceInSeconds
     * @category Second Helpers
     * @summary Get the number of seconds between the given dates.
     *
     * @description
     * Get the number of seconds between the given dates.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} dateLeft - the later date
     * @param {Date|Number} dateRight - the earlier date
     * @param {Object} [options] - an object with options.
     * @param {String} [options.roundingMethod='trunc'] - a rounding method (`ceil`, `floor`, `round` or `trunc`)
     * @returns {Number} the number of seconds
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // How many seconds are between
     * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
     * const result = differenceInSeconds(
     *   new Date(2014, 6, 2, 12, 30, 20, 0),
     *   new Date(2014, 6, 2, 12, 30, 7, 999)
     * )
     * //=> 12
     */

    function differenceInSeconds(dateLeft, dateRight, options) {
      requiredArgs(2, arguments);
      var diff = differenceInMilliseconds(dateLeft, dateRight) / 1000;
      return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
    }

    const randomString = (length = 8) => (Math.random().toString(length).substring(2));

    const ACTIONS = {
        CALL: 'Call',
        NAVIGATION: 'Navigation',
        DETAIL: 'Detail',
        BANNER: 'BannerDetail',
    };

    let lastSessionTime = new Date();
    let sessionIdentifier = randomString();
    const verifySession = async () => {
        if (!lastSessionTime || differenceInSeconds(new Date(), lastSessionTime) > 60) {
            lastSessionTime = new Date();
            sessionIdentifier = randomString();
            await sessionStart();
        }
    };
    function sendEvent(params) {
        if (config.DEBUG) {
            return;
        }
        return new Promise((resolve, reject) => {
            const url = `/events/v2?access_token=${config.ACCESS_TOKEN}`;
            return axiosInstance({
                baseURL: config.TELEMETRY_URL,
                isBlob: true
            }).post(url, params).then((res) => {
                resolve(res.data);
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }
    async function sessionStart() {
        const params = {
            sessionIdentifier,
            event: 'adMetrics.sessionStart',
            bucket: 'undefined',
            created: new Date().toISOString(),
        };
        return sendEvent([params]);
    }
    async function sendSelection(adid, zoomLevel) {
        const params = {
            sessionIdentifier,
            event: 'adMetrics.select',
            adid,
            zoomLevel,
            created: new Date().toISOString(),
        };
        await verifySession();
        return sendEvent([params]);
    }
    async function sendDeselection(adid) {
        const params = {
            sessionIdentifier,
            event: 'adMetrics.deselect',
            adid,
            created: new Date().toISOString(),
        };
        await verifySession();
        return sendEvent([params]);
    }
    async function sendVisibilities(features) {
        const params = features.map(({ adid, visibleStartTime, visibleEndTime }) => ({
            sessionIdentifier,
            event: 'adMetrics.visible',
            adid,
            visibleStartTime,
            visibleEndTime,
            created: new Date().toISOString(),
        }));
        await verifySession();
        return sendEvent(params);
    }
    async function sendAction(adid, action) {
        const params = {
            sessionIdentifier,
            event: 'adMetrics.callToAction',
            adid,
            action,
            created: new Date().toISOString(),
        };
        await verifySession();
        return sendEvent([params]);
    }

    const EVENT_TYPES = {
        LOAD: 'load',
        MOVE: 'move',
        CLICK_PIN: 'click_pin',
        CLICK_CARD: 'click_card',
        SHOW_CARD: 'show_card',
        UPDATE_CARD: 'update_card',
        CLOSE_CARD: 'close_card',
        CLICK_SIDE_CARD: 'click_side_card',
        SHOW_SIDE_CARD: 'show_side_card',
        UPDATE_SIDE_CARD: 'update_side_card',
        OPEN_SIDE_CARD: 'open_side_card',
        HIDE_SIDE_CARD: 'hide_side_card',
        CLOSE_SIDE_CARD: 'close_side_card',
        CLICK_POPUP: 'click_popup',
        SHOW_POPUP: 'show_popup',
        CLOSE_POPUP: 'close_popup',
    };
    const CLICK_TYPES = {
        CARD: 'card',
        TOGGLE: 'toggle',
        BANNER: 'banner',
        PHONE: 'phone',
        DIRECTIONS: 'directions',
        DETAIL: 'detail',
    };
    const TELEMETRY_ACTIONS = {
        [CLICK_TYPES.BANNER]: ACTIONS.BANNER,
        [CLICK_TYPES.PHONE]: ACTIONS.CALL,
        [CLICK_TYPES.DIRECTIONS]: ACTIONS.NAVIGATION,
        [CLICK_TYPES.DETAIL]: ACTIONS.DETAIL,
    };

    const camelCase = (object) => {
        const updatedObject = {};
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                updatedObject[key.replace(/(\_\w)/g, updatedKey => (updatedKey[1].toUpperCase()))] = object[key];
            }
        }
        return updatedObject;
    };
    const formatProperties = (properties) => camelCase(properties);

    exports.EVENT_TYPES = EVENT_TYPES;
    exports.Event = Event;
    exports.TELEMETRY_ACTIONS = TELEMETRY_ACTIONS;
    exports.config = config;
    exports.formatProperties = formatProperties;
    exports.sendAction = sendAction;
    exports.sendDeselection = sendDeselection;
    exports.sendSelection = sendSelection;
    exports.sendVisibilities = sendVisibilities;
    exports.sessionStart = sessionStart;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZS0xNTQyZGY3MC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2NvbmZpZy50cyIsIi4uLy4uL3NyYy9jb3JlL2V2ZW50LnRzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9zZXR0bGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2ZvbGxvdy1yZWRpcmVjdHMvZGVidWcuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZm9sbG93LXJlZGlyZWN0cy9pbmRleC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZW52L2RhdGEuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL2h0dHAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdmFsaWRhdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYXhpb3MuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCIuLi8uLi9zcmMvYXBpcy9heGlvcy50cyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9yZXF1aXJlZEFyZ3MvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL3RvRGF0ZS9pbmRleC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vZGlmZmVyZW5jZUluTWlsbGlzZWNvbmRzL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL3JvdW5kaW5nTWV0aG9kcy9pbmRleC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vZGlmZmVyZW5jZUluU2Vjb25kcy9pbmRleC5qcyIsIi4uLy4uL3NyYy91dGlscy9zdHJpbmcudHMiLCIuLi8uLi9zcmMvYXBpcy90ZWxlbWV0cnkuaGVscGVyLnRzIiwiLi4vLi4vc3JjL2FwaXMvdGVsZW1ldHJ5LnRzIiwiLi4vLi4vc3JjL2NvcmUvaGVscGVycy50cyIsIi4uLy4uL3NyYy91dGlscy9mZWF0dXJlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIEJBU0VfVVJMOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbScsXG4gIFRFTEVNRVRSWV9VUkw6ICdodHRwczovL2V2ZW50cy5tYXBib3guY29tJyxcbiAgU09VUkNFX1VSTDogJ21hcGJveDovL21hcGJveC1hZHMuYnEwOWI5cWMnLFxuICBMQVlFUl9TT1VSQ0VfSUQ6ICdwcm9tb3RlZC1waW5zLThzNzNtdScsXG4gIEFDQ0VTU19UT0tFTjogJycsXG4gIE1PQklMRV9NQVhfV0lEVEg6IDc2OCxcbiAgREVCVUc6IGZhbHNlLFxufTtcbiIsImV4cG9ydCBjbGFzcyBFdmVudCBpbXBsZW1lbnRzIE1hcGJveFByb21vdGVkLkV2ZW50IHtcbiAgcHVibGljIHR5cGU6IE1hcGJveFByb21vdGVkLkV2ZW50VHlwZXM7XG4gIHB1YmxpYyBkYXRhOiBPYmplY3Q7XG5cbiAgY29uc3RydWN0b3IodHlwZTogTWFwYm94UHJvbW90ZWQuRXZlbnRUeXBlcywgZGF0YTogT2JqZWN0ID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG4gIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKHZhbCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnRyaW0gPyBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOYXRpdmVTY3JpcHQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOUycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICk7XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QocmVzdWx0W2tleV0pICYmIGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZSh7fSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWwuc2xpY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG4vKipcbiAqIFJlbW92ZSBieXRlIG9yZGVyIG1hcmtlci4gVGhpcyBjYXRjaGVzIEVGIEJCIEJGICh0aGUgVVRGLTggQk9NKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IHdpdGggQk9NXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuZnVuY3Rpb24gc3RyaXBCT00oY29udGVudCkge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0OiBpc1BsYWluT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW0sXG4gIHN0cmlwQk9NOiBzdHJpcEJPTVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB2YXIgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKCcjJyk7XG4gICAgaWYgKGhhc2htYXJrSW5kZXggIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgfVxuXG4gICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkLCBvcHRpb25zKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkLFxuICAgIHN5bmNocm9ub3VzOiBvcHRpb25zID8gb3B0aW9ucy5zeW5jaHJvbm91cyA6IGZhbHNlLFxuICAgIHJ1bldoZW46IG9wdGlvbnMgPyBvcHRpb25zLnJ1bldoZW4gOiBudWxsXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuXG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICBlcnJvci5pc0F4aW9zRXJyb3IgPSB0cnVlO1xuXG4gIGVycm9yLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZSxcbiAgICAgIHN0YXR1czogdGhpcy5yZXNwb25zZSAmJiB0aGlzLnJlc3BvbnNlLnN0YXR1cyA/IHRoaXMucmVzcG9uc2Uuc3RhdHVzIDogbnVsbFxuICAgIH07XG4gIH07XG4gIHJldHVybiBlcnJvcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgdmFyIG9yaWdpblVSTDtcblxuICAgICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICAgIH1cblxuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG52YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBidWlsZEZ1bGxQYXRoID0gcmVxdWlyZSgnLi4vY29yZS9idWlsZEZ1bGxQYXRoJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL0NhbmNlbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG4gICAgdmFyIHJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgdmFyIG9uQ2FuY2VsZWQ7XG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnVuc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLnNpZ25hbCkge1xuICAgICAgICBjb25maWcuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgPyB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoY29uZmlnLmF1dGgucGFzc3dvcmQpKSA6ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICBmdW5jdGlvbiBvbmxvYWRlbmQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhcmVzcG9uc2VUeXBlIHx8IHJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnIHx8ICByZXNwb25zZVR5cGUgPT09ICdqc29uJyA/XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShmdW5jdGlvbiBfcmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gX3JlamVjdChlcnIpIHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCdvbmxvYWRlbmQnIGluIHJlcXVlc3QpIHtcbiAgICAgIC8vIFVzZSBvbmxvYWRlbmQgaWYgYXZhaWxhYmxlXG4gICAgICByZXF1ZXN0Lm9ubG9hZGVuZCA9IG9ubG9hZGVuZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZSB0byBlbXVsYXRlIG9ubG9hZGVuZFxuICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlYWR5c3RhdGUgaGFuZGxlciBpcyBjYWxsaW5nIGJlZm9yZSBvbmVycm9yIG9yIG9udGltZW91dCBoYW5kbGVycyxcbiAgICAgICAgLy8gc28gd2Ugc2hvdWxkIGNhbGwgb25sb2FkZW5kIG9uIHRoZSBuZXh0ICd0aWNrJ1xuICAgICAgICBzZXRUaW1lb3V0KG9ubG9hZGVuZCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICB2YXIgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0ID8gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyA6ICd0aW1lb3V0IGV4Y2VlZGVkJztcbiAgICAgIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsIHx8IGRlZmF1bHRzLnRyYW5zaXRpb25hbDtcbiAgICAgIGlmIChjb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2U7XG4gICAgICB9XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgdHJhbnNpdGlvbmFsLmNsYXJpZnlUaW1lb3V0RXJyb3IgPyAnRVRJTUVET1VUJyA6ICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oZnVsbFBhdGgpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKHJlc3BvbnNlVHlwZSAmJiByZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4gfHwgY29uZmlnLnNpZ25hbCkge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIG9uQ2FuY2VsZWQgPSBmdW5jdGlvbihjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlamVjdCghY2FuY2VsIHx8IChjYW5jZWwgJiYgY2FuY2VsLnR5cGUpID8gbmV3IENhbmNlbCgnY2FuY2VsZWQnKSA6IGNhbmNlbCk7XG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9O1xuXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4gJiYgY29uZmlnLmNhbmNlbFRva2VuLnN1YnNjcmliZShvbkNhbmNlbGVkKTtcbiAgICAgIGlmIChjb25maWcuc2lnbmFsKSB7XG4gICAgICAgIGNvbmZpZy5zaWduYWwuYWJvcnRlZCA/IG9uQ2FuY2VsZWQoKSA6IGNvbmZpZy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkNhbmNlbGVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXJlcXVlc3REYXRhKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcbiIsInZhciBkZWJ1ZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghZGVidWcpIHtcbiAgICB0cnkge1xuICAgICAgLyogZXNsaW50IGdsb2JhbC1yZXF1aXJlOiBvZmYgKi9cbiAgICAgIGRlYnVnID0gcmVxdWlyZShcImRlYnVnXCIpKFwiZm9sbG93LXJlZGlyZWN0c1wiKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7IC8qICovIH1cbiAgICBpZiAodHlwZW9mIGRlYnVnICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGRlYnVnID0gZnVuY3Rpb24gKCkgeyAvKiAqLyB9O1xuICAgIH1cbiAgfVxuICBkZWJ1Zy5hcHBseShudWxsLCBhcmd1bWVudHMpO1xufTtcbiIsInZhciB1cmwgPSByZXF1aXJlKFwidXJsXCIpO1xudmFyIFVSTCA9IHVybC5VUkw7XG52YXIgaHR0cCA9IHJlcXVpcmUoXCJodHRwXCIpO1xudmFyIGh0dHBzID0gcmVxdWlyZShcImh0dHBzXCIpO1xudmFyIFdyaXRhYmxlID0gcmVxdWlyZShcInN0cmVhbVwiKS5Xcml0YWJsZTtcbnZhciBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xudmFyIGRlYnVnID0gcmVxdWlyZShcIi4vZGVidWdcIik7XG5cbi8vIENyZWF0ZSBoYW5kbGVycyB0aGF0IHBhc3MgZXZlbnRzIGZyb20gbmF0aXZlIHJlcXVlc3RzXG52YXIgZXZlbnRzID0gW1wiYWJvcnRcIiwgXCJhYm9ydGVkXCIsIFwiY29ubmVjdFwiLCBcImVycm9yXCIsIFwic29ja2V0XCIsIFwidGltZW91dFwiXTtcbnZhciBldmVudEhhbmRsZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbmV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICBldmVudEhhbmRsZXJzW2V2ZW50XSA9IGZ1bmN0aW9uIChhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgdGhpcy5fcmVkaXJlY3RhYmxlLmVtaXQoZXZlbnQsIGFyZzEsIGFyZzIsIGFyZzMpO1xuICB9O1xufSk7XG5cbi8vIEVycm9yIHR5cGVzIHdpdGggY29kZXNcbnZhciBSZWRpcmVjdGlvbkVycm9yID0gY3JlYXRlRXJyb3JUeXBlKFxuICBcIkVSUl9GUl9SRURJUkVDVElPTl9GQUlMVVJFXCIsXG4gIFwiXCJcbik7XG52YXIgVG9vTWFueVJlZGlyZWN0c0Vycm9yID0gY3JlYXRlRXJyb3JUeXBlKFxuICBcIkVSUl9GUl9UT09fTUFOWV9SRURJUkVDVFNcIixcbiAgXCJNYXhpbXVtIG51bWJlciBvZiByZWRpcmVjdHMgZXhjZWVkZWRcIlxuKTtcbnZhciBNYXhCb2R5TGVuZ3RoRXhjZWVkZWRFcnJvciA9IGNyZWF0ZUVycm9yVHlwZShcbiAgXCJFUlJfRlJfTUFYX0JPRFlfTEVOR1RIX0VYQ0VFREVEXCIsXG4gIFwiUmVxdWVzdCBib2R5IGxhcmdlciB0aGFuIG1heEJvZHlMZW5ndGggbGltaXRcIlxuKTtcbnZhciBXcml0ZUFmdGVyRW5kRXJyb3IgPSBjcmVhdGVFcnJvclR5cGUoXG4gIFwiRVJSX1NUUkVBTV9XUklURV9BRlRFUl9FTkRcIixcbiAgXCJ3cml0ZSBhZnRlciBlbmRcIlxuKTtcblxuLy8gQW4gSFRUUChTKSByZXF1ZXN0IHRoYXQgY2FuIGJlIHJlZGlyZWN0ZWRcbmZ1bmN0aW9uIFJlZGlyZWN0YWJsZVJlcXVlc3Qob3B0aW9ucywgcmVzcG9uc2VDYWxsYmFjaykge1xuICAvLyBJbml0aWFsaXplIHRoZSByZXF1ZXN0XG4gIFdyaXRhYmxlLmNhbGwodGhpcyk7XG4gIHRoaXMuX3Nhbml0aXplT3B0aW9ucyhvcHRpb25zKTtcbiAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMuX2VuZGVkID0gZmFsc2U7XG4gIHRoaXMuX2VuZGluZyA9IGZhbHNlO1xuICB0aGlzLl9yZWRpcmVjdENvdW50ID0gMDtcbiAgdGhpcy5fcmVkaXJlY3RzID0gW107XG4gIHRoaXMuX3JlcXVlc3RCb2R5TGVuZ3RoID0gMDtcbiAgdGhpcy5fcmVxdWVzdEJvZHlCdWZmZXJzID0gW107XG5cbiAgLy8gQXR0YWNoIGEgY2FsbGJhY2sgaWYgcGFzc2VkXG4gIGlmIChyZXNwb25zZUNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbihcInJlc3BvbnNlXCIsIHJlc3BvbnNlQ2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUmVhY3QgdG8gcmVzcG9uc2VzIG9mIG5hdGl2ZSByZXF1ZXN0c1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX29uTmF0aXZlUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICBzZWxmLl9wcm9jZXNzUmVzcG9uc2UocmVzcG9uc2UpO1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gdGhlIGZpcnN0IHJlcXVlc3RcbiAgdGhpcy5fcGVyZm9ybVJlcXVlc3QoKTtcbn1cblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShXcml0YWJsZS5wcm90b3R5cGUpO1xuXG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgYWJvcnRSZXF1ZXN0KHRoaXMuX2N1cnJlbnRSZXF1ZXN0KTtcbiAgdGhpcy5lbWl0KFwiYWJvcnRcIik7XG59O1xuXG4vLyBXcml0ZXMgYnVmZmVyZWQgZGF0YSB0byB0aGUgY3VycmVudCBuYXRpdmUgcmVxdWVzdFxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gIC8vIFdyaXRpbmcgaXMgbm90IGFsbG93ZWQgaWYgZW5kIGhhcyBiZWVuIGNhbGxlZFxuICBpZiAodGhpcy5fZW5kaW5nKSB7XG4gICAgdGhyb3cgbmV3IFdyaXRlQWZ0ZXJFbmRFcnJvcigpO1xuICB9XG5cbiAgLy8gVmFsaWRhdGUgaW5wdXQgYW5kIHNoaWZ0IHBhcmFtZXRlcnMgaWYgbmVjZXNzYXJ5XG4gIGlmICghKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiICYmIChcImxlbmd0aFwiIGluIGRhdGEpKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJkYXRhIHNob3VsZCBiZSBhIHN0cmluZywgQnVmZmVyIG9yIFVpbnQ4QXJyYXlcIik7XG4gIH1cbiAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY2FsbGJhY2sgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH1cblxuICAvLyBJZ25vcmUgZW1wdHkgYnVmZmVycywgc2luY2Ugd3JpdGluZyB0aGVtIGRvZXNuJ3QgaW52b2tlIHRoZSBjYWxsYmFja1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvaXNzdWVzLzIyMDY2XG4gIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIE9ubHkgd3JpdGUgd2hlbiB3ZSBkb24ndCBleGNlZWQgdGhlIG1heGltdW0gYm9keSBsZW5ndGhcbiAgaWYgKHRoaXMuX3JlcXVlc3RCb2R5TGVuZ3RoICsgZGF0YS5sZW5ndGggPD0gdGhpcy5fb3B0aW9ucy5tYXhCb2R5TGVuZ3RoKSB7XG4gICAgdGhpcy5fcmVxdWVzdEJvZHlMZW5ndGggKz0gZGF0YS5sZW5ndGg7XG4gICAgdGhpcy5fcmVxdWVzdEJvZHlCdWZmZXJzLnB1c2goeyBkYXRhOiBkYXRhLCBlbmNvZGluZzogZW5jb2RpbmcgfSk7XG4gICAgdGhpcy5fY3VycmVudFJlcXVlc3Qud3JpdGUoZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKTtcbiAgfVxuICAvLyBFcnJvciB3aGVuIHdlIGV4Y2VlZCB0aGUgbWF4aW11bSBib2R5IGxlbmd0aFxuICBlbHNlIHtcbiAgICB0aGlzLmVtaXQoXCJlcnJvclwiLCBuZXcgTWF4Qm9keUxlbmd0aEV4Y2VlZGVkRXJyb3IoKSk7XG4gICAgdGhpcy5hYm9ydCgpO1xuICB9XG59O1xuXG4vLyBFbmRzIHRoZSBjdXJyZW50IG5hdGl2ZSByZXF1ZXN0XG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gIC8vIFNoaWZ0IHBhcmFtZXRlcnMgaWYgbmVjZXNzYXJ5XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY2FsbGJhY2sgPSBkYXRhO1xuICAgIGRhdGEgPSBlbmNvZGluZyA9IG51bGw7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGVuY29kaW5nID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjYWxsYmFjayA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfVxuXG4gIC8vIFdyaXRlIGRhdGEgaWYgbmVlZGVkIGFuZCBlbmRcbiAgaWYgKCFkYXRhKSB7XG4gICAgdGhpcy5fZW5kZWQgPSB0aGlzLl9lbmRpbmcgPSB0cnVlO1xuICAgIHRoaXMuX2N1cnJlbnRSZXF1ZXN0LmVuZChudWxsLCBudWxsLCBjYWxsYmFjayk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjdXJyZW50UmVxdWVzdCA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0O1xuICAgIHRoaXMud3JpdGUoZGF0YSwgZW5jb2RpbmcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2VuZGVkID0gdHJ1ZTtcbiAgICAgIGN1cnJlbnRSZXF1ZXN0LmVuZChudWxsLCBudWxsLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gICAgdGhpcy5fZW5kaW5nID0gdHJ1ZTtcbiAgfVxufTtcblxuLy8gU2V0cyBhIGhlYWRlciB2YWx1ZSBvbiB0aGUgY3VycmVudCBuYXRpdmUgcmVxdWVzdFxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUuc2V0SGVhZGVyID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX29wdGlvbnMuaGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xuICB0aGlzLl9jdXJyZW50UmVxdWVzdC5zZXRIZWFkZXIobmFtZSwgdmFsdWUpO1xufTtcblxuLy8gQ2xlYXJzIGEgaGVhZGVyIHZhbHVlIG9uIHRoZSBjdXJyZW50IG5hdGl2ZSByZXF1ZXN0XG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5yZW1vdmVIZWFkZXIgPSBmdW5jdGlvbiAobmFtZSkge1xuICBkZWxldGUgdGhpcy5fb3B0aW9ucy5oZWFkZXJzW25hbWVdO1xuICB0aGlzLl9jdXJyZW50UmVxdWVzdC5yZW1vdmVIZWFkZXIobmFtZSk7XG59O1xuXG4vLyBHbG9iYWwgdGltZW91dCBmb3IgYWxsIHVuZGVybHlpbmcgcmVxdWVzdHNcblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLnNldFRpbWVvdXQgPSBmdW5jdGlvbiAobXNlY3MsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBEZXN0cm95cyB0aGUgc29ja2V0IG9uIHRpbWVvdXRcbiAgZnVuY3Rpb24gZGVzdHJveU9uVGltZW91dChzb2NrZXQpIHtcbiAgICBzb2NrZXQuc2V0VGltZW91dChtc2Vjcyk7XG4gICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKFwidGltZW91dFwiLCBzb2NrZXQuZGVzdHJveSk7XG4gICAgc29ja2V0LmFkZExpc3RlbmVyKFwidGltZW91dFwiLCBzb2NrZXQuZGVzdHJveSk7XG4gIH1cblxuICAvLyBTZXRzIHVwIGEgdGltZXIgdG8gdHJpZ2dlciBhIHRpbWVvdXQgZXZlbnRcbiAgZnVuY3Rpb24gc3RhcnRUaW1lcihzb2NrZXQpIHtcbiAgICBpZiAoc2VsZi5fdGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHNlbGYuX3RpbWVvdXQpO1xuICAgIH1cbiAgICBzZWxmLl90aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmVtaXQoXCJ0aW1lb3V0XCIpO1xuICAgICAgY2xlYXJUaW1lcigpO1xuICAgIH0sIG1zZWNzKTtcbiAgICBkZXN0cm95T25UaW1lb3V0KHNvY2tldCk7XG4gIH1cblxuICAvLyBTdG9wcyBhIHRpbWVvdXQgZnJvbSB0cmlnZ2VyaW5nXG4gIGZ1bmN0aW9uIGNsZWFyVGltZXIoKSB7XG4gICAgaWYgKHNlbGYuX3RpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dChzZWxmLl90aW1lb3V0KTtcbiAgICAgIHNlbGYuX3RpbWVvdXQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIoXCJ0aW1lb3V0XCIsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgaWYgKCFzZWxmLnNvY2tldCkge1xuICAgICAgc2VsZi5fY3VycmVudFJlcXVlc3QucmVtb3ZlTGlzdGVuZXIoXCJzb2NrZXRcIiwgc3RhcnRUaW1lcik7XG4gICAgfVxuICB9XG5cbiAgLy8gQXR0YWNoIGNhbGxiYWNrIGlmIHBhc3NlZFxuICBpZiAoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKFwidGltZW91dFwiLCBjYWxsYmFjayk7XG4gIH1cblxuICAvLyBTdGFydCB0aGUgdGltZXIgaWYgb3Igd2hlbiB0aGUgc29ja2V0IGlzIG9wZW5lZFxuICBpZiAodGhpcy5zb2NrZXQpIHtcbiAgICBzdGFydFRpbWVyKHRoaXMuc29ja2V0KTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLl9jdXJyZW50UmVxdWVzdC5vbmNlKFwic29ja2V0XCIsIHN0YXJ0VGltZXIpO1xuICB9XG5cbiAgLy8gQ2xlYW4gdXAgb24gZXZlbnRzXG4gIHRoaXMub24oXCJzb2NrZXRcIiwgZGVzdHJveU9uVGltZW91dCk7XG4gIHRoaXMub25jZShcInJlc3BvbnNlXCIsIGNsZWFyVGltZXIpO1xuICB0aGlzLm9uY2UoXCJlcnJvclwiLCBjbGVhclRpbWVyKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIFByb3h5IGFsbCBvdGhlciBwdWJsaWMgQ2xpZW50UmVxdWVzdCBtZXRob2RzXG5bXG4gIFwiZmx1c2hIZWFkZXJzXCIsIFwiZ2V0SGVhZGVyXCIsXG4gIFwic2V0Tm9EZWxheVwiLCBcInNldFNvY2tldEtlZXBBbGl2ZVwiLFxuXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRSZXF1ZXN0W21ldGhvZF0oYSwgYik7XG4gIH07XG59KTtcblxuLy8gUHJveHkgYWxsIHB1YmxpYyBDbGllbnRSZXF1ZXN0IHByb3BlcnRpZXNcbltcImFib3J0ZWRcIiwgXCJjb25uZWN0aW9uXCIsIFwic29ja2V0XCJdLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2N1cnJlbnRSZXF1ZXN0W3Byb3BlcnR5XTsgfSxcbiAgfSk7XG59KTtcblxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUuX3Nhbml0aXplT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIC8vIEVuc3VyZSBoZWFkZXJzIGFyZSBhbHdheXMgcHJlc2VudFxuICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgIG9wdGlvbnMuaGVhZGVycyA9IHt9O1xuICB9XG5cbiAgLy8gU2luY2UgaHR0cC5yZXF1ZXN0IHRyZWF0cyBob3N0IGFzIGFuIGFsaWFzIG9mIGhvc3RuYW1lLFxuICAvLyBidXQgdGhlIHVybCBtb2R1bGUgaW50ZXJwcmV0cyBob3N0IGFzIGhvc3RuYW1lIHBsdXMgcG9ydCxcbiAgLy8gZWxpbWluYXRlIHRoZSBob3N0IHByb3BlcnR5IHRvIGF2b2lkIGNvbmZ1c2lvbi5cbiAgaWYgKG9wdGlvbnMuaG9zdCkge1xuICAgIC8vIFVzZSBob3N0bmFtZSBpZiBzZXQsIGJlY2F1c2UgaXQgaGFzIHByZWNlZGVuY2VcbiAgICBpZiAoIW9wdGlvbnMuaG9zdG5hbWUpIHtcbiAgICAgIG9wdGlvbnMuaG9zdG5hbWUgPSBvcHRpb25zLmhvc3Q7XG4gICAgfVxuICAgIGRlbGV0ZSBvcHRpb25zLmhvc3Q7XG4gIH1cblxuICAvLyBDb21wbGV0ZSB0aGUgVVJMIG9iamVjdCB3aGVuIG5lY2Vzc2FyeVxuICBpZiAoIW9wdGlvbnMucGF0aG5hbWUgJiYgb3B0aW9ucy5wYXRoKSB7XG4gICAgdmFyIHNlYXJjaFBvcyA9IG9wdGlvbnMucGF0aC5pbmRleE9mKFwiP1wiKTtcbiAgICBpZiAoc2VhcmNoUG9zIDwgMCkge1xuICAgICAgb3B0aW9ucy5wYXRobmFtZSA9IG9wdGlvbnMucGF0aDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvcHRpb25zLnBhdGhuYW1lID0gb3B0aW9ucy5wYXRoLnN1YnN0cmluZygwLCBzZWFyY2hQb3MpO1xuICAgICAgb3B0aW9ucy5zZWFyY2ggPSBvcHRpb25zLnBhdGguc3Vic3RyaW5nKHNlYXJjaFBvcyk7XG4gICAgfVxuICB9XG59O1xuXG5cbi8vIEV4ZWN1dGVzIHRoZSBuZXh0IG5hdGl2ZSByZXF1ZXN0IChpbml0aWFsIG9yIHJlZGlyZWN0KVxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUuX3BlcmZvcm1SZXF1ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBMb2FkIHRoZSBuYXRpdmUgcHJvdG9jb2xcbiAgdmFyIHByb3RvY29sID0gdGhpcy5fb3B0aW9ucy5wcm90b2NvbDtcbiAgdmFyIG5hdGl2ZVByb3RvY29sID0gdGhpcy5fb3B0aW9ucy5uYXRpdmVQcm90b2NvbHNbcHJvdG9jb2xdO1xuICBpZiAoIW5hdGl2ZVByb3RvY29sKSB7XG4gICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgbmV3IFR5cGVFcnJvcihcIlVuc3VwcG9ydGVkIHByb3RvY29sIFwiICsgcHJvdG9jb2wpKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBJZiBzcGVjaWZpZWQsIHVzZSB0aGUgYWdlbnQgY29ycmVzcG9uZGluZyB0byB0aGUgcHJvdG9jb2xcbiAgLy8gKEhUVFAgYW5kIEhUVFBTIHVzZSBkaWZmZXJlbnQgdHlwZXMgb2YgYWdlbnRzKVxuICBpZiAodGhpcy5fb3B0aW9ucy5hZ2VudHMpIHtcbiAgICB2YXIgc2NoZW1lID0gcHJvdG9jb2wuc3Vic3RyKDAsIHByb3RvY29sLmxlbmd0aCAtIDEpO1xuICAgIHRoaXMuX29wdGlvbnMuYWdlbnQgPSB0aGlzLl9vcHRpb25zLmFnZW50c1tzY2hlbWVdO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBuYXRpdmUgcmVxdWVzdFxuICB2YXIgcmVxdWVzdCA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0ID1cbiAgICAgICAgbmF0aXZlUHJvdG9jb2wucmVxdWVzdCh0aGlzLl9vcHRpb25zLCB0aGlzLl9vbk5hdGl2ZVJlc3BvbnNlKTtcbiAgdGhpcy5fY3VycmVudFVybCA9IHVybC5mb3JtYXQodGhpcy5fb3B0aW9ucyk7XG5cbiAgLy8gU2V0IHVwIGV2ZW50IGhhbmRsZXJzXG4gIHJlcXVlc3QuX3JlZGlyZWN0YWJsZSA9IHRoaXM7XG4gIGZvciAodmFyIGUgPSAwOyBlIDwgZXZlbnRzLmxlbmd0aDsgZSsrKSB7XG4gICAgcmVxdWVzdC5vbihldmVudHNbZV0sIGV2ZW50SGFuZGxlcnNbZXZlbnRzW2VdXSk7XG4gIH1cblxuICAvLyBFbmQgYSByZWRpcmVjdGVkIHJlcXVlc3RcbiAgLy8gKFRoZSBmaXJzdCByZXF1ZXN0IG11c3QgYmUgZW5kZWQgZXhwbGljaXRseSB3aXRoIFJlZGlyZWN0YWJsZVJlcXVlc3QjZW5kKVxuICBpZiAodGhpcy5faXNSZWRpcmVjdCkge1xuICAgIC8vIFdyaXRlIHRoZSByZXF1ZXN0IGVudGl0eSBhbmQgZW5kLlxuICAgIHZhciBpID0gMDtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGJ1ZmZlcnMgPSB0aGlzLl9yZXF1ZXN0Qm9keUJ1ZmZlcnM7XG4gICAgKGZ1bmN0aW9uIHdyaXRlTmV4dChlcnJvcikge1xuICAgICAgLy8gT25seSB3cml0ZSBpZiB0aGlzIHJlcXVlc3QgaGFzIG5vdCBiZWVuIHJlZGlyZWN0ZWQgeWV0XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHJlcXVlc3QgPT09IHNlbGYuX2N1cnJlbnRSZXF1ZXN0KSB7XG4gICAgICAgIC8vIFJlcG9ydCBhbnkgd3JpdGUgZXJyb3JzXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBzZWxmLmVtaXQoXCJlcnJvclwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV3JpdGUgdGhlIG5leHQgYnVmZmVyIGlmIHRoZXJlIGFyZSBzdGlsbCBsZWZ0XG4gICAgICAgIGVsc2UgaWYgKGkgPCBidWZmZXJzLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBidWZmZXIgPSBidWZmZXJzW2krK107XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAoIXJlcXVlc3QuZmluaXNoZWQpIHtcbiAgICAgICAgICAgIHJlcXVlc3Qud3JpdGUoYnVmZmVyLmRhdGEsIGJ1ZmZlci5lbmNvZGluZywgd3JpdGVOZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRW5kIHRoZSByZXF1ZXN0IGlmIGBlbmRgIGhhcyBiZWVuIGNhbGxlZCBvbiB1c1xuICAgICAgICBlbHNlIGlmIChzZWxmLl9lbmRlZCkge1xuICAgICAgICAgIHJlcXVlc3QuZW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KCkpO1xuICB9XG59O1xuXG4vLyBQcm9jZXNzZXMgYSByZXNwb25zZSBmcm9tIHRoZSBjdXJyZW50IG5hdGl2ZSByZXF1ZXN0XG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5fcHJvY2Vzc1Jlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gIC8vIFN0b3JlIHRoZSByZWRpcmVjdGVkIHJlc3BvbnNlXG4gIHZhciBzdGF0dXNDb2RlID0gcmVzcG9uc2Uuc3RhdHVzQ29kZTtcbiAgaWYgKHRoaXMuX29wdGlvbnMudHJhY2tSZWRpcmVjdHMpIHtcbiAgICB0aGlzLl9yZWRpcmVjdHMucHVzaCh7XG4gICAgICB1cmw6IHRoaXMuX2N1cnJlbnRVcmwsXG4gICAgICBoZWFkZXJzOiByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgc3RhdHVzQ29kZTogc3RhdHVzQ29kZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFJGQzcyMzHCpzYuNDogVGhlIDN4eCAoUmVkaXJlY3Rpb24pIGNsYXNzIG9mIHN0YXR1cyBjb2RlIGluZGljYXRlc1xuICAvLyB0aGF0IGZ1cnRoZXIgYWN0aW9uIG5lZWRzIHRvIGJlIHRha2VuIGJ5IHRoZSB1c2VyIGFnZW50IGluIG9yZGVyIHRvXG4gIC8vIGZ1bGZpbGwgdGhlIHJlcXVlc3QuIElmIGEgTG9jYXRpb24gaGVhZGVyIGZpZWxkIGlzIHByb3ZpZGVkLFxuICAvLyB0aGUgdXNlciBhZ2VudCBNQVkgYXV0b21hdGljYWxseSByZWRpcmVjdCBpdHMgcmVxdWVzdCB0byB0aGUgVVJJXG4gIC8vIHJlZmVyZW5jZWQgYnkgdGhlIExvY2F0aW9uIGZpZWxkIHZhbHVlLFxuICAvLyBldmVuIGlmIHRoZSBzcGVjaWZpYyBzdGF0dXMgY29kZSBpcyBub3QgdW5kZXJzdG9vZC5cbiAgdmFyIGxvY2F0aW9uID0gcmVzcG9uc2UuaGVhZGVycy5sb2NhdGlvbjtcbiAgaWYgKGxvY2F0aW9uICYmIHRoaXMuX29wdGlvbnMuZm9sbG93UmVkaXJlY3RzICE9PSBmYWxzZSAmJlxuICAgICAgc3RhdHVzQ29kZSA+PSAzMDAgJiYgc3RhdHVzQ29kZSA8IDQwMCkge1xuICAgIC8vIEFib3J0IHRoZSBjdXJyZW50IHJlcXVlc3RcbiAgICBhYm9ydFJlcXVlc3QodGhpcy5fY3VycmVudFJlcXVlc3QpO1xuICAgIC8vIERpc2NhcmQgdGhlIHJlbWFpbmRlciBvZiB0aGUgcmVzcG9uc2UgdG8gYXZvaWQgd2FpdGluZyBmb3IgZGF0YVxuICAgIHJlc3BvbnNlLmRlc3Ryb3koKTtcblxuICAgIC8vIFJGQzcyMzHCpzYuNDogQSBjbGllbnQgU0hPVUxEIGRldGVjdCBhbmQgaW50ZXJ2ZW5lXG4gICAgLy8gaW4gY3ljbGljYWwgcmVkaXJlY3Rpb25zIChpLmUuLCBcImluZmluaXRlXCIgcmVkaXJlY3Rpb24gbG9vcHMpLlxuICAgIGlmICgrK3RoaXMuX3JlZGlyZWN0Q291bnQgPiB0aGlzLl9vcHRpb25zLm1heFJlZGlyZWN0cykge1xuICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgbmV3IFRvb01hbnlSZWRpcmVjdHNFcnJvcigpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSRkM3MjMxwqc2LjQ6IEF1dG9tYXRpYyByZWRpcmVjdGlvbiBuZWVkcyB0byBkb25lIHdpdGhcbiAgICAvLyBjYXJlIGZvciBtZXRob2RzIG5vdCBrbm93biB0byBiZSBzYWZlLCBb4oCmXVxuICAgIC8vIFJGQzcyMzHCpzYuNC4y4oCTMzogRm9yIGhpc3RvcmljYWwgcmVhc29ucywgYSB1c2VyIGFnZW50IE1BWSBjaGFuZ2VcbiAgICAvLyB0aGUgcmVxdWVzdCBtZXRob2QgZnJvbSBQT1NUIHRvIEdFVCBmb3IgdGhlIHN1YnNlcXVlbnQgcmVxdWVzdC5cbiAgICBpZiAoKHN0YXR1c0NvZGUgPT09IDMwMSB8fCBzdGF0dXNDb2RlID09PSAzMDIpICYmIHRoaXMuX29wdGlvbnMubWV0aG9kID09PSBcIlBPU1RcIiB8fFxuICAgICAgICAvLyBSRkM3MjMxwqc2LjQuNDogVGhlIDMwMyAoU2VlIE90aGVyKSBzdGF0dXMgY29kZSBpbmRpY2F0ZXMgdGhhdFxuICAgICAgICAvLyB0aGUgc2VydmVyIGlzIHJlZGlyZWN0aW5nIHRoZSB1c2VyIGFnZW50IHRvIGEgZGlmZmVyZW50IHJlc291cmNlIFvigKZdXG4gICAgICAgIC8vIEEgdXNlciBhZ2VudCBjYW4gcGVyZm9ybSBhIHJldHJpZXZhbCByZXF1ZXN0IHRhcmdldGluZyB0aGF0IFVSSVxuICAgICAgICAvLyAoYSBHRVQgb3IgSEVBRCByZXF1ZXN0IGlmIHVzaW5nIEhUVFApIFvigKZdXG4gICAgICAgIChzdGF0dXNDb2RlID09PSAzMDMpICYmICEvXig/OkdFVHxIRUFEKSQvLnRlc3QodGhpcy5fb3B0aW9ucy5tZXRob2QpKSB7XG4gICAgICB0aGlzLl9vcHRpb25zLm1ldGhvZCA9IFwiR0VUXCI7XG4gICAgICAvLyBEcm9wIGEgcG9zc2libGUgZW50aXR5IGFuZCBoZWFkZXJzIHJlbGF0ZWQgdG8gaXRcbiAgICAgIHRoaXMuX3JlcXVlc3RCb2R5QnVmZmVycyA9IFtdO1xuICAgICAgcmVtb3ZlTWF0Y2hpbmdIZWFkZXJzKC9eY29udGVudC0vaSwgdGhpcy5fb3B0aW9ucy5oZWFkZXJzKTtcbiAgICB9XG5cbiAgICAvLyBEcm9wIHRoZSBIb3N0IGhlYWRlciwgYXMgdGhlIHJlZGlyZWN0IG1pZ2h0IGxlYWQgdG8gYSBkaWZmZXJlbnQgaG9zdFxuICAgIHZhciBwcmV2aW91c0hvc3ROYW1lID0gcmVtb3ZlTWF0Y2hpbmdIZWFkZXJzKC9eaG9zdCQvaSwgdGhpcy5fb3B0aW9ucy5oZWFkZXJzKSB8fFxuICAgICAgdXJsLnBhcnNlKHRoaXMuX2N1cnJlbnRVcmwpLmhvc3RuYW1lO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSByZWRpcmVjdGVkIHJlcXVlc3RcbiAgICB2YXIgcmVkaXJlY3RVcmwgPSB1cmwucmVzb2x2ZSh0aGlzLl9jdXJyZW50VXJsLCBsb2NhdGlvbik7XG4gICAgZGVidWcoXCJyZWRpcmVjdGluZyB0b1wiLCByZWRpcmVjdFVybCk7XG4gICAgdGhpcy5faXNSZWRpcmVjdCA9IHRydWU7XG4gICAgdmFyIHJlZGlyZWN0VXJsUGFydHMgPSB1cmwucGFyc2UocmVkaXJlY3RVcmwpO1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5fb3B0aW9ucywgcmVkaXJlY3RVcmxQYXJ0cyk7XG5cbiAgICAvLyBEcm9wIHRoZSBBdXRob3JpemF0aW9uIGhlYWRlciBpZiByZWRpcmVjdGluZyB0byBhbm90aGVyIGhvc3RcbiAgICBpZiAocmVkaXJlY3RVcmxQYXJ0cy5ob3N0bmFtZSAhPT0gcHJldmlvdXNIb3N0TmFtZSkge1xuICAgICAgcmVtb3ZlTWF0Y2hpbmdIZWFkZXJzKC9eYXV0aG9yaXphdGlvbiQvaSwgdGhpcy5fb3B0aW9ucy5oZWFkZXJzKTtcbiAgICB9XG5cbiAgICAvLyBFdmFsdWF0ZSB0aGUgYmVmb3JlUmVkaXJlY3QgY2FsbGJhY2tcbiAgICBpZiAodHlwZW9mIHRoaXMuX29wdGlvbnMuYmVmb3JlUmVkaXJlY3QgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIHJlc3BvbnNlRGV0YWlscyA9IHsgaGVhZGVyczogcmVzcG9uc2UuaGVhZGVycyB9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucy5iZWZvcmVSZWRpcmVjdC5jYWxsKG51bGwsIHRoaXMuX29wdGlvbnMsIHJlc3BvbnNlRGV0YWlscyk7XG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuZW1pdChcImVycm9yXCIsIGVycik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3Nhbml0aXplT3B0aW9ucyh0aGlzLl9vcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBQZXJmb3JtIHRoZSByZWRpcmVjdGVkIHJlcXVlc3RcbiAgICB0cnkge1xuICAgICAgdGhpcy5fcGVyZm9ybVJlcXVlc3QoKTtcbiAgICB9XG4gICAgY2F0Y2ggKGNhdXNlKSB7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgUmVkaXJlY3Rpb25FcnJvcihcIlJlZGlyZWN0ZWQgcmVxdWVzdCBmYWlsZWQ6IFwiICsgY2F1c2UubWVzc2FnZSk7XG4gICAgICBlcnJvci5jYXVzZSA9IGNhdXNlO1xuICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgZXJyb3IpO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICAvLyBUaGUgcmVzcG9uc2UgaXMgbm90IGEgcmVkaXJlY3Q7IHJldHVybiBpdCBhcy1pc1xuICAgIHJlc3BvbnNlLnJlc3BvbnNlVXJsID0gdGhpcy5fY3VycmVudFVybDtcbiAgICByZXNwb25zZS5yZWRpcmVjdHMgPSB0aGlzLl9yZWRpcmVjdHM7XG4gICAgdGhpcy5lbWl0KFwicmVzcG9uc2VcIiwgcmVzcG9uc2UpO1xuXG4gICAgLy8gQ2xlYW4gdXBcbiAgICB0aGlzLl9yZXF1ZXN0Qm9keUJ1ZmZlcnMgPSBbXTtcbiAgfVxufTtcblxuLy8gV3JhcHMgdGhlIGtleS92YWx1ZSBvYmplY3Qgb2YgcHJvdG9jb2xzIHdpdGggcmVkaXJlY3QgZnVuY3Rpb25hbGl0eVxuZnVuY3Rpb24gd3JhcChwcm90b2NvbHMpIHtcbiAgLy8gRGVmYXVsdCBzZXR0aW5nc1xuICB2YXIgZXhwb3J0cyA9IHtcbiAgICBtYXhSZWRpcmVjdHM6IDIxLFxuICAgIG1heEJvZHlMZW5ndGg6IDEwICogMTAyNCAqIDEwMjQsXG4gIH07XG5cbiAgLy8gV3JhcCBlYWNoIHByb3RvY29sXG4gIHZhciBuYXRpdmVQcm90b2NvbHMgPSB7fTtcbiAgT2JqZWN0LmtleXMocHJvdG9jb2xzKS5mb3JFYWNoKGZ1bmN0aW9uIChzY2hlbWUpIHtcbiAgICB2YXIgcHJvdG9jb2wgPSBzY2hlbWUgKyBcIjpcIjtcbiAgICB2YXIgbmF0aXZlUHJvdG9jb2wgPSBuYXRpdmVQcm90b2NvbHNbcHJvdG9jb2xdID0gcHJvdG9jb2xzW3NjaGVtZV07XG4gICAgdmFyIHdyYXBwZWRQcm90b2NvbCA9IGV4cG9ydHNbc2NoZW1lXSA9IE9iamVjdC5jcmVhdGUobmF0aXZlUHJvdG9jb2wpO1xuXG4gICAgLy8gRXhlY3V0ZXMgYSByZXF1ZXN0LCBmb2xsb3dpbmcgcmVkaXJlY3RzXG4gICAgZnVuY3Rpb24gcmVxdWVzdChpbnB1dCwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgIC8vIFBhcnNlIHBhcmFtZXRlcnNcbiAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFyIHVybFN0ciA9IGlucHV0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlucHV0ID0gdXJsVG9PcHRpb25zKG5ldyBVUkwodXJsU3RyKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgaW5wdXQgPSB1cmwucGFyc2UodXJsU3RyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoVVJMICYmIChpbnB1dCBpbnN0YW5jZW9mIFVSTCkpIHtcbiAgICAgICAgaW5wdXQgPSB1cmxUb09wdGlvbnMoaW5wdXQpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgICAgb3B0aW9ucyA9IGlucHV0O1xuICAgICAgICBpbnB1dCA9IHsgcHJvdG9jb2w6IHByb3RvY29sIH07XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICAgIG9wdGlvbnMgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyBTZXQgZGVmYXVsdHNcbiAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgbWF4UmVkaXJlY3RzOiBleHBvcnRzLm1heFJlZGlyZWN0cyxcbiAgICAgICAgbWF4Qm9keUxlbmd0aDogZXhwb3J0cy5tYXhCb2R5TGVuZ3RoLFxuICAgICAgfSwgaW5wdXQsIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5uYXRpdmVQcm90b2NvbHMgPSBuYXRpdmVQcm90b2NvbHM7XG5cbiAgICAgIGFzc2VydC5lcXVhbChvcHRpb25zLnByb3RvY29sLCBwcm90b2NvbCwgXCJwcm90b2NvbCBtaXNtYXRjaFwiKTtcbiAgICAgIGRlYnVnKFwib3B0aW9uc1wiLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBuZXcgUmVkaXJlY3RhYmxlUmVxdWVzdChvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLy8gRXhlY3V0ZXMgYSBHRVQgcmVxdWVzdCwgZm9sbG93aW5nIHJlZGlyZWN0c1xuICAgIGZ1bmN0aW9uIGdldChpbnB1dCwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgIHZhciB3cmFwcGVkUmVxdWVzdCA9IHdyYXBwZWRQcm90b2NvbC5yZXF1ZXN0KGlucHV0LCBvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgICB3cmFwcGVkUmVxdWVzdC5lbmQoKTtcbiAgICAgIHJldHVybiB3cmFwcGVkUmVxdWVzdDtcbiAgICB9XG5cbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgb24gdGhlIHdyYXBwZWQgcHJvdG9jb2xcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh3cmFwcGVkUHJvdG9jb2wsIHtcbiAgICAgIHJlcXVlc3Q6IHsgdmFsdWU6IHJlcXVlc3QsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSxcbiAgICAgIGdldDogeyB2YWx1ZTogZ2V0LCBjb25maWd1cmFibGU6IHRydWUsIGVudW1lcmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0sXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZXhwb3J0cztcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmZ1bmN0aW9uIG5vb3AoKSB7IC8qIGVtcHR5ICovIH1cblxuLy8gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi9tYXN0ZXIvbGliL2ludGVybmFsL3VybC5qc1xuZnVuY3Rpb24gdXJsVG9PcHRpb25zKHVybE9iamVjdCkge1xuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBwcm90b2NvbDogdXJsT2JqZWN0LnByb3RvY29sLFxuICAgIGhvc3RuYW1lOiB1cmxPYmplY3QuaG9zdG5hbWUuc3RhcnRzV2l0aChcIltcIikgP1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIHVybE9iamVjdC5ob3N0bmFtZS5zbGljZSgxLCAtMSkgOlxuICAgICAgdXJsT2JqZWN0Lmhvc3RuYW1lLFxuICAgIGhhc2g6IHVybE9iamVjdC5oYXNoLFxuICAgIHNlYXJjaDogdXJsT2JqZWN0LnNlYXJjaCxcbiAgICBwYXRobmFtZTogdXJsT2JqZWN0LnBhdGhuYW1lLFxuICAgIHBhdGg6IHVybE9iamVjdC5wYXRobmFtZSArIHVybE9iamVjdC5zZWFyY2gsXG4gICAgaHJlZjogdXJsT2JqZWN0LmhyZWYsXG4gIH07XG4gIGlmICh1cmxPYmplY3QucG9ydCAhPT0gXCJcIikge1xuICAgIG9wdGlvbnMucG9ydCA9IE51bWJlcih1cmxPYmplY3QucG9ydCk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU1hdGNoaW5nSGVhZGVycyhyZWdleCwgaGVhZGVycykge1xuICB2YXIgbGFzdFZhbHVlO1xuICBmb3IgKHZhciBoZWFkZXIgaW4gaGVhZGVycykge1xuICAgIGlmIChyZWdleC50ZXN0KGhlYWRlcikpIHtcbiAgICAgIGxhc3RWYWx1ZSA9IGhlYWRlcnNbaGVhZGVyXTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW2hlYWRlcl07XG4gICAgfVxuICB9XG4gIHJldHVybiBsYXN0VmFsdWU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yVHlwZShjb2RlLCBkZWZhdWx0TWVzc2FnZSkge1xuICBmdW5jdGlvbiBDdXN0b21FcnJvcihtZXNzYWdlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCBkZWZhdWx0TWVzc2FnZTtcbiAgfVxuICBDdXN0b21FcnJvci5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcbiAgQ3VzdG9tRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ3VzdG9tRXJyb3I7XG4gIEN1c3RvbUVycm9yLnByb3RvdHlwZS5uYW1lID0gXCJFcnJvciBbXCIgKyBjb2RlICsgXCJdXCI7XG4gIEN1c3RvbUVycm9yLnByb3RvdHlwZS5jb2RlID0gY29kZTtcbiAgcmV0dXJuIEN1c3RvbUVycm9yO1xufVxuXG5mdW5jdGlvbiBhYm9ydFJlcXVlc3QocmVxdWVzdCkge1xuICBmb3IgKHZhciBlID0gMDsgZSA8IGV2ZW50cy5sZW5ndGg7IGUrKykge1xuICAgIHJlcXVlc3QucmVtb3ZlTGlzdGVuZXIoZXZlbnRzW2VdLCBldmVudEhhbmRsZXJzW2V2ZW50c1tlXV0pO1xuICB9XG4gIHJlcXVlc3Qub24oXCJlcnJvclwiLCBub29wKTtcbiAgcmVxdWVzdC5hYm9ydCgpO1xufVxuXG4vLyBFeHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXAoeyBodHRwOiBodHRwLCBodHRwczogaHR0cHMgfSk7XG5tb2R1bGUuZXhwb3J0cy53cmFwID0gd3JhcDtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBcInZlcnNpb25cIjogXCIwLjIzLjBcIlxufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG52YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmUoJy4uL2NvcmUvYnVpbGRGdWxsUGF0aCcpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcbnZhciBodHRwcyA9IHJlcXVpcmUoJ2h0dHBzJyk7XG52YXIgaHR0cEZvbGxvdyA9IHJlcXVpcmUoJ2ZvbGxvdy1yZWRpcmVjdHMnKS5odHRwO1xudmFyIGh0dHBzRm9sbG93ID0gcmVxdWlyZSgnZm9sbG93LXJlZGlyZWN0cycpLmh0dHBzO1xudmFyIHVybCA9IHJlcXVpcmUoJ3VybCcpO1xudmFyIHpsaWIgPSByZXF1aXJlKCd6bGliJyk7XG52YXIgVkVSU0lPTiA9IHJlcXVpcmUoJy4vLi4vZW52L2RhdGEnKS52ZXJzaW9uO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xudmFyIGVuaGFuY2VFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvZW5oYW5jZUVycm9yJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9DYW5jZWwnKTtcblxudmFyIGlzSHR0cHMgPSAvaHR0cHM6Py87XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7aHR0cC5DbGllbnRSZXF1ZXN0QXJnc30gb3B0aW9uc1xuICogQHBhcmFtIHtBeGlvc1Byb3h5Q29uZmlnfSBwcm94eVxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gKi9cbmZ1bmN0aW9uIHNldFByb3h5KG9wdGlvbnMsIHByb3h5LCBsb2NhdGlvbikge1xuICBvcHRpb25zLmhvc3RuYW1lID0gcHJveHkuaG9zdDtcbiAgb3B0aW9ucy5ob3N0ID0gcHJveHkuaG9zdDtcbiAgb3B0aW9ucy5wb3J0ID0gcHJveHkucG9ydDtcbiAgb3B0aW9ucy5wYXRoID0gbG9jYXRpb247XG5cbiAgLy8gQmFzaWMgcHJveHkgYXV0aG9yaXphdGlvblxuICBpZiAocHJveHkuYXV0aCkge1xuICAgIHZhciBiYXNlNjQgPSBCdWZmZXIuZnJvbShwcm94eS5hdXRoLnVzZXJuYW1lICsgJzonICsgcHJveHkuYXV0aC5wYXNzd29yZCwgJ3V0ZjgnKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgb3B0aW9ucy5oZWFkZXJzWydQcm94eS1BdXRob3JpemF0aW9uJ10gPSAnQmFzaWMgJyArIGJhc2U2NDtcbiAgfVxuXG4gIC8vIElmIGEgcHJveHkgaXMgdXNlZCwgYW55IHJlZGlyZWN0cyBtdXN0IGFsc28gcGFzcyB0aHJvdWdoIHRoZSBwcm94eVxuICBvcHRpb25zLmJlZm9yZVJlZGlyZWN0ID0gZnVuY3Rpb24gYmVmb3JlUmVkaXJlY3QocmVkaXJlY3Rpb24pIHtcbiAgICByZWRpcmVjdGlvbi5oZWFkZXJzLmhvc3QgPSByZWRpcmVjdGlvbi5ob3N0O1xuICAgIHNldFByb3h5KHJlZGlyZWN0aW9uLCBwcm94eSwgcmVkaXJlY3Rpb24uaHJlZik7XG4gIH07XG59XG5cbi8qZXNsaW50IGNvbnNpc3RlbnQtcmV0dXJuOjAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBodHRwQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoSHR0cFJlcXVlc3QocmVzb2x2ZVByb21pc2UsIHJlamVjdFByb21pc2UpIHtcbiAgICB2YXIgb25DYW5jZWxlZDtcbiAgICBmdW5jdGlvbiBkb25lKCkge1xuICAgICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgICBjb25maWcuY2FuY2VsVG9rZW4udW5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcuc2lnbmFsKSB7XG4gICAgICAgIGNvbmZpZy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkNhbmNlbGVkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHJlc29sdmUgPSBmdW5jdGlvbiByZXNvbHZlKHZhbHVlKSB7XG4gICAgICBkb25lKCk7XG4gICAgICByZXNvbHZlUHJvbWlzZSh2YWx1ZSk7XG4gICAgfTtcbiAgICB2YXIgcmVqZWN0ID0gZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7XG4gICAgICBkb25lKCk7XG4gICAgICByZWplY3RQcm9taXNlKHZhbHVlKTtcbiAgICB9O1xuICAgIHZhciBkYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIGhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcbiAgICB2YXIgaGVhZGVyTmFtZXMgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gc3RvcmVMb3dlck5hbWUobmFtZSkge1xuICAgICAgaGVhZGVyTmFtZXNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IG5hbWU7XG4gICAgfSk7XG5cbiAgICAvLyBTZXQgVXNlci1BZ2VudCAocmVxdWlyZWQgYnkgc29tZSBzZXJ2ZXJzKVxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYXhpb3MvYXhpb3MvaXNzdWVzLzY5XG4gICAgaWYgKCd1c2VyLWFnZW50JyBpbiBoZWFkZXJOYW1lcykge1xuICAgICAgLy8gVXNlci1BZ2VudCBpcyBzcGVjaWZpZWQ7IGhhbmRsZSBjYXNlIHdoZXJlIG5vIFVBIGhlYWRlciBpcyBkZXNpcmVkXG4gICAgICBpZiAoIWhlYWRlcnNbaGVhZGVyTmFtZXNbJ3VzZXItYWdlbnQnXV0pIHtcbiAgICAgICAgZGVsZXRlIGhlYWRlcnNbaGVhZGVyTmFtZXNbJ3VzZXItYWdlbnQnXV07XG4gICAgICB9XG4gICAgICAvLyBPdGhlcndpc2UsIHVzZSBzcGVjaWZpZWQgdmFsdWVcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT25seSBzZXQgaGVhZGVyIGlmIGl0IGhhc24ndCBiZWVuIHNldCBpbiBjb25maWdcbiAgICAgIGhlYWRlcnNbJ1VzZXItQWdlbnQnXSA9ICdheGlvcy8nICsgVkVSU0lPTjtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSAmJiAhdXRpbHMuaXNTdHJlYW0oZGF0YSkpIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHtcbiAgICAgICAgLy8gTm90aGluZyB0byBkby4uLlxuICAgICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpKSB7XG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShuZXcgVWludDhBcnJheShkYXRhKSk7XG4gICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzU3RyaW5nKGRhdGEpKSB7XG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShkYXRhLCAndXRmLTgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAgICAgJ0RhdGEgYWZ0ZXIgdHJhbnNmb3JtYXRpb24gbXVzdCBiZSBhIHN0cmluZywgYW4gQXJyYXlCdWZmZXIsIGEgQnVmZmVyLCBvciBhIFN0cmVhbScsXG4gICAgICAgICAgY29uZmlnXG4gICAgICAgICkpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgQ29udGVudC1MZW5ndGggaGVhZGVyIGlmIGRhdGEgZXhpc3RzXG4gICAgICBpZiAoIWhlYWRlck5hbWVzWydjb250ZW50LWxlbmd0aCddKSB7XG4gICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gPSBkYXRhLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgdmFyIGF1dGggPSB1bmRlZmluZWQ7XG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkIHx8ICcnO1xuICAgICAgYXV0aCA9IHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQ7XG4gICAgfVxuXG4gICAgLy8gUGFyc2UgdXJsXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgdmFyIHBhcnNlZCA9IHVybC5wYXJzZShmdWxsUGF0aCk7XG4gICAgdmFyIHByb3RvY29sID0gcGFyc2VkLnByb3RvY29sIHx8ICdodHRwOic7XG5cbiAgICBpZiAoIWF1dGggJiYgcGFyc2VkLmF1dGgpIHtcbiAgICAgIHZhciB1cmxBdXRoID0gcGFyc2VkLmF1dGguc3BsaXQoJzonKTtcbiAgICAgIHZhciB1cmxVc2VybmFtZSA9IHVybEF1dGhbMF0gfHwgJyc7XG4gICAgICB2YXIgdXJsUGFzc3dvcmQgPSB1cmxBdXRoWzFdIHx8ICcnO1xuICAgICAgYXV0aCA9IHVybFVzZXJuYW1lICsgJzonICsgdXJsUGFzc3dvcmQ7XG4gICAgfVxuXG4gICAgaWYgKGF1dGggJiYgaGVhZGVyTmFtZXMuYXV0aG9yaXphdGlvbikge1xuICAgICAgZGVsZXRlIGhlYWRlcnNbaGVhZGVyTmFtZXMuYXV0aG9yaXphdGlvbl07XG4gICAgfVxuXG4gICAgdmFyIGlzSHR0cHNSZXF1ZXN0ID0gaXNIdHRwcy50ZXN0KHByb3RvY29sKTtcbiAgICB2YXIgYWdlbnQgPSBpc0h0dHBzUmVxdWVzdCA/IGNvbmZpZy5odHRwc0FnZW50IDogY29uZmlnLmh0dHBBZ2VudDtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgcGF0aDogYnVpbGRVUkwocGFyc2VkLnBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKS5yZXBsYWNlKC9eXFw/LywgJycpLFxuICAgICAgbWV0aG9kOiBjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgYWdlbnQ6IGFnZW50LFxuICAgICAgYWdlbnRzOiB7IGh0dHA6IGNvbmZpZy5odHRwQWdlbnQsIGh0dHBzOiBjb25maWcuaHR0cHNBZ2VudCB9LFxuICAgICAgYXV0aDogYXV0aFxuICAgIH07XG5cbiAgICBpZiAoY29uZmlnLnNvY2tldFBhdGgpIHtcbiAgICAgIG9wdGlvbnMuc29ja2V0UGF0aCA9IGNvbmZpZy5zb2NrZXRQYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLmhvc3RuYW1lID0gcGFyc2VkLmhvc3RuYW1lO1xuICAgICAgb3B0aW9ucy5wb3J0ID0gcGFyc2VkLnBvcnQ7XG4gICAgfVxuXG4gICAgdmFyIHByb3h5ID0gY29uZmlnLnByb3h5O1xuICAgIGlmICghcHJveHkgJiYgcHJveHkgIT09IGZhbHNlKSB7XG4gICAgICB2YXIgcHJveHlFbnYgPSBwcm90b2NvbC5zbGljZSgwLCAtMSkgKyAnX3Byb3h5JztcbiAgICAgIHZhciBwcm94eVVybCA9IHByb2Nlc3MuZW52W3Byb3h5RW52XSB8fCBwcm9jZXNzLmVudltwcm94eUVudi50b1VwcGVyQ2FzZSgpXTtcbiAgICAgIGlmIChwcm94eVVybCkge1xuICAgICAgICB2YXIgcGFyc2VkUHJveHlVcmwgPSB1cmwucGFyc2UocHJveHlVcmwpO1xuICAgICAgICB2YXIgbm9Qcm94eUVudiA9IHByb2Nlc3MuZW52Lm5vX3Byb3h5IHx8IHByb2Nlc3MuZW52Lk5PX1BST1hZO1xuICAgICAgICB2YXIgc2hvdWxkUHJveHkgPSB0cnVlO1xuXG4gICAgICAgIGlmIChub1Byb3h5RW52KSB7XG4gICAgICAgICAgdmFyIG5vUHJveHkgPSBub1Byb3h5RW52LnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uIHRyaW0ocykge1xuICAgICAgICAgICAgcmV0dXJuIHMudHJpbSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgc2hvdWxkUHJveHkgPSAhbm9Qcm94eS5zb21lKGZ1bmN0aW9uIHByb3h5TWF0Y2gocHJveHlFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoIXByb3h5RWxlbWVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJveHlFbGVtZW50ID09PSAnKicpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJveHlFbGVtZW50WzBdID09PSAnLicgJiZcbiAgICAgICAgICAgICAgICBwYXJzZWQuaG9zdG5hbWUuc3Vic3RyKHBhcnNlZC5ob3N0bmFtZS5sZW5ndGggLSBwcm94eUVsZW1lbnQubGVuZ3RoKSA9PT0gcHJveHlFbGVtZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VkLmhvc3RuYW1lID09PSBwcm94eUVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvdWxkUHJveHkpIHtcbiAgICAgICAgICBwcm94eSA9IHtcbiAgICAgICAgICAgIGhvc3Q6IHBhcnNlZFByb3h5VXJsLmhvc3RuYW1lLFxuICAgICAgICAgICAgcG9ydDogcGFyc2VkUHJveHlVcmwucG9ydCxcbiAgICAgICAgICAgIHByb3RvY29sOiBwYXJzZWRQcm94eVVybC5wcm90b2NvbFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAocGFyc2VkUHJveHlVcmwuYXV0aCkge1xuICAgICAgICAgICAgdmFyIHByb3h5VXJsQXV0aCA9IHBhcnNlZFByb3h5VXJsLmF1dGguc3BsaXQoJzonKTtcbiAgICAgICAgICAgIHByb3h5LmF1dGggPSB7XG4gICAgICAgICAgICAgIHVzZXJuYW1lOiBwcm94eVVybEF1dGhbMF0sXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBwcm94eVVybEF1dGhbMV1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3h5KSB7XG4gICAgICBvcHRpb25zLmhlYWRlcnMuaG9zdCA9IHBhcnNlZC5ob3N0bmFtZSArIChwYXJzZWQucG9ydCA/ICc6JyArIHBhcnNlZC5wb3J0IDogJycpO1xuICAgICAgc2V0UHJveHkob3B0aW9ucywgcHJveHksIHByb3RvY29sICsgJy8vJyArIHBhcnNlZC5ob3N0bmFtZSArIChwYXJzZWQucG9ydCA/ICc6JyArIHBhcnNlZC5wb3J0IDogJycpICsgb3B0aW9ucy5wYXRoKTtcbiAgICB9XG5cbiAgICB2YXIgdHJhbnNwb3J0O1xuICAgIHZhciBpc0h0dHBzUHJveHkgPSBpc0h0dHBzUmVxdWVzdCAmJiAocHJveHkgPyBpc0h0dHBzLnRlc3QocHJveHkucHJvdG9jb2wpIDogdHJ1ZSk7XG4gICAgaWYgKGNvbmZpZy50cmFuc3BvcnQpIHtcbiAgICAgIHRyYW5zcG9ydCA9IGNvbmZpZy50cmFuc3BvcnQ7XG4gICAgfSBlbHNlIGlmIChjb25maWcubWF4UmVkaXJlY3RzID09PSAwKSB7XG4gICAgICB0cmFuc3BvcnQgPSBpc0h0dHBzUHJveHkgPyBodHRwcyA6IGh0dHA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb25maWcubWF4UmVkaXJlY3RzKSB7XG4gICAgICAgIG9wdGlvbnMubWF4UmVkaXJlY3RzID0gY29uZmlnLm1heFJlZGlyZWN0cztcbiAgICAgIH1cbiAgICAgIHRyYW5zcG9ydCA9IGlzSHR0cHNQcm94eSA/IGh0dHBzRm9sbG93IDogaHR0cEZvbGxvdztcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLm1heEJvZHlMZW5ndGggPiAtMSkge1xuICAgICAgb3B0aW9ucy5tYXhCb2R5TGVuZ3RoID0gY29uZmlnLm1heEJvZHlMZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5pbnNlY3VyZUhUVFBQYXJzZXIpIHtcbiAgICAgIG9wdGlvbnMuaW5zZWN1cmVIVFRQUGFyc2VyID0gY29uZmlnLmluc2VjdXJlSFRUUFBhcnNlcjtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIHJlcXVlc3RcbiAgICB2YXIgcmVxID0gdHJhbnNwb3J0LnJlcXVlc3Qob3B0aW9ucywgZnVuY3Rpb24gaGFuZGxlUmVzcG9uc2UocmVzKSB7XG4gICAgICBpZiAocmVxLmFib3J0ZWQpIHJldHVybjtcblxuICAgICAgLy8gdW5jb21wcmVzcyB0aGUgcmVzcG9uc2UgYm9keSB0cmFuc3BhcmVudGx5IGlmIHJlcXVpcmVkXG4gICAgICB2YXIgc3RyZWFtID0gcmVzO1xuXG4gICAgICAvLyByZXR1cm4gdGhlIGxhc3QgcmVxdWVzdCBpbiBjYXNlIG9mIHJlZGlyZWN0c1xuICAgICAgdmFyIGxhc3RSZXF1ZXN0ID0gcmVzLnJlcSB8fCByZXE7XG5cblxuICAgICAgLy8gaWYgbm8gY29udGVudCwgaXMgSEVBRCByZXF1ZXN0IG9yIGRlY29tcHJlc3MgZGlzYWJsZWQgd2Ugc2hvdWxkIG5vdCBkZWNvbXByZXNzXG4gICAgICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwNCAmJiBsYXN0UmVxdWVzdC5tZXRob2QgIT09ICdIRUFEJyAmJiBjb25maWcuZGVjb21wcmVzcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgc3dpdGNoIChyZXMuaGVhZGVyc1snY29udGVudC1lbmNvZGluZyddKSB7XG4gICAgICAgIC8qZXNsaW50IGRlZmF1bHQtY2FzZTowKi9cbiAgICAgICAgY2FzZSAnZ3ppcCc6XG4gICAgICAgIGNhc2UgJ2NvbXByZXNzJzpcbiAgICAgICAgY2FzZSAnZGVmbGF0ZSc6XG4gICAgICAgIC8vIGFkZCB0aGUgdW56aXBwZXIgdG8gdGhlIGJvZHkgc3RyZWFtIHByb2Nlc3NpbmcgcGlwZWxpbmVcbiAgICAgICAgICBzdHJlYW0gPSBzdHJlYW0ucGlwZSh6bGliLmNyZWF0ZVVuemlwKCkpO1xuXG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSBjb250ZW50LWVuY29kaW5nIGluIG9yZGVyIHRvIG5vdCBjb25mdXNlIGRvd25zdHJlYW0gb3BlcmF0aW9uc1xuICAgICAgICAgIGRlbGV0ZSByZXMuaGVhZGVyc1snY29udGVudC1lbmNvZGluZyddO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgc3RhdHVzOiByZXMuc3RhdHVzQ29kZSxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVzLnN0YXR1c01lc3NhZ2UsXG4gICAgICAgIGhlYWRlcnM6IHJlcy5oZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogbGFzdFJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlID09PSAnc3RyZWFtJykge1xuICAgICAgICByZXNwb25zZS5kYXRhID0gc3RyZWFtO1xuICAgICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzcG9uc2VCdWZmZXIgPSBbXTtcbiAgICAgICAgdmFyIHRvdGFsUmVzcG9uc2VCeXRlcyA9IDA7XG4gICAgICAgIHN0cmVhbS5vbignZGF0YScsIGZ1bmN0aW9uIGhhbmRsZVN0cmVhbURhdGEoY2h1bmspIHtcbiAgICAgICAgICByZXNwb25zZUJ1ZmZlci5wdXNoKGNodW5rKTtcbiAgICAgICAgICB0b3RhbFJlc3BvbnNlQnl0ZXMgKz0gY2h1bmsubGVuZ3RoO1xuXG4gICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBjb250ZW50IGxlbmd0aCBpcyBub3Qgb3ZlciB0aGUgbWF4Q29udGVudExlbmd0aCBpZiBzcGVjaWZpZWRcbiAgICAgICAgICBpZiAoY29uZmlnLm1heENvbnRlbnRMZW5ndGggPiAtMSAmJiB0b3RhbFJlc3BvbnNlQnl0ZXMgPiBjb25maWcubWF4Q29udGVudExlbmd0aCkge1xuICAgICAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHJlamVjdChjcmVhdGVFcnJvcignbWF4Q29udGVudExlbmd0aCBzaXplIG9mICcgKyBjb25maWcubWF4Q29udGVudExlbmd0aCArICcgZXhjZWVkZWQnLFxuICAgICAgICAgICAgICBjb25maWcsIG51bGwsIGxhc3RSZXF1ZXN0KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzdHJlYW0ub24oJ2Vycm9yJywgZnVuY3Rpb24gaGFuZGxlU3RyZWFtRXJyb3IoZXJyKSB7XG4gICAgICAgICAgaWYgKHJlcS5hYm9ydGVkKSByZXR1cm47XG4gICAgICAgICAgcmVqZWN0KGVuaGFuY2VFcnJvcihlcnIsIGNvbmZpZywgbnVsbCwgbGFzdFJlcXVlc3QpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbiBoYW5kbGVTdHJlYW1FbmQoKSB7XG4gICAgICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9IEJ1ZmZlci5jb25jYXQocmVzcG9uc2VCdWZmZXIpO1xuICAgICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnYXJyYXlidWZmZXInKSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSByZXNwb25zZURhdGEudG9TdHJpbmcoY29uZmlnLnJlc3BvbnNlRW5jb2RpbmcpO1xuICAgICAgICAgICAgaWYgKCFjb25maWcucmVzcG9uc2VFbmNvZGluZyB8fCBjb25maWcucmVzcG9uc2VFbmNvZGluZyA9PT0gJ3V0ZjgnKSB7XG4gICAgICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHV0aWxzLnN0cmlwQk9NKHJlc3BvbnNlRGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzcG9uc2UuZGF0YSA9IHJlc3BvbnNlRGF0YTtcbiAgICAgICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gSGFuZGxlIGVycm9yc1xuICAgIHJlcS5vbignZXJyb3InLCBmdW5jdGlvbiBoYW5kbGVSZXF1ZXN0RXJyb3IoZXJyKSB7XG4gICAgICBpZiAocmVxLmFib3J0ZWQgJiYgZXJyLmNvZGUgIT09ICdFUlJfRlJfVE9PX01BTllfUkVESVJFQ1RTJykgcmV0dXJuO1xuICAgICAgcmVqZWN0KGVuaGFuY2VFcnJvcihlcnIsIGNvbmZpZywgbnVsbCwgcmVxKSk7XG4gICAgfSk7XG5cbiAgICAvLyBIYW5kbGUgcmVxdWVzdCB0aW1lb3V0XG4gICAgaWYgKGNvbmZpZy50aW1lb3V0KSB7XG4gICAgICAvLyBUaGlzIGlzIGZvcmNpbmcgYSBpbnQgdGltZW91dCB0byBhdm9pZCBwcm9ibGVtcyBpZiB0aGUgYHJlcWAgaW50ZXJmYWNlIGRvZXNuJ3QgaGFuZGxlIG90aGVyIHR5cGVzLlxuICAgICAgdmFyIHRpbWVvdXQgPSBwYXJzZUludChjb25maWcudGltZW91dCwgMTApO1xuXG4gICAgICBpZiAoaXNOYU4odGltZW91dCkpIHtcbiAgICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgICAgICdlcnJvciB0cnlpbmcgdG8gcGFyc2UgYGNvbmZpZy50aW1lb3V0YCB0byBpbnQnLFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAnRVJSX1BBUlNFX1RJTUVPVVQnLFxuICAgICAgICAgIHJlcVxuICAgICAgICApKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFNvbWV0aW1lLCB0aGUgcmVzcG9uc2Ugd2lsbCBiZSB2ZXJ5IHNsb3csIGFuZCBkb2VzIG5vdCByZXNwb25kLCB0aGUgY29ubmVjdCBldmVudCB3aWxsIGJlIGJsb2NrIGJ5IGV2ZW50IGxvb3Agc3lzdGVtLlxuICAgICAgLy8gQW5kIHRpbWVyIGNhbGxiYWNrIHdpbGwgYmUgZmlyZWQsIGFuZCBhYm9ydCgpIHdpbGwgYmUgaW52b2tlZCBiZWZvcmUgY29ubmVjdGlvbiwgdGhlbiBnZXQgXCJzb2NrZXQgaGFuZyB1cFwiIGFuZCBjb2RlIEVDT05OUkVTRVQuXG4gICAgICAvLyBBdCB0aGlzIHRpbWUsIGlmIHdlIGhhdmUgYSBsYXJnZSBudW1iZXIgb2YgcmVxdWVzdCwgbm9kZWpzIHdpbGwgaGFuZyB1cCBzb21lIHNvY2tldCBvbiBiYWNrZ3JvdW5kLiBhbmQgdGhlIG51bWJlciB3aWxsIHVwIGFuZCB1cC5cbiAgICAgIC8vIEFuZCB0aGVuIHRoZXNlIHNvY2tldCB3aGljaCBiZSBoYW5nIHVwIHdpbGwgZGV2b3JpbmcgQ1BVIGxpdHRsZSBieSBsaXR0bGUuXG4gICAgICAvLyBDbGllbnRSZXF1ZXN0LnNldFRpbWVvdXQgd2lsbCBiZSBmaXJlZCBvbiB0aGUgc3BlY2lmeSBtaWxsaXNlY29uZHMsIGFuZCBjYW4gbWFrZSBzdXJlIHRoYXQgYWJvcnQoKSB3aWxsIGJlIGZpcmVkIGFmdGVyIGNvbm5lY3QuXG4gICAgICByZXEuc2V0VGltZW91dCh0aW1lb3V0LCBmdW5jdGlvbiBoYW5kbGVSZXF1ZXN0VGltZW91dCgpIHtcbiAgICAgICAgcmVxLmFib3J0KCk7XG4gICAgICAgIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsIHx8IGRlZmF1bHRzLnRyYW5zaXRpb25hbDtcbiAgICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgICAgICd0aW1lb3V0IG9mICcgKyB0aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyxcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgdHJhbnNpdGlvbmFsLmNsYXJpZnlUaW1lb3V0RXJyb3IgPyAnRVRJTUVET1VUJyA6ICdFQ09OTkFCT1JURUQnLFxuICAgICAgICAgIHJlcVxuICAgICAgICApKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4gfHwgY29uZmlnLnNpZ25hbCkge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICAgIG9uQ2FuY2VsZWQgPSBmdW5jdGlvbihjYW5jZWwpIHtcbiAgICAgICAgaWYgKHJlcS5hYm9ydGVkKSByZXR1cm47XG5cbiAgICAgICAgcmVxLmFib3J0KCk7XG4gICAgICAgIHJlamVjdCghY2FuY2VsIHx8IChjYW5jZWwgJiYgY2FuY2VsLnR5cGUpID8gbmV3IENhbmNlbCgnY2FuY2VsZWQnKSA6IGNhbmNlbCk7XG4gICAgICB9O1xuXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4gJiYgY29uZmlnLmNhbmNlbFRva2VuLnN1YnNjcmliZShvbkNhbmNlbGVkKTtcbiAgICAgIGlmIChjb25maWcuc2lnbmFsKSB7XG4gICAgICAgIGNvbmZpZy5zaWduYWwuYWJvcnRlZCA/IG9uQ2FuY2VsZWQoKSA6IGNvbmZpZy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkNhbmNlbGVkKTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICBpZiAodXRpbHMuaXNTdHJlYW0oZGF0YSkpIHtcbiAgICAgIGRhdGEub24oJ2Vycm9yJywgZnVuY3Rpb24gaGFuZGxlU3RyZWFtRXJyb3IoZXJyKSB7XG4gICAgICAgIHJlamVjdChlbmhhbmNlRXJyb3IoZXJyLCBjb25maWcsIG51bGwsIHJlcSkpO1xuICAgICAgfSkucGlwZShyZXEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXEuZW5kKGRhdGEpO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9jb3JlL2VuaGFuY2VFcnJvcicpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVNhZmVseShyYXdWYWx1ZSwgcGFyc2VyLCBlbmNvZGVyKSB7XG4gIGlmICh1dGlscy5pc1N0cmluZyhyYXdWYWx1ZSkpIHtcbiAgICB0cnkge1xuICAgICAgKHBhcnNlciB8fCBKU09OLnBhcnNlKShyYXdWYWx1ZSk7XG4gICAgICByZXR1cm4gdXRpbHMudHJpbShyYXdWYWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUubmFtZSAhPT0gJ1N5bnRheEVycm9yJykge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoZW5jb2RlciB8fCBKU09OLnN0cmluZ2lmeSkocmF3VmFsdWUpO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG5cbiAgdHJhbnNpdGlvbmFsOiB7XG4gICAgc2lsZW50SlNPTlBhcnNpbmc6IHRydWUsXG4gICAgZm9yY2VkSlNPTlBhcnNpbmc6IHRydWUsXG4gICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogZmFsc2VcbiAgfSxcblxuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdBY2NlcHQnKTtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpIHx8IChoZWFkZXJzICYmIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID09PSAnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTYWZlbHkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICB2YXIgdHJhbnNpdGlvbmFsID0gdGhpcy50cmFuc2l0aW9uYWwgfHwgZGVmYXVsdHMudHJhbnNpdGlvbmFsO1xuICAgIHZhciBzaWxlbnRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuc2lsZW50SlNPTlBhcnNpbmc7XG4gICAgdmFyIGZvcmNlZEpTT05QYXJzaW5nID0gdHJhbnNpdGlvbmFsICYmIHRyYW5zaXRpb25hbC5mb3JjZWRKU09OUGFyc2luZztcbiAgICB2YXIgc3RyaWN0SlNPTlBhcnNpbmcgPSAhc2lsZW50SlNPTlBhcnNpbmcgJiYgdGhpcy5yZXNwb25zZVR5cGUgPT09ICdqc29uJztcblxuICAgIGlmIChzdHJpY3RKU09OUGFyc2luZyB8fCAoZm9yY2VkSlNPTlBhcnNpbmcgJiYgdXRpbHMuaXNTdHJpbmcoZGF0YSkgJiYgZGF0YS5sZW5ndGgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHN0cmljdEpTT05QYXJzaW5nKSB7XG4gICAgICAgICAgaWYgKGUubmFtZSA9PT0gJ1N5bnRheEVycm9yJykge1xuICAgICAgICAgICAgdGhyb3cgZW5oYW5jZUVycm9yKGUsIHRoaXMsICdFX0pTT05fUEFSU0UnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgbWF4Qm9keUxlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfSxcblxuICBoZWFkZXJzOiB7XG4gICAgY29tbW9uOiB7XG4gICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgICB9XG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vLi4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIHZhciBjb250ZXh0ID0gdGhpcyB8fCBkZWZhdWx0cztcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4uY2FsbChjb250ZXh0LCBkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL0NhbmNlbCcpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG5cbiAgaWYgKGNvbmZpZy5zaWduYWwgJiYgY29uZmlnLnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgdGhyb3cgbmV3IENhbmNlbCgnY2FuY2VsZWQnKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgY29uZmlnLFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzXG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICBjb25maWcsXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGlyZWN0S2V5cyhwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICB2YXIgbWVyZ2VNYXAgPSB7XG4gICAgJ3VybCc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ21ldGhvZCc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ2RhdGEnOiB2YWx1ZUZyb21Db25maWcyLFxuICAgICdiYXNlVVJMJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndHJhbnNmb3JtUmVxdWVzdCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RyYW5zZm9ybVJlc3BvbnNlJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAncGFyYW1zU2VyaWFsaXplcic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RpbWVvdXQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd0aW1lb3V0TWVzc2FnZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3dpdGhDcmVkZW50aWFscyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2FkYXB0ZXInOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdyZXNwb25zZVR5cGUnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd4c3JmQ29va2llTmFtZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnb25VcGxvYWRQcm9ncmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ29uRG93bmxvYWRQcm9ncmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2RlY29tcHJlc3MnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnbWF4Qm9keUxlbmd0aCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RyYW5zcG9ydCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2h0dHBBZ2VudCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2h0dHBzQWdlbnQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdjYW5jZWxUb2tlbic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3NvY2tldFBhdGgnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdyZXNwb25zZUVuY29kaW5nJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndmFsaWRhdGVTdGF0dXMnOiBtZXJnZURpcmVjdEtleXNcbiAgfTtcblxuICB1dGlscy5mb3JFYWNoKE9iamVjdC5rZXlzKGNvbmZpZzEpLmNvbmNhdChPYmplY3Qua2V5cyhjb25maWcyKSksIGZ1bmN0aW9uIGNvbXB1dGVDb25maWdWYWx1ZShwcm9wKSB7XG4gICAgdmFyIG1lcmdlID0gbWVyZ2VNYXBbcHJvcF0gfHwgbWVyZ2VEZWVwUHJvcGVydGllcztcbiAgICB2YXIgY29uZmlnVmFsdWUgPSBtZXJnZShwcm9wKTtcbiAgICAodXRpbHMuaXNVbmRlZmluZWQoY29uZmlnVmFsdWUpICYmIG1lcmdlICE9PSBtZXJnZURpcmVjdEtleXMpIHx8IChjb25maWdbcHJvcF0gPSBjb25maWdWYWx1ZSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb25maWc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL2Vudi9kYXRhJykudmVyc2lvbjtcblxudmFyIHZhbGlkYXRvcnMgPSB7fTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcblsnb2JqZWN0JywgJ2Jvb2xlYW4nLCAnbnVtYmVyJywgJ2Z1bmN0aW9uJywgJ3N0cmluZycsICdzeW1ib2wnXS5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUsIGkpIHtcbiAgdmFsaWRhdG9yc1t0eXBlXSA9IGZ1bmN0aW9uIHZhbGlkYXRvcih0aGluZykge1xuICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09IHR5cGUgfHwgJ2EnICsgKGkgPCAxID8gJ24gJyA6ICcgJykgKyB0eXBlO1xuICB9O1xufSk7XG5cbnZhciBkZXByZWNhdGVkV2FybmluZ3MgPSB7fTtcblxuLyoqXG4gKiBUcmFuc2l0aW9uYWwgb3B0aW9uIHZhbGlkYXRvclxuICogQHBhcmFtIHtmdW5jdGlvbnxib29sZWFuP30gdmFsaWRhdG9yIC0gc2V0IHRvIGZhbHNlIGlmIHRoZSB0cmFuc2l0aW9uYWwgb3B0aW9uIGhhcyBiZWVuIHJlbW92ZWRcbiAqIEBwYXJhbSB7c3RyaW5nP30gdmVyc2lvbiAtIGRlcHJlY2F0ZWQgdmVyc2lvbiAvIHJlbW92ZWQgc2luY2UgdmVyc2lvblxuICogQHBhcmFtIHtzdHJpbmc/fSBtZXNzYWdlIC0gc29tZSBtZXNzYWdlIHdpdGggYWRkaXRpb25hbCBpbmZvXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKi9cbnZhbGlkYXRvcnMudHJhbnNpdGlvbmFsID0gZnVuY3Rpb24gdHJhbnNpdGlvbmFsKHZhbGlkYXRvciwgdmVyc2lvbiwgbWVzc2FnZSkge1xuICBmdW5jdGlvbiBmb3JtYXRNZXNzYWdlKG9wdCwgZGVzYykge1xuICAgIHJldHVybiAnW0F4aW9zIHYnICsgVkVSU0lPTiArICddIFRyYW5zaXRpb25hbCBvcHRpb24gXFwnJyArIG9wdCArICdcXCcnICsgZGVzYyArIChtZXNzYWdlID8gJy4gJyArIG1lc3NhZ2UgOiAnJyk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG9wdCwgb3B0cykge1xuICAgIGlmICh2YWxpZGF0b3IgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZm9ybWF0TWVzc2FnZShvcHQsICcgaGFzIGJlZW4gcmVtb3ZlZCcgKyAodmVyc2lvbiA/ICcgaW4gJyArIHZlcnNpb24gOiAnJykpKTtcbiAgICB9XG5cbiAgICBpZiAodmVyc2lvbiAmJiAhZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0pIHtcbiAgICAgIGRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdID0gdHJ1ZTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGZvcm1hdE1lc3NhZ2UoXG4gICAgICAgICAgb3B0LFxuICAgICAgICAgICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBzaW5jZSB2JyArIHZlcnNpb24gKyAnIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5lYXIgZnV0dXJlJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0b3IgPyB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0cykgOiB0cnVlO1xuICB9O1xufTtcblxuLyoqXG4gKiBBc3NlcnQgb2JqZWN0J3MgcHJvcGVydGllcyB0eXBlXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYVxuICogQHBhcmFtIHtib29sZWFuP30gYWxsb3dVbmtub3duXG4gKi9cblxuZnVuY3Rpb24gYXNzZXJ0T3B0aW9ucyhvcHRpb25zLCBzY2hlbWEsIGFsbG93VW5rbm93bikge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICB9XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgdmFyIG9wdCA9IGtleXNbaV07XG4gICAgdmFyIHZhbGlkYXRvciA9IHNjaGVtYVtvcHRdO1xuICAgIGlmICh2YWxpZGF0b3IpIHtcbiAgICAgIHZhciB2YWx1ZSA9IG9wdGlvbnNbb3B0XTtcbiAgICAgIHZhciByZXN1bHQgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRpb25zKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uICcgKyBvcHQgKyAnIG11c3QgYmUgJyArIHJlc3VsdCk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGFsbG93VW5rbm93biAhPT0gdHJ1ZSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1Vua25vd24gb3B0aW9uICcgKyBvcHQpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXNzZXJ0T3B0aW9uczogYXNzZXJ0T3B0aW9ucyxcbiAgdmFsaWRhdG9yczogdmFsaWRhdG9yc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vbWVyZ2VDb25maWcnKTtcbnZhciB2YWxpZGF0b3IgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3ZhbGlkYXRvcicpO1xuXG52YXIgdmFsaWRhdG9ycyA9IHZhbGlkYXRvci52YWxpZGF0b3JzO1xuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcbiAgICBjb25maWcudXJsID0gYXJndW1lbnRzWzBdO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgLy8gU2V0IGNvbmZpZy5tZXRob2RcbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9XG5cbiAgdmFyIHRyYW5zaXRpb25hbCA9IGNvbmZpZy50cmFuc2l0aW9uYWw7XG5cbiAgaWYgKHRyYW5zaXRpb25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnModHJhbnNpdGlvbmFsLCB7XG4gICAgICBzaWxlbnRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgIGZvcmNlZEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKVxuICAgIH0sIGZhbHNlKTtcbiAgfVxuXG4gIC8vIGZpbHRlciBvdXQgc2tpcHBlZCBpbnRlcmNlcHRvcnNcbiAgdmFyIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluID0gW107XG4gIHZhciBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSB0cnVlO1xuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBpZiAodHlwZW9mIGludGVyY2VwdG9yLnJ1bldoZW4gPT09ICdmdW5jdGlvbicgJiYgaW50ZXJjZXB0b3IucnVuV2hlbihjb25maWcpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyA9IHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyAmJiBpbnRlcmNlcHRvci5zeW5jaHJvbm91cztcblxuICAgIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHZhciByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHByb21pc2U7XG5cbiAgaWYgKCFzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMpIHtcbiAgICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuXG4gICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoY2hhaW4sIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluKTtcbiAgICBjaGFpbiA9IGNoYWluLmNvbmNhdChyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4pO1xuXG4gICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuICAgIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuXG4gIHZhciBuZXdDb25maWcgPSBjb25maWc7XG4gIHdoaWxlIChyZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICB2YXIgb25GdWxmaWxsZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpO1xuICAgIHZhciBvblJlamVjdGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKTtcbiAgICB0cnkge1xuICAgICAgbmV3Q29uZmlnID0gb25GdWxmaWxsZWQobmV3Q29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgb25SZWplY3RlZChlcnJvcik7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIHByb21pc2UgPSBkaXNwYXRjaFJlcXVlc3QobmV3Q29uZmlnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICB9XG5cbiAgd2hpbGUgKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuXG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHRoaXMucHJvbWlzZS50aGVuKGZ1bmN0aW9uKGNhbmNlbCkge1xuICAgIGlmICghdG9rZW4uX2xpc3RlbmVycykgcmV0dXJuO1xuXG4gICAgdmFyIGk7XG4gICAgdmFyIGwgPSB0b2tlbi5fbGlzdGVuZXJzLmxlbmd0aDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRva2VuLl9saXN0ZW5lcnNbaV0oY2FuY2VsKTtcbiAgICB9XG4gICAgdG9rZW4uX2xpc3RlbmVycyA9IG51bGw7XG4gIH0pO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHRoaXMucHJvbWlzZS50aGVuID0gZnVuY3Rpb24ob25mdWxmaWxsZWQpIHtcbiAgICB2YXIgX3Jlc29sdmU7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgIHRva2VuLnN1YnNjcmliZShyZXNvbHZlKTtcbiAgICAgIF9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB9KS50aGVuKG9uZnVsZmlsbGVkKTtcblxuICAgIHByb21pc2UuY2FuY2VsID0gZnVuY3Rpb24gcmVqZWN0KCkge1xuICAgICAgdG9rZW4udW5zdWJzY3JpYmUoX3Jlc29sdmUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfTtcblxuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBTdWJzY3JpYmUgdG8gdGhlIGNhbmNlbCBzaWduYWxcbiAqL1xuXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIGxpc3RlbmVyKHRoaXMucmVhc29uKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbi8qKlxuICogVW5zdWJzY3JpYmUgZnJvbSB0aGUgY2FuY2VsIHNpZ25hbFxuICovXG5cbkNhbmNlbFRva2VuLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uIHVuc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gIGlmICghdGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gKHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0JykgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBBeGlvcyA9IHJlcXVpcmUoJy4vY29yZS9BeGlvcycpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9jb3JlL21lcmdlQ29uZmlnJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuICBpbnN0YW5jZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoZGVmYXVsdENvbmZpZywgaW5zdGFuY2VDb25maWcpKTtcbiAgfTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuYXhpb3MuQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsJyk7XG5heGlvcy5DYW5jZWxUb2tlbiA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbFRva2VuJyk7XG5heGlvcy5pc0NhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL2lzQ2FuY2VsJyk7XG5heGlvcy5WRVJTSU9OID0gcmVxdWlyZSgnLi9lbnYvZGF0YScpLnZlcnNpb247XG5cbi8vIEV4cG9zZSBhbGwvc3ByZWFkXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5heGlvcy5zcHJlYWQgPSByZXF1aXJlKCcuL2hlbHBlcnMvc3ByZWFkJyk7XG5cbi8vIEV4cG9zZSBpc0F4aW9zRXJyb3JcbmF4aW9zLmlzQXhpb3NFcnJvciA9IHJlcXVpcmUoJy4vaGVscGVycy9pc0F4aW9zRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJ3V0aWxzL2NvbmZpZyc7XG5cbnR5cGUgT1BUSU9OUyA9IHtcbiAgYmFzZVVSTD86IHN0cmluZztcbiAgaXNCbG9iPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBjb25zdCBheGlvc0luc3RhbmNlID0gKG9wdGlvbnM6IE9QVElPTlMgPSB7fSkgPT4ge1xuICBjb25zdCB7IGJhc2VVUkwsIGlzQmxvYiB9ID0gb3B0aW9ucztcbiAgcmV0dXJuIGF4aW9zLmNyZWF0ZSh7XG4gICAgYmFzZVVSTDogYmFzZVVSTCB8fCBjb25maWcuQkFTRV9VUkwsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9LFxuICAgIHRpbWVvdXQ6IDEwMDAgKiAzMCxcbiAgICByZXNwb25zZVR5cGU6IGlzQmxvYiA/ICdibG9iJyA6ICdqc29uJyxcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBheGlvc0luc3RhbmNlO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVxdWlyZWRBcmdzKHJlcXVpcmVkLCBhcmdzKSB7XG4gIGlmIChhcmdzLmxlbmd0aCA8IHJlcXVpcmVkKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihyZXF1aXJlZCArICcgYXJndW1lbnQnICsgKHJlcXVpcmVkID4gMSA/ICdzJyA6ICcnKSArICcgcmVxdWlyZWQsIGJ1dCBvbmx5ICcgKyBhcmdzLmxlbmd0aCArICcgcHJlc2VudCcpO1xuICB9XG59IiwiaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vX2xpYi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbi8qKlxuICogQG5hbWUgdG9EYXRlXG4gKiBAY2F0ZWdvcnkgQ29tbW9uIEhlbHBlcnNcbiAqIEBzdW1tYXJ5IENvbnZlcnQgdGhlIGdpdmVuIGFyZ3VtZW50IHRvIGFuIGluc3RhbmNlIG9mIERhdGUuXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDb252ZXJ0IHRoZSBnaXZlbiBhcmd1bWVudCB0byBhbiBpbnN0YW5jZSBvZiBEYXRlLlxuICpcbiAqIElmIHRoZSBhcmd1bWVudCBpcyBhbiBpbnN0YW5jZSBvZiBEYXRlLCB0aGUgZnVuY3Rpb24gcmV0dXJucyBpdHMgY2xvbmUuXG4gKlxuICogSWYgdGhlIGFyZ3VtZW50IGlzIGEgbnVtYmVyLCBpdCBpcyB0cmVhdGVkIGFzIGEgdGltZXN0YW1wLlxuICpcbiAqIElmIHRoZSBhcmd1bWVudCBpcyBub25lIG9mIHRoZSBhYm92ZSwgdGhlIGZ1bmN0aW9uIHJldHVybnMgSW52YWxpZCBEYXRlLlxuICpcbiAqICoqTm90ZSoqOiAqYWxsKiBEYXRlIGFyZ3VtZW50cyBwYXNzZWQgdG8gYW55ICpkYXRlLWZucyogZnVuY3Rpb24gaXMgcHJvY2Vzc2VkIGJ5IGB0b0RhdGVgLlxuICpcbiAqIEBwYXJhbSB7RGF0ZXxOdW1iZXJ9IGFyZ3VtZW50IC0gdGhlIHZhbHVlIHRvIGNvbnZlcnRcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgcGFyc2VkIGRhdGUgaW4gdGhlIGxvY2FsIHRpbWUgem9uZVxuICogQHRocm93cyB7VHlwZUVycm9yfSAxIGFyZ3VtZW50IHJlcXVpcmVkXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIENsb25lIHRoZSBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gdG9EYXRlKG5ldyBEYXRlKDIwMTQsIDEsIDExLCAxMSwgMzAsIDMwKSlcbiAqIC8vPT4gVHVlIEZlYiAxMSAyMDE0IDExOjMwOjMwXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIENvbnZlcnQgdGhlIHRpbWVzdGFtcCB0byBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gdG9EYXRlKDEzOTIwOTg0MzAwMDApXG4gKiAvLz0+IFR1ZSBGZWIgMTEgMjAxNCAxMTozMDozMFxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvRGF0ZShhcmd1bWVudCkge1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIGFyZ1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmd1bWVudCk7IC8vIENsb25lIHRoZSBkYXRlXG5cbiAgaWYgKGFyZ3VtZW50IGluc3RhbmNlb2YgRGF0ZSB8fCB0eXBlb2YgYXJndW1lbnQgPT09ICdvYmplY3QnICYmIGFyZ1N0ciA9PT0gJ1tvYmplY3QgRGF0ZV0nKSB7XG4gICAgLy8gUHJldmVudCB0aGUgZGF0ZSB0byBsb3NlIHRoZSBtaWxsaXNlY29uZHMgd2hlbiBwYXNzZWQgdG8gbmV3IERhdGUoKSBpbiBJRTEwXG4gICAgcmV0dXJuIG5ldyBEYXRlKGFyZ3VtZW50LmdldFRpbWUoKSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50ID09PSAnbnVtYmVyJyB8fCBhcmdTdHIgPT09ICdbb2JqZWN0IE51bWJlcl0nKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGFyZ3VtZW50KTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoKHR5cGVvZiBhcmd1bWVudCA9PT0gJ3N0cmluZycgfHwgYXJnU3RyID09PSAnW29iamVjdCBTdHJpbmddJykgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFwiU3RhcnRpbmcgd2l0aCB2Mi4wLjAtYmV0YS4xIGRhdGUtZm5zIGRvZXNuJ3QgYWNjZXB0IHN0cmluZ3MgYXMgZGF0ZSBhcmd1bWVudHMuIFBsZWFzZSB1c2UgYHBhcnNlSVNPYCB0byBwYXJzZSBzdHJpbmdzLiBTZWU6IGh0dHBzOi8vZ2l0LmlvL2ZqdWxlXCIpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuXG4gICAgICBjb25zb2xlLndhcm4obmV3IEVycm9yKCkuc3RhY2spO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRGF0ZShOYU4pO1xuICB9XG59IiwiaW1wb3J0IHRvRGF0ZSBmcm9tIFwiLi4vdG9EYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9fbGliL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xuLyoqXG4gKiBAbmFtZSBkaWZmZXJlbmNlSW5NaWxsaXNlY29uZHNcbiAqIEBjYXRlZ29yeSBNaWxsaXNlY29uZCBIZWxwZXJzXG4gKiBAc3VtbWFyeSBHZXQgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgYmV0d2VlbiB0aGUgZ2l2ZW4gZGF0ZXMuXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBHZXQgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgYmV0d2VlbiB0aGUgZ2l2ZW4gZGF0ZXMuXG4gKlxuICogIyMjIHYyLjAuMCBicmVha2luZyBjaGFuZ2VzOlxuICpcbiAqIC0gW0NoYW5nZXMgdGhhdCBhcmUgY29tbW9uIGZvciB0aGUgd2hvbGUgbGlicmFyeV0oaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdXBncmFkZUd1aWRlLm1kI0NvbW1vbi1DaGFuZ2VzKS5cbiAqXG4gKiBAcGFyYW0ge0RhdGV8TnVtYmVyfSBkYXRlTGVmdCAtIHRoZSBsYXRlciBkYXRlXG4gKiBAcGFyYW0ge0RhdGV8TnVtYmVyfSBkYXRlUmlnaHQgLSB0aGUgZWFybGllciBkYXRlXG4gKiBAcmV0dXJucyB7TnVtYmVyfSB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kc1xuICogQHRocm93cyB7VHlwZUVycm9yfSAyIGFyZ3VtZW50cyByZXF1aXJlZFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBIb3cgbWFueSBtaWxsaXNlY29uZHMgYXJlIGJldHdlZW5cbiAqIC8vIDIgSnVseSAyMDE0IDEyOjMwOjIwLjYwMCBhbmQgMiBKdWx5IDIwMTQgMTI6MzA6MjEuNzAwP1xuICogY29uc3QgcmVzdWx0ID0gZGlmZmVyZW5jZUluTWlsbGlzZWNvbmRzKFxuICogICBuZXcgRGF0ZSgyMDE0LCA2LCAyLCAxMiwgMzAsIDIxLCA3MDApLFxuICogICBuZXcgRGF0ZSgyMDE0LCA2LCAyLCAxMiwgMzAsIDIwLCA2MDApXG4gKiApXG4gKiAvLz0+IDExMDBcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaWZmZXJlbmNlSW5NaWxsaXNlY29uZHMoZGF0ZUxlZnQsIGRhdGVSaWdodCkge1xuICByZXF1aXJlZEFyZ3MoMiwgYXJndW1lbnRzKTtcbiAgcmV0dXJuIHRvRGF0ZShkYXRlTGVmdCkuZ2V0VGltZSgpIC0gdG9EYXRlKGRhdGVSaWdodCkuZ2V0VGltZSgpO1xufSIsInZhciByb3VuZGluZ01hcCA9IHtcbiAgY2VpbDogTWF0aC5jZWlsLFxuICByb3VuZDogTWF0aC5yb3VuZCxcbiAgZmxvb3I6IE1hdGguZmxvb3IsXG4gIHRydW5jOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPCAwID8gTWF0aC5jZWlsKHZhbHVlKSA6IE1hdGguZmxvb3IodmFsdWUpO1xuICB9IC8vIE1hdGgudHJ1bmMgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxuXG59O1xudmFyIGRlZmF1bHRSb3VuZGluZ01ldGhvZCA9ICd0cnVuYyc7XG5leHBvcnQgZnVuY3Rpb24gZ2V0Um91bmRpbmdNZXRob2QobWV0aG9kKSB7XG4gIHJldHVybiBtZXRob2QgPyByb3VuZGluZ01hcFttZXRob2RdIDogcm91bmRpbmdNYXBbZGVmYXVsdFJvdW5kaW5nTWV0aG9kXTtcbn0iLCJpbXBvcnQgZGlmZmVyZW5jZUluTWlsbGlzZWNvbmRzIGZyb20gXCIuLi9kaWZmZXJlbmNlSW5NaWxsaXNlY29uZHMvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBnZXRSb3VuZGluZ01ldGhvZCB9IGZyb20gXCIuLi9fbGliL3JvdW5kaW5nTWV0aG9kcy9pbmRleC5qc1wiO1xuLyoqXG4gKiBAbmFtZSBkaWZmZXJlbmNlSW5TZWNvbmRzXG4gKiBAY2F0ZWdvcnkgU2Vjb25kIEhlbHBlcnNcbiAqIEBzdW1tYXJ5IEdldCB0aGUgbnVtYmVyIG9mIHNlY29uZHMgYmV0d2VlbiB0aGUgZ2l2ZW4gZGF0ZXMuXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBHZXQgdGhlIG51bWJlciBvZiBzZWNvbmRzIGJldHdlZW4gdGhlIGdpdmVuIGRhdGVzLlxuICpcbiAqICMjIyB2Mi4wLjAgYnJlYWtpbmcgY2hhbmdlczpcbiAqXG4gKiAtIFtDaGFuZ2VzIHRoYXQgYXJlIGNvbW1vbiBmb3IgdGhlIHdob2xlIGxpYnJhcnldKGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VwZ3JhZGVHdWlkZS5tZCNDb21tb24tQ2hhbmdlcykuXG4gKlxuICogQHBhcmFtIHtEYXRlfE51bWJlcn0gZGF0ZUxlZnQgLSB0aGUgbGF0ZXIgZGF0ZVxuICogQHBhcmFtIHtEYXRlfE51bWJlcn0gZGF0ZVJpZ2h0IC0gdGhlIGVhcmxpZXIgZGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIGFuIG9iamVjdCB3aXRoIG9wdGlvbnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucm91bmRpbmdNZXRob2Q9J3RydW5jJ10gLSBhIHJvdW5kaW5nIG1ldGhvZCAoYGNlaWxgLCBgZmxvb3JgLCBgcm91bmRgIG9yIGB0cnVuY2ApXG4gKiBAcmV0dXJucyB7TnVtYmVyfSB0aGUgbnVtYmVyIG9mIHNlY29uZHNcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gMiBhcmd1bWVudHMgcmVxdWlyZWRcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gSG93IG1hbnkgc2Vjb25kcyBhcmUgYmV0d2VlblxuICogLy8gMiBKdWx5IDIwMTQgMTI6MzA6MDcuOTk5IGFuZCAyIEp1bHkgMjAxNCAxMjozMDoyMC4wMDA/XG4gKiBjb25zdCByZXN1bHQgPSBkaWZmZXJlbmNlSW5TZWNvbmRzKFxuICogICBuZXcgRGF0ZSgyMDE0LCA2LCAyLCAxMiwgMzAsIDIwLCAwKSxcbiAqICAgbmV3IERhdGUoMjAxNCwgNiwgMiwgMTIsIDMwLCA3LCA5OTkpXG4gKiApXG4gKiAvLz0+IDEyXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlmZmVyZW5jZUluU2Vjb25kcyhkYXRlTGVmdCwgZGF0ZVJpZ2h0LCBvcHRpb25zKSB7XG4gIHJlcXVpcmVkQXJncygyLCBhcmd1bWVudHMpO1xuICB2YXIgZGlmZiA9IGRpZmZlcmVuY2VJbk1pbGxpc2Vjb25kcyhkYXRlTGVmdCwgZGF0ZVJpZ2h0KSAvIDEwMDA7XG4gIHJldHVybiBnZXRSb3VuZGluZ01ldGhvZChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMucm91bmRpbmdNZXRob2QpKGRpZmYpO1xufSIsImV4cG9ydCBjb25zdCByYW5kb21TdHJpbmcgPSAobGVuZ3RoOiBudW1iZXIgPSA4KTogc3RyaW5nID0+IChcbiAgTWF0aC5yYW5kb20oKS50b1N0cmluZyhsZW5ndGgpLnN1YnN0cmluZygyKVxuKTtcbiIsImV4cG9ydCBjb25zdCBBQ1RJT05TID0ge1xuICBDQUxMOiAnQ2FsbCcsXG4gIE5BVklHQVRJT046ICdOYXZpZ2F0aW9uJyxcbiAgREVUQUlMOiAnRGV0YWlsJyxcbiAgQkFOTkVSOiAnQmFubmVyRGV0YWlsJyxcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBGRUVEQkFDS19UWVBFUyA9IHtcbiAgQVRUUklCVVRJT046ICdhdHRyaWJ1dGlvbicsXG4gIFFVT1RFOiAncXVvdGUnLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IEZFRURCQUNLX0FDVElPTlMgPSB7XG4gIFFVT1RFOiAnQWRzUXVvdGUnLFxuICBERVRBSUw6ICdBZHNBdHRyaWJ1dGlvbkRldGFpbCcsXG4gIEZFRURCQUNLOiAnRmVlZGJhY2snLFxufSBhcyBjb25zdDtcbiIsImltcG9ydCBheGlvc0luc3RhbmNlIGZyb20gJy4vYXhpb3MnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAndXRpbHMvY29uZmlnJztcbmltcG9ydCB7IGRpZmZlcmVuY2VJblNlY29uZHMgfSBmcm9tICdkYXRlLWZucyc7XG5pbXBvcnQgeyByYW5kb21TdHJpbmcgfSBmcm9tICd1dGlscy9zdHJpbmcnO1xuaW1wb3J0IHsgQUNUSU9OUywgRkVFREJBQ0tfQUNUSU9OUywgRkVFREJBQ0tfVFlQRVMgfSBmcm9tICcuL3RlbGVtZXRyeS5oZWxwZXInO1xuXG5leHBvcnQge1xuICBBQ1RJT05TLFxuICBGRUVEQkFDS19BQ1RJT05TLFxuICBGRUVEQkFDS19UWVBFU1xufTtcblxubGV0IGxhc3RTZXNzaW9uVGltZSA9IG5ldyBEYXRlKCk7XG5sZXQgc2Vzc2lvbklkZW50aWZpZXIgPSByYW5kb21TdHJpbmcoKTtcblxuZXhwb3J0IGNvbnN0IHZlcmlmeVNlc3Npb24gPSBhc3luYyAoKSA9PiB7XG4gIGlmICghbGFzdFNlc3Npb25UaW1lIHx8IGRpZmZlcmVuY2VJblNlY29uZHMobmV3IERhdGUoKSwgbGFzdFNlc3Npb25UaW1lKSA+IDYwKSB7XG4gICAgbGFzdFNlc3Npb25UaW1lID0gbmV3IERhdGUoKTtcbiAgICBzZXNzaW9uSWRlbnRpZmllciA9IHJhbmRvbVN0cmluZygpO1xuICAgIGF3YWl0IHNlc3Npb25TdGFydCgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBzZW5kRXZlbnQocGFyYW1zOiBPYmplY3QpOiBQcm9taXNlPE9iamVjdD4gfCB1bmRlZmluZWQge1xuICBpZiAoY29uZmlnLkRFQlVHKSB7IHJldHVybjsgfVxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHVybCA9IGAvZXZlbnRzL3YyP2FjY2Vzc190b2tlbj0ke2NvbmZpZy5BQ0NFU1NfVE9LRU59YDtcbiAgICByZXR1cm4gYXhpb3NJbnN0YW5jZSh7XG4gICAgICBiYXNlVVJMOiBjb25maWcuVEVMRU1FVFJZX1VSTCxcbiAgICAgIGlzQmxvYjogdHJ1ZVxuICAgIH0pLnBvc3QodXJsLCBwYXJhbXMpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICByZXNvbHZlKHJlcy5kYXRhKTtcbiAgICB9KS5jYXRjaCgoZXJyb3I6IEVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlc3Npb25TdGFydCgpOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgc2Vzc2lvbklkZW50aWZpZXIsXG4gICAgZXZlbnQ6ICdhZE1ldHJpY3Muc2Vzc2lvblN0YXJ0JyxcbiAgICBidWNrZXQ6ICd1bmRlZmluZWQnLFxuICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgfTtcbiAgcmV0dXJuIHNlbmRFdmVudChbcGFyYW1zXSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kU2VsZWN0aW9uKGFkaWQ6IHN0cmluZywgem9vbUxldmVsOiBudW1iZXIpOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgc2Vzc2lvbklkZW50aWZpZXIsXG4gICAgZXZlbnQ6ICdhZE1ldHJpY3Muc2VsZWN0JyxcbiAgICBhZGlkLFxuICAgIHpvb21MZXZlbCxcbiAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gIH07XG4gIGF3YWl0IHZlcmlmeVNlc3Npb24oKTtcbiAgcmV0dXJuIHNlbmRFdmVudChbcGFyYW1zXSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kRGVzZWxlY3Rpb24oYWRpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIHNlc3Npb25JZGVudGlmaWVyLFxuICAgIGV2ZW50OiAnYWRNZXRyaWNzLmRlc2VsZWN0JyxcbiAgICBhZGlkLFxuICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgfTtcbiAgYXdhaXQgdmVyaWZ5U2Vzc2lvbigpO1xuICByZXR1cm4gc2VuZEV2ZW50KFtwYXJhbXNdKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRWaXNpYmlsaXRpZXMoXG4gIGZlYXR1cmVzOiBUZWxlbWV0cnlBUEkuRmVhdHVyZVtdXG4pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBwYXJhbXMgPSBmZWF0dXJlcy5tYXAoKHtcbiAgICBhZGlkLFxuICAgIHZpc2libGVTdGFydFRpbWUsXG4gICAgdmlzaWJsZUVuZFRpbWVcbiAgfSkgPT4gKHtcbiAgICBzZXNzaW9uSWRlbnRpZmllcixcbiAgICBldmVudDogJ2FkTWV0cmljcy52aXNpYmxlJyxcbiAgICBhZGlkLFxuICAgIHZpc2libGVTdGFydFRpbWUsXG4gICAgdmlzaWJsZUVuZFRpbWUsXG4gICAgY3JlYXRlZDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICB9KSk7XG4gIGF3YWl0IHZlcmlmeVNlc3Npb24oKTtcbiAgcmV0dXJuIHNlbmRFdmVudChwYXJhbXMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZEFjdGlvbihcbiAgYWRpZDogc3RyaW5nLFxuICBhY3Rpb246IFRlbGVtZXRyeUFQSS5BY3Rpb25zXG4pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgc2Vzc2lvbklkZW50aWZpZXIsXG4gICAgZXZlbnQ6ICdhZE1ldHJpY3MuY2FsbFRvQWN0aW9uJyxcbiAgICBhZGlkLFxuICAgIGFjdGlvbixcbiAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gIH07XG4gIGF3YWl0IHZlcmlmeVNlc3Npb24oKTtcbiAgcmV0dXJuIHNlbmRFdmVudChbcGFyYW1zXSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kRmVlZGJhY2soXG4gIGFkaWQ6IHN0cmluZyxcbiAgYWN0aW9uOiBUZWxlbWV0cnlBUEkuRmVlZGJhY2tBY3Rpb25zLFxuICB0eXBlOiBUZWxlbWV0cnlBUEkuRmVlZGJhY2tUeXBlc1xuKTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIHNlc3Npb25JZGVudGlmaWVyLFxuICAgIGV2ZW50OiAnYWRNZXRyaWNzLmZlZWRiYWNrJyxcbiAgICBhZGlkLFxuICAgIGFjdGlvbixcbiAgICB0eXBlLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gIH07XG4gIGF3YWl0IHZlcmlmeVNlc3Npb24oKTtcbiAgcmV0dXJuIHNlbmRFdmVudChbcGFyYW1zXSk7XG59XG4iLCJpbXBvcnQgKiBhcyB0ZWxlbWV0cnlBUElzIGZyb20gJ2FwaXMvdGVsZW1ldHJ5JztcblxuZXhwb3J0IGNvbnN0IEVWRU5UX1RZUEVTID0ge1xuICBMT0FEOiAnbG9hZCcsXG4gIE1PVkU6ICdtb3ZlJyxcbiAgQ0xJQ0tfUElOOiAnY2xpY2tfcGluJyxcbiAgXG4gIENMSUNLX0NBUkQ6ICdjbGlja19jYXJkJyxcbiAgU0hPV19DQVJEOiAnc2hvd19jYXJkJyxcbiAgVVBEQVRFX0NBUkQ6ICd1cGRhdGVfY2FyZCcsXG4gIENMT1NFX0NBUkQ6ICdjbG9zZV9jYXJkJyxcbiAgXG4gIENMSUNLX1NJREVfQ0FSRDogJ2NsaWNrX3NpZGVfY2FyZCcsXG4gIFNIT1dfU0lERV9DQVJEOiAnc2hvd19zaWRlX2NhcmQnLFxuICBVUERBVEVfU0lERV9DQVJEOiAndXBkYXRlX3NpZGVfY2FyZCcsXG4gIE9QRU5fU0lERV9DQVJEOiAnb3Blbl9zaWRlX2NhcmQnLFxuICBISURFX1NJREVfQ0FSRDogJ2hpZGVfc2lkZV9jYXJkJyxcbiAgQ0xPU0VfU0lERV9DQVJEOiAnY2xvc2Vfc2lkZV9jYXJkJyxcblxuICBDTElDS19QT1BVUDogJ2NsaWNrX3BvcHVwJyxcbiAgU0hPV19QT1BVUDogJ3Nob3dfcG9wdXAnLFxuICBDTE9TRV9QT1BVUDogJ2Nsb3NlX3BvcHVwJyxcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBDTElDS19UWVBFUyA9IHtcbiAgQ0FSRDogJ2NhcmQnLFxuICBUT0dHTEU6ICd0b2dnbGUnLFxuICBCQU5ORVI6ICdiYW5uZXInLFxuICBQSE9ORTogJ3Bob25lJyxcbiAgRElSRUNUSU9OUzogJ2RpcmVjdGlvbnMnLFxuICBERVRBSUw6ICdkZXRhaWwnLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IFRFTEVNRVRSWV9BQ1RJT05TOiB7IFtrZXk6IHN0cmluZ106IFRlbGVtZXRyeUFQSS5BY3Rpb25zIH0gPSB7XG4gIFtDTElDS19UWVBFUy5CQU5ORVJdOiB0ZWxlbWV0cnlBUElzLkFDVElPTlMuQkFOTkVSLFxuICBbQ0xJQ0tfVFlQRVMuUEhPTkVdOiB0ZWxlbWV0cnlBUElzLkFDVElPTlMuQ0FMTCxcbiAgW0NMSUNLX1RZUEVTLkRJUkVDVElPTlNdOiB0ZWxlbWV0cnlBUElzLkFDVElPTlMuTkFWSUdBVElPTixcbiAgW0NMSUNLX1RZUEVTLkRFVEFJTF06IHRlbGVtZXRyeUFQSXMuQUNUSU9OUy5ERVRBSUwsXG59IGFzIGNvbnN0O1xuIiwiaW1wb3J0IHsgaXNTYXR1cmRheSwgaXNTdW5kYXkgfSBmcm9tICdkYXRlLWZucyc7XG5cbnR5cGUgRGljdCA9IHsgW2tleTogc3RyaW5nXTogYW55IH07XG5cbmNvbnN0IGNhbWVsQ2FzZSA9IChvYmplY3Q6IERpY3QpOiBEaWN0ID0+IHtcbiAgY29uc3QgdXBkYXRlZE9iamVjdDogRGljdCA9IHt9O1xuICBmb3IgKGNvbnN0IGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHVwZGF0ZWRPYmplY3Rba2V5LnJlcGxhY2UoLyhcXF9cXHcpL2csIHVwZGF0ZWRLZXkgPT4gKFxuICAgICAgICB1cGRhdGVkS2V5WzFdLnRvVXBwZXJDYXNlKClcbiAgICAgICkpXSA9IG9iamVjdFtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdXBkYXRlZE9iamVjdDtcbn07XG5cbmV4cG9ydCBjb25zdCBmb3JtYXRQcm9wZXJ0aWVzID0gKHByb3BlcnRpZXM6IGFueSk6IEZlYXR1cmUuUHJvcGVydGllcyA9PiAoXG4gIGNhbWVsQ2FzZShwcm9wZXJ0aWVzKSBhcyBGZWF0dXJlLlByb3BlcnRpZXNcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRPcGVuQ2xvc2VMYWJlbCA9IChwcm9wZXJ0aWVzOiBGZWF0dXJlLlByb3BlcnRpZXMpOiBzdHJpbmcgPT4ge1xuICBjb25zdCB7IHNhdE9wZW4sIHNhdENsb3NlLCBzdW5PcGVuLCBzdW5DbG9zZSwgd2Vla09wZW4sIHdlZWtDbG9zZSB9ID0gcHJvcGVydGllcztcbiAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICBsZXQgb3BlbiA9ICcnO1xuICBsZXQgY2xvc2UgPSAnJztcbiAgaWYgKGlzU2F0dXJkYXkodG9kYXkpICYmIHNhdE9wZW4gJiYgc2F0Q2xvc2UpIHtcbiAgICBvcGVuID0gc2F0T3BlbjtcbiAgICBjbG9zZSA9IHNhdENsb3NlO1xuICB9IGVsc2UgaWYgKGlzU3VuZGF5KHRvZGF5KSAmJiBzdW5PcGVuICYmIHN1bkNsb3NlKSB7XG4gICAgb3BlbiA9IHN1bk9wZW47XG4gICAgY2xvc2UgPSBzdW5DbG9zZTtcbiAgfSBlbHNlIGlmICh3ZWVrT3BlbiAmJiB3ZWVrQ2xvc2UpIHtcbiAgICBvcGVuID0gd2Vla09wZW47XG4gICAgY2xvc2UgPSB3ZWVrQ2xvc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGNvbnN0IG9wZW5NYXRjaCA9IGAke29wZW59YC5tYXRjaCgvKFxcZHsxLDJ9KShcXGR7Mn0pJC8pO1xuICBjb25zdCBvcGVuSG91ciA9IG9wZW5NYXRjaCAmJiBvcGVuTWF0Y2gubGVuZ3RoID49IDMgPyBvcGVuTWF0Y2hbMV0gOiAnJztcbiAgY29uc3Qgb3Blbk1pbiA9IG9wZW5NYXRjaCAmJiBvcGVuTWF0Y2gubGVuZ3RoID49IDMgPyBvcGVuTWF0Y2hbMl0gOiAnJztcbiAgY29uc3QgY2xvc2VNYXRjaCA9IGAke2Nsb3NlfWAubWF0Y2goLyhcXGR7MSwyfSkoXFxkezJ9KSQvKTtcbiAgY29uc3QgY2xvc2VIb3VyID0gY2xvc2VNYXRjaCAmJiBjbG9zZU1hdGNoLmxlbmd0aCA+PSAzID8gY2xvc2VNYXRjaFsxXSA6ICcnO1xuICBjb25zdCBjbG9zZU1pbiA9IGNsb3NlTWF0Y2ggJiYgY2xvc2VNYXRjaC5sZW5ndGggPj0gMyA/IGNsb3NlTWF0Y2hbMl0gOiAnJztcbiAgY29uc3Qgb3BlbkxhbmJlbCA9IGAke29wZW5Ib3VyfToke29wZW5NaW59YDtcbiAgY29uc3QgY2xvc2VMYW5iZWwgPSBgJHtjbG9zZUhvdXJ9OiR7Y2xvc2VNaW59YDtcbiAgcmV0dXJuIGAke29wZW5MYW5iZWx9IC0gJHtjbG9zZUxhbmJlbH1gO1xufTtcbiJdLCJuYW1lcyI6WyJiaW5kIiwicmVxdWlyZSQkMCIsInV0aWxzIiwiYnVpbGRVUkwiLCJJbnRlcmNlcHRvck1hbmFnZXIiLCJub3JtYWxpemVIZWFkZXJOYW1lIiwiZW5oYW5jZUVycm9yIiwiY3JlYXRlRXJyb3IiLCJzZXR0bGUiLCJjb29raWVzIiwiaXNBYnNvbHV0ZVVSTCIsImNvbWJpbmVVUkxzIiwicmVxdWlyZSQkMSIsImJ1aWxkRnVsbFBhdGgiLCJwYXJzZUhlYWRlcnMiLCJpc1VSTFNhbWVPcmlnaW4iLCJDYW5jZWwiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNiIsInJlcXVpcmUkJDciLCJkZWZhdWx0cyIsInJlcXVpcmUkJDgiLCJyZXF1aXJlJCQ5IiwiZGVidWciLCJ1cmwiLCJodHRwIiwiaHR0cHMiLCJmb2xsb3dSZWRpcmVjdHNNb2R1bGUiLCJWRVJTSU9OIiwicmVxdWlyZSQkMTAiLCJyZXF1aXJlJCQxMSIsInJlcXVpcmUkJDEyIiwicmVxdWlyZSQkMTMiLCJ0cmFuc2Zvcm1EYXRhIiwiaXNDYW5jZWwiLCJkaXNwYXRjaFJlcXVlc3QiLCJtZXJnZUNvbmZpZyIsInZhbGlkYXRvcnMiLCJ2YWxpZGF0b3IiLCJBeGlvcyIsImF4aW9zIiwiYXhpb3NNb2R1bGUiLCJ0ZWxlbWV0cnlBUElzLkFDVElPTlMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1VBQWEsTUFBTSxHQUFHO1FBQ3BCLFFBQVEsRUFBRSx3QkFBd0I7UUFDbEMsYUFBYSxFQUFFLDJCQUEyQjtRQUMxQyxVQUFVLEVBQUUsOEJBQThCO1FBQzFDLGVBQWUsRUFBRSxzQkFBc0I7UUFDdkMsWUFBWSxFQUFFLEVBQUU7UUFDaEIsZ0JBQWdCLEVBQUUsR0FBRztRQUNyQixLQUFLLEVBQUUsS0FBSzs7O1VDUEQsS0FBSztRQUNULElBQUksQ0FBNEI7UUFDaEMsSUFBSSxDQUFTO1FBRXBCLFlBQVksSUFBK0IsRUFBRSxPQUFlLEVBQUU7WUFDNUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDbEI7Ozs7O1FDTEhBLE1BQWMsR0FBRyxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO0lBQzVDLEVBQUUsT0FBTyxTQUFTLElBQUksR0FBRztJQUN6QixJQUFJLElBQUksSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQyxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENB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
