# Projet 3-Tiers UADB

## Architecture
- **VM1** : pfSense (Firewall, NAT, DHCP)
- **VM2** : Serveur Web (Node.js + Nginx)
- **VM3** : Base de données (MySQL)

## Déploiement complet depuis GitHub

### Prérequis
- 3 VMs avec Ubuntu 22.04 pour VM2 et VM3
- 1 VM avec pfSense pour VM1
- Accès SSH entre les VMs

### 1. Provisionner VM1 (pfSense)
Voir [pfsense/configuration.md](pfsense/configuration.md)

### 2. Provisionner VM3 (Base de données)
```bash
ansible-playbook -i ansible/inventory.ini ansible/db.yml
3. Provisionner VM2 (Serveur Web)
ansible-playbook -i ansible/inventory.ini ansible/web.yml
4. Tester la communication
./scripts/test-connect.sh
Vérification

    URL : http://192.168.100.10

    API : http://192.168.100.10/api/status

    MySQL : depuis VM2 → mysql -h 192.168.10.10 -u webapp -p

Auteurs
MNG-UADB - Module Virtualisation & Cloud
