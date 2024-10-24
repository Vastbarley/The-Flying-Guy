let estadoJuego = "menu";
let puntaje = 0;
let jugador;
let monedas = [];
let obstaculos = [];
let proyectiles = [];

let imgJugador, imgMoneda, imgFondo, imgFondoMenu, imgFondoGanaste, imgFondoPerdiste, imgObstaculo, imgProyectil;
let upButton, downButton, fireButton; 
let moveUp = false;
let moveDown = false;

function preload() {
  imgJugador = loadImage('personaje principal.png');
  imgMoneda = loadImage('coin.png');
  imgFondo = loadImage('fondo de cielo.jpg');
  imgFondoMenu = loadImage('fondo de cielo.jpg');
  imgFondoGanaste = loadImage('fondo de ganaste.jpg');
  imgFondoPerdiste = loadImage('fondo de perdiste.jpg');
  imgObstaculo = loadImage('kriptonita.png');
  imgProyectil = loadImage('proyectil.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);  
  textSize(32);
  textAlign(CENTER, CENTER);
  jugador = crearJugador();

  
  upButton = createButton('Arriba');
  upButton.position(20, height - 140);
  upButton.size(100, 50);
  upButton.mousePressed(() => moveUp = true);
  upButton.mouseReleased(() => moveUp = false);

  downButton = createButton('Abajo');
  downButton.position(20, height - 70);
  downButton.size(100, 50);
  downButton.mousePressed(() => moveDown = true);
  downButton.mouseReleased(() => moveDown = false);

  fireButton = createButton('Disparo'); 
  fireButton.position(width - 120, height - 100); 
  fireButton.size(100, 50);
  fireButton.mousePressed(() => dispararProyectil());
}

function draw() {
  if (estadoJuego === "menu") {
    drawMenu();
  } else if (estadoJuego === "creditos") {
    drawCreditos();
  } else if (estadoJuego === "jugando") {
    drawJuego();
  } else if (estadoJuego === "ganaste") {
    drawPantallaGanaste();
  } else if (estadoJuego === "perdiste") {
    drawPantallaPerdiste();
  }

  
  if (moveUp && jugador.y > 0) {
    jugador.y -= 5;
  }
  if (moveDown && jugador.y < height - jugador.alto) {
    jugador.y += 5;
  }
}

function drawMenu() {
  background(imgFondoMenu);
  text("THE FLYING GUY", width / 2, height / 3);
  drawBoton("START", width / 2, height / 2 - 50);
  drawBoton("Créditos", width / 2, height / 2 + 50);
}

function drawCreditos() {
  background(imgFondoMenu);
  text("Créditos", width / 2, height / 2 - 100);
  text("Alejo Mariño y Genaro Monclus", width / 2, height / 2);
  drawBoton("Volver", width / 2, height / 2 + 100);
}

function drawBoton(etiqueta, x, y) {
  rectMode(CENTER);
  fill(200);
  rect(x, y, 200, 50);
  fill(0);
  text(etiqueta, x, y);
}

function mousePressed() {
  if (estadoJuego === "menu") {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
      if (mouseY > height / 2 - 75 && mouseY < height / 2 - 25) {
        reiniciarJuego();
        estadoJuego = "jugando";
      } else if (mouseY > height / 2 + 25 && mouseY < height / 2 + 75) {
        estadoJuego = "creditos";
      }
    }
  } else if (estadoJuego === "creditos") {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 50 && mouseY < height / 2 + 150) {
      estadoJuego = "menu";
    }
  } else if (estadoJuego === "perdiste" || estadoJuego === "ganaste") {
    reiniciarJuego();
    estadoJuego = "menu";
  }
}

function keyPressed() {
  if (key === ' ') {
    dispararProyectil();
  }
}

function dispararProyectil() {
  proyectiles.push(crearProyectilParabolico(jugador.x + jugador.ancho, jugador.y + jugador.alto / 2));
}

