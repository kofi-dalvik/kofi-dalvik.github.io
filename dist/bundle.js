/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/idb/lib/idb.js":
/*!*************************************!*\
  !*** ./node_modules/idb/lib/idb.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n(function () {\n  function toArray(arr) {\n    return Array.prototype.slice.call(arr);\n  }\n\n  function promisifyRequest(request) {\n    return new Promise(function (resolve, reject) {\n      request.onsuccess = function () {\n        resolve(request.result);\n      };\n\n      request.onerror = function () {\n        reject(request.error);\n      };\n    });\n  }\n\n  function promisifyRequestCall(obj, method, args) {\n    var request;\n    var p = new Promise(function (resolve, reject) {\n      request = obj[method].apply(obj, args);\n      promisifyRequest(request).then(resolve, reject);\n    });\n\n    p.request = request;\n    return p;\n  }\n\n  function promisifyCursorRequestCall(obj, method, args) {\n    var p = promisifyRequestCall(obj, method, args);\n    return p.then(function (value) {\n      if (!value) return;\n      return new Cursor(value, p.request);\n    });\n  }\n\n  function proxyProperties(ProxyClass, targetProp, properties) {\n    properties.forEach(function (prop) {\n      Object.defineProperty(ProxyClass.prototype, prop, {\n        get: function get() {\n          return this[targetProp][prop];\n        },\n        set: function set(val) {\n          this[targetProp][prop] = val;\n        }\n      });\n    });\n  }\n\n  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {\n    properties.forEach(function (prop) {\n      if (!(prop in Constructor.prototype)) return;\n      ProxyClass.prototype[prop] = function () {\n        return promisifyRequestCall(this[targetProp], prop, arguments);\n      };\n    });\n  }\n\n  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {\n    properties.forEach(function (prop) {\n      if (!(prop in Constructor.prototype)) return;\n      ProxyClass.prototype[prop] = function () {\n        return this[targetProp][prop].apply(this[targetProp], arguments);\n      };\n    });\n  }\n\n  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {\n    properties.forEach(function (prop) {\n      if (!(prop in Constructor.prototype)) return;\n      ProxyClass.prototype[prop] = function () {\n        return promisifyCursorRequestCall(this[targetProp], prop, arguments);\n      };\n    });\n  }\n\n  function Index(index) {\n    this._index = index;\n  }\n\n  proxyProperties(Index, '_index', ['name', 'keyPath', 'multiEntry', 'unique']);\n\n  proxyRequestMethods(Index, '_index', IDBIndex, ['get', 'getKey', 'getAll', 'getAllKeys', 'count']);\n\n  proxyCursorRequestMethods(Index, '_index', IDBIndex, ['openCursor', 'openKeyCursor']);\n\n  function Cursor(cursor, request) {\n    this._cursor = cursor;\n    this._request = request;\n  }\n\n  proxyProperties(Cursor, '_cursor', ['direction', 'key', 'primaryKey', 'value']);\n\n  proxyRequestMethods(Cursor, '_cursor', IDBCursor, ['update', 'delete']);\n\n  // proxy 'next' methods\n  ['advance', 'continue', 'continuePrimaryKey'].forEach(function (methodName) {\n    if (!(methodName in IDBCursor.prototype)) return;\n    Cursor.prototype[methodName] = function () {\n      var cursor = this;\n      var args = arguments;\n      return Promise.resolve().then(function () {\n        cursor._cursor[methodName].apply(cursor._cursor, args);\n        return promisifyRequest(cursor._request).then(function (value) {\n          if (!value) return;\n          return new Cursor(value, cursor._request);\n        });\n      });\n    };\n  });\n\n  function ObjectStore(store) {\n    this._store = store;\n  }\n\n  ObjectStore.prototype.createIndex = function () {\n    return new Index(this._store.createIndex.apply(this._store, arguments));\n  };\n\n  ObjectStore.prototype.index = function () {\n    return new Index(this._store.index.apply(this._store, arguments));\n  };\n\n  proxyProperties(ObjectStore, '_store', ['name', 'keyPath', 'indexNames', 'autoIncrement']);\n\n  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, ['put', 'add', 'delete', 'clear', 'get', 'getAll', 'getKey', 'getAllKeys', 'count']);\n\n  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, ['openCursor', 'openKeyCursor']);\n\n  proxyMethods(ObjectStore, '_store', IDBObjectStore, ['deleteIndex']);\n\n  function Transaction(idbTransaction) {\n    this._tx = idbTransaction;\n    this.complete = new Promise(function (resolve, reject) {\n      idbTransaction.oncomplete = function () {\n        resolve();\n      };\n      idbTransaction.onerror = function () {\n        reject(idbTransaction.error);\n      };\n      idbTransaction.onabort = function () {\n        reject(idbTransaction.error);\n      };\n    });\n  }\n\n  Transaction.prototype.objectStore = function () {\n    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));\n  };\n\n  proxyProperties(Transaction, '_tx', ['objectStoreNames', 'mode']);\n\n  proxyMethods(Transaction, '_tx', IDBTransaction, ['abort']);\n\n  function UpgradeDB(db, oldVersion, transaction) {\n    this._db = db;\n    this.oldVersion = oldVersion;\n    this.transaction = new Transaction(transaction);\n  }\n\n  UpgradeDB.prototype.createObjectStore = function () {\n    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));\n  };\n\n  proxyProperties(UpgradeDB, '_db', ['name', 'version', 'objectStoreNames']);\n\n  proxyMethods(UpgradeDB, '_db', IDBDatabase, ['deleteObjectStore', 'close']);\n\n  function DB(db) {\n    this._db = db;\n  }\n\n  DB.prototype.transaction = function () {\n    return new Transaction(this._db.transaction.apply(this._db, arguments));\n  };\n\n  proxyProperties(DB, '_db', ['name', 'version', 'objectStoreNames']);\n\n  proxyMethods(DB, '_db', IDBDatabase, ['close']);\n\n  // Add cursor iterators\n  // TODO: remove this once browsers do the right thing with promises\n  ['openCursor', 'openKeyCursor'].forEach(function (funcName) {\n    [ObjectStore, Index].forEach(function (Constructor) {\n      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.\n      if (!(funcName in Constructor.prototype)) return;\n\n      Constructor.prototype[funcName.replace('open', 'iterate')] = function () {\n        var args = toArray(arguments);\n        var callback = args[args.length - 1];\n        var nativeObject = this._store || this._index;\n        var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));\n        request.onsuccess = function () {\n          callback(request.result);\n        };\n      };\n    });\n  });\n\n  // polyfill getAll\n  [Index, ObjectStore].forEach(function (Constructor) {\n    if (Constructor.prototype.getAll) return;\n    Constructor.prototype.getAll = function (query, count) {\n      var instance = this;\n      var items = [];\n\n      return new Promise(function (resolve) {\n        instance.iterateCursor(query, function (cursor) {\n          if (!cursor) {\n            resolve(items);\n            return;\n          }\n          items.push(cursor.value);\n\n          if (count !== undefined && items.length == count) {\n            resolve(items);\n            return;\n          }\n          cursor.continue();\n        });\n      });\n    };\n  });\n\n  var exp = {\n    open: function open(name, version, upgradeCallback) {\n      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);\n      var request = p.request;\n\n      if (request) {\n        request.onupgradeneeded = function (event) {\n          if (upgradeCallback) {\n            upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));\n          }\n        };\n      }\n\n      return p.then(function (db) {\n        return new DB(db);\n      });\n    },\n    delete: function _delete(name) {\n      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);\n    }\n  };\n\n  if (true) {\n    module.exports = exp;\n    module.exports.default = module.exports;\n  } else {}\n})();\n\n//# sourceURL=webpack:///./node_modules/idb/lib/idb.js?");

/***/ }),

