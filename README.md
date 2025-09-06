# Visualizador de Coordenadas en Mapa

Esta es una aplicación web sencilla que permite a los usuarios subir archivos de datos (Excel o CSV) que contienen coordenadas geográficas (latitud y longitud) y visualizarlos como marcadores en un mapa interactivo.

## ✨ Características

- **Carga de Archivos**: Soporta la subida de archivos `.xlsx`, `.xls` y `.csv`.
- **Procesamiento en el Servidor**: Utiliza PHP y la librería `PhpSpreadsheet` para leer y procesar los datos de los archivos de forma eficiente.
- **Selección de Hoja**: Si un archivo Excel contiene múltiples hojas, la aplicación permite al usuario seleccionar cuál de ellas visualizar.
- **Mapeo Dinámico de Columnas**: El usuario puede seleccionar dinámicamente qué columnas del archivo corresponden a la **latitud**, la **longitud** y el **nombre** de cada punto.
- **Visualización en Mapa**: Renderiza los puntos en un mapa interactivo usando Leaflet.js, centrado en el territorio de Colombia.
- **Vista Previa de Datos**: Muestra los datos del archivo cargado en una tabla para una fácil revisión.
- **Interfaz Limpia**: Construido con Bootstrap para una experiencia de usuario limpia y responsiva.

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

1.  **Selecciona un archivo**: Haz clic en el botón "Seleccionar archivo" y elige un fichero `.xlsx`, `.xls` o `.csv` de tu equipo.
    > 💡 Puedes usar los ficheros de la carpeta `Ejemplo_Datos/` para probar.

2.  **Sube el archivo**: Haz clic en el botón "Subir Archivo". La aplicación procesará los datos.

3.  **Configura las columnas**:
    - Si el archivo es un Excel con varias hojas, selecciona la hoja correcta en el desplegable "Selecciona una hoja".
    - En los desplegables "Columna de Latitud" y "Columna de Longitud", elige las columnas que contienen las coordenadas.
    - (Opcional) Selecciona una columna en "Columna de Nombres" para que los marcadores en el mapa muestren un título específico.

4.  **Muestra en el mapa**: Haz clic en el botón "Mostrar en el Mapa".

5.  **Explora**: Los puntos aparecerán en el mapa. Puedes hacer clic en cada marcador para ver su información. La tabla de abajo te mostrará todos los datos del archivo.

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
