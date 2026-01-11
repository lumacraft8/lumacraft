# Guía Detallada para Conectar un Dominio a tu Aplicación Next.js en un VPS

¡Conectar un dominio a tu aplicación le dará una dirección profesional y fácil de recordar! Esta guía te detallará los pasos generales para configurar tu dominio y que apunte a tu aplicación Next.js en el VPS. Asumiremos que usarás Nginx como proxy inverso y Certbot para HTTPS, que es una configuración estándar y segura.

**Nota Importante:** Yo no puedo realizar estas acciones directamente ya que requieren acceso a tu registrador de dominios, la configuración DNS de tu VPS y la instalación de software a nivel de sistema en tu servidor. Esta es una guía para que tú realices los pasos.

---

### Pasos a Seguir:

#### 1. Registrar tu Dominio (Si Aún No lo Has Hecho)

*   Si todavía no posees un nombre de dominio (por ejemplo, `tudominio.com`), deberás adquirir uno a través de un registrador de dominios. Algunos populares son GoDaddy, Namecheap, Hostinger, entre otros.

#### 2. Configurar los Registros DNS de tu Dominio

Esta es la parte más crítica para que tu dominio apunte a tu VPS.

*   Accede al panel de control de tu registrador de dominios (donde compraste el dominio).
*   Busca la sección de gestión de DNS, "Editor de Zonas" o similar.
*   **Añade un registro 'A' (Address Record) para tu dominio principal:**
    *   **Tipo de Registro:** `A`
    *   **Host/Nombre:** `@` (esto indica tu dominio principal, como `ejemplo.com`)
    *   **Valor/IP:** La dirección IP pública de tu VPS.
    *   **TTL (Time To Live):** Puedes dejarlo en el valor predeterminado (a menudo 3600 segundos o 1 hora).
*   **Añade un registro 'A' adicional para el subdominio 'www' (opcional pero muy recomendado):**
    *   **Tipo de Registro:** `A`
    *   **Host/Nombre:** `www`
    *   **Valor/IP:** La misma dirección IP pública de tu VPS.
    *   **TTL:** Por defecto.
    *   *(Alternativamente, podrías usar un registro CNAME para `www` apuntando a tu dominio principal (`@`), pero para simplificar, usar dos registros A es igualmente efectivo.)*
*   **Guarda todos los cambios.** Ten en cuenta que la propagación de DNS (el tiempo que tardan estos cambios en ser reconocidos por todos los servidores de Internet) puede tardar desde unos minutos hasta 48 horas.

#### 3. Instalar y Configurar Nginx en tu VPS (Si No Está Ya Instalado)

Nginx es un servidor web muy eficiente que actuará como un "proxy inverso". Esto significa que interceptará las solicitudes que lleguen a tu dominio y las reenviará a tu aplicación Next.js, que está corriendo internamente en el puerto `5173`.

*   **Accede a tu VPS por SSH.**
*   **Actualiza tu sistema e instala Nginx:**
    ```bash
    sudo apt update
    sudo apt install nginx -y
    ```
*   **Ajusta el Firewall (UFW - Uncomplicated Firewall):**
    Asegúrate de que Nginx pueda recibir tráfico web.
    ```bash
    sudo ufw allow 'Nginx Full' # Permite tráfico en los puertos 80 (HTTP) y 443 (HTTPS)
    sudo ufw allow ssh          # Asegúrate de que tu acceso SSH no se bloquee
    sudo ufw enable             # Habilita el firewall si no lo está. Confirma con 'y'
    ```
    Verifica el estado: `sudo ufw status`.
*   **Crea un Bloque de Servidor (Server Block) para tu Dominio en Nginx:**
    *   Crea un nuevo archivo de configuración para tu dominio. Reemplaza `tudominio.com` con tu dominio real.
        ```bash
        sudo nano /etc/nginx/sites-available/tudominio.com
        ```
    *   Pega la siguiente configuración dentro del archivo. **¡Recuerda reemplazar `tudominio.com` con tu dominio real!**
        ```nginx
        server {
            listen 80;
            listen [::]:80; # Para IPv6
            server_name tudominio.com www.tudominio.com; # Reemplaza con tu dominio

            location / {
                proxy_pass http://localhost:5173; # La aplicación Next.js corre en el puerto 5173
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                # Encabezados para que Next.js vea la información correcta del cliente
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
        }
        ```
    *   Guarda los cambios (presiona `Ctrl+O`, luego `Enter`, y finalmente `Ctrl+X` para salir del editor `nano`).
*   **Habilita el Bloque de Servidor:**
    Crea un enlace simbólico desde `sites-available` a `sites-enabled` para activar la configuración.
    ```bash
    sudo ln -s /etc/nginx/sites-available/tudominio.com /etc/nginx/sites-enabled/
    ```
*   **Verifica la Sintaxis de Nginx y Reinicia el Servicio:**
    ```bash
    sudo nginx -t           # Verifica que la sintaxis de la configuración es correcta
    sudo systemctl restart nginx # Reinicia Nginx para aplicar los cambios
    ```
    Si `nginx -t` reporta errores, deberás revisarlos y corregirlos en tu archivo de configuración.

#### 4. Asegurar tu Dominio con HTTPS (Certbot y Let's Encrypt)

El uso de HTTPS es fundamental para la seguridad, la confianza de los usuarios y el SEO. Let's Encrypt proporciona certificados SSL/TLS gratuitos.

*   **Instala Certbot y el Plugin de Nginx:**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    ```
*   **Obtén e Instala el Certificado SSL:**
    Ejecuta Certbot para obtener e instalar el certificado. **¡Recuerda reemplazar `tudominio.com` con tu dominio real!**
    ```bash
    sudo certbot --nginx -d tudominio.com -d www.tudominio.com
    ```
    Certbot te guiará a través de algunas preguntas:
    *   Te pedirá una dirección de correo electrónico para avisos de renovación y seguridad.
    *   Te preguntará si quieres redirigir automáticamente todo el tráfico HTTP a HTTPS (generalmente es la opción recomendada).
*   **Verifica la Renovación Automática de Certbot:**
    Los certificados de Let's Encrypt son válidos por 90 días, pero Certbot configura automáticamente un trabajo `cron` o un `systemd timer` para renovarlos antes de que expiren. Puedes verificar el estado:
    ```bash
    sudo systemctl status certbot.timer
    ```
    También puedes hacer una prueba de renovación en seco:
    ```bash
    sudo certbot renew --dry-run
    ```

---

Después de seguir todos estos pasos y esperar la propagación de DNS, tu aplicación Next.js debería ser accesible a través de `https://tudominio.com` o `https://www.tudominio.com`.

¡Espero que esta guía detallada te sea de gran ayuda para tener tu tienda online con un dominio propio y seguro!

¿Hay algo más en lo que pueda ayudarte con tu tienda LumaTienda?