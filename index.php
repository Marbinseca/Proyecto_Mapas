<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualizador de Mapas desde Excel/CSV</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <style>
        #map-container {
            height: 500px;
            width: 100%;
            margin-top: 20px;
            border: 1px solid #ccc;
        }
        .container {
            max-width: 900px;
        }
    </style>
</head>
<body>

    <div class="container my-5">
        <h1 class="text-center mb-4">Visualizador de Mapas desde Excel/CSV</h1>

        <div class="card p-4 shadow-sm">
            <form id="uploadForm" action="procesar.php" method="post" enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="dataFile" class="form-label">Selecciona un archivo (.xlsx, .xls, .csv):</label>
                    <input type="file" name="dataFile" id="dataFile" class="form-control" accept=".xlsx, .xls, .csv" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Cargar y Visualizar</button>
            </form>
        </div>

        <div id="loading" class="text-center mt-4 d-none">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            Cargando...
        </div>

        <div id="dataContainer" class="mt-4 d-none">
            <div id="controls"></div>
            <div id="map-container"></div>
            <div id="table-display" class="table-responsive mt-4"></div>
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>

</body>
</html>