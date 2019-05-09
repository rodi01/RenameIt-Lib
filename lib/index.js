"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FindReplace = require("./FindReplace");

Object.keys(_FindReplace).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _FindReplace[key];
    }
  });
});

var _Rename = require("./Rename");

Object.keys(_Rename).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Rename[key];
    }
  });
});