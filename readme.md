# Print CARTO Maps

Web maps normally don't print well, as their resolution is much lower than
normal print resolution. With Print CARTO Maps you can get
high resolution maps for printing by leveraging 
[Maplibre GL JS](https://github.com/maplibre/maplibre-gl-js) along with 
[deck.gl](https://deck.gl) to render maps created with 
[CARTO Builder](https://carto.com/builder/).

## Options

* Inches or millimeters
* PNG or PDF output (PDF is Letter size for inches, A4 for millimeters)
* Choice of map styles
* Height and width settings
* DPI setting

## Usage

1. Create your map with CARTO Builder
2. Share the map publicly and copy the Map ID
3. Enter the Map ID in the corresponding text box and click on the "Load Map" button
4. Choose the desired options
5. Click on the "Generate Map" button

## Building

Run a local webserver such as `python3 -m http.server`, and open `index.html`.

## Attribution

Attribution of maps is required. See tile provider terms for details.

## License

Print CARTO Maps is forked from Print Maps by Matthew Petroff. 
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
