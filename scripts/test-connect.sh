#!/bin/bash
# Script de test de connectivité entre les VMs

echo "=== Test de connectivité entre les VMs ==="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test 1: VM2 vers pfSense (DMZ)
echo "1. Test: VM2 → pfSense (DMZ gateway)"
if ping -c 2 192.168.100.1 &>/dev/null; then
    echo -e "${GREEN}✅ OK${NC} - VM2 peut atteindre pfSense (DMZ)"
else
    echo -e "${RED}❌ FAIL${NC} - VM2 ne peut pas atteindre pfSense (DMZ)"
fi
echo ""

# Test 2: VM2 vers VM3 (MySQL)
echo "2. Test: VM2 → VM3 (MySQL)"
if nc -zv 192.168.10.10 3306 2>/dev/null; then
    echo -e "${GREEN}✅ OK${NC} - VM2 peut atteindre MySQL sur VM3"
else
    echo -e "${RED}❌ FAIL${NC} - VM2 ne peut pas atteindre MySQL sur VM3"
fi
echo ""

# Test 3: Application Web locale
echo "3. Test: Application Node.js (port 3000)"
if curl -s http://localhost:3000/api/status &>/dev/null; then
    echo -e "${GREEN}✅ OK${NC} - Application Node.js répond sur port 3000"
else
    echo -e "${RED}❌ FAIL${NC} - Application Node.js ne répond pas"
fi
echo ""

# Test 4: Nginx reverse proxy
echo "4. Test: Nginx reverse proxy (port 80)"
if curl -s http://localhost/api/status &>/dev/null; then
    echo -e "${GREEN}✅ OK${NC} - Nginx reverse proxy fonctionne"
else
    echo -e "${RED}❌ FAIL${NC} - Nginx reverse proxy ne fonctionne pas"
fi
echo ""

# Test 5: API utilisateurs
echo "5. Test: API utilisateurs"
if curl -s http://localhost/api/users | grep -q "Moussa DIALLO"; then
    echo -e "${GREEN}✅ OK${NC} - API utilisateurs renvoie les données"
else
    echo -e "${RED}❌ FAIL${NC} - API utilisateurs ne répond pas correctement"
fi
echo ""

echo "=== Tests terminés ==="
