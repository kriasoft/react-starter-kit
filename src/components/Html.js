import React, { PropTypes } from 'react';
import assets from './assets';
import { analytics } from '../config';

function Html({ title, css, content }) {
  return (
    <html className="no-js" lang="">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <title>{title}</title>
      <meta name="description" content="" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="apple-touch-icon" href="apple-touch-icon.png" />
      <style id="css" dangerouslySetInnerHTML={{ __html: css }}></style>
    </head>
    <body>
      <div id="container" dangerouslySetInnerHTML={{ __html: content }} />
      <script src={assets.main.js} />
      {
        process.env.NODE_ENV === 'production' &&
        <script>
          window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;
          ga('create','{analytics.google.trackingId}','auto');ga('send','pageview')
        </script>
      }
      {
        process.env.NODE_ENV === 'production' &&
        <script src="https://www.google-analytics.com/analytics.js" async defer />
      }
    </body>
    </html>
  );
}

Html.propTypes = {
  title: PropTypes.string.isRequired,
  css: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Html;
