<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualizador de Coordenadas</title>
    <link rel="icon" type="image/png" href="img/icono.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <style>
        body {
            background-color: #f8f9fa;
        }
        #map-container {
            height: 500px;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 0.375rem;
        }
        .table-responsive {
            max-height: 400px;
        }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="index.php">
                <i class="bi bi-geo-alt-fill me-2"></i>
                Visualizador de Coordenadas
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="fileMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-file-earmark-arrow-up me-1"></i> Archivo
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="fileMenu">
                            <li><a class="dropdown-item" href="#" id="uploadNewFileBtn"><i class="bi bi-upload me-2"></i>Cargar Nuevo Archivo</a></li>
                            <li><a class="dropdown-item d-none" href="#" id="resetSessionBtn"><i class="bi bi-arrow-clockwise me-2"></i>Limpiar Sesión</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown d-none" id="viewMenuContainer">
                        <a class="nav-link dropdown-toggle" href="#" id="viewMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-eye me-1"></i> Visualización
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="viewMenu">
                            <li><a class="dropdown-item" href="#" id="toggleControlsBtn"><i class="bi bi-sliders me-2"></i>Mostrar/Ocultar Controles</a></li>
                            <li><a class="dropdown-item" href="#" id="toggleTableBtn"><i class="bi bi-table me-2"></i>Mostrar/Ocultar Tabla</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#" id="centerMapBtn"><i class="bi bi-fullscreen-exit me-2"></i>Centrar Mapa en Puntos</a></li>
                            <li><a class="dropdown-item" href="#" id="downloadMapBtn"><i class="bi bi-download me-2"></i>Descargar Mapa (PNG)</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container my-5">
        <div id="welcomeMessage" class="text-center">
            <h1 class="display-5">Visualiza tus Datos en el Mapa</h1>
            <p class="lead text-muted">Para comenzar, ve al menú <kbd>Archivo</kbd> > <kbd>Cargar Nuevo Archivo</kbd>.</p>
            <i class="bi bi-map" style="font-size: 8rem; color: #dee2e6;"></i>
        </div>

        <div id="loading" class="text-center my-5 d-none">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 fs-5">Procesando archivo, por favor espera...</p>
        </div>

        <div id="dataContainer" class="d-none">
            <div class="card shadow-sm">
                <div class="card-header bg-light py-3 d-flex justify-content-between align-items-center">
                    <h5 id="dataTitle" class="mb-0"><i class="bi bi-map me-2"></i>Mapa y Datos</h5>
                </div>
                <div class="card-body p-4">
                    <div id="controls" class="mb-4"></div>
                    <div id="map-container" class="mb-4"></div>
                    <div id="table-display" class="table-responsive"></div>
                </div>
            </div>
        </div>
    </main>

    <!-- Modal para subir archivo -->
    <div class="modal fade" id="uploadModal" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="uploadModalLabel"><i class="bi bi-upload me-2"></i>Cargar Archivo de Datos</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="uploadForm" action="procesar.php" method="post" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label for="dataFile" class="form-label">Selecciona un archivo (.xlsx, .xls, .csv):</label>
                            <input type="file" name="dataFile" id="dataFile" class="form-control" accept=".xlsx, .xls, .csv" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100"><i class="bi bi-cloud-arrow-up-fill me-2"></i>Cargar y Procesar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/leaflet-image@0.4.0/dist/leaflet-image.js"></script>

    <script src="js/script.js"></script>

</body>
</html>