// js/script.js

$(document).ready(function() {

    let mapInstance = null;
    let dataLoaded = {};

    // Maneja el envío del formulario para cargar el archivo Excel
    $('#uploadForm').on('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);

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
            $('#loading').removeClass('d-none');
            $('#dataContainer').addClass('d-none');
        } else {
            $('#loading').addClass('d-none');
        }
    }

    // Muestra los selectores de hoja y columna
    function displayControls(data) {
        let controlsHtml = `
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
            <div class="text-center mb-3">
                <button id="showOnMapBtn" class="btn btn-success">Mostrar en el Mapa</button>
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
        if (mapInstance) {
            mapInstance.remove();
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

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
            bounds: bounds
        }).addTo(mapInstance);

        const markers = [];
        let validPointsFound = false;
        rows.forEach(row => {
            const lat = parseFloat(row[latCol]);
            const lon = parseFloat(row[lonCol]);
            // Se obtiene el valor de la nueva columna seleccionada, si existe
            const name = nameCol ? row[nameCol] : 'Punto';

            if (!isNaN(lat) && !isNaN(lon) && lat >= -4.5 && lat <= 13 && lon >= -80 && lon <= -66) {
                const marker = L.marker([lat, lon]);
                // El popup ahora usa el nombre de la columna seleccionada
                marker.bindPopup(`<b>${name}</b><br>Latitud: ${lat}<br>Longitud: ${lon}`);
                markers.push(marker);
                validPointsFound = true;
            }
        });

        if (validPointsFound) {
            const group = L.featureGroup(markers).addTo(mapInstance);
            mapInstance.fitBounds(group.getBounds());
        } else {
            alert('No se encontraron puntos válidos dentro de las coordenadas de Colombia. Por favor, revisa tus datos de latitud y longitud.');
        }
    }
});