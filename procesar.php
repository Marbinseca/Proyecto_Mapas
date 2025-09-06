<?php
// procesar.php
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Exception as ReaderException;

header('Content-Type: application/json');

if (!isset($_FILES['dataFile']) || $_FILES['dataFile']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['status' => 'error', 'message' => 'Error al subir el archivo. Código de error: ' . (isset($_FILES['dataFile']) ? $_FILES['dataFile']['error'] : 'N/A')]);
    exit;
}

$inputFileName = $_FILES['dataFile']['tmp_name'];
$fileExtension = pathinfo($_FILES['dataFile']['name'], PATHINFO_EXTENSION);
$data = [];

try {
    if (in_array($fileExtension, ['xlsx', 'xls'])) {
        // Lógica para archivos de Excel
        $spreadsheet = IOFactory::load($inputFileName);
        $sheetNames = [];
        foreach ($spreadsheet->getAllSheets() as $sheet) {
            $sheetNames[] = $sheet->getTitle();
        }

        $sheetName = isset($_POST['sheetName']) && in_array($_POST['sheetName'], $sheetNames) ? $_POST['sheetName'] : $sheetNames[0];
        $worksheet = $spreadsheet->getSheetByName($sheetName);
        if ($worksheet === null) {
            throw new \Exception('Hoja de cálculo no encontrada.');
        }
        
        $sheetData = $worksheet->toArray(null, true, true, true);
        $headers = array_shift($sheetData);
        
        $rows = [];
        foreach ($sheetData as $row) {
            $rowData = [];
            foreach ($headers as $index => $header) {
                $value = $row[$index] ?? null;
                if (is_string($value) && strpos($value, ',') !== false) {
                    $value = str_replace(',', '.', $value);
                }
                $rowData[$header] = $value;
            }
            $rows[] = $rowData;
        }

        $data['status'] = 'success';
        $data['sheets'] = $sheetNames;
        $data['sheetName'] = $sheetName;
        $data['headers'] = array_values($headers);
        $data['rows'] = $rows;
    } elseif ($fileExtension === 'csv') {
        // Lógica para archivos CSV
        $handle = fopen($inputFileName, 'r');
        if ($handle === false) {
            throw new \Exception('No se pudo abrir el archivo CSV.');
        }

        $headers = fgetcsv($handle, 1000, ',');
        if ($headers === false) {
            throw new \Exception('No se pudieron leer los encabezados del archivo CSV.');
        }
        
        $rows = [];
        while (($row = fgetcsv($handle, 1000, ',')) !== false) {
            $rowData = [];
            foreach ($headers as $index => $header) {
                $value = $row[$index] ?? null;
                // Manejar la conversión de comas a puntos también para CSV
                if (is_string($value) && strpos($value, ',') !== false) {
                    $value = str_replace(',', '.', $value);
                }
                $rowData[$header] = $value;
            }
            $rows[] = $rowData;
        }
        fclose($handle);

        $data['status'] = 'success';
        // En un CSV solo hay una "hoja", así que simulamos el comportamiento
        $data['sheets'] = ['Datos'];
        $data['sheetName'] = 'Datos';
        $data['headers'] = array_values($headers);
        $data['rows'] = $rows;
    } else {
        throw new \Exception('Formato de archivo no soportado. Por favor, sube un archivo Excel o CSV.');
    }
} catch (ReaderException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al leer el archivo de Excel: ' . $e->getMessage()]);
    exit;
} catch (\Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al procesar el archivo: ' . $e->getMessage()]);
    exit;
}

echo json_encode($data);
?>