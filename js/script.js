// js/script.js

$(document).ready(function() {

    let mapInstance = null;
    let markersGroup = null;
    let dataLoaded = {};
    let uploadModal = new bootstrap.Modal(document.getElementById('uploadModal'));

    // --- MANEJADORES DE EVENTOS DEL NAVBAR ---

    $('#uploadNewFileBtn').on('click', function(e) {
        e.preventDefault();
        uploadModal.show();
    });

    // Maneja el envío del formulario para cargar el archivo Excel
    $('#uploadForm').on('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        uploadModal.hide();

        toggleLoadingState(true);

        $.ajax({
            url: 'procesar.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(response) {
                toggleLoadingState(false);
                if (response.status === 'success') {
                    resetInterface(false); // Limpia la interfaz sin mostrar el mensaje de bienvenida
                    dataLoaded = response;
                    $('#dataContainer').removeClass('d-none');
                    $('#welcomeMessage').addClass('d-none');
                    updateNavbar(true);
                    displayControls(dataLoaded);
                } else {
                    alert('Error del servidor: ' + response.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                toggleLoadingState(false);
                alert('Error de conexión. Revisa la consola para más detalles.');
                console.error("AJAX error:", textStatus, errorThrown, jqXHR.responseText);
            }
        });
    });

    // Muestra/oculta el spinner de carga
    function toggleLoadingState(isLoading) {
        if (isLoading) {
            $('#welcomeMessage').addClass('d-none');
            $('#loading').removeClass('d-none');
            $('#dataContainer').addClass('d-none');
        } else {
            $('#loading').addClass('d-none');
        }
    }

    // Actualiza la visibilidad de los menús del navbar
    function updateNavbar(dataIsLoaded) {
        if (dataIsLoaded) {
            $('#resetSessionBtn').removeClass('d-none');
            $('#viewMenuContainer').removeClass('d-none');
        } else {
            $('#resetSessionBtn').addClass('d-none');
            $('#viewMenuContainer').addClass('d-none');
        }
    }

    // Muestra los selectores de hoja y columna
    function displayControls(data) {
        const originalFileName = $('#dataFile')[0].files[0]?.name || 'datos';
        $('#dataTitle').html(`<i class="bi bi-file-earmark-spreadsheet me-2"></i> ${originalFileName}`);

        let controlsHtml = `
            <div class="p-3 mb-3 bg-light border rounded">
                <p class="fw-bold mb-2"><i class="bi bi-gear-fill me-2"></i>Configuración de Columnas</p>
                <p class="small text-muted mb-2">
                    Selecciona las columnas de tu archivo que contienen la latitud, longitud y (opcionalmente) el nombre para cada punto.
                </p>
                <div class="d-flex justify-content-end">
                    <button id="showOnMapBtn" class="btn btn-success btn-sm">
                        <i class="bi bi-pin-map-fill me-2"></i>Aplicar y Mostrar en Mapa
                    </button>
                </div>
            </div>
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <label for="sheetSelector" class="form-label">Selecciona una hoja:</label>
                    <select id="sheetSelector" class="form-select">
                        ${data.sheets.map(sheet => `<option value="${sheet}" ${sheet === data.sheetName ? 'selected' : ''}>${sheet}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="latColumn" class="form-label">Columna de Latitud:</label>
                    <select id="latColumn" class="form-select">
                        <option value="">-- Selecciona --</option>
                        ${data.headers.map(h => `<option value="${h}">${h}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="lonColumn" class="form-label">Columna de Longitud:</label>
                    <select id="lonColumn" class="form-select">
                        <option value="">-- Selecciona --</option>
                        ${data.headers.map(h => `<option value="${h}">${h}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="nameColumn" class="form-label">Columna de Nombres (opcional):</label>
                    <select id="nameColumn" class="form-select">
                        <option value="">-- Ninguna --</option>
                        ${data.headers.map(h => `<option value="${h}">${h}</option>`).join('')}
                    </select>
                </div>
            </div>
        `;
        $('#controls').html(controlsHtml);

        // Evento para cambiar de hoja
        $('#sheetSelector').on('change', function() {
            const selectedSheet = $(this).val();
            const formData = new FormData($('#uploadForm')[0]);
            formData.append('sheetName', selectedSheet);
            
            toggleLoadingState(true);

            $.ajax({
                url: 'procesar.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function(response) {
                    toggleLoadingState(false);
                    if (response.status === 'success') {
                        dataLoaded = response;
                        $('#dataContainer').removeClass('d-none');
                        // No es necesario ocultar el formulario aquí, ya que está en un modal
                        displayControls(dataLoaded);
                    } else {
                        alert('Error al cambiar de hoja: ' + response.message);
                    }
                }
            });
        });

        // Evento para mostrar los datos en el mapa
        $('#showOnMapBtn').on('click', function() {
            const latCol = $('#latColumn').val();
            const lonCol = $('#lonColumn').val();
            const nameCol = $('#nameColumn').val(); // Se obtiene el valor de la nueva columna
            if (!latCol || !lonCol) {
                alert('Por favor, selecciona las columnas de latitud y longitud.');
                return;
            }
            renderMap(data.rows, latCol, lonCol, nameCol);
        });

        renderTable(data.rows, data.headers);
    }
    
    // --- MANEJADORES DE EVENTOS DE VISUALIZACIÓN ---
    $('#resetSessionBtn').on('click', function(e) {
        e.preventDefault();
        resetInterface(true);
    });

    $('#toggleControlsBtn').on('click', function(e) {
        e.preventDefault();
        $('#controls').slideToggle();
    });

    $('#toggleTableBtn').on('click', function(e) {
        e.preventDefault();
        $('#table-display').slideToggle();
    });

    $('#centerMapBtn').on('click', function(e) {
        e.preventDefault();
        if (mapInstance && markersGroup && !markersGroup.getBounds().isEmpty()) {
            mapInstance.fitBounds(markersGroup.getBounds());
        }
    });

    $('#downloadMapBtn').on('click', function(e) {
        e.preventDefault();
        if (!mapInstance) {
            alert('Primero debes generar un mapa para poder descargarlo.');
            return;
        }

        if (!mapInstance.hasLayer(osmLayer)) {
            alert('La descarga de imágenes solo es compatible con la capa "OpenStreetMap" debido a restricciones de otros proveedores. Por favor, cambia a esa capa para descargar el mapa.');
            return;
        }

        // Usar leaflet-image para capturar el mapa
        leafletImage(mapInstance, function(err, canvas) {
            if (err) {
                alert('Ocurrió un error al intentar generar la imagen del mapa.');
                console.error(err);
                return;
            }

            // Crear un enlace temporal para la descarga
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png'); // Convertir canvas a Data URL
            link.download = 'mapa_coordenadas.png'; // Nombre del archivo
            link.click(); // Simular clic para iniciar la descarga
        });
    });

    // Función para resetear la interfaz y permitir una nueva carga
    function resetInterface(showWelcomeMessage) {
        // Limpiar variables de capas globales
        osmLayer = null;

        if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
            markersGroup = null;
        }

        $('#dataContainer').addClass('d-none');
        $('#controls').empty();
        $('#table-display').empty();

        $('#uploadForm')[0].reset();
        dataLoaded = {};
        updateNavbar(false);

        if (showWelcomeMessage) {
            $('#welcomeMessage').removeClass('d-none');
        }
    }

    // Renderiza la tabla de datos
    function renderTable(rows, headers) {
        let tableHtml = `<table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    ${headers.map(header => `<th>${header}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${rows.map(row => `<tr>${headers.map(header => `<td>${row[header] ?? ''}</td>`).join('')}</tr>`).join('')}
                            </tbody>
                         </table>`;

        $('#table-display').html(tableHtml);
    }
    
    // Renderiza el mapa y los marcadores
    function renderMap(rows, latCol, lonCol, nameCol) {
        // Se declara la variable de la capa OSM globalmente para poder verificarla en la descarga
        window.osmLayer = null;

        if (mapInstance) {
            mapInstance.remove();
        }
        if (markersGroup) {
            markersGroup.clearLayers();
            markersGroup = null;
        }
        
        const southWest = L.latLng(-4.5, -80);
        const northEast = L.latLng(13, -66);
        const bounds = L.latLngBounds(southWest, northEast);

        mapInstance = L.map('map-container', {
            center: [4.7110, -74.0721],
            zoom: 5,
            maxBounds: bounds,
            minZoom: 5,
        });

        // --- Definición de Capas Base ---

        // 1. OpenStreetMap (compatible con descarga)
        osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            crossOrigin: true
        });

        // 2. Satélite (Esri)
        const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
        });

        // 3. Mapa claro (CartoDB)
        const cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	        subdomains: 'abcd',
	        maxZoom: 20
        });

        const baseMaps = {
            "OpenStreetMap": osmLayer,
            "Satélite": esriSat,
            "Claro": cartoLight
        };

        // Crear un ícono más pequeño para los marcadores
        const smallIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            iconSize:    [18, 29], // Tamaño reducido (original: [25, 41])
            iconAnchor:  [9, 29],  // Punta del marcador (original: [12, 41])
            popupAnchor: [1, -25], // Posición del popup (original: [1, -34])
            shadowSize:  [29, 29]  // Tamaño de la sombra (original: [41, 41])
        });

        const markers = [];
        let validPointsFound = false;
        rows.forEach(row => {
            const lat = parseFloat(row[latCol]);
            const lon = parseFloat(row[lonCol]);
            // Se obtiene el valor de la nueva columna seleccionada, si existe
            const name = nameCol ? row[nameCol] : 'Punto';

            if (!isNaN(lat) && !isNaN(lon) && lat >= -4.5 && lat <= 13 && lon >= -80 && lon <= -66) {
                const marker = L.marker([lat, lon], { icon: smallIcon });
                // El popup ahora usa el nombre de la columna seleccionada
                marker.bindPopup(`<b>${name}</b><br>Latitud: ${lat}<br>Longitud: ${lon}`);
                markers.push(marker);
                validPointsFound = true;
            }
        });

        if (validPointsFound) {
            markersGroup = L.featureGroup(markers).addTo(mapInstance);
            mapInstance.fitBounds(markersGroup.getBounds());
        } else {
            alert('No se encontraron puntos válidos dentro de las coordenadas de Colombia. Por favor, revisa tus datos de latitud y longitud.');
        }

        // Añadir capa por defecto y control de capas
        osmLayer.addTo(mapInstance);
        L.control.layers(baseMaps, null, {
            position: 'topright'
        }).addTo(mapInstance);
    }
});