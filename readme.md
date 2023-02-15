# Print Maps

Web maps normally don't print well, as their resolution is much lower than
normal print resolution, not to mention the various other unwanted text and
elements that print along with the map. Print Maps changes that by leveraging
[Maplibre GL JS](https://github.com/maplibre/maplibre-gl-js) along with deck.gl
to render print resolution maps including a basemap and additional layers
in the browser.

## Options

* Inches or millimeters
* PNG or PDF output (PDF is Letter size for inches, A4 for millimeters)
* Choice of map styles
* Height and width settings
* DPI setting

## Building

Run a local webserver such as `python3 -m http.server`, and open `index.html`.

## Attribution

Attribution of maps is required. See tile provider terms for details.

## License

Print Maps is distributed under the MIT License. For more information, read the
file `COPYING` or peruse the license
[online](https://github.com/mpetroff/print-maps/blob/master/COPYING).

## Credits

* [Matthew Petroff](http://mpetroff.net/), Original Author
* [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js)
* [FileSaver.js](https://github.com/eligrey/FileSaver.js/)
* [canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js)
* [jsPDF](https://github.com/MrRio/jsPDF)
* [Bootstrap](http://getbootstrap.com/)
