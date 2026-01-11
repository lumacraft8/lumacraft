#!/bin/bash

# ========================
# CONFIGURACIÓN DEL PROXY
# ========================

# Cambia el nombre si usas Velocity (por ejemplo: velocity.jar)
SERVER_JAR="server.jar"

# RAM mínima y máxima
MEM_MIN="1G"
MEM_MAX="2G"

# Ruta directa a Java (opcional). Si la dejas vacía, usará "java" del PATH.
JAVA_PATH=""

# Flags G1GC ajustadas para proxies Minecraft (Velocity/Bungee)
# Referencia: tuning de Velocity (G1GC) y flags usadas comúnmente en servidores
JVM_OPTS="-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 \
-XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch \
-XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M \
-XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 \
-XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 \
-XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 \
-XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1"

# ========================
# COLORES
# ========================

GREEN="\033[1;32m"
RED="\033[1;31m"
YELLOW="\033[1;33m"
CYAN="\033[1;36m"
RESET="\033[0m"

# ========================
# PREPARACIÓN
# ========================

# Ir al directorio del script
cd "$(dirname "$0")"

# Resolver binario de Java
if [ -z "$JAVA_PATH" ]; then
  if command -v java >/dev/null 2>&1; then
    JAVA_BIN="java"
  else
    echo -e "${RED}❌ Error: Java no encontrado en el PATH. Instala Java 17/21 y vuelve a intentar.${RESET}"
    exit 1
  fi
else
  JAVA_BIN="$JAVA_PATH"
fi

# Chequeo del .jar
if [ ! -f "$SERVER_JAR" ]; then
  echo -e "${RED}❌ Error: No se encontró ${SERVER_JAR}${RESET}"
  exit 1
fi

# ========================
# BUCLE DE EJECUCIÓN
# ========================

while true
do
  clear
  echo -e "${CYAN}"
  echo "========================================"
  echo "     🚀 Proxy Minecraft (Bunge) 🚀"
  echo "========================================"
  echo -e "${RESET}"

  echo -e "${GREEN}🚀 Iniciando proxy...${RESET}"
  "$JAVA_BIN" -Xms$MEM_MIN -Xmx$MEM_MAX $JVM_OPTS -jar "$SERVER_JAR"

  echo -e "${RED}🛑 El proxy se ha detenido.${RESET}"
  echo -e "${YELLOW}Si quieres apagarlo por completo, presiona Ctrl + C ahora.${RESET}"
  echo -e "${CYAN}Reinicio en:${RESET}"

  for i in 5 4 3 2 1
  do
    echo "$i..."
    sleep 1
  done

  echo -e "${GREEN}🔄 Reiniciando proxy...${RESET}"
done
