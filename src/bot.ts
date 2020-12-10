// ==== INTERFACES ====
interface Events {
  gratuit: undefined | number;
  villages: undefined | number;
}

// ==== TYPES ====
type FN = "academie" | "senat";

// ==== VARIABLES ====
const version: string = "0.3.1";

// État de la fenêtre et des events
const etat = {
  setup: {
    deplacable: false,
    position: {
      x: 0,
      y: 0
    },
  },
  debug: {
    deplacable: false,
    position: {
      x: 0,
      y: 0
    },
    actif: false,
    messages: 0,
    limite: 200
  },
  windows: {
    tempsVerif: 100,
    academie: {
      auto: false,
      erreur: false,
      nbEvent: 0,
      fini: {
        gratuit: false
      }
    },
    senat: {
      auto: false,
      erreur: false,
      nbEvent: 0,
      fini: {
        gratuit: false
      }
    }
  },
  gratuit: {
    actif: false,
    timer: 120000       // = 2 min
  },
  villages: {
    actif: false,
    timer: 303000,      // = 5 min et 3s
    enCours: false,
    liste: [] as Array<number>
  }
}

const events: Events = {
  gratuit: undefined,
  villages: undefined
}

// ==== CSS ====
const _css = `.check {
  width: 1.4rem;
  height: 1.4rem;
  cursor: pointer;
  margin-right: 0.5rem;
  flex: 1;
}

.check + label {
  color: white;
  cursor: pointer;
  user-select: none;
  text-align: left;
  flex: 20;
}

.icone {
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  cursor: pointer;
  padding-right: 0.2rem;
}

.version {
  font-size: 0.6rem;
  margin: 0.5rem 0 0 0.4rem;
}

.temps {
  display: block;
  font-size: 0.7rem;
  color: #aaa;
  margin-top: -0.6rem;
}

#log::first-line {
  color: #ff8;
}

.debut {
  color: #afa !important;
}

.fin {
  color: #fb8 !important;
}

.erreur {
  color: #f66 !important;
}`;

const css = document.createElement('style');
css.appendChild(document.createTextNode(_css));
document.getElementsByTagName('head')[0].appendChild(css);

// ==== FONCTIONS ====
// Pour vérifier si une clé existe et la rendre accessible en TS
function hasOwnProperty<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, any> {
  return obj.hasOwnProperty(prop)
}

// Pour créer un élément de DOM simplement
function creer(type: string, args: object): HTMLElement {
  const el = <HTMLElement>(document.createElement(type));

  if (hasOwnProperty(args, "style")) {
    for (const key in args.style) {
      (<any>el.style)[key] = args.style[key];
    }
    delete args.style;
  }

  for (const key in args) {
    (<any>el)[key] = (<any>args)[key];
  }

  return el;
}

// Log en mode debug
function log(txt: string) {
  if (etat.debug.actif) {
    const _now: any = document.getElementsByClassName('server_time_area')[0];
    const time = _now.innerText.split(' ')[0];
    contentDebugGreponyx.innerHTML = `[${time}] ${txt}<br/>${contentDebugGreponyx.innerHTML}`;

    if (++etat.debug.messages >= etat.debug.limite) {
      cleanLog();
    }
  }
}

// Nettoyage du debug
function cleanLog() {
  const dernierMessage = contentDebugGreponyx.innerHTML.lastIndexOf('[');
  contentDebugGreponyx.innerHTML = contentDebugGreponyx.innerHTML.slice(0, dernierMessage);
  etat.debug.messages--;
}

// Fonctions GRATUIT
// Réinitialise l'état d'une fenêtre après une erreur
function resetFn(fn: FN) {
  etat.windows[fn].erreur = false;
  etat.windows[fn].auto = false;
  etat.windows[fn].fini.gratuit = true;
  etat.windows[fn].nbEvent = 0;
}

// Vérifie les boutons gratuits sur la page et clic
function verifGratuit(fn: FN) {
  log("Vérification des ordres 'GRATUIT'...");
  const boutons: any = document.getElementsByClassName('btn_time_reduction');
  let _click: boolean = false;
  for (let bouton of boutons) {
    if (bouton.innerText === "Gratuit" && !_click) {
      bouton.click();
      _click = true;
      log("Bouton 'GRATUIT' détecté. Clic effectué!");
    }
  }
  if (!_click) {
    log("Aucun bouton 'GRATUIT' n'a été trouvé.");
  }
  etat.windows[fn].fini.gratuit = true;
}

