/**
  DESARROLLO WEB EN ENTORNO CLIENTE (DWEC)
    UD03 - TAREA EVALUATIVA 01
    JUEGO DEL BUSCAMINAS
        SERGIO MORENO SANCHEZ (smoreno@birt.eus)
        22/12/2023
 */

"use strict";

/* Cargar jQuery */
$(document).ready(function () {
  /************
   * FUNCIONES:
   *************/

  /*
   * Función para parsear el json y añadirlo como string al localStorage
   */
  function jsonToLocalStorage() {
    $.getJSON("model/usuarios.json", function (data) {
      let jsonString = JSON.stringify(data);
      localStorage.setItem("usuarios", jsonString);
    });
  }

  /*
   * Función para validar la contraseña.
   * Comprueba que no se usan caracteres extaños.
   */
  function validarContraseina(pass) {
    const expRegValida = /^[A-Za-z1-9]+$/;
    const expRegEspecial =
      /[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\¿\@\[\\\]\^\_\`\{]+/g;
    const resultadoMatch = pass.match(expRegEspecial);

    if (!expRegValida.test(pass)) {
      $("#pass").removeClass("is-success");
      $("#pass").addClass("is-danger");
      $("#pass").after(
        `<p id="passError"class="help is-danger has-text-right">
          Utiliza caracteres alfanuméricos
        </p>`
      );
      if (resultadoMatch != null) {
        $("#passError").append(
          `<br>Los siguientes caracteres no son válidos: <span class="has-background-danger-light">${resultadoMatch}</span>`
        );
      }
      $("#notificacion p").remove();
      return false;
    }
    return true;
  }

  /**
   * Función que valida que el usuario y la contraseña sean correctos
   */
  function validarLogin(user, pass) {
    let coincidencia = false;
    // parseamos los usuarios del localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    // bucle buscando coincidencia de usuario y contraseña
    usuarios.forEach((element) => {
      if (element.usuario === user && element.contraseña === pass) {
        coincidencia = true;
      }
    });
    return coincidencia;
  }

  /*********************
   * GESTION DE EVENTOS:
   **********************/

  // MOSTRAR LA CONTRASEÑA
  $("#showPass").click(function () {
    const $contraseña = $("#pass");
    if ($contraseña.attr("type") === "password") {
      $contraseña.attr("type", "text");
      $(this).removeClass("bi-eye-fill").addClass("bi-eye-slash-fill");
    } else {
      $contraseña.attr("type", "password");
      $(this).removeClass("bi-eye-slash-fill").addClass("bi-eye-fill");
    }
  });

  // LOGIN
  $("#btn-login").click(function () {
    let usuario = $("#user").val();
    let contraseina = $("#pass").val();

    $("#passError").remove();

    if (validarContraseina(contraseina)) {
      if (validarLogin(usuario, contraseina)) {
        // window.location = "../juego.html";
        window.open("juego.html","_self"); // para que funcione en github pages.
      } else {
        $("#notificacion").html(
          `<p class="notification is-danger is-light has-text-centered">
              <i class="bi bi-exclamation-triangle-fill"></i> El usuario no está registrado
          </p>`
        );
        $("#user").val("");
        $("#pass").val("");
      }
    }
  });

  // INPUT "PASSWORD" FOCUS
  // AL entrar dentro del input, añade y elemina clases de estilo.
  $("#pass").on("focus", function () {
    $(this).removeClass("is-danger");
    $(this).addClass("is-success");
    $("#passError").remove();
  });

  /*******
   * MAIN:
   ********/
  jsonToLocalStorage();
}); // fin jQuery
