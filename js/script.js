/*
 * Print Maps - High-resolution maps in the browser, for printing
 * Copyright (c) 2015-2020 Matthew Petroff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
var form = document.getElementById('config');

//
// Interactive map
//

function updateLocationInputs() {
    var center = map.getCenter().toArray();

    var zoom = parseFloat(map.getZoom()).toFixed(2),
        lat = parseFloat(center[1]).toFixed(4),
        lon = parseFloat(center[0]).toFixed(4);

    form.zoomInput.value = zoom;
    form.latInput.value = lat;
    form.lonInput.value = lon;
}

var map;
var deckLayers;

function initMap() {
    try {

        deck.carto.setDefaultCredentials({
            apiBaseUrl: document.getElementById('regionSelect').value});


        deck.carto.fetchMap({cartoMapId: document.getElementById('mapIdInput').value})
        .then(({initialViewState, mapStyle, layers}) => {
    
            deckLayers = layers;
    
            map = new maplibregl.Map({
                container: 'map',
                center: [initialViewState.longitude, initialViewState.latitude],
                zoom: initialViewState.zoom,
                pitch: initialViewState.pitch,
                bearing: initialViewState.bearing,
                style: `https://basemaps.cartocdn.com/gl/${mapStyle.styleType}-gl-style/style.json`
            });
            map.addControl(new maplibregl.NavigationControl());
            map.on('moveend', updateLocationInputs).on('zoomend', updateLocationInputs);
            updateLocationInputs();
        
            form.styleSelect.value = mapStyle.styleType;
    
            // Add the deck.gl layers as an overlay
            deckOverlay = new deck.MapboxOverlay({
                interleaved: true,
                layers
            });
            map.addControl(deckOverlay);
        });
    } catch (e) {
        var mapContainer = document.getElementById('map');
        mapContainer.parentNode.removeChild(mapContainer);
        document.getElementById('config-fields').setAttribute('disabled', 'yes');
        openErrorModal('This site requires WebGL, but your browser doesn\'t seem' +
            ' to support it: ' + e.message);
    }
    
}
initMap();

//
// Geolocation
//

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        'use strict';
        map.flyTo({center: [position.coords.longitude,
            position.coords.latitude], zoom: 10});
    });
}



//
// Errors
//

var maxSize;
if (map) {
    var canvas = map.getCanvas();
    var gl = canvas.getContext('experimental-webgl');
    maxSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
}

var errors = {
    width: {
        state: false,
        msg: 'Width must be a positive number!',
        grp: 'widthGroup'
    },
    height: {
        state: false,
        grp: 'heightGroup'
    },
    dpi: {
        state: false,
        msg: 'DPI must be a positive number!',
        grp: 'dpiGroup'
    }
};

function handleErrors() {
    'use strict';
    var errorMsgElem = document.getElementById('error-message');
    var anError = false;
    var errorMsg;
    for (var e in errors) {
        e = errors[e];
        if (e.state) {
            if (anError) {
                errorMsg += ' ' + e.msg;
            } else {
                errorMsg = e.msg;
                anError = true;
            }
            document.getElementById(e.grp).classList.add('has-error');
        } else {
            document.getElementById(e.grp).classList.remove('has-error');
        }
    }
    if (anError) {
        errorMsgElem.innerHTML = errorMsg;
        errorMsgElem.style.display = 'block';
    } else {
        errorMsgElem.style.display = 'none';
    }
}

function isError() {
    'use strict';
    for (var e in errors) {
        if (errors[e].state) {
            return true;
        }
    }
    return false;
}



//
// Configuration changes / validation
//

document.getElementById('load-map-btn').addEventListener('click', initMap);

form.widthInput.addEventListener('change', function(e) {
    'use strict';
    var unit = form.unitOptions[0].checked ? 'in' : 'mm';
    var val = (unit == 'mm') ? Number(e.target.value / 25.4) : Number(e.target.value);
    var dpi = Number(form.dpiInput.value);
    if (val > 0) {
        if (val * dpi > maxSize) {
            errors.width.state = true;
            errors.width.msg = 'The maximum image dimension is ' + maxSize +
                'px, but the width entered is ' + (val * dpi) + 'px.';
        } else if (val * window.devicePixelRatio * 96 > maxSize) {
            errors.width.state = true;
            errors.width.msg = 'The width is unreasonably big!';
        } else {
            errors.width.state = false;
            if (unit == 'mm') val *= 25.4;
            document.getElementById('map').style.width = toPixels(val);
            map.resize();
        }
    } else {
        errors.width.state = true;
        errors.height.msg = 'Width must be a positive number!';
    }
    handleErrors();
});

form.heightInput.addEventListener('change', function(e) {
    'use strict';
    var unit = form.unitOptions[0].checked ? 'in' : 'mm';
    var val = (unit == 'mm') ? Number(e.target.value / 25.4) : Number(e.target.value);
    var dpi = Number(form.dpiInput.value);
    if (val > 0) {
        if (val * dpi > maxSize) {
            errors.height.state = true;
            errors.height.msg = 'The maximum image dimension is ' + maxSize +
                'px, but the height entered is ' + (val * dpi) + 'px.';
        } else if (val * window.devicePixelRatio * 96 > maxSize) {
            errors.height.state = true;
            errors.height.msg = 'The height is unreasonably big!';
        } else {
            errors.height.state = false;
            if (unit == 'mm') val *= 25.4;
            document.getElementById('map').style.height = toPixels(val);
            map.resize();
        }
    } else {
        errors.height.state = true;
        errors.height.msg = 'Height must be a positive number!';
    }
    handleErrors();
});

form.dpiInput.addEventListener('change', function(e) {
    'use strict';
    var val = Number(e.target.value);
    if (val > 0) {
        errors.dpi.state = false;
        var event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, true);
        form.widthInput.dispatchEvent(event);
        form.heightInput.dispatchEvent(event);
    } else {
        errors.dpi.state = true;
    }
    handleErrors();
});

form.styleSelect.addEventListener('change', function() {
    'use strict';
    try {
        var style = `https://basemaps.cartocdn.com/gl/${form.styleSelect.value}-gl-style/style.json`;
        map.setStyle(style);
    } catch (e) {
        openErrorModal("Error changing style: " + e.message);
    }
});

form.mmUnit.addEventListener('change', function() {
    'use strict';
    form.widthInput.value *= 25.4;
    form.heightInput.value *= 25.4;
});

form.inUnit.addEventListener('change', function() {
    'use strict';
    form.widthInput.value /= 25.4;
    form.heightInput.value /= 25.4;
});

if (form.unitOptions[1].checked) {
    // Millimeters
    form.widthInput.value *= 25.4;
    form.heightInput.value *= 25.4;
}

form.latInput.addEventListener('change', function() {
    'use strict';
    map.setCenter([form.lonInput.value, form.latInput.value]);
});

form.lonInput.addEventListener('change', function() {
    'use strict';
    map.setCenter([form.lonInput.value, form.latInput.value]);
});

form.zoomInput.addEventListener('change', function(e) {
    'use strict';
    map.setZoom(e.target.value);
});


//
// Error modal
//

var origBodyPaddingRight;

function openErrorModal(msg) {
    'use strict';
    var modal = document.getElementById('errorModal');
    document.getElementById('modal-error-text').innerHTML = msg;
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    document.getElementById('modalBackdrop').style.height =
        modal.scrollHeight + 'px';
    document.getElementById('modalBackdrop').style.display = 'block';

    if (document.body.scrollHeight > document.documentElement.clientHeight) {
        origBodyPaddingRight = document.body.style.paddingRight;
        var padding = parseInt((document.body.style.paddingRight || 0), 10);
        document.body.style.paddingRight = padding + measureScrollbar() + 'px';
    }
}

function closeErrorModal() {
    'use strict';
    document.getElementById('errorModal').style.display = 'none';
    document.getElementById('modalBackdrop').style.display = 'none';
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = origBodyPaddingRight;
}

function measureScrollbar() {
    'use strict';
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
}



//
// Helper functions
//

function toPixels(length) {
    'use strict';
    var unit = form.unitOptions[0].checked ? 'in' : 'mm';
    var conversionFactor = 96;
    if (unit == 'mm') {
        conversionFactor /= 25.4;
    }

    return conversionFactor * length + 'px';
}



//
// High-res map rendering
//

document.getElementById('generate-btn').addEventListener('click', generateMap);


function generateMap() {
    'use strict';

    if (isError()) {
        openErrorModal('The current configuration is invalid! Please ' +
            'correct the errors and try again.');
        return;
    }

    document.getElementById('spinner').style.display = 'inline-block';
    document.getElementById('generate-btn').classList.add('disabled');

    var width = Number(form.widthInput.value);
    var height = Number(form.heightInput.value);

    var dpi = Number(form.dpiInput.value);

    var format = form.outputOptions[0].checked ? 'png' : 'pdf';

    var unit = form.unitOptions[0].checked ? 'in' : 'mm';

    var style = `https://basemaps.cartocdn.com/gl/${form.styleSelect.value}-gl-style/style.json`;

    var zoom = map.getZoom();
    var center = map.getCenter();
    var bearing = map.getBearing();
    var pitch = map.getPitch();

    createPrintMap(width, height, dpi, format, unit, zoom, center,
        bearing, style, pitch);
}

function createPrintMap(width, height, dpi, format, unit, zoom, center,
    bearing, style, pitch) {
    'use strict';

    // Calculate pixel ratio
    var actualPixelRatio = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', {
        get: function() {return dpi / 96}
    });

    // Create map container
    var hidden = document.createElement('div');
    hidden.className = 'hidden-map';
    document.body.appendChild(hidden);
    var container = document.createElement('div');
    container.style.width = toPixels(width);
    container.style.height = toPixels(height);
    hidden.appendChild(container);

    // Render map
    var renderMap = new maplibregl.Map({
        container: container,
        center: center,
        zoom: zoom,
        style: style,
        bearing: bearing,
        pitch: pitch,
        interactive: false,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
        attributionControl: false
    });
    renderMap.addControl(new deck.MapboxOverlay({
        interleaved: true,
        // Clone the layers with a random ID to avoid issues
        // when adding the layers to the hidden div
        layers: deckLayers.map(l => l.clone({
            id: ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                )
        }))
    }));
    renderMap.once('idle', function() {
        if (format == 'png') {
            renderMap.getCanvas().toBlob(function(blob) {
                saveAs(blob, 'map.png');
            });
        } else {
            var pdf = new jsPDF({
                orientation: width > height ? 'l' : 'p',
                unit: unit,
                format: [width, height],
                compress: true
            });

            pdf.addImage(renderMap.getCanvas().toDataURL('image/png'),
                'png', 0, 0, width, height, null, 'FAST');

            var title = map.getStyle().name,
                subject = "center: [" + form.lonInput.value  + ", " + form.latInput.value + ", " + form.zoomInput.value + "]",
                attribution = '(c) CARTO, (c) OpenStreetMap';

            pdf.setProperties({
                title: title,
                subject: subject,
                creator: 'Print Maps',
                author: attribution
            })

            pdf.save('map.pdf');
        }

        renderMap.remove();
        hidden.parentNode.removeChild(hidden);
        Object.defineProperty(window, 'devicePixelRatio', {
            get: function() {return actualPixelRatio}
        });
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('generate-btn').classList.remove('disabled');
    });
}