// Si la fenêtre est ouverte
function estOuvert(fn: FN): boolean {
  if (fn == 'academie') {
    return document.querySelector('.classic_window.academy') == null ? false : true;
  }
  else if (fn == 'senat') {
    return document.querySelector('.main_window_background') == null ? false : true;
  }
  else {
    throw new Error("Nom inconnu en paramètre de la fonction 'estOuvert'.");
  }
}

// Ouvrir une fenêtre
function ouvrir(fn: FN) {
  let cpt = 0;

  // Académie
  if (fn == 'academie') {
    etat.windows.academie.auto = false;

    //@ts-ignore
    AcademyWindowFactory.openAcademyWindow();

    // On regarde si la fenêtre s'ouvre
    let _wait = setInterval(function() {
      const res = document.querySelector('.window_curtain .academy');
      cpt++;
      
      // Si la fenêtre s'ouvre
      if (res != null) {
        clearInterval(_wait);
        etat.windows.academie.auto = true;
        log(`<span class="debut">🔆 Fenêtre de l'académie ouverte et chargée.</span>`);
      }
      
      // Si 10 tentatives sans succés
      else if (cpt >= 10) {
        clearInterval(_wait);
        etat.windows.academie.erreur = true;
        log(`<span class="erreur">⚠ Impossible de détecter la fenêtre de l'académie!</span>`);
      }
    }, etat.windows.tempsVerif);
  }

  // Sénat
  else if (fn == 'senat') {
    etat.windows.senat.auto = false;

    //@ts-ignore
    MainWindowFactory.openMainWindow();
    let _wait = setInterval(function() {
      const res = document.querySelector('.main_window_background');
      cpt++;

      // Si la fenêtre s'ouvre
      if (res != null) {
        clearInterval(_wait);
        // On ajoute un id pour retrouver le bouton Fermer de la fenêtre
        //@ts-ignore
        res.parentElement.parentElement.parentElement.id = "_senat";
        etat.windows.senat.auto = true;
        log(`<span class="debut">🔆 Fenêtre du sénat ouverte ou chargée.</span>`);
      }

      // Si 10 tentatives sans succés
      else if (cpt >= 10) {
        clearInterval(_wait);
        etat.windows.senat.erreur = true;
        log(`<span class="erreur">⚠ Impossible de détecter la fenêtre du sénat!</span>`);
      }
    }, etat.windows.tempsVerif);
  }

  // Si aucun
  else {
    throw new Error("Nom inconnu en paramètre de la fonction 'ouvert'.");
  }
}

// Fermer une fenêtre
function fermer(fn: FN) {

  // Académie
  if (fn == 'academie') {
    const res: HTMLElement | null = document.querySelector(".academy .close");
    if (res != null) {
      res.click();
      log(`<span class="fin">🔻 La fenêtre de l'académie a été fermée.</span>`);
    }
    etat.windows.academie.auto = false;
  }

  // Sénat
  else if (fn == 'senat') {
    const res: HTMLElement| null = document.querySelector('#_senat .ui-dialog-titlebar-close');
    if (res != null) {
      res.click();
      log(`<span class="fin">🔻 La fenêtre du sénat a été fermée.</span>`);
    }
    etat.windows.senat.auto = false;
  }

  // Si aucun
  else {
    throw new Error("Nom inconnu en paramètre de la fonction 'fermer'");
  }
}

// Effectue la gestion de la fenêtre pour la recherche du gratuit
function rechercherGratuit(fn: FN) {
  if (!estOuvert(fn)) {
    ouvrir(fn);
  } else {
    etat.windows[fn].auto = true;
  }

  // Attente fenêtre ouverte puis recherche
  let _search = setInterval(function() {
    if (etat.windows[fn].auto) {
      clearInterval(_search);
      verifGratuit(fn);
    }

    // Si erreur sur la fenêtre
    else if (etat.windows[fn].erreur) {
      clearInterval(_search);
      if (++etat.windows[fn].nbEvent >= 2) {
        resetFn(fn);
      }
    }
  }, etat.windows.tempsVerif);

  // Attente recherche finie puis fermeture
  let _close = setInterval(function() {
    if (etat.windows[fn].fini.gratuit) {
      clearInterval(_close);
      fermer(fn);
    }

    // Si erreur sur la fenêtre
    else if (etat.windows[fn].erreur) {
      clearInterval(_close);
      if (++etat.windows[fn].nbEvent >= 2) {
        resetFn(fn);
      }
    }
  }, etat.windows.tempsVerif);

  // À la fin il reste fini.gratuit à TRUE et .auto à FALSE
}

