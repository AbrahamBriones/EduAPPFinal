//Funcion que detecta cuando se inicia y carga el hmtl "inicio"
$$(document).on('page:init', '.page[data-name="login"]', function (e) {

  $("#loginBtn").click(function (e) {

    var vrut = document.getElementById("rut").value;
    var vpassword = document.getElementById("password").value;

    if (vrut == "") {
      event.preventDefault();
      $('#loginBtn').attr("disabled");
      $('#input-rut').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
    }

    if (vpassword == "") {
      event.preventDefault();
      $('#loginBtn').attr("disabled");
      $('#input-password').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
    }

    if (($('#rut').val() != "") && ($('#password').val() != "") && rutvalido == true && passvalido == true) {
      $.ajax({
        type: "POST",
        url: 'http://127.0.0.1:8000/api/loginapp',
        data: { id: vrut, password: vpassword },
        success: function (data) {
          // console.log(data);
          if (data.success == false) {
            // $('#errorActual').html("Contraseña incorrecta");
            // $('#input-actual').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
          } else if (data.success == true) {
            console.log("exito")
            // $.ajax({
            //   type: "POST",
            //   url: 'http://127.0.0.1:8000/api/cambiarContrasenia',
            //   data: { id: id_usuario, password: vnueva },
            //   success: function (data) {
            //     // console.log(data);
            //     cambioConExito.open();
            //     app.router.navigate("/inicio/");
            //   },
            // });
          }
        },
      }).fail(function (jqXHR, textStatus, errorThrown) {
        if (errorThrown == "Bad Request") {
          intentardenuevo.dialog.alert("Parece que tus credenciales no coinciden con niguna cuenta existente", "No se encuentra la cuenta");
        }
        if (errorThrown == "Internal Server Error") {
          intentardenuevo.dialog.alert("Se produjo un error de red desconocido", "Error de conexión");
        }
      });
      return false;
    }



  });

  var validaRut;
  var passPattern = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
  var rutvalido = false;
  var passvalido = false;

  validaRut = $('#rut').rut({
    fn_error: function (input) {
      rutvalido = false;
      $('#input-rut').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
    }, fn_validado: function () {
      rutvalido = true;
      $('#input-rut').removeClass("item-input-with-value item-input-with-error-message item-input-invalid");
    }
  });

  $('#password').on('blur', function () {
    if (!checkInput($(this), passPattern)) {
      passvalido = false;
      $('#input-password').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
    } else {
      passvalido = true;
      $('#input-password').removeClass("item-input-with-value item-input-with-error-message item-input-invalid")
    }
  });

  // //valida que calze un input en base a un patron especificado
  function checkInput(idInput, pattern) {

    if ($(idInput).val().match(pattern)) {
      return true
    } else {

      return false
    }
  }

  $("#olvido-contraseña").click(function () {
    app.dialog.alert("Para recuperar su contraseña póngase en contacto con el administrador del software de su colegio.", "Recupera tu contraseña")
  });
})

