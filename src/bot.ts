// ==== INTERFACES ====
interface Events {
  gratuit: undefined | number;
}

// ==== VARIABLES ====
const version: string = "0.2.1";

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
    tempsVerif: 300,
    academie: {
      auto: false,
      fini: {
        gratuit: false
      }
    },
    port: {
      auto: false,
      fini: {
        gratuit: false
      }
    },
    senat: {
      auto: false,
      fini: {
        gratuit: false
      }
    },
    caserne: {
      auto: false,
      fini: {
        gratuit: false
      }
    }
  },
  gratuit: {
    actif: false,
    timer: 120000       // 2 minutes
  }
}

const events: Events = {
  gratuit: undefined
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
  margin-top: -0.3rem;
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

// Vérifie les boutons gratuits sur la page et clic
function verifGratuit(fn?: string) {
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
    log("Aucun bouton 'GRATUIT' n'a été trouvé");
  }
  if (fn != undefined) {
    //@ts-ignore
    etat.windows[fn].fini.gratuit = true;
  }
}

// Si la fenêtre est ouverte
function estOuvert(nom: string): boolean {
  if (nom == 'academie') {
    return document.querySelector('.classic_window.academy') == null ? false : true;
  }
  else if (nom == 'port') {
    return document.querySelector('.docks.window_background') == null ? false : true;
  }
  else if (nom == 'senat') {
    return document.querySelector('.main_window_background') == null ? false : true;
  }
  else if (nom == 'caserne') {
    return document.querySelector('.barracks.window_background') == null ? false : true;
  }
  else {
    throw new Error("Nom inconnu en paramètre de la fonction 'estOuvert'");
  }
}

// Ouvrir une fenêtre
function ouvrir(fn: string) {

  // Académie
  if (fn == 'academie') {
    log("Fenêtre de l'académie ouverte.");
    //@ts-ignore
    AcademyWindowFactory.openAcademyWindow();
    etat.windows.academie.auto = true;
  }

  // Port
  else if (fn == 'port') {
    etat.windows.port.auto = false;

    const addId = (el: any) => {
      el.parentElement.parentElement.parentElement.id = "_port";
      etat.windows.port.auto = true;
      log("Fenêtre du port ouverte.");
    }
    //@ts-ignore
    DocksWindowFactory.openDocksWindow();
    let _wait = setInterval(function() {
      const res = document.querySelector('.docks.window_background');
      if (res != null) {
        clearInterval(_wait);
        addId(res);
      }
    }, etat.windows.tempsVerif);
  }

  // Sénat
  else if (fn == 'senat') {
    etat.windows.senat.auto = false;

    const addId = (el: any) => {
      el.parentElement.parentElement.parentElement.id = "_senat";
      etat.windows.senat.auto = true;
      log("Fenêtre du port ouverte.");
    }
    //@ts-ignore
    MainWindowFactory.openMainWindow();
    let _wait = setInterval(function() {
      const res = document.querySelector('.main_window_background');
      if (res != null) {
        clearInterval(_wait);
        addId(res);
      }
    }, etat.windows.tempsVerif);
  }

  // Caserne
  else if (fn == 'caserne') {
    etat.windows.caserne.auto = false;

    const addId = (el: any) => {
      el.parentElement.parentElement.parentElement.id = "_caserne";
      etat.windows.caserne.auto = true;
      log("Fenêtre de la caserne ouverte.");
    }
    //@ts-ignore
    BarracksWindowFactory.openBarracksWindow();
    let _wait = setInterval(function() {
      const res = document.querySelector('.barracks.window_background');
      if (res != null) {
        clearInterval(_wait);
        addId(res);
      }
    }, etat.windows.tempsVerif);
  }
}

