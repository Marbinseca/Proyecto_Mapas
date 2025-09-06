# Visualizador de Coordenadas en Mapa

Esta es una aplicación web sencilla que permite a los usuarios subir archivos de datos (Excel o CSV) que contienen coordenadas geográficas (latitud y longitud) y visualizarlos como marcadores en un mapa interactivo.

## ✨ Características

- **Carga de Archivos**: Soporta la subida de archivos `.xlsx`, `.xls` y `.csv` a través de una ventana modal.
- **Interfaz Moderna con Menús**: Navegación intuitiva a través de menús desplegables para "Archivo" y "Visualización".
- **Múltiples Capas de Mapa**: Permite al usuario cambiar entre diferentes vistas de mapa:
  - **OpenStreetMap**: Mapa de calles estándar.
  - **Satélite**: Vista satelital de alta resolución (proveída por Esri).
  - **Claro**: Un mapa minimalista para resaltar los datos (proveído por Carto).
- **Descarga de Mapa**: Opción para descargar la vista actual del mapa como una imagen PNG (disponible en la capa OpenStreetMap).
- **Controles de Visualización**: Menú para mostrar/ocultar los controles de configuración y la tabla de datos, así como para centrar el mapa en los puntos cargados.
- **Selección de Hoja y Columnas**: Permite seleccionar la hoja de cálculo y mapear dinámicamente las columnas de latitud, longitud y nombre.
- **Limpiar Sesión**: Funcionalidad para reiniciar la aplicación y cargar un nuevo archivo sin necesidad de recargar la página.
- **Vista Previa de Datos**: Muestra los datos del archivo cargado en una tabla para una fácil revisión.
- **Procesamiento en el Servidor**: Utiliza PHP y la librería `PhpSpreadsheet` para leer y procesar los datos de los archivos de forma eficiente.

---

## 🚀 Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Requisitos Previos

- Un servidor web local (como XAMPP, WAMP, MAMP o el servidor integrado de PHP).
- PHP (versión 7.4 o superior).
- Composer para gestionar las dependencias de PHP.

### ⚙️ Instalación

1.  **Clona el repositorio** (o descarga los archivos en tu directorio de trabajo):
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd Proyecto_Mapas
    ```

2.  **Instala las dependencias de PHP**:
    Ejecuta Composer en la raíz del proyecto para descargar `phpoffice/phpspreadsheet` y sus dependencias.
    ```bash
    composer install
    ```
    Esto creará la carpeta `vendor/`, que es necesaria para que el script `procesar.php` funcione.

3.  **Inicia tu servidor web**:
    Apunta la raíz de tu servidor web al directorio del proyecto (`Proyecto_Mapas`).

4.  **Abre la aplicación**:
    Navega a la URL de tu servidor local en tu navegador (por ejemplo, `http://localhost/Proyecto_Mapas/`).

---

## 📖 ¿Cómo se usa?

1.  **Cargar un archivo**: Ve al menú `Archivo` > `Cargar Nuevo Archivo`. Se abrirá una ventana donde podrás seleccionar un fichero `.xlsx`, `.xls` o `.csv`.

3.  **Configura las columnas**:
    - Una vez cargado el archivo, aparecerá el panel de configuración.
    - Si el archivo es un Excel con varias hojas, selecciona la hoja correcta en el desplegable "Selecciona una hoja".
    - En los desplegables "Columna de Latitud" y "Columna de Longitud", elige las columnas que contienen las coordenadas.
    - (Opcional) Selecciona una columna en "Columna de Nombres" para que los marcadores en el mapa muestren un título específico.

4.  **Muestra en el mapa**: Haz clic en el botón "Aplicar y Mostrar en Mapa".

5.  **Explora y Personaliza**:
    - Los puntos aparecerán en el mapa. Haz clic en cada marcador para ver su información.
    - Usa el control en la esquina superior derecha del mapa para cambiar entre las capas "OpenStreetMap", "Satélite" y "Claro".
    - Utiliza el menú `Visualización` para ocultar elementos, centrar el mapa o descargarlo como imagen.

---

## 🛠️ Tecnologías Utilizadas

- **Backend**:
  - PHP
  - PhpOffice/PhpSpreadsheet
- **Frontend**:
  - HTML5 / CSS3
  - Bootstrap 5
  - JavaScript
  - jQuery
  - Leaflet.js
  - leaflet-image
