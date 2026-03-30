# Configuration de VM1 - pfSense

## Installation
1. Télécharger pfSense CE depuis https://www.pfsense.org/download/
2. Créer une VM avec :
   - 1 Go RAM
   - 16 Go disque
   - 3 interfaces réseau (WAN, LAN, DMZ)

## Configuration initiale (via console)
1. Assigner les interfaces :
   - em0 → WAN (NAT / DHCP)
   - em1 → LAN (192.168.10.1/24)
   - em2 → DMZ (192.168.100.1/24)
2. Accéder à l'interface web : https://192.168.10.1
   - Login : admin
   - Mot de passe : pfsense (à changer)

## Configuration à appliquer (via interface web)

### 1. DHCP Server
- **LAN** : Activer, plage 192.168.10.100 - 192.168.10.200
- **DMZ** : Activer, plage 192.168.100.100 - 192.168.100.200

### 2. Firewall Rules

#### DMZ Rules (Firewall > Rules > DMZ)
| Action | Proto | Source | Port | Destination | Port | Description |
|--------|-------|--------|------|-------------|------|-------------|
| Pass | TCP | DMZ net | * | VM3 (192.168.10.10) | 3306 | MySQL depuis VM2 |
| Pass | TCP/UDP | DMZ net | * | * | 80,443,53 | Accès Internet |
| Block | * | DMZ net | * | LAN net | * | Isoler DMZ du LAN |

#### LAN Rules (Firewall > Rules > LAN)
| Action | Proto | Source | Port | Destination | Port | Description |
|--------|-------|--------|------|-------------|------|-------------|
| Pass | TCP/UDP | LAN net | * | * | * | Accès Internet |

### 3. NAT Port Forward (Firewall > NAT > Port Forward)
| Interface | Proto | Dest. Port | Redirect IP | Redirect Port | Description |
|-----------|-------|------------|-------------|---------------|-------------|
| WAN | TCP | 80 | 192.168.100.10 | 80 | HTTP vers VM2 |

## Export de la configuration (pour sauvegarde)
1. Aller dans **Diagnostics > Backup & Restore**
2. Cliquer **Download configuration**
3. Sauvegarder ce fichier XML dans le dépôt (si tu veux automatiser la restauration)

## Restauration sur une nouvelle VM
1. Installer pfSense vierge
2. Configurer les interfaces (WAN, LAN, DMZ) avec les mêmes IPs
3. Accéder à l'interface web
4. **Diagnostics > Backup & Restore** → Restore → choisir le fichier XML
5. Redémarrer

## Vérification
```bash
# Depuis VM2
ping 192.168.100.1        # DMZ gateway
ping 192.168.10.10        # VM3 MySQL
curl http://192.168.100.10 # Site web