// Fonctions VILLAGES
// Récupère les ressources d'un village
function farmVillage(id: number) {
  log("Récolte du village...");
  let ouvert = false;

  //@ts-ignore
  window.FarmTownWindowFactory.openWindow(id);

  // On attends l'ouverture
  let _waitOpen = setInterval(function() {
    const res = document.querySelector('.window_curtain .farm_town .window_content .action_wrapper');
    if (res != null) {
      clearInterval(_waitOpen);
      ouvert = true;
      log(`<span class="debut">🔆 Fenêtre du village ouverte ou chargée.</span>`);
    }
  }, etat.windows.tempsVerif);

  let _waitRecup = setInterval(function() {
    if (ouvert) {
      clearInterval(_waitRecup);
      //@ts-ignore
      document.querySelector('.window_curtain .farm_town .action_wrapper').children[0].children[3].click();
      log("Clic pour récupérer les ressources effectué!");
      etat.villages.liste.shift();
      etat.villages.enCours = false;
      log(`Villages restants: ${etat.villages.liste.length}`);
    }
  }, etat.windows.tempsVerif);
}

// ==== AUTOMATISATION ====
const auto = {
  gratuit: () => {
    log("## Début de la recherche des ordres 'GRATUIT'");

    // Académie
    log("# Lancement recherche académie");
    rechercherGratuit('academie');

    // Sénat
    let _waitSenat = setInterval(function() {
      if (etat.windows.academie.fini.gratuit && !etat.windows.academie.auto) {
        clearInterval(_waitSenat);
        etat.windows.academie.fini.gratuit = false;
        etat.windows.academie.auto = false;

        log("# Lancement recherche sénat");
        rechercherGratuit('senat');
      }
    }, etat.windows.tempsVerif);

    // Fin
    let _waitFin = setInterval(function() {
      if (etat.windows.senat.fini.gratuit && !etat.windows.senat.auto) {
        clearInterval(_waitFin);
        etat.windows.senat.fini.gratuit = false;
        etat.windows.senat.auto = false;
        log("## Fin de la recherche des ordres 'GRATUIT'");
      }
    }, etat.windows.tempsVerif);
  },
  villages: () => {
    log("## Début de la récolte des villages");

    // On récupère les villages sur l'île
    const _villages: any = document.getElementsByClassName('owned farm_town');

    // On créé un tableau d'ID des villages
    for (const village of _villages) {
      etat.villages.liste.push(+village.dataset.id);
    }

    // On lance l'automatisation village par village
    let _waitVillages = setInterval(function() {
      // S'il n'y a plus aucun village et que les traitements sont terminés
      if (etat.villages.liste.length < 1 && !etat.villages.enCours) {
        clearInterval(_waitVillages);
        //@ts-ignore
        document.querySelector('.window_curtain .farm_town .btn_wnd.close').click();
        log(`<span class="fin">🔻 La fenêtre du village a été fermée</span>`);
        log("## Fin de la récolte des villages");
      }
      // Sinon on traite le village
      else if (!etat.villages.enCours) {
        etat.villages.enCours = true;
        farmVillage(etat.villages.liste[0]);
      }
    }, etat.windows.tempsVerif);
  }
}

// ==== CHANGEMENT D'ÉTAT ====
const change = {
  gratuit: () => {
    // Si l'event est en cours on l'arrête
    if (etat.gratuit.actif) {
      log("→ ARRÊT de la détection des ordres gratuits");
      clearInterval(events.gratuit);
    }
    // Sinon on le démarre
    else {
      log("→ DÉMARRAGE de la détection des ordres gratuits");
      auto.gratuit();
      events.gratuit = setInterval(auto.gratuit, etat.gratuit.timer);
    }
  },
  villages: () => {
    if (etat.villages.actif) {
      log("→ ARRÊT de la récupération de ressources des villages");
      clearInterval(events.villages);
    }
    else {
      log("→ DÉMARRAGE de la récupération de ressources des villages");
      auto.villages();
      events.villages = setInterval(auto.villages, etat.villages.timer);
    }
  }
}

// ==== HTML ====
const btGreponyx: HTMLElement = creer('div', {
  innerHTML: "🐱‍👤",
  style: {
    width: "35px",
    height: "35px",
    background: "linear-gradient(0deg, #222, #555)",
    borderRadius: "0 15px 0 0",
    boxShadow: "0 0 3px black",
    position: "absolute",
    left: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.3rem",
    paddingBottom: "0.2rem",
    userSelect: "none",
    cursor: "pointer",
    zIndex: 1998
  }
});