/***/ "./public/js/api.js":
/*!**************************!*\
  !*** ./public/js/api.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _helpers = __webpack_require__(/*! ./helpers */ \"./public/js/helpers.js\");\n\nvar _indexDB = __webpack_require__(/*! ./indexDB */ \"./public/js/indexDB.js\");\n\nvar _indexDB2 = _interopRequireDefault(_indexDB);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = {\n\n    /**\r\n     * @description fetches all convertible currencies\r\n     * @param Element dom elements\r\n     */\n    fetchAllCurrencies: function fetchAllCurrencies() {\n        /** make request to get all currencies */\n        fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(function (response) {\n            //parse response body to json\n            return response.json();\n        }).then(function (currencies) {\n            (0, _helpers.displayCurrencies)(currencies);\n            _indexDB2.default.setCurrencies(currencies);\n        }).catch(function (error) {\n            console.log(error);\n        });\n    },\n\n\n    /**\r\n     * @description gets the rate between 2 currencies and converts it\r\n     * @param {DOM} param0 \r\n     * @param {DOM} toValue \r\n     */\n    convertCurrency: function convertCurrency(_ref, toValue) {\n        var from = _ref.from,\n            to = _ref.to,\n            value = _ref.value;\n\n        /** show progressIndicator */\n        (0, _helpers.toggleProgressIndicator)();\n        /** remove the green backgroun of the result text input */\n        toValue.className = '';\n        /** define the request relation */\n        var relation = [from, to].join('_');\n        /** fetch rate between give currencies in the ralation */\n        fetch('https://free.currencyconverterapi.com/api/v5/convert?q=' + relation + '&compact=ultra').then(function (response) {\n            /** on request completion, hide progressIndicator */\n            (0, _helpers.toggleProgressIndicator)();\n            /** resolve response to json */\n            return response.json();\n        }).then(function (data) {\n            /** compute the convertion with the rate and show value to user */\n            toValue.value = value * data[relation];\n            toValue.className = 'ok';\n        }).catch(function (error) {\n            console.log(error);\n            /** if request not sent, hide progressIndicator */\n            (0, _helpers.toggleProgressIndicator)();\n        });\n    }\n};\n\n//# sourceURL=webpack:///./public/js/api.js?");

