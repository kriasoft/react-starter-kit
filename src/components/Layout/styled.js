import { normalize } from 'styled-normalize';
import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  ${normalize}
  :root {
    /*
    * Typography
    * ======================================================================== */

    --font-family-base: 'Segoe UI', 'HelveticaNeue-Light', sans-serif;

    /*
    * Layout
    * ======================================================================== */

    --max-content-width: 1000px;

    /*
    * Media queries breakpoints
    * ======================================================================== */

    --screen-xs-min: 480px;  /* Extra small screen / phone */
    --screen-sm-min: 768px;  /* Small screen / tablet */
    --screen-md-min: 992px;  /* Medium screen / desktop */
    --screen-lg-min: 1200px; /* Large screen / wide desktop */
  }

  html {
    color: #222;
    font-weight: 100;
    font-size: 1em; /* ~16px; */
    font-family: var(--font-family-base);
    line-height: 1.375; /* ~22px */
  }

  body {
    margin: 0;
  }

  a {
    color: #0074c2;
  }

  /*
  * Remove text-shadow in selection highlight:
  * https://twitter.com/miketaylr/status/12228805301
  *
  * These selection rule sets have to be separate.
  * Customize the background color to match your design.
  */

  ::-moz-selection {
    background: #b3d4fc;
    text-shadow: none;
  }

  ::selection {
    background: #b3d4fc;
    text-shadow: none;
  }

  /*
  * A better looking default horizontal rule
  */

  hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 1em 0;
    padding: 0;
  }

  /*
  * Remove the gap between audio, canvas, iframes,
  * images, videos and the bottom of their containers:
  * https://github.com/h5bp/html5-boilerplate/issues/440
  */

  audio,
  canvas,
  iframe,
  img,
  svg,
  video {
    vertical-align: middle;
  }

  /*
  * Remove default fieldset styles.
  */

  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }

  /*
  * Allow only vertical resizing of textareas.
  */

  textarea {
    resize: vertical;
  }

  /*
  * Browser upgrade prompt
  * ========================================================================== */

  :global(.browserupgrade) {
    margin: 0.2em 0;
    background: #ccc;
    color: #000;
    padding: 0.2em 0;
  }

  /*
  * Print styles
  * Inlined to avoid the additional HTTP request:
  * http://www.phpied.com/delay-loading-your-print-css/
  * ========================================================================== */

  @media print {
    *,
    *::before,
    *::after {
      background: transparent !important;
      color: #000 !important; /* Black prints faster: http://www.sanbeiji.com/archives/953 */
      box-shadow: none !important;
      text-shadow: none !important;
    }

    a,
    a:visited {
      text-decoration: underline;
    }

    a[href]::after {
      content: ' (' attr(href) ')';
    }

    abbr[title]::after {
      content: ' (' attr(title) ')';
    }

    /*
    * Don't show links that are fragment identifiers,
    * or use the javascript: pseudo protocol
    */

    a[href^='#']::after,
    a[href^='javascript:']::after {
      content: '';
    }

    pre,
    blockquote {
      border: 1px solid #999;
      page-break-inside: avoid;
    }

    /*
    * Printing Tables:
    * http://css-discuss.incutio.com/wiki/Printing_Tables
    */

    thead {
      display: table-header-group;
    }

    tr,
    img {
      page-break-inside: avoid;
    }

    img {
      max-width: 100% !important;
    }

    p,
    h2,
    h3 {
      orphans: 3;
      widows: 3;
    }

    h2,
    h3 {
      page-break-after: avoid;
    }
  }
`;
