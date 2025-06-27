###### super-duper-waffle
##### project 0 AEC DW 

# WebApp de Gestion Simplifiée pour Salons de Coiffure

## 1. Contexte et Objectifs

Dans le cadre d'un projet étudiant, nous proposons de développer une **application web simplifiée** à destination des salons de coiffure. L'objectif est de fournir une interface intuitive pour la gestion des rendez-vous, des services et des utilisateurs.

## 2. Objectifs

* Offrir une fonctionnalité de **prise de rendez-vous** entre clients et coiffeurs.
* Offrir un systeme listage des service et produit
* systeme d'avis sur les coiffeur et coiffeuse **pour cassandra mais je suis pas sur de cela la peut etre un system inventaire ou de rapport qui ce base sur les rdv et le cout du service pour faire un total et un rapport** 
* 

## 3. Fonctionnalités Clés

### Types d'utilisateurs

* **Client** : s’inscrit, se connecte, prend des rendez-vous, laiser un avis.
* **Coiffeur** : se connecte, consulte ses rendez-vous, ajoute des produit et service. **peut-etre editer et assigner a une autre**

### Modules fonctionnels

1. **Authentification**

   * Inscription et connexion avec rôles. (client ou coiffeur)
   * Mot de passe hashé via SHA-256 avec salt.
   * Authentification par token Bearer.

2. **Rendez-vous**

   * Création de rendez-vous par les clients. **peut-etre un vue basique des rdv deja pris pour eviter les duplicat**
   * Visualisation des rendez-vous côté coiffeur. **edit, comfirmaton de rdv** **optionnel envoie de courriel rappelle**

3. **Services**

   * Consultation des services et produits proposées (nom, durée, prix).

4. **Avis clients (Cassandra)**

   * Évaluation et commentaires des clients après les rendez-vous.

## 4. Schéma de Données

### Diagramme ER (PostgreSQL)

**todo: revoir le ER**
```
[users]                [services]
  |                         ^
  |                         |
  |---< [appointments] >----|
         |           |
         v           v
   [client]     [hairdresser]
```

### Structure des tables PostgreSQL

#### `users`

* `id` (SERIAL PRIMARY KEY)
* `name` (VARCHAR)
* `email` (VARCHAR UNIQUE)
* `password_hash` (TEXT)
* `role` (VARCHAR) — "client" ou "coiffeur"

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

#### `rendezvous_status` *(optionnel)*

* `id` (SERIAL PRIMARY KEY)
* `label` (VARCHAR)

### Table Cassandra

#### `client_feedback`

* `appointment_id` (TEXT, PRIMARY KEY)
* `client_id` (TEXT)
* `comment` (TEXT)
* `rating` (INT)
* `timestamp` (TIMESTAMP)

## 5. Architecture Générale

* **Frontend** : HTML, CSS, JavaScript (Web Components).
* **Backend** : Node.js avec Express.
* **Authentification** : SHA-256 avec salt ; token Bearer.
* **Bases de données** : PostgreSQL + Cassandra.
* **Tests** : Jest (backend). **idk tbd?**

## 6. API REST (Modèle MVC)

### Middleware 
* authentification (Token Bearer)
* negociate (json et yaml)

### Routes et Contrôleurs

#### AuthController

* `POST /auth/register` : Enregistrement avec hachage SHA-256.
* `POST /auth/login` : Authentifie et génère un token Bearer.

#### UserController

* **DEBUG** `GET /users/` : Détail des utilisateurs.
* **Internal** `GET /users/:id` : Détail d’un utilisateur.

#### AppointmentController

* **DEBUG** `GET /appointments` : Liste des rendez-vous.
* **TOKEN** `POST /appointments/client` : Créer un nouveau rendez-vous.
* **TOKEN** **Hairdresser** `GET /appointments/client/:id` : Liste des rendez-vous client.
* `GET /appointments/hairdresser/:id` : Rendez-vous d’un coiffeur.
* **TOKEN** **Hairdresser** `PUT /appointments/:id/status` : Mettre à jour le statut du rendez-vous.

#### ServiceController

* `GET /services` : Liste des services disponibles.
* **TOKEN** **Hairdresser** `POST /services` : Ajouter un service.
* **TOKEN** **Hairdresser** `POST /services/:id` : Mettre à jour le service.
* **TOKEN** **Hairdresser** `DELETE /services/:id` : Supprimer un service.

#### FeedbackController (Cassandra)

* **DEBUG** `GET /feedback` : voir tout les commentaires.
* `POST /feedback` : Ajouter un commentaire.
* `GET /feedback/:appointmentId` : Voir les retours d’un rendez-vous.
* `GET /feedback/hairdresser/:id` : Voir tous les avis liés à un coiffeur.

## 7. Frontend : Organisation et Structure

### Fichiers principaux

* `index.html` : Entrée de l’application.
* `styles.css` : Feuille de style principale.
* `app.js` : Gestion de l’affichage, routage simple.
* `auth.js` : Connexion, inscription, gestion des tokens.

### Web Components (`wc/`)

* `login-form.js`
* `register-form.js`
* `appointment-list.js` **a calendar would be nice**
* `service-list.js`

## 8. Tests Unitaires

#### AuthController

* `POST /auth/register` : Création valide / email déjà existant.
* `POST /auth/login` : Connexion valide / identifiants invalides.

#### AppointmentController

* `POST /appointments` : Création avec IDs valides / non valides.
* `GET /appointments/...` : Récupération des rendez-vous.

#### Middleware

* Accès interdit sans token.
* Accès valide avec token autorisé.

## 9. Livrables Attendus

* Code source complet.