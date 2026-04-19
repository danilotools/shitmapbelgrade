export type Language = 'en' | 'sr' | 'es' | 'it' | 'de' | 'fr';

export interface LanguageOption {
  code: Language;
  flag: string;
  name: string;   // English name
  native: string; // Name in that language
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', flag: '🇬🇧', name: 'English',  native: 'English'  },
  { code: 'sr', flag: '🇷🇸', name: 'Serbian',  native: 'Srpski'   },
  { code: 'es', flag: '🇪🇸', name: 'Spanish',  native: 'Español'  },
  { code: 'it', flag: '🇮🇹', name: 'Italian',  native: 'Italiano' },
  { code: 'de', flag: '🇩🇪', name: 'German',   native: 'Deutsch'  },
  { code: 'fr', flag: '🇫🇷', name: 'French',   native: 'Français' },
];

export interface Translations {
  // Onboarding
  slides: {
    emoji: string;
    title: string;
    body?: string;
    items?: { icon: string; text: string }[];
  }[];
  next: string;
  skip: string;
  getStarted: string;
  settingUp: string;

  // Drop button
  pinThePoo: string;

  // Map screen
  acquiringGps: string;
  noLocation: string;
  waitingForGps: string;
  dropsLeft: (n: number, max: number) => string;
  slowDown: string;
  spamLimit: string;
  error: string;
  dropError: string;
  deleteError: string;
  voteError: string;

  // Menu
  menuTitle: string;
  menuLanguage: string;
  menuNotifications: string;
  menuNotificationsDesc: string;
  menuMyPins: string;
  menuNoPins: string;
  menuPinExpiresIn: (h: number, m: number) => string;
  menuDarkMode: string;
  menuDarkModeDesc: string;
  menuShare: string;
  menuShareMessage: string;
  menuAbout: string;
  menuVersion: (v: string) => string;

  // Pin detail sheet
  yourPin: string;
  droppedAgo: (time: string) => string;
  hoursMinutesAgo: (h: number, m: number) => string;
  minutesAgo: (m: number) => string;
  deleteMyPin: string;
  votesToRemove: (n: number, max: number) => string;
  markAsGone: string;
  youReported: string;
  confirmationsNeeded: (n: number) => string;
}

