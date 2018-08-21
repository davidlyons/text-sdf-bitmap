/**
 * @author jonobr1 / http://jonobr1.com
 *
 */

var has = (function() {

  var root = this;
  var previousHas = root.has || {};

  // Let's do a bunch of navigator detections shall we?

  var ua = root.navigator.userAgent;

  var has = {

    // Mobile Detection

    Android: !!ua.match(/Android/ig),
    Blackberry: !!ua.match(/BlackBerry/ig),
    iOS: !!ua.match(/iPhone|iPad|iPod/ig),
    iPhone: !!ua.match(/iPhone/ig),
    iPad: !!ua.match(/iPad/ig),
    iPod: !!ua.match(/iPod/ig),
    OperaMini: !!ua.match(/Opera Mini/ig),
    Windows: !!ua.match(/IEMobile/ig),
    WebOS: !!ua.match(/webOS/ig),
    GearVR: !!ua.match(/SamsungBrowser.+Mobile VR/ig),

    // Browser Detection

    Arora: !!ua.match(/Arora/ig),
    Chrome: !!ua.match(/Chrome/ig),
    Chromium: !!ua.match(/Chrome/ig) && !(document.createElement('video').canPlayType('video/mp4')),
    Epiphany: !!ua.match(/Epiphany/ig),
    Firefox: !!ua.match(/Firefox/ig),
    InternetExplorer: !!ua.match(/(MSIE|Trident)/ig),
    Edge: !!ua.match(/Edge\//ig),
    Midori: !!ua.match(/Midori/ig),
    Opera: !!ua.match(/Opera/ig),
    Safari: !!ua.match(/Safari/ig) && !ua.match(/Chrome/ig),
    Oculus: !!ua.match(/OculusBrowser/ig),
    Daydream: false,  // TODO

    // OS Detection

    Mac: !!ua.match(/Mac/ig),

    webgl: (function() { try { return !!window.WebGLRenderingContext && !!(document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl')); } catch(e) { return false; } })(),

    defineProperty: !!Object.defineProperty,

    webAudio: !!(window.AudioContext || window.webkitAudioContext),

    noConflict: function() {
      root.has = previousHas;
      return has;
    },

  };

  has.mobile = has.Android || has.Blackberry || has.iOS || has.OperaMini || has.Windows || has.WebOS;

  has.localStorage = !!(window.localStorage && window.localStorage.setItem);

  root.has = has;

  return has;

})();