/***/ }),

/***/ "./public/js/app.js":
/*!**************************!*\
  !*** ./public/js/app.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"]) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); } }; }(); /** importing api methods, these methods makes http requests */\n\n\n/** importing utility functions, most of which are dom manipulating functions */\n\n\nvar _api = __webpack_require__(/*! ./api */ \"./public/js/api.js\");\n\nvar _api2 = _interopRequireDefault(_api);\n\nvar _indexDB = __webpack_require__(/*! ./indexDB */ \"./public/js/indexDB.js\");\n\nvar _indexDB2 = _interopRequireDefault(_indexDB);\n\nvar _helpers = __webpack_require__(/*! ./helpers */ \"./public/js/helpers.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n/** when ready, we fetch all currencies and populate the select inputs with currencies */\nwindow.onload = function (event) {\n\n    /** registering service worker */\n    registerServiceWorker();\n\n    // indexDB.populateRatesOfConversion()\n\n    /** fetch currencies if not in db */\n    _indexDB2.default.getCurrencies().then(function (val) {\n        if (!val) {\n            _api2.default.fetchAllCurrencies();\n        } else {\n            (0, _helpers.displayCurrencies)(val);\n        }\n    });\n\n    /** these are dom elements we are going to use very frequently\r\n     * getting them here will help reduce having to repeat codes accros modules\r\n    */\n\n    var _document$getElements = document.getElementsByClassName('convert'),\n        _document$getElements2 = _slicedToArray(_document$getElements, 1),\n        convert = _document$getElements2[0];\n\n    var _document$getElements3 = document.getElementsByTagName('select'),\n        _document$getElements4 = _slicedToArray(_document$getElements3, 2),\n        fromType = _document$getElements4[0],\n        toType = _document$getElements4[1];\n\n    var _document$getElements5 = document.getElementsByTagName('input'),\n        _document$getElements6 = _slicedToArray(_document$getElements5, 2),\n        fromValue = _document$getElements6[0],\n        toValue = _document$getElements6[1];\n\n    /** \r\n     * converts currencies\r\n     */\n\n\n    convert.addEventListener('click', function (event) {\n\n        //validate the form data, make sure all inputs are set\n        var valid = (0, _helpers.validateData)(fromValue, fromType, toType, toValue);\n\n        //if form is valid, convert currency\n        if (valid && !valid.sameCurrency) {\n\n            _api2.default.convertCurrency(valid, toValue);\n        }\n    });\n\n    toType.addEventListener('change', function (event) {\n        if (event.target.value !== fromType.value) {\n            toValue.className = '';\n            toValue.value = '';\n        }\n    });\n};\n\nvar registerServiceWorker = function registerServiceWorker() {\n    if (navigator.serviceWorker) {\n        navigator.serviceWorker.register('/sw.js').then(function (registration) {\n            console.log('sw registered ok');\n        }).catch(function () {\n            console.log('sw not registered');\n        });\n    }\n};\n\n//# sourceURL=webpack:///./public/js/app.js?");

/***/ }),

