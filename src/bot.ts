// ==== CSS ====
const _css = `.check {
  width: 1.4rem;
  height: 1.4rem;
  cursor: pointer;
  margin-right: 0.5rem;
}

.check + label {
  color: white;
  cursor: pointer;
  user-select: none;
}`;

const css = document.createElement('style');
css.appendChild(document.createTextNode(_css));
document.getElementsByTagName('head')[0].appendChild(css);

// ==== INTERFACES ====
interface Events {
  gratuit: undefined | number;
}

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

// ==== VARIABLES ====
const version: string = "0.1.2";

// État de la fenêtre et des events
const etat = {
  deplacable: false,
  position: {
    x: 0,
    y: 0
  },
  gratuit: false
}

const events: Events = {
  gratuit: undefined
}

// ==== HTML ====
const btGreponyx: HTMLElement = creer('div', {
  id: "bt-setup",
  innerHTML: "🐱‍👤",
  style: {
    width: "50px",
    height: "50px",
    background: "linear-gradient(0deg, #111, #444)",
    borderRadius: "0 15px 0 0",
    boxShadow: "0 0 4px black",
    position: "absolute",
    left: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.8rem",
    paddingBottom: "0.2rem",
    userSelect: "none",
    cursor: "pointer",
    zIndex: 1998
  }
});

const fnGreponyx: HTMLElement = creer('div', {
  id: "setup",
  style: {
    width: "350px",
    height: "100px",
    background: "linear-gradient(15deg, #111, #444)",
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
  innerHTML: `🐱‍👤 GrepoNyx - v.${version}`,
  style: {
    width: "100%",
    height: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: "5%",
    color: "white",
    fontSize: "1.1rem"
  }
});

const closeGreponyx: HTMLElement = creer('div', {
  id: "close-setup",
  innerHTML: "❌",
  style: {
    width: "2rem",
    height: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.1rem",
    cursor: "pointer"
  }
});

// Contrôles
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
  innerHTML: "Finir les ordres de moins de 5 minutes",
});

fnGreponyx.appendChild(headGreponyx);
headGreponyx.appendChild(titleGreponyx);
headGreponyx.appendChild(closeGreponyx);

fnGreponyx.appendChild(controleGratuit);
controleGratuit.appendChild(controleGratuit_input);
controleGratuit.appendChild(controleGratuit_label);

document.body.appendChild(btGreponyx);
document.body.appendChild(fnGreponyx);

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

// Barre header déplacement
headGreponyx.addEventListener('mousedown', e => {
  headGreponyx.style.cursor = "grabbing";
  etat.deplacable = true;
  const pos: DOMRect = fnGreponyx.getBoundingClientRect();
  etat.position.x = e.pageX - pos.left;
  etat.position.y = e.pageY - pos.top;
});

headGreponyx.addEventListener('mouseup', () => {
  headGreponyx.style.cursor = "grab";
  etat.deplacable = false;
});

fnGreponyx.addEventListener('mousemove', e => {
  if (etat.deplacable) {
    fnGreponyx.style.top = `${e.pageY - etat.position.y}px`;
    fnGreponyx.style.left = `${e.pageX - etat.position.x}px`;
  }
});

// Checkbox "Gratuit"
controleGratuit_input.addEventListener('change', () => {
  change.gratuit();
  etat.gratuit = controleGratuit_input.checked;
});