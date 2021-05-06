(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./functions/artists.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./functions/artists.ts":
/*!******************************!*\
  !*** ./functions/artists.ts ***!
  \******************************/
/*! exports provided: artists */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "artists", function() { return artists; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cheerio */ "cheerio");
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cheerio__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! source-map-support/register */ "source-map-support/register");
/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(source_map_support_register__WEBPACK_IMPORTED_MODULE_2__);



const artists = async (event, _context) => {
    const storefront = event.queryStringParameters["storefront"];
    const paramIds = event.queryStringParameters["ids"];
    const imageOnly = (event.queryStringParameters["imageOnly"] == 'true');
    let ids = [];
    if (paramIds !== "") {
        ids = paramIds.split(",");
    }
    const response = await getArtists(ids, storefront, imageOnly);
    if (response) {
        return sendRes(200, JSON.stringify({ artists: response }));
    }
    return sendRes(404, JSON.stringify({ error: 'Requested artists not found' }));
};
const sendRes = (status, body) => {
    return {
        statusCode: status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: body
    };
};
const getArtists = async (ids, storefront, imageOnly) => {
    const artists = [];
    await Promise.all(ids.map(async (id) => {
        const artist = await getArtist(id, storefront, imageOnly);
        if (artist) {
            artists.push(artist);
        }
    }));
    return artists;
};
const getArtist = async (id, storefront, imageOnly) => {
    const url = `https://music.apple.com/${storefront}/artist/${id}`;
    let artist;
    await axios__WEBPACK_IMPORTED_MODULE_0___default()(url)
        .then(response => {
        const html = response.data;
        const $ = cheerio__WEBPACK_IMPORTED_MODULE_1__["load"](html);
        if (!imageOnly) {
            const script = $("script[id='shoebox-media-api-cache-amp-music']")[0].children[0].data;
            if (script) {
                const parsedScript = JSON.parse(script);
                const secondKey = Object.keys(parsedScript)[1];
                const secondObject = JSON.parse(parsedScript[secondKey]);
                const artistDataKey = Object.keys(secondObject)[1];
                artist = secondObject[artistDataKey][0];
            }
        }
        if (imageOnly) {
            const image = $("meta[name='twitter:image']").attr('content');
            if (image) {
                artist = {
                    id: id,
                    attributes: {
                        artwork: {
                            width: 800,
                            height: 800,
                            url: `${image.substring(0, image.lastIndexOf('/'))}/{w}x{h}bb.jpeg`
                        },
                        url: `https://music.apple.com/${storefront}/artist/${id}`
                    }
                };
            }
        }
    })
        .catch(console.error);
    return artist;
};


/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "cheerio":
/*!**************************!*\
  !*** external "cheerio" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cheerio");

/***/ }),

/***/ "source-map-support/register":
/*!**********************************************!*\
  !*** external "source-map-support/register" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ })

/******/ })));
//# sourceMappingURL=artists.js.map