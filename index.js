const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

// ■■ Connexion MySQL (VM3) ■■ [cite: 2, 22]
const db = mysql.createConnection({
    host: '192.168.10.10',
    user: 'webapp',
    password: 'WebApp2024!Secure',
    database: 'projet3tiers',
    connectTimeout: 10000
});

db.connect(err => {
    if (err) console.error('❌ Erreur MySQL (VM3) :', err.message);
    else console.log('✅ Connecté à la base de données projet3tiers');
});

// ■■ Interface Web Principale ■■ [cite: 4, 18]
app.get('/', (req, res) => {
    db.query('SELECT * FROM utilisateurs ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send("Erreur BD : " + err.message);

        res.send(`
<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='UTF-8'>
    <title>UADB - Dashboard 3-Tiers</title>
    <style>
        :root { --primary: #0D2137; --accent: #0A84FF; --bg: #f4f6f9; }
        body { font-family: 'Segoe UI', sans-serif; margin: 0; background: var(--bg); color: #333; }
        header { background: var(--primary); color: white; padding: 20px 40px; border-bottom: 4px solid var(--accent); }
        main { max-width: 1100px; margin: 30px auto; padding: 0 20px; }
        
        .tp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .badge { background: #dcfce7; color: #15803d; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 0.8rem; }
        
        .grid { display: grid; grid-template-columns: 350px 1fr; gap: 25px; }
        .card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        
        /* Formulaire */
        h3 { margin-top: 0; color: var(--primary); border-bottom: 2px solid #eee; padding-bottom: 10px; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .btn { width: 100%; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .btn-save { background: var(--accent); color: white; }
        .btn-save:hover { background: #0070e0; }
        
        /* Tableau */
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; }
        th { background: #f8fafc; color: #64748b; padding: 15px; text-align: left; font-size: 0.8rem; text-transform: uppercase; }
        td { padding: 15px; border-bottom: 1px solid #f1f5f9; }
        .actions { display: flex; gap: 8px; }
        .btn-action { padding: 6px 10px; border-radius: 4px; font-size: 0.8rem; border: none; cursor: pointer; }
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-del { background: #fee2e2; color: #b91c1c; }
    </style>
</head>
<body>

<header>
    <h1>Architecture Réseau 3-Tiers [cite: 18]</h1>
    <p>UADB 2025-2026 — Dr. Babou | Virtualisation & Cloud [cite: 14, 15, 16]</p>
</header>

<main>
    <div class="tp-header">
        <div><strong>Infrastructure :</strong> pfSense ➔ Nginx ➔ Node.js ➔ MySQL [cite: 27, 334]</div>
        <div class="badge">Statut Système : OPÉRATIONNEL</div>
    </div>

    <div class="grid">
        <section class="card">
            <h3 id="formTitle">Gérer un Utilisateur</h3>
            <form id="userForm">
                <input type="hidden" id="userId">
                <label>Nom complet</label>
                <input type="text" id="nom" placeholder="Ex: Moussa DIALLO" required>
                <label>Email</label>
                <input type="email" id="email" placeholder="Ex: m.diallo@uadb.sn" required>
                <button type="submit" class="btn btn-save" id="submitBtn">Enregistrer l'Utilisateur</button>
                <button type="button" onclick="resetForm()" id="cancelBtn" style="display:none; margin-top:10px; background:none; border:none; color:red; cursor:pointer;">Annuler la modification</button>
            </form>
        </section>

        <section>
            <table id="userTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Utilisateur</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(u => `
                        <tr>
                            <td>#${u.id}</td>
                            <td><strong>${u.nom}</strong></td>
                            <td>${u.email}</td>
                            <td class="actions">
                                <button class="btn-action btn-edit" onclick="editUser(${u.id}, '${u.nom}', '${u.email}')">Modifier</button>
                                <button class="btn-action btn-del" onclick="deleteUser(${u.id})">Supprimer</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </section>
    </div>
</main>

<script>
    const form = document.getElementById('userForm');
    
    // Gérer l'envoi (Ajout ou Modification)
    form.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('userId').value;
        const nom = document.getElementById('nom').value;
        const email = document.getElementById('email').value;

        const method = id ? 'PUT' : 'POST';
        const url = id ? '/api/users/' + id : '/api/users';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, email })
        });
        location.reload(); // Rafraîchir pour voir les changements [cite: 334]
    };

    // Préparer la modification
    function editUser(id, nom, email) {
        document.getElementById('userId').value = id;
        document.getElementById('nom').value = nom;
        document.getElementById('email').value = email;
        document.getElementById('formTitle').innerText = "Modifier l'utilisateur #" + id;
        document.getElementById('submitBtn').innerText = "Mettre à jour";
        document.getElementById('cancelBtn').style.display = "block";
    }

    // Supprimer
    async function deleteUser(id) {
        if (confirm('Supprimer cet utilisateur ?')) {
            await fetch('/api/users/' + id, { method: 'DELETE' });
            location.reload();
        }
    }

    function resetForm() {
        form.reset();
        document.getElementById('userId').value = '';
        document.getElementById('formTitle').innerText = "Gérer un Utilisateur";
        document.getElementById('submitBtn').innerText = "Enregistrer l'Utilisateur";
        document.getElementById('cancelBtn').style.display = "none";
    }
</script>
</body>
</html>
        `);
    });
});

// ■■ ROUTES API (Backend) ■■ [cite: 11, 12, 210]

// Ajouter [cite: 12]
app.post('/api/users', (req, res) => {
    const { nom, email } = req.body;
    db.query('INSERT INTO utilisateurs (nom, email) VALUES (?, ?)', [nom, email], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(201);
    });
});

// Modifier (Nouvelle route)
app.put('/api/users/:id', (req, res) => {
    const { nom, email } = req.body;
    db.query('UPDATE utilisateurs SET nom = ?, email = ? WHERE id = ?', [nom, email, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(200);
    });
});

// Supprimer (Nouvelle route)
app.delete('/api/users/:id', (req, res) => {
    db.query('DELETE FROM utilisateurs WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(200);
    });
});

// Démarrage [cite: 13]
const PORT = 3000;
app.listen(PORT, () => {
    console.log('🚀 Dashboard UADB prêt sur http://localhost:' + PORT);
});
