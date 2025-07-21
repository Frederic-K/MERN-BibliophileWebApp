export default {
  errorPage: {
    server: {
      title: "Erreur Serveur",
      description:
        "Le serveur a rencontré une erreur inattendue et n'a pas pu traiter votre demande.",
      button: "Actualiser",
    },
    network: {
      title: "Erreur Réseau",
      description:
        "Il y a eu un problème avec votre connexion Internet. Veuillez vérifier votre connexion et réessayer.",
      button: "Réessayer",
    },
    serviceUnavailable: {
      title: "Service Indisponible",
      description:
        "Le service est temporairement indisponible. Nous y travaillons et serons bientôt de retour.",
      button: "Réessayer (30s)",
    },
    boundary: {
      title: "Oups ! Quelque chose s'est mal passé",
      description: "Nous sommes désolés pour ce désagrément. Voici quelques options :",
      retryButton: "Réessayer",
      homeButton: "Retourner à l'accueil",
      refreshButton: "Actualiser la page",
      clearDataButton: "Effacer les données et actualiser",
      detailsTitle: "Détails de l'erreur",
    },
  },
}
