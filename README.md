# InayaBridge

**InayaBridge** est une plateforme médicale numérique moderne et gratuite, conçue pour faciliter la communication entre les patients et les professionnels de santé, tout en intégrant des outils intelligents basés sur l’IA.

---

## Fonctionnalités principales

### Côté Médecin
- Création de profil professionnel
- Gestion des disponibilités et rendez-vous
- Accès aux dossiers médicaux des patients
- Ordonnances et diagnostics numériques
- Statistiques personnelles

### Côté Patient
- Prise de rendez-vous en ligne
- Historique médical centralisé
- Téléconsultation sécurisée via WebRTC
- Notifications et rappels
- Espace personnel avec documents médicaux

### Administrateur
- Gestion des rôles utilisateurs
- Supervision des consultations
- Modération des feedbacks
- Dashboard global

---

## Stack Technique

| Catégorie       | Technologie                        |
|----------------|-------------------------------------|
| Frontend       | Next.js, TailwindCSS                |
| Backend        | Laravel (REST API)                  |
| Base de Données| MongoDB                             |
| Authentification| JWT / OAuth2                        |
| Visio          | WebRTC / Mediasoup (self-hosted)    |
| Stockage       | Cloudinary, Firebase                |
| Hébergement    | Vercel / Heroku                     |

---

## Installation (en local)

```bash
# Cloner le dépôt
git clone https://github.com/tonrepo/inayabridge.git
cd inayabridge

# Installer les dépendances frontend
cd frontend
npm install
npm run dev

# Lancer le backend Laravel (via Sail ou local)
cd backend
composer install
php artisan serve
