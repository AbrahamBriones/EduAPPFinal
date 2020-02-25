//Funcion que detecta cuando se inicia y carga el hmtl "inicio"
$$(document).on('page:init', '.page[data-name="inicio"]', function (e) {

  $.getJSON('http://parra.chillan.ubiobio.cl:8075/abraham.briones1501/public/api/alumnosporapoderado/30', function (data) {
    //Si existen datos
    if (typeof data !== 'undefined' && data.length > 0) {
      // the array is defined and has at least one element
      $(".nombre-alumno").empty();
      html = '<input class="foto-alumno" type=image src='+imagenesserver+data[0].foto_alumno+'>';
      $("#foto-alumno").empty();
      $("#foto-alumno").append(html);
      html = '<p>' + data[0].nombre_alumno + '</p>';
      $(".nombre-alumno").empty();
      $(".nombre-alumno").append(html);
      html = data[0].curso;
      $(".curso").empty();
      $(".curso").append(html);
      localStorage.setItem("alumno", data[0].id);
    }
    // alert(localStorage.getItem("alumno"));
  })
    .done(function (response) {
      var foo = [];
      $.each(response, function (index, element) {
        foo.push({
          text: JSON.stringify(element.nombre_alumno).slice(1, -1),
          bold: true,
          icon: '<img src="'+imagenesserver+element.foto_alumno+'" width="30"/>',
          onClick: function () {
            // alert(element.id);
            // localStorage.setItem("alumno", element.id);
            // alert(localStorage.getItem("alumno"));
            html = '<input class="foto-alumno" type=image src="'+imagenesserver+element.foto_alumno+'">';
            $("#foto-alumno").empty();
            $("#foto-alumno").append(html);
            html = '<p>' + element.nombre_alumno + '</p>';
            $(".nombre-alumno").empty();
            $(".nombre-alumno").append(html);
            html = element.curso;
            $(".curso").empty();
            $(".curso").append(html);
            localStorage.setItem("alumno", element.id);
            //Limpiar Actividades del alumno anterior
            localStorage.setItem("info_actividades", null);
          }
        })
      });

      var ac3 = app.actions.create({
        buttons: [
          foo,
          [
            {
              text: 'Cambiar contraseña',
              // color: 'red',
              onClick: function (){
                app.router.navigate("/cambiarContraseña/");
              }
            },
            {
              text: 'Cerrar sesión',
              color: 'red',
              onClick: function () {
                localStorage.setItem("usuario", null);
                localStorage.setItem("alumno", null);
                localStorage.setItem("info_actividades", null);
                localStorage.setItem("jsonAlumno", null);
                app.router.navigate("/login/");
              }
            }
          ]
        ]
      });

      $$('.ac-3').on('click', function () {
        ac3.open();
      });


    }).fail(function () {
      html = '<p> Sin conexión, presione aquí para actualizar </p>';
      $(".nombre-alumno").empty();
      $(".nombre-alumno").append(html);
      $$('.ac-3').on('click', function () {
        app.router.navigate("/inicioAux/");
      });
    });

})

//Funcion que detecta cuando se inicia y carga el hmtl "inicioAux"
$$(document).on('page:init', '.page[data-name="inicioAux"]', function (e) {
  app.dialog.alert('Actualizado', 'EduAPP', function () {
    app.router.navigate("/inicio/");
  });
})


function cambiarContraseña (){
  alert("hola");
}
