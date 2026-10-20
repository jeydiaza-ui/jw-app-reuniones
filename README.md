# Reunión de la semana (PWA)

Aplicación para preparar las reuniones Vida y Ministerio Cristianos. Funciona en el navegador y se puede instalar en el teléfono. No necesita servidor.

## Archivos
- `index.html`: la aplicación completa.
- `manifest.json`: datos para instalarla (nombre, colores, iconos).
- `sw.js`: permite abrirla sin conexión.
- `icon-192.png` y `icon-512.png`: iconos de la torre.

## Subir a GitHub
1. En github.com pulsa **+ → New repository**, ponle un nombre (por ejemplo `reunion-semana`) y pulsa **Create repository**.
2. Pulsa **uploading an existing file**, arrastra todos los archivos de esta carpeta y pulsa **Commit changes**.
3. Ve a **Settings → Pages**. En **Build and deployment**, elige **Deploy from a branch**, branch **main**, carpeta **/ (root)** y pulsa **Save**.
4. Espera uno o dos minutos. La dirección será `https://TU_USUARIO.github.io/reunion-semana/`.

## Instalar en el teléfono
- **Android (Chrome):** abre la dirección, menú ⋮ → **Instalar aplicación** o **Añadir a pantalla de inicio**.
- **iPhone (Safari):** abre la dirección, botón Compartir → **Añadir a pantalla de inicio**.

## Uso
- En la pantalla principal, pulsa **✏️ Editar semana** para cambiar la fecha, la lectura, las partes de entre semana y los datos del fin de semana. Pulsa **Guardar** al terminar.
- Los datos se guardan en el propio dispositivo. Usa **Exportar respaldo** para pasarlos a otro teléfono.

## Actualizar la app
Cuando cambies `index.html` en GitHub, la próxima vez que abras la app con conexión tendrá la versión nueva.