// Fermer une fenêtre
function fermer(fn: string) {
  if (fn == 'academie') {
    //@ts-ignore
    document.querySelector(".academy .close").click();
    etat.windows.academie.auto = false;
    log("La fenêtre de l'académie a été fermée");
  }
  else if (fn == 'port') {
    //@ts-ignore
    document.querySelector('#_port .ui-dialog-titlebar-close').click();
    etat.windows.port.auto = false;
    log("La fenêtre du port a été fermée");
  }
  else if (fn == 'senat') {
    //@ts-ignore
    document.querySelector('#_senat .ui-dialog-titlebar-close').click();
    etat.windows.senat.auto = false;
    log("La fenêtre du sénat a été fermée");
  }
  else if (fn == 'caserne') {
    //@ts-ignore
    document.querySelector('#_caserne .ui-dialog-titlebar-close').click();
    etat.windows.caserne.auto = false;
    log("La fenêtre de la caserne a été fermée");
  }
}

function rechercherGratuit(fn: string) {
  if (!estOuvert(fn)) {
    ouvrir(fn);
  } else {
    //@ts-ignore
    etat.windows[fn].auto = true;
  }

  // Attente fenêtre ouverte puis recherche
  let _search = setInterval(function() {
    //@ts-ignore
    if (etat.windows[fn].auto || etat.windows[fn].manuel) {
      clearInterval(_search);
      verifGratuit(fn);
    }
  }, 200);

  // Attente recherche finie puis fermeture
  let _close = setInterval(function() {
    //@ts-ignore
    if (etat.windows[fn].fini.gratuit) {
      clearInterval(_close);
      //@ts-ignore
      if (etat.windows[fn].auto) { fermer(fn); }
    }
  }, 200);

  // À la fin il reste fini.gratuit à TRUE et .auto à FALSE
}

// ==== AUTOMATISATION ====
const auto = {
  gratuit: () => {

    // Académie
    log("# Lancement recherche académie");
    rechercherGratuit('academie');

    // Port
    let _waitPort = setInterval(function() {
      if (etat.windows.academie.fini.gratuit && !etat.windows.academie.auto) {
        clearInterval(_waitPort);
        etat.windows.academie.fini.gratuit = false;
        etat.windows.academie.auto = false;

        log("# Lancement recherche port");
        rechercherGratuit('port');
      }
    }, 200);

    // Sénat
    let _waitSenat = setInterval(function() {
      if (etat.windows.port.fini.gratuit && !etat.windows.port.auto) {
        clearInterval(_waitSenat);
        etat.windows.port.fini.gratuit = false;
        etat.windows.port.auto = false;

        log("# Lancement recherche sénat");
        rechercherGratuit('senat');
      }
    }, 200);

    // Caserne
    let _waitCaserne = setInterval(function() {
      if (etat.windows.senat.fini.gratuit && !etat.windows.senat.auto) {
        clearInterval(_waitCaserne);
        etat.windows.senat.fini.gratuit = false;
        etat.windows.senat.auto = false;

        log("# Lancement recherche caserne");
        rechercherGratuit('caserne');
      }
    }, 200);

    // Fin
    let _waitFin = setInterval(function() {
      if (etat.windows.caserne.fini.gratuit && !etat.windows.caserne.auto) {
        clearInterval(_waitFin);
        etat.windows.caserne.fini.gratuit = false;
        etat.windows.caserne.auto = false;
        log("= Fin de la recherche des ordres 'GRATUIT' =");
      }
    }, 200);
  }
}

// ==== CHANGEMENT D'ÉTAT ====
const change = {
  gratuit: () => {
    // Si l'event est en cours on l'arrête
    if (etat.gratuit.actif) {
      log("→ FIN de la détection des ordres gratuits");
      clearInterval(events.gratuit);
    }
    // Sinon on le démarre
    else {
      log("→ DÉBUT de la détection des ordres gratuits");
      auto.gratuit();
      events.gratuit = setInterval(auto.gratuit, etat.gratuit.timer);
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

const controleGratuit: HTMLElement = creer('div', {
  style: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "0.5rem 1rem"
  }
});

const controleGratuit_input: HTMLInputElement = <HTMLInputElement> creer('input', {
  id: "check-gratuit",
  className: "check",
  type: "checkbox",
});

const controleGratuit_label: HTMLElement = creer('label', {
  htmlFor: "check-gratuit",
  innerHTML: `<span class="temps">⏲ Toutes les 2 minutes</span>Finir les ordres gratuits de moins de 5 minutes`,
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