//　curl noise
// https://petewerner.blogspot.jp/2015/02/intro-to-curl-noise.html

// inspired by
// https://www.clicktorelease.com/code/polygon-shredder/

import Webgl from "./Webgl";
window.onload = () => {
  var webgl = new Webgl();
  window.onresize = () => {
    webgl.resize();
  };
};
