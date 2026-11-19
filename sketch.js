//Indico si la ciutat esta pausada
let ciutatPausada = false;
//Guardo velocitat general animació
let velocitatCiutat = 1;
//Llista on guardo cotxes
let cotxesDemo = [];
//Guardo moment q inicio ciutat
let iniciCiutat = 0;
//LListes núvols i persones
let nuvols = [];
let persones = [];

//Canvas de l'extensió
function setup() {
  //Canvas de 300pixels  x 175 pixels
  const canvas = createCanvas(300, 175);
  canvas.parent("ciutat");

  //Recupero el canvas dins del contenidor ciutat
  const velocitatGuardada = getItem("velocitatCiutat");

  //Si hi ha velocitat guardada la recupero
  if (velocitatGuardada !== null) {
    velocitatCiutat = Number(velocitatGuardada);
  }

  //Recupero l'estat de la pausa de la ciutat
const pausaGuardada = getItem("ciutatPausada");

//Si hi ha un valor guardat recupero si estava pausada
if (pausaGuardada !== null) {
  ciutatPausada = pausaGuardada;
}

//Actualitzo text del botó segons estat
document.getElementById("botoPausa").textContent =
  ciutatPausada ? "Continua" : "Pausa";

  //Creo els cotxes amb les posicions i velocitats
  for (let i = 0; i < 4; i++) {
    cotxesDemo.push({
      x: i * 90,
      velocitat: random(0.5, 1.5)
    });
  }

  //Creo quatre núvols amb posicions i velocitats
for (let i = 0; i < 4; i++) {
  nuvols.push({
    x: i * 100,
    y: 35 + random(15, 35),
    velocitat: random(0.2, 0.5)
  });
}

  //Creo sis persones distribuides pel carrer
  for (let i = 0; i < 6; i++) {
    persones.push({
      x: i * 55,
      y: 163,
      velocitat: random(0.3, 0.8)
    });
  }

  //Guardo moment inicial animació
  iniciCiutat = millis();
}