/***/ "./public/js/helpers.js":
/*!******************************!*\
  !*** ./public/js/helpers.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n        value: true\n});\n\nvar _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"]) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); } }; }();\n\n/**\r\n * @description toggles the visibility of the progress indicator\r\n */\nvar toggleProgressIndicator = exports.toggleProgressIndicator = function toggleProgressIndicator() {\n\n        /** get the progress indicator */\n        var _document$getElements = document.getElementsByClassName('progress'),\n            _document$getElements2 = _slicedToArray(_document$getElements, 1),\n            progressIndicator = _document$getElements2[0];\n\n        /** check if progress indicator's display property is none then set to flex, else set to none */\n\n\n        if (progressIndicator.style.display === 'none' || progressIndicator.style.display === '') {\n\n                progressIndicator.style.display = 'flex';\n        } else {\n\n                progressIndicator.style.display = 'none';\n        }\n};\n\n/**\r\n * @description changes the text and color for a given Dom node\r\n * @param {DOM} el \r\n * @param {String} message \r\n * @param {Boolean} error \r\n */\nvar errorLabel = function errorLabel(el, message, error) {\n        el.innerText = message + ':';\n        el.style.color = error ? 'red' : '';\n};\n\n/**\r\n * @description validates dom input values \r\n * @param {DOM} fromValue \r\n * @param {DOM} fromType \r\n * @param {DOM} toType \r\n * @param {DOM} toValue \r\n */\nvar validateData = exports.validateData = function validateData(fromValue, fromType, toType, toValue) {\n\n        var fromValueLable = fromValue.parentElement.firstElementChild,\n            fromTypeLabel = fromType.parentElement.firstElementChild,\n            toTypeLable = toType.parentElement.firstElementChild;\n\n        var response = null;\n\n        if (!fromValue.value) {\n\n                errorLabel(fromValueLable, 'The amount to convert is required', true);\n\n                return false;\n        } else if (!/^(\\d*\\.)?\\d+$/.test(fromValue.value)) {\n\n                errorLabel(fromValueLable, 'A valid number is required', true);\n\n                return false;\n        } else {\n\n                errorLabel(fromValueLable, 'Amount I have', false);\n        }\n\n        if (!fromType.value) {\n\n                errorLabel(fromTypeLabel, 'Select Currency to convert', true);\n\n                return false;\n        } else {\n\n                errorLabel(fromTypeLabel, 'Currency I have', false);\n        }\n\n        if (!toType.value) {\n\n                errorLabel(toTypeLable, 'Select Currency to convert to', true);\n\n                return false;\n        } else {\n\n                errorLabel(toTypeLable, 'Currency I want', false);\n        }\n\n        if (fromType.value === toType.value) {\n\n                toValue.value = fromValue.value;\n\n                toValue.className = toValue.className + ' ok';\n        } else {\n\n                toValue.className = '';\n        }\n\n        return {\n                sameCurrency: fromType.value === toType.value,\n                from: fromType.value,\n                to: toType.value,\n                value: fromValue.value\n        };\n};\n\nvar displayCurrencies = exports.displayCurrencies = function displayCurrencies(currencies) {\n        var _document$getElements3 = document.getElementsByTagName('select'),\n            _document$getElements4 = _slicedToArray(_document$getElements3, 2),\n            fromType = _document$getElements4[0],\n            toType = _document$getElements4[1];\n\n        /**\r\n        * currencies does not implement iteratable protocol\r\n        * so makeIterable() function converts the object into array\r\n        * makeIterable() also sorts the currencies into alphabetical order\r\n        */\n\n        currencies = makeIterable(currencies.results);\n\n        /** with each currency */\n        var _iteratorNormalCompletion = true;\n        var _didIteratorError = false;\n        var _iteratorError = undefined;\n\n        try {\n                for (var _iterator = currencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n                        var item = _step.value;\n\n\n                        /** create option element */\n                        var option = document.createElement('option');\n\n                        /** set properties of the element */\n                        var id = item.id,\n                            currencyName = item.currencyName,\n                            currencySymbol = item.currencySymbol;\n\n\n                        option.value = id;\n\n                        option.innerText = id + ' - ' + currencyName + ' - ' + (currencySymbol || '');\n\n                        /** append option elements to dom */\n                        fromType.appendChild(option);\n\n                        toType.appendChild(option.cloneNode(true));\n                }\n        } catch (err) {\n                _didIteratorError = true;\n                _iteratorError = err;\n        } finally {\n                try {\n                        if (!_iteratorNormalCompletion && _iterator.return) {\n                                _iterator.return();\n                        }\n                } finally {\n                        if (_didIteratorError) {\n                                throw _iteratorError;\n                        }\n                }\n        }\n};\n\n/**\r\n * @description parses currency object into array and sorts the array\r\n * bases on currencyname property. This makes it easy for the user\r\n * @param {Object} data\r\n * @returns Array of sorted currencies\r\n */\nvar makeIterable = exports.makeIterable = function makeIterable(data) {\n\n        /** convert object into iterable array */\n        var iterable = [];\n\n        for (var key in data) {\n\n                iterable.push(data[key]);\n        }\n\n        /** sort iterable */\n        iterable.sort(function (a, b) {\n\n                if (a.currencyName < b.currencyName) return -1;\n\n                if (a.currencyName > b.currencyName) return 1;\n\n                return 0;\n        });\n\n        // console.log(iterable)\n\n        return iterable;\n};\n\n//# sourceURL=webpack:///./public/js/helpers.js?");

/***/ }),