const fnDebugGreponyx: HTMLElement = creer('div', {
  style: {
    width: "600px",
    height: "400px",
    backgroundColor: "#111",
    borderRadius: "5px",
    border: "1px solid black",
    boxShadow: "0 0 3px black",
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 2000,
    display: "none"
  }
});

const headDebugGreponyx: HTMLElement = creer('div', {
  style: {
    width: "100%",
    height: "2rem",
    background: "linear-gradient(0deg, #222, #333)",
    borderRadius: "5px 5px 0 0",
    borderBottom: "2px solid black",
    userSelect: "none",
    cursor: "grab",
    display: "flex",
    top: 0
  }
});

const titleDebugGreponyx: HTMLElement = creer('div', {
  innerHTML: ">_ DEBUG",
  style: {
    width: "100%",
    height: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: "1.1rem",
    paddingLeft: "1rem"
  }
});

const closeDebugGreponyx: HTMLElement = creer('div', {
  className: "icone",
  innerHTML: "❌",
});

const fnGreponyx: HTMLElement = creer('div', {
  style: {
    width: "450px",
    height: "200px",
    background: "linear-gradient(10deg, #111, #444)",
    borderRadius: "10px",
    border: "2px solid #222",
    position: "absolute",
    bottom: "10px",
    left: "10px",
    zIndex: 2000,
    display: "none"
  }
});

const headGreponyx: HTMLElement = creer('div', {
  style: {
    width: "100%",
    height: "2rem",
    background: "linear-gradient(0deg, #222, #333)",
    borderRadius: "10px 10px 0 0",
    borderBottom: "2px solid #222",
    userSelect: "none",
    cursor: "grab",
    display: "flex",
    top: 0
  }
});

const titleGreponyx: HTMLElement = creer('div', {
  innerHTML: `🐱‍👤 GrepoNyx <span class="version">v.${version}</span>`,
  style: {
    width: "100%",
    height: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: "1.1rem",
    paddingLeft: "3rem"
  }
});

const infoGreponyx: HTMLElement = creer('div', {
  className: "icone",
  innerHTML: "❔",
});

const debugGreponyx: HTMLElement = creer('div', {
  className: "icone",
  innerHTML: "🧰",
  style: {
    marginTop: "-0.1rem"
  }
});

const closeGreponyx: HTMLElement = creer('div', {
  className: "icone",
  innerHTML: "❌"
});

const contentDebugGreponyx: HTMLElement = creer('div', {
  id: "log",
  style: {
    padding: "0.5rem 1rem",
    color: "white",
    textAlign: "left",
    height: "350px",
    overflowY: "auto",
    overflowX: "hidden"
  }
})

// Contrôles
const controle: HTMLElement = creer('div', {
  style: {
    margin: "1rem"
  }
});

// Gratuit
const controleGratuit: HTMLElement = creer('div', {
  style: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "1.5rem 1rem"
  }
});

const controleGratuit_input: HTMLInputElement = <HTMLInputElement> creer('input', {
  id: "check-gratuit",
  className: "check",
  type: "checkbox",
});

const controleGratuit_label: HTMLElement = creer('label', {
  htmlFor: "check-gratuit",
  innerHTML: `<span class="temps">⏲ Toutes les 2 min</span>Finir les ordres gratuits de moins de 5 minutes (recherche et construction)`,
});

// Villages
const controleVillages: HTMLElement = creer('div', {
  style: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "1.5rem 1rem"
  }
});

const controleVillages_input: HTMLInputElement = <HTMLInputElement> creer('input', {
  id: "check-villages",
  className: "check",
  type: "checkbox",
});

const controleVillages_label: HTMLElement = creer('label', {
  htmlFor: "check-villages",
  innerHTML: `<span class="temps">⏲ Toutes les 5 min et 5s</span>Récupérer les ressources des villages de paysans toutes les 5 minutes`,
});

// ==== AJOUT HTML ====
// Éléments de la fenêtre principale
fnGreponyx.appendChild(headGreponyx);
headGreponyx.appendChild(titleGreponyx);
headGreponyx.appendChild(infoGreponyx);
headGreponyx.appendChild(debugGreponyx);
headGreponyx.appendChild(closeGreponyx);

fnGreponyx.appendChild(controle);

