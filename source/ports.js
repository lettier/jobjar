/* global Elm */
/* global window */
/* global document */
/* jshint esversion: 6 */
(function () {
  'use strict';

  window.onload = function () {
    let container = document.getElementById('container');
    let jobjar = Elm.embed(Elm.Main, container);
  };
})();
