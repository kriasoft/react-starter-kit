;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-yqfzhinanzhenkong" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M259.91168 764.08832l344.09984-160.08192 160.08192-344.09984L419.98336 419.98848 259.91168 764.08832zM511.99488 465.78688c25.63584 0 46.22336 20.79744 46.22336 46.21312s-20.58752 46.21824-46.22336 46.21824c-25.4208 0-46.21312-20.80256-46.21312-46.21824S486.57408 465.78688 511.99488 465.78688z"  ></path>' +
    '' +
    '<path d="M511.99488 91.84768c-232.13056 0-420.1472 188.01664-420.1472 420.15232 0 231.92064 188.01664 420.15232 420.1472 420.15232 232.13568 0 420.15744-188.23168 420.15744-420.15232C932.15232 279.86432 744.13056 91.84768 511.99488 91.84768zM511.99488 904.92928c-217.088 0-392.92928-176.03072-392.92928-392.92928 0-217.09312 175.84128-392.92928 392.92928-392.92928 217.10336 0 392.9344 175.83616 392.9344 392.92928C904.92928 728.89856 729.09824 904.92928 511.99488 904.92928z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-lianxiren" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M831.778 879.748h-672.994l-35.444-22.722-2.157-6.588c-1.022-3.18-10.11-32.263-0.681-62.367l0.91-3.068 1.931-2.613c21.924-29.991 76.683-60.096 134.735-91.905 53.167-29.199 133.373-73.274 133.826-96.678l0.113-22.151c-50.668-48.964-78.501-115.648-78.501-188.812 0-113.151 21.585-228.912 181.882-228.912 160.295 0 181.882 115.762 181.882 228.912 0 73.162-27.835 139.962-78.501 188.812l0.113 22.608c0.454 23.061 80.772 67.139 133.826 96.337 57.938 31.922 112.81 61.916 134.621 91.905l1.931 2.612 1.022 3.069c9.315 30.22 0.34 59.187-0.681 62.481l-2.157 6.588-35.675 22.492zM170.146 841.009h650.274l13.633-8.634c1.25-6.816 2.613-18.177-0.113-29.538-18.745-22.609-70.208-50.896-119.966-78.274-82.137-45.102-153.026-84.068-153.932-129.849l-0.114-39.988 6.365-5.793c46.465-42.034 72.138-100.994 72.138-166.090 0-120.419-23.402-190.174-143.028-190.174s-143.028 69.755-143.028 190.174c0 65.095 25.561 124.055 72.138 166.090l6.365 5.795-0.113 39.534c-1.022 46.237-71.911 85.203-153.932 130.304-49.872 27.378-101.337 55.667-120.081 78.274-2.727 11.36-1.363 22.722-0.113 29.538l13.509 8.631zM170.146 841.009z" fill="" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-liaotianqipao" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M508.134972 112.204501c-249.243621 0-451.29543 162.498978-451.29543 362.952382 0 87.98182 38.929638 168.648025 103.683431 231.474932L81.301677 868.812545l213.243709-73.852008-0.048095-0.031722c63.59848 27.541263 136.344295 43.182498 213.637682 43.182498 249.243621 0 451.29543-162.498978 451.29543-362.952382S757.378593 112.204501 508.134972 112.204501z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-lianxiren-copy" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M816.948 889.061h-698.036l-36.763-23.568-2.238-6.833c-1.060-3.298-10.486-33.465-0.706-64.688l0.944-3.182 2.003-2.711c22.74-31.108 79.536-62.332 139.748-95.325 55.145-30.284 138.335-76.001 138.806-100.274l0.117-22.976c-52.553-50.786-81.422-119.951-81.422-195.837 0-117.361 22.388-237.43 188.65-237.43 166.26 0 188.65 120.070 188.65 237.43 0 75.884-28.87 145.169-81.422 195.837l0.117 23.449c0.471 23.921 83.778 69.637 138.806 99.922 60.094 33.111 117.007 64.219 139.63 95.325l2.003 2.711 1.060 3.182c9.662 31.344 0.353 61.391-0.706 64.806l-2.238 6.833-36.998 23.33zM130.695 848.881h674.469l14.141-8.955c1.297-7.069 2.711-18.853-0.117-30.637-19.442-23.449-72.82-52.789-124.43-81.187-85.193-46.779-158.72-87.196-159.661-134.681l-0.117-41.475 6.601-6.009c48.193-43.598 74.822-104.752 74.822-172.27 0-124.9-24.273-197.25-148.35-197.25-124.077 0-148.35 72.349-148.35 197.25 0 67.518 26.511 128.671 74.822 172.27l6.601 6.009-0.117 41.007c-1.060 47.957-74.587 88.374-159.661 135.152-51.727 28.397-105.106 57.738-124.548 81.187-2.829 11.782-1.414 23.568-0.117 30.637l14.022 8.955zM130.695 848.881z"  ></path>' +
    '' +
    '<path d="M723.862 341.851h224.116v40.889h-224.116v-40.889zM723.862 341.851z"  ></path>' +
    '' +
    '<path d="M764.865 484.191h183.111v40.889h-183.111v-40.889zM764.865 484.191z"  ></path>' +
    '' +
    '<path d="M825.667 627.002h122.31v40.534h-122.31v-40.534zM825.667 627.002z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)