// Éléments de la fenêtre "Debug"
fnDebugGreponyx.appendChild(headDebugGreponyx);
headDebugGreponyx.appendChild(titleDebugGreponyx);
headDebugGreponyx.appendChild(closeDebugGreponyx);
fnDebugGreponyx.appendChild(contentDebugGreponyx);

// Event "Gratuit"
controle.appendChild(controleGratuit);
controleGratuit.appendChild(controleGratuit_input);
controleGratuit.appendChild(controleGratuit_label);

// Event "Villages"
controle.appendChild(controleVillages);
controleVillages.appendChild(controleVillages_input);
controleVillages.appendChild(controleVillages_label);

// Ajout sur Grepolis
document.body.appendChild(btGreponyx);
document.body.appendChild(fnGreponyx);
document.body.appendChild(fnDebugGreponyx);

// ==== EVENTS ====
// Bouton setup
btGreponyx.addEventListener('mouseenter', () => {
  btGreponyx.style.boxShadow = "0 0 4px black inset";
  btGreponyx.style.border = "1px solid black";
});

btGreponyx.addEventListener('mouseleave', () => {
  btGreponyx.style.boxShadow = "0 0 4px black";
  btGreponyx.style.border = "none";
});

btGreponyx.addEventListener('click', () => {
  fnGreponyx.style.display = "block";
  btGreponyx.style.display = "none";
});

// Bouton close setup
closeGreponyx.addEventListener('click', () => {
  fnGreponyx.style.display = "none";
  btGreponyx.style.display = "flex";
});

// Bouton Debug
debugGreponyx.addEventListener('click', () => {
  fnDebugGreponyx.style.display = "block";
  debugGreponyx.style.display = "none";
  etat.debug.actif = true;
});

// Bouton close Debug
closeDebugGreponyx.addEventListener('click', () => {
  fnDebugGreponyx.style.display = "none";
  debugGreponyx.style.display = "flex";
  etat.debug.actif = false;
});

// Bouton Aide
infoGreponyx.addEventListener('click', () => {
  alert("L'aide sera bientôt disponible!");
});

// Barre header setup déplacement
headGreponyx.addEventListener('mousedown', e => {
  headGreponyx.style.cursor = "grabbing";
  etat.setup.deplacable = true;
  const pos: DOMRect = fnGreponyx.getBoundingClientRect();
  etat.setup.position.x = e.pageX - pos.left;
  etat.setup.position.y = e.pageY - pos.top;
  fnGreponyx.style.zIndex = "2001";
  fnDebugGreponyx.style.zIndex = "2000";
});

document.addEventListener('mouseup', () => {
  headGreponyx.style.cursor = "grab";
  etat.setup.deplacable = false;
});

document.addEventListener('mousemove', e => {
  if (etat.setup.deplacable) {
    fnGreponyx.style.top = `${e.pageY - etat.setup.position.y}px`;
    fnGreponyx.style.left = `${e.pageX - etat.setup.position.x}px`;
  }
});

// Barre header Debug déplacement
headDebugGreponyx.addEventListener('mousedown', e => {
  headDebugGreponyx.style.cursor = "grabbing";
  etat.debug.deplacable = true;
  const pos: DOMRect = fnDebugGreponyx.getBoundingClientRect();
  etat.debug.position.x = e.pageX - pos.left;
  etat.debug.position.y = e.pageY - pos.top;
  fnDebugGreponyx.style.zIndex = "2001";
  fnGreponyx.style.zIndex = "2000";
});

document.addEventListener('mouseup', () => {
  headDebugGreponyx.style.cursor = "grab";
  etat.debug.deplacable = false;
});

document.addEventListener('mousemove', e => {
  if (etat.debug.deplacable) {
    fnDebugGreponyx.style.top = `${e.pageY - etat.debug.position.y}px`;
    fnDebugGreponyx.style.left = `${e.pageX - etat.debug.position.x}px`;
  }
});

// Système focus fenêtres
fnGreponyx.addEventListener('click', () => {
  fnGreponyx.style.zIndex = "2001";
  fnDebugGreponyx.style.zIndex = "2000";
});

fnDebugGreponyx.addEventListener('click', () => {
  fnDebugGreponyx.style.zIndex = "2001";
  fnGreponyx.style.zIndex = "2000";
});

// Checkbox "Gratuit"
controleGratuit_input.addEventListener('change', () => {
  change.gratuit();
  etat.gratuit.actif = controleGratuit_input.checked;
});

// Checkbox "Villages"
controleVillages_input.addEventListener('change', () => {
  change.villages();
  etat.villages.actif = controleVillages_input.checked;
});