//Funció que s'executa continuament
function draw() {
  const ara = new Date();
  const hora = ara.getHours();

  //Canvio color del cel
  if (hora >= 8 && hora < 17) {
    background(110, 190, 235);
  } else if (hora >= 17 && hora < 20) {
    background(210, 140, 110);
  } else {
    background(15, 22, 50);
  }

  //Dibuixo estrelles a la nit
  if (hora >= 20 || hora < 6) {
    randomSeed(10);
    noStroke();
    fill(255);

    //Dibuixo 25 estrelles
    for (let i = 0; i < 25; i++) {
      circle(random(width), random(90), 2);
    }
  }

  //Dibuixo el sol o la lluna
  noStroke();

  if (hora >= 6 && hora < 20) {
    fill(255, 220, 100);
    circle(240, 35, 30);
  } else {
    fill(235, 235, 210);
    circle(240, 35, 25);
    fill(15, 22, 50);
    circle(249, 29, 25);
  }

  noStroke();

  for (let nuvol of nuvols) {
    //Els núvols només es mouen si no hi ha una pausa
    if (!ciutatPausada) {
      nuvol.x += nuvol.velocitat * velocitatCiutat;
    }

    //Quan surten de la pantalla, tornen a començar
    if (nuvol.x > width + 25) {
      nuvol.x = -35;
    }

    //Dibuixo el núvols amb cercles
    fill(255, 255, 255, 190);
    circle(nuvol.x, nuvol.y, 17);
    circle(nuvol.x + 10, nuvol.y - 5, 22);
    circle(nuvol.x + 23, nuvol.y, 16);
  }

  
  //Dibuixo els edificis amb alçades diferents
  for (let i = 0; i < 10; i++) {
    const ample = 30;
    const x = i * 31;
    const alt = 35 + ((i * 17) % 55);
    const y = 125 - alt;

    //Canvio el color dels edificis segons el moment del dia
    if (hora >= 8 && hora < 17) {
      fill(65, 75, 100);
    } else if (hora >= 17 && hora < 20) {
      fill(65, 48, 65);
    } else {
      fill(25, 30, 55);
    }

    noStroke();
    rect(x, y, ample - 2, alt);

    //Afegeixo finestres a cada edifici
    for (let yF = y + 7; yF < 120; yF += 12) {
      for (let xF = 0; xF < 3; xF++) {
        if (yF < 125) {
          if (hora >= 20 || hora < 6) {
            fill(255, 220, 110);
          } else {
            fill(220, 230, 240);
          }

          rect(x + 5 + xF * 8, yF, 4, 5);
        }
      }
    }
  }


  //Dibuixo el carrer
  noStroke();
  fill(35, 38, 48);
  rect(0, 125, 300, 50);

  //Dibuixo les línies de la carretera
  stroke(240, 220, 100);
  strokeWeight(2);

  for (let x = 0; x < 300; x += 40) {
    line(x, 150, x + 20, 150);
  }

  //Dibuixo i moc les persones pel carrer
  for (let persona of persones) {
    if (!ciutatPausada) {
      persona.x += persona.velocitat * velocitatCiutat;
    }

    //Quan surten per la dreta, tornen a l'esquerra
    if (persona.x > width + 10) {
      persona.x = -10;
    }

    //Cap
    noStroke();
    fill(255, 210, 170);
    circle(persona.x, persona.y - 12, 6);

    //Cos
    stroke(180, 210, 240);
    strokeWeight(2);
    line(persona.x, persona.y - 9, persona.x, persona.y);

    //Cames
    line(persona.x, persona.y, persona.x - 3, persona.y + 5);
    line(persona.x, persona.y, persona.x + 3, persona.y + 5);

    //Braços
    line(persona.x, persona.y - 7, persona.x - 4, persona.y - 3);
    line(persona.x, persona.y - 7, persona.x + 4, persona.y - 3);
  }


  //Moc els cotxes només si l'animació no està pausada
  if (!ciutatPausada) {
    for (let cotxe of cotxesDemo) {
      cotxe.x += cotxe.velocitat * velocitatCiutat;

      if (cotxe.x > 320) {
        cotxe.x = -40;
      }
    }
  }


  
  //Dibuixo el semàfor de la ciutat
  const faseSemafor = Math.floor(millis() / 1000) % 3;

  //Carcassa del semàfor
  noStroke();
  fill(25, 25, 30);
  rect(275, 88, 16, 38, 4);

  //Llum vermell: primer segon
  fill(faseSemafor === 0 ? color(255, 55, 55) : color(65, 65, 70));
  circle(283, 97, 8);

  //Llum groc: segon segon
  fill(faseSemafor === 1 ? color(255, 210, 60) : color(65, 65, 70));
  circle(283, 107, 8);

  //Llum verd: tercer segon
  fill(faseSemafor === 2 ? color(70, 230, 100) : color(65, 65, 70));
  circle(283, 117, 8);



  //Dibuixo els cotxes
  noStroke();

  for (let cotxe of cotxesDemo) {
    fill(200, 50, 50);
    rect(cotxe.x, 132, 28, 12, 3);

    fill(20);
    circle(cotxe.x + 6, 145, 7);
    circle(cotxe.x + 22, 145, 7);
  }

  //Mostro l'hora dins de la ciutat
  fill(255);
  textSize(10);
  textAlign(LEFT, TOP);
  text(nf(hora, 2) + ":" + nf(ara.getMinutes(), 2), 8, 8);

  //Indico visualment si l'animació està pausada
  if (ciutatPausada) {
    fill(255, 220, 100);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("ANIMACIÓ EN PAUSA", 150, 85);
  }
}

//Canvio la velocitat des del slider
function canviarVelocitat(novaVelocitat) {
  velocitatCiutat = novaVelocitat;
  storeItem("velocitatCiutat", velocitatCiutat);
}

//Pauso o reprenc els moviments
function canviarPausa() {
  ciutatPausada = !ciutatPausada;

  document.getElementById("botoPausa").textContent =
    ciutatPausada ? "Continua" : "Pausa";

  storeItem("ciutatPausada", ciutatPausada);
}

//Reinicio els moviments dels cotxes
function reiniciarCiutat() {
  ciutatPausada = false;

  document.getElementById("botoPausa").textContent = "Pausa";

  for (let i = 0; i < cotxesDemo.length; i++) {
    cotxesDemo[i].x = i * 90;
  }
}