# Guía de Integración de Anuncios en la Página AFK

Para reemplazar los placeholders de anuncios laterales en la página AFK con anuncios reales, sigue estos pasos:

1.  **Elige una Red de Anuncios:**
    *   Selecciona un proveedor de servicios publicitarios (Ad Network) de tu preferencia. Algunas opciones populares incluyen Google AdSense, Media.net, Ezoic, u otras especializadas.
    *   Deberás registrarte como editor en su plataforma y pasar por un proceso de aprobación, que puede requerir que tu sitio web cumpla con ciertos requisitos.

2.  **Configura Unidades de Anuncio y Obtén el Código:**
    *   Una vez aprobado, dentro del panel de control de la red de anuncios, configurarás "unidades de anuncio" (ad units) o "bloques de anuncios" para los espacios donde deseas mostrar publicidad.
    *   La red te proporcionará fragmentos de código HTML y/o JavaScript específicos para cada unidad de anuncio. Este código es el que se inserta en tu página web.

3.  **Reemplaza los Placeholders en `src/app/afk/page.tsx`:**
    *   Abre el archivo `/root/LumaTienda/app-lumatienda/src/app/afk/page.tsx`.
    *   Localiza los `div` que actualmente actúan como placeholders para los anuncios laterales. Son los siguientes:

        ```jsx
        {/* Left Ad Placeholder */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-center h-64 md:h-auto">
          <p className="text-xl text-gray-400">Anuncio Lateral Izquierdo</p>
        </div>

        {/* Right Ad Placeholder */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-center h-64 md:h-auto">
          <p className="text-xl text-gray-400">Anuncio Lateral Derecho</p>
        </div>
        ```

    *   **Sustituye el contenido** de estos `div` (o los `div` completos, si así lo indica la red de anuncios) con el código HTML/JavaScript que te haya proporcionado tu proveedor de anuncios.

        **Ejemplo (hipotético, NO usar directamente):**
        Si tu red de anuncios te diera un código como este:
        ```html
        <div id="mi-anuncio-izquierdo"></div>
        <script async src="https://ads.example.com/ad-loader.js"></script>
        <script>
          (function() {
            var ad = document.getElementById('mi-anuncio-izquierdo');
            ad.innerHTML = '<!-- Contenido del anuncio real aquí -->';
          })();
        </script>
        ```
        Lo insertarías dentro del `div` del placeholder izquierdo.

**Consideraciones Importantes:**

*   **Políticas de la Red de Anuncios:** Asegúrate de cumplir con todas las políticas de la red de anuncios. El incumplimiento puede llevar a la suspensión de tu cuenta.
*   **Rendimiento:** La carga de anuncios externos puede afectar el rendimiento de tu página. Monitorea los tiempos de carga.
*   **Pruebas:** Es crucial probar la integración de los anuncios en un entorno de desarrollo antes de desplegarlos en producción para asegurarte de que se muestren correctamente y no causen conflictos.
*   **Naturaleza del Sandbox:** Dentro de este entorno de desarrollo con IA, **no puedo interactuar con redes de anuncios reales** ni generar el código específico que necesitas. Este proceso debe ser realizado por ti directamente con el proveedor de anuncios de tu elección.

Espero que esta guía te sea útil para integrar tus anuncios.