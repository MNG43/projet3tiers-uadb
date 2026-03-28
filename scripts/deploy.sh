#!/bin/bash
set -e

APP_DIR="/var/www/app"
LOG_FILE="/var/log/deploy.log"
SERVICE="nodeapp"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Déploiement démarré ==="

cd "$APP_DIR"

git fetch origin main 2>&1 | tee -a "$LOG_FILE"

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    log "Aucun changement détecté - déploiement ignoré"
    exit 0
fi

log "Mise à jour détectée : $LOCAL -> $REMOTE"

git reset --hard origin/main

if git diff HEAD@{1} HEAD -- package.json | grep -q "."; then
    log "Mise à jour des dépendances npm..."
    npm install --production --silent
fi

sudo systemctl restart "$SERVICE"

sleep 2

if systemctl is-active --quiet "$SERVICE"; then
    log "Déploiement réussi - service actif"
else
    log "ERREUR : le service n'a pas redémarré"
    exit 1
fi

log "=== Déploiement terminé ==="
