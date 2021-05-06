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
/******/ 	return __webpack_require__(__webpack_require__.s = "./functions/genius.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./functions/genius.ts":
/*!*****************************!*\
  !*** ./functions/genius.ts ***!
  \*****************************/
/*! exports provided: song */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "song", function() { return song; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! source-map-support/register */ "source-map-support/register");
/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(source_map_support_register__WEBPACK_IMPORTED_MODULE_1__);


const API_ROOT = "https://api.genius.com";
const PUBLIC_API_ROOT = "https://genius.com/api";
const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;
const song = async (event, _context) => {
    const artist = event.queryStringParameters["artist"];
    const song = event.queryStringParameters["song"];
    const includeLyrics = (event.queryStringParameters["includeLyrics"] == 'true');
    const response = await getSong(artist, song, includeLyrics);
    if (response) {
        return sendRes(200, JSON.stringify({ song: response }));
    }
    return sendRes(404, JSON.stringify({ error: 'Requested song not found' }));
};
const sendRes = (status, body) => {
    return {
        statusCode: status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: body
    };
};
const getSong = async (artistName, songName, includeLyrics) => {
    const songHit = await search(artistName, songName);
    if (!songHit) {
        return null;
    }
    const song = await getSongDetail(songHit.result.id);
    if (includeLyrics) {
        song.lyrics = await retrieveLyrics(song.id, song.writer_artists);
    }
    return song;
};
const search = async (artistName, songName) => {
    const url = `${API_ROOT}/search?access_token=${ACCESS_TOKEN}&q=${artistName + ' ' + songName}`;
    let response;
    await axios__WEBPACK_IMPORTED_MODULE_0___default()(url)
        .then(res => {
        response = res.data;
    })
        .catch(console.error);
    const songHit = findSongHit(response.response.hits, artistName, songName);
    return songHit;
};
const getSongDetail = async (id) => {
    const url = `${API_ROOT}/songs/${id}?access_token=${ACCESS_TOKEN}`;
    let response;
    await axios__WEBPACK_IMPORTED_MODULE_0___default()(url)
        .then(res => {
        response = res.data;
    })
        .catch(console.error);
    return response.response.song;
};
const findSongHit = (hits, searchArtist, searchSong) => {
    searchArtist = searchArtist.toLowerCase();
    searchSong = searchSong.toLowerCase();
    let hitArtist;
    let hitSong;
    for (let hit of hits) {
        hitArtist = hit.result.primary_artist.name.toLowerCase();
        hitSong = hit.result.title.toLowerCase();
        if (hitArtist.includes(searchArtist) && hitSong.includes(searchSong)) {
            return hit;
        }
        if (searchArtist.includes('&')) {
            if (matchCollabArtists(hitArtist, searchArtist) && hitSong.includes(searchSong)) {
                return hit;
            }
        }
    }
    for (let hit of hits) {
        hitArtist = hit.result.primary_artist.name.toLowerCase();
        hitSong = hit.result.title.toLowerCase();
        const regExp = new RegExp('\((.+?)\)|\[(.+?)\]|{(.+?)}');
        const hitArtistNoParentheses = hitArtist.replace(regExp, '').trim();
        const searchArtistNoParentheses = searchArtist.replace(regExp, '').trim();
        const hitSongNoParentheses = hitSong.replace(regExp, '').trim();
        const songNoParentheses = searchSong.replace(regExp, '').trim();
        if (hitArtistNoParentheses.includes(searchArtistNoParentheses) && hitSongNoParentheses.includes(songNoParentheses)) {
            return hit;
        }
        if (searchArtist.includes('&')) {
            if (matchCollabArtists(hitArtistNoParentheses, searchArtistNoParentheses) && hitSongNoParentheses.includes(songNoParentheses)) {
                return hit;
            }
        }
    }
    ;
    for (let hit of hits) {
        hitArtist = hit.result.primary_artist.name.toLowerCase();
        hitSong = hit.result.title.toLowerCase();
        let regExp = new RegExp(`\((.+?)\)|\[(.+?)\]|{(.+?)}`);
        const hitArtistNoParentheses = hitArtist.replace(regExp, '').trim();
        const searchArtistNoParentheses = searchArtist.replace(regExp, '').trim();
        const hitSongNoParentheses = hitSong.replace(regExp, '').trim();
        const searchSongNoParentheses = searchSong.replace(regExp, '').trim();
        regExp = new RegExp(`[^a-z0-9]+`);
        const hitArtistAlphanumeric = hitArtistNoParentheses.replace(regExp, '').trim();
        const searchArtistAlphanumeric = searchArtistNoParentheses.replace(regExp, '').trim();
        const hitSongAlphanumeric = hitSongNoParentheses.replace(regExp, '').trim();
        const searchSongAlphanumeric = searchSongNoParentheses.replace(regExp, '').trim();
        if (hitArtistAlphanumeric.includes(searchArtistAlphanumeric) && hitSongAlphanumeric.includes(searchSongAlphanumeric)) {
            return hit;
        }
        if (searchArtist.includes('&')) {
            if (matchCollabArtists(hitArtistAlphanumeric, searchArtistAlphanumeric) && hitSongAlphanumeric.includes(searchSongAlphanumeric)) {
                return hit;
            }
        }
    }
    ;
    return null;
};
const matchCollabArtists = (hitArtist, artists) => {
    const collabArtists = artists.split('&');
    let foundMatch;
    collabArtists.forEach((collabArtist) => {
        collabArtist = collabArtist.trim();
        if (hitArtist.includes(collabArtist)) {
            foundMatch = true;
            return;
        }
    });
    return foundMatch;
};
const retrieveLyrics = async (id, writtenBy) => {
    const url = `https://genius.com/songs/${id}/embed.js`;
    let lyrics;
    await axios__WEBPACK_IMPORTED_MODULE_0___default()(url)
        .then(res => {
        lyrics = res.data;
    })
        .catch(() => {
        lyrics = 'Lyrics unavailble';
        return lyrics;
    });
    if (lyrics.length === 0 || lyrics === ' ') {
        lyrics = "Lyrics unavailable";
        return lyrics;
    }
    lyrics = lyrics.replace(new RegExp(`.+?('\\)\\) {)`), '');
    lyrics = lyrics.replace(new RegExp(`.+?(type="text\\/css" \\/>'\\))`), '');
    lyrics = lyrics.replace(new RegExp(`.+?(rg_embed_body\\\\\\\\\\\\\">)`), '');
    lyrics = lyrics.match(new RegExp(`.+?(<\\\\\\/div>)`))[0];
    lyrics = lyrics.replace(/<[^>]*>/g, '');
    lyrics = lyrics.replace(/\\\\n/g, '|n');
    lyrics = lyrics.replace(/\\/g, '');
    lyrics = lyrics.replace(/\|n/g, '\n');
    lyrics = lyrics.replace(/&amp;/g, '&');
    lyrics = lyrics.trim();
    if (writtenBy.length > 0) {
        lyrics += "\n\nWritten By:\n";
        for (let writer of writtenBy) {
            lyrics += writer.name;
            if (writer.name !== writtenBy[writtenBy.length - 1].name) {
                lyrics += ", ";
            }
        }
    }
    return lyrics;
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
//# sourceMappingURL=genius.js.map