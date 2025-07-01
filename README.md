###### super-duper-waffle

##### project 0 AEC DW

# WebApp de Gestion pour Salon de coiffure

## 1. Contexte

Dans le cadre du projet 0, nous proposons de développer **une application web à destination des salons de coiffure.** L'objectif est de fournir une interface intuitive pour **la gestion des rendez-vous, des services et des disponibilités.** Le salon de coiffure Tam Hair s'est gracieusement porté volontaire.

## 2. Objectifs

- Offrir une fonctionnalité de **prise de rendez-vous** pour les clients.
- Offrir une fonctionnalité de **disponibilités** pour les coiffeuses
- Offrir un **système d'affichage des services** disponibles.

## 3. Structure des Fonctionnalités Clés

### Types de rôles

- **Client** : s’inscrit, se connecte, prend des rendez-vous.
- **Coiffeuse** : se connecte, consulte ses rendez-vous, ajoute des disponibilités.

### Modules fonctionnels

1. **Authentification et Autorisation**

   - Inscription et connexion client.
   - Connexion coiffeuse.
   - Mot de passe hashé via SHA-256 côté client, puis rehashé côté serveur avec un sel statique (_optionnel : sel dynamique_).
   - Authentification par token Bearer (_optionnel : token JWT_).

2. **Rendez-vous (Cassandra pour garder l'historique des rendez-vous)**

   - Visualisation des rendez-vous et des plages dispnibles pour les coiffeuses

3. **Services**

   - Consultation des services (nom, durée, prix).

4. **Disponibilités**

   - Création de disponibilités par semaine pour les coiffeuses.
   - Visualisation des disponibilités par les clients

## 4. Schéma de Base de Données

### Structure des tables PostgreSQL

#### `users`

- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE)
- `passhash` (TEXT)
- `role` (VARCHAR) — "client" ou "coiffeuse"

#### `tokens`

- `id` (SERIAL PRIMARY KEY)
- `token` (VARCHAR UNIQUE)
- `expires` (TIMESTAMP)
- `userid` (INTEGER, FK → users.id)

#### `appointments`

- `id` (SERIAL PRIMARY KEY)
- `client_id` (INTEGER, FK → users.id)
- `hairdresser_id` (INTEGER, FK → users.id)
- `service_id` (INTEGER, FK → services.id)
- `date` (TIMESTAMP)
- `status` (VARCHAR) — "pending", "show", "noshow"

#### `availabilities`

- `id` (SERIAL PRIMARY KEY)
- `hairdresser_id` (INTEGER, FK → users.id)
- `date` (TIMESTAMP)
- `status` (VARCHAR) — "pending", "cancel"

#### `services`

- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `duration` (INTEGER)
- `price` (DECIMAL)
- `appointment_id` (INTEGER, FK → appointments.id)

### Table Cassandra

#### `feedbacks`

- `appointment_id` (TEXT, PRIMARY KEY)
- `client_id` (TEXT)
- `comment` (TEXT)
- `rating` (INT)
- `timestamp` (TIMESTAMP)

## 5. Architecture Générale

- **Frontend** : HTML, CSS, JavaScript (Web Components)
- **Backend** : Node.js avec Express
- **Base de données** : PostgreSQL et Cassandra (NoSQL)
- **Serveur** : Nginx dans Docker

## 6. API REST (Modèle MVC)

### Middleware

- Authentification (token Bearer)
- Négociation de contenu (JSON et YAML)

### Routes et Contrôleurs

#### `AuthController`

- **PUBLIC** `POST /auth/register` : Inscription avec hachage SHA-256.
- **PUBLIC** `POST /auth/login` : Authentification et génération de token Bearer.

#### `UserController`

- **DEBUG** `GET /users/` : Liste des utilisateurs.
- **INTERNAL** `GET /users/:id` : Détail d’un utilisateur spécifique.
- **INTERNAL** `GET /role/:role` : Liste des utilisateurs par rôle.
- **INTERNAL** `DELETE /delete` : Suppression d'un utilisateur.

#### `AppointmentController`

- **DEBUG** `GET /appointments` : Liste des rendez-vous.
- **TOKEN** (**Client**) `GET /appointments/users/:id` : Liste des rendez-vous d’un client.
- **Token** (**Client**) `POST /appointments` : Créer un rendez-vous.
- **TOKEN** (**Coiffeuse**) `PUT /appointments/:id/status` : Mise à jour du statut d’un rendez-vous. (show ou noShow)

#### `AvailabilityController`

- **TOKEN** (**Coiffeuse**) `POST /availabilities` : Création de disponibilités par une coiffeuse.
- **TOKEN** (**Coiffeuse**) `DELETE /availabilities/:id` : Suppression d’une disponibilité.
- **TOKEN** (**Client**) `GET /availabilities/users/role/:role` : Liste des disponibilités de toutes les coiffeuses.
- **TOKEN** (**Client**) `GET /availabilities/users/:id` : Liste des disponibilités d'une coiffeuse.
- **TOKEN** (**client**) `PUT /availabilities/:id/` : Mise à jour de la table availability ( en lui assignant un appointment_id )

#### `ServiceController`

- `GET /services` : Liste des services disponibles.
- **TOKEN** (**Coiffeuse**) `POST /services` : Ajout d’un service.
- **TOKEN** (**Coiffeuse**) `POST /services/:id` : Mise à jour d’un service.
- **TOKEN** (**Coiffeuse**) `DELETE /services/:id` : Suppression d’un service.

#### `FeedbackController` (Cassandra)

- **PUBLIC** `GET /feedbacks` : Voir tous les avis.
- **TOKEN** `POST /feedbacks` : Ajouter un avis.

## 7. Frontend : Organisation et Structure

### Fichiers principaux

- `index.html` : Page d’entrée de l’application.
- `global.css` : Feuille de style principale.
- `app.js` : Gestion de l’affichage et du routage.
- `auth.js` : Connexion, inscription, gestion des tokens, limitation des appels API.

### Web Components

- `login-form.js` : Formulaire de connexion.
- `register-form.js` : Création de compte.
- `appointments-client.js` : Voir les rendez-vous d'un client. ( Quand le status passe à "show" peux laisser un avis )
- `handling-availabilities-client.js` : Choisir une disponibilité d'une coiffeuse.
- `appointments-hairdresser.js` : Voir les rendez-vous d'une coiffeuse.
- `handling-availabilities-hairdresser.js` : Ajouter des disponibilités comme coiffeuse.
- `profil-wc.js` : Bouton modifier profil et supprimer compte.
- `services-wc.js` : Affichage des services.
- `feedbacks-wc.js` : Affichage des avis.
- `handling-feedback.js` : Ajouter un avis.

## 8. Tests Unitaires (TBD)

### `AuthController`

- `POST /auth/register` : Cas valide / email déjà existant.
- `POST /auth/login` : Connexion valide / identifiants invalides.

### `AppointmentController`

- `POST /appointments` : Création avec IDs valides / non valides.
- `GET /appointments/...` : Consultation des rendez-vous.

### Middleware

- Accès interdit sans token.
- Accès autorisé avec token valide.

## 9. Livrables

- Code source complet.
