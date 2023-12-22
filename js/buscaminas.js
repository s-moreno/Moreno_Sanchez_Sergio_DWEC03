/**
  DESARROLLO WEB EN ENTORNO CLIENTE (DWEC)
    UD03 - TAREA EVALUATIVA 01
    JUEGO DEL BUSCAMINAS
        SERGIO MORENO SANCHEZ (smoreno@birt.eus)
        22/12/2023


  FUNCIONES:
   * verificarCookieAcceso()
   * iniciarJuego(dificultad)
   * descubrirLoseta($loseta, dificultad)
   * pintarLosetaVacia($loseta, $grilla, dificultad)
   * asignarColorLoseta($loseta, minasAlrededor)
   * numeroMinasAlrededor($loseta, dificultad)
   * generarPosicionMinas(dificultad)
   * iniciarTiempo()
   * detenerTiempo()
   * comprobarFinjuegoBien(dificultad)
   * finjuego(dificultad, bien)
   * pintarContadores(minasDificultad)
   * pintarMensajeFin(mensaje)
   * pintarDificultad()
   * pintarGrilla(dificultad)
   */

"use strick";

$(document).ready(function () {

  /**************************
      Constantes y variables:
  ***************************/
  const dificultad = [
    { filas: 8, columnas: 8, minas: 10 },
    { filas: 16, columnas: 16, minas: 40 },
    { filas: 16, columnas: 30, minas: 99 },
  ];

  const $lienzo = $("#lienzo");
  const posicionMinas = [];
  let tiempo = 0;
  let juegoIniciado = false;
  let minas;
  let intervaloTiempo;

  /*********
      MAIN
  **********/

  verificarCookieAcceso();
  // desactivamos el menú del click derecho
  $(document).on("contextmenu", function (event) {
    event.preventDefault();
  });
  // mostrar en pantalla la selección de la dificultad del juego
  pintarDificultad();



  /*************
      FUNCIONES:
  **************/

  function verificarCookieAcceso() {
    if (document.cookie.indexOf('BuscaminasLogin=true') === -1) {
      //window.location.href = 'index.html';
      window.open("../index.html","_self"); // para que funcione en github pages
    }
  }

  /**
   * Función que pinta en pantalla todos los elementos del juego.
   * Controla los eventos del ratón dentro del juego
   */
  function iniciarJuego(dificultad) {

    generarPosicionMinas(dificultad);
    pintarContadores(dificultad.minas);
    pintarGrilla(dificultad);

    $(".loseta").on("click contextmenu", function (event) {
      // Iniciamos el tiempo al recibir el primer click
      if (!juegoIniciado) {
        iniciarTiempo();
        juegoIniciado = true;
      }
      // Eventos del click izquierdo
      if (event.type === "click") {
        descubrirLoseta($(this), dificultad);
        comprobarFinjuegoBien(dificultad);
        // Eventos del click derecho
      } else if (event.type === "contextmenu") {
        // pintar la mina
        if (minas > 0 && !$(this).hasClass("bandera")) {
          $(this).addClass("bandera"); // Agrega la clase 'bandera' a la loseta clicada
          minas--;
          $("#minas").text(minas);
          comprobarFinjuegoBien(dificultad);

          // borrar la mina
        } else if ($(this).hasClass("bandera")) {
          $(this).removeClass("bandera");
          minas++;
          $("#minas").text(minas);
        }
      }
    });
  }

  /**
   * Función que muestra al jugador lo que esconde
   * la loseta donde se ha clickado
   * (si la loseta tiene bandera, no hace nada)
   */
  function descubrirLoseta($loseta, dificultad) {
    // Control que la casilla no tiene bandera
    if (!$loseta.hasClass("bandera")) {
      // desactivamos el evento en la loseta
      $loseta.off("click contextmenu");
      $loseta.removeClass("loseta");
      // si hay una mina
      if ($loseta.hasClass("mina")) {
        $loseta.addClass("minaExplota");
        finjuego(dificultad,false);
      } else {
        const $grilla = $lienzo.find("#grilla");
        pintarLosetaVacia($loseta, $grilla, dificultad);
        
      }
    }
  }

  /**
   * Función que gestiona las losetas donde no hay minas escondidas.
   * Si la loseta tiene minas alrededor, pinta el número de minas que le rodean.
   * Si la loseta no tiene minas alrededor, recursivamente mirá sus losetas adyacentes.
   */
  function pintarLosetaVacia($loseta, $grilla, dificultad) {
    const fila = $loseta.data("fila");
    const columna = $loseta.data("col");

    const minasAlrededor = numeroMinasAlrededor($loseta, dificultad);
    if ($loseta.hasClass("loseta")) {
      $loseta.off("click contextmenu");
      $loseta.removeClass("loseta");
    }

    $loseta.addClass("vacio");

    if (minasAlrededor > 0) {
      $loseta.text(minasAlrededor);
      asignarColorLoseta($loseta, minasAlrededor);
    } else {
      // Comprobar las 8 losetas alrededor
      for (let f = fila - 1; f <= fila + 1; f++) {
        for (let c = columna - 1; c <= columna + 1; c++) {
          if (
            f >= 0 &&
            f < dificultad.filas &&
            c >= 0 &&
            c < dificultad.columnas &&
            !(f === fila && c === columna) &&
            $grilla.find(`#loseta_${f}_${c}`).hasClass("loseta") &&
            !$grilla.find(`#loseta_${f}_${c}`).hasClass("bandera")
          ) {
            const $losetaNueva = $grilla.find(`#loseta_${f}_${c}`);
            pintarLosetaVacia($losetaNueva, $grilla, dificultad);
          }
        }
      }
    }
  }

  /**
   * Función que según el número de minas adyacentes,
   * asigna un color específico a la loseta
   */
  function asignarColorLoseta($loseta, minasAlrededor) {
    switch (minasAlrededor) {
      case 1:
        $loseta.css({ color: "blue" });
        break;
      case 2:
        $loseta.css({ color: "coral" });
        break;
      case 3:
        $loseta.css({ color: "darkgreen" });
        break;
      case 4:
        $loseta.css({ color: "#FF0000" });
        break;
      case 5:
        $loseta.css({ color: "#800080" });
        break;
      case 6:
        $loseta.css({ color: "#0000FF" });
        break;
      case 7:
        $loseta.css({ color: "#006400" });
        break;
      case 8:
        $loseta.css({ color: "black" });
        break;
    }
  }

  /**
   * Función que devuelve el número de minas adyacentes a
   * a la loseta dada.
   */
  function numeroMinasAlrededor($loseta, dificultad) {
    let contador = 0;
    const fila = $loseta.data("fila");
    const columna = $loseta.data("col");

    // comprobar las 8 losetas del alrededor
    for (let f = fila - 1; f <= fila + 1; f++) {
      for (let c = columna - 1; c <= columna + 1; c++) {
        if (
          f >= 0 &&
          f < dificultad.filas &&
          c >= 0 &&
          c < dificultad.columnas &&
          !(f === fila && c === columna)
        ) {
          if (posicionMinas.includes(`${f}_${c}`)) {
            contador++;
          }
        }
      }
    }
    return contador;
  }

  /**
   * Función que genera aleatoriamente la situación
   * de las minas en la grilla del juego
   */
  function generarPosicionMinas(dificultad) {
    posicionMinas.length = 0;
    while (posicionMinas.length < dificultad.minas) {
      const fila = Math.floor(Math.random() * dificultad.filas);
      const columna = Math.floor(Math.random() * dificultad.columnas);
      const posicion = `${fila}_${columna}`;

      if (!posicionMinas.includes(posicion)) {
        posicionMinas.push(posicion);
      }
    }
    console.log(posicionMinas); // ver por consola la posición de las minas
  }

  
  /**
   * Función que inicia el contador de tiempo
   */
  function iniciarTiempo() {
    tiempo = 0;
    $("#tiempo").text(tiempo);
    intervaloTiempo = setInterval(function () {
      tiempo++;
      $("#tiempo").text(tiempo);
    }, 1000); // 1000 milisegundos = 1 segundo
  }

   /**
   * Función que detiene el contador de tiempo
   */
  function detenerTiempo() {
    clearInterval(intervaloTiempo);
    tiempo = 0;
    juegoIniciado = false;
  }

  /**
   * Función que comprueba el juego se ha finalizado
   * correctamente sin fallos
   */
  function comprobarFinjuegoBien(dificultad) {
    const $grilla = $lienzo.find("#grilla");
    const losetasSinBandera = $grilla.find(".loseta").not(".bandera")
    if (losetasSinBandera.length === 0 && minas === 0 && juegoIniciado) {
      // fin del juego sin fallos
      finjuego(dificultad, true)
    }
  }

  /**
   * Función que inicia la secuencia de fin de juego.
   * Muestra las losetas sin descrubir y su contenido.
   * Muestra el mensaje de fin de juego y el botón para
   * iniciar una nueva partida.
   */
  function finjuego(dificultad, bien) {
    const $grilla = $lienzo.find("#grilla");
    // parar el tiempo
    detenerTiempo();
    // enseñar lo que oculta cada loseta:
    for (let f = 0; f < dificultad.filas; f++) {
      for (let c = 0; c < dificultad.columnas; c++) {
        const $loseta = $grilla.find(`#loseta_${f}_${c}`);
        $loseta.off("click contextmenu");

        // Loseta con la bandera mal colocada:
        if ($loseta.hasClass("bandera") && !$loseta.hasClass("mina")) {
          $loseta.removeClass("bandera loseta");
          $loseta.addClass("minaError");

        // Loseta con la bandera bien colocada:
        } else if ($loseta.hasClass("bandera") && $loseta.hasClass("mina")) {
          $loseta.removeClass("mina");
          
        // Loseta con la mina sin descubrir:
        } else if (
          !$loseta.hasClass("bandera") &&
          $loseta.hasClass("mina") &&
          !$loseta.hasClass("minaExplota")
        ) {
          $loseta.removeClass("loseta mina");
          $loseta.addClass("minaBien");
        
        // Loseta sin mina;
        } else if (!$loseta.hasClass("minaExplota")) {
          let minasAlrededor = numeroMinasAlrededor($loseta, dificultad);
          $loseta.removeClass("loseta");
          $loseta.addClass("vacio");
          if (minasAlrededor > 0) {
            $loseta.text(minasAlrededor);
            asignarColorLoseta($loseta, minasAlrededor);
          }
        }
      }
    }
    // mostrar mensaje de fin de juego y boton volver a jugar
    if (bien) {
      pintarMensajeFin("¡Enhorabuena!");
    } else {
      pintarMensajeFin("¡Fallaste!");
    }
    
  }


  /**
   * Función que pinta en pantalla los contadores de tiempo y minas.
   */
  function pintarContadores(minasDificultad) {
    minas = minasDificultad;

    const $contadores = `<nav id="contadores" class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Tiempo</p>
          <p id="tiempo" class="title">${tiempo}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Minas</p>
          <p id="minas" class="title">${minas}</p>
      </div>
    </div>
    </nav>`;
    $lienzo.append($contadores);
  }

  /**
   * Función que pinta en pantalla un mensaje y el
   * botón para volver a jugar
   */
  function pintarMensajeFin(mensaje) {
    const $mensajefin = `<div id="mensajeFin" class="columns is-mobile is-centered mt-3">
      <div class="column is-half">
        <p class="title is-2 has-text-centered">${mensaje}</p>
        <p class="has-text-centered"> 
          <button id="btn-repetir" class="button is-medium is-link is-outlined has-text-centered">Volver a Jugar</button>
        </p>
      </div>
    </div>`;
    $lienzo.append($mensajefin);

    $("#btn-repetir").click(function () {
      // cargar selección de dificultad
      $lienzo.find("#contadores").remove();
      $lienzo.find("#grilla").remove();
      $lienzo.find("#mensajeFin").remove();
      pintarDificultad();
    });
  }

  /**
   * Función que pinta en pantalla los botones de dificultad a elegir
   * e inicia los eventos de click de sus botones.
   */
  function pintarDificultad() {
    const $dificultad = `
      <article id="dificultad" class="message is-info">
        <div class="message-header">
          <p>Selecciona la dificultad:</p>
        </div>
        <div class="message-body">
          <div class="buttons has-addons is-centered">
            <button id="btn-principiante" class="button is-medium is-link is-outlined">Principiante <i class="bi bi-wifi-1 ml-3"></i></button>
            <button id="btn-intermedio" class="button is-medium is-link is-outlined">Intermedio <i class="bi bi-wifi-2 ml-3"></i></button>
            <button id="btn-avanzado" class="button is-medium is-link is-outlined">Avanzado <i class="bi bi-wifi ml-3"></i></button>
          </div>
        </div>
      </article>
    `;
    $lienzo.append($dificultad);
    $("#btn-principiante").click(function () {
      $("#dificultad").remove();
      iniciarJuego(dificultad[0]);
    });
    $("#btn-intermedio").click(function () {
      $("#dificultad").remove();
      iniciarJuego(dificultad[1]);
    });
    $("#btn-avanzado").click(function () {
      $("#dificultad").remove();
      iniciarJuego(dificultad[2]);
    });
  }

  /**
   * Función que pinta en pantalla la grilla del juego según
   * la dificultad establecida por el jugador.
   */
  function pintarGrilla(dificultad) {
    const $grilla = $('<div id="grilla"></div>');
    $grilla.css({
      "grid-template-columns": `repeat(${dificultad.columnas}, 35px)`,
    });
    $lienzo.append($grilla);
    let contador = 1;
    for (let f = 0; f < dificultad.filas; f++) {
      for (let c = 0; c < dificultad.columnas; c++) {
        const $loseta = $("<div></div>").addClass("loseta");
        $loseta.attr("id", `loseta_${f}_${c}`);
        $loseta.attr("data-fila", f).attr("data-col", c);

        // agregar clase "mina" si existe una mina en esta loseta
        if (posicionMinas.includes(`${f}_${c}`)) {
          $loseta.addClass("mina");
        }

        // añadimos la loseta a la grilla
        $grilla.append($loseta);
        contador++;
      }
    }
  }
}); // fin jQuery
