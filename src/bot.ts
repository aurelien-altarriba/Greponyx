// ==== INTERFACES ====
interface Events {
  gratuit: undefined | number;
}

// ==== VARIABLES ====
const version: string = "0.1.3";

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
  },
  gratuit: false
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
  margin-right: 0.2rem;
}

.version {
  font-size: 0.6rem;
  margin: 0.5rem 0 0 0.4rem;
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

// Mode debug
// A FAIRE

// ==== AUTOMATISATION ====
const auto = {
  gratuit: () => {
    const boutons: any = document.getElementsByClassName('btn_time_reduction');
    let _click: boolean = false;
    for (let bouton of boutons) {
      if (bouton.innerText === "Gratuit" && !_click) {
        bouton.click();
        _click = true;
      }
    }
  }
}

// ==== CHANGEMENT D'ÉTAT ====
const change = {
  gratuit: () => {
    // Si l'event est en cours on l'arrête
    if (etat.gratuit) {
      clearInterval(events.gratuit);
      console.log("=== Event Gratuit TERMINE");
    }
    // Sinon on le démarre
    else {
      events.gratuit = setInterval(auto.gratuit, 1000);
      console.log("=== Event Gratuit DEMARRE");
    }
  }
}

// ==== HTML ====
const btGreponyx: HTMLElement = creer('div', {
  id: "bt-setup",
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
  id: "debug",
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
  id: "head-debug",
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
  id: "close-debug",
  className: "icone",
  innerHTML: "❌",
});

const fnGreponyx: HTMLElement = creer('div', {
  id: "setup",
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
  id: "head-setup",
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
  id: "info-setup",
  className: "icone",
  innerHTML: "❔",
});

const debugGreponyx: HTMLElement = creer('div', {
  id: "debug-setup",
  className: "icone",
  innerHTML: "🧰",
  style: {
    marginTop: "-0.1rem"
  }
});

const closeGreponyx: HTMLElement = creer('div', {
  id: "close-setup",
  className: "icone",
  innerHTML: "❌"
});

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
  innerHTML: "Finir les ordres gratuits de moins de 5 minutes",
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
});

// Bouton close Debug
closeDebugGreponyx.addEventListener('click', () => {
  fnDebugGreponyx.style.display = "none";
  debugGreponyx.style.display = "flex";
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

headGreponyx.addEventListener('mouseup', () => {
  headGreponyx.style.cursor = "grab";
  etat.setup.deplacable = false;
});

fnGreponyx.addEventListener('mousemove', e => {
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

headDebugGreponyx.addEventListener('mouseup', () => {
  headDebugGreponyx.style.cursor = "grab";
  etat.debug.deplacable = false;
});

fnDebugGreponyx.addEventListener('mousemove', e => {
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
  etat.gratuit = controleGratuit_input.checked;
});