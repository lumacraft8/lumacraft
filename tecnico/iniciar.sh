#!/bin/bash
# =========================================
# 🚀 Iniciador ULTRA Optimizado para LUMACRAFT
# Compatible con Minecraft 1.21+ y Java 21+
# =========================================

# Configuración del servidor
SERVER_JAR="server.jar"
MEM_MIN="1G"
MEM_MAX="5G"

# =========================================
# ⚙️ JVM Flags ULTRA Optimizadas (Java 21+)
# Basadas en configuraciones de Aikar + Pufferfish + ZGC tweaks
# =========================================
JVM_OPTS="\
-XX:+UseG1GC \
-XX:+ParallelRefProcEnabled \
-XX:MaxGCPauseMillis=120 \
-XX:+UnlockExperimentalVMOptions \
-XX:+DisableExplicitGC \
-XX:+AlwaysPreTouch \
-XX:+UseStringDeduplication \
-XX:G1NewSizePercent=25 \
-XX:G1MaxNewSizePercent=35 \
-XX:G1HeapRegionSize=4M \
-XX:G1ReservePercent=15 \
-XX:G1HeapWastePercent=5 \
-XX:G1MixedGCCountTarget=6 \
-XX:InitiatingHeapOccupancyPercent=20 \
-XX:G1MixedGCLiveThresholdPercent=85 \
-XX:G1RSetUpdatingPauseTimePercent=5 \
-XX:MaxTenuringThreshold=1 \
-XX:+PerfDisableSharedMem \
-Dusing.aikars.flags=TRUE \
-Daikars.new.flags=TRUE \
-Dpaper.playerconnection.keepalive=120 \
-Dpaper.maxchunksperpacket=24 \
-Dpurpur.disable.entity.bucket.async=true \
-Dio.netty.recycler.maxCapacity.default=0 \
-Dio.netty.allocator.numDirectArenas=0 \
"

# =========================================
# 🎨 Colores
# =========================================
GREEN="\033[1;32m"
RED="\033[1;31m"
YELLOW="\033[1;33m"
CYAN="\033[1;36m"
RESET="\033[0m"

# =========================================
# 🔍 Detección automática de Java
# =========================================
JAVA_PATH=$(which java)

if [ -z "$JAVA_PATH" ]; then
  echo -e "${RED}❌ No se encontró Java en el sistema.${RESET}"
  echo -e "${YELLOW}Instálalo con:${RESET}"
  echo "   sudo apt install openjdk-21-jre -y"
  exit 1
fi

JAVA_VERSION=$($JAVA_PATH -version 2>&1 | awk -F[\".] '/version/ {print $2}')
if [ "$JAVA_VERSION" -lt 21 ]; then
  echo -e "${RED}⚠️ Necesitas Java 21 o superior.${RESET}"
  exit 1
fi

echo -e "${GREEN}✅ Java detectado: $($JAVA_PATH -version 2>&1 | head -n 1)${RESET}"

# =========================================
# 🧾 Verificación de archivo y EULA
# =========================================
if [ ! -f "$SERVER_JAR" ]; then
  echo -e "${RED}❌ Error: No se encontró ${SERVER_JAR}${RESET}"
  exit 1
fi

if [ ! -f eula.txt ]; then
  echo "eula=true" > eula.txt
  echo -e "${GREEN}✅ EULA aceptado automáticamente.${RESET}"
fi

# =========================================
# 📁 Carpeta de logs
# =========================================
LOG_DIR="logs"
mkdir -p "$LOG_DIR"

# =========================================
# 🔁 Bucle de ejecución infinita
# =========================================
while true; do
  clear
  echo -e "${CYAN}"
  echo "========================================"
  echo "     🚀 Bienvenido a LUMACRAFT 🚀"
  echo "========================================"
  echo -e "${RESET}"

  LOG_FILE="${LOG_DIR}/server_$(date +%Y-%m-%d_%H-%M-%S).log"
  echo -e "${GREEN}🚀 Iniciando servidor... (logs → $LOG_FILE)${RESET}"

  "$JAVA_PATH" -Xms$MEM_MIN -Xmx$MEM_MAX $JVM_OPTS -jar $SERVER_JAR nogui | tee -a "$LOG_FILE"

  echo -e "${RED}🛑 El servidor se ha cerrado.${RESET}"
  echo -e "${YELLOW}Presiona Ctrl + C ahora si deseas detenerlo permanentemente.${RESET}"
  echo -e "${CYAN}Reinicio en:${RESET}"

  for i in 5 4 3 2 1; do
    echo "$i..."
    sleep 1
  done

  echo -e "${GREEN}🔄 Reiniciando servidor...${RESET}"
done
