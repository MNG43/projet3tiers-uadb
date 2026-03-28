# Projet 3-Tiers UADB

## Architecture
| VM | Rôle | IP | Services |
|----|------|-----|----------|
| VM1 | pfSense | LAN: 192.168.10.1, DMZ: 192.168.100.1 | Firewall, NAT, DHCP |
| VM2 | Serveur Web | 192.168.100.10 | Nginx, Node.js |
| VM3 | Serveur BD | 192.168.10.10 | MySQL 8 |

## Déploiement depuis GitHub

### Provisionner VM2
```bash
curl -fsSL https://raw.githubusercontent.com/MNG43/projet3tiers-uadb/main/scripts/bootstrap-vm.sh | bash -s webserver
Provisionner VM3
bash

curl -fsSL https://raw.githubusercontent.com/MNG43/projet3tiers-uadb/main/scripts/bootstrap-vm.sh | bash -s database
Auteurs

UADB - Module Virtualisation & Cloud