export const translations: Record<Language, Translations> = {

  // ── English ────────────────────────────────────────────────────────────────
  en: {
    slides: [
      {
        emoji: '💩',
        title: 'Watch where\nyou step',
        body: 'Pin the Poo is a crowdsourced map of dog poo on the streets. Built by the community, for the community.',
      },
      {
        emoji: '📍',
        title: 'See one?\nDrop a pin',
        body: 'Tap the 💩 button to mark poo at your exact location. Pins expire automatically after 48 hours.',
      },
      {
        emoji: '🔔',
        title: "We'll warn\nyou in time",
        body: "Get a notification the moment you're within 10 meters of a reported poo. No accounts, fully anonymous.",
      },
      {
        emoji: '🔐',
        title: 'Two quick\npermissions',
        items: [
          { icon: '📍', text: 'Location — so we can show poo near you and warn you in real time. Never stored or shared.' },
          { icon: '🔔', text: 'Notifications — so we can ping you the moment poo is within 10 meters.' },
        ],
      },
    ],
    next: 'Next',
    skip: 'Skip',
    getStarted: 'Get Started',
    settingUp: 'Setting up...',

    pinThePoo: 'Pin the Poo',

    acquiringGps: 'Acquiring GPS...',
    noLocation: 'No location',
    waitingForGps: 'Waiting for GPS fix...',
    dropsLeft: (n, max) => `${n}/${max} drops left`,
    slowDown: 'Slow down!',
    spamLimit: 'You can only drop 5 pins per hour.',
    error: 'Error',
    dropError: 'Could not drop pin. Check your connection.',
    deleteError: 'Could not delete pin. Check your connection.',
    voteError: 'Could not submit removal vote.',

    menuTitle: 'Settings',
    menuLanguage: 'Language',
    menuNotifications: 'Proximity alerts',
    menuNotificationsDesc: 'Notify me when poo is nearby',
    menuMyPins: 'My active pins',
    menuNoPins: 'No active pins',
    menuPinExpiresIn: (h, m) => `${h}h ${m}m left`,
    menuDarkMode: 'Dark mode',
    menuDarkModeDesc: 'Switch the map to a dark theme',
    menuShare: 'Share',
    menuShareMessage: 'Watch where you step 💩\n\nPin the Poo is a crowdsourced map of dog poo on the streets. Help keep your city clean!',
    menuAbout: 'About',
    menuVersion: (v) => `Version ${v}`,

    yourPin: 'Your pin',
    droppedAgo: (time) => `Dropped ${time}`,
    hoursMinutesAgo: (h, m) => `${h}h ${m}m ago`,
    minutesAgo: (m) => `${m}m ago`,
    deleteMyPin: '🗑 Delete my pin',
    votesToRemove: (n, max) => `${n} / ${max} votes to remove`,
    markAsGone: '🧹 Mark as gone',
    youReported: '✓ You reported this',
    confirmationsNeeded: (n) => `${n} more ${n === 1 ? 'confirmation' : 'confirmations'} needed`,
  },

  // ── Serbian ────────────────────────────────────────────────────────────────
  sr: {
    slides: [
      {
        emoji: '💩',
        title: 'Pazi gde\ngaziš',
        body: 'Pin the Poo je kolektivna mapa psećeg izmeta na ulicama. Napravili građani, za građane.',
      },
      {
        emoji: '📍',
        title: 'Video si?\nOstavi pin',
        body: 'Pritisni dugme 💩 da označiš lokaciju. Pinovi automatski nestaju posle 48 sati.',
      },
      {
        emoji: '🔔',
        title: 'Upozorićemo\nte na vreme',
        body: 'Dobij obaveštenje čim si unutar 10 metara od prijavljenog izmeta. Bez naloga, potpuno anonimno.',
      },
      {
        emoji: '🔐',
        title: 'Dve brze\ndozvole',
        items: [
          { icon: '📍', text: 'Lokacija — da vidimo kaku u tvojoj blizini i upozorimo te u realnom vremenu. Nikad se ne čuva niti deli.' },
          { icon: '🔔', text: 'Obaveštenja — da te pingnemo čim se kaka nađe unutar 10 metara.' },
        ],
      },
    ],
    next: 'Dalje',
    skip: 'Preskoči',
    getStarted: 'Počni',
    settingUp: 'Podešavanje...',

    pinThePoo: 'Pinuj kaku 💩',

    acquiringGps: 'Tražim GPS...',
    noLocation: 'Nema lokacije',
    waitingForGps: 'Čekam GPS signal...',
    dropsLeft: (n, max) => `${n}/${max} pinova ostalo`,
    slowDown: 'Polako!',
    spamLimit: 'Možeš ostaviti samo 5 pinova na sat.',
    error: 'Greška',
    dropError: 'Nije moguće ostaviti pin. Proveri konekciju.',
    deleteError: 'Nije moguće obrisati pin. Proveri konekciju.',
    voteError: 'Nije moguće glasati za uklanjanje.',

    menuTitle: 'Podešavanja',
    menuLanguage: 'Jezik',
    menuNotifications: 'Upozorenja u blizini',
    menuNotificationsDesc: 'Obavesti me kad je kaka blizu',
    menuMyPins: 'Moji aktivni pinovi',
    menuNoPins: 'Nema aktivnih pinova',
    menuPinExpiresIn: (h, m) => `Još ${h}h ${m}m`,
    menuDarkMode: 'Tamni mod',
    menuDarkModeDesc: 'Prebaci mapu na tamnu temu',
    menuShare: 'Podeli',
    menuShareMessage: 'Pazi gde gazis 💩\n\nPin the Poo je kolektivna mapa psećeg izmeta na ulicama. Pomozi svojoj zajednici da ostane čista!',
    menuAbout: 'O aplikaciji',
    menuVersion: (v) => `Verzija ${v}`,

    yourPin: 'Tvoj pin',
    droppedAgo: (time) => `Ostavljeno pre ${time}`,
    hoursMinutesAgo: (h, m) => `${h}h ${m}m`,
    minutesAgo: (m) => `${m}m`,
    deleteMyPin: '🗑 Obriši moj pin',
    votesToRemove: (n, max) => `${n} / ${max} glasova za uklanjanje`,
    markAsGone: '🧹 Označi kao uklonjeno',
    youReported: '✓ Već si prijavio ovo',
    confirmationsNeeded: (n) => `Još ${n} ${n === 1 ? 'potvrda' : 'potvrde'} potrebno`,
  },

  // ── Spanish ────────────────────────────────────────────────────────────────
  es: {
    slides: [
      {
        emoji: '💩',
        title: 'Mira dónde\npisas',
        body: 'Pin the Poo es un mapa colaborativo de excrementos de perro en las calles. Creado por la comunidad, para la comunidad.',
      },
      {
        emoji: '📍',
        title: '¿Ves uno?\nDeja un pin',
        body: 'Toca el botón 💩 para marcar la ubicación exacta. Los pins desaparecen automáticamente después de 48 horas.',
      },
      {
        emoji: '🔔',
        title: 'Te avisaremos\na tiempo',
        body: 'Recibe una notificación cuando estés a 10 metros de un excremento reportado. Sin cuentas, totalmente anónimo.',
      },
      {
        emoji: '🔐',
        title: 'Dos permisos\nrápidos',
        items: [
          { icon: '📍', text: 'Ubicación — para mostrarte excrementos cercanos y avisarte en tiempo real. Nunca se almacena ni comparte.' },
          { icon: '🔔', text: 'Notificaciones — para avisarte cuando hay excrementos a menos de 10 metros.' },
        ],
      },
    ],
    next: 'Siguiente',
    skip: 'Omitir',
    getStarted: 'Empezar',
    settingUp: 'Configurando...',

    pinThePoo: 'Poner un pin',

    acquiringGps: 'Obteniendo GPS...',
    noLocation: 'Sin ubicación',
    waitingForGps: 'Esperando señal GPS...',
    dropsLeft: (n, max) => `${n}/${max} pins restantes`,
    slowDown: '¡Despacio!',
    spamLimit: 'Solo puedes dejar 5 pins por hora.',
    error: 'Error',
    dropError: 'No se pudo dejar el pin. Comprueba tu conexión.',
    deleteError: 'No se pudo eliminar el pin. Comprueba tu conexión.',
    voteError: 'No se pudo enviar el voto de eliminación.',

    menuTitle: 'Ajustes',
    menuLanguage: 'Idioma',
    menuNotifications: 'Alertas de proximidad',
    menuNotificationsDesc: 'Notificarme cuando hay excrementos cerca',
    menuMyPins: 'Mis pins activos',
    menuNoPins: 'No hay pins activos',
    menuPinExpiresIn: (h, m) => `${h}h ${m}m restantes`,
    menuDarkMode: 'Modo oscuro',
    menuDarkModeDesc: 'Cambiar el mapa a tema oscuro',
    menuShare: 'Compartir',
    menuShareMessage: '¡Mira dónde pisas! 💩\n\nPin the Poo es un mapa colaborativo de excrementos de perro en las calles. ¡Ayuda a mantener tu ciudad limpia!',
    menuAbout: 'Acerca de',
    menuVersion: (v) => `Versión ${v}`,

    yourPin: 'Tu pin',
    droppedAgo: (time) => `Dejado hace ${time}`,
    hoursMinutesAgo: (h, m) => `${h}h ${m}m`,
    minutesAgo: (m) => `${m}m`,
    deleteMyPin: '🗑 Eliminar mi pin',
    votesToRemove: (n, max) => `${n} / ${max} votos para eliminar`,
    markAsGone: '🧹 Marcar como desaparecido',
    youReported: '✓ Ya lo reportaste',
    confirmationsNeeded: (n) => `${n} confirmación${n === 1 ? '' : 'es'} más necesaria${n === 1 ? '' : 's'}`,
  },

  // ── Italian ────────────────────────────────────────────────────────────────
  it: {
    slides: [
      {
        emoji: '💩',
        title: 'Guarda dove\nmetti i piedi',
        body: 'Pin the Poo è una mappa collaborativa di escrementi di cane per le strade. Creata dalla comunità, per la comunità.',
      },
      {
        emoji: '📍',
        title: 'Ne vedi uno?\nSegna la posizione',
        body: 'Tocca il pulsante 💩 per indicare la posizione esatta. I pin scadono automaticamente dopo 48 ore.',
      },
      {
        emoji: '🔔',
        title: 'Ti avviseremo\nin tempo',
        body: 'Ricevi una notifica quando sei a 10 metri da un escremento segnalato. Senza account, completamente anonimo.',
      },
      {
        emoji: '🔐',
        title: 'Due rapidi\npermessi',
        items: [
          { icon: '📍', text: 'Posizione — per mostrarti gli escrementi vicini e avvisarti in tempo reale. Mai memorizzata o condivisa.' },
          { icon: '🔔', text: 'Notifiche — per avvisarti quando ci sono escrementi entro 10 metri.' },
        ],
      },
    ],
    next: 'Avanti',
    skip: 'Salta',
    getStarted: 'Inizia',
    settingUp: 'Configurazione...',

    pinThePoo: 'Segna la cacca',

    acquiringGps: 'Acquisizione GPS...',
    noLocation: 'Nessuna posizione',
    waitingForGps: 'In attesa del GPS...',
    dropsLeft: (n, max) => `${n}/${max} pin rimasti`,
    slowDown: 'Rallenta!',
    spamLimit: "Puoi lasciare solo 5 pin all'ora.",
    error: 'Errore',
    dropError: 'Impossibile lasciare il pin. Controlla la connessione.',
    deleteError: 'Impossibile eliminare il pin. Controlla la connessione.',
    voteError: 'Impossibile inviare il voto di rimozione.',

    menuTitle: 'Impostazioni',
    menuLanguage: 'Lingua',
    menuNotifications: 'Avvisi di prossimità',
    menuNotificationsDesc: "Avvisami quando c'è qualcosa nelle vicinanze",
    menuMyPins: 'I miei pin attivi',
    menuNoPins: 'Nessun pin attivo',
    menuPinExpiresIn: (h, m) => `${h}h ${m}m rimanenti`,
    menuDarkMode: 'Modalità scura',
    menuDarkModeDesc: 'Passa la mappa al tema scuro',
    menuShare: 'Condividi',
    menuShareMessage: 'Guarda dove metti i piedi! 💩\n\nPin the Poo è una mappa collaborativa degli escrementi di cane nelle strade. Aiuta a mantenere pulita la tua città!',
    menuAbout: 'Informazioni',
    menuVersion: (v) => `Versione ${v}`,

    yourPin: 'Il tuo pin',
    droppedAgo: (time) => `Lasciato ${time} fa`,
    hoursMinutesAgo: (h, m) => `${h}h ${m}m fa`,
    minutesAgo: (m) => `${m}m fa`,
    deleteMyPin: '🗑 Elimina il mio pin',
    votesToRemove: (n, max) => `${n} / ${max} voti per rimuovere`,
    markAsGone: '🧹 Segna come rimosso',
    youReported: '✓ Hai già segnalato questo',
    confirmationsNeeded: (n) => `Ancora ${n} conferma${n === 1 ? '' : 'e'} necessari${n === 1 ? 'a' : 'e'}`,
  },

  // ── German ─────────────────────────────────────────────────────────────────
  de: {
    slides: [
      {
        emoji: '💩',
        title: 'Pass auf, wo\ndu trittst',
        body: 'Pin the Poo ist eine gemeinschaftliche Karte von Hundekot auf den Straßen. Von der Gemeinschaft erstellt, für die Gemeinschaft.',
      },
      {
        emoji: '📍',
        title: 'Gesehen?\nPin setzen',
        body: 'Tippe den 💩 Knopf, um den genauen Ort zu markieren. Pins laufen nach 48 Stunden automatisch ab.',
      },
      {
        emoji: '🔔',
        title: 'Wir warnen\ndich rechtzeitig',
        body: 'Erhalte eine Benachrichtigung, sobald du dich 10 Meter von gemeldetem Hundekot befindest. Kein Konto, vollständig anonym.',
      },
      {
        emoji: '🔐',
        title: 'Zwei kurze\nBerechtigungen',
        items: [
          { icon: '📍', text: 'Standort — um Hundekot in der Nähe anzuzeigen und dich in Echtzeit zu warnen. Wird nie gespeichert oder geteilt.' },
          { icon: '🔔', text: 'Benachrichtigungen — um dich zu warnen, sobald Hundekot innerhalb von 10 Metern ist.' },
        ],
      },
    ],
    next: 'Weiter',
    skip: 'Überspringen',
    getStarted: 'Loslegen',
    settingUp: 'Einrichten...',

    pinThePoo: 'Pin setzen',

    acquiringGps: 'GPS wird ermittelt...',
    noLocation: 'Kein Standort',
    waitingForGps: 'Warte auf GPS-Signal...',
    dropsLeft: (n, max) => `${n}/${max} Pins übrig`,
    slowDown: 'Langsamer!',
    spamLimit: 'Du kannst nur 5 Pins pro Stunde setzen.',
    error: 'Fehler',
    dropError: 'Pin konnte nicht gesetzt werden. Überprüfe deine Verbindung.',
    deleteError: 'Pin konnte nicht gelöscht werden. Überprüfe deine Verbindung.',
    voteError: 'Abstimmung konnte nicht gesendet werden.',

    menuTitle: 'Einstellungen',
    menuLanguage: 'Sprache',
    menuNotifications: 'Näherungs-Alarme',
    menuNotificationsDesc: 'Benachrichtige mich, wenn Hundekot in der Nähe ist',
    menuMyPins: 'Meine aktiven Pins',
    menuNoPins: 'Keine aktiven Pins',
    menuPinExpiresIn: (h, m) => `Noch ${h}h ${m}m`,
    menuDarkMode: 'Dunkelmodus',
    menuDarkModeDesc: 'Karte auf dunkles Design umschalten',
    menuShare: 'Teilen',
    menuShareMessage: 'Pass auf, wo du trittst! 💩\n\nPin the Poo ist eine gemeinschaftliche Karte von Hundekot auf den Straßen. Hilf dabei, deine Stadt sauber zu halten!',
    menuAbout: 'Über die App',
    menuVersion: (v) => `Version ${v}`,

    yourPin: 'Dein Pin',
    droppedAgo: (time) => `Gesetzt vor ${time}`,
    hoursMinutesAgo: (h, m) => `vor ${h}h ${m}m`,
    minutesAgo: (m) => `vor ${m}m`,
    deleteMyPin: '🗑 Meinen Pin löschen',
    votesToRemove: (n, max) => `${n} / ${max} Stimmen zum Entfernen`,
    markAsGone: '🧹 Als entfernt markieren',
    youReported: '✓ Du hast dies bereits gemeldet',
    confirmationsNeeded: (n) => `Noch ${n} Bestätigung${n === 1 ? '' : 'en'} benötigt`,
  },

  // ── French ─────────────────────────────────────────────────────────────────
  fr: {
    slides: [
      {
        emoji: '💩',
        title: 'Regarde où\ntu marches',
        body: 'Pin the Poo est une carte participative des déjections canines dans les rues. Créée par la communauté, pour la communauté.',
      },
      {
        emoji: '📍',
        title: 'Tu en vois une ?\nÉpingle-la',
        body: "Appuie sur le bouton 💩 pour marquer l'emplacement exact. Les épingles disparaissent automatiquement après 48 heures.",
      },
      {
        emoji: '🔔',
        title: 'On te préviendra\nà temps',
        body: "Reçois une notification dès que tu es à 10 mètres d'une déjection signalée. Sans compte, totalement anonyme.",
      },
      {
        emoji: '🔐',
        title: 'Deux rapides\nautorisations',
        items: [
          { icon: '📍', text: "Localisation — pour afficher les déjections à proximité et t'avertir en temps réel. Jamais stockée ni partagée." },
          { icon: '🔔', text: "Notifications — pour te prévenir dès qu'une déjection se trouve à moins de 10 mètres." },
        ],
      },
    ],
    next: 'Suivant',
    skip: 'Passer',
    getStarted: 'Commencer',
    settingUp: 'Configuration...',

    pinThePoo: 'Épingler',

    acquiringGps: 'Acquisition GPS...',
    noLocation: 'Pas de localisation',
    waitingForGps: 'En attente du GPS...',
    dropsLeft: (n, max) => `${n}/${max} épingles restantes`,
    slowDown: 'Doucement !',
    spamLimit: 'Tu ne peux poser que 5 épingles par heure.',
    error: 'Erreur',
    dropError: "Impossible de poser l'épingle. Vérifie ta connexion.",
    deleteError: "Impossible de supprimer l'épingle. Vérifie ta connexion.",
    voteError: "Impossible d'envoyer le vote de suppression.",

    menuTitle: 'Paramètres',
    menuLanguage: 'Langue',
    menuNotifications: 'Alertes de proximité',
    menuNotificationsDesc: 'Me prévenir quand il y a une déjection à proximité',
    menuMyPins: 'Mes épingles actives',
    menuNoPins: 'Aucune épingle active',
    menuPinExpiresIn: (h, m) => `${h}h ${m}m restantes`,
    menuDarkMode: 'Mode sombre',
    menuDarkModeDesc: 'Passer la carte en thème sombre',
    menuShare: 'Partager',
    menuShareMessage: 'Regarde où tu marches ! 💩\n\nPin the Poo est une carte participative des déjections canines dans les rues. Aide à garder ta ville propre !',
    menuAbout: 'À propos',
    menuVersion: (v) => `Version ${v}`,

    yourPin: 'Ton épingle',
    droppedAgo: (time) => `Posée il y a ${time}`,
    hoursMinutesAgo: (h, m) => `${h}h ${m}m`,
    minutesAgo: (m) => `${m}m`,
    deleteMyPin: '🗑 Supprimer mon épingle',
    votesToRemove: (n, max) => `${n} / ${max} votes pour supprimer`,
    markAsGone: '🧹 Marquer comme disparu',
    youReported: '✓ Tu as déjà signalé ceci',
    confirmationsNeeded: (n) => `Encore ${n} confirmation${n === 1 ? '' : 's'} nécessaire${n === 1 ? '' : 's'}`,
  },
};
