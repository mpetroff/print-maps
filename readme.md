# Print Maps

Web maps normally don't print well, as their resolution is much lower than
normal print resolution, not to mention the various other unwanted text and
elements that print along with the map. Print Maps changes that by leveraging
[Mapbox GL JS](https://github.com/mapbox/mapbox-gl-js) to render print
resolution maps in the browser.

## Options

* Inches or millimeters
* PNG or PDF output (PDF is Letter size for inches, A4 for millimeters)
* Choice of map styles
* Height and width settings
* DPI setting

## Building

On a POSIX system, run `install.sh`. This will install the dependencies in the
correct locations (requires Mapbox GL JS build dependencies). Then add your
Mapbox access token to `js/script.js` and open `index.html`.

## License

Print Maps is distributed under the MIT License. For more information, read the
file `COPYING` or peruse the license
[online](https://github.com/mpetroff/print-maps/blob/master/COPYING).

## Credits

* [Matthew Petroff](http://mpetroff.net/), Original Author
* [Mapbox GL JS](https://github.com/mapbox/mapbox-gl-js)
* [FileSaver.js](https://github.com/eligrey/FileSaver.js/)
* [canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js)
* [jsPDF](https://github.com/MrRio/jsPDF)
