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
/******/ 	return __webpack_require__(__webpack_require__.s = "./functions/genius-artist.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./functions/genius-artist.ts":
/*!************************************!*\
  !*** ./functions/genius-artist.ts ***!
  \************************************/
/*! exports provided: artist */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "artist", function() { return artist; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! source-map-support/register */ "source-map-support/register");
/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(source_map_support_register__WEBPACK_IMPORTED_MODULE_1__);


const API_ROOT = "https://api.genius.com";
const PUBLIC_API_ROOT = "https://genius.com/api";
const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;
const artist = async (event, _context) => {
    const name = event.queryStringParameters["name"];
    const response = await getArtist(name);
    if (response) {
        return sendRes(200, JSON.stringify({ artist: response }));
    }
    return sendRes(404, JSON.stringify({ error: "Requested artist not found" }));
};
const sendRes = (status, body) => {
    return {
        statusCode: status,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: body,
    };
};
const getArtist = async (name) => {
    const result = await search(name);
    if (!result) {
        return null;
    }
    const artist = await getArtistDetail(result.id);
    return artist;
};
const search = async (name) => {
    const url = `${PUBLIC_API_ROOT}/search/artist?q=${name}`;
    let response;
    await axios__WEBPACK_IMPORTED_MODULE_0___default()(url)
        .then((res) => {
        response = res.data;
    })
        .catch(console.error);
    const match = findMatch(response.response.sections[0].hits, name);
    return match;
};
const getArtistDetail = async (id) => {
    const url = `${PUBLIC_API_ROOT}/artists/${id}`;
    let response;
    await axios__WEBPACK_IMPORTED_MODULE_0___default()(url)
        .then((res) => {
        response = res.data;
    })
        .catch(console.error);
    return response.response.artist;
};
const findMatch = (hits, searchName) => {
    searchName = searchName.toLowerCase();
    let hitArtist;
    for (let hit of hits) {
        hitArtist = hit.result.name.toLowerCase();
        if (hitArtist === searchName) {
            return hit.result;
        }
        if (hitArtist.includes(searchName) && !hitArtist.includes("&")) {
            return hit.result;
        }
    }
    return null;
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

/***/ "source-map-support/register":
/*!**********************************************!*\
  !*** external "source-map-support/register" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ })

/******/ })));
//# sourceMappingURL=genius-artist.js.map