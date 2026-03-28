#!/bin/bash
set -e

# REMPLACEMENT EFFECTUÉ : MNG43 et protocole HTTPS
GITHUB_REPO="https://github.com/MNG43/projet3tiers.git"
VM_ROLE="$1"

if [ -z "$VM_ROLE" ]; then
    echo "Usage: $0 {webserver|database}"
    exit 1
fi

echo "=== Provisionnement de la VM $VM_ROLE ==="

sudo apt update
sudo apt install -y git ansible python3-pip curl wget

# Nettoyage et récupération du code
sudo rm -rf /opt/projet3tiers
sudo git clone $GITHUB_REPO /opt/projet3tiers
sudo chown -R $USER:$USER /opt/projet3tiers

cd /opt/projet3tiers/ansible

# Lancement de la configuration Ansible
if [ "$VM_ROLE" = "webserver" ]; then
    ansible-playbook provision-vm2.yml -c local
elif [ "$VM_ROLE" = "database" ]; then
    ansible-playbook provision-vm3.yml -c local
fi

echo "=== Provisionnement terminé pour $VM_ROLE ==="