function drawJuego() {
  background(imgFondo);
  actualizarJugador(jugador);
  mostrarJugador(jugador);

  if (frameCount % 60 == 0) {
    monedas.push(crearMoneda());
    obstaculos.push(crearObstaculo());
  }

  for (let i = monedas.length - 1; i >= 0; i--) {
    actualizarMoneda(monedas[i]);
    mostrarMoneda(monedas[i]);

    if (colisionaConMoneda(jugador, monedas[i])) {
      puntaje++;
      monedas.splice(i, 1);
    }
  }

  for (let i = obstaculos.length - 1; i >= 0; i--) {
    actualizarObstaculo(obstaculos[i]);
    mostrarObstaculo(obstaculos[i]);

    if (colisionaConObstaculo(jugador, obstaculos[i])) {
      estadoJuego = "perdiste";
    }
  }

  for (let i = proyectiles.length - 1; i >= 0; i--) {
    let proyectil = proyectiles[i];
    
    actualizarProyectilParabolico(proyectil);
    mostrarProyectil(proyectil);

    for (let j = obstaculos.length - 1; j >= 0; j--) {
      if (colisionaProyectilConObstaculo(proyectil, obstaculos[j])) {
        obstaculos.splice(j, 1);
        proyectiles.splice(i, 1);
        break;
      }
    }
  }

  if (puntaje >= 20) { 
    estadoJuego = "ganaste";
  }

  text(`Puntaje: ${puntaje}`, width - 100, 50);
}

function drawPantallaGanaste() {
  background(imgFondoGanaste);
  drawBoton("Play Again", width / 2, height / 2 + 50);
}

function drawPantallaPerdiste() {
  background(imgFondoPerdiste);
  drawBoton("Try Again", width / 2, height / 2 + 50);
}

function reiniciarJuego() {
  puntaje = 0;
  monedas = [];
  obstaculos = [];
  proyectiles = [];
  jugador.y = height / 2;
  frameCount = 0; 
}

function crearJugador() {
  return {
    x: 100,
    y: height / 2,
    ancho: 1079 / 6,
    alto: 393 / 6,
    offsetColisionX: 10,
    offsetColisionY: 10,
    anchoColision: 1079 / 6 - 20,
    altoColision: 393 / 6 - 20
  };
}

function actualizarJugador(jugador) {
  if (keyIsDown(UP_ARROW)) {
    jugador.y -= 5;
  }
  if (keyIsDown(DOWN_ARROW)) {
    jugador.y += 5;
  }
  jugador.y = constrain(jugador.y, 0, height - jugador.alto);
}

function mostrarJugador(jugador) {
  image(imgJugador, jugador.x, jugador.y, jugador.ancho, jugador.alto);
}

function colisionaConMoneda(jugador, moneda) {
  return collideRectRect(
    jugador.x + jugador.offsetColisionX, jugador.y + jugador.offsetColisionY, jugador.anchoColision, jugador.altoColision,
    moneda.x, moneda.y, moneda.tamaño, moneda.tamaño
  );
}

function colisionaConObstaculo(jugador, obstaculo) {
  return collideRectRect(
    jugador.x + jugador.offsetColisionX, jugador.y + jugador.offsetColisionY, jugador.anchoColision, jugador.altoColision,
    obstaculo.x, obstaculo.y, obstaculo.tamaño, obstaculo.tamaño
  );
}

function crearMoneda() {
  return {
    x: width,
    y: random(height),
    tamaño: 25
  };
}

function actualizarMoneda(moneda) {
  moneda.x -= 5;
}

function mostrarMoneda(moneda) {
  image(imgMoneda, moneda.x, moneda.y, moneda.tamaño, moneda.tamaño);
}

function crearObstaculo() {
  return {
    x: width,
    y: random(height),
    tamaño: 50
  };
}

function actualizarObstaculo(obstaculo) {
  obstaculo.x -= 7;
}

function mostrarObstaculo(obstaculo) {
  image(imgObstaculo, obstaculo.x, obstaculo.y, obstaculo.tamaño, obstaculo.tamaño);
}

function crearProyectilParabolico(x, y) {
  return {
    x: x,
    y: y,
    velocidadX: 7, 
    velocidadY: -10, 
    gravedad: 0.5, 
    tamaño: 20
  };
}

function actualizarProyectilParabolico(proyectil) {
  proyectil.x += proyectil.velocidadX;
  proyectil.y += proyectil.velocidadY;
  proyectil.velocidadY += proyectil.gravedad; 
}

function mostrarProyectil(proyectil) {
  image(imgProyectil, proyectil.x, proyectil.y, proyectil.tamaño, proyectil.tamaño);
}

function colisionaProyectilConObstaculo(proyectil, obstaculo) {
  return collideRectRect(
    proyectil.x, proyectil.y, proyectil.tamaño, proyectil.tamaño,
    obstaculo.x, obstaculo.y, obstaculo.tamaño, obstaculo.tamaño
  );
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}



