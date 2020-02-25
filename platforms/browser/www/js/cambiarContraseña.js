//Funcion que detecta cuando se inicia y carga el hmtl "cambiarContraseña"
$$(document).on('page:init', '.page[data-name="cambiarContraseña"]', function (e) {

    var cambioConExito = app.toast.create({
        text: 'Contraseña actualizada con éxito',
        position: 'center',
        closeTimeout: 3000,
    });

    var passPattern = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    var actualvalido = false;
    var nuevavalido = false;
    var nuevarepvalido = false;
    var coinciden = false;

    $('#nueva,#nueva-rep').on('blur keyup', function () {
        if (!checkInput($(this), passPattern)) {
            if ($(this).attr("id") == 'nueva') {
                nuevavalido = false;
                $('#input-nueva').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
            } else {
                nuevarepvalido = false;
                $('#input-nueva-rep').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
            }
        } else {
            if ($(this).attr("id") == 'nueva') {
                nuevavalido = true;
                $('#input-nueva').removeClass("item-input-with-value item-input-with-error-message item-input-invalid");
            } else {
                nuevarepvalido = true;
                $('#input-nueva-rep').removeClass("item-input-with-value item-input-with-error-message item-input-invalid");
            }
        }
    });

    $('#nueva-rep').on('keyup', function () {

        if ($('#nueva').val() == $('#nueva-rep').val()) {
            // console.log('Las contraseñas coinciden');
            $("#mensaje-alerta").css("color", "#3b83bd");
            $("#mensaje-alerta").html("Las contraseñas coinciden");
            $('#mensaje-alerta').show();
            coinciden = true;
        } else {
            $("#mensaje-alerta").css("color", "#ff0000");
            $("#mensaje-alerta").html("Las contraseñas no coinciden");
            $('#mensaje-alerta').show();
            coinciden = false;
        }
    });

    $("#cambiar-contrasenia").click(function (e) {
        var vactual = document.getElementById("actual").value;
        var vnueva = document.getElementById("nueva").value;
        var vnuevarep = document.getElementById("nueva-rep").value;

        if (vactual == "") {
            event.preventDefault();
            actualvalido = false;
            $('#input-actual').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
        } else {
            actualvalido = true;
        }

        if (vnueva == "") {
            event.preventDefault();
            nuevavalido = false;
            $('#input-nueva').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
        }

        if (vnuevarep == "") {
            event.preventDefault();
            nuevarepvalido = false;
            $('#input-nueva-rep').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
        }

        // console.log(actualvalido, nuevavalido, nuevarepvalido, coinciden);
        if (actualvalido == true && nuevavalido == true && nuevarepvalido == true && coinciden == true) {
            var id_usuario = localStorage.getItem("usuario");
            $.ajax({
                type: "POST",
                url: 'http://127.0.0.1:8000/api/comprobarContrasenia',
                data: { id: id_usuario, password: vactual },
                success: function (data) {
                    // console.log(data);
                    if (data.success == false) {
                        $('#errorActual').html("Contraseña incorrecta");
                        $('#input-actual').addClass("item-input-with-value item-input-with-error-message item-input-invalid");
                    } else if (data.success == true) {
                        $.ajax({
                            type: "POST",
                            url: 'http://127.0.0.1:8000/api/cambiarContrasenia',
                            data: { id: id_usuario, password: vnueva },
                            success: function (data) {
                                // console.log(data);
                                cambioConExito.open();
                                app.router.navigate("/inicio/");
                            },
                        });
                    }
                },
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if (errorThrown == "Internal Server Error") {
                    intentardenuevo.dialog.alert("Se produjo un error de red desconocido", "Error de conexión");
                }
            });
        }
    });

    function checkInput(idInput, pattern) {
        if ($(idInput).val().match(pattern)) {
            return true
        } else {
            return false
        }
    }
});