# Architecture 3-Tiers

## Topologie
- **DMZ**: 192.168.100.0/24 (Serveur Web)
- **LAN**: 192.168.10.0/24 (Serveur BD, pfSense)

## Flux réseau
- Internet → pfSense (NAT) → VM2 (port 80)
- VM2 → VM3 (port 3306) pour accès MySQL
- VM3 ← VM2 uniquement
