# Configuration Réseau

| VM | Interface | IP | Rôle |
|----|-----------|-----|------|
| VM1 (pfSense) | WAN | DHCP | Internet |
| VM1 (pfSense) | LAN | 192.168.10.1/24 | Réseau interne |
| VM1 (pfSense) | DMZ | 192.168.100.1/24 | Zone démilitarisée |
| VM2 (Web) | DMZ | 192.168.100.10/24 | Serveur Web |
| VM3 (BD) | LAN | 192.168.10.10/24 | Base de données |
