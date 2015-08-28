## Add Custom font

### In variables.css add

```
@font-face {
  font-family: 'Font name';
  font-style: normal;
  font-weight: 400;
  src: url(${path_to_fonts}/font.eot); /* For IE6-8 */
  src: local('Material Icons'),
       local('MaterialIcons-Regular'),
       url(${path_to_fonts}/font.woff2) format('woff2'),
       url(${path_to_fonts}/font.woff) format('woff'),
       url(${path_to_fonts}/font.ttf) format('truetype');
}
```

if adding diffrent extensions of fonts please add the specific loader in `tools/config.js` seciton modules/loaders 