/***/ "./public/js/indexDB.js":
/*!******************************!*\
  !*** ./public/js/indexDB.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _idb = __webpack_require__(/*! idb */ \"./node_modules/idb/lib/idb.js\");\n\nvar _idb2 = _interopRequireDefault(_idb);\n\nvar _helpers = __webpack_require__(/*! ./helpers */ \"./public/js/helpers.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar IndexDB = function () {\n    function IndexDB() {\n        _classCallCheck(this, IndexDB);\n\n        console.log('store created');\n        this._db = _idb2.default.open('currency-converter', 1, function (upgradeDB) {\n            var store = upgradeDB.createObjectStore('cc-key-val');\n            store.put('world', 'hello');\n        });\n    }\n\n    _createClass(IndexDB, [{\n        key: 'getCurrencies',\n        value: function getCurrencies() {\n            var _this = this;\n\n            return new Promise(function (resolve, reject) {\n                _this._db.then(function (db) {\n                    var transaction = db.transaction('cc-key-val');\n                    var store = transaction.objectStore('cc-key-val');\n                    return store.get('currencies');\n                }).then(function (val) {\n                    resolve(val);\n                });\n            });\n        }\n    }, {\n        key: 'setCurrencies',\n        value: function setCurrencies(currencies) {\n            var _this2 = this;\n\n            return new Promise(function (resolve, reject) {\n                _this2._db.then(function (db) {\n                    var transaction = db.transaction('cc-key-val', 'readwrite');\n                    var store = transaction.objectStore('cc-key-val');\n                    store.put(currencies, 'currencies');\n                    return transaction.complete;\n                }).then(function () {\n                    return resolve(true);\n                }).catch(function () {\n                    return reject(null);\n                });\n            });\n        }\n    }, {\n        key: 'isFirstTime',\n        value: function isFirstTime() {\n            var _this3 = this;\n\n            return new Promise(function (resolve, reject) {\n                _this3._db.then(function (db) {\n                    var transaction = db.transaction('cc-key-val');\n                    var store = transaction.objectStore('cc-key-val');\n                    return store.get('firsttime');\n                });\n            });\n        }\n    }, {\n        key: 'populateRatesOfConversion',\n        value: function populateRatesOfConversion() {\n            var _this4 = this;\n\n            console.log('in populateRatesOfConvertion');\n            return new Promise(function (resolve, reject) {\n                _this4.getCurrencies().then(function (currencies) {\n                    currencies = (0, _helpers.makeIterable)(currencies.results).slice(0, 10);\n\n                    // currencies = [{id: 'A'}, {id: 'B'}, {id: 'C'}, {id: 'D'},{id: 'E'}, {id: 'F'}]\n                    var relation = '';\n                    var limit = 0;\n\n                    for (var i = 0; i < currencies.length; i++) {\n                        var j = i + 1;\n                        while (j < currencies.length) {\n\n                            var pair = currencies[i].id + '_' + currencies[j].id + ',';\n                            limit++;\n                            relation += pair;\n                            // console.log(`relation as at limit ${limit} = ${relation}`)\n\n                            if (limit % 2 == 0) {\n                                relation = relation.substring(0, relation.length - 1);\n                                // console.log(relation)\n\n                                // setTimeout(function () {\n\n                                // }, 3000)\n\n                                relation = '';\n                            }\n                            j++;\n                        }\n                    }\n                    console.log(relation);\n                }).catch(function (err) {\n                    console.log('cannot populateRates of covertions', err);\n                });\n            });\n        }\n    }]);\n\n    return IndexDB;\n}();\n\nexports.default = new IndexDB();\n\n//# sourceURL=webpack:///./public/js/indexDB.js?");

/***/ }),

/***/ 0:
/*!********************************!*\
  !*** multi ./public/js/app.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./public/js/app.js */\"./public/js/app.js\");\n\n\n//# sourceURL=webpack:///multi_./public/js/app.js?");

/***/ })

/******/ });