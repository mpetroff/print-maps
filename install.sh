#!/bin/sh
# Install dependency files

git submodule init
git submodule update

cd lib
mkdir -p js

# Mapbox GL
cd submodules/mapbox-gl-js
npm install
npm run production
sed 's/window.devicePixelRatio/window.pixelRatio/g' dist/mapbox-gl.js > ../../js/mapbox-gl.js
cp dist/mapbox-gl.js.map ../../js/mapbox-gl.js.map
cp dist/mapbox-gl.css ../../css/mapbox-gl.css
cp -r dist/images ../../css/
cd ..

# canvas-toBlob.js
cp canvas-toBlob.js/canvas-toBlob.js ../js/canvas-toBlob.js

# FileSaver.js
cp FileSaver.js/FileSaver.min.js ../js/FileSaver.min.js

# jsPDF
cp jsPDF/dist/jspdf.min.js ../js/jspdf.min.js
