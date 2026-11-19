//Recupero elements interdicie ciutat
const botoPausa = document.getElementById("botoPausa");
const botoReinicia = document.getElementById("botoReinicia");
const controlVelocitat = document.getElementById("velocitat");
const valorVelocitat = document.getElementById("valorVelocitat");
const rellotge = document.getElementById("rellotge");

//Mostro l'hora real de l'ordinador
function actualitzarRellotge() {
  const ara = new Date();

  rellotge.textContent = ara.toLocaleTimeString("ca-ES", {
    hour12: false
  });
}

actualitzarRellotge();
setInterval(actualitzarRellotge, 1000);

//Recupero les preferències guardades al navegador
controlVelocitat.value = localStorage.getItem("velocitatCiutat") || "1";

valorVelocitat.textContent = controlVelocitat.value + "×";

//Envio la velocitat seleccionada al dibuix
controlVelocitat.addEventListener("input", function () {
  const velocitat = Number(controlVelocitat.value);

  valorVelocitat.textContent = velocitat + "×";

  localStorage.setItem("velocitatCiutat", velocitat);

  if (typeof canviarVelocitat === "function") {
    canviarVelocitat(velocitat);
  }
});

//Activo o aturo l'animació
botoPausa.addEventListener("click", function () {
  if (typeof canviarPausa === "function") {
    canviarPausa();
  }
});

//Torno a iniciar l'animació
botoReinicia.addEventListener("click", function () {
  if (typeof reiniciarCiutat === "function") {
    reiniciarCiutat();
  }
});


//Recupero els elements del temporitzador de la interfície
const tempsRestant = document.getElementById("tempsRestant");
const missatgeTemporitzador = document.getElementById("missatgeTemporitzador");

const botoIniciaTemps = document.getElementById("botoIniciaTemps");
const botoPausaTemps = document.getElementById("botoPausaTemps");
const botoReiniciaTemps = document.getElementById("botoReiniciaTemps");

const DURADA_TEMPS = 25 * 60;

let segonsRestants = Number(localStorage.getItem("tempsRestant")) || DURADA_TEMPS;
let tempsFinalitzacio = Number(localStorage.getItem("tempsFinalitzacio")) || 0;
let temporitzadorActiu = localStorage.getItem("temporitzadorActiu") === "true";

let compteEnrere;

//Mostro el temps en minuts i segons
function mostrarTemps() {
  const minuts = Math.floor(segonsRestants / 60);
  const segons = segonsRestants % 60;

  tempsRestant.textContent =
    String(minuts).padStart(2, "0") + ":" +
    String(segons).padStart(2, "0");
}

//Actualitzo el temps restant
function actualitzarTemporitzador() {
  if (!temporitzadorActiu) return;

  segonsRestants = Math.max(
    0,
    Math.ceil((tempsFinalitzacio - Date.now()) / 1000)
  );

  localStorage.setItem("tempsRestant", segonsRestants);
  mostrarTemps();

  if (segonsRestants <= 0) {
    temporitzadorActiu = false;
    localStorage.setItem("temporitzadorActiu", "false");
    localStorage.removeItem("tempsFinalitzacio");

    missatgeTemporitzador.textContent = "Temps acabat! Bona feina!";
    clearInterval(compteEnrere);
  }
}

//Començo el compte enrere
botoIniciaTemps.addEventListener("click", function () {
  if (temporitzadorActiu || segonsRestants <= 0) return;

  temporitzadorActiu = true;
  tempsFinalitzacio = Date.now() + segonsRestants * 1000;

  localStorage.setItem("temporitzadorActiu", "true");
  localStorage.setItem("tempsFinalitzacio", tempsFinalitzacio);

  missatgeTemporitzador.textContent = "Concentra't en la teva tasca!";
  clearInterval(compteEnrere);
  compteEnrere = setInterval(actualitzarTemporitzador, 250);

  actualitzarTemporitzador();
});

//Poso el temporitzador en pausa
botoPausaTemps.addEventListener("click", function () {
  if (!temporitzadorActiu) return;

  actualitzarTemporitzador();

  temporitzadorActiu = false;
  localStorage.setItem("temporitzadorActiu", "false");
  localStorage.removeItem("tempsFinalitzacio");

  clearInterval(compteEnrere);
  missatgeTemporitzador.textContent = "Temporitzador en pausa.";
});

//Reinicio els 25 minuts
botoReiniciaTemps.addEventListener("click", function () {
  temporitzadorActiu = false;
  segonsRestants = DURADA_TEMPS;
  tempsFinalitzacio = 0;

  localStorage.setItem("temporitzadorActiu", "false");
  localStorage.setItem("tempsRestant", segonsRestants);
  localStorage.removeItem("tempsFinalitzacio");

  clearInterval(compteEnrere);

  missatgeTemporitzador.textContent = "Preparada per concentrar-te?";
  mostrarTemps();
});

//Recupero l'estat quan torno a obrir l'extensió
if (temporitzadorActiu) {
  if (tempsFinalitzacio > Date.now()) {
    compteEnrere = setInterval(actualitzarTemporitzador, 250);
    actualitzarTemporitzador();
    missatgeTemporitzador.textContent = "Concentra't en la teva tasca!";
  } else {
    segonsRestants = 0;
    temporitzadorActiu = false;

    localStorage.setItem("tempsRestant", 0);
    localStorage.setItem("temporitzadorActiu", "false");
    localStorage.removeItem("tempsFinalitzacio");

    missatgeTemporitzador.textContent = "Temps acabat! Bona feina!";
  }
} else if (segonsRestants <= 0) {
  missatgeTemporitzador.textContent = "Temps acabat! Bona feina!";
} else if (segonsRestants < DURADA_TEMPS) {
  missatgeTemporitzador.textContent = "Temporitzador en pausa.";
}

mostrarTemps();
