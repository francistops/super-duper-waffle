###### super-duper-waffle
##### project 0 AEC DW 

# WebApp de Gestion pour Salons de Coiffure

## 1. Contexte

Dans le cadre du projet 0, nous proposons de développer **une application web à destination des salons de coiffure.** L'objectif est de fournir une interface intuitive pour **la gestion des rendez-vous, des services et des utilisateurs.** Le salon Tam Hair s'est gracieusement porté volontaire.

## 2. Objectifs

* Offrir une fonctionnalité de **prise de rendez-vous** entre clients et coiffeurs.
* Offrir un **système d'affichage des services et produits** disponibles.
* Offrir un **système d'avis** sur les coiffeurs et coiffeuses.
* Permettre de **générer des rapports** basés sur le nombre de rendez-vous et le coût des services.

## 3. Structure des Fonctionnalités Clés

### Types de rôles

* **Client** : s’inscrit, se connecte, prend des rendez-vous, laisse un avis.
* **Coiffeur** : se connecte, consulte et gère ses rendez-vous, ajoute des produits et services.
* **TamHair** : un dieu parmi les mortels. Avec un coup de ciseau, il peut tout faire et tout voir.

### Modules fonctionnels

1. **Authentification et Autorisation**

   * Inscription et connexion avec rôles (client ou coiffeur).
   * Mot de passe hashé via SHA-256 côté client, puis rehashé côté serveur avec un sel statique (*optionnel : sel dynamique*).
   * Authentification par token Bearer (*optionnel : token JWT*).

2. **Rendez-vous**

   * Création de rendez-vous par les clients avec accès limité aux rendez-vous des autres clients.
   * Visualisation et gestion des rendez-vous côté coiffeur. (*optionnel : envoi de rappels par courriel*)

3. **Services**

   * Consultation des services et produits proposés (nom, durée, prix).

4. **Avis Clients (Cassandra)**

   * Évaluations et commentaires laissés par les clients après leurs rendez-vous.

## 4. Schéma de Base de Données

### Structure des tables PostgreSQL

#### `users`

* `id` (SERIAL PRIMARY KEY)
* `email` (VARCHAR UNIQUE)
* `password_hash` (TEXT)
* `role` (VARCHAR) — "client" ou "coiffeur"

#### `tokens`

* `id` (SERIAL PRIMARY KEY)
* `token` (VARCHAR UNIQUE)
* `expires` (TIMESTAMP)
* `user_id` (INTEGER, FK → users.id)

#### `appointments`

* `id` (SERIAL PRIMARY KEY)
* `client_id` (INTEGER, FK → users.id)
* `hairdresser_id` (INTEGER, FK → users.id)
* `service_id` (INTEGER, FK → services.id)
* `date` (TIMESTAMP)
* `status` (VARCHAR) — "pending", "confirmed", "completed", "cancelled"

#### `services`

* `id` (SERIAL PRIMARY KEY)
* `name` (VARCHAR)
* `duration` (INTEGER)
* `price` (DECIMAL)
* `appointments_id` (INTEGER, FK → appointments.id)

#### `products`

* `id` (SERIAL PRIMARY KEY)
* `name` (VARCHAR)
* `price` (DECIMAL)

### Table Cassandra

#### `client_feedback`

* `appointment_id` (TEXT, PRIMARY KEY)
* `client_id` (TEXT)
* `comment` (TEXT)
* `rating` (INT)
* `timestamp` (TIMESTAMP)

## 5. Architecture Générale

* **Frontend** : HTML, CSS, JavaScript (Web Components)
* **Backend** : Node.js avec Express
* **Base de données** : PostgreSQL et Cassandra (NoSQL)
* **Serveur** : Nginx dans Docker

## 6. API REST (Modèle MVC)

### Middleware

* Authentification (token Bearer)
* Négociation de contenu (JSON et YAML)

### Routes et Contrôleurs

#### `AuthController`

* **PUBLIC** `POST /auth/register` : Inscription avec hachage SHA-256.
* **PUBLIC** `POST /auth/login` : Authentification et génération de token Bearer.

#### `UserController`

* **DEBUG** `GET /users/` : Liste des utilisateurs.
* **INTERNAL** `GET /users/:id` : Détail d’un utilisateur spécifique.

#### `AppointmentController`

* **DEBUG** `GET /appointments` : Liste des rendez-vous.
* **TOKEN** `POST /appointments/create` : Création de rendez-vous par un client.
* **TOKEN** (**Coiffeur**) `GET /appointments/client/:id` : Liste des rendez-vous d’un client.
* **PUBLIC** `GET /appointments/hairdresser/:id` : Liste des rendez-vous pour un coiffeur.
* **TOKEN** (**Coiffeur**) `PUT /appointments/:id/status` : Mise à jour du statut d’un rendez-vous.

#### `ServiceController`

* `GET /services` : Liste des services disponibles.
* **TOKEN** (**Coiffeur**) `POST /services` : Ajout d’un service.
* **TOKEN** (**Coiffeur**) `POST /services/:id` : Mise à jour d’un service.
* **TOKEN** (**Coiffeur**) `DELETE /services/:id` : Suppression d’un service.

#### `FeedbackController` (Cassandra)

* **DEBUG** `GET /feedback` : Voir tous les commentaires.
* **TOKEN** `POST /feedback` : Ajouter un commentaire.
* **PUBLIC** `GET /feedback/:appointmentId` : Voir les retours pour un rendez-vous.
* **PUBLIC** `GET /feedback/hairdresser/:id` : Voir tous les avis liés à un coiffeur.

## 7. Frontend : Organisation et Structure

### Fichiers principaux

* `index.html` : Page d’entrée de l’application.
* `global.css` : Feuille de style principale.
* `app.js` : Gestion de l’affichage et du routage.
* `auth.js` : Connexion, inscription, gestion des tokens, limitation des appels API.

### Web Components

* `login-form.js` : Formulaire de connexion.
* `register-form.js` : Création de compte.
* `appointment-list.js` : Visualisation des rendez-vous (liste ou calendrier).
* `service-list.js` : Affichage et gestion des services selon le rôle.
* `product-list.js` : Affichage et gestion des produits selon le rôle.

## 8. Tests Unitaires (TBD)

### `AuthController`

* `POST /auth/register` : Cas valide / email déjà existant.
* `POST /auth/login` : Connexion valide / identifiants invalides.

### `AppointmentController`

* `POST /appointments` : Création avec IDs valides / non valides.
* `GET /appointments/...` : Consultation des rendez-vous.

### Middleware

* Accès interdit sans token.
* Accès autorisé avec token valide.

## 9. Livrables

* Code source complet.
