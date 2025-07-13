Les coiffeuses sont déjà dans la base de données.
Les clients créent un user

En ouvrant la page, connecté ou non, on voit les feedback et les services.

Un client clique sur register :

- Si réussi, il est envoyé directement sur la page login.
- Si échoué, le formulaire s'efface et reste affiché avec alert d'erreur.

Un client enregistré clique sur login :

- Si réussi, il est redirigé vers le main.
- Si échoué, le formulaire s'efface et reste affiché avec alert d'erreur.

**Création de disponibilités par la coiffeuse**

Une coiffeuse clique sur profil :

- Elle voit un tableau (vide la première fois) avec ses disponibilités existantes, un tableau (vide la première fois) de ses rendez-vous, ainsi qu'un calendrier.
- Elle peut ajouter des disponibilités avec son calendrier.

Le calendrier :

- La coiffeuse doit cliquer sur un lundi dans le futur.
- Une fois cliqué, un bouton de confirmation apparaît et doit être cliqué.
- Sa liste de disponibilités sera déjà créée.
- Une fois le bouton de confirmation cliqué, sa liste de disponibilités pour cette semaine là est ajoutée à ses disponibilités existantes.

Le tableau des disponibilités :

- Une fois créée, une disponiblités se fait assigner un status 'pending'.
- Une fois qu'un client a choisi une disponibilité, celle-ci se fait assigner le status 'assigned'.
- Toutes les disponiblités qui sont passées sont automatiquement effacées de la liste par un changement de status à 'expired'.

Le tableau des rendez-vous comporte 2 boutons par rendez-vous :

- Un bouton "show" pour indiquer que le client s'est présenté. Une fois cliqué, change le status du rendez-vous à 'show'.
- Un bouton "noShow" pour indiquer que le client ne s'est pas présenté. Une fois cliqué, change le status du rendez-vous à 'noShow'

**Création de rendez-vous par le client**

Un client clique sur profil :

- Il voit un menu déroulant avec les noms de toutes les coiffeuses et un tableau ( vide pour la première fois ) avec la liste de ses rendez-vous à venir et ses rendez-vous passé.
- Il sélectionne une coiffeuse et la liste de ses disponiblités apparaît.

La liste de disponibilités :

- Chaque ligne du tableau des disponiblités contient un bouton 'choisir' à la fin.
- Une fois le bouton cliqué, la disponibilité se fait assigner le status 'assigned', disparaît de la liste du client et un rendez-vous est créé.

**Un client vs son rendez-vous**

Un client ne se présente pas à son rendez-vous :

- La coiffeuse clique sur le bouton 'noShow' du rendez-vous du client dans son profil.
- Le status du rendez-vous passe à 'noShow'.
- Le rendez-vous disparaît de la page profil du client.

Un client se présente à son rendez-vous :

- La coiffeuse clique sur le bouton 'show' du rendez-vous du client dans son profil.
- Le rendez-vous disparaît de sa liste à elle.
- Le status du rendez-vous passe à 'show'.
- Sur la page client, un bouton 'feedback'' apparaît.

**Création d'un feedback par le client**

Un client clique sur le bouton feedback :

- Un formulaire de feedback apparaît.
- Une fois envoyé, le client est redirigé vers la page main.
- Le status du rendez-vous passe à 'feedback'.
- Le rendez-vous disparaît de la liste du client.
